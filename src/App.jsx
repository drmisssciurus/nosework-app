import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useState } from 'react';

import ProtectedRoute from './components/ProtectedRoute';

import Welcome from './pages/Welcome/Welcome';
import LogIn from './pages/LogIn/LogIn';
import MainPage from './pages/MainPage/MainPage';
import PageNotFound from './pages/PageNotFound';
import DogsList from './pages/DogsList/DogsList';
import NewSession from './pages/NewSession/NewSession';
import Analysis from './pages/Analysis/Analysis';
import AddDog from './pages/AddDog/AddDog';
import TrainingPlan from './pages/TrainingPlan/TrainingPlan';
import Trials from './pages/Trials/Trials';
import VideoRecorder from './pages/VideoRecording/VideoRecording';
import EndSession from './pages/EndSession/EndSession';

function App() {
  const [trials, setTrials] = useState(10);

  return (
    <BrowserRouter>
      <Routes>
        {/* This pages for all users */}
        <Route index element={<Welcome />} />
        <Route path="login" element={<LogIn />} />
        <Route path="trials" element={<Trials />} />
        <Route path="video_recording" element={<VideoRecorder />} />
        <Route path="end_session" element={<EndSession />} />

        {/* For logged in users */}
        <Route element={<ProtectedRoute />}>
          <Route path="mainpage" element={<MainPage />} />
          <Route
            path="create_session"
            element={<NewSession setTrials={setTrials} trials={trials} />}
          />
          <Route
            path="training_plan"
            element={<TrainingPlan trials={trials} />}
          />
          <Route path="analysis" element={<Analysis />} />
          <Route path="dogs" element={<DogsList />} />
          <Route path="add_dog" element={<AddDog />} />
        </Route>

        {/* Page 404 */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
