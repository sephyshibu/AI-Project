import { createSlice } from "@reduxjs/toolkit";


interface UserState{
    user:Record<string,any>
}

const initialState:UserState = {
    user: {}
};
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        loginuser(state, action) {
            state.user = action.payload;
        },
      
        logoutuser(state) {
            state.user = {};
        },
         cleanUser(state) {
            state.user = {};
        },
    }
});
export const { loginuser, logoutuser,cleanUser } = userSlice.actions;
export default userSlice.reducer;
