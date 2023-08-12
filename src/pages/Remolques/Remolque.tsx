import React, { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { RootStore } from '../../redux/store';
import { IRemolqueModel } from '../../models/remolques/remolque.model';
import { getRemolques } from '../../services/remolques/remolques.service';
import { Link, useNavigate } from 'react-router-dom';
import DateFormatFix from '../../utils/DateFormatFix';
import MenuBar from "../../components/shared/Menu"
import DeleteIcon from '@mui/icons-material/Delete';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import VisibilityIcon from '@mui/icons-material/Visibility';

const Remolque = () => {
    const userState = useSelector((store: RootStore) => store.user);
    let navigate = useNavigate();

    //todo: Variables
    const [remolques, setRemolques] = useState<IRemolqueModel[]>([]);
    const loadRemolques = getRemolques(userState.user.id_Empresa);

    useEffect(() => {
        const useGet = async() => {
            try{
                const response = await loadRemolques.call;
                if(response.data.success)
                    setRemolques(response.data.data);
                console.log(response.data);
            }catch(error){
                alert("error");
            }
        };
        useGet();
        // Desmontamos componente
        return() => { loadRemolques.controller.abort() };
    },[]);


    const crearRemolque = () => navigate("crear");

    const EditarRemolque = (id: number) => navigate("editar/" + id);

    const EliminarRemolque = (id: number) => console.log(id);

    const viewDocuments = () => {
    }

    return (
        <Fragment>
            <div className="container-fluid">
                <div className="row page-titles">
                    <div className="col-md-5 col-sm-12 col-xs-12">
                        <h2 className="card-title">Remolques</h2>
                    </div>
                    <div className="col-md-7 col-sm-12 col-xs-12">
                        <div className="d-flex justify-content-end align-items-center">
                            <ol className="breadcrumb justify-content-end">
                                <li className="breadcrumb-item"><Link to="/home">Home</Link></li>
                                <li className="breadcrumb-item active">Remolques</li>
                            </ol>
                        </div>
                    </div>
                </div>
                <div className='card'>
                    <div className='card-body'>
                        <div className='row'>
                            <div className='col-md-5 col-sm-12 col-xs-12'>
                                <h4 className="card-title">Remolques Registrados ({remolques.length})</h4>
                            </div>
                            <div className='col-md-7 col-sm-12 col-xs-12 text-end'>
                                <button className="btn btn-primary btn-rounded" type="button" onClick={crearRemolque}><i className="fa fa-plus-circle"></i> Remolque</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='row'>
                    { remolques.map( 
                    ( remolque, i ) => {
                    return (
                        <div className='col-md-6 col-xs-12 col-sm-12' key={i}>
                            <div className="card">
                                <div className="card-body">
                                    <div className='row'>
                                        <div className='col-md-12 col-sm-12 col-xs-12'>
                                            <h3 className="card-title">Eco: {remolque.st_Economico}</h3>
                                        </div>
                                        <div className='mr-5 col-md-12 col-sm-12 col-xs-12'>
                                            <ul className="list-inline">
                                                <li>
                                                    <button className="btn btn-sm btn-outline-success btn-rounded" type="button" onClick={() => viewDocuments()}><VisibilityIcon /> Ver</button>
                                                </li>
                                                <li>
                                                    <button className="btn btn-sm btn-outline-info btn-rounded" type="button" onClick={() => EditarRemolque(remolque.id_Remolque)}><MiscellaneousServicesIcon /> Editar</button>
                                                </li>
                                                <li>
                                                    <button className="btn btn-sm btn-outline-danger btn-rounded" type="button" onClick={() => EliminarRemolque(remolque.id_Remolque)}><DeleteIcon /> Borrar</button>
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
                                            <p className='text-desc'>{remolque.st_Marca}</p>
                                            <p className='text-desc'>(Año): {remolque.st_Anio}</p>
                                            <p className='text-desc'>(Fecha Físico Mecánico): {new DateFormatFix(new Date(remolque.date_VigenciaFM+"T00:00:00")).getFormatName()}</p>
                                        </div>
                                        <div className='col-md-6 col-sm-12 col-xs-12 col-lg-6'>
                                            <p className='text-desc'>(# de Serie): {remolque.st_NumSerie}</p>
                                            <p className='text-desc'>(Placas): {remolque.st_Placa}</p>
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

export default Remolque