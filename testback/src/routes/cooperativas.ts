import express from 'express';
import * as mysql from 'mysql2';
import db from '../config/database';
import redis from '../redis';
import { Pessoa, ApiResponse, Cooperativa } from '../types';

const router = express.Router();

// GET - Listar todas as cooprativas
router.get('/', async (req, res: express.Response<ApiResponse<Cooperativa[]>>) => {
    try {
        const [rows] = await db.execute('SELECT * FROM cooperativa');
        const cooperativa = rows as Cooperativa[];

        res.json({
            success: true,
            data: cooperativa
        });
    } catch (error) {
        const err = error as Error;
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

// GET - Buscar pessoa por id
router.get('/:id', async (req, res: express.Response<ApiResponse<Cooperativa>>) => {
    try {
        const id_coop = req.params.id;

        // 1. Tenta pegar do Redis
        const cachedData = await redis.get(`cooperativa:${id_coop}`);

        if (cachedData) {
            console.log('🔵 Cache HIT (Redis)');

            return res.json({
                success: true,
                data: JSON.parse(cachedData)
            });
        }

        console.log('🟠 Cache MISS → consultando MySQL');

        // 2. Consulta no MySQL
        const [rows] = await db.execute('SELECT * FROM cooperativa WHERE id_coop = ?', [id_coop]);
        const cooperativas = rows as Cooperativa[];

        if (cooperativas.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Cooperativa não encontrada'
            });
        }

        const cooperativa = cooperativas[0];

        // 3. Salvar no Redis (com expiração)
        await redis.set(`cooperativa:${id_coop}`, JSON.stringify(cooperativa), {
            EX: 60 * 5 // cache de 5 minutos
        });

        res.json({
            success: true,
            data: cooperativa
        });

    } catch (error) {
        const err = error as Error;
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

// POST - Criar nova cooperativa
router.post('/cadastra', async (req, res: express.Response<ApiResponse>) => {
    try {
        const cooperativa: Cooperativa = req.body;

        const [result] = await db.execute(
            `INSERT INTO cooperativa (nome, endereco_rua, endereco_numero, endereco_bairro, endereco_cidade, endereco_uf, capacidade_processamento) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [cooperativa.nome, cooperativa.endereco_rua, cooperativa.endereco_numero,
            cooperativa.endereco_bairro, cooperativa.endereco_cidade, cooperativa.endereco_uf,
            cooperativa.capacidade_processamento]
        );

        res.status(201).json({
            success: true,
            message: 'Cooperativa criada com sucesso',
        });
    } catch (error) {
        const err = error as Error;
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});


// PUT/PATCH - Atualizar cooperativa
router.patch('/:id', async (req, res: express.Response<ApiResponse>) => {
    try {
        const cooperativa: Partial<Cooperativa> = req.body;

        if (Object.keys(cooperativa).length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Nenhum campo enviado para atualização'
            });
        }

        const fields = [];
        const values = [];

        const allowedFields = [
            'nome', 'endereco_rua', 'endereco_numero', 'endereco_bairro',
            'endereco_cidade', 'endereco_uf', 'capacidade_processamento'
        ];

        for (const [key] of Object.entries(cooperativa)) {
            if (!allowedFields.includes(key)) {
                return res.status(400).json({
                    success: false,
                    error: `Campo não permitido: ${key}`
                });
            }
        }

        for (const [key, value] of Object.entries(cooperativa)) {
            fields.push(`${key} = ?`);
            values.push(value ?? null);
        }

        values.push(req.params.id);

        const sql = `UPDATE cooperativa SET ${fields.join(', ')} WHERE id_coop = ?`;

        const [result] = await db.execute(sql, values);
        const affected = (result as mysql.ResultSetHeader).affectedRows;

        if (affected === 0) {
            return res.status(404).json({
                success: false,
                error: 'Cooperativa não encontrada'
            });
        }

        // 🔥 INVALIDA CACHE
        await redis.del(`cooperativa:${req.params.id}`);

        res.json({
            success: true,
            message: 'Cooperativa atualizada com sucesso'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: (error as Error).message
        });
    }
});


// DELETE - Deletar cooperativa
router.delete('/remover/:id', async (req, res: express.Response<ApiResponse>) => {
    try {
        const [result] = await db.execute('DELETE FROM cooperativa WHERE id_coop = ?', [req.params.id]);
        const affectedRows = (result as mysql.ResultSetHeader).affectedRows;

        if (affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: 'Cooperativa não encontrada'
            });
        }

        // 🔥 INVALIDA CACHE
        await redis.del(`pessoa:${req.params.id}`);

        res.json({
            success: true,
            message: 'Cooperativa deletada com sucesso'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: (error as Error).message
        });
    }
});


export default router;