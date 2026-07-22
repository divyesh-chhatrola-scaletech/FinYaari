import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Story from './components/Story';
import Companion from './components/Companion';
import FeatureIslands from './components/FeatureIslands';
import Journey from './components/Journey';
import GoalExplorer from './components/GoalExplorer';
import InteractiveDemo from './components/InteractiveDemo';
import CTA from './components/CTA';
import Footer from './components/Footer';

function App() {
  return (
    <div className="relative min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Story />
        <Companion />
        <FeatureIslands />
        <Journey />
        <GoalExplorer />
        <InteractiveDemo />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export default App;
