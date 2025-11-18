import React, { useState } from 'react';
import { Box, Container, Paper, Typography, TextField, Button, Stack, Alert, Grid, Autocomplete, MenuItem, } from '@mui/material';
import { Recycling, Save, ArrowBack, Scale } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { getTiposResiduos } from '@/services/residuosService';
import { useQuery } from '@tanstack/react-query';
import { getAllCooperativas } from '@/services/cooperativaService';
import { getAllEmpresas } from '@/services/empresa.services';
import { getAllColetas } from '@/services/coletaServices';

export interface TipoResiduo {
  id_tipo?: number;
  nome: string;
  descricao?: string;
}

export interface Cooperativa {
  id_coop?: number;
  nome: string;
}

export interface Empresa {
  cnpj: string;
  razao_social: string;
}

// export interface Coleta {
//   id_coleta: number;
//   data: string;
//   localizacao: string;
// }

interface FormData {
  id_tipo: number | null;
  peso: number | null;
  id_coop: number | null;
  cnpj_empresa: string;
  id_coleta: number | null;
  peso_coletado: number | null;
}


const ReceberColeta = () => {

  // Dados de exemplo - substitua pelas suas APIs
  const { data: tiposResiduos } = useQuery({
    queryKey: ["tipos-residuos"],
    queryFn: () => getTiposResiduos(),
  });

  const { data: cooperativas } = useQuery({
    queryKey: ["cooperativas"],
    queryFn: () => getAllCooperativas(),
  });

  const { data: empresas } = useQuery({
    queryKey: ["empresas"],
    queryFn: () => getAllEmpresas(),
  });

  // const { data: coletas = [] } = useQuery({
  //   queryKey: ["coletas"],
  //   queryFn: () => getAllColetas(),
  // });

  const { id } = useParams<{ id: string }>();
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [origem, setOrigem] = useState<'cooperativa' | 'empresa' | 'nenhuma'>('nenhuma');

  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    id_tipo: null,
    peso: null,
    id_coop: null,
    cnpj_empresa: '',
    id_coleta: null,
    peso_coletado: null,
  });
console.log(id);

  const handleChange = (field: keyof FormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setFormData(prev => ({
      ...prev,
      [field]: value === '' ? null : value
    }));

    // Limpa erro do campo quando usuário começa a digitar
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  // Função para campos numéricos
  const handleNumberChange = (field: keyof FormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (value === '') {
      setFormData(prev => ({
        ...prev,
        [field]: null
      }));
    } else {
      const numericValue = value.replace(/\D/g, '');
      setFormData(prev => ({
        ...prev,
        [field]: numericValue ? Number(numericValue) : null
      }));
    }
  };

  const handleOrigemChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as 'cooperativa' | 'empresa' | 'nenhuma';
    setOrigem(value);

    // Limpa os campos de origem quando muda
    // setFormData(prev => ({
    //   ...prev,
    //   id_coop: null,
    //   cnpj_empresa: ''
    // }));
  };


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);

    try {
      // Prepara dados para envio conforme o backend espera
      const dadosParaEnviar = {
        id_tipo: formData.id_tipo,
        peso: formData.peso,
        id_coop: formData.id_coop,
        cnpj_empresa: formData.cnpj_empresa,
        id_coleta: id,
        peso_coletado: formData.peso, // Usando o input de peso para passar valor pesso_coleta
      };

      console.log('Dados enviados:', dadosParaEnviar);


      const response = await fetch('http://localhost:3000/api/residuos/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosParaEnviar),
      });

      if (!response.ok) {
        throw new Error('Erro ao cadastrar resíduo');
      }


      setSuccess(true);
      // Limpa o formulário
      setFormData({
        id_tipo: null,
        peso: null,
        id_coop: null,
        cnpj_empresa: '',
        id_coleta: null,
        peso_coletado: null,
      });
      setOrigem('nenhuma');

      // Mudar de tela em 1 segundos
      setTimeout(() => setSuccess(false), 1000);
      navigate("/receber");

    } catch (error) {
      console.error('Erro ao cadastrar resíduo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, hsl(142 76% 36% / 0.05), hsl(207 90% 54% / 0.05))',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Botão Voltar */}
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBack}
          sx={{ mb: 3, color: 'text.secondary' }}
        >
          Voltar
        </Button>

        <Grid container spacing={4} alignItems="stretch">
          {/* Lado Esquerdo - Card de Apresentação */}
          <Grid sx={{ xs: 12, md: 6 }}>
            <Paper
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                borderRadius: 3,
                height: '100%',
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                textAlign: 'center'
              }}
            >
              <Recycling sx={{ fontSize: 80, mb: 2 }} />
              <Typography variant="h4" fontWeight={700} gutterBottom>
                Cadastro de Resíduo
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Registre resíduos coletados e finalize o processo de coleta automaticamente.
              </Typography>
            </Paper>
          </Grid>

          {/* Lado Direito - Formulário */}
          <Grid sx={{ xs: 12, md: 6 }}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 3,
                height: '100%'
              }}
            >
              <Typography
                variant="h5"
                fontWeight={600}
                gutterBottom
                color="text.primary"
              >
                Informações do Resíduo
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 3 }}
              >
                Preencha os dados do resíduo coletado para registrar e finalizar a coleta.
              </Typography>

              {success && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  Resíduo cadastrado e coleta finalizada com sucesso!
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  {/* Tipo de Resíduo (Obrigatório) */}
                  <Autocomplete
                    options={tiposResiduos}
                    getOptionLabel={(option) => option.nome}
                    value={tiposResiduos?.find(tipo => tipo.id_tipo === formData.id_tipo) || null}
                    onChange={(event, newValue) => {
                      setFormData(prev => ({
                        ...prev,
                        id_tipo: newValue ? newValue.id_tipo! : null
                      }));
                    }}
                    isOptionEqualToValue={(option, value) =>
                      option.id_tipo === value?.id_tipo
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Tipo de Resíduo"
                        error={!!errors.id_tipo}
                        helperText={errors.id_tipo || "Selecione o tipo de resíduo coletado"}
                        required
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props} key={option.id_tipo}>
                        <Box>
                          <Typography variant="body1">{option.nome}</Typography>
                          {option.descricao && (
                            <Typography variant="caption" color="text.secondary">
                              {option.descricao}
                            </Typography>
                          )}
                        </Box>
                      </li>
                    )}
                  />

                  {/* Peso (Obrigatório) */}
                  <TextField
                    fullWidth
                    label="Peso (kg)"
                    value={formData.peso || ''}
                    onChange={handleNumberChange('peso')}
                    error={!!errors.peso}
                    helperText={errors.peso || "Peso do resíduo em quilogramas"}
                    required
                    placeholder="Ex: 2.5"
                    inputProps={{
                      step: "0.001",
                      min: "0"
                    }}
                  />

                  {/* Peso Coletado (Opcional) */}
                  {/* <TextField
                    fullWidth
                    label="Peso Coletado (kg)"
                    value={formData.peso_coletado || ''}
                    onChange={handleNumberChange('peso_coletado')}
                    error={!!errors.peso_coletado}
                    helperText={errors.peso_coletado || "Opcional - Se diferente do peso original"}
                    placeholder="Ex: 2.3"
                    inputProps={{
                      step: "0.001",
                      min: "0"
                    }}
                  /> */}

                  {/* Coleta (Obrigatório) */}
                  {/* <Autocomplete
                    options={coletas.filter(c => c.status === "agendada")}
                    getOptionLabel={(option) => `#${option.cpf} - ${new Date(option.data).toLocaleDateString()}`}
                    value={coletas?.find(coleta => coleta.id_coleta === formData.id_coleta) || null}
                    onChange={(event, newValue) => {
                      setFormData(prev => ({
                        ...prev,
                        id_coleta: newValue ? newValue.id_coleta : null
                      }));
                    }}
                    isOptionEqualToValue={(option, value) =>
                      option.cpf === value?.cpf
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Coleta"
                        error={!!errors.id_coleta}
                        helperText={errors.id_coleta || "Selecione a coleta relacionada"}
                        required
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props} key={option.id_coleta}>
                        <Box>
                          <Typography variant="body1">
                            CPF: {option.cpf} - {new Date(option.data).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </li>
                    )}
                  /> */}

                  {/* Origem do Resíduo */}
                  <TextField
                    select
                    label="Origem do Resíduo"
                    value={origem}
                    onChange={handleOrigemChange}
                    helperText="Opcional - Se o resíduo veio de uma empresa"
                  >
                    <MenuItem value="nenhuma">Nenhuma (Pessoa Física)</MenuItem>
                    <MenuItem value="empresa">Empresa</MenuItem>
                  </TextField>

                  {/* Cooperativa (condicional) */}

                  <Autocomplete
                    options={cooperativas}
                    getOptionLabel={(option) => option.nome}
                    value={cooperativas?.find(coop => coop.id_coop === formData.id_coop) || null}
                    onChange={(event, newValue) => {
                      setFormData(prev => ({
                        ...prev,
                        id_coop: newValue ? newValue.id_coop! : null
                      }));
                    }}
                    isOptionEqualToValue={(option, value) =>
                      option.id_coop === value?.id_coop
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        label="Cooperativa"
                        helperText="Selecione a cooperativa de origem"
                      />
                    )}
                  />


                  {/* Empresa (condicional) */}
                  {origem === 'empresa' && (
                    <Autocomplete
                      options={empresas}
                      getOptionLabel={(option) => `${option.razao_social} (${option.cnpj})`}
                      value={empresas?.find(emp => emp.cnpj === formData.cnpj_empresa) || null}
                      onChange={(event, newValue) => {
                        setFormData(prev => ({
                          ...prev,
                          cnpj_empresa: newValue ? newValue.cnpj : ''
                        }));
                      }}
                      isOptionEqualToValue={(option, value) =>
                        option.cnpj === value?.cnpj
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Empresa"
                          helperText="Selecione a empresa de origem"
                        />
                      )}
                    />
                  )}

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    startIcon={<Save />}
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 2,
                      mt: 2,
                    }}
                  >
                    {loading ? 'Cadastrando...' : 'Cadastrar Resíduo e Finalizar Coleta'}
                  </Button>
                </Stack>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ReceberColeta;