import AppLinks from "./components/AppLinks";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Modules from "./components/Modules";
import SokhnaChat from "./components/SokhnaChat";

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <Modules />
        <AppLinks />
      </main>
      <Footer />
      <SokhnaChat />
    </div>
  );
}
