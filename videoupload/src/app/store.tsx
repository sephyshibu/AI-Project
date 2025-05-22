import { configureStore,combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage"; 

import userReducer from '../features/UserSlice'
import tokenreducer from '../features/TokenSlice'
// import { PersistPartial } from "redux-persist/es/types";


interface UserState {
    user: Record<string, any>;
}

interface TokenState {
    token: string;
}


const persistConfig={
    key:'root',
    storage,
    blackList:['token']
}

const rootreducer=combineReducers({
    user:userReducer,
    token:tokenreducer
})

const persistreducer=persistReducer(persistConfig,rootreducer)

export const store = configureStore({
    reducer: persistreducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // This should be an array of action types to ignore
                ignoredActions: [
                    FLUSH, 
                    REHYDRATE, 
                    PAUSE, 
                    PERSIST, 
                    PURGE, 
                    REGISTER
                ],
            },
        }), // This will return the middlewares properly
});

// Correct RootState type accounting for PersistPartial
export type RootState = {
    user: UserState ;
    token: TokenState ;
};

// Dispatch type
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);