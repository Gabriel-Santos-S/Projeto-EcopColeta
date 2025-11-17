import Footer from '@/components/Footer';
import Header from '@/components/Header';
import TabelColetas from '@/components/TabelColetas';
import { Box } from '@mui/material';

const MyColetas = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />
      <Box>
        <TabelColetas />
      </Box>
      <Footer />
    </Box>
  );
};

export default MyColetas;