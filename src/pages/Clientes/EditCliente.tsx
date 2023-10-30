import React from 'react'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function EditCliente() {
  const navigate = useNavigate();
  const catchResponseForm = (success: boolean) => {
    if(success){
      navigate("/clientes");
    }else{
      Swal.fire({ icon: 'error', title: 'Ocurrio un error', text: 'No se pudo dar de alta el clinete, verifica que esten todos los campos con (*) llenos', showConfirmButton: true });
    }
  }
  return (
    <div>EditCliente</div>
  )
}

export default EditCliente