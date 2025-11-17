import express from 'express';
import * as mysql from 'mysql2';
import db from '../config/database';
import redis from '../redis';
import { Pessoa, ApiResponse, Residuo } from '../types';

const router = express.Router();
const safe = (value: any) => value ?? null;

// GET - Listar todos os residuos
router.get('/', async (req, res: express.Response<ApiResponse<Residuo[]>>) => {
    try {
        const [rows] = await db.execute('SELECT * FROM residuo');
        const residuos = rows as Residuo[];

        res.json({
            success: true,
            data: residuos
        });
    } catch (error) {
        const err = error as Error;
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

// GET - Buscar residuo por ID
router.get('/:id', async (req, res: express.Response<ApiResponse<Residuo>>) => {
    try {
        const id = req.params.id;

        // 1. Tenta pegar do Redis
        const cachedData = await redis.get(`residuo:${id}`);

        if (cachedData) {
            console.log('🔵 Cache HIT (Redis)');

            return res.json({
                success: true,
                data: JSON.parse(cachedData)
            });
        }

        console.log('🟠 Cache MISS → consultando MySQL');

        // 2. Consulta no MySQL
        const [rows] = await db.execute('SELECT * FROM residuo WHERE id_residuo = ?', [id]);
        const residuos = rows as Residuo[];

        if (residuos.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Residuo não encontrada'
            });
        }

        const residuo = residuos[0];

        // 3. Salvar no Redis (com expiração)
        await redis.set(`residuo:${id}`, JSON.stringify(residuo), {
            EX: 60 * 5 // cache de 5 minutos
        });

        res.json({
            success: true,
            data: residuo
        });

    } catch (error) {
        const err = error as Error;
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

// POST - Criar um novo residuo
router.post('/registrar', async (req, res: express.Response<ApiResponse>) => {
    try {
        const {
            id_tipo,
            peso,
            id_coop,
            cnpj_empresa,
            id_coleta,
            peso_coletado
        } = req.body;

        // validação básica
        if (!id_tipo || !peso || !id_coleta) {
            return res.status(400).json({
                success: false,
                message: 'Campos obrigatórios: id_tipo, peso, id_coleta'
            });
        }

        // chama a procedure
        await db.execute(
            `CALL cadastrar_residuo_e_finalizar_coleta(?, ?, ?, ?, ?, ?)`,
            [
                id_tipo,
                peso,
                id_coop || null,
                cnpj_empresa || null,
                id_coleta,
                peso_coletado || peso
            ]
        );

        res.status(201).json({
            success: true,
            message: 'Resíduo cadastrado e coleta concluída com sucesso'
        });

    } catch (error) {
        const err = error as Error;
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});


// PUT/PATCH - Atualizar residuo
router.patch('/atualizar/:id', async (req, res: express.Response<ApiResponse>) => {
    try {
        const residuo: Partial<Pessoa> = req.body;

        if (Object.keys(residuo).length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Nenhum campo enviado para atualização'
            });
        }

        const fields = [];
        const values = [];

        const allowedFields = ['id_tipo', 'peso', 'id_coop', 'cnpj_empresa'];

        for (const [key] of Object.entries(residuo)) {
            if (!allowedFields.includes(key)) {
                return res.status(400).json({
                    success: false,
                    error: `Campo não permitido: ${key}`
                });
            }
        }

        for (const [key, value] of Object.entries(residuo)) {
            fields.push(`${key} = ?`);
            values.push(value ?? null);
        }

        values.push(req.params.id);

        const sql = `UPDATE residuo SET ${fields.join(', ')} WHERE id_residuo = ?`;

        const [result] = await db.execute(sql, values);
        const affected = (result as mysql.ResultSetHeader).affectedRows;

        if (affected === 0) {
            return res.status(404).json({
                success: false,
                error: 'Residuo não encontrada'
            });
        }

        // 🔥 INVALIDA CACHE
        await redis.del(`residuo:${req.params.id}`);

        res.json({
            success: true,
            message: 'Residuo atualizada com sucesso'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: (error as Error).message
        });
    }
});


// DELETE - Deletar residuo
router.delete('/remover/:id', async (req, res: express.Response<ApiResponse>) => {
    try {
        const [result] = await db.execute('DELETE FROM residuo WHERE id_residuo = ?', [req.params.id]);
        const affectedRows = (result as mysql.ResultSetHeader).affectedRows;

        if (affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: 'Residuo não encontrado'
            });
        }

        // 🔥 INVALIDA CACHE
        await redis.del(`residuo:${req.params.id}`);

        res.json({
            success: true,
            message: 'Residuo deletada com sucesso'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: (error as Error).message
        });
    }
});


export default router;