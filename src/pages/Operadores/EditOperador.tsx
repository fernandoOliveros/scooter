import { Fragment } from 'react'
import MenuBar from "../../components/shared/Menu"
import { Link, useNavigate, useParams } from 'react-router-dom'
import Swal from 'sweetalert2';
import FormOperador from './Form/FormOperador';
const  EditOperador = () => {
    //todo: params / variables
    const { idOperador } = useParams();
    const navigate = useNavigate();

    const catchResponseForm = (success: boolean) => {
        if(success){
            navigate("/operadores");
        }else{
            Swal.fire({ icon: 'error', title: 'Ocurrio un error', text: 'No se edito la información del operador, verifica que esten todos los campos con (*) llenos', showConfirmButton: true });
        }
    }
    return (
        <Fragment>
            <div className="container-fluid">
                <div className="row page-titles">
                    <div className="col-md-5 col-sm-12 col-xs-12  align-self-center">
                        <h3 className="card-title">Editar operador</h3>
                    </div>
                    <div className="col-md-7 col-sm-12 col-xs-12 align-self-center text-end">
                        <div className="d-flex justify-content-end align-items-center">
                            <ol className="breadcrumb justify-content-end">
                                <li className="breadcrumb-item"><Link to="/home">Home</Link></li>
                                <li className="breadcrumb-item"><Link to="/operadores">operadores</Link></li>
                            <li className="breadcrumb-item active">Editar operador</li>
                            </ol>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="card">
                        <div className="card-body">
                            <div className='row'>
                                <div className='col-12'>
                                    <FormOperador id_Operador={parseInt(idOperador ?? '0')} returnFormOperador={catchResponseForm} />
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