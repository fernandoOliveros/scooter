import { ChangeEvent, Fragment, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { IRemolqueForm } from '../../../models/remolques/remolque-form.model';
import { Button, TextField } from '@mui/material';
import { IAutoComplete } from '../../../models/shared/autocomplete.model';
import { getTipoRemolque } from '../../../services/public.service';
import { ITipoRemolque } from '../../../models/shared/tipo-remolque.model';
import { AutocompleteField } from '../../../components/shared/AutoCompleteField';
import { IRemolqueDocumentos } from '../../../models/remolques/remolque-docs.model';
import ViewDocumentsRemolque from '../Documents/ViewDocumentsRemolque';
import { createRemolque, getIdRemolque, updateFilesRemolque, uploadFilesRemolque, editRemolque} from '../../../services/remolques/remolques.service';
import useFetchAndLoad from '../../../hooks/useFetchAndLoad';

//todo: Constantes para la documentación del remolque
const MAX_FILE_SIZE = 5002400;
const nameDocuments = ["url_TarjetaCirculacion", "url_Factura", "url_PermisoSCT"];

//todo: Props
export interface Props {
    id_Remolque?: number,
    returnFormRemolque: (success: boolean) => void
}

function FormRemolque({id_Remolque = 0, returnFormRemolque}: Props) {
    //todo: variable para saber el comportamiento del formulario alta/editar
    const isEditMode = id_Remolque != 0 ? true : false;
    //todo: Id Documento
    const [idDocumento, setIdDocumento] = useState<number>(0);
    //todo: Formulario
    const {register, setValue, handleSubmit, control, formState: {errors}} = useForm<IRemolqueForm>();
    //todo: variable - contiene los tipos remolques
    const [ tipoRemolques, setTipoRemolques] = useState<IAutoComplete[]>([]);
    //todo Arreglo para documentos
    const [documentos, setDocumentos] = useState<IRemolqueDocumentos>({url_TarjetaCirculacion: '', url_Factura: '', url_PermisoSCT: ''});
    //todo: Custom Hooks
    const { callEndpoint } = useFetchAndLoad();

    //todo: Function initial to cats
    useEffect(() => {
        const catTipoRemolques = async () => {
            const loadTipoRemolques = getTipoRemolque();
            try {
                const result = await loadTipoRemolques.call;
                let info = result.data.data;
                let dataOkey = info.map( (item: ITipoRemolque) => (
                    { 
                        id: item.id_TipoRemolque, label: item.st_ClaveRemolque + " - " + item.st_Descripcion
                    }
                ));
                setTipoRemolques(dataOkey);
            } catch (error) { console.log(error)}
        }
        catTipoRemolques();
    },[]);

    //todo: Function to get data to Id remolque
    useEffect(() => {
        const getRemolqueId = async() => {
            const loadSpecificRemolque = getIdRemolque(id_Remolque.toString());
            try {
                const result = await loadSpecificRemolque.call;
                const response =  result.data.data[0];
                //Solución temporal asignar uno a uno el arreglo del remolque
                setValue("st_Anio", response.st_Anio);
                setValue("st_Economico", response.st_Economico);
                setValue("st_Marca", response.st_Marca);
                setValue("st_Placa", response.st_Placa);
                setValue("st_NumSerie", response.st_NumSerie);
                setValue("date_VigenciaFM", response.date_VigenciaFM);
                setValue("id_TipoRemolque", response.id_TipoRemolque);
                setValue("dec_PesoBrutoVehicular",  response.dec_PesoBrutoVehicular);


                //todo: Seteamos el el idDocumento
                setIdDocumento(response.id_Documento ?? 0);

                //!: Revisar porque da error setValue(error, value);
                //const fieldsForm = ['id_Empresa', 'st_Anio', 'st_Economico', 'st_Marca', 'st_Placa', 'st_NumSerie', 'date_VigenciaFM', 'id_TipoRemolque'];
                //fieldsForm.forEach( itemField => setValue(itemField, response.data[0][itemField]));
            } catch (error) {console.log(error);}
        }
        if(id_Remolque !== 0) getRemolqueId();
    },[]);

    //todo: Función para seleccionar archivo en el formulario
    const onChangeDocumentos = (e: ChangeEvent<HTMLInputElement>) => {
        let selector = nameDocuments.filter( x => x === e.target.id);
        let sizeFile: any = e.target.files?.[0].size;
        let typeFile = e.target.files?.[0].type;
        if(sizeFile < MAX_FILE_SIZE && typeFile === "application/pdf"){
          setDocumentos({...documentos, [selector[0]]  : e.target.files?.[0]});
        }else{
          setDocumentos({...documentos, [selector[0]]: ''});
          alert("Selecciona un archivo en formato pdf y que peso menos de 5MB");
        }
    }

    const onSubmit: SubmitHandler<IRemolqueForm> = async(data, e) => {
        e?.preventDefault();
        console.log(data);
        try {
            if(!isEditMode){
                //todo: Creamos el remolque
                let result = await callEndpoint(createRemolque(data));
                //todo: Guardamos archivos remolque
                await callEndpoint(uploadFilesRemolque(documentos,result.data.data.id_Remolque));
            }else{
                console.log(data);
                //* Actualizamos remolque
                const result = await callEndpoint(editRemolque(id_Remolque, data));

                console.log(result);
                if(idDocumento !== 0){
                    //* Actualizamos larchivos remolque
                    await callEndpoint(updateFilesRemolque(documentos, idDocumento, id_Remolque));
                }else{
                    //*: guardamos archivos remolques
                    await callEndpoint(uploadFilesRemolque(documentos, id_Remolque));
                }
            }
            returnFormRemolque(true);
        } catch (error) { console.log(error); returnFormRemolque(false);}
    }

    return (
        <Fragment>
            <form className='form-horizontal' onSubmit={handleSubmit(onSubmit)}>
                <div className='form-body'>
                    <h4 className="card-title">{isEditMode ? 'Actualizar remolque' : 'Alta remolque'}</h4>
                    <hr></hr>
                    <div className='row'>
                        <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
                            <div className="form-group">
                                <TextField className="form-control" variant="outlined" label="Eco" type="text" 
                                    {...register("st_Economico", {
                                        required: "Campo Requerido",
                                    })}
                                    error={errors.st_Economico ? true : false}
                                    helperText={errors.st_Economico && errors.st_Economico.message}
                                />
                            </div>
                        </div>
                        <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
                            <div className="form-group">
                                <TextField className="form-control" variant="outlined" label="Marca"  type="text"
                                    {...register("st_Marca",{
                                        required: "Campo Requerido",
                                    })}
                                    error={errors.st_Marca ? true : false}
                                    helperText={errors.st_Marca && errors.st_Marca.message} 
                                />
                            </div>
                        </div>
                        <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
                            <div className="form-group">
                                <TextField className="form-control" variant="outlined" label="Placas"  type="text"
                                    {...register("st_Placa",{
                                        required: "Campo Requerido",
                                    })}
                                    error={errors.st_Placa ? true : false}
                                    helperText={errors.st_Placa && errors.st_Placa.message}  
                                />
                            </div>
                        </div>
                        <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
                            <div className="form-group">
                                <TextField className="form-control" variant="outlined" label="Año"  type="text"
                                    {...register("st_Anio",{
                                        required: "Campo Requerido",
                                    })}
                                    error={errors.st_Anio ? true : false}
                                    helperText={errors.st_Anio && errors.st_Anio.message}
                                />
                            </div>
                        </div>
                        <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
                            <div className="form-group">
                                <TextField className="form-control" variant="outlined" label="Número de Serie" type="text" 
                                    {...register("st_NumSerie",{
                                        required: "Campo Requerido",
                                    })}
                                    error={errors.st_NumSerie ? true : false}
                                    helperText={errors.st_NumSerie && errors.st_NumSerie.message}
                                />
                            </div>
                        </div>
                        <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
                            <div className="form-group">
                                <AutocompleteField 
                                    options={tipoRemolques}
                                    control={control}
                                    name='id_TipoRemolque'
                                    placeholder='Selecciona el tipo de Remolque'
                                />
                            </div>
                        </div>
                        <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                            <div className="form-group">
                                <TextField className="form-control" variant="outlined" label="Peso vehicular (KGM)" type="number" 
                                {...register("dec_PesoBrutoVehicular", {
                                    required: "Campo Requerido",
                                })}
                                error={errors.dec_PesoBrutoVehicular ? true : false}
                                helperText={errors.dec_PesoBrutoVehicular && errors.dec_PesoBrutoVehicular.message}
                                inputProps={{ autoComplete: "off", inputMode: 'numeric', pattern: '[0-9]*' , min: 5000}} />
                            </div>
                        </div>
                        <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
                            <div className="form-group">
                                <TextField fullWidth 
                                    {...register("date_VigenciaFM",{
                                        required: "Campo Requerido",
                                    })}
                                    label="Fecha de Ventimiento F. Mécanico"
                                    InputLabelProps={{ shrink: true }} type="date"  inputProps={{ autoComplete: "off" }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
                            <div className="form-group">
                                <Button variant="contained" component="label" >Tarjeta Circulacion
                                    <input id='url_TarjetaCirculacion'  accept="application/pdf" type="file" onChange={onChangeDocumentos}  hidden />
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
                                    <input id='url_Factura'  accept="application/pdf" type="file" onChange={onChangeDocumentos}  hidden />
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
                                    <input id='url_PermisoSCT' accept="application/pdf" type="file" onChange={onChangeDocumentos}  hidden />
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
                        idDocumento !== 0 ? ( <ViewDocumentsRemolque id_Documento={idDocumento}/>) : void(0)
                    }
                </div>
                <Button variant='contained' color='success' size='medium' type="submit">Submit</Button>
            </form>
        </Fragment>
    )
}

export default FormRemolque