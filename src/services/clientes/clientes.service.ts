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

export const getClientesEmpresa = (idEmpresa: string) => {
    const controller = loadAbort();
    return {
        //es la petición http
        call: axios.get(baseUrl + "clientes/readByEmpresa/" + idEmpresa, {signal: controller.signal}),
        controller
    }
}
