import { Fragment, useEffect, useState } from "react";
import useFetchAndLoad from "../../../hooks/useFetchAndLoad";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@mui/material";
import { IOperadorFormData } from "../../../models/operadores/operador-form.model";
import Sections from "./Sections";
import ViewDocumentsOperador from "../Documents/ViewDocumentsOperador";
import { getContactoOperador, getDireccionOperador, getIdOperador, getTelefonoOperador, createOperador, insertDireccion, insertTelefono, insertContacto, uploadFilesOperador} from "../../../services/operadores/operadores.service";

//todo: Props
export interface Props {
    id_Operador? : number,
    returnFormOperador: (success: boolean) => void
}

function FormOperador({id_Operador = 0 , returnFormOperador}: Props) {

    const methods = useForm<IOperadorFormData>(); // Formulario
    const { reset } = methods;
    const [idDocumento, _setIdDocumento] = useState<number>(0); // Ver documentos
    const isEditMode = id_Operador != 0 ? true : false; // tipo form
    const { callEndpoint } = useFetchAndLoad(); // para peticiones

    useEffect( () => {
        const getOperadorWithId = async () => {
            const loadEspecificOperador = getIdOperador(id_Operador.toString());
            try {
            const result = await loadEspecificOperador.call;
            let response = result.data;
            reset({ operadorForm: response.data[0]});
            } catch (error) {
            alert("Error- al obtener información del operador");
            console.log(error);
            }
        }
        const getDireccionOperadorId = async() => {
              const loadDireccion = getDireccionOperador(id_Operador.toString());
              try {
                let result = await loadDireccion.call;
                let response = result.data;
                console.log(response.data);
              } catch (error) {
                alert("Error, al obtener la dirección del operador");
                console.log(error);
              }
            }
        
            //todo: SERVICE TO LOAD TELEFONOS WITH ID OPERADOR
            const getOperadorTelefono = async () => {
              const loadSpecificTelefono = getTelefonoOperador(id_Operador.toString());
              console.log("Obtener el telefono del operador");
              try {
                const result = await loadSpecificTelefono.call;
                const response = result.data;
                console.log(response.data);
              } catch (error) {
                alert("Error, al obtener el telefono del operador");
                console.log(error);
              }
            }
        
            //todo: SERVICE TO LOAD CONTACTO DE EMERGENCIA WITH ID OPERADOR
            const getContactoOperadorId = async() => {
              const loadContactEmergency = getContactoOperador(id_Operador.toString());
              try {
                let result = await loadContactEmergency.call;
                let response = result.data;
                console.log(response.data);
              } catch (error) {
                alert("Error, no se pudo obtener el contacto del operador");
                console.log(error);
              }
        
            }
        if(id_Operador !== 0){
            getOperadorWithId();
            getDireccionOperadorId();
            getOperadorTelefono();
            getContactoOperadorId();
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
          // INSERT DOCUMENTOS OPERADOR
          await callEndpoint(uploadFilesOperador(data.documentos, new_idOperador));
          console.log(data.documentos);
        }
      } catch (error) {
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