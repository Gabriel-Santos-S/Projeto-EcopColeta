import express from 'express';
import * as mysql from 'mysql2';
import db from '../config/database';
import redis from '../redis';
import { ApiResponse, Empresa } from '../types';

const router = express.Router();
const safe = (value: any) => value ?? null;

// GET - Listar todas as empresas
router.get('/', async (req, res: express.Response<ApiResponse<Empresa[]>>) => {
    try {
        const [rows] = await db.execute('SELECT * FROM empresa');
        const empresas = rows as Empresa[];

        res.json({
            success: true,
            data: empresas
        });
    } catch (error) {
        const err = error as Error;
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

// GET - Buscar empresa por cnpj
router.get('/:cnpj', async (req, res: express.Response<ApiResponse<Empresa>>) => {
    try {
        const id_empresa = req.params.cnpj;

        // 1. Tenta pegar do Redis
        const cachedData = await redis.get(`empresa:${id_empresa}`);

        if (cachedData) {
            console.log('🔵 Cache HIT (Redis)');

            return res.json({
                success: true,
                data: JSON.parse(cachedData)
            });
        }

        console.log('🟠 Cache MISS → consultando MySQL');

        // 2. Consulta no MySQL
        const [rows] = await db.execute('SELECT * FROM empresa WHERE cnpj = ?', [id_empresa]);
        const empresas = rows as Empresa[];

        if (empresas.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Emperesa não encontrada'
            });
        }

        const empresa = empresas[0];

        // 3. Salvar no Redis (com expiração)
        await redis.set(`empresa:${id_empresa}`, JSON.stringify(empresa), {
            EX: 60 * 5 // cache de 5 minutos
        });

        res.json({
            success: true,
            data: empresa
        });

    } catch (error) {
        const err = error as Error;
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

// POST - Criar empresa
router.post('/cadastra', async (req, res: express.Response<ApiResponse>) => {
    try {
        const empresa: Empresa = req.body;

        const [result] = await db.execute(
            `INSERT INTO empresa (cnpj, razao_social, area_atuacao) VALUES (?, ?, ?)`,
            [empresa.cnpj, empresa.razao_social, empresa.area_atuacao]
        );

        res.status(201).json({
            success: true,
            message: 'Empresa criada com sucesso',
        });
    } catch (error) {
        const err = error as Error;
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});


// PUT/PATCH - Atualizar empresa
router.patch('/atualizar/:cnpj', async (req, res: express.Response<ApiResponse>) => {
    try {
        const empresa: Partial<Empresa> = req.body;

        if (Object.keys(empresa).length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Nenhum campo enviado para atualização'
            });
        }

        const fields = [];
        const values = [];

        const allowedFields = ['razao_social', 'area_atuacao'];

        for (const [key] of Object.entries(empresa)) {
            if (!allowedFields.includes(key)) {
                return res.status(400).json({
                    success: false,
                    error: `Campo não permitido: ${key}`
                });
            }
        }

        for (const [key, value] of Object.entries(empresa)) {
            fields.push(`${key} = ?`);
            values.push(value ?? null);
        }

        values.push(req.params.cnpj);

        const sql = `UPDATE empresa SET ${fields.join(', ')} WHERE cnpj = ?`;

        const [result] = await db.execute(sql, values);
        const affected = (result as mysql.ResultSetHeader).affectedRows;

        if (affected === 0) {
            return res.status(404).json({
                success: false,
                error: 'Empresa não encontrada'
            });
        }

        // 🔥 INVALIDA CACHE
        await redis.del(`empresa:${req.params.cnpj}`);

        res.json({
            success: true,
            message: 'Empresa atualizada com sucesso'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: (error as Error).message
        });
    }
});


// DELETE - Deletar pessoa
router.delete('/remover/:cnpj', async (req, res: express.Response<ApiResponse>) => {
    try {
        const [result] = await db.execute('DELETE FROM empresa WHERE cnpj = ?', [req.params.cnpj]);
        const affectedRows = (result as mysql.ResultSetHeader).affectedRows;

        if (affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: 'Empresa não encontrada'
            });
        }

        // 🔥 INVALIDA CACHE
        await redis.del(`empresa:${req.params.cnpj}`);

        res.json({
            success: true,
            message: 'Empresa deletada com sucesso'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: (error as Error).message
        });
    }
});


export default router;