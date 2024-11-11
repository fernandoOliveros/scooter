export interface userModel {
    token: string | null;
    user: {
        id_User: number;
        id_Empresa: number;
        st_Nombre?: string;
        i_Edad?:  number;
        st_Email?: string; 
        st_Password?: string;
        createdAt?: string; 
        updatedAt?: string;
    }
}