import React from 'react';

const SharedStyles: React.FC = () => {
  return (
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

      @keyframes spin {
        to {
          transform: rotate(360deg);
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

      .glass-effect {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }

      .card-hover {
        transition: all 0.3s ease;
      }

      .card-hover:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.2);
      }

      .input-focus-effect {
        transition: all 0.3s ease;
      }

      .input-focus-effect:focus {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.3);
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
  );
};

export default SharedStyles;