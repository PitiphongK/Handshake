import React from 'react';
import './Interests.css';

interface InterestsProps {
    interests?: (string | undefined)[];
}

const interestsSection: React.FC<InterestsProps> = ({ interests = [] }) => {
    return (
        <div className="flex flex-col min-w-fit bg-white lg:mx-[calc((100vw-940px)/2)] mt-6 md:rounded-lg">
            <p className="text-base font-bold text-default-900 p-4">Fields</p>
            <hr className="border-t border-default-300" />
            <div className='flex flex-wrap gap-1 p-4'>
                {interests.map((item, index) => (
                    <React.Fragment key={index}>
                        {index !== 0 && <p className="text-sm text-default-900">·</p>}
                        {index <= 2 && <p className="text-sm text-default-900">{item}</p>}
                    </React.Fragment>
                ))}
            </div>
        </div>
    )

}

export default interestsSection;