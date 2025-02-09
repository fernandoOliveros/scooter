import { ChangeEvent, Fragment, useState } from "react";
import { useSelector } from "react-redux";
import { RootStore } from "../../../redux/store";
import useFetchAndLoad from "../../../hooks/useFetchAndLoad";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@mui/material";
import { IAutoComplete } from "../../../models/shared/autocomplete.model";
import SectionGeneral from "./SectionGeneral";
import SectionPhone from "./SectionPhone";
import SectionAddress from "./SectionAddress";
import SectionContacts from "./SectionContacts";
import { IOperadorDocumentos } from "../../../models/operadores/operador-docs.model";

// todo: VARIABLES GLOBALES
const MAX_FILE_SIZE = 5002400;
const DocumentosOeprador = ["url_CURP", "url_RFC", "url_ComprobanteDom"];

//todo: Props
export interface Props {
    id_Operador? : number,
    returnFormOperador: (success: boolean) => void
}

function FormOperador({id_Operador = 0 , returnFormOperador}: Props) {
    //todo: variable para saber el comportamiento del formulario alta/editar
    const isEditMode = id_Operador != 0 ? true : false;

    //todo: Catalogos
    const [documentos, setDocumentos] = useState<IOperadorDocumentos>({url_RFC: '', url_CURP: '', url_ComprobanteDom: ''});

    //todo: ID's
    const [idDocumento, setIdDocumento] = useState<number>(0);
 
    //todo: Custom Hooks
    const { callEndpoint } = useFetchAndLoad();

    //todo: Formualrio General operador
    const methods = useForm();

    const onChangeDocumentos = (e: ChangeEvent<HTMLInputElement>) => {
        let selector = DocumentosOeprador.filter( x => x === e.target.id);
        let sizeFile: any = e.target.files?.[0].size;
        let typeFile = e.target.files?.[0].type;
        if(sizeFile < MAX_FILE_SIZE && typeFile === "application/pdf"){
          setDocumentos({...documentos, [selector[0]]  : e.target.files?.[0]});
        }else{
          setDocumentos({...documentos, [selector[0]]: ''});
          alert("Selecciona un archivo en formato pdf y que peso menos de 5MB");
        }
    }

    const onSubmit: SubmitHandler<any> = (data, e) => {
        e?.preventDefault();
        console.log(data);
        //returnFormOperador(true);    
    }
    
    return (
        <Fragment>
            <FormProvider {...methods}>
                <form className='form-horizontal'  onSubmit={methods.handleSubmit(onSubmit)}>
                    <div className="form-body">
                        <SectionGeneral />
                        <SectionPhone />
                        <SectionAddress />
                        <SectionContacts />
                        <h4 className="card-title mt-4">Documentación del Operador</h4>
                        <hr></hr>
                        <div className="row">
                            <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
                                <div className="form-group">
                                    <Button variant="contained" component="label" >RFC
                                        <input id='url_RFC'  accept="application/pdf" type="file" onChange={onChangeDocumentos}  hidden/>
                                    </Button>
                                    {
                                    documentos.url_RFC === '' ? 
                                    (
                                        <p className="card-title" >Sube el archivo correspondiente - al RFC</p>
                                    ) : <p className="card-title text-success">Archivo aceptado</p>
                                    }
                                </div>
                            </div>
                            <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
                                <div className="form-group">
                                    <Button variant="contained" component="label" >CURP
                                        <input id='url_CURP'  accept="application/pdf" type="file" onChange={onChangeDocumentos}  hidden />
                                    </Button>
                                    {
                                    documentos.url_CURP === '' ? 
                                    (
                                        <p className="card-title" >Sube el archivo correspondiente - CURP</p>
                                    ) : <p className="card-title text-success">Archivo aceptado</p>
                                    }
                                </div>
                            </div>
                            <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
                                <div className="form-group">
                                    <Button variant="contained" component="label" >Comprobante Domicilio
                                        <input id='url_ComprobanteDom' accept="application/pdf" type="file" onChange={onChangeDocumentos}  hidden />
                                    </Button>
                                    {
                                    documentos.url_ComprobanteDom === '' ? 
                                    (
                                        <p className="card-title" >Sube el archivo correspondiente - Comprobante de domicilio</p>
                                    ) : <p className="card-title text-success">Archivo aceptado</p>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="col-md-12 col-lg-12 col-sm-12 col-xs-12">
                            <div className="form-group">
                                <Button variant='contained' color='success' size='medium' type="submit">
                                    { isEditMode ? 'Actualizar' : 'Guardar' }
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </FormProvider>
        </Fragment>
    )
}

export default FormOperador