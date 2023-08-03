import { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { RootStore } from '../../redux/store';
import { getOperadoresByEmpresa } from '../../services/operadores/operadores.service';
import { OperadorModel } from '../../models/operadores/operador.model';
import MenuBar from "../../components/shared/Menu"
import DateFormatFix from '../../utils/DateFormatFix';
import DeleteIcon from '@mui/icons-material/Delete';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import VisibilityIcon from '@mui/icons-material/Visibility';

function Operadores() {
    //todo: VARIABLES
    const navigate = useNavigate();

    const [operadores, setOperadores] = useState<OperadorModel[]>([]);

    //todo: STORE
    const userState = useSelector((store: RootStore) => store.user);

    //todo: SERVICES
    const loadOperadores = getOperadoresByEmpresa(userState.user.id_Empresa);
    //todo: INITIAL
    useEffect( () => {
        const getInitial = async () => {
            try {
                const result = await loadOperadores.call;
                setOperadores(result.data.data);
            } catch (error) {
                alert("Error, al obtener los operadores de la empresa y/o empresa aún no tiene operadores cargados en el sistema");
                console.log(error);
            }
        }
        getInitial();
        return () => { loadOperadores.controller.abort(); }
    },[]);

    const crearOeprador = () => navigate("crear");

    const editarOperador = (id:number) => {
        navigate("editar/" + id, { replace: true });
    }

    return (
        <Fragment>
            <div className="container-fluid">
                <div className="row page-titles">
                    <div className="col-md-5 col-sm-12 col-xs-12">
                        <h2 className="card-title">Unidades</h2>
                    </div>
                    <div className="col-md-7 col-sm-12 col-xs-12">
                        <div className="d-flex justify-content-end align-items-center">
                            <ol className="breadcrumb justify-content-end">
                                <li className="breadcrumb-item"><Link to="/home">Home</Link></li>
                                <li className="breadcrumb-item active">Unidades</li>
                            </ol>
                        </div>
                    </div>
                </div>
                <div className='card'>
                    <div className='card-body'>
                        <div className='row'>
                            <div className='col-md-5 col-sm-12 col-xs-12'>
                                <h4 className="card-title">Unidades Registradas ({operadores.length})</h4>
                            </div>
                            <div className='col-md-7 col-sm-12 col-xs-12 text-end'>
                                <button className="btn btn-primary btn-rounded" type="button" onClick={crearOeprador}><i className="fa fa-plus-circle"></i> Unidad</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    { operadores.map( 
                    ( operador, i ) => {
                    return (
                        <div className='col-md-6 col-xs-12 col-sm-12' key={i}>
                            <div className="card">
                                <div className="card-body">
                                    <div className='row'>
                                        <div className='col-md-12 col-sm-12 col-xs-12'>
                                            <h3 className="card-title">Eco: {operador.st_Nombre}</h3>
                                        </div>
                                        <div className='mr-5 col-md-12 col-sm-12 col-xs-12'>
                                            <ul className="list-inline">
                                                <li>
                                                    <button className="btn btn-sm btn-outline-success btn-rounded" type="button" ><VisibilityIcon /> Ver</button>
                                                </li>
                                                <li>
                                                    <button className="btn btn-sm btn-outline-info btn-rounded" type="button" onClick={() => editarOperador(operador.id_Operador)}><MiscellaneousServicesIcon /> Editar</button>
                                                </li>
                                                <li>
                                                    <button className="btn btn-sm btn-outline-danger btn-rounded" type="button" onClick={() => editarOperador(operador.id_Operador)}><DeleteIcon /> Borrar</button>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-xs-12 col-sm-12 col-md-12 col-lg-12 mt-4'>
                                            <h5 className="card-title">Información General</h5>
                                            <hr></hr>
                                        </div>
                                        <div className='col-md-6 col-sm-12 col-xs-12 col-lg-6'>
                                            <p className='text-desc'>(CURP): {operador.st_CURP}</p>
                                            <p className='text-desc'>(RFC): {operador.st_RFC}</p>
                                            <p className='text-desc'>(# Licencia): {operador.st_NumLicencia}</p>
                                        </div>
                                        <div className='col-md-6 col-sm-12 col-xs-12 col-lg-6'>
                                            <p className='text-desc'>(Fecha de Nacimiento): {new DateFormatFix(new Date(operador.date_Nacimiento+"T00:00:00")).getFormatName()}</p>
                                            <p className='text-desc'>(Vigencia de Licencia){new DateFormatFix(new Date(operador.date_LicenciaVigencia+"T00:00:00")).getFormatName()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                )}
                </div>
            </div>
            <MenuBar />
        </Fragment>
    )
}

export default Operadores;