import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import Menu from '../../components/shared/Menu'
import ViajeForm from './Form/ViajeForm'

const CreateViaje = () => {
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
                <ViajeForm />
            </div>
        </div>
        <Menu />
    </Fragment>
  )
}

export default CreateViaje