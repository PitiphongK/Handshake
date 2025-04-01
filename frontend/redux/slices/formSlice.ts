import { createSlice } from '@reduxjs/toolkit'
import formReducers from '../reducers/formReducers';
import { formState } from '../states/formState';
import formExtraReducers from '../reducers/formExtraReducers';

const formSlice = createSlice({
    name: 'form',
    initialState: formState,
    reducers: formReducers,
    extraReducers: formExtraReducers,
})

export const { goToNextStep, goToPreviousStep, setErrorMessage, setEmail, setImageUrl, setIsLoading, setInstitute } = formSlice.actions

export default formSlice.reducer