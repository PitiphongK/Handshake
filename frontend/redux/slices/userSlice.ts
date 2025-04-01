import { createSlice } from '@reduxjs/toolkit'
import userReducers from '../reducers/userReducers'
import userState from '../states/userState'

const userSlice = createSlice({
    name: 'user',
    initialState: userState,
    reducers: userReducers
}) 

export const { setUserData } = userSlice.actions
export default userSlice.reducer