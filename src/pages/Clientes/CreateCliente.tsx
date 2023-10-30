import  { Fragment } from 'react'
import MenuBar from "../../components/shared/Menu";
import { Link, useNavigate } from 'react-router-dom';
import ClienteForm from './Form/ClienteForm';
import Swal from 'sweetalert2';

function CreateCliente() {
  const navigate = useNavigate();
  const catchResponseForm = (success: boolean) => {
    if(success){
      navigate("/clientes");
    }else{
      Swal.fire({ icon: 'error', title: 'Ocurrio un error', text: 'No se pudo dar de alta el clinete, verifica que esten todos los campos con (*) llenos', showConfirmButton: true });
    }
  }
  return (
    <Fragment>
      <div className="container-fluid">
        <div className="row page-titles">
            <div className="col-md-5 col-sm-12 col-xs-12">
                <h2 className="card-title">Clientes</h2>
            </div>
            <div className="col-md-7 col-sm-12 col-xs-12">
                <div className="d-flex justify-content-end align-items-center">
                    <ol className="breadcrumb justify-content-end">
                        <li className="breadcrumb-item"><Link to="/home">Home</Link></li>
                        <li className="breadcrumb-item"><Link to="/cliente">Clientes</Link></li>
                        <li className="breadcrumb-item active">Crear</li>
                    </ol>
                </div>
            </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className='row'>
              <div className='col-12'>
                  <ClienteForm returnFormCliente={catchResponseForm}/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MenuBar />
    </Fragment>
  )
}

export default CreateCliente