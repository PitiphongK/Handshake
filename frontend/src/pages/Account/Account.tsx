import Navbar from '../../components/Navbar/Navbar';
import apiClient from '../../services/apiClient'; // Import the Axios instance
import { useEffect, useState } from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async';

import './Account.css';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { initializeForm } from '../../../redux/reducers/formExtraReducers';
import { MultiSelect } from '../../components/Inputs/MultiSelect';
import { TextInput } from '../../components/Inputs/TextInput';
import axios, { AxiosError } from 'axios';
import { Select } from '../../components/Inputs/Select';
import { scottish_cities } from '../../utils/Scottish_Cities';
import { useNavigate } from 'react-router-dom';
import { addToast } from '@heroui/react';

// interface EditAccountFormInputs{
//     first_name: string;
//     last_name: string;
//     interest_activities: number[];
//     interest_fields: number[];
//     picture: FileList;
//     location: string;
// }

interface UserData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  bio: string;
  institution: string;
  location: string;
  interest_fields: string[];
  interest_activities: string[];
  picture: string;
}

const Account = () => {
  const [userData, setUserData] = useState<UserData>();
  const { handleSubmit, control, reset, register} = useForm();
  const dispatch = useAppDispatch();
  const interestFieldOptions = useAppSelector((state)=>state.form.interestFieldOptions)
  const interestActivityOptions = useAppSelector((state)=>state.form.interestActivityOptions);
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(initializeForm());
  }, [dispatch]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        const response = await apiClient.get(`/api/user-profiles/${userId}`);
        setUserData(response.data);
        console.log(response.data);
        reset(response.data);
        setUserData(response.data);
      } catch (err) {
        if (err instanceof AxiosError) {
          console.log(err);
        }
      }
    };
    fetchUserData();
  }, [reset]);

  const getChangedData = (data:FieldValues)=>{
    if (!userData) return {};
    return Object.fromEntries(Object.entries(data).filter(([k, v]) => JSON.stringify(userData[k as keyof UserData]) != JSON.stringify(v)));
  }

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    const changedData = getChangedData(data);
    const formData = new FormData();
    for(const [key, value] of Object.entries(changedData)){
      if(key=="picture"){
        formData.append(key, (value as FileList)[0]);
      }else if(Array.isArray(value)){
        value.forEach(entry=>formData.append(key,entry.toString()));
      }else{
        formData.append(key,(value as string).toString())
      }
    }
    axios.post('/api/edit-profile/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
          .then((response) => {
            console.log(response);
            if (response.status === 200) {
              addToast({
                title: "Profile Updated",
                description: "Profile has been updated successfully",
                color: "success",
                timeout: 3000,
                classNames: {
                  base: "shadow-lg",
                },
              });
              navigate('/');
            }
          })
  }

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <title>Account | Handshake</title>
        </Helmet>
      </HelmetProvider>
      <Navbar />
      <div className='editAccount'>
        <div className="container">
          <div className='formSection'>
          <div className='formContent'>
            <h1 className='title'>Edit Account</h1>
            <hr className='divider'/>
            <form className='form' onSubmit={handleSubmit(onSubmit)}>
              <div>
                <TextInput control={control} name="first_name" header="First Name" placeholder={userData?.first_name || ''} />
              </div>
              <div>
                <TextInput control={control} name="last_name" header="Last Name" placeholder={userData?.last_name || ''} />
              </div>
              <div>
                <TextInput control={control} name="bio" header="Bio" placeholder={userData?.bio || ''} />
              </div>
              <div>
                  <MultiSelect
                      name="interest_fields"
                      header="Fields"
                      options={interestFieldOptions}
                      control={control}
                  />
              </div>
              <div>
                  <MultiSelect
                      name="interest_activities"
                      header="Activities"
                      options={interestActivityOptions}
                      control={control}
                  />
              </div>
              <div>
                <Select name="location" header='Location' options={scottish_cities} control={control}/>
              </div>
              <div className="profileImageWrapper" onClick={() => document.getElementById('fileInput')?.click()}>
                {/* <img
                    src={userData?.picture}
                    alt="Profile avatar"
                    className="avatar"
                /> */}
                <button type="button" className="editButton">
                    <h2>Change Picture</h2>
                </button>
              </div>
              <div style={{ display: 'none' }}>
                  <input
                      type="file"
                      id="fileInput"
                      accept="image/*"
                      {...register('picture')}
                  />
              </div>
              <button type='submit' className='submitButton'><h2>Submit</h2></button>
            </form>
          </div>
        </div>
        </div>
      </div>
    </>
  );
};

export default Account;
