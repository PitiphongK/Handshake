import { useState } from 'react';
import Navbar from '../Navbar/Navbar'
import ProfileHeaderCard from './ProfileHeaderCard';
import About from './About';
import Interests from './Interests';
import './Profile.css';
import { useParams } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import { useEffect } from 'react';
import { useAppSelector } from '../../../redux/hooks';
import { Option } from '../../interfaces/interfaces';
import { addToast } from '@heroui/react';
import { AxiosError } from 'axios';

interface UserData {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    bio: string;
    institution: number;
    location: string;
    interest_fields: number[];
    interest_activities: string[];
    picture: string;
}

const ProfilePage = () => {
    const institutionOptions = useAppSelector((state) => state.form.institutionOptions) as Option[];
    const interestFieldOptions = useAppSelector((state) => state.form.interestFieldOptions) as Option[];
    const [profile, setProfile] = useState<UserData>();
    const params = useParams();
    const id = params.id;

    const institutionNumberToName = (institutionNumber: number) => {
        return institutionOptions.find((option: Option) => option.value === institutionNumber)?.label;
    }
    const interestFieldNumberToName = (interestFieldNumberList: number[] = []) => {
        return interestFieldNumberList.map((interestFieldNumber: number) => {
            return interestFieldOptions.find((option: Option) => option.value === interestFieldNumber)?.label;
        });
    }

    useEffect(() => {
        const getProfile = async () => {
            try {
                const data = (await apiClient.get(`/api/user-profiles/${id}`)).data;
                setProfile(data);
            }
            catch (err) {
                console.log(err);
                if (err instanceof AxiosError) {
                    addToast({
                    title: "Fetched user failed",
                    description: err?.response?.data.detail || "",
                    color: "danger",
                    timeout: 3000,
                    classNames: {
                        base: "shadow-lg",
                    },
                    });
                }
            }
        }
        getProfile();
    }, [id]);

    if (!profile) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Navbar />
            <ProfileHeaderCard
                name={profile.first_name + " " + profile.last_name}
                location={profile.location}
                institution={institutionNumberToName(profile.institution)}
                imageUrl={profile.picture}
                email={profile.email}
            />
            <About about={profile.bio} />
            <Interests interests={interestFieldNumberToName(profile.interest_fields)} />
        </>
    )


}

export default ProfilePage;