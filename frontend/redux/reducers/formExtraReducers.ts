import { initFormState, formState, FormState } from '../states/formState';
import { createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

export const initializeForm = createAsyncThunk(
    'form/initializeForm',
    async () => {
        const formState = await initFormState();
        return formState;
    }
);

const formExtraReducers = (builder: ActionReducerMapBuilder<typeof formState>) => {
    builder
        .addCase(initializeForm.fulfilled, (state: FormState, action: PayloadAction<{ institutionSuffixs?: {name: string, suffix: string}[]; institutionOptions?: {value: number, label: string}[]; interestFieldOptions?: {value: number, label: string}[]; interestActivityOptions?: {value: number, label: string}[]; }>) => {
            state.institutionSuffixs = action.payload.institutionSuffixs || [];
            state.institutionOptions = action.payload.institutionOptions || [];
            state.interestFieldOptions = action.payload.interestFieldOptions || [];
            state.interestActivityOptions = action.payload.interestActivityOptions || [];
        })
}

export default formExtraReducers