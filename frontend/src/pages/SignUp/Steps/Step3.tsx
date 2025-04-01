import { FC } from "react";
import { useAppSelector, useAppDispatch } from "../../../../redux/hooks";
import { goToNextStep } from "../../../../redux/slices/formSlice";
import { TextArea } from "../../../components/Inputs/TextArea";
import { Control, FieldValues, UseFormHandleSubmit } from "react-hook-form";

interface Step3Props {
    control: Control<FieldValues> | undefined;
    handleSubmit: UseFormHandleSubmit<FieldValues, undefined>;
}

const Step3: FC<Step3Props> = ({ control, handleSubmit }) => {
    const dispatch = useAppDispatch();
    const errorMessage = useAppSelector((state) => state.form.errorMessage);

    return (
        <form className="form" onSubmit={handleSubmit(() => dispatch(goToNextStep()))}>
            <TextArea
                name="bio"
                header="Bio"
                placeholder="Tell us about yourself..."
                control={control}
                required
            />
            {errorMessage && <p className="errorMessage">{errorMessage}</p>}
            <button type="submit" className="submitButton">
                <h3>Next</h3>
            </button>
        </form>
    );
};

export default Step3;