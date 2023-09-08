import axios from "axios";
import loadAbort from "../../utils/load-abort.util"
import baseUrl from "../../utils/base-url.utils";
import { IClienteForm } from "../../models/clientes/cliente-form.model";


export const createCliente = (cliente: IClienteForm) => {
    const controller = loadAbort();
    return {
        call: axios.post(baseUrl + "clientes/create", cliente, { signal: controller.signal, }),
        controller
    }
}


export const getClientes = (idEmpresa: string) => {
    const controller = loadAbort();
    return {
        //es la petición http
        call: axios.get(baseUrl + "clientes/read/" + idEmpresa, {signal: controller.signal}),
        //controlador para abortar la petición en caso necesario
        controller
    }
}