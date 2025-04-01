import { PayloadAction } from '@reduxjs/toolkit';
import { FormState } from '../states/formState';

const formReducers = {
    goToNextStep: (state: FormState) => {
        state.currentStep += 1;
        state.errorMessage = '';
    },
    goToPreviousStep: (state: FormState) => {
        state.currentStep -= 1;
        state.errorMessage = '';
    },
    setErrorMessage: (state: FormState, action: PayloadAction<string>) => {
        state.errorMessage = action.payload;
    },
    setEmail: (state: FormState, action: PayloadAction<string>) => {
        state.user.email = action.payload;
    },
    setInstitute: (state: FormState, action: PayloadAction<string>) => {
        state.user.institution = action.payload;
    },
    setImageUrl: (state: FormState, action: PayloadAction<string>) => {
        state.user.imageUrl = action.payload;
    },
    setIsLoading: (state: FormState, action: PayloadAction<boolean>) => {
        state.isLoading = action.payload;
    }
}

export default formReducers