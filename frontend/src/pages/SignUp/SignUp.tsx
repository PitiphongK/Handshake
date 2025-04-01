import axios, { AxiosError } from 'axios';
import ProfileCard from '../../components/ProfileCard/ProfileCard';
import { useState } from 'react';
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import { setErrorMessage, goToPreviousStep, setIsLoading } from '../../../redux/slices/formSlice';
import { Option } from '../../interfaces/interfaces';
import './SignUp.css';
import Step1 from './Steps/Step1';
import Step2 from './Steps/Step2';
import Step3 from './Steps/Step3';
import Step4 from './Steps/Step4';
import { addToast } from '@heroui/react';

// interface SignUpFormInputs {
//   email: string;
//   first_name: string;
//   last_name: string;
//   password: string;
//   bio: string;
//   institution: string;
//   location: string;
//   interests: number[];
//   activities: number[];
// }


const SignUp: React.FC = () => {
  const { handleSubmit, control, watch } = useForm({});
  const [firstname, lastname, institute, bio, password, confirmPassword, location, fields] = watch(['first_name', 'last_name', 'institution', 'bio', 'password', 'confirm-password', 'location', 'interests']) as [string, string, number, string, string, string, string, number[]];
  const [imageObject, setImageObject] = useState<File | null>(null);
  const interestFieldOptions = useAppSelector((state) => state.form.interestFieldOptions) as Option[];
  const currentStep = useAppSelector((state) => state.form.currentStep);
  const imageUrl = useAppSelector((state) => state.form.user.imageUrl);
  const institutionOptions = useAppSelector((state) => state.form.institutionOptions) as { value: number, label: string }[];
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const redirect = () => {
    navigate('/signin');
  };

  const interestFieldNumberToName = (interestFieldNumberList: number[] = []) => {
    return interestFieldNumberList.map((interestFieldNumber: number) => {
      return interestFieldOptions.find((option: Option) => option.value === interestFieldNumber)?.label;
    });
  }

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    dispatch(setIsLoading(true));

    // Create a FormData object to handle file upload
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('first_name', data.first_name);
    formData.append('last_name', data.last_name);
    formData.append('password', data.password);
    formData.append('bio', data.bio);
    formData.append('institution', data.institution);
    formData.append('location', data.location);
    data.interests.forEach((interest: number) => {
      formData.append('interest_fields', interest.toString());
    });
    data.activities.forEach((activity: number) => {
      formData.append('interest_activities', activity.toString());
    });

    // Append the selected file to FormData
    if (imageObject) {
      formData.append('picture', imageObject);
    }

    formData.forEach((value, key) => {
      console.log(key + ': ' + value);
    });
    try {
      const response = await axios.post('/api/doorway/register/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      if (response.status === 201) {
        redirect();
        addToast({
          title: "Please check your inbox",
          description: "Email verification has been sent",
          color: "success",
          timeout: 3000,
          classNames: {
            base: "shadow-lg",
          },
        });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error)
        const errorMessage = error.response?.data?.detail || error.response?.data?.message?.email;
        dispatch(setErrorMessage(errorMessage ? errorMessage : "An error occured. Please try again."));
        addToast({
          title: "Sign up failed",
          description: errorMessage,
          color: "danger",
          timeout: 3000,
          classNames: {
            base: "shadow-lg",
          },
        });
      }
    } finally {
      dispatch(setIsLoading(false));
    };
  };

  return (
    <main className="createAccount">
      <HelmetProvider>
        <Helmet>
          <title>Sign Up | Handshake</title>
        </Helmet>
      </HelmetProvider>
      <section className="container">
        <div className="formSection">
          <div className="formContent">
            <div className="progressBar">
              <div className="progressFill" style={{ width: `${(currentStep / 4) * 100}%`, transition: '0.5s' }} />
            </div>
            <h1 className="title">Create Your Account</h1>
            <hr className="divider" />
            {currentStep === 1 && <Step1 handleSubmit={handleSubmit} control={control} />}
            {currentStep === 2 && <Step2 handleSubmit={handleSubmit} control={control} password={password} confirmPassword={confirmPassword} setImageObject={setImageObject} />}
            {currentStep === 3 && <Step3 handleSubmit={handleSubmit} control={control} />}
            {currentStep === 4 && <Step4 handleSubmit={handleSubmit} control={control} onSubmit={onSubmit} />}
          </div>

          <button className="closeButton" aria-label="Close" onClick={redirect}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
          {currentStep > 1 && (
            <button className="backButton" aria-label="Back" onClick={() => dispatch(goToPreviousStep())}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
          )}
        </div>

        <div className="previewSection bg-gradient-to-t from-default-200 to-primary-50">
          <ProfileCard
            name={firstname && lastname ? `${firstname} ${lastname}` : firstname || lastname ? firstname || lastname : "Your Name"}
            description={bio ? bio : "Your Bio"}
            imageUrl={imageUrl}
            location={location ? location : "Location"}
            institution={institute ? institutionOptions.find((option: { value: number, label: string }) => option.value === institute)?.label || "Institute" : "Institute"}
            activity="Activity"
            fields={interestFieldNumberToName(fields)}
          />
          {/* <h1 className="brandText">
            <strong>Handshake</strong>
          </h1> */}
        </div>
      </section>
    </main>
  );
};

export default SignUp;
