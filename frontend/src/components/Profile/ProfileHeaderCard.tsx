import React from 'react';
import './ProfileHeaderCard.css';
import { Mail } from 'lucide-react';

interface ProfileHeaderCardProps {
    name: string;
    location?: string;
    institution?: string;
    imageUrl?: string;
    email?: string;
}

const ProfileHeaderCard: React.FC<ProfileHeaderCardProps> = ({
    name,
    location,
    institution,
    imageUrl,
    email,
}) => {

    return (
        <div className="flex gap-4 w-full p-4 bg-white lg:px-[calc((100vw-940px)/2)] py-10 md:rounded-lg">
            <div>{imageUrl && <img src={imageUrl} alt='avatar' className="rounded-full w-24 h-24" />}</div>
            <div className='flex flex-col gap-2 flex-grow'>
                <p className="text-xl font-bold text-default-900">{name}</p>
                <p className="text-sm text-default-900">{institution}</p>
                <p className="text-sm text-default-900">{location}</p>
                <a href={"mailto:"+email} className="flex items-center gap-1 text-sm text-primary-600 hover:underline">{email}<Mail size={15}/></a>
            </div>
        </div>
    );
};

export default ProfileHeaderCard;