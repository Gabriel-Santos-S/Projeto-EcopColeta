import { Box, Container, Typography, Button, Stack } from '@mui/material';
import { RecyclingOutlined, CalendarMonth, History, AccountBalanceWallet } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {

  const navigate = useNavigate();

  const handleScrollToSchedule = () => {
    document.getElementById('agendamento')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleMinhasColetas = () => {
    navigate("/home/minhasColetas")
  };

  const handleMeuSaldo = () => {
    // Adicione a navegação para "Meu Saldo" aqui
    console.log('Navegar para Meu Saldo');
  };

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, hsl(142 76% 36% / 0.95), hsl(207 90% 54% / 0.85))',
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
        }
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', color: 'white' }}>
          <RecyclingOutlined
            sx={{
              fontSize: 80,
              mb: 2,
              animation: 'pulse 2s ease-in-out infinite',
              '@keyframes pulse': {
                '0%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.1)' },
                '100%': { transform: 'scale(1)' },
              }
            }}
          />
          <Typography
            variant="h1"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: '2.5rem', md: '4rem' },
              textShadow: '0 2px 10px rgba(0,0,0,0.2)'
            }}
          >
            Recicle com Facilidade
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mb: 4,
              opacity: 0.95,
              maxWidth: '700px',
              mx: 'auto',
              fontSize: { xs: '1.1rem', md: '1.5rem' }
            }}
          >
            Agende sua coleta seletiva de forma simples e contribua para um planeta mais sustentável
          </Typography>
          
          {/* Botão principal */}
          <Button
            variant="contained"
            size="large"
            onClick={handleScrollToSchedule}
            startIcon={<CalendarMonth />}
            sx={{
              bgcolor: 'white',
              color: 'hsl(142 76% 36%)',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: '50px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.9)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 25px rgba(0,0,0,0.3)',
              },
              transition: 'all 0.3s ease',
              mb: 3, // Adiciona margem abaixo
            }}
          >
            Agende Sua Coleta
          </Button>

          {/* Botões secundários */}
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            justifyContent="center"
            alignItems="center"
          >
            <Button
              variant="outlined"
              size="medium"
              onClick={handleMinhasColetas}
              startIcon={<History />}
              sx={{
                color: 'white',
                borderColor: 'white',
                px: 3,
                py: 1,
                fontSize: '1rem',
                fontWeight: 500,
                borderRadius: '25px',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                  borderColor: 'white',
                  transform: 'translateY(-1px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Minhas Coletas
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;