import { ChangeEvent, useEffect, useState } from 'react'
import { IClienteForm } from '../../../models/clientes/cliente-form.model';
import { useSelector } from 'react-redux';
import { RootStore } from '../../../redux/store';
import { Autocomplete, Button, TextField } from '@mui/material';
import { IRegFiscal } from '../../../models/cfdis/cfdi-form.model';
import { getCatRegimenFiscal } from '../../../services/cfdi/cfdi.service';
import { createCliente } from '../../../services/clientes/clientes.service';
import useFetchAndLoad from '../../../hooks/useFetchAndLoad';

//todo: interfaz de Props
export interface Props {
    returnFormCliente: (success: boolean) => void
}

type handleChangeForm = ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;

const ClienteForm = ({returnFormCliente}: Props) => {
    console.log("cliente form");
    //todo: Variables globales
    const userState = useSelector((store: RootStore) => store.user);
    const id_Empresa = userState.user.id_Empresa;
    const [load, setLoad] = useState<boolean>(false);
    const { callEndpoint } = useFetchAndLoad();

    //todo: variables del formulario
    const [clienteForm, setClienteForm] = useState<IClienteForm>({ st_RazonSocial: '', st_AliasCliente : '', id_RegimenFiscal : null, st_RFC: '', i_Status: 1, st_PersonaRepresenta: '', st_Celular: '', st_Correo: '', id_Empresa: id_Empresa});

    //todo: catálogos
    const [catRegFiscal, setCatRegFiscal] = useState<IRegFiscal[]>([]);
    const [selectRegFiscal, SetSelectRegFiscal] = useState<IRegFiscal | null>(null);

    useEffect( () => {
        const loadRegFiscal = getCatRegimenFiscal();
        const _getRegFiscal = async() => {
            let result = await loadRegFiscal.call;
            if(result.data.success){
              let response = result.data;
              setCatRegFiscal( response.data );
            }
        }
        _getRegFiscal();
    },[]);

    const onChangeForm  = ({ target: { name, value } }: handleChangeForm) => {
        setClienteForm({...clienteForm, [name]: value});
    }

    const onChangeRegimenFiscal = (item: any) => {
        if(item !== null){
            catRegFiscal.forEach((element) => {
                if(element.id_RegimenFiscal === item.id_RegimenFiscal){
                    SetSelectRegFiscal(element);
                }
            });
        }else{
            SetSelectRegFiscal(null);
        }
    }

    //todo: CADA VEZ QUE SELECCIONAMOS ALGO DEL SELECT REGIMEN FISCAL SE EJECUTA LA FUNCION
    useEffect( () => {
        if(selectRegFiscal !== null){
            setClienteForm({...clienteForm, id_RegimenFiscal:  selectRegFiscal.id_RegimenFiscal });
        }else{
            setClienteForm({...clienteForm, id_RegimenFiscal:  null });
        }
    },[selectRegFiscal]);


    const onSubmitForm = async (e:any) => {
        e.preventDefault();
        setLoad(true);
        try {
            let service = await callEndpoint(createCliente(clienteForm));
            console.log(service);
            returnFormCliente(true);
        } catch (error) {
            returnFormCliente(false);
        }
        setLoad(false);
    }

    return (
        <form className='form-horizontal'>
            <div className="form-body">
                <h4 className="card-title">Información del cliente</h4>
                <hr></hr>
                <div className='row'>
                    <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                        <div className="form-group">
                            <TextField id='st_RazonSocial' className="form-control" variant="outlined" label="Razon Social"  type="text" name="st_RazonSocial" onChange={onChangeForm} value={clienteForm.st_RazonSocial || ''} inputProps={{ autoComplete: "off" }} required />
                        </div>
                    </div>
                    <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                        <div className="form-group">
                            <TextField id='st_AliasCliente' className="form-control" variant="outlined" label="Alias del cliente"  type="text" name="st_AliasCliente" onChange={onChangeForm} value={clienteForm.st_AliasCliente || ''} inputProps={{ autoComplete: "off" }} required />
                        </div>
                    </div>
                    <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                        <div className="form-group">
                            <TextField id='st_RFC' className="form-control" variant="outlined" label="RFC del cliente"  type="text" name="st_RFC" onChange={onChangeForm} value={clienteForm.st_RFC || ''} inputProps={{ autoComplete: "off" }} required />
                        </div>
                    </div>
                    <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                        <div className="form-group">
                            <Autocomplete
                            options={catRegFiscal}
                            value={selectRegFiscal}
                            onChange={(_option, value) => onChangeRegimenFiscal(value)}
                            getOptionLabel={(option) => option.c_RegimenFiscal + " - " + option.st_Descripcion}
                            isOptionEqualToValue={(option, value) => option.id_RegimenFiscal === value.id_RegimenFiscal}
                            renderInput={(params) => <TextField {...params} label="Regimen Fiscal" variant="outlined" />} />
                        </div>
                    </div>
                </div>
                <div className="row mt-4">
                    <div className="col-md-12 col-lg-12 col-sm-12 col-xs-12">
                        {
                            !load ? (
                            <Button onClick={ (e) => onSubmitForm(e) } variant='contained' color='success' size='medium' type='button'>Alta Cliente </Button>
                            ) : (
                                <i className="fa fa-spinner fa-spin" style={{fontSize: "25px", color: "#038a68"}}>  </i>
                            )
                        }   
                    </div>
                </div>
            </div>
        </form>
    );
}

export default ClienteForm;
