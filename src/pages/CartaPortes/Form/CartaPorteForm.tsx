import { useState } from 'react'
import { ICartaPorteDirOrigenForm } from '../../../models/cartaportes/cartaPorte-dirOrigen-form.model';
import { ICartaPorteDirDestinoForm } from '../../../models/cartaportes/cartaPorte-dirDestino-form.model';
import { ICartaPorteProductoServicioForm } from '../../../models/cartaportes/cartaPorte-produtoServicio-form.model';
import DirOrigenForm from './DirOrigenForm';
import DirDestinoForm from './DirDestinoForm';

//todo: Global
let ArrServicioProducto = {id_CartaPorte: null, id_ClaveProducto: null, id_ServicioProducto: null };

function CartaPorteForm() {
    //todo: vairables fijas para llebnar los arreglos
    const [serviProducto, setServiproducto] = useState<ICartaPorteProductoServicioForm>(ArrServicioProducto);

    //todo: Array con todos los origenes, destino y servicios y productos para la carta porte
    const [arrOrigenes, setArrOrigenes] = useState<ICartaPorteDirOrigenForm[]>([]);
    const [arrDestinos, setArrDestino] = useState<ICartaPorteDirDestinoForm[]>([]);
    const [arrServisProductos, setArrServisProductos] = useState<ICartaPorteProductoServicioForm[]>([]);

    //todo: Funciones reciben respuesta de los respectivos componentes
    const guardarOrigen = (origen: ICartaPorteDirOrigenForm) => setArrOrigenes([...arrOrigenes, origen]);
    const guardarDestino = (destino: ICartaPorteDirDestinoForm) => setArrDestino([...arrDestinos, destino]);

    const viewOrigenes = () => {console.log(arrOrigenes);}
    const viewDestinos = () => {console.log(arrDestinos);}
    return (
        <div className="form-horizontal">
            <div className="form-body">
                {/* ORIGENES */}
                <DirOrigenForm retornaOrigen={ (e) => guardarOrigen(e)} retornaVerOrigenes={viewOrigenes}/>
                {/* DESTINOS */}
                <DirDestinoForm retornaDestino={(e) => guardarDestino(e)} retornaVerDestinos={viewDestinos}/>
            </div>
        </div>
    )
}

export default CartaPorteForm