import { useEffect } from 'react'

const Viajes = () => {
    console.log("render");
    useEffect(() => {
        console.log("useffect ");
    },[]);

    return (
        <div>
            
        </div>
    )
}

export default Viajes;