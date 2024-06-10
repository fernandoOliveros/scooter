import { ChangeEvent, Fragment, useState } from 'react'
import { useSelector } from 'react-redux'
import { IAutoComplete } from '../../../models/shared/autocomplete.model'
import { RootStore } from '../../../redux/store'
import useFetchAndLoad from '../../../hooks/useFetchAndLoad'
import { SubmitHandler, useForm } from 'react-hook-form'
import { IOperadorDocumentos } from '../../../models/operadores/operador-docs.model'
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import ViewDocumentsOperador from '../Documents/ViewDocumentsOperador'
import { getColoniasByCodigoPostal } from '../../../services/public.service'
import { IColonia } from '../../../models/shared/colonias.model'
import { AutocompleteField } from '../../../components/shared/AutoCompleteField'


// todo: VARIABLES GLOBALES
const MAX_FILE_SIZE = 5002400;
const DocumentosOeprador = ["url_CURP", "url_RFC", "url_ComprobanteDom"];


//todo: Props
export interface Props {
    id_Operador?: number,
    returnFormOperador: (success: boolean) => void
}

function SecondFormOperador({id_Operador = 0, returnFormOperador}: Props) { 
     //todo: variable para saber el comportamiento del formulario alta/editar
    const isEditMode = id_Operador != 0 ? true : false;

    //todo: Store
    const userState = useSelector((store: RootStore) => store.user);
    const id_Empresa = userState.user.id_Empresa;
    const [documentos, setDocumentos] = useState<IOperadorDocumentos>({url_RFC: '', url_CURP: '', url_ComprobanteDom: ''});

    //todo: Catalogos
    const [colonias, setColinas] = useState<IAutoComplete[]>([]);

    //todo: ID's
    const [idDocumento, setIdDocumento] = useState<number>(0);

    //todo: Custom Hooks
    const { callEndpoint } = useFetchAndLoad();

    //todo: Formualrio General operador
    const {register, setValue, control, handleSubmit, formState: {errors}} = useForm();

    //todo: view direccion operador
    const {register: viewDireccion, setValue: setViewDireccion} = useForm();

    const onChangeDocumentos = (e: ChangeEvent<HTMLInputElement>) => {
        let selector = DocumentosOeprador.filter( x => x === e.target.id);
        let sizeFile: any = e.target.files?.[0].size;
        let typeFile = e.target.files?.[0].type;
        if(sizeFile < MAX_FILE_SIZE && typeFile === "application/pdf"){
          setDocumentos({...documentos, [selector[0]]  : e.target.files?.[0]});
        }else{
          setDocumentos({...documentos, [selector[0]]: ''});
          alert("Selecciona un archivo en formato pdf y que peso menos de 5MB");
        }
    }


    const getColoniaWithCP = (codigo_postal: string) => {
        if(codigo_postal.length === 5){
            try {
                const serviceColonias = getColoniasByCodigoPostal(codigo_postal);
                serviceColonias.call
                .then((result) => {
                    const response = result.data;

                    //todo: set form direction intern
                    setValue("id_Estado", response.data.id_Estado);
                    setValue("id_Localidad", response.data.id_Localidad);
                    setValue("id_Municipio", response.data.id_Municipio);

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
            setValue("id_Estado", null);
            setValue("id_Localidad", null);
            setValue("id_Municipio", null);

            //todo: Set view direction fields
            setViewDireccion("st_Estado", "");
            setViewDireccion("st_Localidad", "");
            setViewDireccion("st_Municipio", "");

            //todo: set catalogo colonias
            setColinas([]);
        }
    }

    const onSubmit: SubmitHandler<any> = (data, e) => {
        e?.preventDefault();
        console.log(data);
        //returnFormOperador(true);    
    }

    return (
        <Fragment>
            <form className='form-horizontal' onSubmit={handleSubmit(onSubmit)}>
                <div className="form-body">
                    <h4 className="card-title">{isEditMode ? 'Actualizar Operador' : 'Nuevo Operador'}</h4>
                    <hr></hr>
                    <div className='row'>
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
                                <TextField id='st_NumTelefono' className="form-control" variant="outlined" label="Celular"
                                type="text" 
                                {...register("date_LicenciaVigencia", {
                                    required: "Campo Requerido",
                                })}
                                error={errors.date_LicenciaVigencia ? true : false}
                                helperText={errors.date_LicenciaVigencia && errors.date_LicenciaVigencia.message?.toString()}
                                inputProps={{ autoComplete: "off", maxLength:"10" }} required/>
                            </div>
                        </div>
                        <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                            <div className="form-group">
                            <FormControl fullWidth>
                                <InputLabel id="seleccionPuesto">Tipo de Puesto</InputLabel>
                                <Select labelId="seleccionPuesto" id="id_TipoPuesto" label="Tipo de Puesto"
                                {...register("id_TipoPuesto", {
                                    required: "Campo Requerido",
                                })}
                                >
                                    <MenuItem value={1}>Auxiliar</MenuItem>
                                    <MenuItem value={2}>Operador de Camión</MenuItem>
                                </Select>
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
                    <h4 className="card-title mt-4">Dirección del Operador</h4>
                    <hr></hr>
                    <div className='row'>
                        <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                            <div className="form-group">
                                <TextField id='st_Calle' className="form-control" variant="outlined" label="Calle"  type="text"
                                {...register("st_Calle", {
                                    required: "Campo Requerido",
                                })}
                                error={errors.st_Calle ? true : false}
                                helperText={errors.st_Calle && errors.st_Calle.message?.toString()}
                                inputProps={{ autoComplete: "off" }} required/>
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
                                inputProps={{ autoComplete: "off" }} required/>
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
                                inputProps={{ autoComplete: "off" }} required/>
                            </div>
                        </div>
                        <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                            <div className="form-group">
                                <TextField id='c_codigoPostal' className="form-control" variant="outlined" label="Código Postal"  type="text"
                                {...register("c_codigoPostal", {
                                    required: "Campo Requerido",
                                    maxLength: 5,
                                    onBlur: (e) => getColoniaWithCP(e.target.value)
                                })}
                                error={errors.c_codigoPostal ? true : false}
                                helperText={errors.c_codigoPostal && errors.c_codigoPostal.message?.toString()}
                                inputProps={{ autoComplete: "off", maxLength:"5" }} required InputLabelProps={{ shrink: true }}/>
                            </div>
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
                                InputLabelProps={{ shrink: true }} inputProps={{ autoComplete: "off", readOnly:true }} required/>
                            </div>
                        </div>
                        <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                            <div className="form-group">
                                <TextField id='st_Localidad' className="form-control" variant="outlined" label="Localidad" type="text" 
                                {...viewDireccion("st_Localidad", {
                                    required: "Campo Requerido",
                                })}
                                InputLabelProps={{ shrink: true }} inputProps={{ autoComplete: "off", readOnly:true }} required/>
                            </div>
                        </div>
                        <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                            <div className="form-group">
                                <TextField id='st_Estado' className="form-control" variant="outlined" label="Estado"  type="text" 
                                 {...viewDireccion("st_Estado", {
                                    required: "Campo Requerido",
                                })}
                                inputProps={{ autoComplete: "off", readOnly:true }} required InputLabelProps={{ shrink: true }}/>
                            </div>
                        </div>
                        <div className="col-md-12 col-lg-12 col-sm-12 col-xs-12">
                            <div className="form-group">
                                <TextField id='st_RefDomicilio' className="form-control" variant="outlined" label="Referencia" 
                                type="text"{...register("st_RefDomicilio")} inputProps={{ autoComplete: "off"}} required/>
                            </div>
                        </div>
                    </div>
                    <h4 className='card-title mt-4'>Contacto de Emergencia</h4>
                    <hr></hr>
                    <div className='row'>
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
                    <h4 className="card-title mt-4">Documentación del Operador</h4>
                    <hr></hr>
                    <div className="row">
                        <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
                            <div className="form-group">
                                <Button variant="contained" component="label" >RFC
                                    <input id='url_RFC'  accept="application/pdf" type="file" onChange={onChangeDocumentos}  hidden />
                                </Button>
                                {
                                documentos.url_RFC === '' ? 
                                (
                                    <p className="card-title" >Sube el archivo correspondiente - al RFC</p>
                                ) : <p className="card-title text-success">Archivo aceptado</p>
                                }
                            </div>
                        </div>
                        <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
                            <div className="form-group">
                                <Button variant="contained" component="label" >CURP
                                    <input id='url_CURP'  accept="application/pdf" type="file" onChange={onChangeDocumentos}  hidden />
                                </Button>
                                {
                                documentos.url_CURP === '' ? 
                                (
                                    <p className="card-title" >Sube el archivo correspondiente - CURP</p>
                                ) : <p className="card-title text-success">Archivo aceptado</p>
                                }
                            </div>
                        </div>
                        <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
                            <div className="form-group">
                                <Button variant="contained" component="label" >Comprobante Domicilio
                                    <input id='url_ComprobanteDom' accept="application/pdf" type="file" onChange={onChangeDocumentos}  hidden />
                                </Button>
                                {
                                documentos.url_ComprobanteDom === '' ? 
                                (
                                    <p className="card-title" >Sube el archivo correspondiente - Comprobante de domicilio</p>
                                ) : <p className="card-title text-success">Archivo aceptado</p>
                                }
                            </div>
                        </div>
                    </div>
                    {
                    idDocumento !== 0 ? ( <ViewDocumentsOperador id_Documento={idDocumento}/>) : void(0)
                    }
                    <div className="row mt-4">
                        <div className="col-md-12 col-lg-12 col-sm-12 col-xs-12">
                            <div className="form-group">
                                <Button variant='contained' color='success' size='medium' type="submit">
                                    Guardar
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </Fragment>
    )
}

export default SecondFormOperador