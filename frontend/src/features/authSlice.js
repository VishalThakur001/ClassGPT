import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    status: false,
    user: {}
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers:{
        login: (state, action) => {
            state.status = true;
            state.user = action.payload.user;
        },
        logout: (state) => {
            return initialState;
        }
    }
})

export const { login, logout } = authSlice.actions; 
export default authSlice.reducer;