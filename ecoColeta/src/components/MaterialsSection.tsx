import { Container, Typography, Card, CardContent, Box } from '@mui/material';
import { 
  LocalDrinkOutlined, 
  NewspaperOutlined, 
  DeleteOutlineOutlined,
  BatteryChargingFullOutlined 
} from '@mui/icons-material';

const materials = [
  {
    icon: LocalDrinkOutlined,
    title: 'Plástico',
    description: 'Garrafas PET, embalagens, sacolas e recipientes plásticos',
    color: 'hsl(0 84% 60%)',
  },
  {
    icon: NewspaperOutlined,
    title: 'Papel',
    description: 'Jornais, revistas, caixas de papelão e papel de escritório',
    color: 'hsl(207 90% 54%)',
  },
  {
    icon: DeleteOutlineOutlined,
    title: 'Metal',
    description: 'Latas de alumínio, aço e outros metais recicláveis',
    color: 'hsl(45 100% 50%)',
  },
  {
    icon: BatteryChargingFullOutlined,
    title: 'Eletrônicos',
    description: 'Pilhas, baterias e pequenos aparelhos eletrônicos',
    color: 'hsl(142 76% 36%)',
  },
];

const MaterialsSection = () => {
  return (
    <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
      <Container maxWidth="lg">
        <Typography 
          variant="h3" 
          align="center" 
          sx={{ 
            mb: 2, 
            fontWeight: 700,
            color: 'text.primary'
          }}
        >
          Materiais Aceitos
        </Typography>
        <Typography 
          variant="h6" 
          align="center" 
          sx={{ 
            mb: 6, 
            color: 'text.secondary',
            maxWidth: '600px',
            mx: 'auto'
          }}
        >
          Coletamos diversos tipos de materiais recicláveis para dar a eles um destino adequado
        </Typography>
        
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            },
            gap: 3,
          }}
        >
          {materials.map((material, index) => {
            const Icon = material.icon;
            return (
              <Card
                key={index}
                sx={{
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                  },
                  borderRadius: 3,
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: `${material.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    <Icon sx={{ fontSize: 40, color: material.color }} />
                  </Box>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 1, 
                      fontWeight: 600,
                      color: 'text.primary'
                    }}
                  >
                    {material.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ color: 'text.secondary' }}
                  >
                    {material.description}
                  </Typography>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
};

export default MaterialsSection;
