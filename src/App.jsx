import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useState, Suspense, lazy } from 'react';

import ProtectedRoute from './components/ProtectedRoute';
import SpinnerFullPage from './components/SpinnerFullPage/SpinnerFullPage';

const Welcome = lazy(() => import('./pages/Welcome/Welcome'));
const LogIn = lazy(() => import('./pages/LogIn/LogIn'));
const MainPage = lazy(() => import('./pages/MainPage/MainPage'));
const PageNotFound = lazy(() => import('./pages/PageNotFound'));
const DogsList = lazy(() => import('./pages/DogsList/DogsList'));
const NewSession = lazy(() => import('./pages/NewSession/NewSession'));
const AddDog = lazy(() => import('./pages/AddDog/AddDog'));
const TrainingPlan = lazy(() => import('./pages/TrainingPlan/TrainingPlan'));
const Trials = lazy(() => import('./pages/Trials/Trials'));
// const VideoRecorder = lazy(() =>
//   import('./pages/VideoRecording/VideoRecording')
// );
const EndSession = lazy(() => import('./pages/EndSession/EndSession'));
const SessionOverview = lazy(() =>
  import('./pages/SessionOverview/SessionOverview')
);
const ContinueTrials = lazy(() =>
  import('./pages/ContinueTrials/ContinueTrials')
);
const ResetPassword = lazy(() =>
  import('./components/ResetPassword/ResetPassword')
);
const SessionsPage = lazy(() => import('./pages/SessionsPage/SessionsPage'));
const SessionTrainProgOverw = lazy(() =>
  import('./pages/SessionTrainProgOverw/SessionTrainProgOverw')
);
const DogAnalysis = lazy(() => import('./pages/DogAnalysis/DogAnalysis'));

function App() {
  const [trials, setTrials] = useState(10);

  return (
    <BrowserRouter>
      <Suspense fallback={<SpinnerFullPage />}>
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
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
