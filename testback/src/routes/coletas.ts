import express from 'express';
import * as mysql from 'mysql2';
import db from '../config/database';
import redis from '../redis';
import { ApiResponse, Coleta, ColetaResiduoJuntos } from '../types';
import { isoToMySQL } from '../controlerDate';

const router = express.Router();
const safe = (value: any) => value ?? null;

// GET - Listar todas as coletas
router.get('/', async (req, res: express.Response<ApiResponse<Coleta[]>>) => {
    try {
        const [rows] = await db.execute('SELECT * FROM coleta');
        const coletas = rows as Coleta[];

        res.json({
            success: true,
            data: coletas
        });
    } catch (error) {
        const err = error as Error;
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

// GET - Buscar coleta por ID
router.get('/:id', async (req, res: express.Response<ApiResponse<Coleta>>) => {
    try {
        const id_coleta = req.params.id;

        // 1. Tenta pegar do Redis
        const cachedData = await redis.get(`coleta:${id_coleta}`);

        if (cachedData) {
            console.log('🔵 Cache HIT (Redis)');

            return res.json({
                success: true,
                data: JSON.parse(cachedData)
            });
        }

        console.log('🟠 Cache MISS → consultando MySQL');

        // 2. Consulta no MySQL
        const [rows] = await db.execute('SELECT * FROM coleta WHERE id_coleta = ?', [id_coleta]);
        const coletas = rows as Coleta[];

        if (coletas.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Coleta não encontrada'
            });
        }

        const coleta = coletas[0];

        // 3. Salvar no Redis (com expiração)
        await redis.set(`coleta:${id_coleta}`, JSON.stringify(coleta), {
            EX: 60 * 5 // cache de 5 minutos
        });

        res.json({
            success: true,
            data: coleta
        });

    } catch (error) {
        const err = error as Error;
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

// POST - Criar nova Coleta OBS: esta sendo criado coletas
router.post('/coleta-cadastro', async (req, res: express.Response<ApiResponse<{ status: string }>>) => {
    try {
        const coleta: Coleta = req.body;
        const dataConvertida = isoToMySQL(coleta.data);

        const [result] = await db.execute(
            `INSERT INTO coleta ( data, status, cpf, id_ponto) 
       VALUES ( ?, ?, ?, ?)`,
            [dataConvertida, "agendada", coleta.cpf, coleta.id_ponto]
        );

        res.status(201).json({
            success: true,
            message: 'Coleta criada com sucesso',
        });
    } catch (error) {
        const err = error as Error;
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});


// PUT/PATCH - Atualizar coleta
router.patch('/atualizar/:id', async (req, res: express.Response<ApiResponse>) => {
    try {
        const coleta: Partial<Coleta> = req.body;

        if (Object.keys(coleta).length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Nenhum campo enviado para atualização'
            });
        }

        const fields = [];
        const values = [];

        // Campos não permitido de modificação
        const allowedFields = ['data', 'status'];

        for (const [key] of Object.entries(coleta)) {
            if (!allowedFields.includes(key)) {
                return res.status(400).json({
                    success: false,
                    error: `Campo não permitido: ${key}`
                });
            }
        }

        for (const [key, value] of Object.entries(coleta)) {
            fields.push(`${key} = ?`);
            values.push(value ?? null);
        }

        values.push(req.params.id);

        const sql = `UPDATE coleta SET ${fields.join(', ')} WHERE id_coleta = ?`;

        const [result] = await db.execute(sql, values);
        const affected = (result as mysql.ResultSetHeader).affectedRows;

        if (affected === 0) {
            return res.status(404).json({
                success: false,
                error: 'Coleta não encontrada'
            });
        }

        // 🔥 INVALIDA CACHE
        await redis.del(`coleta:${req.params.id}`);

        res.json({
            success: true,
            message: 'Coleta atualizada com sucesso'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: (error as Error).message
        });
    }
});


// DELETE - Deletar coleta
router.delete('/remove/:id', async (req, res: express.Response<ApiResponse>) => {
    try {
        const [result] = await db.execute('DELETE FROM coleta WHERE id_coleta = ?', [req.params.id]);
        const affectedRows = (result as mysql.ResultSetHeader).affectedRows;

        if (affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: 'Coleta não encontrada'
            });
        }

        // 🔥 INVALIDA CACHE
        await redis.del(`coleta:${req.params.id}`);

        res.json({
            success: true,
            message: 'Coleta deletada com sucesso'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: (error as Error).message
        });
    }
});


// Rotas +



// Opção alternativa - rota mais descritiva
router.get('/coletas-residuos/:cpf', async (req, res: express.Response<ApiResponse<ColetaResiduoJuntos[]>>) => {
    try {
        const cpf = req.params.cpf;

        const [rows] = await db.execute(
            'SELECT * FROM view_coletas_pessoa WHERE cpf = ? ORDER BY data DESC',
            [cpf]
        );

        const coletas = rows as ColetaResiduoJuntos[];

        res.json({
            success: true,
            data: coletas
        });
    } catch (error) {
        const err = error as Error;
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});


export default router;