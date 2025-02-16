import { Fragment, useEffect, useState } from 'react'
import { getDocumentsUnidad } from '../../../services/unidades/unidades.service';
import '../../../styles/dist/verAchivos.css';

export interface Props {
    id_Documento: number
}

const ViewDocuments = ({id_Documento = 0}: Props) => {
    const [docs, setDocs] = useState({url_TarjetaCirculacion: "", url_Factura: "", url_PermisoSCT: ""});
    const loadDocumentos = getDocumentsUnidad(id_Documento);

    useEffect( () => {
        const getRequest = async() => {
            if (id_Documento !== 0){
                let result = await loadDocumentos.call;
                if(result.status === 200){
                    let data = result.data.data;
                    let arregloDocs = {
                        url_TarjetaCirculacion: data.url_TarjetaCirculacion, 
                        url_Factura: data.url_Factura, 
                        url_PermisoSCT: data.url_PermisoSCT
                    }
                    setDocs({...docs, ...arregloDocs});
                }
            }
        }
        getRequest();
    },[]);

    const AbrirDocumento = (e: any) =>{
        e.preventDefault();
        var file = "http://localhost:5001/" + e.target.id; 
        window.open( file, "_blank"  );
    }

    return (
        <Fragment>
            <h4 className="card-title">Descargar Documentos</h4>
            <hr></hr>
            <div className="row">
                <div className="col-md-4 col-lg-4 col-sm-4 col-xs-12 mb-4">
                    <button className='documentos-btn' onClick={AbrirDocumento} id={docs.url_TarjetaCirculacion}  type='button'>Descargar Tarjeta de Circulacion</button>
                </div>
                <div className="col-md-4 col-lg-4 col-sm-4 col-xs-12  mb-4">
                    <button className='documentos-btn' onClick={AbrirDocumento} id={docs.url_Factura} type='button'>Descargar Factura</button>
                </div>
                <div className="col-md-4 col-lg-4 col-sm-4 col-xs-12  mb-4">
                    <button className='documentos-btn' onClick={AbrirDocumento} id={docs.url_PermisoSCT} type='button'>Descargar Permiso SCT</button>
                </div>
            </div>
        </Fragment>
    )
}

export default ViewDocuments;