import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface tokenState{
    token:string
}

const initialState:tokenState={
    token:""
}

const tokenSlice=createSlice({
    name:'usertoken',
    initialState,
    reducers:{
        addtoken(state,action:PayloadAction<{token:string}>){
                state.token=action.payload.token
        },
        cleartoken: (state) => {
            state.token = '';
        },
    }

})

export const { addtoken, cleartoken } = tokenSlice.actions;
export default tokenSlice.reducer;