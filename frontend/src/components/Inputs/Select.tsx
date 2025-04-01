import { Controller, Control, FieldValues } from 'react-hook-form';
import React from 'react';
import SelectReact from 'react-select';

interface SelectProps {
  name: string;
  header: string;
  options: { value: number | string; label: string }[];
  control: Control<FieldValues> | undefined;
  required?: boolean;
  id?: string;
}

export const Select: React.FC<SelectProps> = ({
  name,
  header,
  options,
  control,
  required,
  id,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: required ? `${header} is required` : false }}
      render={({ field, fieldState: { error } }) => (
        <>
          <div className="input-label">
            <div>
              {header}
              {required && <span className="required-asterisk">*</span>}
            </div>
            {error && <div className="error-text">{error.message}</div>}
          </div>
          <div>
          <SelectReact
            {...field}
            inputId={id} // Optional ID for accessibility
            options={options}
            placeholder={`Select ${header}`}
            onChange={(option) => field.onChange(option?.value)} // Set value on change
            onBlur={field.onBlur} // Handle blur event
            value={options.find((option) => option.value === field.value)} // Map selected value
            styles={{
              control: (base, state) => ({
                ...base,
                borderColor: 'var(--color-neutral-400)',
                boxShadow: state.isFocused ? '0 0 0 0.25rem var(--color-primary-200)': base.boxShadow,
                color: 'var(--color-black)',
              }),
            }}
          />
        </div></>
      )}
    />
  );
};
