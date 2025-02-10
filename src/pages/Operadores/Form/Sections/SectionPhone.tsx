import { Fragment, useEffect } from 'react'
import { useFormContext } from 'react-hook-form';
import { TextField } from '@mui/material';
import { IOperadorFormData } from '../../../../models/operadores/operador-form.model';

function SectionPhone() {
    const { register, formState: { errors }, setValue} = useFormContext<IOperadorFormData>(); // Accede al contexto del formulario
    useEffect(() => {
        // Agregamos la categoria
        setValue("telefono.id_Categoria",1);
    },[]);
    
  return (
    <Fragment>
        <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
            <div className="form-group">
                <TextField className="form-control" variant="outlined" id="st_NumTelefono" label="Celular" 
                InputLabelProps={{ shrink: true }} type="text"
                {...register("telefono.st_NumTelefono", {
                    required: "Campo Requerido",
                })}
                error={errors.telefono?.st_NumTelefono ? true : false}
                helperText={errors.telefono?.st_NumTelefono && errors.telefono?.st_NumTelefono.message?.toString()}
                inputProps={{ autoComplete: "off" }} required/>
            </div>
        </div>
    </Fragment>
  )
}

export default SectionPhone