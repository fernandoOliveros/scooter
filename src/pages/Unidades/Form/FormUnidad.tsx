import { ChangeEvent, Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { RootStore } from '../../../redux/store';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IUnidadForm } from '../../../models/unidades/unidad-form.model';
import { IAutoComplete } from '../../../models/shared/autocomplete.model';
import useFetchAndLoad from '../../../hooks/useFetchAndLoad';
import { IUnidadDocumentos } from '../../../models/unidades/unidad-docs.model';
import ViewDocuments from '../Documents/ViewDocuments';
import { Button, TextField } from '@mui/material';
import { AutocompleteField } from '../../../components/shared/AutoCompleteField';
import { getAseguradoras, getTipoPermisoSct, getTipoUnidad } from '../../../services/public.service';
import { ITipoUnidad } from '../../../models/shared/tipo-unidad.model';
import { ITipoPermiso } from '../../../models/unidades/unidad.tipo.permiso.model';
import { IAseguradoras } from '../../../models/shared/aseguradoras.model';
import { createUnidad, editUnidad, getIdUnidad, updateFilesUnidad, uploadFilesUnidad } from '../../../services/unidades/unidades.service';

//todo: interfaz de Props
export interface Props {
    id_Unidad?: number,
    returnFormUnidad: (success: boolean) => void
}

const MAX_FILE_SIZE = 5002400;
const nameDocumentsUnidad = ["url_TarjetaCirculacion", "url_Factura", "url_PermisoSCT"];

function FormUnidad({id_Unidad = 0, returnFormUnidad}: Props) {
    //todo: variable para saber el comportamiento del formulario alta/editar
    const isEditMode = id_Unidad != 0 ? true : false;
    //todo: Id Documento
    const [idDocumento, setIdDocumento] = useState<number>(0);
    //todo: Formulario
    const {register, setValue, handleSubmit, control, formState: {errors}} = useForm<IUnidadForm>();
    //todo Arreglo para documentos
    const [documentos, setDocumentos] = useState<IUnidadDocumentos>({url_TarjetaCirculacion: '', url_Factura: '', url_PermisoSCT: ''});

    //todo: Catalogos
    const [ tipoUnidades, setTipoUnidades] = useState<IAutoComplete[]>([]);
    const [ tipoPermisosSct, setTipoPermisosSCT] = useState<IAutoComplete[]>([]);
    const [ aseguradoras, setAseguradoras] = useState<IAutoComplete[]>([]);

    //todo: Custom Hooks
    const { callEndpoint } = useFetchAndLoad();

    //todo: Function initial Catálogos
    useEffect(() => {
        //todo: services
        let apiTipoUnidades = getTipoUnidad();
        let apiTipoPermiso = getTipoPermisoSct();
        let apiAseguradoras = getAseguradoras();

        const catTipoUnidades = () => {
            apiTipoUnidades.call
            .then((result) => {
                let data = result.data.data;
                let dataParse = data.map( (item: ITipoUnidad) => ({ id: item.id_TipoUnidad, label: item.st_ClaveTransporte + " - " + item.st_Descripcion}));
                setTipoUnidades(dataParse);
            }).catch(error => console.log(error));
        }

        const catTipoPermisoSct = () => {
            apiTipoPermiso.call
            .then( (resp) => {
                let data = resp.data.data;
                let dataParse = data.map( (item: ITipoPermiso) => ({ id: item.id_TipoPermiso, label: item.st_Clave + ' - ' + item.st_Descripcion}));
                setTipoPermisosSCT( dataParse );
            }).catch((error) => console.log(error));
        }

        const catAseguradoras = () => {
            apiAseguradoras.call
            .then((resp) => {
                let data = resp.data.data;
                let dataParse = data.map( (item: IAseguradoras) => ({ id: item.id_Aseguradora, label: item.st_NombreAseguradora}));
                setAseguradoras( dataParse );
            }).catch(error => console.log(error));
        }

        //todo: llamamos las funciones
        catTipoUnidades();
        catTipoPermisoSct();
        catAseguradoras();

        //todo: destruccción de componente
        return () => {
            apiTipoUnidades.controller.abort();
            apiTipoPermiso.controller.abort();
            apiAseguradoras.controller.abort();
        }
    },[]);

    //todo: Function to get Unidad with Id_Unidad
    useEffect(() => {
        const getUnidadId = () => {
            let loadSpecificUnidad = getIdUnidad(id_Unidad.toString());
            try {
                loadSpecificUnidad.call
                .then((result) => {
                    let data = result.data.data[0];
                    setValue("st_Marca", data.st_Marca);
                    setValue("st_SubMarca", data.st_SubMarca);
                    setValue("id_TipoUnidad", data.id_TipoUnidad);
                    setValue("st_PermisoSCT", data.st_PermisoSCT);
                    setValue("st_Economico", data.st_Economico);
                    setValue("st_Placa", data.st_Placa);
                    setValue("st_Anio", data.st_Anio);
                    setValue("st_NumMotor", data.st_NumMotor);
                    setValue("st_NumSerie", data.st_NumSerie);
                    setValue("st_NumPoliza", data.st_NumPoliza);
                    setValue("date_Mecanico", data.date_Mecanico);
                    setValue("date_Ecologico", data.date_Ecologico);
                    setValue("id_Candado", data.id_Candado);
                    setValue("id_TipoPermiso", data.id_TipoPermiso);
                    setValue("id_AseguradoraRespCivil",  data.id_AseguradoraRespCivil);
                    setIdDocumento(data.id_Documento ?? 0);
                }).catch(error => console.log(error));
                
            } catch (error) {console.log(error);}
        }
        if(id_Unidad !== 0) getUnidadId();
    },[]);

    //todo: Funcion para el input tipo file
    const onchangeDocumentos = (e: ChangeEvent<HTMLInputElement>) => {
        let selector = nameDocumentsUnidad.filter( x => x === e.target.id);
        let sizeFile: any = e.target.files?.[0].size;
        let typeFile = e.target.files?.[0].type;
    
        if(sizeFile < MAX_FILE_SIZE && typeFile === "application/pdf"){
          setDocumentos({...documentos, [selector[0]]  : e.target.files?.[0]});
        }else{
          setDocumentos({...documentos, [selector[0]]: ''});
          alert("Selecciona un archivo en formato pdf y que peso menos de 5MB");
        }
    }

    const onSubmit: SubmitHandler<IUnidadForm> = async(data, e) => {
        e?.preventDefault();
        try {
            //* Alta Unidad
            if(!isEditMode){
                //todo: Completamos el formulario
                data.id_Candado = 1;
                //todo: Creamos la unidad
                let result = await callEndpoint(createUnidad(data));
                //Todo: Creamos el registro de los documentos
                await callEndpoint(uploadFilesUnidad(documentos, result.data.data.id_Unidad));
            }else{
                //* Editamos la unidad
                await callEndpoint(editUnidad(id_Unidad, data));
                //* Verificamos si tenemos IdDocumento para saber si hay un registro
                if(idDocumento !== 0){
                    //* Actualizamos los archivos
                    await callEndpoint(updateFilesUnidad(documentos, idDocumento, id_Unidad));
                }else{
                     //*: Creamos el registro de los documentos
                    await callEndpoint(uploadFilesUnidad(documentos, id_Unidad));
                }
                
            }
            returnFormUnidad(true);
        } catch (error) { console.log(error); returnFormUnidad(false); }
    }

    return (
        <Fragment>
            <form className='form-horizontal' onSubmit={handleSubmit(onSubmit)}>
                <div className="form-body">
                    <h4 className="card-title">{isEditMode ? 'Actualizar Unidad' : 'Alta Unidad'}</h4>
                    <hr></hr>
                    <div className='row'>
                        <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                            <div className="form-group">
                                <TextField className="form-control" variant="outlined" label="Eco"  type="text"
                                {...register("st_Economico", {
                                    required: "Campo Requerido",
                                })}
                                error={errors.st_Economico ? true : false}
                                helperText={errors.st_Economico && errors.st_Economico.message}
                                inputProps={{ autoComplete: "off" }} />
                            </div>
                        </div>
                        <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                            <div className="form-group">
                                <AutocompleteField 
                                    options={tipoUnidades}
                                    control={control}
                                    name='id_TipoUnidad'
                                    placeholder='Selecciona el tipo de unidad'
                                />
                            </div>
                        </div>
                        <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                            <div className="form-group">
                                <TextField className="form-control" variant="outlined" label="Marca" type="text" 
                                {...register("st_Marca", {
                                    required: "Campo Requerido",
                                })}
                                error={errors.st_Marca ? true : false}
                                helperText={errors.st_Marca && errors.st_Marca.message}
                                inputProps={{ autoComplete: "off" }}/>
                            </div>
                        </div>
                        <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                            <div className="form-group">
                                <TextField className="form-control" variant="outlined" label="Sub - Marca" type="text" 
                                {...register("st_SubMarca", {
                                    required: "Campo Requerido",
                                })}
                                error={errors.st_SubMarca ? true : false}
                                helperText={errors.st_SubMarca && errors.st_SubMarca.message}
                                inputProps={{ autoComplete: "off" }}/>
                            </div>
                        </div>
                        <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                            <div className="form-group">
                                <TextField className="form-control" variant="outlined" label="Año" type="text" 
                                {...register("st_Anio", {
                                    required: "Campo Requerido",
                                })}
                                error={errors.st_Anio ? true : false}
                                helperText={errors.st_Anio && errors.st_Anio.message}
                                name="st_Anio" 
                                inputProps={{ autoComplete: "off" }}/>
                            </div>
                        </div>
                        <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                            <div className="form-group">
                                <TextField className="form-control" variant="outlined" label="Placas"  type="text" 
                                {...register("st_Placa", {
                                    required: "Campo Requerido",
                                })}
                                error={errors.st_Placa ? true : false}
                                helperText={errors.st_Placa && errors.st_Placa.message}
                                name="st_Placa" inputProps={{ autoComplete: "off" }}/>
                            </div>
                        </div>
                        <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                            <div className="form-group">
                                <TextField className="form-control" variant="outlined" label="Número de Motor" type="text" 
                                {...register("st_NumMotor", {
                                    required: "Campo Requerido",
                                })}
                                error={errors.st_NumMotor ? true : false}
                                helperText={errors.st_NumMotor && errors.st_NumMotor.message}
                                name="st_NumMotor" inputProps={{ autoComplete: "off" }}/>
                            </div>
                        </div>
                        <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                            <div className="form-group">
                                <TextField className="form-control" variant="outlined" label="Número de Serie" type="text" 
                                {...register("st_NumSerie", {
                                    required: "Campo Requerido",
                                })}
                                error={errors.st_NumSerie ? true : false}
                                helperText={errors.st_NumSerie && errors.st_NumSerie.message}
                                name="st_NumSerie" inputProps={{ autoComplete: "off" }}/>
                            </div>
                        </div>
                        <div className='col-md-4 col-lg-4 col-sm-12 col-xs-12'>
                            <div className="form-group">
                                <AutocompleteField 
                                    options={tipoPermisosSct}
                                    control={control}
                                    name='id_TipoPermiso'
                                    placeholder='Selecciona el tipo de permiso sct'
                                />
                            </div>
                        </div>
                        <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                            <div className="form-group">
                                <TextField className="form-control" variant="outlined" label="Permiso SCT"  type="text" 
                                {...register("st_PermisoSCT", {
                                    required: "Campo Requerido",
                                })}
                                error={errors.st_PermisoSCT ? true : false}
                                helperText={errors.st_PermisoSCT && errors.st_PermisoSCT.message}
                                name="st_PermisoSCT" inputProps={{ autoComplete: "off" }}/>
                            </div>
                        </div>
                        <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                            <div className="form-group">
                                <TextField fullWidth label="Fecha de Ventimiento F. Mécanico" type="date" 
                                {...register("date_Mecanico", {
                                    required: "Campo Requerido",
                                })}
                                error={errors.date_Mecanico ? true : false}
                                helperText={errors.date_Mecanico && errors.date_Mecanico.message}
                                InputLabelProps={{ shrink: true }} name="date_Mecanico" inputProps={{ autoComplete: "off" }}/>
                            </div>
                        </div>
                        <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                            <div className="form-group">
                                <TextField fullWidth label="Fecha de Ventimiento Ecológica" type="date" 
                                {...register("date_Ecologico", {
                                    required: "Campo Requerido",
                                })}
                                error={errors.date_Ecologico ? true : false}
                                helperText={errors.date_Ecologico && errors.date_Ecologico.message}
                                InputLabelProps={{ shrink: true }} name="date_Ecologico" inputProps={{ autoComplete: "off" }}/>
                            </div>
                        </div>
                    </div>
                    <h4 className="card-title">Información del Seguro</h4>
                    <hr></hr>
                    <div className="row">
                        <div className="col-md-6 col-lg-6 col-sm-12 col-xs-12">
                            <div className="form-group">
                                <AutocompleteField
                                    options={aseguradoras}
                                    control={control}
                                    name='id_AseguradoraRespCivil'
                                    placeholder='Selecciona una aseguradora'
                                />
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-6 col-sm-12 col-xs-12">
                            <div className="form-group">
                                <TextField className="form-control" variant="outlined" label="Número de Póliza" type="text" 
                                {...register("st_NumPoliza", {
                                    required: "Campo Requerido",
                                })}
                                error={errors.st_NumPoliza ? true : false}
                                helperText={errors.st_NumPoliza && errors.st_NumPoliza.message}
                                inputProps={{ autoComplete: "off" }} />
                            </div>
                        </div>
                    </div>
                    <h4 className="card-title mt-4">Documentación de la Unidad</h4>
                    <hr></hr>
                    <div className="row">
                        <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
                            <div className="form-group">
                                <Button variant="contained" component="label" >Tarjeta Circulacion
                                    <input id='url_TarjetaCirculacion'  accept="application/pdf" type="file" onChange={onchangeDocumentos}  hidden />
                                </Button>
                                {
                                documentos.url_TarjetaCirculacion === '' ? 
                                (
                                    <p className="card-title" >Sube el archivo correspondiente - Tarjeta de Circulación</p>
                                ) : <p className="card-title text-success">Archivo aceptado</p>
                                }
                            </div>
                        </div>
                        <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
                            <div className="form-group">
                                <Button variant="contained" component="label" >Factura
                                    <input id='url_Factura'  accept="application/pdf" type="file" onChange={onchangeDocumentos}  hidden />
                                </Button>
                                {
                                documentos.url_Factura === '' ? 
                                (
                                    <p className="card-title" >Sube el archivo correspondiente - Factura</p>
                                ) : <p className="card-title text-success">Archivo aceptado</p>
                                }
                            </div>
                        </div>
                        <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
                            <div className="form-group">
                                <Button variant="contained" component="label" >Permiso SCT
                                    <input id='url_PermisoSCT' accept="application/pdf" type="file" onChange={onchangeDocumentos}  hidden />
                                </Button>
                                {
                                documentos.url_PermisoSCT === '' ? 
                                (
                                    <p className="card-title" >Sube el archivo correspondiente - Permiso SCT</p>
                                ) : <p className="card-title text-success">Archivo aceptado</p>
                                }
                            </div>
                        </div>
                    </div>
                    {
                        idDocumento !== 0 ? ( <ViewDocuments id_Documento={idDocumento}/>) : void(0)
                    }
                </div>
                <Button variant='contained' color='success' size='medium' type="submit">
                    { isEditMode ? 'Actualizar' : 'Guardar' }
                </Button>
            </form>
        </Fragment>
    )
}

export default FormUnidad
