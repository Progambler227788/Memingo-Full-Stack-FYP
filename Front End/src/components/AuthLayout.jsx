import React from 'react';

const AuthLayout = ({ children, title }) => {
  return (
    <div className="min-h-screen w-full overflow-hidden bg-[#26647e]">
      <style>
        {`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body, html {
            width: 100%;
            height: 100%;
            overflow-x: hidden;
          }

          .auth-container {
            min-height: 100vh;
            width: 100vw;
            display: flex;
            position: relative;
            background: linear-gradient(135deg, #26647e 0%, #1e4f62 100%);
          }

          .content-wrapper {
            width: 100%;
            min-height: 100vh;
            display: flex;
            flex-direction: row;
            position: relative;
          }

          .form-side {
            width: 100%;
            max-width: 500px;
            min-height: 100vh;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            padding: 2rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            position: relative;
            z-index: 2;
          }

          @media (max-width: 768px) {
            .form-side {
              max-width: 100%;
            }
          }

          .welcome-side {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            position: relative;
            overflow: hidden;
          }

          @media (max-width: 768px) {
            .welcome-side {
              display: none;
            }
          }

          .animated-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
          }

          .animated-circle {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            animation: float 10s infinite;
          }

          .circle-1 {
            width: 300px;
            height: 300px;
            top: 10%;
            left: 20%;
            animation-delay: 0s;
          }

          .circle-2 {
            width: 200px;
            height: 200px;
            top: 40%;
            right: 20%;
            animation-delay: -3s;
          }

          .circle-3 {
            width: 150px;
            height: 150px;
            bottom: 20%;
            left: 30%;
            animation-delay: -6s;
          }

          @keyframes float {
            0%, 100% {
              transform: translate(0, 0) rotate(0deg);
            }
            50% {
              transform: translate(-20px, -20px) rotate(180deg);
            }
          }

          .welcome-content {
            color: white;
            text-align: center;
            max-width: 600px;
            position: relative;
            z-index: 1;
          }

          .welcome-title {
            font-size: 3rem;
            font-weight: bold;
            margin-bottom: 1rem;
            animation: fadeInUp 0.8s ease-out;
          }

          .welcome-subtitle {
            font-size: 1.5rem;
            opacity: 0.9;
            margin-bottom: 2rem;
            animation: fadeInUp 0.8s ease-out 0.2s;
          }

          .welcome-image {
            max-width: 100%;
            height: auto;
            animation: float 6s ease-in-out infinite;
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .logo {
            width: auto;
            height: 2.5rem;
            margin-bottom: 2rem;
            background-color: #d8f3fe;
          }

          .footer {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            padding: 1rem;
            text-align: center;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(5px);
          }

          .footer-nav {
            display: flex;
            justify-content: center;
            gap: 2rem;
          }

          .footer-link {
            color: white;
            text-decoration: none;
            font-size: 0.875rem;
            opacity: 0.8;
            transition: opacity 0.2s;
          }

          .footer-link:hover {
            opacity: 1;
          }
        `}
      </style>

      <div className="auth-container">
        <div className="content-wrapper">
          <div className="form-side">
            <img 
              src="/src/assets/logo.svg" 
              alt="MEMINGO" 
              className="logo"
            />
            <div className="form-content">
              <h1 className="text-2xl md:text-3xl font-bold text-[#26647e] mb-8">
                {title}
              </h1>
              {children}
            </div>
          </div>

          <div className="welcome-side">
            <div className="animated-bg">
              <div className="animated-circle circle-1"></div>
              <div className="animated-circle circle-2"></div>
              <div className="animated-circle circle-3"></div>
            </div>
            <div className="welcome-content">
              <h2 className="welcome-title">Welcome to MEMINGO</h2>
              <p className="welcome-subtitle">
                Your journey to language mastery begins here
              </p>
              <img
                src="/src/assets/icon.svg"
                alt="Language learning illustration"
                className="welcome-image"
              />
            </div>
          </div>
        </div>

        <footer className="footer">
          <nav className="footer-nav">
            <a href="#" className="footer-link">Terms</a>
            <a href="#" className="footer-link">Privacy</a>
            <a href="#" className="footer-link">Contact</a>
          </nav>
        </footer>
      </div>
    </div>
  );
};

export default AuthLayout;
