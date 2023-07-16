import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate} from 'react-router-dom';
import {  PrivateRoutes, PublicRoutes } from './routes/routes';
import AuthGuard from './guards/guard-routes';

const LoginScreen = lazy( () => import('./pages/Login/Login'));
const HomeScreen = lazy( () => import('./pages/Home/Home'));
const UnidadesScreen = lazy( () => import('./pages/Unidades/Unidades'));
const CreateUnidadScreen = lazy( () => import('./pages/Unidades/CreateUnidad'));


function App() {
  return (
    <Suspense fallback={<p>Loading ...</p>}>
      <Routes>
        <Route path="/" element={<Navigate replace to={PrivateRoutes.home} />} />
        <Route path='*' element={"NOT FOUND"} />
        <Route path='login' element={<LoginScreen />} />
        
        <Route element={<AuthGuard />}>
          <Route path={PrivateRoutes.home} element={<HomeScreen />} />
          <Route path={PrivateRoutes.unidades} element={<UnidadesScreen />} />
          <Route path={PrivateRoutes.newUnidad} element={<CreateUnidadScreen />} />
        </Route>
      </Routes>
    </Suspense>
)
}

export default App
