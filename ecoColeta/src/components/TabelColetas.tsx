import { getCpfColetaResiduo } from '@/services/coletaServices';
import { useUser } from '@/UserContext';
import { ArrowBack, CalendarToday, LocationOn, Recycling, Search } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Chip, Container, Grid, InputAdornment, MenuItem, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';


const TabelColetas = () => {
    const { user } = useUser();
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('todos');
    const [tipoFilter, setTipoFilter] = useState<string>('todos');

    const { data: dados } = useQuery({
        queryKey: ["dados", user?.cpf],        // inclui o CPF na chave (boa prática)
        queryFn: () => getCpfColetaResiduo(user!.cpf),
        enabled: !!user?.cpf,                 // só executa quando user.cpf existir
    });
    console.log(user?.cpf);


    // Filtra as coletas
    const filteredColetas = useMemo(() => {
        return dados?.filter(coleta => {
            // ✅ Trata valores nulos de forma segura
            const tiposResiduos = coleta.tipos_residuos || '';
            const localizacao = coleta.localizacao || '';

            const matchesSearch =
                localizacao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tiposResiduos.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === 'todos' || coleta.status === statusFilter;
            const matchesTipo = tipoFilter === 'todos' || tiposResiduos.includes(tipoFilter);

            return matchesSearch && matchesStatus && matchesTipo;
        });
    }, [dados, searchTerm, statusFilter, tipoFilter]);

    // Estatísticas
    const stats = useMemo(() => {
        const total = dados?.length;
        const concluidas = dados?.filter(c => c.status === 'concluida').length;
        const canceladas = dados?.filter(c => c.status === 'cancelada').length;
        const em_andamento = dados?.filter(c => c.status === 'em_andamento').length;
        const agendada = dados?.filter(c => c.status === 'agendada').length;

        return { total, concluidas, canceladas, em_andamento, agendada };
    }, [dados]);

    // Função para obter a cor do status
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'concluida':
                return 'success';
            case 'em_andamento':
                return 'warning';
            case 'agendada':
                return 'info';
            case 'cancelada':
                return 'error';
            default:
                return 'default';
        }
    };

    // Função para formatar a data
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate(-1)}
                    sx={{ mb: 3, color: 'text.secondary' }}
                >
                    Voltar
                </Button>
                {/* Cabeçalho */}
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 700,
                            color: 'text.primary',
                            mb: 2,
                        }}
                    >
                        Minhas Coletas
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{
                            color: 'text.secondary',
                            maxWidth: '600px',
                            mx: 'auto',
                        }}
                    >
                        Acompanhe o histórico e status de todas as suas coletas agendadas
                    </Typography>
                </Box>

                {/* Cartões de estatísticas */}
                <Grid container spacing={3} sx={{ mb: 4, justifyContent: 'center' }}>
                    <Grid sx={{ xs: 12, sm: 4 }}>
                        <Card
                            sx={{
                                bgcolor: 'primary.main',
                                color: 'white',
                                borderRadius: 3,
                            }}
                        >
                            <CardContent sx={{ textAlign: 'center' }}>
                                <Recycling sx={{ fontSize: 40, mb: 1 }} />
                                <Typography variant="h4" fontWeight={700}>
                                    {stats.total}
                                </Typography>
                                <Typography variant="body1">
                                    Total de Coletas
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid sx={{ xs: 12, sm: 4 }}>
                        <Card
                            sx={{
                                bgcolor: 'secondary.main',
                                color: 'white',
                                borderRadius: 3,
                            }}
                        >
                            <CardContent sx={{ textAlign: 'center' }}>
                                <CalendarToday sx={{ fontSize: 40, mb: 1 }} />
                                <Typography variant="h4" fontWeight={700}>
                                    {stats.concluidas}
                                </Typography>
                                <Typography variant="body1">
                                    Coletas Concluídas
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid sx={{ xs: 12, sm: 4 }}>
                        <Card
                            sx={{
                                bgcolor: '#3700ffff',
                                color: 'white',
                                borderRadius: 3,
                            }}
                        >
                            <CardContent sx={{ textAlign: 'center' }}>
                                <CalendarToday sx={{ fontSize: 40, mb: 1 }} />
                                <Typography variant="h4" fontWeight={700}>
                                    {stats.em_andamento}
                                </Typography>
                                <Typography variant="body1">
                                    Coletas Em andamento
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid sx={{ xs: 12, sm: 4 }}>
                        <Card
                            sx={{
                                bgcolor: '#ff7b00ff',
                                color: 'white',
                                borderRadius: 3,
                            }}
                        >
                            <CardContent sx={{ textAlign: 'center' }}>
                                <CalendarToday sx={{ fontSize: 40, mb: 1 }} />
                                <Typography variant="h4" fontWeight={700}>
                                    {stats.agendada}
                                </Typography>
                                <Typography variant="body1">
                                    Coletas Agendada
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid sx={{ xs: 12, sm: 4 }}>
                        <Card
                            sx={{
                                bgcolor: '#f02222ff',
                                color: 'white',
                                borderRadius: 3,
                            }}
                        >
                            <CardContent sx={{ textAlign: 'center' }}>
                                <CalendarToday sx={{ fontSize: 40, mb: 1 }} />
                                <Typography variant="h4" fontWeight={700}>
                                    {stats.canceladas}
                                </Typography>
                                <Typography variant="body1">
                                    Coletas Cancelada
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>


                {/* Filtros */}
                <Paper
                    elevation={2}
                    sx={{
                        p: 3,
                        mb: 3,
                        borderRadius: 3,
                    }}
                >
                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        spacing={2}
                        alignItems={{ md: 'center' }}
                    >
                        <TextField
                            fullWidth
                            placeholder="Buscar por localização ou tipo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search color="action" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ flex: 2 }}
                        />

                        <TextField
                            select
                            label="Status"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            sx={{ flex: 1 }}
                        >
                            <MenuItem value="todos">Todos os Status</MenuItem>
                            <MenuItem value="agendada">Agendada</MenuItem>
                            <MenuItem value="em_andamento">Em Andamento</MenuItem>
                            <MenuItem value="concluida">Concluída</MenuItem>
                            <MenuItem value="cancelada">Cancelada</MenuItem>
                        </TextField>

                        <TextField
                            select
                            label="Tipo de Resíduo"
                            value={tipoFilter}
                            onChange={(e) => setTipoFilter(e.target.value)}
                            sx={{ flex: 1 }}
                        >
                            <MenuItem value="todos">Todos os Tipos</MenuItem>
                            <MenuItem value="Plástico">Plástico</MenuItem>
                            <MenuItem value="Papel">Papel</MenuItem>
                            <MenuItem value="Vidro">Vidro</MenuItem>
                            <MenuItem value="Metal">Metal</MenuItem>
                            <MenuItem value="Eletrônicos">Eletrônicos</MenuItem>
                            <MenuItem value="Orgânicos">Orgânicos</MenuItem>
                            <MenuItem value="Misto">Misto</MenuItem>
                        </TextField>
                    </Stack>
                </Paper>

                {/* Tabela */}
                <Paper
                    elevation={2}
                    sx={{
                        borderRadius: 3,
                        overflow: 'hidden',
                    }}
                >
                    <TableContainer>
                        <Table>
                            <TableHead sx={{ bgcolor: 'primary.main' }}>
                                <TableRow>
                                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>ID</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Data e Hora</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Localização</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Tipo de Resíduo</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Status</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Peso (kg)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredColetas?.map((coleta, index) => (
                                    <TableRow
                                        key={coleta.id_coleta}
                                        sx={{
                                            '&:hover': {
                                                bgcolor: 'action.hover',
                                            },
                                        }}
                                    >
                                        <TableCell sx={{ fontWeight: 600 }}>#{index + 1}</TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                {formatDate(coleta.data)}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                {coleta.localizacao}
                                            </Box>
                                        </TableCell>
                                        <TableCell>{coleta.tipos_residuos}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={coleta.status.replace('_', ' ').toUpperCase()}
                                                color={getStatusColor(coleta.status) as any}
                                                size="small"
                                                variant="filled"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {coleta.peso_total ? `${coleta.peso_total} kg` : '-'}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {filteredColetas?.length === 0 && (
                        <Box sx={{ p: 4, textAlign: 'center' }}>
                            <Typography variant="h6" color="text.secondary">
                                Nenhuma coleta encontrada
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Tente ajustar os filtros de busca
                            </Typography>
                        </Box>
                    )}
                </Paper>
            </Container>
        </Box>
    );
};

export default TabelColetas;