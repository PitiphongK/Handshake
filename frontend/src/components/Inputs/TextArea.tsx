import React, { useRef, useEffect, useState } from 'react';
import { Controller, Control, FieldValues } from 'react-hook-form';
import './Inputs.css';

interface TextAreaProps {
  name: string;
  header: string;
  control: Control<FieldValues> | undefined;
  placeholder: string;
  required?: boolean;
  maxLength?: number;
}

export const TextArea: React.FC<TextAreaProps> = ({
  name,
  header,
  control,
  placeholder,
  required,
  maxLength = 250,
}) => {
  const [charCount, setCharCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      adjustTextareaHeight();
    }
  }, []);

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
              <textarea
                {...field}
                ref={textareaRef}
                className="input-field"
                placeholder={placeholder}
                aria-label={placeholder}
                rows={1}
                maxLength={maxLength}
                onChange={(e) => {
                  field.onChange(e);
                  adjustTextareaHeight();
                  setCharCount(e.target.value.length);
                }}
              />
            </div>
            <div className="char-count">
              {charCount}/{maxLength}
            </div>
          </>
        )}
      />

    </>
  );
};