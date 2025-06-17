"use client";
import React, { ReactNode } from "react";
import Subtitle from "../typography/subtitle";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
type AdminCardProps = {
  title: string;
  goBack?: boolean;
  children?: ReactNode;
};
const AdminMainCard = ({ title, goBack = false, children }: AdminCardProps) => {
  const router = useRouter();
  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white container w-full max-w-7xl lg:max-w-screen-2xl min-h-[80vh] shadow-lg rounded-lg p-8">
          {goBack && (
            <ArrowLeft className="hover:cursor-pointer" onClick={router.back} />
          )}
          <Subtitle styleClass={""}>{title}</Subtitle>
          {children}
        </div>
      </div>
    </>
  );
};

export default AdminMainCard;
