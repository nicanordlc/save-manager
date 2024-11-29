import {
  Button,
  Checkbox,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Input,
  Typography,
} from "@material-tailwind/react";
import clsx from "clsx";
import {
  type Dispatch,
  type SetStateAction,
  useState,
  type FC,
  useEffect,
} from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { FaDirections } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { OpenDialogDirApp, OpenDialogFileApp } from "@wailsjs/go/backend/App";
import {
  OpenDialogDirGame,
  OpenDialogFileGame,
} from "@wailsjs/go/backend/Game";
import { type GameSingle } from "@/hooks/useGame";
import useSettings from "@/hooks/useSettings";

const TRANSITION_TIMEOUT = 300;

type FormInputs = Pick<GameSingle, "Name" | "SavePath" | "SavePathIsFile">;

type DialogGameFormDefaultValues = {
  formInputs: Partial<FormInputs>;
  gameID: string;
};

type DialogGameFormProps = {
  open: boolean;
  handler: Dispatch<SetStateAction<boolean>>;
  title: string;
  bodyTitle?: string;
  required?: Partial<Record<keyof FormInputs, boolean>>;
  defaultValues?: Partial<DialogGameFormDefaultValues>;
  submit: (data: FormInputs) => unknown;
};

const DialogGameForm: FC<DialogGameFormProps> = (props) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    clearErrors,
    setFocus,
    formState: { errors: formErrors },
  } = useForm<FormInputs>();
  const { defaultValues } = props;
  const { querySettings } = useSettings();

  const defaultIsFile =
    defaultValues?.formInputs?.SavePathIsFile ??
    querySettings.data?.DefaultSavePathIsFile ??
    false;

  const [isFileDialog, setIsFileDialog] = useState<boolean>(defaultIsFile);

  const onSubmit: SubmitHandler<FormInputs> = (data) => props.submit(data);

  const handlePath = async () => {
    let path = "";

    if (defaultValues?.formInputs?.SavePath === "") {
      path = isFileDialog
        ? await OpenDialogFileApp(querySettings.data?.DefaultSavePath ?? "")
        : await OpenDialogDirApp(querySettings.data?.DefaultSavePath ?? "");
    } else {
      path = isFileDialog
        ? await OpenDialogFileGame(defaultValues?.gameID)
        : await OpenDialogDirGame(defaultValues?.gameID);
    }

    if (path === "") return;

    setValue("SavePath", path);
    clearErrors("SavePath");
    setFocus("Name");
  };

  const handleIsFile = () => {
    setIsFileDialog(!isFileDialog);
    setValue("SavePathIsFile", !isFileDialog);
  };

  useEffect(() => {
    if (props.open) {
      setTimeout(() => {
        setFocus("Name");
      }, TRANSITION_TIMEOUT);
    }
  });

  useEffect(() => {
    if (defaultValues?.formInputs) {
      Object.entries(defaultValues.formInputs).forEach(([key, value]) => {
        setValue(key as keyof FormInputs, value);
      });
    }
  }, [defaultValues, setValue]);

  useEffect(() => {
    setIsFileDialog(defaultIsFile);
  }, [defaultIsFile]);

  const toggleDialog = () => {
    props.handler(!props.open);
    setTimeout(() => {
      reset();
    }, TRANSITION_TIMEOUT);
  };

  return (
    <Dialog open={props.open} handler={toggleDialog}>
      <div className="flex items-center justify-between">
        <DialogHeader className="flex flex-col items-start">
          <Typography className="mb-1" variant="h4">
            {props.title}
          </Typography>
        </DialogHeader>

        <IconButton className="mr-2" variant="text" onClick={toggleDialog}>
          <FaX />
        </IconButton>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogBody>
          {props.bodyTitle && (
            <Typography className="-mt-7 mb-10 " color="gray" variant="lead">
              {props.bodyTitle}
            </Typography>
          )}

          <div className="grid gap-6">
            <Typography className="-mb-1" color="blue-gray" variant="h6">
              Game Name
            </Typography>

            <Input
              labelProps={{
                className: "hidden",
              }}
              placeholder="name"
              className={clsx(
                "!border !border-gray-300 bg-white text-gray-900 shadow-lg shadow-gray-900/5 ring-4 ring-transparent placeholder:text-gray-500 placeholder:opacity-100 focus:!border-gray-900 focus:!border-t-gray-900 focus:ring-gray-900/10",
                {
                  "!border-red-300 focus:!border-red-900 focus:!border-t-red-900 focus:!ring-red-900/10":
                    formErrors.Name,
                },
              )}
              label="name"
              {...register("Name", { required: props.required?.Name })}
            />

            <div className=" flex">
              <Button
                onClick={handlePath}
                className={clsx("flex grow items-center justify-center", {
                  "bg-red-300": formErrors.SavePath,
                })}
              >
                <span>SAVE PATH</span>
                <FaDirections className="ml-2" />
              </Button>
              <input
                className="hidden"
                {...register("SavePath", {
                  required: props.required?.SavePath,
                })}
              />

              <Checkbox
                checked={isFileDialog}
                onChange={handleIsFile}
                label="File"
              />
              <input
                className="hidden"
                {...register("SavePathIsFile", {
                  required: props.required?.SavePathIsFile,
                })}
              />
            </div>
          </div>
        </DialogBody>

        <DialogFooter className="space-x-2">
          <Button variant="text" color="gray" onClick={toggleDialog}>
            cancel
          </Button>

          <Button type="submit" variant="gradient" color="gray">
            {defaultValues?.formInputs?.SavePath === "" ? "CREATE" : "SAVE"}
            <span> GAME</span>
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
};

DialogGameForm.defaultProps = {
  bodyTitle: "",
  required: { Name: false, SavePath: false },
  defaultValues: {
    formInputs: {
      Name: "",
      SavePath: "",
    },
    gameID: "",
  },
};

export default DialogGameForm;
