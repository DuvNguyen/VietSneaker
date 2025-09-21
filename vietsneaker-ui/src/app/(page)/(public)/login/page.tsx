import Link from "next/link";
import { LoginForm } from "./reset/components/login-form";

export default function LoginPage() {
  return (
    <div className="w-full flex flex-col items-center bg-white">
      {/* Main Content */}
      <div className="bg-[#FFDA3E] w-full h-[604px] flex justify-center items-center ">
        <main className="w-full max-w-5xl  flex flex-col  md:flex-row items-center bg-[#FFDA3E]">
          {/* Banner */}
          <div className="flex-1 p-5">
            <img src="/body.png" className="w-full rounded-lg" />
          </div>
          <div className="w-full md:w-[400px] bg-white p-8 rounded-lg shadow-lg border border-yellow-300">
            {/* Banner trên cùng */}
            <div className="flex justify-between items-center bg-White p-1 rounded-md">
              <h2 className="text-xl font-bold text-black">Đăng nhập</h2>
              <img src="/hight_brand.png" alt="" />
            </div>

            <LoginForm />
            <div className="flex justify-between text-sm text-gray-600 mt-6 border-t border-gray-300 pt-2">
              <Link
                href={"/login/reset"}
                className="cursor-pointer hover:text-yellow-600"
              >
                Quên mật khẩu
              </Link>
              <Link
                href={"/signup"}
                className="text-yellow-700 cursor-pointer hover:text-yellow-900"
              >
                Đăng ký
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
