// routes/auth.ts
import express from 'express';
import db from '../config/database';
import { ApiResponse, LoginRequest, LoginResponse, UpdateNivelAcessoParams, UpdateNivelAcessoRequest, UserData } from '../types';

const router = express.Router();

// POST - Login
router.post('/login', async (req: express.Request<{}, {}, LoginRequest>, res: express.Response<ApiResponse<LoginResponse>>) => {
    try {
        const { cpf, password } = req.body;

        if (!cpf || !password) {
            return res.status(400).json({
                success: false,
                error: 'CPF e senha são obrigatórios'
            });
        }

        const cpfLimpo = cpf.replace(/\D/g, '');

        // Consulta no MySQL com JOIN
        const [rows] = await db.execute(
            `SELECT gu.ID, gu.cpf, gu.nivel_acesso, gu.senha, p.nome 
       FROM grupos_usuarios gu
       INNER JOIN pessoa p ON gu.cpf = p.cpf 
       WHERE gu.cpf = ?`,
            [cpfLimpo]
        );

        const users = rows as any[];

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                error: 'CPF ou senha incorretos'
            });
        }

        const user = users[0];

        // Verifica senha
        if (user.senha !== password) {
            return res.status(401).json({
                success: false,
                error: 'CPF ou senha incorretos'
            });
        }

        // Prepara resposta
        const userRetorno: UserData = {
            id: user.ID,
            cpf: user.cpf,
            nome: user.nome,
            isAdm: user.nivel_acesso === 'adm',
            isUser: user.nivel_acesso === 'usuario',
            isExterno: user.nivel_acesso === 'externo',
            nivel_acesso: user.nivel_acesso
        };

        res.json({
            success: true,
            data: {
                user: userRetorno
            }
        });

    } catch (error) {
        const err = error as Error;
        console.error('Erro no login:', err);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// PUT - Atualizar nível de acesso
router.patch('/nivel-acesso/:cpf', async (req: express.Request<UpdateNivelAcessoParams, {}, UpdateNivelAcessoRequest>, res: express.Response<ApiResponse>) => {
    try {
        const { cpf } = req.params;
        const { novo_nivel } = req.body;

        // Validações
        if (!novo_nivel) {
            return res.status(400).json({
                success: false,
                error: 'Novo nível de acesso é obrigatório'
            });
        }

        const niveisPermitidos = ['adm', 'usuario', 'externo'];
        if (!niveisPermitidos.includes(novo_nivel)) {
            return res.status(400).json({
                success: false,
                error: 'Nível de acesso inválido. Use: adm, usuario ou externo'
            });
        }

        const cpfLimpo = cpf.replace(/\D/g, '');

        const [userRows] = await db.execute(
            'SELECT * FROM grupos_usuarios WHERE cpf = ?',
            [cpfLimpo]
        );

        const users = userRows as any[];

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Usuário não encontrado'
            });
        }

        const [result] = await db.execute(
            'UPDATE grupos_usuarios SET nivel_acesso = ? WHERE cpf = ?',
            [novo_nivel, cpfLimpo]
        );

        const affectedRows = (result as any).affectedRows;

        if (affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: 'Usuário não encontrado ou nenhuma alteração realizada'
            });
        }

        res.json({
            success: true,
            message: `Nível de acesso atualizado para '${novo_nivel}' com sucesso`
        });

    } catch (error) {
        const err = error as Error;
        console.error('Erro ao atualizar nível de acesso:', err);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

export default router;