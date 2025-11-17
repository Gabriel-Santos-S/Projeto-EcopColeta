import { useUser } from '@/UserContext';
import RecyclingIcon from '@mui/icons-material/Recycling';
import { Alert, Box, Button, Container, Divider, Link, Paper, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  cpf?: string
  isAdm?: boolean
  isUser?: boolean
  isExterno?: boolean
}

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [erro, setErro] = useState(false);
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


  const onVerifcPassword = () => {
    const cpfLimpo = formData.cpf.replace(/\D/g, "");
    const correctUser = { cpf: "00000000000", senha: "000" };
    const userRetorno: User = {
      cpf: '00000000000',
      isAdm: true,
      isUser: false,
      isExterno: false,
    }

    // Chamar api para verificar
    const isCorrect = cpfLimpo === correctUser.cpf && formData.password === correctUser.senha;

    if (isCorrect) {
      setUser(userRetorno); 
      userRetorno.isAdm && navigate('/adm');
      userRetorno.isUser && navigate('/home');
      userRetorno.isExterno && navigate('/receber');
    } else {
      setErro(true);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerifcPassword();
    setFormData({ cpf: "", password: "" });
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
              Senha ou usuário incorreto
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
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mb: 2, py: 1.5 }}
            >
              Entrar
            </Button>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Link
                href="#"
                variant="body2"
                sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                Esqueceu a senha?
              </Link>
              <Link
                href="#"
                variant="body2"
                sx={{ textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
              >
                Criar conta
              </Link>
            </Box>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                OU
              </Typography>
            </Divider>

            <Button
              fullWidth
              variant="outlined"
              size="large"
              onClick={() => navigate('/')}
              sx={{ py: 1.5 }}
            >
              Voltar para o site
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
