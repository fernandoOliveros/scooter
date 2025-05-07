import React, { useEffect, useState } from 'react'
import { ICartaPorteDirDestinoForm } from '../../../../models/cartaportes/cartaPorte-dirDestino-form.model';
import { useForm } from 'react-hook-form';
import { IAutoComplete } from '../../../../models/shared/autocomplete.model';
import { getColoniasByCodigoPostal } from '../../../../services/public.service';
import { Button, TextField } from '@mui/material';
import { IColonia } from '../../../../models/shared/colonias.model';
import { AutocompleteField } from '../../../../components/shared/AutoCompleteField';


interface Props {
  defaultValues?: Partial<ICartaPorteDirDestinoForm>;
  onSubmit: (data: ICartaPorteDirDestinoForm) => void;
  onCancel: () => void;
}

function DestinoForm({ defaultValues, onSubmit, onCancel} : Props)  {
  const {
      control,
      handleSubmit,
      register,
      getValues: getDestino,
      setValue: setDestino,
      formState: { errors },
  } = useForm<ICartaPorteDirDestinoForm>({
      defaultValues,
  });

  const [colonias, setColinas] = useState<IAutoComplete[]>([]);
  const {register: viewDireccion, setValue: setViewDireccion} = useForm(); 

  useEffect(() => {
      if (defaultValues) {
          getColoniaWithCP();
      }
  }, [defaultValues, setViewDireccion]);
  
  const getColoniaWithCP = () => {
    let codigo_postal = getDestino("c_codigoPostal");
    if(codigo_postal?.length === 5){
      try {
          const serviceColonias = getColoniasByCodigoPostal(codigo_postal);
          serviceColonias.call
          .then((result) => {
              const response = result.data;

              //todo: set form direction intern
              setDestino("id_Estado", response.data.id_Estado);
              setDestino("id_Localidad", response.data.id_Localidad);
              setDestino("id_Municipio", response.data.id_Municipio);

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
    } else{
      //todo: set form direction intern
      setDestino("id_Estado", null);
      setDestino("id_Localidad", null);
      setDestino("id_Municipio", null);

      //todo: Set view direction fields
      setViewDireccion("st_Estado", "");
      setViewDireccion("st_Localidad", "");
      setViewDireccion("st_Municipio", "");

      //todo: set catalogo colonias
      setColinas([]);
    }
  };

  const handleEnterPress = (event: React.KeyboardEvent) => {
      if (event.key === 'Enter') {
          getColoniaWithCP();
      }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-2">
        <div className="row">
            <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                <div className="form-group">
                <TextField id='st_DestinatarioNombre' className="form-control" variant="outlined" label="Nombre Destinatario"  type="text" 
                {...register("st_DestinatarioNombre", {
                required: "Campo...",
                })}
                error={errors.st_DestinatarioNombre ? true : false}
                helperText={errors.st_DestinatarioNombre && errors.st_DestinatarioNombre.message?.toString()}
                inputProps={{ autoComplete: "off" }}/>
            </div>
            </div>
            <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                <div className="form-group">
                    <TextField id='st_DestinatarioRFC' className="form-control" variant="outlined" label="RFC destinatario"  type="text"
                    {...register("st_DestinatarioRFC", {
                    required: "Campo Requerido",
                    })}
                    error={errors.st_DestinatarioRFC ? true : false}
                    helperText={errors.st_DestinatarioRFC && errors.st_DestinatarioRFC.message?.toString()}
                    inputProps={{ autoComplete: "off" }}/>
                </div>
            </div>
            <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                <div className="form-group">
                    <TextField fullWidth id='dec_DistRec' className="form-control" variant="outlined" label="Distancia Recorrida (Km)" type="number"
                    {...register("dec_DistRec", {
                    required: "Campo Requerido",
                    })}
                    error={errors.dec_DistRec ? true : false}
                    helperText={errors.dec_DistRec && errors.dec_DistRec.message?.toString()}
                    inputProps={{ autoComplete: "off", min: 1, defaultValue: 1}}/>
                </div>
            </div>
            <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                <div className="form-group">
                    <TextField fullWidth id='date_FechaLlegada' className="form-control" variant="outlined" label="Fecha de llegada" type="datetime-local"
                    {...register("date_FechaLlegada", {
                    required: "Campo Requerido",
                    })}
                    error={errors.date_FechaLlegada ? true : false}
                    helperText={errors.date_FechaLlegada && errors.date_FechaLlegada.message?.toString()}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ autoComplete: "off" }}/>
                </div>
            </div>
            <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                <div className="form-group">
                    <TextField id='st_Calle' className="form-control" variant="outlined" label="Calle"  type="text"
                    {...register("st_Calle", {
                        required: "Campo Requerido",
                    })}
                    error={errors.st_Calle ? true : false}
                    helperText={errors.st_Calle && errors.st_Calle.message?.toString()}
                    inputProps={{ autoComplete: "off" }}/>
                </div>
            </div>
            <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                <div className="form-group">
                    <TextField id='st_NoExterior' className="form-control" variant="outlined" label="Número Exterior"  type="text"
                    {...register("st_NoExterior", {
                        required: "Campo Requerido",
                    })}
                    error={errors.st_NoExterior ? true : false}
                    helperText={errors.st_NoExterior && errors.st_NoExterior.message?.toString()}
                    inputProps={{ autoComplete: "off" }}/>
                </div>
            </div>
            <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                <div className="form-group">
                    <TextField id='st_NoInterior' className="form-control" variant="outlined" label="Número Interior"  type="text"
                    {...register("st_NoInterior", {
                        required: "Campo Requerido",
                    })}
                    error={errors.st_NoInterior ? true : false}
                    helperText={errors.st_NoInterior && errors.st_NoInterior.message?.toString()}
                    inputProps={{ autoComplete: "off", defaultValue: 'S/N'}}/>
                </div>
            </div>
            <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                <div className="form-group">
                    <TextField id='c_codigoPostal' className="form-control" variant="outlined" label="Código Postal"  type="text"
                    {...register("c_codigoPostal", {
                        required: "Campo Requerido",
                        maxLength: 5,
                    })}
                    onKeyDown={handleEnterPress}
                    error={errors.c_codigoPostal ? true : false}
                    helperText={errors.c_codigoPostal && errors.c_codigoPostal.message?.toString()}
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
                        name='id_Colonia'
                        placeholder='Selecciona la colonia'
                    />
                </div>
            </div>
            <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                <div className="form-group">
                    <TextField id='st_Municipio' className="form-control" variant="outlined" label="Municipio"  type="text"
                    {...viewDireccion("st_Municipio", {
                        required: "Campo Requerido",
                    })}
                    InputLabelProps={{ shrink: true }} 
                    InputProps={{ autoComplete: "off", readOnly:true }}/>
                </div>
            </div>
            <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                <div className="form-group">
                    <TextField id='st_Localidad' className="form-control" variant="outlined" label="Localidad" type="text" 
                    {...viewDireccion("st_Localidad", {
                        required: "Campo Requerido",
                    })}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ autoComplete: "off", readOnly:true }}/>
                </div>
            </div>
            <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                <div className="form-group">
                    <TextField id='st_Estado' className="form-control" variant="outlined" label="Estado" type="text" 
                        {...viewDireccion("st_Estado", {
                        required: "Campo Requerido",
                    })}
                    InputProps={{ autoComplete: "off", readOnly: true }}
                    InputLabelProps={{ shrink: true }}/>
                </div>
            </div>
            <div className="col-md-12 col-lg-12 col-sm-12 col-xs-12">
                <div className="form-group">
                    <TextField id='st_RefDomicilio' className="form-control" variant="outlined" label="Referencia" 
                    type="text" {...register("st_RefDomicilio")} InputProps={{ autoComplete: "off"}}/>
                </div>
            </div>
            <div className="col-md-2 col-lg-2 col-sm-12 col-xs-12">
                <div className="mt-3">
                    <Button type="submit" variant="contained">
                        Guardar
                    </Button>
                </div>
            </div>
            <div className="col-md-2 col-lg-2 col-sm-12 col-xs-12">
            <div className="mt-3">
                    <Button variant="outlined" onClick={onCancel}>
                        Cancelar
                    </Button>
                </div>
            </div>
        </div>
    </form>
  )
}

export default DestinoForm