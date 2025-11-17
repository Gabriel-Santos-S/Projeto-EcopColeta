import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { theme } from "./theme";
import Home from "./pages/Home";
import NotFound from './pages/NotFound';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyColetas from './pages/MyColetas';
import EmpresaCadastro from './pages/EmpresaCadastro';
import CadastraCooperativa from './components/CadastraCooperativa';
import PontoColetaCadastro from './pages/PontoColetaCadastro';
import ReceberColeta from './components/ReceberColeta';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/minhasColetas" element={<MyColetas />} />

          {/* ADMIN */}
          <Route path="/cadastro/cadastroEmpresa" element={<EmpresaCadastro />} />
          <Route path="/cadastro/cadastroCooperativa" element={<CadastraCooperativa />} />
          <Route path="/cadastro/cadastroPontoColeta" element={<PontoColetaCadastro />} />

          {/* Ponto Coleta */}
          <Route path="/receber/coleta" element={<ReceberColeta />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;