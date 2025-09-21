"use client";

import AdminMainCard from "@/app/components/card/admin-card";
import ErrorText from "@/app/components/typography/error-text";
import { EMAIL_PATTERN } from "@/config/pattern";
import { CreateLoginRequest, IamControllerService } from "@/gen";
import { RoleNameDict } from "@/model/RoleNameDict";
import { SelectOption } from "@/model/SelectOption";
import { mapApiErrorsToForm } from "@/util/form";
import { getRoleNameLabel } from "@/util/role-utils";
import { getPasswordError } from "@/util/validate";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Controller, ControllerFieldState, ControllerRenderProps, FieldValues, SubmitHandler, useForm, UseFormStateReturn } from "react-hook-form";
import Select, { SingleValue } from "react-select";
import { toast } from "react-toastify";
type RoleOption = {
  label: string,
  value: string,
}
const roles: RoleOption[] = Object.values(RoleNameDict).map(r => {
  const option: RoleOption = {
    label: getRoleNameLabel(r),
    value: String(r),
  }
  return option;
})
const UserAccessDetailsPage = () => {
  const params = useParams();
  const id = Number(params?.id);
  const {
    register,
    control,
    reset,
    watch,
    setFocus,
    getValues,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateLoginRequest>();

  const password = watch("password");
  const [selectedOptions, setSelectedOptions] = useState<RoleOption[]>([]);


  const onSubmit: SubmitHandler<CreateLoginRequest> = async (
    data: CreateLoginRequest,
  ) => {
    try {
      const resp = await IamControllerService.addLoginAccess(data);
      toast.success("Tài khoản tạo thành công")
    } catch (e) {
      mapApiErrorsToForm(e, setError);
    }
  };

  return (
    <>
      <AdminMainCard title="Chi tiết người dùng" goBack={true}>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>

          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-lg font-medium">Họ và tên</label>
              <input
                type="text"
                className="w-full border p-2 rounded"
                {...register("name", {
                  required: "Tên không được để trống",
                })}
              />
            </div>
          </div>


          <div>
            <label className="block text-lg font-medium">Email</label>
            <input
              type="email"
              className="w-full border p-2 rounded"
              {...register("email", {
                required: "Email không được trống",
                pattern: {
                  value: EMAIL_PATTERN,
                  message: "Định dạng email không hợp lệ"
                }
              })}
            />
          </div>


          <div>
            <label className="block text-lg font-medium">Mật khẩu</label>
            <input
              type="password"
              placeholder="Mật khẩu"
              {...register("password", {
                required: "Mật khẩu không được để trống",
                validate: () => getPasswordError(password) ?? true,
              })}
              className="w-full border p-2 rounded"
            />
          </div>


          <div>
            <label className="block text-lg font-medium">Xác nhận mật khẩu</label>
            <input
              type="password"
              placeholder="Xác nhận mật khẩu"
              {...register("passwordConfirmation", {
                required: "Vui lòng xác nhận lại mật khẩu",
                validate: (val) =>
                  val === password || "Mật khẩu xác nhận không khớp",
              })}
              className="w-full border p-2 rounded"
            />
          </div>


          <div className="flex w-full">
            <div className=" rounded-box grid h-20 grow ">
              <label className="block text-lg font-medium">Vai trò</label>
              <Controller
                control={control}
                name="roles"
                render={({
                  field: { onChange, onBlur, value, name, ref },
                }) => (
                  <Select<RoleOption, true>
                    options={roles}
                    // isLoading={isLoading}
                    onChange={(selected) => {
                      setSelectedOptions(selected as RoleOption[]);
                      // Set value in react hook form input
                      onChange(selected.map((option) => option.value));
                    }}
                    isMulti
                    onBlur={onBlur}
                    value={selectedOptions.filter((option) => (value || []).includes(option.value))}
                    name={name}
                    ref={ref}
                  />
                )}
              />

            </div>
          </div>

          {/* Validation error message */}
          <div className="flex items-center gap-2">
            <div className="validator-hint">
              {errors.name && <ErrorText>{errors.name.message}</ErrorText>}
              {errors.email && (
                <ErrorText>{errors.email.message}</ErrorText>
              )}
              {errors.password && (
                <ErrorText>{errors.password.message}</ErrorText>
              )}
              {errors.passwordConfirmation && (
                <ErrorText>{errors.passwordConfirmation.message}</ErrorText>
              )}
              {errors.roles && <ErrorText>{errors.roles.message}</ErrorText>}
              {errors.root && <ErrorText>{errors.root.message}</ErrorText>}
            </div>
          </div>
          <div className="text-left pt-5">
            <button type="submit" className="btn btn-primary">
              Lưu
            </button>
          </div>
        </form>
      </AdminMainCard>
    </>
  )
}

export default UserAccessDetailsPage;
