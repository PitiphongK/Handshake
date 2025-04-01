import React from 'react';
import './About.css';

interface AboutProps {
    about: string;
}

const About: React.FC<AboutProps> = ({ about }) => {
    return (
        <div className="flex flex-col min-w-fit bg-white lg:mx-[calc((100vw-940px)/2)] mt-6 md:rounded-lg">
            <p className="text-base font-bold text-default-900 p-4">About</p>
            <hr className="border-t border-default-300"/>
            <p className="text-sm text-default-900 p-4">{about}</p>
        </div>
    );
}

export default About;