import { Box, Container, Typography, Link, Stack } from '@mui/material';
import { RecyclingOutlined, EmailOutlined, PhoneOutlined, LocationOnOutlined } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'hsl(142, 71%, 15%)',
        color: 'white',
        py: 6,
        mt: 8,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(3, 1fr)',
            },
            gap: 4,
          }}
        >
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <RecyclingOutlined sx={{ fontSize: 32, mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                EcoColeta
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Transformando resíduos em recursos para um futuro sustentável.
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Contato
            </Typography>
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailOutlined sx={{ fontSize: 20 }} />
                <Typography variant="body2">contato@ecocoleta.com.br</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneOutlined sx={{ fontSize: 20 }} />
                <Typography variant="body2">(11) 9999-9999</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOnOutlined sx={{ fontSize: 20 }} />
                <Typography variant="body2">São Paulo, SP</Typography>
              </Box>
            </Stack>
          </Box>
          
          <Box>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Links Úteis
            </Typography>
            <Stack spacing={1}>
              <Link href="#" color="inherit" underline="hover" sx={{ opacity: 0.8 }}>
                Sobre Nós
              </Link>
              <Link href="#" color="inherit" underline="hover" sx={{ opacity: 0.8 }}>
                Como Funciona
              </Link>
              <Link href="#" color="inherit" underline="hover" sx={{ opacity: 0.8 }}>
                Perguntas Frequentes
              </Link>
            </Stack>
          </Box>
        </Box>
        
        <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', mt: 4, pt: 3, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ opacity: 0.6 }}>
            © 2024 EcoColeta. Todos os direitos reservados.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
