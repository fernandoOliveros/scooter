import { Fragment, useEffect, useState } from 'react';
import { UnidadModel } from '../../models/unidades/unidad.model';
import { Link, useNavigate } from 'react-router-dom';
import { getUnidades } from '../../services/unidades/unidades.service';
import MenuBar from "../../components/shared/Menu"
import DeleteIcon from '@mui/icons-material/Delete';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DateFormatFix from '../../utils/DateFormatFix';
import { useSelector } from "react-redux";
import { RootStore } from "../../redux/store";


function Unidades () {
    //Store
    const userState = useSelector((store: RootStore) => store.user);
    const [ unidades, setUnidades ] = useState<UnidadModel[]>([])
    const loadUnidad = getUnidades(userState.user.id_Empresa);
    let navigate = useNavigate();

    useEffect(() => {
        const useGet = async() => {
            const response = await loadUnidad.call;
            if(response.data.success)
                setUnidades(response.data.data);
        };
        useGet();
        // Desmontamos componente
        return( loadUnidad.controller.abort() );
    },[]);
    

    const crearUnidad = () => {
        navigate("crear");
    }


    const EditarUnidad = (id: number) => {
        console.log(id);
    }

    const EliminarUnidad = (id: number) => {
        console.log(id);
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
                            <h4 className="card-title">Unidades Registradas ({unidades.length})</h4>
                        </div>
                        <div className='col-md-7 col-sm-12 col-xs-12 text-end'>
                            <button className="btn btn-primary btn-rounded" type="button" onClick={crearUnidad}><i className="fa fa-plus-circle"></i> Unidad</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='row'>
                { unidades.map( 
                ( unidad, i ) => {
                return (
                    <div className='col-md-6 col-xs-12 col-sm-12' key={i}>
                        <div className="card">
                            <div className="card-body">
                                <div className='row'>
                                    <div className='col-md-6 col-sm-12 col-xs-12'>
                                        <h3 className="card-title">Eco: {unidad.st_Economico}</h3>
                                    </div>
                                    <div className='col-md-6 col-sm-12 col-xs-12'>
                                        <ul className="list-inline">
                                            <li>
                                                <button className="btn btn-sm btn-outline-success btn-rounded" type="button" onClick={() => EditarUnidad(unidad.id_Unidad)}><VisibilityIcon /> Ver</button>
                                            </li>
                                            <li>
                                                <button className="btn btn-sm btn-outline-info btn-rounded" type="button" onClick={() => EditarUnidad(unidad.id_Unidad)}><MiscellaneousServicesIcon /> Editar</button>
                                            </li>
                                            <li>
                                                <button className="btn btn-sm btn-outline-danger btn-rounded" type="button" onClick={() => EliminarUnidad(unidad.id_Unidad)}><DeleteIcon /> Borrar</button>
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
                                        <p className='text-desc'>{unidad.st_Marca} - {unidad.st_SubMarca}</p>
                                        <p className='text-desc'>(Año): {unidad.st_Anio}</p>
                                        <p className='text-desc'>(Fecha Físico Mecánico): {new DateFormatFix(new Date(unidad.date_Mecanico+"T00:00:00")).getFormatName()}</p>
                                        <p className='text-desc'>(Fecha Ecológica): {new DateFormatFix(new Date(unidad.date_Ecologico+"T00:00:00")).getFormatName()}</p>
                                    </div>
                                    <div className='col-md-6 col-sm-12 col-xs-12 col-lg-6'>
                                        <p className='text-desc'>(# de Motor): {unidad.st_NumMotor}</p>
                                        <p className='text-desc'>(# de Serie): {unidad.st_NumSerie}</p>
                                        <p className='text-desc'>(Placas): {unidad.st_Placa}</p>
                                        <p className='text-desc'>(Estatus): <span style={{ fontWeight:'bold', color: (unidad.id_Candado === '1' ? "green" : "red")}}>{unidad.st_DescripcionCandado}</span></p>
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

export default Unidades