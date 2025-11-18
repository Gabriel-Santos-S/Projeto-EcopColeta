import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { RecyclingOutlined, InfoOutlined, ExitToApp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        bgcolor: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ py: 1 }}>
          <RecyclingOutlined 
            sx={{ 
              mr: 1, 
              fontSize: 32,
              color: 'primary.main' 
            }} 
          />
          <Typography
            variant="h6"
            component="div"
            sx={{ 
              flexGrow: 1, 
              fontWeight: 700,
              color: 'text.primary'
            }}
          >
            EcoColeta
          </Typography>
          
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1 }}>
            <Button
              onClick={() => navigate('/')}
              startIcon={<ExitToApp />}
              variant="contained"
              color="primary"
            >
              Sair
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
