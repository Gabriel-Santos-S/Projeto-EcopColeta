import React, { useState } from 'react';
import {
    Box,
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Stack,
    Alert,
    Grid,
    MenuItem,
} from '@mui/material';
import { Business, Save, ArrowBack, LocationOn } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { creatCooperativa } from '@/services/cooperativaService';

export interface Cooperativa {
    id_coop?: number;
    nome: string;
    endereco_rua?: string;
    endereco_numero?: string;
    endereco_bairro?: string;
    endereco_cidade?: string;
    endereco_uf?: string;
    capacidade_processamento?: number;
}

const CadastrarCooperativa = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<Cooperativa>({
        nome: '',
        endereco_rua: '',
        endereco_numero: '',
        endereco_bairro: '',
        endereco_cidade: '',
        endereco_uf: '',
        capacidade_processamento: undefined,
    });
    const [errors, setErrors] = useState<Partial<Cooperativa>>({});
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    // Estados do Brasil
    const estados = [
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
        'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
        'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    ];

    const handleChange = (field: keyof Cooperativa) => (event: React.ChangeEvent<HTMLInputElement>) => {
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

    // Função específica para número (apenas números)
    const handleNumberChange = (field: keyof Cooperativa) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value.replace(/\D/g, ''); // Remove não números
        setFormData(prev => ({
            ...prev,
            [field]: value ? Number(value) : undefined
        }));
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<Cooperativa> = {};

        if (!formData.nome.trim()) {
            newErrors.nome = 'Nome da cooperativa é obrigatório';
        } else if (formData.nome.trim().length < 3) {
            newErrors.nome = 'Nome deve ter pelo menos 3 caracteres';
        }

        // Validação do estado (se preenchido)
        if (formData.endereco_uf && !estados.includes(formData.endereco_uf)) {
            newErrors.endereco_uf = 'UF inválida';
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
            // Prepara dados para envio (converte string vazia para undefined)
            const dadosParaEnviar: Cooperativa = {
                nome: formData.nome.trim(),
                endereco_rua: formData.endereco_rua?.trim() || undefined,
                endereco_numero: formData.endereco_numero?.trim() || undefined,
                endereco_bairro: formData.endereco_bairro?.trim() || undefined,
                endereco_cidade: formData.endereco_cidade?.trim() || undefined,
                endereco_uf: formData.endereco_uf || undefined,
                capacidade_processamento: formData.capacidade_processamento || undefined,
            };
            console.log(dadosParaEnviar);

            // Aqui você faria a chamada para sua API
            await creatCooperativa(dadosParaEnviar);
            

            // Simulando uma requisição
            await new Promise(resolve => setTimeout(resolve, 1000));

            setSuccess(true);
            // Limpa o formulário
            setFormData({
                nome: '',
                endereco_rua: '',
                endereco_numero: '',
                endereco_bairro: '',
                endereco_cidade: '',
                endereco_uf: '',
                capacidade_processamento: undefined,
            });

            // Limpa mensagem de sucesso após 3 segundos
            setTimeout(() => setSuccess(false), 3000);

        } catch (error) {
            console.error('Erro ao cadastrar cooperativa:', error);
            setErrors({ nome: 'Erro ao cadastrar cooperativa. Tente novamente.' });
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

                <Grid container spacing={4} justifyContent="center" alignItems="center">
                    {/* Lado Esquerdo - Card de Apresentação */}
                    <Grid sx={{ xs: 12, sm: 6 }}>
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
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                <Business sx={{ fontSize: 80 }} />
                            </Box>

                            <Typography variant="h4" fontWeight={700} gutterBottom>
                                Cadastro de Cooperativa
                            </Typography>

                            <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                Cadastre cooperativas de reciclagem para integrar ao sistema de coleta seletiva e processamento de resíduos.
                            </Typography>
                        </Paper>
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
                                Informações da Cooperativa
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 3 }}
                            >
                                Preencha os dados da cooperativa para cadastro no sistema.
                            </Typography>

                            {success && (
                                <Alert severity="success" sx={{ mb: 3 }}>
                                    Cooperativa cadastrada com sucesso!
                                </Alert>
                            )}

                            <form onSubmit={handleSubmit}>
                                <Stack spacing={3}>
                                    {/* Nome da Cooperativa */}
                                    <TextField
                                        fullWidth
                                        label="Nome da Cooperativa"
                                        value={formData.nome}
                                        onChange={handleChange('nome')}
                                        error={!!errors.nome}
                                        helperText={errors.nome}
                                        required
                                        inputProps={{
                                            maxLength: 150
                                        }}
                                    />

                                    {/* Endereço */}
                                    <Typography variant="h6" color="text.primary" sx={{ mt: 2 }}>
                                        <LocationOn sx={{ fontSize: 20, mr: 1, verticalAlign: 'bottom' }} />
                                        Endereço
                                    </Typography>

                                    <TextField
                                        fullWidth
                                        required
                                        label="Rua"
                                        value={formData.endereco_rua}
                                        onChange={handleChange('endereco_rua')}
                                        placeholder="Nome da rua, avenida, etc."
                                        inputProps={{
                                            maxLength: 150
                                        }}
                                    />

                                    <Stack direction="row" spacing={2}>
                                        <TextField
                                            label="Número"
                                            required
                                            value={formData.endereco_numero}
                                            onChange={handleChange('endereco_numero')}
                                            placeholder="Nº"
                                            inputProps={{
                                                min: 0,
                                                step: 100,
                                                maxLength: 20
                                            }}
                                            sx={{ flex: 1 }}
                                        />
                                        <TextField
                                            fullWidth
                                            label="Bairro"
                                            required
                                            value={formData.endereco_bairro}
                                            onChange={handleChange('endereco_bairro')}
                                            placeholder="Bairro"
                                            inputProps={{
                                                maxLength: 100
                                            }}
                                            sx={{ flex: 2 }}
                                        />
                                    </Stack>

                                    <Stack direction="row" spacing={2}>
                                        <TextField
                                            fullWidth
                                            label="Cidade"
                                            required
                                            value={formData.endereco_cidade}
                                            onChange={handleChange('endereco_cidade')}
                                            placeholder="Cidade"
                                            inputProps={{
                                                maxLength: 100
                                            }}
                                        />
                                        <TextField
                                            select
                                            label="UF"
                                            required
                                            value={formData.endereco_uf}
                                            onChange={handleChange('endereco_uf')}
                                            error={!!errors.endereco_uf}
                                            helperText={errors.endereco_uf}
                                            sx={{ minWidth: 80 }}
                                        >
                                            <MenuItem value="">
                                                <em>Selecione</em>
                                            </MenuItem>
                                            {estados.map(estado => (
                                                <MenuItem key={estado} value={estado}>
                                                    {estado}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Stack>

                                    {/* Capacidade de Processamento */}
                                    <TextField
                                        fullWidth
                                        label="Capacidade de Processamento (kg/mês)"
                                        required
                                        type="number"
                                        value={formData.capacidade_processamento || ''}
                                        onChange={handleNumberChange('capacidade_processamento')}
                                        error={!!errors.capacidade_processamento}
                                        helperText={errors.capacidade_processamento || "Capacidade estimada em quilogramas por mês"}
                                        placeholder="Ex: 1000"
                                        inputProps={{
                                            min: 0,
                                            step: 100
                                        }}
                                    />

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
                                        {loading ? 'Cadastrando...' : 'Cadastrar Cooperativa'}
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

export default CadastrarCooperativa;