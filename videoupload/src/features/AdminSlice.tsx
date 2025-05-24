import { createSlice } from "@reduxjs/toolkit";


interface AdminState{
    admin:Record<string,any>
}

const initialState:AdminState = {
    admin: {}
};
const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        loginadmin(state, action) {
            state.admin = action.payload;
        },
      
        logoutadmin(state) {
            state.admin = {};
        },
         cleanAdmin(state) {
            state.admin = {};
        },
    }
});
export const { loginadmin, logoutadmin,cleanAdmin } = adminSlice.actions;
export default adminSlice.reducer;
