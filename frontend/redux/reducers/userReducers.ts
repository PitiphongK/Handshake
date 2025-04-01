import { PayloadAction } from '@reduxjs/toolkit';
import { UserData } from '../../src/interfaces/interfaces';
import { UserState } from '../states/userState';

const userReducers = {
    setUserData: (state: UserState, action: PayloadAction<UserData>) => {
        state.first_name = action.payload.first_name;
        state.last_name = action.payload.last_name;
        state.email = action.payload.email;
        state.bio = action.payload.bio;
        state.institution = action.payload.institution;
        state.location = action.payload.location;
        state.fields = action.payload.interest_fields;
        state.activities = action.payload.interest_activities;
        state.imageUrl = action.payload.picture;
    },
}

export default userReducers