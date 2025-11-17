import { creatColeta, getAllPontoColeta } from '@/services/coletaServices';
import type { Coleta, PontoColeta } from '@/types';
import { SendOutlined } from '@mui/icons-material';
import { Alert, Autocomplete, Box, Button, Container, Paper, Snackbar, Stack, TextField, Typography } from '@mui/material';
import { useQuery } from "@tanstack/react-query";
import { useState } from 'react';

const ScheduleSection = () => {
  const [data, setData] = useState("");
  const [time, setTime] = useState("");
  const [opne, setOpne] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<PontoColeta | null>(null);
  const [formData, setFormData] = useState<Coleta>({
    id_coleta: null,
    cpf: "",
    data: "",
    status: 'agendada',
    id_ponto: null,
  });

  const { data: pontos_coleta, isLoading: isColeta } = useQuery({
    queryKey: ["tipos_pon"],
    queryFn: () => getAllPontoColeta(),
  });



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {

      if (!selectedOptions) {
        alert("Por favor, selecione um ponto de coleta");
        return;
      }

      const dataSolicitada = new Date(`${data}T${time}:00.000Z`).toISOString();

      const dadosColeta = {
        ...formData,
        cpf: "02798912105",
        data: dataSolicitada,
        status: 'agendada' as const,
        id_ponto: selectedOptions ? selectedOptions.id_ponto : null,
      };

      setFormData(dadosColeta);

      await creatColeta(dadosColeta);

      console.log("Coleta criada");
      setOpne(true);

      // Limpa os campos do formulário
      setData("");
      setTime("");
      setSelectedOptions(null);

    } catch (error) {
      console.log("Erro na solicitação de coleta", error);
    }
  };



  return (
    <Box id="agendamento" sx={{ py: 8, bgcolor: 'background.paper' }}>
      <Container maxWidth="md">
        <Typography variant="h3" align="center" sx={{ mb: 2, fontWeight: 700, color: 'text.primary' }} >
          Agende Sua Coleta
        </Typography>
        <Typography variant="h6" align="center" sx={{ mb: 6, color: 'text.secondary' }}
        >
          Preencha o formulário e nossa equipe entrará em contato
        </Typography>

        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, bgcolor: 'white' }}>

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>

              <Autocomplete
                options={pontos_coleta}
                getOptionLabel={(option) => option.localizacao}
                value={selectedOptions}
                loading={isColeta}
                onChange={(event, newValue) => {
                  setSelectedOptions(newValue);
                }}
                isOptionEqualToValue={(option, value) =>
                  option.id_ponto === value.id_ponto
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Selecione o ponto de coleta"
                    placeholder="Selecione..."
                    variant="outlined"
                  />
                )}
              />

              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <TextField
                  fullWidth
                  label="Data da Coleta"
                  name="date"
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                  required
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    min: new Date().toISOString().split('T')[0],
                  }}
                />

                <TextField
                  fullWidth
                  type='time'
                  label="Horário Preferencial"
                  name="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                  variant="outlined"
                >
                </TextField>
              </Box>

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                endIcon={<SendOutlined />}
                sx={{
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  bgcolor: 'hsl(var(--primary))',
                  color: 'hsl(var(--primary-foreground))',
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: 'hsl(var(--primary-dark))',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(46, 125, 50, 0.3)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Confirmar Agendamento
              </Button>
            </Stack>
          </form>

          <Snackbar open={opne} autoHideDuration={6000} onClose={() => setOpne(false)}>
            <Alert
              severity="success"
              variant="filled"
              sx={{ width: '100%', color: '#ffffffff' }}
            >
              Agendamento realizado com sucesso!
            </Alert>
          </Snackbar>
        </Paper>
      </Container>
    </Box>
  );
};

export default ScheduleSection;
