"use client";

import VietSneakerModal from "@/app/components/modal/modal";
import ErrorText from "@/app/components/typography/error-text";
import PrimaryButton from "@/app/components/button/button";
import { AdminSupplierControllerService, SupplierDTO } from "@/gen";
import { mapApiErrorsToForm } from "@/util/form";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";

// Định nghĩa các loại nhà cung cấp cứng dựa trên dữ liệu bạn cung cấp
const SUPPLIER_TYPES = [
  { value: "SHOP", label: "Cửa hàng/Bán lẻ (SHOP)" },
  { value: "CONSIGN", label: "Ký gửi (CONSIGN)" },
  { value: "WHOLESALE", label: "Bán sỉ/Kho (WHOLESALE)" },
];

// Giả định SupplierDTO có trường 'supplierType' thay vì 'type'
type SupplierFormData = SupplierDTO & {
  supplierType: string;
};

const CreateSupplierModal = ({
  isOpen,
  onClose,
  refreshCallBack,
}: {
  isOpen: boolean;
  onClose: () => void;
  refreshCallBack: () => void;
}) => {
  const {
    register,
    setError,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SupplierFormData>();

  const onSubmit: SubmitHandler<SupplierFormData> = async (data) => {
    try {
      // Đảm bảo tên trường `supplierType` khớp với DTO nếu đã đổi tên
      await AdminSupplierControllerService.addSupplier(data as SupplierDTO);
      
      toast.success("Thêm nhà cung cấp thành công!");
      
      reset();
      onClose();
      refreshCallBack();
    } catch (e) {
      mapApiErrorsToForm(e, setError);
      toast.error("Thêm thất bại. Vui lòng kiểm tra lỗi.");
    }
  };
  
  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <VietSneakerModal isOpen={isOpen} onClose={handleClose}>
      <div className="p-4 sm:p-6 w-full max-w-xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
           Thêm Mới Nhà Cung Cấp
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* 📝 Thông tin cơ bản */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Tên */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Tên NCC <span className="text-red-500">*</span>
              </label>
              <input
                autoFocus={true}
                className={`input validator w-full p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-[#e20000] focus:border-[#e20000]`}
                {...register("name", { required: "Tên không được trống" })}
              />
              {errors.name && <ErrorText>{errors.name.message}</ErrorText>}
            </div>

            {/* Số điện thoại */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Số điện thoại
              </label>
              <input
                className={`input validator w-full p-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-[#e20000] focus:border-[#e20000]`}
                {...register("phone", {
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "Số điện thoại phải là số",
                  },
                })}
              />
              {errors.phone && <ErrorText>{errors.phone.message}</ErrorText>}
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                className={`input validator w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-[#e20000] focus:border-[#e20000]`}
                {...register("email", {
                  required: "Email không được trống",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Email không đúng định dạng",
                  },
                })}
              />
              {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
            </div>
            
            {/* Địa chỉ */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Địa chỉ <span className="text-red-500">*</span>
              </label>
              <input
                className={`input validator w-full p-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-[#e20000] focus:border-[#e20000]`}
                {...register("address", { required: "Địa chỉ không được trống" })}
              />
              {errors.address && <ErrorText>{errors.address.message}</ErrorText>}
            </div>
          </div>
          
          <hr className="my-4 border-gray-200" />
          
          {/* 🌐 Thông tin mở rộng */}
          <h3 className="text-lg font-bold text-gray-900 mb-3">Thông tin Mạng xã hội & Loại</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Loại NCC (Dropdown) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Loại Nhà Cung Cấp
              </label>
              <select
                className="input validator w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-[#e20000] focus:border-[#e20000]"
                {...register("supplierType", { required: "Loại không được trống" })} // Sử dụng 'supplierType'
                defaultValue="SHOP" // Đặt giá trị mặc định là SHOP
              >
                {SUPPLIER_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.supplierType && <ErrorText>{errors.supplierType.message}</ErrorText>}
            </div>

            {/* Zalo */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Link/SĐT Zalo
              </label>
              <input
                className="input validator w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#e20000] focus:border-[#e20000]"
                placeholder="Link Zalo hoặc SĐT Zalo"
                {...register("zalo")} 
              />
            </div>

            {/* Facebook */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Link Facebook
              </label>
              <input
                className="input validator w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#e20000] focus:border-[#e20000]"
                placeholder="Link trang/cá nhân Facebook"
                {...register("facebook")} 
              />
            </div>

            {/* Ghi chú lỗi chung (root error) */}
            {errors.root && (
              <div className="md:col-span-2 mt-2">
                <ErrorText>{errors.root.message}</ErrorText>
              </div>
            )}
            
          </div>

          {/* 💾 Nút hành động */}
          <div className="flex justify-end pt-6 space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition duration-150 ease-in-out font-semibold"
            >
              Hủy
            </button>
            <PrimaryButton 
                type="submit"
                className="!bg-[#e20000] hover:!bg-[#c10000] text-white font-semibold px-5 py-2 rounded-md transition duration-150 ease-in-out"
            >
              <i className="fa fa-save mr-2 text-sm"></i>
              <span>Lưu Nhà Cung Cấp</span>
            </PrimaryButton>
          </div>
        </form>
      </div>
    </VietSneakerModal>
  );
};

export default CreateSupplierModal;