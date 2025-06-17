import Footer from "@/app/components/footer/footer";
import SimpleHeader from "@/app/components/header/simple-header";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col">
      <SimpleHeader />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
