import { Select } from "../../../components/Inputs/Select";
import { FC } from "react";
import { useAppSelector, useAppDispatch } from "../../../../redux/hooks";
import { goToNextStep, setErrorMessage } from "../../../../redux/slices/formSlice";
import { EmailInput } from "../../../components/Inputs/EmailInput";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { setIsLoading } from "../../../../redux/slices/formSlice";
import axios, { AxiosError } from "axios";
import { scottish_cities } from "../../../utils/Scottish_Cities";
import { addToast } from "@heroui/react";
import { Control, FieldValues, SubmitHandler, UseFormHandleSubmit } from "react-hook-form";

interface Step1Props {
    control: Control<FieldValues> | undefined;
    handleSubmit: UseFormHandleSubmit<FieldValues, undefined>;
}

const Step1: FC<Step1Props> = ({ control, handleSubmit }) => {
    const dispatch = useAppDispatch();
    const institutionOptions = useAppSelector((state) => state.form.institutionOptions);
    const errorMessage = useAppSelector((state) => state.form.errorMessage);
    const isLoading = useAppSelector((state) => state.form.isLoading);

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        setIsLoading(true);
        try {
            const response = await axios.post("/api/doorway/suffix-check/", {
                email: data.email,
                institution: data.institution,
            });
            if (response.status === 200) {
                dispatch(goToNextStep());
            } else {
                dispatch(setErrorMessage(response.data.message));
            }
        } catch (error) {
            if (error instanceof AxiosError) {
                console.error(error.message);
                const errorM = error.response?.data?.message || "An error occurred"
                dispatch(setErrorMessage(errorM));
                addToast({
                    title: errorM,
                    description: "Try selecting another institution that matches your email suffix (text after @)",
                    color: "danger",
                    timeout: 3000,
                    classNames: {
                        base: "shadow-lg",
                    },
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <EmailInput
                name="email"
                placeholder="newton@test.edu"
                control={control}
                required
            />
            <Select
                name="institution"
                header="Institution"
                options={institutionOptions}
                control={control}
                required
            />
            <Select
                name="location"
                header="Location"
                options={scottish_cities}
                control={control}
                required
            />
            {errorMessage && <p className="errorMessage">{errorMessage}</p>}
            <button type="submit" className="submitButton">
                {isLoading ? <FontAwesomeIcon icon={faCircleNotch} spin /> : <h3>Next</h3>}
            </button>
        </form>
    );
};

export default Step1;