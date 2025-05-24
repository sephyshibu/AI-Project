import { configureStore,combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage"; 

import userReducer from '../features/UserSlice'
import tokenreducer from '../features/TokenSlice'

import adminReducer from '../features/AdminSlice'
import admintokenreducer from '../features/AdminTokenSlice'
// import { PersistPartial } from "redux-persist/es/types";


interface UserState {
    user: Record<string, any>;
}

interface TokenState {
    token: string;
}
interface AdminState{
    admin:Record<string,any>
}

interface AdminTokenState{
    admintoken:string
}

const persistConfig={
    key:'root',
    storage,
    blackList:['token','admintoken']
}
const userPersistConfig = {
  key: 'user',
  storage,
  blacklist: ['token']
};

const adminPersistConfig = {
  key: 'admin',
  storage,
  blacklist: ['admintoken']
};

const rootreducer=combineReducers({
     user: persistReducer(userPersistConfig, userReducer),
     admin: persistReducer(adminPersistConfig, adminReducer),
    token:tokenreducer,
    admintoken: admintokenreducer,
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
    admin:AdminState;
    admintoken:AdminTokenState
};

// Dispatch type
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);