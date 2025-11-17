import { creatPontoColeta } from '@/services/pontoColetaService';
import { getTiposResiduos } from '@/services/residuosService';
import { ArrowBack, LocationOn, Save } from '@mui/icons-material';
import {
    Alert,
    Autocomplete,
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Grid,
    Paper,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface PontoColeta {
    id_ponto?: number;
    localizacao: string;
    capacidade?: number;
    tipo?: string;
}

export interface TipoResiduo {
    id_tipo?: number;
    nome: string;
    descricao?: string;
}



const CadastrarPontoColeta = () => {
    const navigate = useNavigate();
    const [selectedTipo, setSelectedTipo] = useState<TipoResiduo | null>(null);
    const [errors, setErrors] = useState<Partial<PontoColeta>>({});
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<PontoColeta>({
        localizacao: '',
        capacidade: undefined,
        tipo: '',
    });

    const { data: tiposResiduos, isLoading: isLoadingTipos } = useQuery({
        queryKey: ["tipos-residuos"],
        queryFn: () => getTiposResiduos(),
    });

    const handleChange = (field: keyof PontoColeta) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Limpa erro do campo quando usuário começa a digitar
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
    };

    // Função específica para capacidade (apenas números)
    const handleCapacidadeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        // Se estiver vazio, define como undefined
        if (value === '') {
            setFormData(prev => ({
                ...prev,
                capacidade: undefined
            }));
        } else {
            // Remove caracteres não numéricos e converte para número
            const numericValue = value.replace(/\D/g, '');
            setFormData(prev => ({
                ...prev,
                capacidade: numericValue ? Number(numericValue) : undefined
            }));
        }
    };


    // Atualiza tipo quando selectedTipo muda
    React.useEffect(() => {
        setFormData(prev => ({
            ...prev,
            tipo: selectedTipo ? selectedTipo.nome : ''
        }));
    }, [selectedTipo]);

    const validateForm = (): boolean => {
        const newErrors: Partial<PontoColeta> = {};

        if (!formData.localizacao.trim()) {
            newErrors.localizacao = 'Localização é obrigatória';
        } else if (formData.localizacao.trim().length < 5) {
            newErrors.localizacao = 'Localização deve ter pelo menos 5 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // Prepara dados para envio
            const dadosParaEnviar: PontoColeta = {
                localizacao: formData.localizacao.trim(),
                capacidade: formData.capacidade,
                tipo:  String(selectedTipo.id_tipo),
            };


            // Aqui você faria a chamada para sua API
            await creatPontoColeta(dadosParaEnviar);

            // Simulando uma requisição
            await new Promise(resolve => setTimeout(resolve, 1000));

            setSuccess(true);
            // Limpa o formulário
            setFormData({
                localizacao: '',
                capacidade: undefined,
                tipo: '',
            });
            setSelectedTipo(null);

            // Limpa mensagem de sucesso após 3 segundos
            setTimeout(() => setSuccess(false), 3000);

        } catch (error) {
            console.error('Erro ao cadastrar ponto de coleta:', error);
            setErrors({ localizacao: 'Erro ao cadastrar ponto de coleta. Tente novamente.' });
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handleClearTipo = () => {
        setSelectedTipo(null);
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

                <Grid container spacing={4} justifyContent="center" alignItems="center" >
                    {/* Lado Esquerdo - Card de Apresentação */}
                    <Grid sx={{ xs: 12, md: 6 }}>
                        <Card
                            sx={{
                                bgcolor: 'primary.main',
                                color: 'white',
                                borderRadius: 3,
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                            }}
                        >
                            <CardContent sx={{ textAlign: 'center', p: 4 }}>
                                <LocationOn sx={{ fontSize: 80, mb: 2 }} />
                                <Typography variant="h4" fontWeight={700} gutterBottom>
                                    Cadastro de Ponto de Coleta
                                </Typography>
                                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                    Cadastre novos pontos de coleta para expandir a rede de reciclagem e facilitar o descarte correto de resíduos.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Lado Direito - Formulário */}
                    <Grid sx={{ xs: 12, sm: 6 }}>
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
                                Informações do Ponto de Coleta
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 3 }}
                            >
                                Preencha os dados do ponto de coleta para cadastro no sistema.
                            </Typography>

                            {success && (
                                <Alert severity="success" sx={{ mb: 3 }}>
                                    Ponto de coleta cadastrado com sucesso!
                                </Alert>
                            )}

                            <form onSubmit={handleSubmit}>
                                <Stack spacing={3}>
                                    {/* Localização */}
                                    <TextField
                                        fullWidth
                                        label="Localização"
                                        value={formData.localizacao}
                                        onChange={handleChange('localizacao')}
                                        error={!!errors.localizacao}
                                        helperText={errors.localizacao}
                                        required
                                        placeholder="Ex: Av. Principal, 123 - Centro, São Paulo - SP"
                                        inputProps={{
                                            maxLength: 255
                                        }}
                                    />

                                    {/* Capacidade */}
                                    <TextField
                                        fullWidth
                                        required
                                        label="Capacidade (kg)"
                                        value={formData.capacidade || ''}
                                        onChange={handleCapacidadeChange}
                                        error={!!errors.capacidade}
                                        helperText={errors.capacidade || "Capacidade estimada em quilogramas"}
                                        placeholder="Ex: 5000"
                                        inputProps={{
                                            maxLength: 6
                                        }}
                                    />

                                    {/* Tipo de Resíduo Aceito (APENAS UM) */}
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                            Tipo de Resíduo Aceito
                                        </Typography>

                                        <Autocomplete
                                            options={tiposResiduos}
                                            loading={isLoadingTipos}
                                            getOptionLabel={(option) => option.nome}
                                            value={selectedTipo}
                                            onChange={(event, newValue) => {
                                                setSelectedTipo(newValue);
                                            }}
                                            isOptionEqualToValue={(option, value) =>
                                                option.id_tipo === value?.id_tipo
                                            }
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    required
                                                    placeholder="Selecione o tipo de resíduo..."
                                                    helperText="Selecione o tipo de resíduo que este ponto aceita"
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
                                    </Box>

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
                                        {loading ? 'Cadastrando...' : 'Cadastrar Ponto de Coleta'}
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

export default CadastrarPontoColeta;