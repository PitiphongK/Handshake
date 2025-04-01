export interface Option {
    value: number | string;
    label: string;
}

export interface UserData {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    bio: string;
    institution: string;
    location: string;
    interest_fields: string[];
    interest_activities: string[];
    picture: string;
}

export interface ProjectData {
    id: number;
    name: string;
    description: string,
    owner: number,
    date_created: string,
    members: number[],
    posts: number[]
}

export interface PostData {
    id: number,
    title: string,
    content: string,
    project: number,
    author: number,
    date_created: string
}