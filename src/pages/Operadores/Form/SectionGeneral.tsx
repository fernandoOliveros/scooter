
import { Fragment } from 'react'
import { Controller, useFormContext } from 'react-hook-form';
import { IOperadorForm } from '../../../models/operadores/operador-form.model';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';

function SectionGeneral() {

    const { register, formState: { errors }, control } = useFormContext<IOperadorForm>(); // Accede al contexto del formulario

    return (
        <Fragment>
            <div className="row">
                <h4 className="card-title">Información General</h4>
                <hr></hr>
                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField className="form-control" variant="outlined" label="Nombre" type="text"
                        {...register("st_Nombre", {
                            required: "Campo Requerido",
                        })}
                        error={errors.st_Nombre ? true : false}
                        // helperText={errors?.st_Nombre ? errors.root?.message : null}
                        helperText={errors.st_Nombre && errors.st_Nombre.message?.toString()}
                        inputProps={{ autoComplete: "off" }}/>
                    </div>
                </div>
                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='st_ApellidoP' className="form-control" variant="outlined" label="Apellido Paterno"  type="text"
                        {...register("st_ApellidoP", {
                            required: "Campo Requerido",
                        })}
                        error={errors.st_ApellidoP ? true : false}
                        helperText={errors.st_ApellidoP && errors.st_ApellidoP.message?.toString()}
                        inputProps={{ autoComplete: "off" }} required/>
                    </div>
                </div>
                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='st_ApellidoM' className="form-control" variant="outlined" label="Apellido Materno"  type="text"
                        {...register("st_ApellidoM", {
                            required: "Campo Requerido",
                        })}
                        error={errors.st_ApellidoM ? true : false}
                        helperText={errors.st_ApellidoM && errors.st_ApellidoM.message?.toString()}
                        inputProps={{ autoComplete: "off" }} required/>
                    </div>
                </div>
                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='st_NumIMSS' className="form-control" variant="outlined" label="Número de seguro social"  type="text"
                        {...register("st_NumIMSS", {
                            required: "Campo Requerido",
                        })}
                        error={errors.st_NumIMSS ? true : false}
                        helperText={errors.st_NumIMSS && errors.st_NumIMSS.message?.toString()}
                        inputProps={{ autoComplete: "off" }} required/>
                    </div>
                </div>
                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='st_CURP' className="form-control" variant="outlined" label="CURP"  type="text" 
                        {...register("st_CURP", {
                            required: "Campo Requerido",
                        })}
                        error={errors.st_CURP ? true : false}
                        helperText={errors.st_CURP && errors.st_CURP.message?.toString()}
                        inputProps={{ autoComplete: "off", maxLength:"18" }} required/>
                    </div>
                </div>
                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='st_RFC' className="form-control" variant="outlined" label="RFC" 
                        type="text" 
                        {...register("st_RFC", {
                            required: "Campo Requerido",
                        })}
                        error={errors.st_RFC ? true : false}
                        helperText={errors.st_RFC && errors.st_RFC.message?.toString()}
                        inputProps={{ autoComplete: "off", maxLength:"13" }} required/>
                    </div>
                </div>
                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField id='st_NumLicencia' className="form-control" variant="outlined" label="Número de Licencia"  type="text"
                        {...register("st_NumLicencia", {
                            required: "Campo Requerido",
                        })}
                        error={errors.st_NumLicencia ? true : false}
                        helperText={errors.st_NumLicencia && errors.st_NumLicencia.message?.toString()}
                        inputProps={{ autoComplete: "off" }} required/>
                    </div>
                </div>
                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                    <div className="form-group">
                    <FormControl fullWidth>
                        <InputLabel id="seleccionPuesto">Tipo de Puesto</InputLabel>
                        <Controller 
                        name='id_TipoPuesto'
                        control={control}
                        rules={{required: "Campo requerido"}}
                        defaultValue={2}
                        render={({field}) => (
                            <Select  
                                {...field} 
                                labelId="seleccionPuesto" 
                                id="id_TipoPuesto" 
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
                        {...register("date_LicenciaVigencia", {
                            required: "Campo Requerido",
                        })}
                        error={errors.date_LicenciaVigencia ? true : false}
                        helperText={errors.date_LicenciaVigencia && errors.date_LicenciaVigencia.message?.toString()}
                        inputProps={{ autoComplete: "off" }} required/>
                    </div>
                </div>
                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                    <div className="form-group">
                        <TextField fullWidth id="date_Nacimiento" label="Fecha de Nacimiento" InputLabelProps={{ shrink: true }} type="date" 
                        {...register("date_Nacimiento", {
                            required: "Campo Requerido",
                        })}
                        error={errors.date_Nacimiento ? true : false}
                        helperText={errors.date_Nacimiento && errors.date_Nacimiento.message?.toString()}
                        
                        inputProps={{ autoComplete: "off"}} required/>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default SectionGeneral