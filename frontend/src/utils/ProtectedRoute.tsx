import { useCallback, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import apiClient from "../services/apiClient";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setUserData } from "../../redux/slices/userSlice";
import { Option } from "../interfaces/interfaces";
import { ReactNode } from "react";
import { AxiosError } from 'axios';
import { addToast } from '@heroui/react';

export const isLoggedIn = () => {
    console.log(localStorage.getItem("authToken"))
    return localStorage.getItem("authToken") !== null;
};


const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const institutionOptions = useAppSelector((state) => state.form.institutionOptions) as Option[];
    const interestFieldOptions = useAppSelector((state) => state.form.interestFieldOptions) as Option[];
    const interestActivityOptions = useAppSelector((state) => state.form.interestActivityOptions) as Option[];

    const institutionNumberToName = useCallback((institutionNumber: number) => {
        return institutionOptions.find((option: Option) => option.value === institutionNumber)?.label;
      }, [institutionOptions]);
      
      const interestFieldNumberToName = useCallback((interestFieldNumberList: number[]) => {
        return interestFieldNumberList.map((interestFieldNumber: number) => {
          return interestFieldOptions.find((option: Option) => option.value === interestFieldNumber)?.label;
        });
      }, [interestFieldOptions]);
      
      const interestActivityNumberToName = useCallback((interestActivityNumberList: number[]) => {
        return interestActivityNumberList.map((interestActivityNumber: number) => {
          return interestActivityOptions.find((option: Option) => option.value === interestActivityNumber)?.label;
        });
      }, [interestActivityOptions]);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!isLoggedIn()) {
                addToast({
                  title: "Please log in",
                  description: "",
                  color: "primary",
                  timeout: 3000,
                  classNames: {
                    base: "shadow-lg",
                  },
                });
                navigate("/landing");
                return;
            }
            if (isLoggedIn()) {
                try {
                    const userId = localStorage.getItem('user_id');
                    const response = await apiClient.get(`/api/user-profiles/${userId}`);
                    const userData = response.data;

                    if (institutionOptions.length > 0 && interestFieldOptions.length > 0 && interestActivityOptions.length > 0) {
                        dispatch(setUserData({
                            ...userData,
                            institution: institutionNumberToName(userData.institution),
                            interest_fields: interestFieldNumberToName(userData.interest_fields),
                            interest_activities: interestActivityNumberToName(userData.interest_activities),
                        }));
                    }
                } catch (err) {
                    if (err instanceof AxiosError) {
                        console.log('Currently not logged in');
                        console.log(err);
                        navigate("/landing");
                    }
                }
            }
        };

        fetchUserData();
    }, [dispatch, institutionOptions, interestFieldOptions, interestActivityOptions, navigate, institutionNumberToName, interestFieldNumberToName, interestActivityNumberToName]);

    if (!isLoggedIn()) {
        navigate("/landing");
    }

    return children;
};

export default ProtectedRoute;