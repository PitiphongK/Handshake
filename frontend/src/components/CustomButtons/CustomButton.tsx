import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import './Button.css';

interface ButtonProps {
  text: string;
  icon: IconDefinition; 
  link?: string; // Optional link for navigation
  onClick?: () => void; // Optional click handler
}

const Button: React.FC<ButtonProps> = ({ text, icon, link, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      // Execute the provided onClick function if it exists
      onClick();
    } else if (link) {
      // Navigate to the link if onClick is not provided
      navigate(link);
    }
  };

  return (
    <button className="button-custom" onClick={handleClick}>
      <FontAwesomeIcon icon={icon} />
      <h2>{text}</h2>
    </button>
  );
};

export default Button;
