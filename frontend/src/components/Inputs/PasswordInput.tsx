import React, { useState } from 'react';
import { Controller, Control, FieldValues } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import './Inputs.css';

interface PasswordInputProps {
  name: string;
  control: Control<FieldValues> | undefined;
  placeholder: string;
  required?: boolean;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  name,
  control,
  placeholder,
  required,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        rules={{
          required: required ? `${placeholder} is required` : false,
        }}
        render={({ field, fieldState: { error } }) => (
          <>
            <div className="input-label">
              <div>
                {placeholder}
                {required && <span className="required-asterisk">*</span>}
              </div>
              {error && <div className="error-text">{error.message}</div>}
            </div>
            <div className={`input-wrapper ${error ? 'error' : ''}`}>
              <input
                {...field}
                type={isPasswordVisible ? "text" : "password"}
                className="input-field"
                placeholder={placeholder}
                aria-label={placeholder}
              />
              <span
                className="eyeIcon"
                onClick={togglePasswordVisibility}
                style={{ cursor: "pointer", userSelect: "none" }}
              >
                {isPasswordVisible ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
              </span>
            </div>
          </>
        )}
      />
    </>
  );
};