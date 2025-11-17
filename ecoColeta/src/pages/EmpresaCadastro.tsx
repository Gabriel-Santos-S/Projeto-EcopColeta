import CadastrarEmpresa from '@/components/CadastraEmpresa';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Box } from '@mui/material';

const EmpresaCadastro = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />
      <Box>
        <CadastrarEmpresa />
      </Box>
      <Footer />
    </Box>
  );
};

export default EmpresaCadastro;