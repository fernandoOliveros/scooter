import { userModel } from '../../models';
import { createSlice } from '@reduxjs/toolkit';

export const UserEmptyState: userModel = {
    token: null,
    user: {
        id_User: 0,
        id_Empresa: 0,
        st_Nombre: undefined,
        st_Email: undefined,
        st_Password: undefined,
        createdAt: undefined, 
        updatedAt: undefined
    }
};


//Le ponemos <T,> porque es cualquier tipo de dato que manden desde la llamada de la funcion
export const persistLocalStorage = <T>(key: string, value: T) => {
    localStorage.setItem(key, JSON.stringify({ ...value }));
};
  
export const clearLocalStorage = (key: string) => {
    localStorage.removeItem(key);
};

export const userSlice = createSlice({
  name: 'user',
  initialState: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : UserEmptyState,
  reducers: {
    createUser: (_state, action) => {
        persistLocalStorage<userModel>('user', action.payload);
        return action.payload;
    },
    modifyUser: (state, action) =>  {
        const result  = { ...state, ...action.payload };
        persistLocalStorage<userModel>('user', result);
        return result
        
    },
    resetUser: () => {
        clearLocalStorage('user');
        return UserEmptyState;
    }
  }
});

export const { createUser, modifyUser, resetUser } = userSlice.actions;

export default userSlice.reducer;