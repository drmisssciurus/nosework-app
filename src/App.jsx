import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Welcome from './pages/Welcome/Welcome';
import LogIn from './pages/LogIn/LogIn';
import MainPage from './pages/MainPage/MainPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Welcome />} />
        <Route path="login" element={<LogIn />} />
        <Route path="mainpage" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
