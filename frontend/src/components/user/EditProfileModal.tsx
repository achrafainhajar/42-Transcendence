import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { IoMdCloseCircle } from "react-icons/io";
import { ZodType, z } from "zod";
import apiClient from "../../services/api-client";
import { useState } from "react";
import useUser from "../../hooks/useUser";
import UploadIco from "../../assets/upload-ico.svg";
import { IMGURL } from "../../constants";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
interface Props {
  visible: boolean;
  onClose: () => void;
}

type UserFormData = {
  username: string;
  email: string;
  avatar?: string;
};
const schema: ZodType<UserFormData> = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().min(1, "Email is required").email(),
  avatar: z.string().optional(),
});

const EditProfile = ({ visible, onClose }: Props) => {
  const { data: user, refetch } = useUser();
  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields, isDirty, isValid },
    setValue,
    setError,
  } = useForm<UserFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: user?.username ?? "",
      email: user?.email ?? "",
      avatar: user?.avatar != "default.png" ? "ok" : "",
    },
    mode: "all",
  });
  const [avatarFile, setavatarFile] = useState<File | null>(null);
  const [preview, setpreview] = useState<string | null>(null);

  if (!visible) return null;
  const submitData = async (data: UserFormData) => {
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);
    if (avatarFile) formData.append("avatar_url", avatarFile);
    try {
      await apiClient.put(`/users`, formData);
      await refetch();
      toast.success("Profile updated successfully !");
      onClose();
    } catch (err) {
      if (
        err instanceof AxiosError &&
        err.response?.data?.statusCode === 409 &&
        err?.response?.data?.message === "Unique constraint failed: email"
      ) {
        setError("email", {
          message: "Email already used",
        });
      }
      if (
        err instanceof AxiosError &&
        err.response?.data?.statusCode === 409 &&
        err?.response?.data?.message === "Unique constraint failed: username"
      ) {
        setError("username", {
          message: "Username already used",
        });
      }
      //  onClose();
    }
  };
  return (
    <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex justify-center items-center md:px-20">
      <form
        className="container mx-auto relative bg-white min-h-64  text-center max-w-[485px] flex-none w-full  p-4 sm:p-10  py-12  flex flex-col items-stretch gap-4 h-1/2 rounded-2xl  text-black "
        onSubmit={handleSubmit(submitData)}
      >
        {user?.is_profile_finished && (
          <div
            className="w-auto place-self-end absolute right-1 top-1 text-blue-900 hover:text-blue-800 hover:cursor-pointer"
            onClick={onClose}
          >
            <IoMdCloseCircle />
          </div>
        )}
        <div className="w-full block justify-center">
          <label className="group h-24 mx-auto w-24 relative flex justify-center">
            <img
              src={preview ? preview : IMGURL + user?.avatar}
              className="block mx-auto h-24 w-24 flex-none rounded-md object-cover hover:bg-opacity-30 hover:backdrop-blur-sm transition-all duration-300  cursor-pointer"
              alt="avatar"
            />

            <div className="group mx-auto h-24 w-24 absolute inset-0 bg-white bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 rounded-md cursor-pointer flex justify-center items-center">
              <img
                src={UploadIco}
                alt=""
                className={
                  "hidden group-hover:block transition-all duration-300 w-9"
                }
              />
            </div>

            <input
              type="file"
              accept="image/jpg,image/jpeg,image/png,image/gif"
              className="hidden"
              {...register("avatar")}
              onChange={(event) => {
                if (event.target.files && event.target.files.length > 0) {
                  if (event.target.files[0].size > 1024 * 1024 * 2) {
                    setError("avatar", {
                      message: "File size must be less than 2MB",
                    });
                    return;
                  }
                  setavatarFile(event.target.files[0]);
                  setpreview(URL.createObjectURL(event.target.files[0]));
                  setValue("avatar", event.target.files[0].name, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }
              }}
            />
          </label>
          {errors?.avatar && (
            <div className="text-red-500 mt-1 ">{errors.avatar.message}</div>
          )}
        </div>
        <div className="">
          <input
            type="text"
            placeholder="User Name"
            className={
              errors.username
                ? "form-input py-2.5 px-4 w-full text-red-500 border border-red-500 focus-visible:outline-none focus-visible:border-red-500 rounded-lg placeholder:text-red-500 focus:border-red-500 focus:ring-0 focus:shadow-none;"
                : dirtyFields.username
                ? "form-input py-2.5 px-4 w-full text-green-600 border border-green-600 focus-visible:outline-none focus-visible:border-green-500 rounded-lg placeholder:text-black/20  focus:border-green-600 focus:ring-0 focus:shadow-none;"
                : "form-input py-2.5 px-4 w-full text-black border border-black/10 focus-visible:outline-none focus-visible:border-black rounded-lg placeholder:text-black/20  focus:border-black  focus:ring-0 focus:shadow-none;"
            }
            required
            {...register("username")}
          />
          {errors.username && (
            <p className="text-red-500 mt-1">{errors.username.message}</p>
          )}
        </div>
        <div className="">
          <input
            type="text"
            placeholder="Email"
            className={
              errors.email
                ? "form-input py-2.5 px-4 w-full text-red-500 border border-red-500 focus-visible:outline-none focus-visible:border-red-500 rounded-lg placeholder:text-red-500 focus:border-red-500 focus:ring-0 focus:shadow-none;"
                : dirtyFields.email
                ? "form-input py-2.5 px-4 w-full text-green-600 border border-green-600 focus-visible:outline-none focus-visible:border-green-500 rounded-lg placeholder:text-black/20  focus:border-green-600 focus:ring-0 focus:shadow-none;"
                : "form-input py-2.5 px-4 w-full text-black border border-black/10 focus-visible:outline-none focus-visible:border-black rounded-lg placeholder:text-black/20  focus:border-black  focus:ring-0 focus:shadow-none;"
            }
            required
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>
        <input
          type="submit"
          value={"Update Profile"}
          disabled={!isDirty || !isValid}
          className="cursor-pointer py-2 px-4 bg-black w-full rounded-lg text-white text-lg font-semibold border border-black  hover:bg-transparent  hover:text-black  transition-all duration-300
		  disabled:pointer-events-none disabled:opacity-60 disabled:cursor-auto
		  "
        />
      </form>
    </div>
  );
};

export default EditProfile;
