import React from 'react';

interface FormInputProps {
  label: string;
  name: string;
  type: string;
  error?: string;
  touched?: boolean;
  [key: string]: any;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type,
  error,
  touched,
  ...props
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={name}
        type={type}
        className={`appearance-none relative block w-full px-3 py-2 border ${
          touched && error ? 'border-red-500' : 'border-gray-300'
        } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
        {...props}
      />
      {touched && error && (
        <div className="text-red-500 text-xs mt-1">{error}</div>
      )}
    </div>
  );
};

interface FormSubmitButtonProps {
  children: React.ReactNode;
  isSubmitting?: boolean;
}

export const FormSubmitButton: React.FC<FormSubmitButtonProps> = ({
  children,
  isSubmitting
}) => {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
        isSubmitting ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
    >
      {isSubmitting ? 'Please wait...' : children}
    </button>
  );
};