import { Fragment, useState } from "react";
import useFetchAndLoad from "../../../hooks/useFetchAndLoad";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@mui/material";
import { IOperadorFormData } from "../../../models/operadores/operador-form.model";
import Sections from "./Sections";


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
    //todo: ID's
    const [idDocumento, setIdDocumento] = useState<number>(0);
 
    //todo: Custom Hooks
    const { callEndpoint } = useFetchAndLoad();

    //todo: Formualrio General operador
    const methods = useForm<IOperadorFormData>();

    const onSubmit: SubmitHandler<IOperadorFormData> = (data, e) => {
        e?.preventDefault();
        console.log(data);
        //returnFormOperador(true);    
    }
    
    return (
        <Fragment>
            <FormProvider {...methods}>
                <form className='form-horizontal'  onSubmit={methods.handleSubmit(onSubmit)}>
                    <div className="form-body">
                        <Sections />
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