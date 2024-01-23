import { useParams } from "react-router-dom";


const SetUpViaje = () =>  {
  const { idViaje } = useParams();
  return (
    <div>{idViaje}</div>
  )
}

export default SetUpViaje