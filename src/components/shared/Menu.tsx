import {useState} from 'react';
import { useNavigate } from "react-router-dom";
import { Box, Backdrop, SpeedDial, SpeedDialAction } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import TelegramIcon from '@mui/icons-material/Telegram';
import ArchiveIcon from '@mui/icons-material/Archive';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import ArticleIcon from '@mui/icons-material/Article';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import WidgetsIcon from '@mui/icons-material/Widgets';
import { resetUser }  from '../../redux/auth/authSlicer';
import RvHookupIcon from '@mui/icons-material/RvHookup';

const actions = [
    { icon: <LogoutIcon />, name: 'Cerrar Sesión' , id: 'salir'  },
    { icon: <ArchiveIcon />, name: 'Gastos', id: 'gastos' },
    { icon: <ArticleIcon />, name: 'Facturación', id: 'facturas' },
    { icon: <WidgetsIcon />, name: 'Carta Porte', id: 'cartaPorte' },
    { icon: <TelegramIcon />, name: 'Viajes' , id: 'viajes' },
    { icon: <GroupIcon />, name: 'Operadores' , id: 'operadores'  },
    { icon: <RvHookupIcon />, name: 'Remolques' , id: 'remolques'  },
    { icon: <LocalShippingIcon />, name: 'Unidades' , id: 'unidades'  },
  ];


const Menu = () => {
  const [open, setOpen] = useState(false);
  const handleView = () => setOpen(!open);
  const navigate = useNavigate();
  //storage
  const dispatch = useDispatch();

  const Navegar = (e: string) => {
    if ( e === "salir" ){
      //Limpiamos localSotrage
      dispatch(resetUser());
      Swal.fire({ icon: 'success', title: 'Cerrando Sesión' , text: 'Saliendo del Sistema ...', timer: 1500, showConfirmButton:false});
      navigate("/", { replace : true });
    } else { navigate("/" + e, { replace : true }) }
  }
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Backdrop open={open} />
      <SpeedDial
        ariaLabel="Menu de Scooter"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<MenuIcon />}
        onClick={handleView}
        open={open}
      >
        {
        actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={() => Navegar(action.id)}
          />
        ))
        }
      </SpeedDial>
    </Box>
  )
}

export default Menu