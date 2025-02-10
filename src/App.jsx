import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Welcome from './pages/Welcome/Welcome';
import LogIn from './pages/LogIn/LogIn';
import MainPage from './pages/MainPage/MainPage';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';
import Register from './pages/Register/Register';
import PageNotFound from './pages/PageNotFound';
import DogsList from './pages/DogsList/DogsList';
import NewSession from './pages/NewSession/NewSession';
import Analysis from './pages/Analysis/Analysis';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Welcome />} />
        <Route path="login" element={<LogIn />} />
        <Route path="forgotpassword" element={<ForgotPassword />} />
        <Route path="register" element={<Register />} />
        <Route path="mainpage" element={<MainPage />} />
        <Route path="create_session" element={<NewSession />} />
        <Route path="analysis" element={<Analysis />} />
        <Route path="dogs" element={<DogsList />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
