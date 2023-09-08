import { useEffect, useState, lazy, ChangeEvent, Fragment } from 'react'
import { useSelector } from 'react-redux';
import { RootStore } from '../../../redux/store';
import { UnidadModel } from '../../../models/unidades/unidad.model';
import { IRemolqueModel } from '../../../models/remolques/remolque.model';
import { getUnidades } from '../../../services/unidades/unidades.service';
import { getOperadoresByEmpresa } from '../../../services/operadores/operadores.service';
import { getRemolques } from '../../../services/remolques/remolques.service';
import { Autocomplete, Button, TextField } from '@mui/material';
import { IAutoComplete } from '../../../models/shared/autocomplete.model';
import { IViajeForm } from '../../../models/viajes/viaje-form.model';
import { IOperadorModel } from '../../../models/operadores/operador.model';
import AddIcon from '@mui/icons-material/Add';

//Lazy
const ModalUnidad = lazy( () => import('../../../components/Unidades/DialogUnidad'));
const ModalRemolque = lazy( () => import('../../../components/Remolques/DialogRemolque'));
const ModalOperador = lazy( () => import('../../../components/Operadores/DialogOperador'));


// todo: VARIABLES GLOBALES
type handleChangeForm = ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;

const ViajeForm = () => {
    const TipoViaje = [{id_TipoViaje: 1, st_Descripcion: "Local"}, {id_TipoViaje: 2, st_Descripcion: "Foráneo"}];

    //Button News
    const optionsNew = ['Nueva unidad', 'Nuevo remolque', 'Nuevo operador', 'Nuevo cliente'];

    //todo: Variables globales
    const userState = useSelector((store: RootStore) => store.user);
    const id_Empresa = userState.user.id_Empresa;

    const[dialogUnidad, setDialogUnidad] = useState<boolean>(false);
    const[dialogRemolque, setDialogRemolque] = useState<boolean>(false);
    const[dialogOperador, setDialogOperador] = useState<boolean>(false);

    const [viajeForm, setViajeForm] = useState<IViajeForm>({ folio_int_viaje: 0, id_Cliente: null, id_TipoViaje: null, id_Unidad: null, id_Operador: null, id_Remolque: null, i_km_totales: 0, id_Empresa:  id_Empresa, id_StatusViaje: 0 });
    
    // CATÁLOGOS PARA LOS SELECT DE UNIDADES, OPERADORES, REMOLQUES
    //const [clientes, setClientes] = useState<IAutoComplete[]>([]);
    const [unidades, setUnidades] = useState<IAutoComplete[]>([]);
    const [remolques, setRemolques] = useState<IAutoComplete[]>([]);
    const [operadores, setOperadores] = useState<IAutoComplete[]>([]);

    const [selectUnidad, setSelectUnidad] = useState(null);
    const [selectOperador, setSelectOperador] = useState(null);
    const [selectRemolque, setSelectRemolque] = useState(null);
    //const [selectCliente, setSelectCliente] = useState(null);

    const [newUnidad, setNewUnidad] = useState(false);
    const [newRemolque, setNewRemolque] = useState(false);
    const [newOperador, setNewOperador] = useState(false);
    const [newCliente, setNewCliente] = useState(false);

    useEffect(() => {
        // CALL SERVICES TO CAT
        const loadUnidad = getUnidades(id_Empresa);
        const loadOperadores = getOperadoresByEmpresa(id_Empresa);
        const loadRemolques = getRemolques(id_Empresa);

        const useGetUnidades = async() => {
            try{
                const response = await loadUnidad.call;
                let info = response.data.data;
                let dataFormatter = info.map( (item: UnidadModel) => ({
                    id: item.id_Unidad,
                    label: "ECO: " + item.st_Economico
                }));
                setUnidades(dataFormatter);
            }catch(error){ alert(error); }
        };

        const useGetOperadores = async () => {
            try {
                const result = await loadOperadores.call;
                let info = result.data.data;
                let dataFormatter = info.map( (item: IOperadorModel) => ({
                    id: item.id_Operador,
                    label: item.st_Nombre + " " + item.st_ApellidoP + " " + item.st_ApellidoM
                }));
                setOperadores(dataFormatter);
            } catch (error) { console.log(error); }
        }

        const useGetRemolques = async() => {
            try{
                const response = await loadRemolques.call;
                let info = response.data.data;
                let dataFormatter = info.map( (item: IRemolqueModel) => ({
                    id: item.id_Remolque,
                    label: "ECO: " + item.st_Economico
                }));
                setRemolques(dataFormatter);
            }catch(error){ console.log(error); }
        };

        //Call Functions
        useGetUnidades();
        useGetOperadores();
        useGetRemolques();

        return() => { 
            loadRemolques.controller.abort();
            loadUnidad.controller.abort(); 
            loadOperadores.controller.abort(); 
        };
    },[]);
    

    const onChangeViajeForm = ({ target: { name, value } }: handleChangeForm) => {
        setViajeForm({...viajeForm, [name]: value});
    }

    const onSelectUnidad  = (unidad: any) => {
        if(unidad !== null){
            setSelectUnidad(unidad);
            setViajeForm({...viajeForm , id_Unidad: unidad.id});
        }else{
            setSelectUnidad(null);
            setViajeForm({...viajeForm , id_Unidad: null});
        }
    }

    const onSelectRemolques = (remolque: any) => {
        if(remolque !== null){
            setSelectRemolque(remolque);
            setViajeForm({...viajeForm , id_Remolque: remolque.id});
        }else{
            setSelectRemolque(null);
            setViajeForm({...viajeForm , id_Remolque: null});
        }
    }

    const onSelectOperador = (operador: any) => {
        if(operador !== null){
            setSelectOperador(operador);
            setViajeForm({...viajeForm , id_Operador: operador.id});
        }else{
            setSelectOperador(null);
            setViajeForm({...viajeForm , id_Operador: null});
        }
    }

    const onChangeTipoViaje = (tipoViaje: any) => {
        if(tipoViaje !== null){
            setViajeForm({...viajeForm, id_TipoViaje : tipoViaje.id_TipoViaje});
        }else{
            setViajeForm({...viajeForm, id_TipoViaje : null});
        }
    }

    useEffect(() => {
        const loadUnidad = getUnidades(id_Empresa);
        const useGetUnidades = async() => {
            console.log("Entro");
            try{
                const response = await loadUnidad.call;
                let info = response.data.data;
                let dataFormatter = info.map( (item: UnidadModel) => ({
                    id: item.id_Unidad,
                    label: "ECO: " + item.st_Economico
                }));
                setUnidades(dataFormatter);
            }catch(error){ alert(error); }
        };
        useGetUnidades();

        return() => { 
            loadUnidad.controller.abort(); 
        };

    },[newUnidad]);

    useEffect(() => {},[newRemolque]);
    useEffect(() => {},[newOperador]);
    useEffect(() => {},[newCliente]);

    const refreshUnidades  = (set: boolean) => setNewUnidad(set);
    const refreshRemolques  = (set: boolean) => setNewRemolque(set);
    const refreshOperadores  = (set: boolean) => setNewOperador(set);

    const onSubmit = (e: any) => {
        e.preventDefault();
        console.log(viajeForm);
    }

    return (
        <Fragment>
            <ModalUnidad open={dialogUnidad} returnCloseDialog={(close) => setDialogUnidad(close)} returnUnidad={(success) => refreshUnidades(success)}/>
            <ModalRemolque open={dialogRemolque} returnCloseDialog={(close) => setDialogRemolque(close)} returnRemolque={(success) => refreshRemolques(success)}/>
            <ModalOperador open={dialogOperador} returnCloseDialog={(close) => setDialogOperador(close)} returnOperador={(success) => refreshOperadores(success)}/>

            <div className="card">
                <div className="card-body">
                    <div className='row'>
                        <h4 className="card-title">Información general</h4>
                        <hr></hr>
                        <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12 mt-4">
                            <div className="form-group">
                                <TextField id='folio_int_viaje' className="form-control" variant="outlined" label="Folio interno del viaje" type="text" name="st_Economico" disabled value={1} inputProps={{ autoComplete: "off" }} required/>
                            </div>
                        </div>
                        <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12 mt-4">
                            <div className="input-group">
                                <TextField id='i_km_totales' className="form-control" variant="outlined" label="Km totales" type="number" name="i_km_totales" value={viajeForm.i_km_totales} inputProps={{ autoComplete: "off", min: 1, max: 50000 }} required onChange={onChangeViajeForm}/>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-4 col-sm-12 col-xs-12 mt-4">
                            <div className="form-group">
                                <Autocomplete
                                    id="idTipoViaje"
                                    options={TipoViaje}
                                    onChange={(option,value) => onChangeTipoViaje(value)}
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
                            <Button startIcon={<AddIcon/>} size='small' variant="contained" color='primary' onClick={ (e) => setDialogUnidad(true) }>Nueva unidad</Button>
                            <Button startIcon={<AddIcon/>} size='small' variant="contained" color='primary' onClick={ (e) => setDialogRemolque(true) }>Nuevo remolque</Button>
                            <Button startIcon={<AddIcon/>} size='small' variant="contained" color='primary' onClick={ (e) => setDialogOperador(true) }>Nuevo operador</Button>
                        </div>
                        <hr></hr>
                        <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                            <div className="form-group">
                                <Autocomplete
                                    value={selectUnidad}
                                    options={unidades}
                                    onChange={(_option, value) => onSelectUnidad(value)}
                                    getOptionLabel={(option) => option.label ? option.label : ''}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    renderInput={(params) => <TextField {...params} label="Selecciona la unidad" variant="outlined" />}
                                />
                            </div>
                        </div>
                        <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                            <Autocomplete
                                value={selectRemolque}
                                options={remolques}
                                onChange={(_option, value) => onSelectRemolques(value)}
                                getOptionLabel={(option) => option.label ? option.label : ''}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                renderInput={(params) => <TextField {...params} label="Selecciona el remolque" variant="outlined" />}
                            />
                        </div>
                        <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                            <Autocomplete
                                value={selectOperador}
                                options={operadores}
                                onChange={(_option, value) => onSelectOperador(value)}
                                getOptionLabel={(option) => option.label ? option.label : ''}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                renderInput={(params) => <TextField {...params} label="Selecciona al operador" variant="outlined" />}
                            />
                        </div>
                        <div className='col-md-4 col-lg-4 col-sm-12 col-xs-12'>
                            <Button onClick={(e) => onSubmit(e)} variant='contained' color='success' size='medium'> Crear Viaje</Button>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default ViajeForm