import { Box, Typography, Button, Container } from '@mui/material';
import { Home } from '@mui/icons-material';
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        bgcolor: 'grey.50'
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center' }}>
          <Typography 
            variant="h1" 
            sx={{ 
              mb: 2, 
              fontSize: '6rem', 
              fontWeight: 700,
              color: 'primary.main'
            }}
          >
            404
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 4, 
              color: 'text.secondary'
            }}
          >
            Oops! Página não encontrada
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<Home />}
            onClick={() => navigate(-1)}
            sx={{
              px: 4,
              py: 1.5,
            }}
          >
            Voltar para Início
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default NotFound;
