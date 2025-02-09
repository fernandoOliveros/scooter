
import { Fragment } from 'react'
import { Controller, useFormContext } from 'react-hook-form';
import { IOperadorFormData } from '../../../../models/operadores/operador-form.model';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';

function SectionGeneral() {

    const { register, formState: { errors }, control } = useFormContext<IOperadorFormData>(); // Accede al contexto del formulario

    return (
        <Fragment>
            <div className="row">
                <h4 className="card-title">Información General</h4>
                <hr></hr>
                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField className="form-control" variant="outlined" label="Nombre" type="text"
                        {...register("operadorForm.st_Nombre", {
                            required: "Campo Requerido",
                        })}
                        error={errors.operadorForm?.st_Nombre ? true : false}
                        helperText={errors.operadorForm?.st_Nombre && errors.operadorForm?.st_Nombre.message?.toString()}
                        inputProps={{ autoComplete: "off" }}/>
                    </div>
                </div>
                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='st_ApellidoP' className="form-control" variant="outlined" label="Apellido Paterno"  type="text"
                        {...register("operadorForm.st_ApellidoP", {
                            required: "Campo Requerido",
                        })}
                        error={errors.operadorForm?.st_ApellidoP ? true : false}
                        helperText={errors.operadorForm?.st_ApellidoP && errors.operadorForm?.st_ApellidoP.message?.toString()}
                        inputProps={{ autoComplete: "off" }} required/>
                    </div>
                </div>
                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='st_ApellidoM' className="form-control" variant="outlined" label="Apellido Materno"  type="text"
                        {...register("operadorForm.st_ApellidoM", {
                            required: "Campo Requerido",
                        })}
                        error={errors.operadorForm?.st_ApellidoM ? true : false}
                        helperText={errors.operadorForm?.st_ApellidoM && errors.operadorForm?.st_ApellidoM.message?.toString()}
                        inputProps={{ autoComplete: "off" }} required/>
                    </div>
                </div>
                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='st_NumIMSS' className="form-control" variant="outlined" label="Número de seguro social"  type="text"
                        {...register("operadorForm.st_NumIMSS", {
                            required: "Campo Requerido",
                        })}
                        error={errors.operadorForm?.st_NumIMSS ? true : false}
                        helperText={errors.operadorForm?.st_NumIMSS && errors.operadorForm?.st_NumIMSS.message?.toString()}
                        inputProps={{ autoComplete: "off" }} required/>
                    </div>
                </div>
                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='st_CURP' className="form-control" variant="outlined" label="CURP"  type="text" 
                        {...register("operadorForm.st_CURP", {
                            required: "Campo Requerido",
                        })}
                        error={errors.operadorForm?.st_CURP ? true : false}
                        helperText={errors.operadorForm?.st_CURP && errors.operadorForm?.st_CURP.message?.toString()}
                        inputProps={{ autoComplete: "off", maxLength:"18" }} required/>
                    </div>
                </div>
                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='st_RFC' className="form-control" variant="outlined" label="RFC" 
                        type="text" 
                        {...register("operadorForm.st_RFC", {
                            required: "Campo Requerido",
                        })}
                        error={errors.operadorForm?.st_RFC ? true : false}
                        helperText={errors.operadorForm?.st_RFC && errors.operadorForm?.st_RFC.message?.toString()}
                        inputProps={{ autoComplete: "off", maxLength:"13" }} required/>
                    </div>
                </div>
                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='st_NumLicencia' className="form-control" variant="outlined" label="Número de Licencia"  type="text"
                        {...register("operadorForm.st_NumLicencia", {
                            required: "Campo Requerido",
                        })}
                        error={errors.operadorForm?.st_NumLicencia ? true : false}
                        helperText={errors.operadorForm?.st_NumLicencia && errors.operadorForm?.st_NumLicencia.message?.toString()}
                        inputProps={{ autoComplete: "off" }} required/>
                    </div>
                </div>
                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                    <div className="form-group">
                    <FormControl fullWidth>
                        <InputLabel id="seleccionPuesto">Tipo de Puesto</InputLabel>
                        <Controller 
                        name='operadorForm.id_TipoPuesto'
                        control={control}
                        rules={{required: "Campo requerido"}}
                        defaultValue={2}
                        render={({field}) => (
                            <Select  
                                {...field} 
                                labelId="seleccionPuesto" 
                                id="operadorForm.id_TipoPuesto" 
                                label="Tipo de Puesto" 
                                value={field.value ?? null} // Usa null en lugar de "" si no hay valor
                                onChange={(event) => field.onChange(event.target.value)} // Gestiona el cambio
                            >
                                <MenuItem value={1}>Auxiliar</MenuItem>
                                <MenuItem value={2}>Operador de Camión</MenuItem>
                            </Select>
                        )}
                        />
                    </FormControl>
                    </div>
                </div>
                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField fullWidth id="date_LicenciaVigencia" label="Vigencia de la Licencia" 
                        InputLabelProps={{ shrink: true }} type="date"
                        {...register("operadorForm.date_LicenciaVigencia", {
                            required: "Campo Requerido",
                        })}
                        error={errors.operadorForm?.date_LicenciaVigencia ? true : false}
                        helperText={errors.operadorForm?.date_LicenciaVigencia && errors.operadorForm?.date_LicenciaVigencia.message?.toString()}
                        inputProps={{ autoComplete: "off" }} required/>
                    </div>
                </div>
                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField fullWidth id="date_Nacimiento" label="Fecha de Nacimiento" InputLabelProps={{ shrink: true }} type="date" 
                        {...register("operadorForm.date_Nacimiento", {
                            required: "Campo Requerido",
                        })}
                        error={errors.operadorForm?.date_Nacimiento ? true : false}
                        helperText={errors.operadorForm?.date_Nacimiento && errors.operadorForm?.date_Nacimiento.message?.toString()}
                        
                        inputProps={{ autoComplete: "off"}} required/>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default SectionGeneral