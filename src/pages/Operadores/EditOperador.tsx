import { Fragment } from 'react'
import OperadorForm from './Form/OperadorForm';
import MenuBar from "../../components/shared/Menu"
import { Link, useParams } from 'react-router-dom'
const  EditOperador = () => {
    //todo: Obtenemos el idOperador de la ruta
    const {idOperador} = useParams();
    return (
        <Fragment>
            <div className="container-fluid">
                <div className="row page-titles">
                    <div className="col-md-5 col-sm-12 col-xs-12  align-self-center">
                        <h3 className="card-title">Crear operador</h3>
                    </div>
                    <div className="col-md-7 col-sm-12 col-xs-12 align-self-center text-end">
                        <div className="d-flex justify-content-end align-items-center">
                            <ol className="breadcrumb justify-content-end">
                                <li className="breadcrumb-item"><Link to="/home">Home</Link></li>
                                <li className="breadcrumb-item active">Crear</li>
                            </ol>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="card">
                        <div className="card-body">
                            <div className='row'>
                                <div className='col-12'>
                                    <OperadorForm id_Operador={idOperador} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <MenuBar />
        </Fragment>
    )
}

export default EditOperador;