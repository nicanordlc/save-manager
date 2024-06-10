import { Input, Typography } from "@material-tailwind/react";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { type GameSingle } from "@/hooks/useGame";

type NameInputProps = {
  name: string;
  onSubmit: (data: FormInputs) => void;
};

type FormInputs = Pick<GameSingle, "Name">;

const NameInput = (props: NameInputProps) => {
  const [edit, setEdit] = useState<boolean>(false);
  const { register, handleSubmit, setFocus } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    setEdit(false);
    props.onSubmit(data);
  };

  const handleEdit = () => {
    setEdit(true);
    setTimeout(() => {
      setFocus("Name");
    }, 300);
  };

  if (edit) {
    return (
      <form
        className="col-span-5 !h-[40px] w-0 grow"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          className="!p-0"
          variant="standard"
          label={props.name}
          {...register("Name", {
            onBlur: () => {
              setEdit(false);
            },
          })}
        />
      </form>
    );
  }

  return (
    <div className="col-span-5 flex h-[40px] w-0 grow items-center ">
      <Typography onClick={() => handleEdit()} className="h-6 w-full">
        {props.name}
      </Typography>
    </div>
  );
};

export default NameInput;
