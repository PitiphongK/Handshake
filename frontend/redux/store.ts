import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import formReducer from './slices/formSlice'

export const store = configureStore({
    reducer: {
        user: userReducer,
        form: formReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch