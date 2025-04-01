import { FC } from "react";
import { useAppSelector, useAppDispatch } from "../../../../redux/hooks";
import { goToNextStep } from "../../../../redux/slices/formSlice";
import { setErrorMessage, setImageUrl } from "../../../../redux/slices/formSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { TextInput } from "../../../components/Inputs/TextInput";
import { PasswordInput } from "../../../components/Inputs/PasswordInput";
import { Control, FieldValues, UseFormHandleSubmit } from "react-hook-form";


interface Step2Props {
    control: Control<FieldValues> | undefined;
    handleSubmit: UseFormHandleSubmit<FieldValues, undefined>;
    password: string;
    confirmPassword: string;
    setImageObject: (file: File) => void;
}

const Step2: FC<Step2Props> = ({ control, handleSubmit, password, confirmPassword, setImageObject }) => {
    const errorMessage = useAppSelector((state) => state.form.errorMessage);
    const imageUrl = useAppSelector((state) => state.form.user.imageUrl);
    const dispatch = useAppDispatch();
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageObject(file); // Save the file for form submission

            // Create a URL for the uploaded file
            const fileUrl = URL.createObjectURL(file);
            dispatch(setImageUrl(fileUrl)); // Store the URL in state
        }
    };

    return (
        <form className="form" onSubmit={(e) => {
            e.preventDefault();
            if (password === confirmPassword) {
                handleSubmit(() => dispatch(goToNextStep()))(e);
            } else {
                dispatch(setErrorMessage('Passwords do not match'));
            }
        }}>
            <div className="profileImageWrapper" onClick={() => document.getElementById('fileInput')?.click()}>
                <img
                    src={imageUrl}
                    alt="Profile avatar"
                    className="avatar"
                />
                <button type="button" className="editButton">
                    <div className="editButtonBg" />
                    <FontAwesomeIcon
                        className="editIcon"
                        icon={faPenToSquare}
                    />
                </button>
            </div>
            <div style={{ display: 'none' }}>
                <input
                    type="file"
                    id="fileInput"
                    accept="image/*"
                    onChange={handleImageUpload} // Use the updated function
                />
            </div>
            <TextInput
                name="first_name"
                header="First Name"
                placeholder="Isaac"
                control={control}
                pattern={{ value: /^[a-zA-Z\s]+$/, message: "Invalid first name" }}
                required
            />
            <TextInput
                name="last_name"
                header="Last Name"
                placeholder="Newton"
                control={control}
                pattern={{ value: /^[a-zA-Z\s]+$/, message: "Invalid last name" }}
                required
            />
            <PasswordInput
                name="password"
                placeholder="Password"
                control={control}
                required
            />
            <PasswordInput
                name="confirm-password"
                placeholder="Confirm Password"
                control={control}
                required
            />
            {errorMessage && <p className="errorMessage">{errorMessage}</p>}
            <button type="submit" className="submitButton">
                <h3>Next</h3>
            </button>
        </form>
    )
}

export default Step2