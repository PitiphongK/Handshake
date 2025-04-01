// No longer used in the project, but kept for compatibility with the old code

import React, { useState, useRef, useEffect } from 'react';
import { Controller, Control, FieldValues } from 'react-hook-form';
import './Inputs.css';

interface InputFieldProps {
  name: string;
  header: string;
  placeholder: string;
  type?: string;
  control: Control<FieldValues> | undefined;
  required?: boolean;
  id?: string;
  accept?: string;
  maxLength?: number; // Add maxLength prop
}

export const InputField: React.FC<InputFieldProps> = ({
  name,
  header,
  placeholder,
  type = "text",
  control,
  required,
  id,
  accept,
  maxLength = 250, // Default maxLength is 250
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [charCount, setCharCount] = useState(0); // Track character count
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  // Function to adjust the height of the textarea dynamically
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height to auto
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set height to scroll height
    }
  };

  // Adjust textarea height when the component mounts or the value changes
  useEffect(() => {
    if (type === "textarea" && textareaRef.current) {
      adjustTextareaHeight();
    }
  }, [type]);

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      rules={{
        required: required ? `${header} is required` : false,
        maxLength: {
          value: maxLength,
          message: `Maximum ${maxLength} characters allowed`, // Error message for max length
        },
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
            {type === "textarea" ? (
              <>
                <textarea
                  {...field} // Spread react-hook-form's field props
                  ref={textareaRef}
                  className="input-field"
                  placeholder={placeholder}
                  aria-label={placeholder}
                  id={id}
                  rows={1} // Start with a single row
                  maxLength={maxLength} // Set max length
                  onChange={(e) => {
                    field.onChange(e); // Call react-hook-form's onChange
                    adjustTextareaHeight(); // Adjust height dynamically
                    setCharCount(e.target.value.length); // Update character count
                  }}
                />
              </>
            ) : (
              <input
                {...field} // Spread react-hook-form's field props
                type={type === "password" && isPasswordVisible ? "text" : type}
                className="input-field"
                placeholder={placeholder}
                aria-label={placeholder}
                id={id}
                accept={accept}
              />
            )}
            {type === "password" && (
              <span
                className="eyeIcon"
                onClick={togglePasswordVisibility}
                style={{ cursor: "pointer", userSelect: "none" }}
              >
                {isPasswordVisible ? "eye" : "eye-slash"}
              </span>
            )}
          </div>
          { type === "textarea" ? (
            <div className="char-count">
              {charCount}/{maxLength} {/* Display character count */}
            </div>
          ) : null}
        </>
      )}
    />
  );
};