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
const EditOperadoresScreen = lazy( () => import('./pages/Operadores/EditOperador'));

//todo: REMOLQUES
const RemolquesScreen = lazy( () => import('./pages/Remolques/Remolque'));
const CreateRemolquesScreen = lazy( () => import('./pages/Remolques/CreateRemolque'));
const EditRemolquesScreen = lazy( () => import('./pages/Remolques/EditRemolque'));

//todo: CLIENTES
const ClientesScreen = lazy( () => import('./pages/Clientes/Clientes'));
const CreateCliente = lazy( () => import('./pages/Clientes/CreateCliente'));
const EditClientes = lazy( () => import('./pages/Clientes/EditCliente'));

//todo: VIAJES
const ViajesScreen = lazy(() => import('./pages/Viajes/Viajes'));
const CreateViajesScreen = lazy(() => import('./pages/Viajes/CreateViaje'));


//todo: CARTA PORTES
const CartaPortesScreen = lazy( () => import('./pages/CartaPortes/CartaPortes'));
const CreateCartaPorte = lazy(() => import('./pages/CartaPortes/CreateCartaPorte'));

//todo: FCTURACIÓN CFDI
const FacturasScreen = lazy( () => import('./pages/Facturas/Facturas') );
const CreateFactura = lazy( () => import('./pages/Facturas/CreateFactura') );


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
          <Route path={PrivateRoutes.editOperador} element={<EditOperadoresScreen />} />

          {/* REMOLQUES*/}
          <Route path={PrivateRoutes.remolques} element={<RemolquesScreen />} />
          <Route path={PrivateRoutes.newRemolques} element={<CreateRemolquesScreen />} />
          <Route path={PrivateRoutes.editRemolques} element={<EditRemolquesScreen />} />

          {/* CLIENTES*/}
          <Route path={PrivateRoutes.clientes} element={<ClientesScreen />} />
          <Route path={PrivateRoutes.newCliente} element={<CreateCliente />} />
          <Route path={PrivateRoutes.editCliente} element={<EditClientes />} />

          {/* VIAJES */}
          <Route path={PrivateRoutes.viajes} element={<ViajesScreen />} />
          <Route path={PrivateRoutes.viajes} element={<CreateViajesScreen />} />

          {/* CARTA PORTE */}
          <Route path={PrivateRoutes.cartaPorte} element={<CartaPortesScreen />}/>
          <Route path={PrivateRoutes.cartaPorteNew} element={<CreateCartaPorte />}/>

          {/* FACTURAS */}
          <Route path={PrivateRoutes.factura} element={<FacturasScreen />}/>
          <Route path={PrivateRoutes.newFactura} element={<CreateFactura />}/>


        </Route>
      </Routes>
    </Suspense>
)
}

export default App
