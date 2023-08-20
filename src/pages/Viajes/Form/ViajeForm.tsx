import { ChangeEvent, useEffect, useState } from 'react'
import { IClienteForm } from '../../../models/clientes/cliente-form.model';
import { useSelector } from 'react-redux';
import { RootStore } from '../../../redux/store';
import { ICliente } from '../../../models/clientes/cliente.model';
import { UnidadModel } from '../../../models/unidades/unidad.model';
import { IRemolqueModel } from '../../../models/remolques/remolque.model';
import { IOperadorForm } from '../../../models/operadores/operador-form.model';
import { getUnidades } from '../../../services/unidades/unidades.service';
import { getOperadoresByEmpresa } from '../../../services/operadores/operadores.service';
import { getRemolques } from '../../../services/remolques/remolques.service';

// todo: VARIABLES GLOBALES
type handleChangeForm = ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;

const ViajeForm = () => {
    //Variables globales
    const userState = useSelector((store: RootStore) => store.user);
    const id_Empresa = userState.user.id_Empresa;
    
    const [clientes, setClientes] = useState<ICliente[]>([]);
    const [unidades, setUnidades] = useState<UnidadModel[]>([]);
    const [remolques, setRemolques] = useState<IRemolqueModel[]>([]);
    const [operadores, setOperadores] = useState<IOperadorForm[]>([]);

    const [selectUnidad, setSelectUnidad] = useState(null);
    const [selectOperador, setSelectOperador] = useState(null);
    const [selectRemolque, setSelectRemolque] = useState(null);



    useEffect(() => {
        const loadUnidad = getUnidades(id_Empresa);
        const loadOperadores = getOperadoresByEmpresa(id_Empresa);
        const loadRemolques = getRemolques(id_Empresa);
        const useGetUnidades = async() => {
            try{
                const response = await loadUnidad.call;
                setUnidades(response.data.data);
            }catch(error){
                alert(error);
            }
        };

        const useGetOperadores = async () => {
           
            try {
                const result = await loadOperadores.call;
                setOperadores(result.data.data);
            } catch (error) {
                alert("Error, al obtener los operadores de la empresa y/o empresa aún no tiene operadores cargados en el sistema");
                console.log(error);
            }
        }

        const useGetRemolques = async() => {
            try{
                const response = await loadRemolques.call;
                setRemolques(response.data.data);
            }catch(error){
                alert("error, al obtener los remolques");
            }
        };

        useGetUnidades();

        return() => { 
            loadRemolques.controller.abort();
            loadUnidad.controller.abort(); 
            loadOperadores.controller.abort(); 
        };
    },[]);
    
  return (
    <form className='form-horizontal'>
        <div className='form-body'>
            <h4 className='card-title'></h4>

        </div>
    </form>
  )
}

export default ViajeForm