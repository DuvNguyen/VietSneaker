import Footer from "@/app/components/footer/footer";
import { MainHeader } from "@/app/components/header/main-header";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col">
      <MainHeader />
      <main className="flex-1 w-[100%] pb-10">{children}</main>
      <Footer />
    </div>
  );
}
