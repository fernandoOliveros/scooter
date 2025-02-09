import React, { Fragment } from 'react'
import { IOperadorContactos } from '../../../models/operadores/operador-contactos.model';
import { useFormContext } from 'react-hook-form';
import { TextField } from '@mui/material';

function SectionContacts() {
    const { register, formState: { errors } } = useFormContext<IOperadorContactos>(); // Accede al contexto del formulario
    
    return (
        <Fragment>
            <div className='row'>
                <h4 className='card-title mt-4'>Contacto de Emergencia</h4>
                <hr></hr>
                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='st_Nombre' className="form-control" variant="outlined" label="Nombre completo" type="text"
                        {...register("st_Nombre", {
                            required: "Campo Requerido",
                        })}
                        error={errors.st_Nombre ? true : false}
                        helperText={errors.st_Nombre && errors.st_Nombre.message?.toString()}
                        inputProps={{ autoComplete: "off" }} required/>
                    </div>
                </div>
                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='st_NumTelefono' className="form-control" variant="outlined" label="Celular"  type="text"
                        {...register("st_NumTelefono", {
                            required: "Campo Requerido",
                        })}
                        error={errors.st_NumTelefono ? true : false}
                        helperText={errors.st_NumTelefono && errors.st_NumTelefono.message?.toString()}
                        inputProps={{ autoComplete: "off" }} required/>
                    </div>
                </div>
                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='st_Parentesco' className="form-control" variant="outlined" label="Parentesco"  type="text"
                        {...register("st_Parentesco", {
                            required: "Campo Requerido",
                        })}
                        error={errors.st_Parentesco ? true : false}
                        helperText={errors.st_Parentesco && errors.st_Parentesco.message?.toString()}
                        inputProps={{ autoComplete: "off" }} required/>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default SectionContacts