import { createSlice } from "@reduxjs/toolkit";


interface AdminState{
    email:string
}

const initialState:AdminState = {
    email:''
};
const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        loginadmin(state, action) {
            state.email = action.payload;
        },
      
        logoutadmin(state) {
            state.email = '';
        },
         cleanAdmin(state) {
            state.email = '';
        },
    }
});
export const { loginadmin, logoutadmin,cleanAdmin } = adminSlice.actions;
export default adminSlice.reducer;
