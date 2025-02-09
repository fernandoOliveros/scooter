import React, { Fragment } from 'react'
import { IOperadorTelefono } from '../../../models/operadores/operador-telefono.model';
import { useFormContext } from 'react-hook-form';
import { TextField } from '@mui/material';

function SectionPhone() {
        const { register, formState: { errors } } = useFormContext<IOperadorTelefono>(); // Accede al contexto del formulario
    
  return (
    <Fragment>
        <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
            <div className="form-group">
                <TextField className="form-control" variant="outlined" id="st_NumTelefono" label="Celular" 
                InputLabelProps={{ shrink: true }} type="text"
                {...register("st_NumTelefono", {
                    required: "Campo Requerido",
                })}
                error={errors.st_NumTelefono ? true : false}
                helperText={errors.st_NumTelefono && errors.st_NumTelefono.message?.toString()}
                inputProps={{ autoComplete: "off" }} required/>
            </div>
        </div>
    </Fragment>
  )
}

export default SectionPhone