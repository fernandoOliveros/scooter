import { Fragment, useEffect, useState } from 'react'
import { getDocumentsById, getDocumentsOperador } from '../../../services/operadores/operadores.service';
import '../../../styles/dist/verAchivos.css';

export interface Props {
    id_Documento: number
}

const viewDocumentsOperador = ({id_Documento = 0}: Props) => {

    const [docs, setDocs] = useState({url_RFC: '', url_CURP: '', url_ComprobanteDom: ''});
    const loadDocumentos = getDocumentsById(id_Documento);
    const uri = "http://localhost:5001/";

    const AbrirDocumento = (e: any) =>{
        e.preventDefault();
        var file = uri + e.target.id;
        console.log(file);
        window.open( file, "_blank"  );
    }

    useEffect( () => {
        const getRequest = async() => {
            if (id_Documento !== 0){
                let result = await loadDocumentos.call;
                try{
                    let data = result.data.data;
                    let arregloDocs = {
                        url_RFC: data.url_RFC, 
                        url_CURP: data.url_CURP, 
                        url_ComprobanteDom: data.url_ComprobanteDom
                    }
                    setDocs({...docs, ...arregloDocs});
                }catch (error) {
                    alert("Error, al obtener los documentos del operador");
                }
            }
        }
        getRequest();
    },[]);

    return (
        <Fragment>
            <h4 className="card-title">Mostrar Documentos</h4>
            <hr></hr>
            <div className="row">
                <div className="col-md-4 col-lg-4 col-sm-4 col-xs-12 mb-4">
                    <button className='documentos-btn' onClick={AbrirDocumento} id={docs.url_RFC}  type='button'>Descargar RFC</button>
                </div>
                <div className="col-md-4 col-lg-4 col-sm-4 col-xs-12  mb-4">
                    <button className='documentos-btn' onClick={AbrirDocumento} id={docs.url_CURP} type='button'>Descargar CURP</button>
                </div>
                <div className="col-md-4 col-lg-4 col-sm-4 col-xs-12  mb-4">
                    <button className='documentos-btn' onClick={AbrirDocumento} id={docs.url_ComprobanteDom} type='button'>Descargar Comprobate de Domicilio</button>
                </div>
            </div>
        </Fragment>
    )
}

export default viewDocumentsOperador