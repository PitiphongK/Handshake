import React from 'react';
import { Controller, Control, FieldValues } from 'react-hook-form';
import './Inputs.css';

interface EmailInputProps {
  name: string;
  control: Control<FieldValues> | undefined;
  placeholder: string;
  required?: boolean;
}

export const EmailInput: React.FC<EmailInputProps> = ({
  name,
  control,
  placeholder,
  required,
}) => {
  return (
    <>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        rules={{
          required: required ? `Email Address is required` : false,
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address',
          },
        }}
        render={({ field, fieldState: { error } }) => (
          <>
            <div className="input-label">
              <div>
                Email Address
                {required && <span className="required-asterisk">*</span>}
              </div>
              {error && <div className="error-text">{error.message}</div>}
            </div>
            <div className={`input-wrapper ${error ? 'error' : ''}`}>
              <input
                {...field}
                type="email"
                className="input-field"
                placeholder={placeholder}
                aria-label={placeholder}
              />
            </div>
          </>
        )}
      />
    </>
  );
};