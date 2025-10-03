import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { UserRole } from '../types';
import { useAuth } from '../context/AuthContext';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formValues, setFormValues] = useState({});
  
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      address: '',
      role: 'user' as UserRole,
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, 'Must be at least 3 characters')
        .max(60, 'Must be 60 characters or less')
        .required('Required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Required'),
      password: Yup.string()
        .min(8, 'Must be at least 8 characters')
        .max(16, 'Must be 16 characters or less')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[!@#$%^&*]/, 'Password must contain at least one special character')
        .required('Required'),
      address: Yup.string()
        .max(400, 'Must be 400 characters or less')
        .required('Required'),
      role: Yup.string()
        .oneOf(['admin', 'user', 'store_owner'] as UserRole[], 'Invalid role')
        .required('Required'),
    }),
    onSubmit: async (values) => {
      console.log('Form submitted with values:', values);
      
      // Validate form values before submission
      if (!values.name || !values.email || !values.password || !values.address || !values.role) {
        setError('All fields are required');
        return;
      }

      try {
        setError('');
        setIsSubmitting(true);
        console.log('Starting registration process with data:', {
          ...values,
          password: '[HIDDEN]'
        });

        // Log the API URL being used
        console.log('Making request to:', `${process.env.REACT_APP_API_URL || 'http://localhost:4000'}/auth/register`);

        const response = await authService.register({
          name: values.name.trim(),
          email: values.email.trim().toLowerCase(),
          password: values.password,
          address: values.address.trim(),
          role: values.role
        });

        console.log('Registration API response:', response);
        
        if (response && response.id) {
          console.log('Registration successful:', response);
          const { id, email, role } = response;
          console.log('User created with ID:', id, 'Email:', email, 'Role:', role);

          // Auto-login after registration
          try {
            const loginResponse = await authService.login(values.email.trim().toLowerCase(), values.password);
            if (loginResponse && loginResponse.access_token) {
              // store token & user via AuthContext
              auth.login(loginResponse.access_token, loginResponse.user);
              // Redirect based on role
              switch (loginResponse.user.role) {
                case 'admin':
                  navigate('/admin', { replace: true });
                  break;
                case 'store_owner':
                  navigate('/store-owner', { replace: true });
                  break;
                case 'user':
                default:
                  navigate('/dashboard', { replace: true });
              }
              return;
            }
          } catch (err) {
            console.warn('Auto-login failed, falling back to login page', err);
          }

          // fallback: go to login if auto-login didn't work
          alert('Registration successful! Please login to continue.');
          navigate('/login', { replace: true });
        } else {
          console.error('Invalid server response:', response);
          throw new Error('Invalid response from server');
        }
      } catch (err) {
        console.error('Registration failed:', err);
        if (err instanceof Error) {
          setError(err.message);
        } else if (typeof err === 'string') {
          setError(err);
        } else {
          setError('Registration failed. Please try again.');
        }
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const auth = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8 bg-white p-8 rounded-xl shadow-lg backdrop-blur-sm bg-opacity-95 border border-gray-100">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join us and start rating your favorite stores
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit} noValidate>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out sm:text-sm"
                placeholder="Enter your full name"
                {...formik.getFieldProps('name')}
              />
              {formik.touched.name && formik.errors.name && (
                <div className="text-red-500 text-sm mt-1 font-medium">{formik.errors.name}</div>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out sm:text-sm"
                placeholder="Enter your email"
                {...formik.getFieldProps('email')}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-sm mt-1 font-medium">{formik.errors.email}</div>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out sm:text-sm"
                placeholder="Choose a strong password"
                {...formik.getFieldProps('password')}
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 text-sm mt-1 font-medium">{formik.errors.password}</div>
              )}
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                id="address"
                required
                rows={3}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out sm:text-sm"
                placeholder="Enter your address"
                {...formik.getFieldProps('address')}
              />
              {formik.touched.address && formik.errors.address && (
                <div className="text-red-500 text-sm mt-1 font-medium">{formik.errors.address}</div>
              )}
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label
                  className={`p-4 text-left rounded-lg border-2 transition-all duration-150 ease-in-out cursor-pointer ${
                    formik.values.role === 'user'
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    className="hidden"
                    checked={formik.values.role === 'user'}
                    onChange={() => {
                      formik.setFieldValue('role', 'user');
                      console.log('Selected role: user');
                    }}
                  />
                  <div className="font-medium text-gray-900">Regular User</div>
                  <div className="mt-1 text-sm text-gray-500">Rate and review stores</div>
                </label>
                <label
                  className={`p-4 text-left rounded-lg border-2 transition-all duration-150 ease-in-out cursor-pointer ${
                    formik.values.role === 'store_owner'
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="store_owner"
                    className="hidden"
                    checked={formik.values.role === 'store_owner'}
                    onChange={() => {
                      formik.setFieldValue('role', 'store_owner');
                      console.log('Selected role: store_owner');
                    }}
                  />
                  <div className="font-medium text-gray-900">Store Owner</div>
                  <div className="mt-1 text-sm text-gray-500">Manage your store</div>
                </label>
              </div>
              {formik.touched.role && formik.errors.role && (
                <div className="text-red-500 text-sm mt-1 font-medium">{formik.errors.role}</div>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>
          )}
          <div className="flex flex-col space-y-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white 
                ${isSubmitting 
                  ? 'bg-indigo-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-150 ease-in-out transform hover:scale-[1.02]'} 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering...
                </>
              ) : 'Create Account'}
            </button>
            <div className="text-center">
              <span className="text-sm text-gray-600">Already have an account? </span>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors duration-150 ease-in-out"
              >
                Sign in
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;