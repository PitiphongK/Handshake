import React from 'react';
import { Controller, Control, FieldValues, ValidationRule } from 'react-hook-form';
import './Inputs.css';

interface TextInputProps<T extends FieldValues = FieldValues> {
  name: string;
  header: string;
  control: Control<T> | undefined;
  placeholder: string;
  required?: boolean;
  maxLength?: number;
  pattern?: ValidationRule<RegExp> | undefined;
}

export const TextInput: React.FC<TextInputProps<FieldValues>> = ({
  name,
  header,
  control,
  placeholder,
  required,
  maxLength = 250,
  pattern
}) => {
  return (
    <>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        rules={{
          required: required ? `${header} is required` : false,
          maxLength: {
            value: maxLength,
            message: `Maximum ${maxLength} characters allowed`,
          },
          pattern: pattern
        }}
        render={({ field, fieldState: { error } }) => (
          <>
            <div className="input-label">
              <div>
                {header}
                {required && <span className="required-asterisk">*</span>}
              </div>
              {error && <div className="error-text">{error.message}</div>}
            </div>
            <div className={`input-wrapper ${error ? 'error' : ''}`}>
              <input
                {...field}
                type="text"
                className="input-field"
                placeholder={placeholder}
                aria-label={placeholder}
                maxLength={maxLength}
              />
            </div>
          </>
        )}
      />
    </>
  );
};