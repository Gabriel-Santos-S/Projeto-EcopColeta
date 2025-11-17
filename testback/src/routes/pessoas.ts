import express from 'express';
import * as mysql from 'mysql2';
import db from '../config/database';
import redis from '../redis';
import { Pessoa, ApiResponse } from '../types';

const router = express.Router();
const safe = (value: any) => value ?? null;

// GET - Listar todas as pessoas
router.get('/', async (req, res: express.Response<ApiResponse<Pessoa[]>>) => {
  try {
    const [rows] = await db.execute('SELECT * FROM pessoa');
    const pessoas = rows as Pessoa[];

    res.json({
      success: true,
      data: pessoas
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// GET - Buscar pessoa por CPF
router.get('/:cpf', async (req, res: express.Response<ApiResponse<Pessoa>>) => {
  try {
    const cpf = req.params.cpf;

    // 1. Tenta pegar do Redis
    const cachedData = await redis.get(`pessoa:${cpf}`);

    if (cachedData) {
      console.log('🔵 Cache HIT (Redis)');

      return res.json({
        success: true,
        data: JSON.parse(cachedData)
      });
    }

    console.log('🟠 Cache MISS → consultando MySQL');

    // 2. Consulta no MySQL
    const [rows] = await db.execute('SELECT * FROM pessoa WHERE cpf = ?', [cpf]);
    const pessoas = rows as Pessoa[];

    if (pessoas.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Pessoa não encontrada'
      });
    }

    const pessoa = pessoas[0];

    // 3. Salvar no Redis (com expiração)
    await redis.set(`pessoa:${cpf}`, JSON.stringify(pessoa), {
      EX: 60 * 5 // cache de 5 minutos
    });

    res.json({
      success: true,
      data: pessoa
    });

  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// POST - Criar nova pessoa
router.post('/cadastra', async (req, res: express.Response<ApiResponse<{ cpf: string }>>) => {
  try {
    const pessoa: Pessoa = req.body;

    const [result] = await db.execute(
      `INSERT INTO pessoa (cpf, nome, endereco_rua, endereco_numero, endereco_bairro, endereco_cidade, endereco_uf, data_nascimento, telefone, email) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        pessoa.cpf, pessoa.nome, safe(pessoa.endereco_rua), safe(pessoa.endereco_numero),
        safe(pessoa.endereco_bairro), safe(pessoa.endereco_cidade), safe(pessoa.endereco_uf),
        pessoa.data_nascimento, safe(pessoa.telefone), safe(pessoa.email)
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Pessoa criada com sucesso',
      data: { cpf: pessoa.cpf }
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});


// PUT/PATCH - Atualizar pessoa
router.patch('/:cpf', async (req, res: express.Response<ApiResponse>) => {
  try {
    const pessoa: Partial<Pessoa> = req.body;

    if (Object.keys(pessoa).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Nenhum campo enviado para atualização'
      });
    }

    const fields = [];
    const values = [];

    const allowedFields = ['nome', 'email', 'idade', 'endereco_numero'];

    for (const [key] of Object.entries(pessoa)) {
      if (!allowedFields.includes(key)) {
        return res.status(400).json({
          success: false,
          error: `Campo não permitido: ${key}`
        });
      }
    }

    for (const [key, value] of Object.entries(pessoa)) {
      fields.push(`${key} = ?`);
      values.push(value ?? null);
    }

    values.push(req.params.cpf);

    const sql = `UPDATE pessoa SET ${fields.join(', ')} WHERE cpf = ?`;

    const [result] = await db.execute(sql, values);
    const affected = (result as mysql.ResultSetHeader).affectedRows;

    if (affected === 0) {
      return res.status(404).json({
        success: false,
        error: 'Pessoa não encontrada'
      });
    }

    // 🔥 INVALIDA CACHE
    await redis.del(`pessoa:${req.params.cpf}`);

    res.json({
      success: true,
      message: 'Pessoa atualizada com sucesso'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: (error as Error).message
    });
  }
});


// DELETE - Deletar pessoa
router.delete('/:cpf', async (req, res: express.Response<ApiResponse>) => {
  try {
    const [result] = await db.execute('DELETE FROM pessoa WHERE cpf = ?', [req.params.cpf]);
    const affectedRows = (result as mysql.ResultSetHeader).affectedRows;

    if (affectedRows === 0) {
      return res.status(404).json({
        success: false,
        error: 'Pessoa não encontrada'
      });
    }

    // 🔥 INVALIDA CACHE
    await redis.del(`pessoa:${req.params.cpf}`);

    res.json({
      success: true,
      message: 'Pessoa deletada com sucesso'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: (error as Error).message
    });
  }
});


export default router;