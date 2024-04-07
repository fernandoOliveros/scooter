import { Fragment } from 'react'
import MenuBar from "../../components/shared/Menu"
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import FormRemolque from './Form/FormRemolque';

const CreateRemolque = () => {
    const navigate = useNavigate();
    
    const catchResponseForm = (success: boolean) => {
        if(success){
            navigate("/remolques");
        }else{
            Swal.fire({ icon: 'error', title: 'Ocurrio un error', text: 'No se pudo dar el remolque, verifica que esten todos los campos con (*) llenos', showConfirmButton: true });
        }
    }
    return (
        <Fragment>
            <div className="container-fluid">
                <div className="row page-titles">
                    <div className="col-md-5 col-sm-12 col-xs-12  align-self-center">
                        <h3 className="card-title">Crear Remolque</h3>
                    </div>
                    <div className="col-md-7 col-sm-12 col-xs-12 align-self-center text-end">
                        <div className="d-flex justify-content-end align-items-center">
                            <ol className="breadcrumb justify-content-end">
                                <li className="breadcrumb-item"><Link to="/home">Home</Link></li>
                                <li className="breadcrumb-item"><Link to="/remolques">Remolques</Link></li>
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
                                    <FormRemolque returnFormRemolque={catchResponseForm}/>
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

export default CreateRemolque