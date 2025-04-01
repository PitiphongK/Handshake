import React from 'react'
import './ProfileCard.css'

interface profileCardProps {
  name: string;
  description: string;
  location: string;
  institution: string;
  activity: string;
  imageUrl: string;
  fields: (string | undefined)[];
  onClick?: () => void;
};

const ProfileCard: React.FC<profileCardProps> = ({
  name,
  institution,
  imageUrl,
  onClick,
  fields
}) => {
  return (
    <div className='profile-card' onClick={onClick}>
      
      <div className='flex flex-col gap-3 flex-grow'>
        <p className="text-base font-extrabold text-default-900">{name}</p>
        <p className="text-sm text-default-700">{institution}</p>
        <div className='flex flex-col'>
          <p className="text-xs font-extrabold text-default-900">Interested Fields</p>
          <div className='flex flex-wrap gap-1'>
            {fields.map((item, index) => (
              <React.Fragment key={index}>
                {index !== 0 && <p className="text-sm text-default-900">·</p>}
                <p className="text-sm text-default-900">{item}</p>
              </React.Fragment>
            ))}
          </div>
        </div>
        
      </div><div>{imageUrl && <img src={imageUrl} alt='avatar' className="rounded-full w-20 h-20" />}</div>
      {/* <div className='profile-footer'>
        <div className='location-info'>
          <div className='location-item'>
            <FontAwesomeIcon icon={faLocationDot} />
            <h3>{location}</h3>
          </div>
          <div className='location-item'>
            <FontAwesomeIcon icon={faBuilding} />
            <h3>{institution}</h3>
          </div>
        </div>
        <div className='tag'>
          <h4><strong>{activity}</strong></h4>
        </div>
      </div> */}
    </div>
  )
}

export default ProfileCard