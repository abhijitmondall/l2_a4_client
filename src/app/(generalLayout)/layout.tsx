import { Footer } from "@/components/footer/footer";
import { Navbar } from "@/components/navbar/navbar";
import { Toaster } from "@/components/ui/toaster";

export default function GeneralLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Toaster />
      <header>
        <Navbar />
      </header>

      <main className="min-h-[60vh]">{children}</main>

      <footer>
        <Footer />
      </footer>
    </>
  );
}
