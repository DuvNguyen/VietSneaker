import Link from "next/link";

/**
 * Header when simple public page like: login, register, reset password, etc
 */
export default function SimpleHeader() {
  return (
    <header className="w-full bg-white py-3 px-6 flex justify-between items-center ">
      <div className="flex items-center text-xl font-bold text-orange-500">
        <Link href={"/"}>
          <img
            className="w-[100px] h-auto mr-[-9px] mt-[-5px]"
            src="/logo_header.png"
            alt="logo login"
          />
        </Link>
      </div>
      <p className="text-sm text-yellow-500">Bạn cần giúp đỡ?</p>
    </header>
  );
}
