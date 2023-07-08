import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate} from 'react-router-dom';
import {  PublicRoutes } from './routes/routes';

const LoginScreen = lazy( () => import('./pages/Login/Login'));

function App() {
  return (
    <Suspense fallback={<p>Loading ...</p>}>
      <Routes>
        <Route path="/" element={<Navigate replace to={PublicRoutes.login} />} />
        <Route path='*' element={"NOT FOUND"} />
        <Route path='login' element={<LoginScreen />} />
      </Routes>
    </Suspense>
)
}

export default App
