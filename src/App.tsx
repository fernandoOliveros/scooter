import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate} from 'react-router-dom';
import {  PrivateRoutes } from './routes/routes';
import AuthGuard from './guards/guard-routes';

const LoginScreen = lazy( () => import('./pages/Login/Login'));
const HomeScreen = lazy( () => import('./pages/Home/Home'));

//todo:  UNIDADES
const UnidadesScreen = lazy( () => import('./pages/Unidades/Unidades'));
const CreateUnidadScreen = lazy( () => import('./pages/Unidades/CreateUnidad'));
const EditUnidadScreen = lazy( () => import('./pages/Unidades/EditUnidad'));

//todo: OPERADORES
const OperadoresScreen = lazy( () => import('./pages/Operadores/Operadores'));
const CreateOperadoresScreen = lazy( () => import('./pages/Operadores/CreateOperador'));


function App() {
  return (
    <Suspense fallback={<p>Loading ...</p>}>
      <Routes>
        <Route path="/" element={<Navigate replace to={PrivateRoutes.home} />} />
        <Route path='*' element={"NOT FOUND"} />
        <Route path='login' element={<LoginScreen />} />
        
        <Route element={<AuthGuard />}>
          {/* HOME */}
          <Route path={PrivateRoutes.home} element={<HomeScreen />} />

          {/* UNIDADES*/}
          <Route path={PrivateRoutes.unidades} element={<UnidadesScreen />} />
          <Route path={PrivateRoutes.newUnidad} element={<CreateUnidadScreen />} />
          <Route path={PrivateRoutes.editUnidad} element={<EditUnidadScreen />} />


          {/* OPERADORES*/}
          <Route path={PrivateRoutes.operadores} element={<OperadoresScreen />} />
          <Route path={PrivateRoutes.newOperador} element={<CreateOperadoresScreen />} />
          <Route path={PrivateRoutes.editOperador} element={<EditUnidadScreen />} />
        </Route>
      </Routes>
    </Suspense>
)
}

export default App
