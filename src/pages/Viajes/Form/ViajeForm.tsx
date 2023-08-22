import { useEffect, useState, lazy } from 'react'
import { useSelector } from 'react-redux';
import { RootStore } from '../../../redux/store';
import { UnidadModel } from '../../../models/unidades/unidad.model';
import { IRemolqueModel } from '../../../models/remolques/remolque.model';
import { getUnidades } from '../../../services/unidades/unidades.service';
import { getOperadoresByEmpresa } from '../../../services/operadores/operadores.service';
import { getRemolques } from '../../../services/remolques/remolques.service';
import { Autocomplete, IconButton, TextField } from '@mui/material';
import { IAutoComplete } from '../../../models/shared/autocomplete.model';
import { IViajeForm } from '../../../models/viajes/viaje-form.model';
import { IOperadorModel } from '../../../models/operadores/operador.model';
import AddIcon from '@mui/icons-material/Add';

//Lazy
const DialogForms = lazy( () => import('../../../components/shared/DialogForms'));

// todo: VARIABLES GLOBALES

const ViajeForm = () => {
    //todo: Variables globales
    const userState = useSelector((store: RootStore) => store.user);
    const id_Empresa = userState.user.id_Empresa;
    const [optionForm, setOptionForm]= useState(0);

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

    //const [newUnidad, setNewUnidad] = useState(false);
    //const [newRemolque, setNewRemolque] = useState(false);
    //const [newOperador, setNewOperador] = useState(false);

    const [open, setOpen] = useState<boolean>(false);

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

    const openModal = (op: boolean, option: number) => {
        setOptionForm(option);
        setOpen(op);
    }
    
    return (
        <form className='form-horizontal'>
            {
                ( open && optionForm !== 0) 
                ? ( <DialogForms open={open} returnCloseDialog={(e) => setOpen(e)} optionForm={optionForm} /> ) 
                : void(0)
            }
            <div className='form-body'>
                <div className='row'>
                    <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                        <div className="form-group">
                            <h4 className="card-title">Información general</h4>
                            <TextField id='folio_int_viaje' className="form-control" variant="outlined" label="Folio interno del viaje" type="text" name="st_Economico" disabled value={1} inputProps={{ autoComplete: "off" }} required/>
                        </div>
                    </div>
                    <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                        <h4 className="card-title">
                            Selecciona la Unidad
                            <IconButton aria-label="Nueva Unidad" color='primary' onClick={ () => openModal(true, 1)}>
                                <AddIcon />
                            </IconButton>
                        </h4>
                        <Autocomplete
                            value={selectUnidad}
                            options={unidades}
                            onChange={(_option, value) => onSelectUnidad(value)}
                            getOptionLabel={(option) => option.label ? option.label : ''}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            renderInput={(params) => <TextField {...params} label="Selecciona la unidad" variant="outlined" />}
                        />
                    </div>
                    <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                        <h4 className="card-title">
                            Selecciona el Remolque
                            <IconButton aria-label="Nuevo Remolque" color='primary' onClick={ () => openModal(true, 2) }>
                                <AddIcon />
                            </IconButton>
                        </h4>
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
                        <h4 className="card-title">
                            Selecciona al Operador
                            <IconButton aria-label="Nuevo Operador" color='primary' onClick={ () => openModal(true, 3) }>
                                <AddIcon />
                            </IconButton>
                        </h4>
                        <Autocomplete
                            value={selectOperador}
                            options={operadores}
                            onChange={(_option, value) => onSelectOperador(value)}
                            getOptionLabel={(option) => option.label ? option.label : ''}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            renderInput={(params) => <TextField {...params} label="Selecciona al operador" variant="outlined" />}
                        />
                    </div>
                </div>
            </div>
        </form>
    )
}

export default ViajeForm