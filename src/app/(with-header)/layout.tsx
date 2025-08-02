import { ReactNode } from "react";
import { AuthProvider } from "@/contexts/AuthProvider";
import Header from "@/app/(with-header)/Header";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <AuthProvider>
      <Header />
      <div>{children}</div>
      <Footer />
    </AuthProvider>
  );
}
