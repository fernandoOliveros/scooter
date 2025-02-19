import { Fragment, lazy, useEffect, useState } from 'react'
import { UnidadModel } from '../../../models/unidades/unidad.model';
import { IOperadorModel } from '../../../models/operadores/operador.model';
import { IRemolqueModel } from '../../../models/remolques/remolque.model';
import { ICliente } from '../../../models/clientes/cliente.model';
import { getOperadoresByEmpresa } from '../../../services/operadores/operadores.service';
import { getRemolques } from '../../../services/remolques/remolques.service';
import { getUltimoFolioViaje } from '../../../services/public.service';
import { getUnidades } from '../../../services/unidades/unidades.service';
import { getClientesEmpresa } from '../../../services/clientes/clientes.service';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { IRelViajeRemolqueForm, IViajeForm } from '../../../models/viajes/viaje-form.model';
import { Autocomplete, Button, TextField } from '@mui/material';
import { IAutoComplete } from '../../../models/shared/autocomplete.model';
import AddIcon from '@mui/icons-material/Add';
import useFetchAndLoad from '../../../hooks/useFetchAndLoad';
import { createRelViajeRemolques, createViaje } from '../../../services/viajes/viajes.service';
import { AutocompleteField } from '../../../components/shared/AutoCompleteField';

//Lazy
const ModalUnidad = lazy( () => import('../../../components/Unidades/DialogUnidad'));
const ModalRemolque = lazy( () => import('../../../components/Remolques/DialogRemolque'));
const ModalOperador = lazy( () => import('../../../components/Operadores/DialogOperador'));
const ModalCliente = lazy( () => import('../../../components/Clientes/DialogCliente'));


//todo: interfaz de Props
export interface Props {
    id_Viaje?: number,
    returnFormViaje: (success: boolean) => void
}

function FormViaje({id_Viaje = 0, returnFormViaje}: Props) {
    //todo: variable para saber el comportamiento del formulario alta/editar
    const isEditMode = id_Viaje != 0 ? true : false;
    const { callEndpoint } = useFetchAndLoad();


    // General Form
    const {register: viajeform, setValue: setViajeForm, getValues: getValuesViaje, control, formState: {errors}, handleSubmit} = useForm<IViajeForm>();

    // catalogos
    const [unidades, setUnidades] = useState<IAutoComplete[]>([]);
    const [remolques, setRemolques] = useState<IAutoComplete[]>([]);
    const [operadores, setOperadores] = useState<IAutoComplete[]>([]);
    const [clientes, setClientes] = useState<IAutoComplete[]>([]);
    const TipoViaje: IAutoComplete[] = [{id: 1, label: "Local"}, {id: 2, label: "Foráneo"}];

    // Dialogs
    const[dialogUnidad, setDialogUnidad] = useState<boolean>(false);
    const[dialogRemolque, setDialogRemolque] = useState<boolean>(false);
    const[dialogOperador, setDialogOperador] = useState<boolean>(false);
    const[dialogCliente, setDialogCliente] = useState<boolean>(false);

    // new Data
    const [newUnidad, setNewUnidad] = useState(false);
    const [newRemolque, setNewRemolque] = useState(false);
    const [newOperador, setNewOperador] = useState(false);
    const [newCliente, setNewCliente] = useState(false);

    const [selectRemolque, setSelectRemolque] = useState<any[]>([]);

    // CALL SERVICES TO CAT
    const loadUnidad = getUnidades();
    const loadOperadores = getOperadoresByEmpresa();
    const loadRemolques = getRemolques();
    const loadLastFolio = getUltimoFolioViaje();
    const loadClientes = getClientesEmpresa();

    useEffect(() => {
        //Call Functions
        useGetUnidades();
        useGetOperadores();
        useGetRemolques();
        useGetClientesEmpresa();
        useGetLastFolio();

        // * destruimos el componente
        return() => { 
            loadRemolques.controller.abort();
            loadUnidad.controller.abort(); 
            loadOperadores.controller.abort(); 
            loadClientes.controller.abort();
            loadLastFolio.controller.abort();
        };


    },[]);

    useEffect(() => {
        useGetUnidades();
    },[newUnidad]);

    useEffect(() => {
        useGetOperadores();
    },[newOperador]);

    useEffect(() => {
        useGetRemolques();
    },[newRemolque]);

    useEffect(() => {
        useGetClientesEmpresa();
    },[newCliente]);


    const useGetUnidades = async() => {
        try{
            const response = await loadUnidad.call;
            let tmpUnidades = response.data.data;
            let dataParse = tmpUnidades.map( (item: UnidadModel) => ({ id: item.id_Unidad, label: "ECO: " + item.st_Economico}));
            setUnidades(dataParse);
        }catch(error){ console.log(error); }
    };

    const useGetOperadores = async () => {
        try {
            const result = await loadOperadores.call;
            let tmpOperador = result.data.data;
            let dataParse = tmpOperador.map( (item: IOperadorModel) => ({ 
                id: item.id_Operador, 
                label: item.st_Nombre + " " + item.st_ApellidoP + " " + item.st_ApellidoM
            }));
            setOperadores(dataParse);
        } catch (error) { console.log(error); }
    }

    const useGetRemolques = async() => {
        try{
            const response = await loadRemolques.call;
            let tmpRemolques = response.data.data;
            let dataParse = tmpRemolques.map( (item: IRemolqueModel) => ({ 
                id: item.id_Remolque, 
                label: "ECO: " + item.st_Economico
            }));
            setRemolques(dataParse);
        }catch(error){ console.log(error); }
    };

    const useGetClientesEmpresa = async() => {
        try{
            const response = await loadClientes.call;
            let tmpClientes = response.data.data;
            let dataParse = tmpClientes.map( (item: ICliente) => ({ 
                id: item.id_Cliente, 
                label: item.st_AliasCliente
            }));
            setClientes(dataParse);
        }catch(error){ console.log(error); }
    }

    const useGetLastFolio = async() => {
        const response = await loadLastFolio.call;
        let tmpId = response.data.data.id_latest_folio;
        setViajeForm('folio_int_viaje', (tmpId !== null) ? tmpId + 1 : 1);
    }

    const refreshUnidades  = (set: boolean) => { setNewUnidad(set);}
    const refreshRemolques  = (set: boolean) => {setNewRemolque(set);}
    const refreshOperadores  = (set: boolean) => {setNewOperador(set);}
    const refreshClientes  = (set: boolean) => {setNewCliente(set);}



     const onSubmit: SubmitHandler<IViajeForm> = async(data, e) => {
        e?.preventDefault();
        console.log(selectRemolque);
        try {
            //* Alta Unidad
            if(!isEditMode){
                data.id_StatusViaje = 1;
                data.id_Candado = 1;
                let _createViaje= await callEndpoint(createViaje(data));
                //todo: recorremos el arreglo que contiene el 
                selectRemolque.forEach( async (remolque) => {
                    let relViajeRemolque: IRelViajeRemolqueForm = {
                        id_Viaje: _createViaje.data.data.id_Viaje,
                        id_Remolque: remolque.id
                    }
                    //todo: guardamos los remolque con relacion al viaje
                    await callEndpoint(createRelViajeRemolques(relViajeRemolque));
                });
            }else{
                
                
            }
            returnFormViaje(true);
        } catch (error) { console.log(error); returnFormViaje(false); }
    }
    
    return (
        <Fragment>
            <ModalUnidad open={dialogUnidad} returnCloseDialog={(close) => setDialogUnidad(close)} returnUnidad={(success) => refreshUnidades(success)} />
            <ModalRemolque open={dialogRemolque} returnCloseDialog={(close) => setDialogRemolque(close)} returnRemolque={(success) => refreshRemolques(success)} />
            <ModalOperador open={dialogOperador} returnCloseDialog={(close) => setDialogOperador(close)} returnOperador={(success) => refreshOperadores(success)} />
            <ModalCliente open={dialogCliente} returnCloseDialog={(close) => setDialogCliente(close)} returnCliente={(success) => refreshClientes(success)} />
            <form className='form-horizontal' onSubmit={handleSubmit(onSubmit)}>
                <div className="card">
                    <div className="card-body"> 
                        <div className='row'>
                            <h4 className="card-title">Información general</h4>
                            <hr></hr>
                            <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12 mt-4">
                                <div className="form-group">
                                    <TextField id='folio_int_viaje' className="form-control" variant="outlined" label="Folio interno del viaje" type="text"
                                    {...viajeform("folio_int_viaje", {
                                        required: "Campo Requerido",
                                    })}
                                    error={errors.folio_int_viaje ? true : false}
                                    helperText={errors.folio_int_viaje && errors.folio_int_viaje.message}
                                    disabled inputProps={{ autoComplete: "off" }}/>
                                </div>
                            </div>
                            <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12 mt-4">
                                <div className="input-group">
                                    <TextField id='i_km_totales' className="form-control" variant="outlined" label="Km totales" 
                                    type="number"
                                    {...viajeform("i_km_totales", {
                                        required: "Campo Requerido",
                                    })} 
                                    error={errors.i_km_totales ? true : false}
                                    helperText={errors.i_km_totales && errors.i_km_totales.message}
                                    inputProps={{ autoComplete: "off", min: 1, max: 50000 }}/>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-4 col-sm-12 col-xs-12 mt-4">
                                <div className="form-group">
                                    <AutocompleteField 
                                        options={clientes}
                                        control={control}
                                        name='id_Cliente'
                                        placeholder='Selecciona un cliente'
                                    />
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-4 col-sm-12 col-xs-12 mt-4">
                                <div className="form-group">
                                    <AutocompleteField 
                                        options={TipoViaje}
                                        control={control}
                                        name='id_TipoViaje'
                                        placeholder='Tipo de Viaje'
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='card'>
                    <div className="card-body">
                        <div className='row'>
                            <div className="col-md-12 col-lg-12 col-sm-12 col-xs-12">
                                <h4 className="card-title">Configura tu viaje</h4>
                                <Button startIcon={<AddIcon/>} size='small' variant="contained" color='primary' onClick={ () => setDialogUnidad(true) }>Nueva unidad</Button>
                                <Button startIcon={<AddIcon/>} size='small' variant="contained" color='primary' onClick={ () => setDialogRemolque(true) }>Nuevo remolque</Button>
                                <Button startIcon={<AddIcon/>} size='small' variant="contained" color='primary' onClick={ () => setDialogOperador(true) }>Nuevo operador</Button>
                                <Button startIcon={<AddIcon/>} size='small' variant="contained" color='primary' onClick={ () => setDialogCliente(true) }>Nuevo Cliente</Button>
                            </div>
                            <hr></hr>
                            <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                                <div className="form-group">
                                    <AutocompleteField 
                                        options={unidades}
                                        control={control}
                                        name='id_Unidad'
                                        placeholder='Selecciona la unidad'
                                    />
                                </div>
                            </div>
                            <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                                <div className="form-group">
                                <Autocomplete
                                    multiple
                                    options={remolques}
                                    onChange={(_option, value) => setSelectRemolque(value)}
                                    getOptionLabel={(option) => option.label}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    renderInput={(params) => <TextField {...params} label="Selecciona el remolque" variant="outlined" />}
                                />
                                </div>
                            </div>
                            <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                                <div className="form-group">
                                    <AutocompleteField 
                                        options={operadores}
                                        control={control}
                                        name='id_Operador'
                                        placeholder='Selecciona un operador'
                                    />
                                </div>
                            </div>
                            <div className='col-md-4 col-lg-4 col-sm-12 col-xs-12'>
                                <Button variant='contained' color='success' size='medium' type="submit">
                                    { isEditMode ? 'Actualizar' : 'Guardar' }
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </Fragment>
    )
}

export default FormViaje;