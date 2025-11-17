import CadastrarPontoColeta from '@/components/CadastraPontoColeta';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Box } from '@mui/material';

const PontoColetaCadastro = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />
      <Box>
        <CadastrarPontoColeta />
      </Box>
      <Footer />
    </Box>
  );
};

export default PontoColetaCadastro;