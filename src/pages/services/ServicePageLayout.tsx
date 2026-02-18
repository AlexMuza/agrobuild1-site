import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactSection from "@/components/ContactSection";

export default function ServicePageLayout({
  children,
  showContact = true,
}: {
  children: React.ReactNode;
  showContact?: boolean;
}) {
  return (
    <>
      <Header />
      <main className="pt-16">
        {children}
        {showContact && <ContactSection />}
      </main>
      <Footer />
    </>
  );
}

