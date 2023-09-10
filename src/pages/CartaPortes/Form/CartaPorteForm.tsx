import { useState } from 'react'
import { ICartaPorteDirOrigenForm } from '../../../models/cartaportes/cartaPorte-dirOrigen-form.model';
import { ICartaPorteDirDestinoForm } from '../../../models/cartaportes/cartaPorte-dirDestino-form.model';
import { ICartaPorteUbicaciones } from '../../../models/cartaportes/cartaPorte-ubicaciones.model';
//components forms
import DirOrigenForm from './DirOrigenForm';
import DirDestinoForm from './DirDestinoForm';
import ProductoServicioForm from './ProductoServicioForm';


//todo: Global
let ArrServicioProducto = {id_CartaPorte: null, id_ClaveProducto: null, id_ServicioProducto: null };
function CartaPorteForm() {
    //todo: Array con todos los origenes, destino y servicios y productos para la carta porte
    const [arrOrigenes, setArrOrigenes] = useState<ICartaPorteDirOrigenForm[]>([]);
    const [arrDestinos, setArrDestino] = useState<ICartaPorteDirDestinoForm[]>([]);
    const [ubicaciones, setUbicaciones] = useState<ICartaPorteUbicaciones[]>([]);

    //todo: Funciones reciben respuesta de los respectivos componentes
    const guardarOrigen = (origen: ICartaPorteDirOrigenForm) => {
        //Armamos el arreglo para ubicación de tipo origen
        let ubicacionEspecifica = {
            c_codigoPostal: origen.c_codigoPostal,
            id_Estado: origen.id_Estado,
            id_Municipio: origen.id_Municipio,
            id_Localidad:origen.id_Localidad, 
            id_Colonia: origen.id_Colonia,
            Pais: 'MEX',
            st_Calle: origen.st_Calle,
            st_NoExterior: origen.st_NoExterior,
            st_NoInterior:origen.st_NoInterior,
            st_RefDomicilio: origen.st_RefDomicilio,
        }
        let object = {
            Domicilio: ubicacionEspecifica,
            date_FechaSalida :  origen.date_FechaSalida,
            st_RemitenteRFC : origen.st_RemitenteRFC ,
            st_RemitenteNombre : origen.st_RemitenteNombre,
            TipoUbicacion: origen.TipoUbicacion
        }
        setUbicaciones([...ubicaciones, object]);
        setArrOrigenes([...arrOrigenes, origen]);
    }
    const guardarDestino = (destino: ICartaPorteDirDestinoForm) => {
        //Armamos el arreglo para ubicación de tipo origen
        let ubicacionEspecifica = {
            c_codigoPostal: destino.c_codigoPostal,
            id_Estado: destino.id_Estado,
            id_Municipio: destino.id_Municipio,
            id_Localidad:destino.id_Localidad, 
            id_Colonia: destino.id_Colonia,
            Pais: 'MEX',
            st_Calle: destino.st_Calle,
            st_NoExterior: destino.st_NoExterior,
            st_NoInterior:destino.st_NoInterior,
            st_RefDomicilio: destino.st_RefDomicilio,
        }
        let object = {
            Domicilio: ubicacionEspecifica,
            st_FechaHoraLlegada :  destino.date_FechaLlegada,
            st_DestinatarioRFC : destino.st_DestinatarioRFC ,
            st_DestinatarioNombre : destino.st_DestinatarioNombre,
            TipoUbicacion: destino.TipoUbicacion,
            DistanciaRecorrida: destino.dec_DistRe,
            DistanciaRecorridaSpecified: (destino.dec_DistRe.length > 0) ? true : false
            
        }
        setUbicaciones([...ubicaciones, object]);
        setArrDestino([...arrDestinos, destino]);
    }

    /*
    const saveUbicaciones = (origen: ICartaPorteDirOrigenForm, destino: ICartaPorteDirDestinoForm) => {
        console.log("OK");
        guardarOrigen(origen);
        guardarDestino(destino);
        console.log(ubicaciones);
    }
    */

    const viewOrigenes = () => {console.log(ubicaciones);}
    const viewDestinos = () => {console.log(ubicaciones);}

    return (
        <div className="form-horizontal">
            <div className="form-body">
                {/* ORIGENES */}
                <DirOrigenForm retornaOrigen={ (e) => guardarOrigen(e)} retornaVerOrigenes={viewOrigenes}/>
                {/* DESTINOS */}
                <DirDestinoForm retornaDestino={(e) => guardarDestino(e)} retornaVerDestinos={viewDestinos}/>
                <ProductoServicioForm />
            </div>
        </div>
    )
}

export default CartaPorteForm