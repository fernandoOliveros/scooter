import  { Fragment } from 'react'
import MenuBar from "../../components/shared/Menu";
import { Link, useNavigate } from 'react-router-dom';


function Clientes() {
    let navigate = useNavigate();
    const createFactura = () => navigate("crear");
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
                            <li className="breadcrumb-item active">Clientes</li>
                        </ol>
                    </div>
                </div>
            </div>
            <div className='card'>
                <div className='card-body'>
                    <div className='row'>
                        <div className='col-md-5 col-sm-12 col-xs-12'>
                            <h4 className="card-title">Clientes registrados ()</h4>
                        </div>
                        <div className='col-md-7 col-sm-12 col-xs-12 text-end'>
                            <button onClick={createFactura} className="btn btn-primary btn-rounded" type="button"><i className="fa fa-plus-circle"></i> Cliente</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='row'>
            </div>
        </div>
        <MenuBar />
    </Fragment>
    )
}

export default Clientes