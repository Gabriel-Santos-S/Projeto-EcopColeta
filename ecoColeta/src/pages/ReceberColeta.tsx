import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ReceberColeta from '@/components/ReceberColeta';
import { Box } from '@mui/material';

const EmpresaCadastro = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />
      <Box>
        <ReceberColeta />
      </Box>
      <Footer />
    </Box>
  );
};

export default EmpresaCadastro;