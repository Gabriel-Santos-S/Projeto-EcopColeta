import { Box, Grid, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BusinessIcon from "@mui/icons-material/Business";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";

export default function AdminPanel() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Cadastrar Cooperativa",
      icon: <CorporateFareIcon sx={{ fontSize: 50 }} />,
      route: "/adm/cadastroCooperativa",
    },
    {
      title: "Cadastrar Empresa",
      icon: <BusinessIcon sx={{ fontSize: 50 }} />,
      route: "/adm/cadastroEmpresa",
    },
    {
      title: "Cadastrar Ponto de Coleta",
      icon: <AddLocationAltIcon sx={{ fontSize: 50 }} />,
      route: "/adm/cadastroPontoColeta",
    },
  ];

  return (
    <Box p={4} sx={{pb: 20, pt: 15}}>
      <Typography
        variant="h4"
        fontWeight={700}
        mb={4}
        color="text.primary"
        textAlign="center"
      >
        Painel Administrativo
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {cards.map((card) => (
          <Grid  sx={{xs: 12, sm: 6, md: 4}} key={card.title}>
            <Paper
              elevation={4}
              onClick={() => navigate(card.route)}
              style={{
                cursor: "pointer",
                padding: "40px 20px",
                textAlign: "center",
                borderRadius: 18,
                transition: "0.3s ease",
                background: "white",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow =
                  "0 10px 20px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0px)";
                e.currentTarget.style.boxShadow = "0 3px 10px rgba(0,0,0,0.1)";
              }}
            >
              <Box mb={2} color="primary.main">
                {card.icon}
              </Box>

              <Typography variant="h6" fontWeight={700} color="text.primary">
                {card.title}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                mt={1}
                sx={{ maxWidth: 220, margin: "0 auto" }}
              >
                Acesse para gerenciar o cadastro.
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
