import { Fragment } from 'react'
import { useFormContext } from 'react-hook-form';
import { TextField } from '@mui/material';
import { IOperadorFormData } from '../../../../models/operadores/operador-form.model';

function SectionContacts() {
    const { register, formState: { errors } } = useFormContext<IOperadorFormData>(); // Accede al contexto del formulario
    
    return (
        <Fragment>
            <div className='row'>
                <h4 className='card-title mt-4'>Contacto de Emergencia</h4>
                <hr></hr>
                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='st_Nombre' className="form-control" variant="outlined" label="Nombre completo" type="text"
                        {...register("contacto.st_Nombre", {
                            required: "Campo Requerido",
                        })}
                        error={errors.contacto?.st_Nombre ? true : false}
                        helperText={errors.contacto?.st_Nombre && errors.contacto?.st_Nombre.message?.toString()}
                        inputProps={{ autoComplete: "off" }} required/>
                    </div>
                </div>
                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='st_NumTelefono' className="form-control" variant="outlined" label="Celular"  type="text"
                        {...register("contacto.st_NumTelefono", {
                            required: "Campo Requerido",
                        })}
                        error={errors.contacto?.st_NumTelefono ? true : false}
                        helperText={errors.contacto?.st_NumTelefono && errors.contacto?.st_NumTelefono.message?.toString()}
                        inputProps={{ autoComplete: "off" }} required/>
                    </div>
                </div>
                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='st_Parentesco' className="form-control" variant="outlined" label="Parentesco"  type="text"
                        {...register("contacto.st_Parentesco", {
                            required: "Campo Requerido",
                        })}
                        error={errors.contacto?.st_Parentesco ? true : false}
                        helperText={errors.contacto?.st_Parentesco && errors.contacto?.st_Parentesco.message?.toString()}
                        inputProps={{ autoComplete: "off" }} required/>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default SectionContacts