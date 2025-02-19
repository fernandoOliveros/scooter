import { Fragment, useEffect, useState } from "react";
import useFetchAndLoad from "../../../hooks/useFetchAndLoad";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@mui/material";
import { IOperadorFormData } from "../../../models/operadores/operador-form.model";
import Sections from "./Sections";
import ViewDocumentsOperador from "../Documents/ViewDocumentsOperador";
import { getContactoOperador, getDireccionOperador, getIdOperador, getTelefonoOperador, createOperador, insertDireccion, insertTelefono, insertContacto, uploadFilesOperador, getDocumentsOperador, updateOperador, updateTelefonoOperador, updateContactoOperador, updateDireccionOperador, updateFilesOperador} from "../../../services/operadores/operadores.service";

//todo: Props
export interface Props {
    id_Operador? : number,
    returnFormOperador: (success: boolean) => void
}

function FormOperador({id_Operador = 0 , returnFormOperador}: Props) {

    const methods = useForm<IOperadorFormData>(); // Formulario
    const { reset } = methods;
    const [idDocumento, setIdDocumento] = useState<number>(0); // Ver documentos
    const isEditMode = id_Operador != 0 ? true : false; // tipo form
    const { callEndpoint } = useFetchAndLoad(); // para peticiones

    // Effect to update Operator
    useEffect( () => {
      const loadOperadorData = async() => {
        try {
          const [resultOperador, resultDireccion, resultTelefono, resultContacto, resultadoDocumentos] = await Promise.all([
            getIdOperador(id_Operador).call,
            getDireccionOperador(id_Operador).call,
            getTelefonoOperador(id_Operador).call,
            getContactoOperador(id_Operador).call,
            getDocumentsOperador(id_Operador).call
          ]);

          // Extract data
          const operadorData = resultOperador.data?.data?.[0] || {};
          const direccionData = resultDireccion.data?.data || {};
          const telefonoData = resultTelefono.data?.data || {};
          const contactoData = resultContacto.data?.data || {};
          const documentosData = resultadoDocumentos.data?.data?.[0] || {};

          // Reset Form
          reset({
              operadorForm: operadorData,
              direccion: direccionData,
              telefono: telefonoData,
              contacto: contactoData
          });

          setIdDocumento(documentosData.id_Documento);
        } catch (error) {
          alert("Error al obtener la información del operador");
          console.error(error);
        }
      }
      if(id_Operador !== 0){
          loadOperadorData();
      }
    },[]); 

    const onSubmit: SubmitHandler<IOperadorFormData> = async (data, e) => {
      e?.preventDefault();
      let responseCreateOperador = null;
      let createrDireccion = null;
      let createrTelefono = null;
      let createrContacto = null;
      let new_idOperador: number = 0;
      try {
        if(!isEditMode){
          // NEW OPERADOR
          responseCreateOperador = await callEndpoint(createOperador(data.operadorForm));
          new_idOperador = responseCreateOperador.data.data.id_Operador;
          // INSERT DE DIRECCION, TELEFONO, CONTACTO DE EMERGENCIA
          createrDireccion = await callEndpoint(insertDireccion(data.direccion, new_idOperador));
          createrTelefono = await callEndpoint(insertTelefono(data.telefono, new_idOperador));
          createrContacto = await callEndpoint(insertContacto(data.contacto, new_idOperador));
          if(data.documentos.url_CURP?.size && data.documentos.url_ComprobanteDom?.size && data.documentos.url_RFC?.size){
            // INSERT DOCUMENTOS OPERADOR
            await callEndpoint(uploadFilesOperador(data.documentos, new_idOperador));
            console.log(data.documentos);
          }
        }else{
          await callEndpoint(updateOperador(data.operadorForm, id_Operador));
          await callEndpoint(updateTelefonoOperador(data.telefono, id_Operador));
          await callEndpoint(updateContactoOperador(data.contacto, id_Operador));
          await callEndpoint(updateDireccionOperador(data.direccion, id_Operador));
          //* Verificamos si tenemos IdDocumento para saber si hay un registro
          if(data.documentos.url_CURP?.size && data.documentos.url_ComprobanteDom?.size && data.documentos.url_RFC?.size){
            console.log(data.documentos.url_CURP.size);
            if(idDocumento !== 0){
              //* Actualizamos los archivos
              await callEndpoint(updateFilesOperador(data.documentos, idDocumento, id_Operador));
            }else{
                //*: Creamos el registro de los documentos
              await callEndpoint(uploadFilesOperador(data.documentos, id_Operador));
            }
          }
        }
        returnFormOperador(true); 
      } catch (error) {
        console.log(error);
        returnFormOperador(false); 
      }
    }
    
    return (
        <Fragment>
            <FormProvider {...methods}>
                <form className='form-horizontal'  onSubmit={methods.handleSubmit(onSubmit)}>
                    <div className="form-body">
                        <Sections />
                    </div>
                    <div className="row">
                    {
                        idDocumento !== 0 ? ( <ViewDocumentsOperador id_Documento={idDocumento}/>) : void(0)
                    }
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