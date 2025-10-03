import React from 'react';
import { Store } from '../../types';

interface StoreFormProps {
  initialValues?: Partial<Store>;
  onSubmit: (values: Pick<Store, 'name' | 'email' | 'address'>) => Promise<void>;
  isSubmitting: boolean;
}

const StoreForm: React.FC<StoreFormProps> = ({
  initialValues = { name: '', email: '', address: '' },
  onSubmit,
  isSubmitting,
}) => {
  const [formValues, setFormValues] = React.useState<Pick<Store, 'name' | 'email' | 'address'>>({
    name: initialValues.name || '',
    email: initialValues.email || '',
    address: initialValues.address || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formValues);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Store Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          required
          minLength={20}
          maxLength={60}
          value={formValues.name}
          onChange={handleChange}
          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Store Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          required
          value={formValues.email}
          onChange={handleChange}
          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Store Address
        </label>
        <textarea
          name="address"
          id="address"
          required
          maxLength={400}
          value={formValues.address}
          onChange={handleChange}
          rows={3}
          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            isSubmitting
              ? 'bg-indigo-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        >
          {isSubmitting ? 'Saving...' : 'Save Store'}
        </button>
      </div>
    </form>
  );
};

export default StoreForm;