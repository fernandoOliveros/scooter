import loadAbort from "../../utils/load-abort.util"
import baseUrl from "../../utils/base-url.utils";
import { IClienteForm } from "../../models/clientes/cliente-form.model";
import api from "../api";


export const createCliente = (cliente: IClienteForm) => {
    const controller = loadAbort();
    return {
        call: api.post(baseUrl + "clientes/create", cliente, { signal: controller.signal }),
        controller
    }
}

export const getClientesEmpresa = () => {
    const controller = loadAbort();
    return {
        //es la petición http
        call: api.get(baseUrl + "clientes/readByEmpresa", { signal: controller.signal }),
        controller
    }
}
