import React, { Fragment, useEffect, useState } from 'react'
import { useForm, useFormContext } from 'react-hook-form';
import { IAutoComplete } from '../../../../models/shared/autocomplete.model';
import { getColoniasByCodigoPostal } from '../../../../services/public.service';
import { Button, TextField } from '@mui/material';
import { AutocompleteField } from '../../../../components/shared/AutoCompleteField';
import { IColonia } from '../../../../models/shared/colonias.model';
import { IOperadorFormData } from '../../../../models/operadores/operador-form.model';


function SectionAddress() {
    // Formulario 
    const { register, formState: { errors }, control, setValue, getValues} = useFormContext<IOperadorFormData>();
    // Solo vista de municipio, localidad, estado
    const {register: viewDireccion, setValue: setViewDireccion} = useForm();

    // Effect para llenar la view Direccion
    useEffect(() => {
        console.log("EFFECT");
        getColoniaWithCP();
    },[getValues('direccion.c_codigoPostal')]);
    
    //todo: Catalogos
    const [colonias, setColinas] = useState<IAutoComplete[]>([]);

    const getColoniaWithCP = () => {
        let codigo_postal = getValues("direccion.c_codigoPostal");
        if(codigo_postal?.length === 5){
            try {
                const serviceColonias = getColoniasByCodigoPostal(codigo_postal);
                serviceColonias.call
                .then((result) => {
                    const response = result.data;

                    //todo: set form direction intern
                    setValue("direccion.id_Estado", response.data.id_Estado);
                    setValue("direccion.id_Localidad", response.data.id_Localidad);
                    setValue("direccion.id_Municipio", response.data.id_Municipio);

                    //todo: Set view direction fields
                    setViewDireccion("st_Estado", response.data.st_Estado);
                    setViewDireccion("st_Localidad", response.data.st_Localidad);
                    setViewDireccion("st_Municipio", response.data.st_Municipio);

                    //todo: Parse format colonias
                    let dataParse = response.data.dataColonias.map( (item: IColonia) => ({
                        id: item.id_colonia,
                        label: item.st_Colonia
                    }));

                    //todo: Set catálogo colonias
                    setColinas(dataParse);
                }).catch( error => { console.log(error); setColinas([]) });      
            } catch(error){console.log(error);}
        }else{

            //todo: set form direction intern
            setValue("direccion.id_Estado", null);
            setValue("direccion.id_Localidad", null);
            setValue("direccion.id_Municipio", null);

            //todo: Set view direction fields
            setViewDireccion("st_Estado", "");
            setViewDireccion("st_Localidad", "");
            setViewDireccion("st_Municipio", "");

            //todo: set catalogo colonias
            setColinas([]);
        }
    }

    const handleEnterPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            getColoniaWithCP();
        }
    };
  
    return (
    <Fragment>
        <div className='row'>
        <h4 className="card-title mt-4">Dirección del Operador</h4>
        <hr></hr>
            <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                <div className="form-group">
                    <TextField id='st_Calle' className="form-control" variant="outlined" label="Calle" type="text"
                    {...register("direccion.st_Calle", {
                        required: "Campo Requerido",
                    })}
                    error={errors.direccion?.st_Calle ? true : false}
                    helperText={errors.direccion?.st_Calle && errors.direccion?.st_Calle.message?.toString()}
                    inputProps={{ autoComplete: "off" }}/>
                </div>
            </div>
            <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                <div className="form-group">
                    <TextField id='st_NoExterior' className="form-control" variant="outlined" label="Número Exterior" type="text"
                    {...register("direccion.st_NoExterior", {
                        required: "Campo Requerido",
                    })}
                    error={errors.direccion?.st_NoExterior ? true : false}
                    helperText={errors.direccion?.st_NoExterior && errors.direccion?.st_NoExterior.message?.toString()}
                    inputProps={{ autoComplete: "off" }}/>
                </div>
            </div>
            <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                <div className="form-group">
                    <TextField id='st_NoInterior' className="form-control" variant="outlined" label="Número Interior" type="text"
                    {...register("direccion.st_NoInterior", {
                        required: "Campo Requerido",
                    })}
                    error={errors.direccion?.st_NoInterior ? true : false}
                    helperText={errors.direccion?.st_NoInterior && errors.direccion?.st_NoInterior.message?.toString()}
                    inputProps={{ autoComplete: "off" }}/>
                </div>
            </div>
            <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                <div className="form-group">
                    <TextField id='c_codigoPostal' className="form-control" variant="outlined" label="Código Postal" type="text"
                    {...register("direccion.c_codigoPostal", {
                        required: "Campo Requerido",
                        maxLength: 5,
                    })}
                    onKeyDown={handleEnterPress}
                    error={errors.direccion?.c_codigoPostal ? true : false}
                    helperText={errors.direccion?.c_codigoPostal && errors.direccion?.c_codigoPostal.message?.toString()}
                    inputProps={{ autoComplete: "off", maxLength:"5" }}
                    InputLabelProps={{ shrink: true }}/>
                </div>
            </div>
            <div className='col-md-8 col-lg-8 col-sm-12 col-xs-12'>
                <Button onClick={getColoniaWithCP} variant='contained' color='primary' size='medium' type="button">
                    <i className="fa fa-search"></i>
                    Buscar
                </Button>
            </div>
            <div className="col-md-3 col-lg-4 col-sm-12 col-xs-12">
                <div className="form-group">
                    <AutocompleteField 
                        options={colonias}
                        control={control}
                        name='direccion.id_Colonia'
                        placeholder='Selecciona la colonia'
                    />
                </div>
            </div>
            <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                <div className="form-group">
                    <TextField id='st_Municipio' className="form-control" variant="outlined" label="Municipio" type="text"
                    {...viewDireccion("st_Municipio", {
                        required: "Campo Requerido",
                    })}
                    InputLabelProps={{ shrink: true }} 
                    inputProps={{ autoComplete: "off", readOnly:true }}/>
                </div>
            </div>
            <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                <div className="form-group">
                    <TextField id='st_Localidad' className="form-control" variant="outlined" label="Localidad" type="text" 
                    {...viewDireccion("st_Localidad", {
                        required: "Campo Requerido",
                    })}
                    InputLabelProps={{ shrink: true }} inputProps={{ autoComplete: "off", readOnly:true }}/>
                </div>
            </div>
            <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                <div className="form-group">
                    <TextField id='st_Estado' className="form-control" variant="outlined" label="Estado"  type="text" 
                        {...viewDireccion("st_Estado", {
                        required: "Campo Requerido",
                    })}
                    inputProps={{ autoComplete: "off", readOnly: true }} 
                    InputLabelProps={{ shrink: true }}/>
                </div>
            </div>
            <div className="col-md-12 col-lg-12 col-sm-12 col-xs-12">
                <div className="form-group">
                    <TextField id='st_RefDomicilio' className="form-control" variant="outlined" label="Referencia" 
                    type="text"{...register("direccion.st_RefDomicilio")} 
                    inputProps={{ autoComplete: "off"}}/>
                </div>
            </div>
        </div>
    </Fragment>
    )
}

export default SectionAddress