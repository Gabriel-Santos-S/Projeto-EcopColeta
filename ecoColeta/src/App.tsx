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
import Login from './pages/Login';
import ReceiveCollection from './pages/ReceiveCollection';
import { UserProvider } from './UserContext';
import Admin from './pages/Admin';

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
    <UserProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>

            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/home/minhasColetas" element={<MyColetas />} />

            {/* ADMIN */}
            <Route path="/adm" element={<Admin />} />
            <Route path="/adm/cadastroEmpresa" element={<EmpresaCadastro />} />
            <Route path="/adm/cadastroCooperativa" element={<CadastraCooperativa />} />
            <Route path="/adm/cadastroPontoColeta" element={<PontoColetaCadastro />} />

            {/* Ponto Coleta */}
            <Route path="/receber" element={<ReceiveCollection />} />
            <Route path="/receber/coleta/:id" element={<ReceberColeta />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;