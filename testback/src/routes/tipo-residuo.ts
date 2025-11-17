import express from 'express';
import * as mysql from 'mysql2';
import db from '../config/database';
import redis from '../redis';
import { ApiResponse, Coleta, TipoResiduo } from '../types';
import { isoToMySQL } from '../controlerDate';

const router = express.Router();

// GET - Listar todos os tipos de residuo
router.get('/', async (req, res: express.Response<ApiResponse<TipoResiduo[]>>) => {
    try {
        const [rows] = await db.execute('SELECT * FROM tipo_residuo');
        const tipo_residuo = rows as TipoResiduo[];

        res.json({
            success: true,
            data: tipo_residuo
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