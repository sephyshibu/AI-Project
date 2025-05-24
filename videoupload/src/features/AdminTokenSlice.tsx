import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface admintokenState{
    admintoken:string
}

const initialState:admintokenState={
    admintoken:''
}

const admintokenSlice=createSlice({
    name:'useradminlState',
    initialState,
    reducers:{
        adminaddtoken(state,action:PayloadAction<{admintoken:string}>){
                state.admintoken=action.payload.admintoken
        },
        cleartoken: (state) => {
            state.admintoken = '';
        },
    }

})

export const { adminaddtoken, cleartoken } = admintokenSlice.actions;
export default admintokenSlice.reducer;