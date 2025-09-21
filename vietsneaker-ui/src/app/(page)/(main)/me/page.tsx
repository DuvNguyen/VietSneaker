import { User } from "lucide-react";
import React from "react";
import ChangeUserDetailsForm from "./components/change-user-details-form";
import { ProtectedRoute } from "@/app/components/route/protected";
const UserProfilePage = () => {
  return (
    <>
      <ProtectedRoute>
        <div className="bg-gray-50 h-[calc(100vh-20rem)] flex items-center justify-center">
          <div className="container max-w-2xl mx-auto px-4">
            <div className="bg-white shadow-md rounded-xl p-6">
              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                <div className="flex-1 w-full">
                  <ChangeUserDetailsForm />
                </div>

                <div className="flex-shrink-0">
                  <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                    <User size={64} className="text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    </>
  );
};

export default UserProfilePage;
