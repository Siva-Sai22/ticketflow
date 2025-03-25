import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <div className="container mx-auto px-4 py-12">
        {/* Additional content can go here */}
      </div>
      <Footer />
    </main>
  );
}
