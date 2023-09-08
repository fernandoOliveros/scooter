import { Fragment } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import MenuBar from "../../components/shared/Menu";

function CartaPortes() {
    
    let navigate = useNavigate();

    //todo: FUNCIONES GLOBALES
    const createCartaPorte = () => navigate("crear");
    return (
        <Fragment>
            <div className="container-fluid">
                <div className="row page-titles">
                    <div className="col-md-5 col-sm-12 col-xs-12">
                        <h2 className="card-title">Cartas Porte</h2>
                    </div>
                    <div className="col-md-7 col-sm-12 col-xs-12">
                        <div className="d-flex justify-content-end align-items-center">
                            <ol className="breadcrumb justify-content-end">
                                <li className="breadcrumb-item"><Link to="/home">Home</Link></li>
                                <li className="breadcrumb-item active">Cartas porte</li>
                            </ol>
                        </div>
                    </div>
                </div>
                <div className='card'>
                    <div className='card-body'>
                        <div className='row'>
                            <div className='col-md-5 col-sm-12 col-xs-12'>
                                <h4 className="card-title">Cartas Porte generadas ()</h4>
                            </div>
                            <div className='col-md-7 col-sm-12 col-xs-12 text-end'>
                                <button onClick={createCartaPorte} className="btn btn-primary btn-rounded" type="button"><i className="fa fa-plus-circle"></i> Carta Porte</button>
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

export default CartaPortes