import express from 'express';
import * as mysql from 'mysql2';
import db from '../config/database';
import redis from '../redis';
import { ApiResponse, PontoColeta } from '../types';

const router = express.Router();
const safe = (value: any) => value ?? null;

// GET - Listar todos os pontos de coleta
router.get('/', async (req, res: express.Response<ApiResponse<PontoColeta[]>>) => {
    try {
        const [rows] = await db.execute('SELECT * FROM ponto_coleta');
        const pontoColeta = rows as PontoColeta[];

        res.json({
            success: true,
            data: pontoColeta
        });
    } catch (error) {
        const err = error as Error;
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

// GET - Buscar ponto de coleta pelo ID
router.get('/:id', async (req, res: express.Response<ApiResponse<PontoColeta>>) => {
    try {
        const id_ponto = req.params.id;

        // 1. Tenta pegar do Redis
        const cachedData = await redis.get(`ponto-coleta:${id_ponto}`);

        if (cachedData) {
            console.log('🔵 Cache HIT (Redis)');

            return res.json({
                success: true,
                data: JSON.parse(cachedData)
            });
        }

        console.log('🟠 Cache MISS → consultando MySQL');

        // 2. Consulta no MySQL
        const [rows] = await db.execute('SELECT * FROM ponto_coleta WHERE id_ponto = ?', [id_ponto]);
        const pontos_coleta_result = rows as PontoColeta[];

        if (pontos_coleta_result.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Ponto de coleta não encontrado'
            });
        }

        const ponto_coleta = pontos_coleta_result[0];

        // 3. Salvar no Redis (com expiração)
        await redis.set(`ponto-coleta:${id_ponto}`, JSON.stringify(ponto_coleta), {
            EX: 60 * 5 // cache de 5 minutos
        });

        res.json({
            success: true,
            data: ponto_coleta
        });

    } catch (error) {
        const err = error as Error;
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

// POST - Criar novo ponto de coleta
router.post('/cadastra', async (req, res: express.Response<ApiResponse>) => {
    try {
        const { localizacao, capacidade, tipo } = req.body;

        if (!localizacao || !tipo) {
            return res.status(400).json({
                success: false,
                message: "Campos obrigatórios: localizacao, tipo"
            });
        }

        // Chamada da procedure
        const [result] = await db.execute(
            `CALL cadastrar_ponto_com_tipo(?, ?, ?)`,
            [localizacao, capacidade || null, tipo]
        );

        res.status(201).json({
            success: true,
            message: 'Ponto de coleta criado com sucesso',
            data: {
                localizacao,
                capacidade,
                tipo
            }
        });

    } catch (error) {
        const err = error as Error;
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});



// PUT/PATCH - Atualizar ponto de coleta
router.patch('/atualizar/:id', async (req, res: express.Response<ApiResponse>) => {
    try {
        const ponto_coleta: Partial<PontoColeta> = req.body;

        if (Object.keys(ponto_coleta).length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Nenhum campo enviado para atualização'
            });
        }

        const fields = [];
        const values = [];

        const allowedFields = ['localizacao', 'capacidade'];

        for (const [key] of Object.entries(ponto_coleta)) {
            if (!allowedFields.includes(key)) {
                return res.status(400).json({
                    success: false,
                    error: `Campo não permitido: ${key}`
                });
            }
        }

        for (const [key, value] of Object.entries(ponto_coleta)) {
            fields.push(`${key} = ?`);
            values.push(value ?? null);
        }

        values.push(req.params.id);

        const sql = `UPDATE ponto_coleta SET ${fields.join(', ')} WHERE id_ponto = ?`;

        const [result] = await db.execute(sql, values);
        const affected = (result as mysql.ResultSetHeader).affectedRows;

        if (affected === 0) {
            return res.status(404).json({
                success: false,
                error: 'Ponto  de coleta não encontrado'
            });
        }

        // 🔥 INVALIDA CACHE
        await redis.del(`ponto-coleta:${req.params.id}`);

        res.json({
            success: true,
            message: 'Ponto de coleta atualizada com sucesso'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: (error as Error).message
        });
    }
});


// DELETE - Deletar ponto de coleta
router.delete('/remover/:id', async (req, res: express.Response<ApiResponse>) => {
    try {
        const [result] = await db.execute('DELETE FROM ponto_coleta WHERE id_ponto = ?', [req.params.id]);
        const affectedRows = (result as mysql.ResultSetHeader).affectedRows;

        if (affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: 'ponto de coleta não encontrado'
            });
        }

        // 🔥 INVALIDA CACHE
        await redis.del(`ponto-coleta:${req.params.id}`);

        res.json({
            success: true,
            message: 'Ponto de coleta deletado com sucesso'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: (error as Error).message
        });
    }
});


export default router;