import { useUser } from '@/UserContext';
import RecyclingIcon from '@mui/icons-material/Recycling';
import { Alert, Box, Button, Container, Paper, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [erro, setErro] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cpf: '',
    password: '',
  });

  const formatCPF = (value: string) => {
    value = value.replace(/\D/g, "");
    value = value.substring(0, 11);

    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    return value;
  };

  const handleLogin = async () => {
    setLoading(true);
    setErro(false);


    try {
      const cpfLimpo = formData.cpf.replace(/\D/g, "");

      const response = await fetch('http://localhost:3000/api/autentic/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cpf: cpfLimpo,
          password: formData.password
        })
      });

      const data = await response.json();

      if (data.success && data.data.user) {
        setUser(data.data.user);
        
        // Redireciona baseado no nível de acesso
        if (data.data.user.isAdm) {
          navigate('/adm');
        } else if (data.data.user.isUser) {
          navigate('/home');
        } else if (data.data.user.isExterno) {
          navigate('/receber');
        }
      } else {
        setErro(true);
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setErro(true);
    } finally {
      setLoading(false);
      setFormData({ cpf: "", password: "" });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(34, 195, 112, 0.82)',
        py: 8,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: '#ffffffc9'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <RecyclingIcon sx={{ fontSize: 48, color: 'primary.main', mr: 1 }} />
            <Typography variant="h4" component="h1" fontWeight="bold" color="primary.main">
              EcoColeta
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Typography variant="body2" color="text.secondary" fontWeight="bold" sx={{ mt: 1 }}>
              Acesse sua conta para continuar
            </Typography>
          </Box>

          {erro &&
            <Alert severity="error" variant='outlined' sx={{ mb: 3 }}>
              CPF ou senha incorretos
            </Alert>
          }

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              fullWidth
              required
              type="text"
              label="CPF"
              value={formData.cpf}
              onChange={(e) => {
                const value = formatCPF(e.target.value);
                setFormData({ ...formData, cpf: value });
              }}
              autoFocus
              sx={{ mb: 2 }}
              inputProps={{ maxLength: 14 }}
              placeholder="000.000.000-00"
            />
            <TextField
              fullWidth
              required
              type="password"
              label="Senha"
              name="password"
              value={formData.password}
              onChange={(e) => { setFormData({ ...formData, password: e.target.value }) }}
              autoComplete="current-password"
              sx={{ mb: 3 }}
              placeholder="Digite sua senha"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mb: 2, py: 1.5 }}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}