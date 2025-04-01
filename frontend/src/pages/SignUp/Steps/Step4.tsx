import { FC } from "react";
import { useAppSelector } from "../../../../redux/hooks";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { MultiSelect } from '../../../components/Inputs/MultiSelect';
import { Control, FieldValues, SubmitHandler, UseFormHandleSubmit } from "react-hook-form";

interface Step4Props {
    onSubmit: SubmitHandler<FieldValues>;
    control: Control<FieldValues> | undefined;
    handleSubmit: UseFormHandleSubmit<FieldValues, undefined>;
}

const Step4: FC<Step4Props> = ({ onSubmit, control, handleSubmit }) => {
    const errorMessage = useAppSelector((state) => state.form.errorMessage);
    const interestFieldOptions = useAppSelector((state) => state.form.interestFieldOptions);
    const interestActivityOptions = useAppSelector((state) => state.form.interestActivityOptions);
    const isLoading = useAppSelector((state) => state.form.isLoading);

    return (
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
            <div>
                <MultiSelect
                    name="interests"
                    header="Interests"
                    options={interestFieldOptions}
                    control={control}
                    required
                />
            </div>
            <div>
                <MultiSelect
                    name="activities"
                    header="Activities"
                    options={interestActivityOptions}
                    control={control}
                    required
                />
            </div>
            {errorMessage && <p className="errorMessage">{errorMessage}</p>}
            <button type="submit" className="submitButton">
                {isLoading ? <FontAwesomeIcon icon={faCircleNotch} spin /> : <h3>Submit</h3>}
            </button>
        </form>
    );
};

export default Step4;