import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Story from './components/Story';
import WhyFinYaari from './components/WhyFinYaari';
import HowItWorks from './components/HowItWorks';
import Companion from './components/Companion';
import LearningJourney from './components/LearningJourney';
import InteractiveDemo from './components/InteractiveDemo';
import LivingConversation from './components/LivingConversation';
import LearningProgress from './components/LearningProgress';
import FeatureIslands from './components/FeatureIslands';
import FAQ from './components/FAQ';
import CTA from './components/CTA';
import Footer from './components/Footer';

function App() {
  return (
    <div className="relative min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Story />
        <WhyFinYaari />
        <HowItWorks />
        <LearningJourney />
        <Companion />
        <InteractiveDemo />
        <LivingConversation />
        <LearningProgress />
        <FeatureIslands />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export default App;
