import userImage from "../../src/assets/user.png";

export interface UserState {
    first_name: string;
    last_name: string;
    email: string;
    institution: string;
    fields: string[];
    activities: string[];
    imageUrl: string;
    bio: string;
    location: string;
}

const userState = {
    first_name: '',
    last_name: '',
    bio: '',
    location: '',
    email: '',
    institution: '',
    fields: [],
    activities: [],
    imageUrl: userImage,
}

export default userState