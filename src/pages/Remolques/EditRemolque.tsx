import { Fragment } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import MenuBar from "../../components/shared/Menu"
import RemolqueForm from './Form/RemolqueForm';
import Swal from 'sweetalert2';

function EditRemolque() {
  const { idRemolque } = useParams();
  const navigate = useNavigate();

  const catchResponseForm = (success: boolean) => {
    if(success){
        navigate("/remolques");
    }else{
        Swal.fire({ icon: 'error', title: 'Ocurrio un error', text: 'No se pudo editar el remolque, verifica que esten todos los campos con (*) llenos', showConfirmButton: true });
    }
}
  return (
    <Fragment>
        <div className="container-fluid">
            <div className="row page-titles">
                <div className="col-md-5 col-sm-12 col-xs-12  align-self-center">
                    <h3 className="card-title">Editar Remolque</h3>
                </div>
                <div className="col-md-7 col-sm-12 col-xs-12 align-self-center text-end">
                    <div className="d-flex justify-content-end align-items-center">
                        <ol className="breadcrumb justify-content-end">
                            <li className="breadcrumb-item"><Link to="/home">Home</Link></li>
                            <li className="breadcrumb-item"><Link to="/remolques">Remolques</Link></li>
                            <li className="breadcrumb-item active">Editar remolque</li>
                        </ol>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="card">
                    <div className="card-body">
                        <div className='row'>
                            <div className='col-12'>
                                <RemolqueForm id_Remolque={idRemolque} returnFormRemolque={catchResponseForm}/>
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

export default EditRemolque