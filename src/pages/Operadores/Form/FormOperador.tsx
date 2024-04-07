import { ChangeEvent, Fragment, useState } from "react";
import { useSelector } from "react-redux";
import { RootStore } from "../../../redux/store";
import useFetchAndLoad from "../../../hooks/useFetchAndLoad";
import { IOperadorForm } from "../../../models/operadores/operador-form.model";
import { SubmitHandler, useForm } from "react-hook-form";
import { IOperadorDireccion } from "../../../models/operadores/operador-direccion.model";
import { IOperadorTelefono } from "../../../models/operadores/operador-telefono.model";
import { IOperadorContactos } from "../../../models/operadores/operador-contactos.model";
import { IOperadorDocumentos } from "../../../models/operadores/operador-docs.model";
import { Button, TextField } from "@mui/material";
import { IColonia } from "../../../models/shared/colonias.model";
import { getColoniasByCodigoPostal } from "../../../services/public.service";
import { IAutoComplete } from "../../../models/shared/autocomplete.model";
import { AutocompleteField } from "../../../components/shared/AutoCompleteField";
import ViewDocumentsOperador from "../Documents/ViewDocumentsOperador";

// todo: VARIABLES GLOBALES
const MAX_FILE_SIZE = 5002400;
const DocumentosOeprador = ["url_CURP", "url_RFC", "url_ComprobanteDom"];

//todo: Props
export interface Props {
    id_Remolque?: number,
    returnFormOperador: (success: boolean) => void
}

function FormOperador({id_Remolque = 0, returnFormOperador}: Props) {
    console.log(id_Remolque);
    //todo: Store
    const userState = useSelector((store: RootStore) => store.user);
    const id_Empresa = userState.user.id_Empresa;

    //todo: Catalogos
    const [colonias, setColinas] = useState<IAutoComplete[]>([]);

    //todo: ID's
    const [idDocumento, setIdDocumento] = useState<number>(0);
    const [steps, setSteps] = useState<number>(1);

    //todo: Custom Hooks
    const { callEndpoint } = useFetchAndLoad();

    //todo: Formualrio General operador
    const {register, setValue, handleSubmit, formState: {errors}} = useForm<IOperadorForm>();

    //todod: formulario dirección operadod
    const {register: registerDire, setValue: setValueDire, control: controlDire, handleSubmit: handleSubmitDire, formState: { errors: errorsDire }} =  useForm<IOperadorDireccion>();

    //todo: Formulario Telefonos
    const {register: registerTele, setValue: setValueTele, handleSubmit: handleSubmitTele, formState: { errors: errorsTele }} =  useForm<IOperadorTelefono>({
        mode: "onBlur",
        defaultValues: {
            id_Categoria: 1,
            id_Operador: null,
            st_NumTelefono: ''
        }
    });

    const {register: registerAll, setValue: setValueAll, formState: { errors: errorsAll }} = useForm();

    //todo: Formulario Contacto
    const {register: registerContact, setValue: setValueContact, handleSubmit: handleSubmitContact, formState: { errors: errorsContact }} =  useForm<IOperadorContactos>();

    //todo: Formulario
    const {register: viewDireccion, setValue: setViewDireccion} = useForm();

    //todo: Formulario Documentos
    const [documentos, setDocumentos] = useState<IOperadorDocumentos>({url_RFC: '', url_CURP: '', url_ComprobanteDom: ''});

    const nextStep = () => {
        let indexStep = steps;
        setSteps(++indexStep);
    }

    const getColoniaWithCP = (codigo_postal: string) => {
        if(codigo_postal.length === 5){
            try {
                const serviceColonias = getColoniasByCodigoPostal(codigo_postal);
                serviceColonias.call
                .then((result) => {
                    const response = result.data;

                    //todo: set form direction intern
                    setValueDire("id_Estado", response.data.id_Estado);
                    setValueDire("id_Localidad", response.data.id_Localidad);
                    setValueDire("id_Municipio", response.data.id_Municipio);

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
            setValueDire("id_Estado", null);
            setValueDire("id_Localidad", null);
            setValueDire("id_Municipio", null);

            //todo: Set view direction fields
            setViewDireccion("st_Estado", "");
            setViewDireccion("st_Localidad", "");
            setViewDireccion("st_Municipio", "");

            //todo: set catalogo colonias
            setColinas([]);
        }
    }

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
    
    const onSubmitGeneral: SubmitHandler<IOperadorForm> = (data, e) => {
        e?.preventDefault();
        //nextStep();
        console.log(data);
        
    }

    const onSubmitDireccion: SubmitHandler<IOperadorDireccion> = (data, e) => {
        e?.preventDefault();
        console.log(data);
    }

    const onSubmitContacto: SubmitHandler<IOperadorContactos>= (data, e) => {
        e?.preventDefault();
        console.log(data);
    }

    const obSubmitTelefono: SubmitHandler<IOperadorTelefono> = (data, e) => {
        e?.preventDefault();
        console.log(data);
    }

    return (
        <Fragment>
            {
                steps === 1 && (
                    <form className='form-horizontal' onSubmit={handleSubmit(onSubmitGeneral)}>
                        <div className="form-body">
                            <h4 className="card-title">Información del Operador</h4>
                            <hr></hr>
                            <div className='row'>
                                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                                    <div className="form-group">
                                        <TextField className="form-control" variant="outlined" label="Nombre" type="text"
                                        {...register("st_Nombre", {
                                            required: "Campo Requerido",
                                        })}
                                        error={errors.st_Nombre ? true : false}
                                        helperText={errors.st_Nombre && errors.st_Nombre.message}
                                        inputProps={{ autoComplete: "off" }}/>
                                    </div>
                                </div>
                                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                                    <div className="form-group">
                                        <TextField className="form-control" variant="outlined" label="Apellido Paterno" type="text"
                                        {...register("st_ApellidoP", {
                                            required: "Campo Requerido",
                                        })}
                                        error={errors.st_ApellidoP ? true : false}
                                        helperText={errors.st_ApellidoP && errors.st_ApellidoP.message}
                                        inputProps={{ autoComplete: "off" }}/>
                                    </div>
                                </div>
                                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                                    <div className="form-group">
                                        <TextField className="form-control" variant="outlined" label="Apellido Materno" type="text"
                                        {...register("st_ApellidoM", {
                                            required: "Campo Requerido",
                                        })}
                                        error={errors.st_ApellidoM ? true : false}
                                        helperText={errors.st_ApellidoM && errors.st_ApellidoM.message}
                                        inputProps={{ autoComplete: "off" }}/>
                                    </div>
                                </div>
                                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                                    <div className="form-group">
                                        <TextField className="form-control" variant="outlined" label="No. Seguro social" type="text"
                                        {...register("st_NumIMSS", {
                                            required: "Campo Requerido",
                                        })}
                                        error={errors.st_NumIMSS ? true : false}
                                        helperText={errors.st_NumIMSS && errors.st_NumIMSS.message}
                                        inputProps={{ autoComplete: "off" }}/>
                                    </div>
                                </div>
                                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                                    <div className="form-group">
                                        <TextField className="form-control" variant="outlined" label="CURP" type="text"
                                        {...register("st_CURP", {
                                            required: "Campo Requerido",
                                        })}
                                        error={errors.st_CURP ? true : false}
                                        helperText={errors.st_CURP && errors.st_CURP.message}
                                        inputProps={{ autoComplete: "off" }}/>
                                    </div>
                                </div>
                                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                                    <div className="form-group">
                                        <TextField className="form-control" variant="outlined" label="RFC" type="text"
                                        {...register("st_RFC", {
                                            required: "Campo Requerido",
                                        })}
                                        error={errors.st_RFC ? true : false}
                                        helperText={errors.st_RFC && errors.st_RFC.message}
                                        inputProps={{ autoComplete: "off" }}/>
                                    </div>
                                </div>
                                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                                    <div className="form-group">
                                        <TextField className="form-control" variant="outlined" label="No. Licencia" type="text"
                                        {...register("st_NumLicencia", {
                                            required: "Campo Requerido",
                                        })}
                                        error={errors.st_NumLicencia ? true : false}
                                        helperText={errors.st_NumLicencia && errors.st_NumLicencia.message}
                                        inputProps={{ autoComplete: "off" }}/>
                                    </div>
                                </div>
                                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                                    <div className="form-group">
                                        <TextField fullWidth label="Vigencia de la Licencia"
                                        {...register("date_LicenciaVigencia", {
                                            required: "Campo Requerido",
                                        })}
                                        error={errors.date_LicenciaVigencia ? true : false}
                                        helperText={errors.date_LicenciaVigencia && errors.date_LicenciaVigencia.message}
                                        InputLabelProps={{ shrink: true }} type="date" inputProps={{ autoComplete: "off" }}/>
                                    </div>
                                </div>
                                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                                    <div className="form-group">
                                        <TextField fullWidth label="Fecha de Nacimiento"
                                        {...register("date_Nacimiento", {
                                            required: "Campo Requerido",
                                        })}
                                        error={errors.date_Nacimiento ? true : false}
                                        helperText={errors.date_Nacimiento && errors.date_Nacimiento.message}
                                        InputLabelProps={{ shrink: true }} type="date" inputProps={{ autoComplete: "off"}}/>
                                    </div>
                                </div>
                                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                                    <div className="form-group">
                                        <TextField className="form-control" variant="outlined" label="Celular" type="text"
                                        {...registerTele("st_NumTelefono", {
                                            required: "Campo Requerido",
                                            maxLength: 10
                                        })}
                                        error={errorsTele.st_NumTelefono ? true : false}
                                        helperText={errorsTele.st_NumTelefono && errorsTele.st_NumTelefono.message}
                                        inputProps={{ autoComplete: "off", maxLength:"10" }}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="co-3">
                                <Button variant='contained' color='info' size='medium' type="submit">Siguiente</Button>
                            </div>
                        </div>
                    </form>
                )
            }
            <br></br>
            {
                steps === 2 && (
                    <form className='form-horizontal' onSubmit={handleSubmitDire(onSubmitDireccion)}>
                        <div className="form-body">
                            <h4 className="card-title">Dirección del Operador</h4>
                            <hr></hr>
                            <div className='row'>
                                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                                    <div className="form-group">
                                        <TextField className="form-control" variant="outlined" label="Calle" type="text"
                                        {...registerDire("st_Calle", {
                                            required: "Campo Requerido",
                                        })}
                                        error={errorsDire.st_Calle ? true : false}
                                        helperText={errorsDire.st_Calle && errorsDire.st_Calle.message}
                                        inputProps={{ autoComplete: "off" }}/>
                                    </div>
                                </div>
                                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                                    <div className="form-group">
                                        <TextField className="form-control" variant="outlined" label="No. Exterior" type="text"
                                        {...registerDire("st_NoExterior", {
                                            required: "Campo Requerido",
                                        })}
                                        error={errorsDire.st_NoExterior ? true : false}
                                        helperText={errorsDire.st_NoExterior && errorsDire.st_NoExterior.message}
                                        inputProps={{ autoComplete: "off" }}/>
                                    </div>
                                </div>
                                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                                    <div className="form-group">
                                        <TextField className="form-control" variant="outlined" label="No. Interior" type="text"
                                        {...registerDire("st_NoInterior", {
                                            required: "Campo Requerido",
                                        })}
                                        error={errorsDire.st_NoInterior ? true : false}
                                        helperText={errorsDire.st_NoInterior && errorsDire.st_NoInterior.message}
                                        inputProps={{ autoComplete: "off" }}/>
                                    </div>
                                </div>
                                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                                    <div className="form-group">
                                        <TextField className="form-control" variant="outlined" label="Cogio Postal" type="text"
                                        {...registerDire("c_codigoPostal", {
                                            required: "Campo Requerido",
                                            maxLength: 5,
                                            onBlur: (e) => getColoniaWithCP(e.target.value)
                                        })}
                                        error={errorsDire.c_codigoPostal ? true : false}
                                        helperText={errorsDire.c_codigoPostal && errorsDire.c_codigoPostal.message}
                                        inputProps={{ autoComplete: "off" }}/>
                                    </div>
                                </div>
                                <div className="col-md-4 col-lg-4 col-sm-6 col-xs-12">
                                    <div className="form-group">
                                        <AutocompleteField 
                                            options={colonias}
                                            control={controlDire}
                                            name='id_Colonia'
                                            placeholder='Selecciona la colonia'
                                        />
                                    </div>
                                </div>
                                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                                    <div className="form-group">
                                        <TextField className="form-control" variant="outlined" label="Municipio" 
                                        {...viewDireccion("st_Municipio", {
                                            required: "Campo Requerido",
                                        })}
                                        type="text" InputLabelProps={{ shrink: true }} inputProps={{ autoComplete: "off", readOnly:true }}/>
                                    </div>
                                </div>
                                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                                    <div className="form-group">
                                        <TextField className="form-control" variant="outlined" label="Localidad" type="text"
                                        {...viewDireccion("st_Localidad", {
                                            required: "Campo Requerido",
                                        })}
                                        InputLabelProps={{ shrink: true }} inputProps={{ autoComplete: "off", readOnly:true }}/>
                                    </div>
                                </div>
                                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                                    <div className="form-group">
                                        <TextField className="form-control" variant="outlined" label="Estado"  type="text"
                                        {...viewDireccion("st_Estado", {
                                            required: "Campo Requerido",
                                        })}
                                        inputProps={{ autoComplete: "off", readOnly:true }} InputLabelProps={{ shrink: true }}/>
                                    </div>
                                </div>
                                <div className="col-md-12 col-lg-12 col-sm-12 col-xs-12">
                                    <div className="form-group">
                                        <TextField className="form-control" variant="outlined" label="Referencia"
                                        {...registerDire("st_RefDomicilio")}
                                        name="st_RefDomicilio" type="text"  inputProps={{ autoComplete: "off"}}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                                <div className="col-1">
                                    <Button variant='contained' color='info' size='medium' type="button">Atras</Button>
                                </div>
                                <div className="col-1">
                                    <Button variant='contained' color='success' size='medium' type="submit">Siguiente</Button>
                                </div>
                        </div>
                    </form>
                )
            }
            <br></br>
            {
                steps === 3 && (
                    <form className='form-horizontal' onSubmit={handleSubmitContact(onSubmitContacto)}>
                        <div className="form-body">
                            <h4 className="card-title">Contacto de Emergencia</h4>
                            <hr></hr>
                            <div className='row'>
                                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                                    <div className="form-group">
                                        <TextField className="form-control" variant="outlined" label="Nombre completo" type="text"
                                        {...registerContact("st_Nombre", {
                                            required: "Campo Requerido",
                                        })}
                                        error={errorsContact.st_Nombre ? true : false}
                                        helperText={errorsContact.st_Nombre && errorsContact.st_Nombre.message}
                                        inputProps={{ autoComplete: "off" }}/>
                                    </div>
                                </div>
                                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                                    <div className="form-group">
                                        <TextField className="form-control" variant="outlined" label="Celular" type="text"
                                        {...registerContact("st_NumTelefono", {
                                            required: "Campo Requerido",
                                        })}
                                        error={errorsContact.st_NumTelefono ? true : false}
                                        helperText={errorsContact.st_NumTelefono && errorsContact.st_NumTelefono.message}
                                        inputProps={{ autoComplete: "off" }}/>
                                    </div>
                                </div>
                                <div className="col-md-4 col-lg-4 col-sm-12 col-xs-12">
                                    <div className="form-group">
                                        <TextField className="form-control" variant="outlined" label="Parentesco" type="text"
                                        {...registerContact("st_Parentesco", {
                                            required: "Campo Requerido",
                                        })}
                                        error={errorsContact.st_Parentesco ? true : false}
                                        helperText={errorsContact.st_Parentesco && errorsContact.st_Parentesco.message}
                                        inputProps={{ autoComplete: "off" }}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                )
            }
            {
                steps === 4 && (
                    <form className="form-horizontal">
                        <div className="form-body">
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
                        </div>
                    </form>
                )
            }   
        </Fragment>
    )
}

export default FormOperador