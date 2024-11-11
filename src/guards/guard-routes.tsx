import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootStore } from '../redux/store';
import { PublicRoutes } from '../routes/routes';


const AuthGuard = () => {
  const userState = useSelector( (store: RootStore) => store.user);
  return userState.token ? <Outlet /> : <Navigate replace to={PublicRoutes.login}/>;
}

export default AuthGuard;