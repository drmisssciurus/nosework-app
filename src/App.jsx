import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useState } from 'react';

import ProtectedRoute from './components/ProtectedRoute';

import Welcome from './pages/Welcome/Welcome';
import LogIn from './pages/LogIn/LogIn';
import MainPage from './pages/MainPage/MainPage';
import PageNotFound from './pages/PageNotFound';
import DogsList from './pages/DogsList/DogsList';
import NewSession from './pages/NewSession/NewSession';
import AddDog from './pages/AddDog/AddDog';
import TrainingPlan from './pages/TrainingPlan/TrainingPlan';
import Trials from './pages/Trials/Trials';
import VideoRecorder from './pages/VideoRecording/VideoRecording';
import EndSession from './pages/EndSession/EndSession';
import SessionOverview from './pages/SessionOverview/SessionOverview';
import ContinueTrials from './pages/ContinueTrials/ContinueTrials';
import ResetPassword from './components/ResetPassword/ResetPassword';
import SessionsPage from './pages/SessionsPage/SessionsPage';
import SessionTrainProgOverw from './pages/SessionTrainProgOverw/SessionTrainProgOverw';
import DogAnalysis from './pages/DogAnalysis/DogAnalysis';

function App() {
  const [trials, setTrials] = useState(10);

  return (
    <BrowserRouter>
      <Routes>
        {/* This pages for all users */}
        <Route index element={<Welcome />} />
        <Route path="login" element={<LogIn />} />
        <Route path="reset_password" element={<ResetPassword />} />

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
          <Route path="trials" element={<Trials />} />
          <Route path="continue_trials" element={<ContinueTrials />} />
          {/* <Route path="video_recording" element={<VideoRecorder />} /> */}
          <Route path="end_session" element={<EndSession />} />
          <Route
            path="session_overview/:sessionId"
            element={<SessionOverview />}
          />
          <Route
            path="session_pdf/:sessionId"
            element={<SessionTrainProgOverw />}
          />
          <Route path="sessions_page" element={<SessionsPage />} />
          <Route path="dogs" element={<DogsList />} />
          <Route path="dog_analysis/:id" element={<DogAnalysis />} />
          <Route path="add_dog" element={<AddDog />} />
        </Route>

        {/* Page 404 */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
