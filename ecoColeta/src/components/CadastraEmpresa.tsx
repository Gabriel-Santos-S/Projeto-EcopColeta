import React, { useState } from 'react';
import { Box, Container, Paper, Typography, TextField, Button, Stack, Alert, Card, CardContent, Grid, } from '@mui/material';
import { Business, Save, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { creatEmpresa } from '@/services/empresa.services';

export interface Empresa {
    cnpj: string;
    razao_social: string;
    area_atuacao?: string;
}

const CadastrarEmpresa = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<Empresa>({
        cnpj: '',
        razao_social: '',
        area_atuacao: '',
    });
    const [errors, setErrors] = useState<Partial<Empresa>>({});
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    // Função para validar CNPJ
    const validateCNPJ = (cnpj: string): boolean => {
        const cleanedCNPJ = cnpj.replace(/\D/g, '');
        return cleanedCNPJ.length === 14;
    };

    // Função para formatar CNPJ
    const formatCNPJ = (cnpj: string): string => {
        const cleaned = cnpj.replace(/\D/g, '');
        if (cleaned.length <= 2) return cleaned;
        if (cleaned.length <= 5) return `${cleaned.slice(0, 2)}.${cleaned.slice(2)}`;
        if (cleaned.length <= 8) return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5)}`;
        if (cleaned.length <= 12) return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8)}`;
        return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5, 8)}/${cleaned.slice(8, 12)}-${cleaned.slice(12, 14)}`;
    };

    const handleChange = (field: keyof Empresa) => (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value;

        // Formatação automática do CNPJ
        if (field === 'cnpj') {
            value = formatCNPJ(value);
        }

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

    const validateForm = (): boolean => {
        const newErrors: Partial<Empresa> = {};

        if (!formData.cnpj) {
            newErrors.cnpj = 'CNPJ é obrigatório';
        } else if (!validateCNPJ(formData.cnpj)) {
            newErrors.cnpj = 'CNPJ inválido';
        }

        if (!formData.razao_social.trim()) {
            newErrors.razao_social = 'Razão Social é obrigatória';
        } else if (formData.razao_social.trim().length < 3) {
            newErrors.razao_social = 'Razão Social deve ter pelo menos 3 caracteres';
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

            const dadosParaEnviar = {
                ...formData,
                cnpj: formData.cnpj.replace(/\D/g, '') // Apenas números
            };
            
            // Aqui você faria a chamada para sua API
            await creatEmpresa(dadosParaEnviar);

            setSuccess(true);
            setFormData({
                cnpj: '',
                razao_social: '',
                area_atuacao: '',
            });

            // Limpa mensagem de sucesso após 3 segundos
            setTimeout(() => setSuccess(false), 3000);

        } catch (error) {
            console.error('Erro ao cadastrar empresa:', error);
            setErrors({ razao_social: 'Erro ao cadastrar empresa. Tente novamente.' });
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
            <Container maxWidth="md">
                {/* Botão Voltar */}
                <Button
                    startIcon={<ArrowBack />}
                    onClick={handleBack}
                    sx={{ mb: 3, color: 'text.secondary' }}
                >
                    Voltar
                </Button>

                <Grid container spacing={4} justifyContent="center" alignItems="center" >
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
                                <Business sx={{ fontSize: 80, mb: 2 }} />
                                <Typography variant="h4" fontWeight={700} gutterBottom>
                                    Cadastro de Empresa
                                </Typography>
                                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                    Cadastre empresas parceiras para integrar ao sistema de reciclagem e coleta seletiva.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid sx={{ xs: 12, md: 6 }}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 4,
                                borderRadius: 3,
                            }}
                        >
                            <Typography
                                variant="h5"
                                fontWeight={600}
                                gutterBottom
                                color="text.primary"
                            >
                                Informações da Empresa
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 3 }}
                            >
                                Preencha os dados da empresa para cadastro no sistema.
                            </Typography>

                            {success && (
                                <Alert severity="success" sx={{ mb: 3 }}>
                                    Empresa cadastrada com sucesso!
                                </Alert>
                            )}

                            <form onSubmit={handleSubmit}>
                                <Stack spacing={3}>
                                    <TextField
                                        fullWidth
                                        label="CNPJ"
                                        value={formData.cnpj}
                                        onChange={handleChange('cnpj')}
                                        error={!!errors.cnpj}
                                        helperText={errors.cnpj}
                                        placeholder="00.000.000/0000-00"
                                        required
                                        inputProps={{
                                            maxLength: 18
                                        }}
                                    />

                                    <TextField
                                        fullWidth
                                        label="Razão Social"
                                        value={formData.razao_social}
                                        onChange={handleChange('razao_social')}
                                        error={!!errors.razao_social}
                                        helperText={errors.razao_social}
                                        required
                                        inputProps={{
                                            maxLength: 200
                                        }}
                                    />

                                    <TextField
                                        fullWidth
                                        label="Área de Atuação"
                                        value={formData.area_atuacao}
                                        onChange={handleChange('area_atuacao')}
                                        placeholder="Ex: Reciclagem de Plástico, Coleta de Eletrônicos..."
                                        helperText="Opcional"
                                        inputProps={{
                                            maxLength: 150
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
                                        {loading ? 'Cadastrando...' : 'Cadastrar Empresa'}
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

export default CadastrarEmpresa;