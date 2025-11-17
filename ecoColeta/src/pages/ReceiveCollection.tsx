import { Box, Button, Container, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SearchIcon from '@mui/icons-material/Search';
import type { Coleta } from '@/types';
import { useNavigate } from 'react-router-dom';


const ReceiveCollection = () => {
  const navigate = useNavigate()
  const [cpf, setCpf] = useState("");
  const [collections, setCollections] = useState<Coleta[]>([]);

  const formatCPF = (value: string) => {
    value = value.replace(/\D/g, "");
    value = value.substring(0, 11);

    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    return value;
  };

  const handleSearch = () => {

    const myCPF = cpf.replace(/\D/g, "");
    // Simulando dados para demonstração
    const mockData: Coleta[] = [
      {
        id_ponto: 1,
        cpf: '02798912105',
        status: 'agendada',
        data: '2025-11-17',
      },
      {
        id_ponto: 2,
        cpf: '98765432100',
        status: 'concluida',
        data: '2025-11-20',
      }
    ];
    setCollections(mockData.filter(c => c.cpf === myCPF && c.status === 'agendada'));
  };


  const handleReceive = (id: string) => {
    console.log('Receber coleta:', id);
    // Aqui você implementaria a lógica para marcar como recebida
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            mb: 4,
            fontWeight: 700,
            color: 'primary.main',
            textAlign: 'center'
          }}
        >
          Receber Coleta Agendada
        </Typography>

        <Paper sx={{ p: 4, mb: 4, bgcolor: 'background.paper' }}>
          <Typography variant="h6" sx={{ mb: 3, color: 'text.primary' }}>
            Buscar Coletas
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
            <TextField
              fullWidth
              type="text"
              label="CPF"
              value={cpf}
              onChange={(e) => {
                const value = formatCPF(e.target.value);
                setCpf(value);
              }}
              autoFocus
              sx={{ mb: 2 }}
            />
          </Stack>

          <Button
            variant="contained"
            color="primary"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
            fullWidth
            sx={{ py: 1.5 }}
          >
            Buscar
          </Button>
        </Paper>

        {collections.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>CPF</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Data</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Ação</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {collections.map((collection) => (
                  <TableRow key={collection.id_ponto} hover>
                    <TableCell>{collection.cpf}</TableCell>
                    <TableCell>{collection.data}</TableCell>
                    <TableCell>{collection.status}</TableCell>
                    <TableCell align="left">
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        startIcon={<CheckCircleIcon />}
                        onClick={() =>
                          navigate(`/receber/coleta/${collection.id_ponto}`)
                        }
                      >
                        Receber
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <p style={{ marginTop: 50, fontWeight: 600 }}>
            Não tem coletas agendadas para esse CPF.
          </p>
        )}

      </Container>

      <Footer />
    </Box>
  );
};

export default ReceiveCollection;
