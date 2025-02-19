import { Fragment } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Menu from '../../components/shared/Menu'
import ViajeForm from './Form/ViajeForm'
import Swal from 'sweetalert2'
import FormViaje from './Form/FormViaje'

const CreateViaje = () => {
     //todo: variables
     const navigate = useNavigate();

    const returnFormCreateViaje = (success: boolean) => {
        if(success){
            navigate("/viajes");
        }else{
            Swal.fire({ icon: 'error', title: 'Ocurrio un error', text: 'No se pudo dar de alta el viaje, verifica que esten todos los campos con (*) llenos', showConfirmButton: true });
        }
    }

    return (
        <Fragment>
            <div className="container-fluid">
                <div className="row page-titles">
                    <div className="col-md-5 col-sm-12 col-xs-12  align-self-center">
                        <h3 className="card-title">Crear Viaje</h3>
                    </div>
                    <div className="col-md-7 col-sm-12 col-xs-12 align-self-center text-end">
                        <div className="d-flex justify-content-end align-items-center">
                            <ol className="breadcrumb justify-content-end">
                                <li className="breadcrumb-item"><Link to="/home">Home</Link></li>
                                <li className="breadcrumb-item"><Link to="/viajes">Viajes</Link></li>
                                <li className="breadcrumb-item active">Crear</li>
                            </ol>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <ViajeForm returnFormCreateViaje={returnFormCreateViaje} />
                    {/* <FormViaje returnFormViaje={returnFormCreateViaje}/> */}
                </div>
            </div>
            <Menu />
        </Fragment>
    )
}

export default CreateViaje