"use client";
import React from "react";
import DeliveryDetailsForm from "./components/delivery-details-form";
const CheckoutAddressPage = () => {
  return (
    <>
      <div className="bg-gray-50 h-[calc(100vh-20rem)] flex items-center justify-center">
        <div className="container max-w-xl mx-auto px-4">
          <div className="flex items-center justify-center">
            <ul className="steps steps-vertical lg:steps-horizontal mb-20">
              <li className="step step-primary">Giỏ hàng</li>
              <li className="step step-primary">Thông tin nhận hàng</li>
              <li className="step">Xác nhận</li>
            </ul>
          </div>

          <div className="bg-white shadow-md rounded-xl p-10">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="flex-1 w-full">
                <DeliveryDetailsForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutAddressPage;
