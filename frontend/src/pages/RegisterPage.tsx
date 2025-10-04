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
  const auth = useAuth();
  
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

          try {
            const loginResponse = await authService.login(values.email.trim().toLowerCase(), values.password);
            if (loginResponse && loginResponse.access_token) {
              auth.login(loginResponse.access_token, loginResponse.user);
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

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-slide-up {
          animation: slideUp 0.6s ease-out;
        }

        .animate-fade-in {
          animation: fadeIn 0.4s ease-out;
        }

        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }

        .input-focus-effect {
          transition: all 0.3s ease;
        }

        .input-focus-effect:focus {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.3);
        }

        .glass-effect {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        .role-card {
          transition: all 0.3s ease;
        }

        .role-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.2);
        }
      `}</style>

      <div className="max-w-2xl w-full space-y-8 relative z-10 animate-slide-up">
        <div className="glass-effect p-10 rounded-2xl shadow-2xl">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 shadow-lg transform hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 tracking-tight mb-2">
              Create Account
            </h2>
            <p className="text-gray-600 text-base">
              Join us and start rating your favorite stores
            </p>
          </div>

          <form className="mt-10 space-y-6" onSubmit={formik.handleSubmit} noValidate>
            <div className="space-y-5">
              <div className="animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input
                    id="name"
                    type="text"
                    required
                    className="input-focus-effect appearance-none block w-full pl-12 pr-4 py-3.5 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-sm bg-white"
                    placeholder="Enter your full name"
                    {...formik.getFieldProps('name')}
                  />
                </div>
                {formik.touched.name && formik.errors.name && (
                  <div className="text-red-600 text-sm mt-2 font-medium flex items-center animate-shake">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {formik.errors.name}
                  </div>
                )}
              </div>

              <div className="animate-fade-in" style={{ animationDelay: '0.15s', animationFillMode: 'both' }}>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="input-focus-effect appearance-none block w-full pl-12 pr-4 py-3.5 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-sm bg-white"
                    placeholder="you@example.com"
                    {...formik.getFieldProps('email')}
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <div className="text-red-600 text-sm mt-2 font-medium flex items-center animate-shake">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {formik.errors.email}
                  </div>
                )}
              </div>

              <div className="animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="input-focus-effect appearance-none block w-full pl-12 pr-4 py-3.5 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-sm bg-white"
                    placeholder="Choose a strong password"
                    {...formik.getFieldProps('password')}
                  />
                </div>
                {formik.touched.password && formik.errors.password && (
                  <div className="text-red-600 text-sm mt-2 font-medium flex items-center animate-shake">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {formik.errors.password}
                  </div>
                )}
              </div>

              <div className="animate-fade-in" style={{ animationDelay: '0.25s', animationFillMode: 'both' }}>
                <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                  Address
                </label>
                <div className="relative">
                  <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <textarea
                    id="address"
                    required
                    rows={3}
                    className="input-focus-effect appearance-none block w-full pl-12 pr-4 py-3.5 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-sm bg-white resize-none"
                    placeholder="Enter your address"
                    {...formik.getFieldProps('address')}
                  />
                </div>
                {formik.touched.address && formik.errors.address && (
                  <div className="text-red-600 text-sm mt-2 font-medium flex items-center animate-shake">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {formik.errors.address}
                  </div>
                )}
              </div>

              <div className="animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label
                    className={`role-card p-5 text-left rounded-xl border-2 cursor-pointer ${
                      formik.values.role === 'user'
                        ? 'border-indigo-500 bg-indigo-50 shadow-md'
                        : 'border-gray-300 bg-white hover:border-indigo-300'
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
                    <div className="flex items-center mb-2">
                      <svg className={`w-5 h-5 mr-2 ${formik.values.role === 'user' ? 'text-indigo-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <div className="font-semibold text-gray-900">Regular User</div>
                    </div>
                    <div className="text-sm text-gray-600">Rate and review stores</div>
                  </label>
                  <label
                    className={`role-card p-5 text-left rounded-xl border-2 cursor-pointer ${
                      formik.values.role === 'store_owner'
                        ? 'border-indigo-500 bg-indigo-50 shadow-md'
                        : 'border-gray-300 bg-white hover:border-indigo-300'
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
                    <div className="flex items-center mb-2">
                      <svg className={`w-5 h-5 mr-2 ${formik.values.role === 'store_owner' ? 'text-indigo-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <div className="font-semibold text-gray-900">Store Owner</div>
                    </div>
                    <div className="text-sm text-gray-600">Manage your store</div>
                  </label>
                </div>
                {formik.touched.role && formik.errors.role && (
                  <div className="text-red-600 text-sm mt-2 font-medium flex items-center animate-shake">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {formik.errors.role}
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start animate-shake">
                <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.35s', animationFillMode: 'both' }}>
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full flex justify-center items-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ease-in-out transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <>
                    <svg className="spinner w-5 h-5 mr-3 border-2 border-white border-t-transparent rounded-full" viewBox="0 0 24 24"></svg>
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
              
              <div className="text-center">
                <span className="text-sm text-gray-600">Already have an account? </span>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors duration-200 ease-in-out hover:underline underline-offset-2"
                >
                  Sign in
                </button>
              </div>
            </div>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
          Protected by advanced encryption
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;