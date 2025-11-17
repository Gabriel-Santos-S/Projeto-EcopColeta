import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import connection from './config/database';
import pessoasRoutes from './routes/pessoas';
import empresasRoutes from './routes/empresas';
import cooperativasRoutes from './routes/cooperativas';
import pontosColetaRoutes from './routes/pontos-coleta';
import residuosRoutes from './routes/residuos';
import coletasRoutes from './routes/coletas';
import tipoResiduos from './routes/tipo-residuo'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/pessoas', pessoasRoutes);
app.use('/api/empresas', empresasRoutes);
app.use('/api/cooperativas', cooperativasRoutes);
app.use('/api/pontos-coleta', pontosColetaRoutes);
app.use('/api/residuos', residuosRoutes);
app.use('/api/coletas', coletasRoutes);
app.use('/api/tipos-residuos', tipoResiduos)

// Rota de saúde
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Backend Reciclame funcionando!',
    timestamp: new Date().toISOString()
  });
});

connection.getConnection()
  .then(conn => {
    console.log('✅ Conectado ao banco de dados com sucesso!');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Erro ao conectar ao banco de dados:', err.message);
  });

// Verificar se está rodando no ambiente
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
});