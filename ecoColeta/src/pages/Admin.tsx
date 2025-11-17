import AdminPanel from '@/components/AdminPanel';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Box } from '@mui/material';

const Admin = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />
      <Box>
        <AdminPanel />
      </Box>
      <Footer />
    </Box>
  );
};

export default Admin;