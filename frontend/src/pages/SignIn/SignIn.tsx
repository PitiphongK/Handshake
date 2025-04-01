import "./SignIn.css";

import axios from 'axios';
import { useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { EmailInput } from "../../components/Inputs/EmailInput";
import { PasswordInput } from "../../components/Inputs/PasswordInput";
import { addToast } from "@heroui/react";

const SignIn: React.FC = () => {
  const { handleSubmit, control } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const redirect = () => {
    navigate('/'); 
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    setErrorMessage('');
    axios.post('/api/doorway/login/', data)
      .then((response) => {
        if (response.status === 200) {
          const { token, user_id } = response.data as { token: string; user_id: string };
          localStorage.setItem('authToken', token); // Store token in localStorage
          localStorage.setItem('user_id', user_id);
          redirect();
        }
      })
      .catch((error) => {
        const errorResponse = error.response?.data?.detail || error.response?.data?.message || "Invalid username or password. Please try again.";
        setErrorMessage(errorResponse);
        addToast({
          title: "Fetched user failed",
          description: errorResponse,
          color: "danger",
          timeout: 3000,
          classNames: {
            base: "shadow-lg",
          },
        });
      })
      .then(() => {
        setIsLoading(false);
      });
  };

  return (
    <main className="signInPage">
      <HelmetProvider>
        <Helmet>
          <title>Sign In | Handshake</title>
        </Helmet>
      </HelmetProvider>
      <section className="container">
        <div className="formSection">
          <div className="formContent">
            <h1 className="title">Sign In</h1>
            <hr className="divider" />

            <form className="form" onSubmit={handleSubmit(onSubmit)}>
              <EmailInput
                name="email"
                placeholder="Email Address"
                control={control}
                required
              />
              <PasswordInput
                name="password"
                placeholder="Password"
                control={control}
                required
              />
              {errorMessage && <p className="errorMessage">{errorMessage}</p>}
              <button type="submit" className="submitButton">
                {isLoading ? <FontAwesomeIcon icon={faCircleNotch} spin /> : <h3>Sign In</h3>}
              </button>
            </form>
            <a className="create-account-btn" href="/signup">Create an acccount</a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SignIn;