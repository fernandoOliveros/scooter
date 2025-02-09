import { useFormContext } from "react-hook-form";
import { IOperadorDocumentos } from "../../../../models/operadores/operador-docs.model";

export const useDocuments = () => {
    const { register, setValue, formState: { errors } } = useFormContext<{ documentos: IOperadorDocumentos }>();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, fieldName: keyof IOperadorDocumentos) => {
        const file = event.target.files?.[0] || null;
        setValue(`documentos.${fieldName}`, file);
    };

    return { register, errors, handleFileChange };
};