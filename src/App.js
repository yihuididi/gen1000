import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './components/home/home';
import { Login } from './components/login';
import { Register } from './components/register';
import { Board } from './components/board/board';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/board" element={<Board />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
