import { Box } from '@mui/material';
import MaterialsSection from '@/components/MaterialsSection';
import Footer from '@/components/Footer';
import ScheduleSection from '@/components/ScheduleSection';
import HeroSection from '@/components/HeroSection';
import Header from '@/components/Header';

const Home = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />
      <HeroSection />
      <Box id="materiais">
        <MaterialsSection />
      </Box>
      <ScheduleSection />
      <Footer />
    </Box>
  );
};

export default Home;