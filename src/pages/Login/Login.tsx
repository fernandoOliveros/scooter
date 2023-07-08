import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { ChangeEvent, useState } from 'react';
import useFetchAndLoad from '../../hooks/useFetchAndLoad';
import { useDispatch } from 'react-redux';
import loginService from '../../services/login/login.service';
import { loginModel } from '../../models/login/login.model';
import { createUser } from '../../redux/auth/authSlicer';

function Login() {
  //Form
  const [FormLogin, SetFormLogin] = useState<loginModel>({} as loginModel);
  const { loading, callEndpoint } = useFetchAndLoad(); //Custom Hooks to control http request
  const dispatch = useDispatch();

  //Functions
  const onChange = (e: ChangeEvent<HTMLFormElement | HTMLInputElement | HTMLTextAreaElement>): void => {
    SetFormLogin({...FormLogin, [ e.target.id] : e.target.value});
  }

  const onSubmit = async (e: any) => {
    e.preventDefault();
    const result = await callEndpoint(loginService(FormLogin));
    console.log(result);


    dispatch(createUser(result));
  }
  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7}
            sx={{
            backgroundImage: 'url(https://img.interempresas.net/fotos/2810933.jpeg)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
                t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            }}
        />
        
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
            <Box  sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center'}} >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Ingresa tus Credenciales
                </Typography>
                <Box component="form" onSubmit={e => onSubmit(e)} noValidate sx={{ mt: 1 }}>
                    <TextField margin="normal" type="email" id="st_Email" label="Usuario" name="st_Email" autoFocus required fullWidth onChange={ e => onChange(e)} autoComplete="off" />
                    <TextField margin="normal" name="st_Password" label="Contraseña" type="password" id="st_Password"  required fullWidth onChange={e => onChange(e)} autoComplete="off"/>
                    <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }} > Ingresar </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href="#" variant="body2">
                            Olvidaste tu Contraseña?
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Grid>
    </Grid>
  )
}

export default Login