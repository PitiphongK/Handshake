import { Controller, Control, FieldValues } from 'react-hook-form';
import React from 'react';
import SelectReact from 'react-select';

interface MultiSelectProps {
  name: string;
  header: string;
  options: { value: number; label: string }[];
  control: Control<FieldValues> | undefined;
  required?: boolean;
  id?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
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
              isMulti // Enable multi-select
              onChange={(selectedOptions) => {
                // Extract values from selected options
                const values = selectedOptions?.map((option) => option.value) || [];
                field.onChange(values); // Update form value
              }}
              onBlur={field.onBlur} // Handle blur event
              value={options.filter((option) => field.value?.includes(option.value))} // Map selected values
              styles={{
                control: (base, state) => ({
                  ...base,
                  borderColor: error ? 'var(--color-error)' : 'var(--color-neutral-400)', // Highlight error
                  boxShadow: state.isFocused
                    ? '0 0 0 0.25rem var(--color-primary-200)'
                    : base.boxShadow,
                  color: 'var(--color-black)',
                }),
                multiValue: (base) => ({
                  ...base,
                  backgroundColor: 'var(--color-primary-100)',
                }),
                multiValueLabel: (base) => ({
                  ...base,
                  color: 'var(--color-primary-900)',
                }),
                multiValueRemove: (base) => ({
                  ...base,
                  color: 'var(--color-primary-900)',
                  ':hover': {
                    backgroundColor: 'var(--color-primary-200)',
                  },
                }),
              }}
            />
          </div>
        </>
      )}
    />
  );
};