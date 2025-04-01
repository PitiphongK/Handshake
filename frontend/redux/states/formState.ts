import axios from 'axios';
import userImage from "../../src/assets/user.png";

export interface FormState {
    user: {
        name: string;
        email: string;
        password: string;
        password_confirmation: string;
        institution: string;
        interests: number[];
        activities: number[];
        imageUrl: string;
    };
    isLoading: boolean;
    errorMessage: string;
    currentStep: number;
    institutionSuffixs: {name: string, suffix: string}[];
    institutionOptions: {value: number, label: string}[];
    interestFieldOptions: {value: number, label: string}[];
    interestActivityOptions: {value: number, label: string}[];
}

const mapOptions = (data: {id: number, name: string}[]) => {
    return data.map((item: {id: number, name: string}) => ({
        value: item.id,
        label: item.name,
    }));
}

// const mapOptionsSuffix = (data: any) => {
//     return data.map((item: any) => ({
//         value: item.id,
//         label: `${item.name} : @${item.suffix}`,
//     }));
// }

const mapSuffix = (data : {name: string, suffix: string}[]) => {
    return data.map((item: {name: string, suffix: string}) => ({
        name: item.name,
        suffix: item.suffix,
    }));
}

const getInstitutionOptions = async () => {
    const response = await axios.get('/api/institutions/');
    if (response.status === 200) {
        return mapOptions(response.data);
    }
}

const getInstitutionSuffixs = async () => {
    const response = await axios.get('/api/institutions/');
    if (response.status === 200) {
        return mapSuffix(response.data);
    }
}

const getInterestFieldOptions = async () => {
    const response = await axios.get('/api/interest-fields/');
    if (response.status === 200) {
        return mapOptions(response.data);
    }
}

const getInterestActivityOptions = async () => {
    const response = await axios.get('/api/interest-activities/');
    if (response.status === 200) {
        return mapOptions(response.data);
    }
}

export const initFormState = async () => {
    return {
        institutionSuffixs: await getInstitutionSuffixs(),
        institutionOptions: await getInstitutionOptions(),
        interestFieldOptions: await getInterestFieldOptions(),
        interestActivityOptions: await getInterestActivityOptions(),
    }
}

export const formState: FormState = {
    user: {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        institution: '',
        interests: [],
        activities: [],
        imageUrl: userImage,
    },
    isLoading: false,
    errorMessage: '',
    currentStep: 1,
    institutionSuffixs: [],
    institutionOptions: [],
    interestFieldOptions: [],
    interestActivityOptions: [],
}