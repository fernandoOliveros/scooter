import { ChangeEvent, useState } from 'react'
import { IClienteForm } from '../../../models/clientes/cliente-form.model';
import { useSelector } from 'react-redux';
import { RootStore } from '../../../redux/store';
import { TextField } from '@mui/material';

type handleChangeForm = ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;

const ClienteForm = () => {

    console.log("cliente form");
    //Variables globales
    const userState = useSelector((store: RootStore) => store.user);
    const id_Empresa = userState.user.id_Empresa;

    //variables del formulario
    const [clienteForm, setClienteForm] = useState<IClienteForm>({ st_RazonSocial: '', st_AliasCliente : '', id_RegimenFiscal : null, st_RFC: '', i_Status: 1, st_PersonaRepresenta: '', st_Celular: '', st_Correo: '', id_Empresa: id_Empresa, id_Candado: 1});


    const onChangeForm  = ({ target: { name, value } }: handleChangeForm) => {
        setClienteForm({...clienteForm, [name]: value});
    }

    return (
        <form className='form-horizontal'>
            <div className="form-body">
                <h4 className="card-title">Información General de la Unidad</h4>
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
                            <TextField id='st_RFC' className="form-control" variant="outlined" label="Alias del cliente"  type="text" name="st_RFC" onChange={onChangeForm} value={clienteForm.st_AliasCliente || ''} inputProps={{ autoComplete: "off" }} required />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}

export default ClienteForm