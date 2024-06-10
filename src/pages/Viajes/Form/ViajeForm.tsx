import { useEffect, useState, lazy, ChangeEvent, Fragment } from 'react'
import { useSelector } from 'react-redux';
import { RootStore } from '../../../redux/store';
import { UnidadModel } from '../../../models/unidades/unidad.model';
import { IRemolqueModel } from '../../../models/remolques/remolque.model';
import { getUnidades } from '../../../services/unidades/unidades.service';
import { getOperadoresByEmpresa } from '../../../services/operadores/operadores.service';
import { getRemolques } from '../../../services/remolques/remolques.service';
import { Autocomplete, Button, TextField } from '@mui/material';
import { IRelViajeRemolqueForm, IViajeForm } from '../../../models/viajes/viaje-form.model';
import { IOperadorModel } from '../../../models/operadores/operador.model';
import AddIcon from '@mui/icons-material/Add';
import { getUltimoFolioViaje } from '../../../services/public.service';
import { getClientesEmpresa } from '../../../services/clientes/clientes.service';
import { ICliente } from '../../../models/clientes/cliente.model';
import useFetchAndLoad from '../../../hooks/useFetchAndLoad';
import { createRelViajeRemolques, createViaje } from '../../../services/viajes/viajes.service';

//Lazy
const ModalUnidad = lazy( () => import('../../../components/Unidades/DialogUnidad'));
const ModalRemolque = lazy( () => import('../../../components/Remolques/DialogRemolque'));
const ModalOperador = lazy( () => import('../../../components/Operadores/DialogOperador'));
const ModalCliente = lazy( () => import('../../../components/Clientes/DialogCliente'));

export interface Props {
    returnFormCreateViaje: (success: boolean) => void
}

// todo: VARIABLES GLOBALES
type handleChangeForm = ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;

const ViajeForm = ({returnFormCreateViaje}: Props) => {
    const TipoViaje = [{id_TipoViaje: 1, st_Descripcion: "Local"}, {id_TipoViaje: 2, st_Descripcion: "Foráneo"}];

    //todo: Variables globales
    const userState = useSelector((store: RootStore) => store.user);
    const id_Empresa = userState.user.id_Empresa;
    const { callEndpoint } = useFetchAndLoad();

    const[dialogUnidad, setDialogUnidad] = useState<boolean>(false);
    const[dialogRemolque, setDialogRemolque] = useState<boolean>(false);
    const[dialogOperador, setDialogOperador] = useState<boolean>(false);
    const[dialogCliente, setDialogCliente] = useState<boolean>(false);

    const [viajeForm, setViajeForm] = useState<IViajeForm>({ folio_int_viaje: 1, id_Cliente: null, id_TipoViaje: null, id_Unidad: null, id_Operador: null, i_km_totales: 1, id_Empresa:  id_Empresa, id_StatusViaje: 1, id_Candado: 1});
    
    // CATÁLOGOS PARA LOS SELECT DE UNIDADES, OPERADORES, REMOLQUES
    //const [clientes, setClientes] = useState<IAutoComplete[]>([]);
    const [unidades, setUnidades] = useState<UnidadModel[]>([]);
    const [remolques, setRemolques] = useState<IRemolqueModel[]>([]);
    const [operadores, setOperadores] = useState<IOperadorModel[]>([]);
    const [clientes, setClientes] = useState<ICliente[]>([]);

    const [selectUnidad, setSelectUnidad] = useState<UnidadModel | null>(null);
    const [selectOperador, setSelectOperador] = useState<IOperadorModel | null>(null);
    const [selectRemolque, setSelectRemolque] = useState<IRemolqueModel[]>([]);
    const [selectCliente, setSelectCliente] = useState<ICliente | null>(null);

    const [newUnidad, setNewUnidad] = useState(false);
    const [newRemolque, setNewRemolque] = useState(false);
    const [newOperador, setNewOperador] = useState(false);
    const [newCliente, setNewCliente] = useState(false);

    useEffect(() => {
        // CALL SERVICES TO CAT
        const loadUnidad = getUnidades(id_Empresa);
        const loadOperadores = getOperadoresByEmpresa(id_Empresa);
        const loadRemolques = getRemolques(id_Empresa);
        const loadLastFolio = getUltimoFolioViaje(id_Empresa);
        const loadClientes = getClientesEmpresa(id_Empresa);

        const useGetUnidades = async() => {
            try{
                const response = await loadUnidad.call;
                let tmpUnidades = response.data.data;
                setUnidades(tmpUnidades);
            }catch(error){ console.log(error); }
        };

        const useGetOperadores = async () => {
            try {
                const result = await loadOperadores.call;
                let tmpOperador = result.data.data;
                setOperadores(tmpOperador);
            } catch (error) { console.log(error); }
        }

        const useGetRemolques = async() => {
            try{
                const response = await loadRemolques.call;
                let tmpRemolques = response.data.data;
                setRemolques(tmpRemolques);
            }catch(error){ console.log(error); }
        };

        const useGetClientesEmpresa = async() => {
            try{
                const response = await loadClientes.call;
                let tmpClientes = response.data.data;
                setClientes(tmpClientes);
            }catch(error){ console.log(error); }
        }

        const useGetLastFolio = async() => {
            const response = await loadLastFolio.call;
            let tmpId = response.data.data.id_latest_folio;
            setViajeForm({...viajeForm, folio_int_viaje: (tmpId !== null) ? tmpId + 1 : viajeForm.folio_int_viaje});
        }

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
    
    const onChangeViajeForm = ({ target: { name, value } }: handleChangeForm) => {
        setViajeForm({...viajeForm, [name]: value});
    }

    //todo: Select unidad
    useEffect(()=>{
        setViajeForm({...viajeForm, id_Unidad: (selectUnidad !== null) ? selectUnidad.id_Unidad : null});
    },[selectUnidad]);

    //todo: Select Operador
    useEffect(()=>{
        setViajeForm({...viajeForm, id_Operador: (selectOperador !== null) ? selectOperador.id_Operador : null});
    },[selectOperador]);


    //todo: Select Operador
    useEffect(()=>{
        setViajeForm({...viajeForm, id_Cliente: (selectCliente !== null) ? selectCliente.id_Cliente : null});
    },[selectCliente]);


    //todo: Select TipoViaje
    const onChangeTipoViaje = (tipoViaje: any) => {
        if(tipoViaje !== null){
            setViajeForm({...viajeForm, id_TipoViaje : tipoViaje.id_TipoViaje});
        }else{
            setViajeForm({...viajeForm, id_TipoViaje : null});
        }
    }

    //todo: Refrescamos el catalogo Unidades
    useEffect(() => {
        const loadUnidad = getUnidades(id_Empresa);
        const useGetUnidades = async() => {
            try{
                const response = await loadUnidad.call;
                let tmpUnidades = response.data.data;
                setUnidades(tmpUnidades);
            }catch(error){ alert(error); }
        };
        useGetUnidades();
        return() => { 
            loadUnidad.controller.abort(); 
        };

    },[newUnidad]);

    //todo: Refrescamos el catalogo Remolques
    useEffect(() => {
        const loadRemolques = getRemolques(id_Empresa);
        const useGetRemolques = async() => {
            try{
                const response = await loadRemolques.call;
                let tmpRemolques = response.data.data;
                setRemolques(tmpRemolques);
            }catch(error){ console.log(error); }
        };
        useGetRemolques();
        return() => { 
            loadRemolques.controller.abort(); 
        };

    },[newRemolque]);

    //todo: Refrescamos el catalogo Remolques
    useEffect(() => {
        const loadOperadores = getOperadoresByEmpresa(id_Empresa);
        const useGetOperadores = async () => {
            try {
                const result = await loadOperadores.call;
                let tmpOperador = result.data.data;
                setOperadores(tmpOperador);
            } catch (error) { console.log(error); }
        }
        useGetOperadores();
        return() => { 
            loadOperadores.controller.abort(); 
        };

    },[newOperador]);


    //todo: Refrescamos el catalogo Remolques
    useEffect(() => {
        const loadClientes2 = getClientesEmpresa(id_Empresa);
        const useGetClientesEmpresa = async() => {
            try{
                const response = await loadClientes2.call;
                let tmpClientes = response.data.data;
                setClientes(tmpClientes);
            }catch(error){ console.log(error); }
        }
        useGetClientesEmpresa();
        return() => { 
            loadClientes2.controller.abort(); 
        };
    },[newCliente]);

    const refreshUnidades  = (set: boolean) => { setNewUnidad(set);}
    const refreshRemolques  = (set: boolean) => {setNewRemolque(set);}
    const refreshOperadores  = (set: boolean) => {setNewOperador(set);}
    const refreshClientes  = (set: boolean) => {setNewCliente(set);}

    const onSubmit = async(e: any) => {
        e.preventDefault();
        try {
            let viaje = await callEndpoint(createViaje(viajeForm));
            if(selectRemolque.length > 0 && selectRemolque.length <= 2){
                //todo: recorremos el arreglo que contiene el 
                selectRemolque.forEach( async (remolque) => {
                    let relViajeRemolque: IRelViajeRemolqueForm = {
                        id_Viaje: viaje.data.data.id_Viaje,
                        id_Remolque: remolque.id_Remolque
                    }
                    console.log(relViajeRemolque);
                    //todo: guardamos los remolque con relacion al viaje
                    await callEndpoint(createRelViajeRemolques(relViajeRemolque));
                });
            }
            returnFormCreateViaje(true);
        } catch (error) {
            returnFormCreateViaje(false)
            console.log("Crear Viaje: " + error);
        }
    }

    return (
        <Fragment>
            <ModalUnidad open={dialogUnidad} returnCloseDialog={(close) => setDialogUnidad(close)} returnUnidad={(success) => refreshUnidades(success)}/>
            <ModalRemolque open={dialogRemolque} returnCloseDialog={(close) => setDialogRemolque(close)} returnRemolque={(success) => refreshRemolques(success)}/>
            <ModalOperador open={dialogOperador} returnCloseDialog={(close) => setDialogOperador(close)} returnOperador={(success) => refreshOperadores(success)}/>
            <ModalCliente  open={dialogCliente} returnCloseDialog={(close) => setDialogCliente(close)} returnCliente={(success) => refreshClientes(success)}/>

            <div className="card">
                <div className="card-body"> 
                    <div className='row'>
                        <h4 className="card-title">Información general</h4>
                        <hr></hr>
                        <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12 mt-4">
                            <div className="form-group">
                                <TextField id='folio_int_viaje' className="form-control" variant="outlined" label="Folio interno del viaje" type="text" name="st_Economico" disabled value={viajeForm.folio_int_viaje || ''} inputProps={{ autoComplete: "off" }} required/>
                            </div>
                        </div>
                        <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12 mt-4">
                            <div className="input-group">
                                <TextField id='i_km_totales' className="form-control" variant="outlined" label="Km totales" type="number" name="i_km_totales" value={viajeForm.i_km_totales || ''} inputProps={{ autoComplete: "off", min: 1, max: 50000 }} required onChange={onChangeViajeForm}/>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-4 col-sm-12 col-xs-12 mt-4">
                            <div className="form-group">
                                <Autocomplete
                                    value={selectCliente}
                                    options={clientes}
                                    onChange={(_option,value) => setSelectCliente(value)}
                                    getOptionLabel={(option) => option.st_AliasCliente}
                                    isOptionEqualToValue={(option, value) => option.id_Cliente === value.id_Cliente}
                                    renderInput={(params) => <TextField {...params} label="Selecciona el cliente" variant="outlined" /> } 
                                />
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-4 col-sm-12 col-xs-12 mt-4">
                            <div className="form-group">
                                <Autocomplete
                                    id="idTipoViaje"
                                    options={TipoViaje}
                                    onChange={(_option,value) => onChangeTipoViaje(value)}
                                    getOptionLabel={(option) => option.st_Descripcion}
                                    isOptionEqualToValue={(option, value) => option.id_TipoViaje === value.id_TipoViaje}
                                    renderInput={(params) => <TextField {...params} label="Tipo de Viaje" variant="outlined" /> } 
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
                                <Autocomplete
                                    value={selectUnidad}
                                    options={unidades}
                                    onChange={(_option, value) => setSelectUnidad(value)}
                                    getOptionLabel={(option) => "ECO: " + option.st_Economico}
                                    isOptionEqualToValue={(option, value) => option.id_Unidad === value.id_Unidad}
                                    renderInput={(params) => <TextField {...params} label="Selecciona la unidad" variant="outlined" />}
                                />
                            </div>
                        </div>
                        <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                            <Autocomplete
                                multiple
                                options={remolques}
                                onChange={(_option, value) => setSelectRemolque(value)}
                                getOptionLabel={(option) => "ECO: " + option.st_Economico}
                                isOptionEqualToValue={(option, value) => option.id_Remolque === value.id_Remolque}
                                renderInput={(params) => <TextField {...params} label="Selecciona el remolque" variant="outlined" />}
                            />
                        </div>
                        <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                            <Autocomplete
                                value={selectOperador}
                                options={operadores}
                                onChange={(_option, value) => setSelectOperador(value)}
                                getOptionLabel={(option) => option.st_Nombre + " " + option.st_ApellidoP + " " + option.st_ApellidoM}
                                isOptionEqualToValue={(option, value) => option.id_Operador === value.id_Operador}
                                renderInput={(params) => <TextField {...params} label="Selecciona al operador" variant="outlined" />}
                            />
                        </div>
                        <div className='col-md-4 col-lg-4 col-sm-12 col-xs-12'>
                            <Button type='button' onClick={(e) => onSubmit(e)} variant='contained' color='success' size='medium'> Crear Viaje</Button>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default ViajeForm