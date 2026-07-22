import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Bot, LineChart, Shield, Sparkles } from 'lucide-react';

function FeatureCard({ title, description, icon: Icon, index }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className="group relative flex flex-col items-start gap-6 rounded-xl bg-white p-10 shadow-premium transition-all duration-500 hover:shadow-premium-hover"
    >
      <div 
        style={{ transform: "translateZ(50px)" }}
        className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-background text-primary shadow-inner"
      >
        <Icon size={28} strokeWidth={1.5} />
      </div>
      
      <div style={{ transform: "translateZ(30px)" }}>
        <h3 className="mb-3 text-2xl font-bold tracking-tight text-dark">
          {title}
        </h3>
        <p className="text-[17px] leading-relaxed text-dark/60 font-medium text-balance">
          {description}
        </p>
      </div>

      <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-dark/5 pointer-events-none" />
    </motion.div>
  );
}

const features = [
  {
    icon: Bot,
    title: "AI-Powered Intelligence",
    description: "Our proprietary AI models adapt to your learning pace, offering personalized insights and real-time financial advice.",
  },
  {
    icon: LineChart,
    title: "Actionable Insights",
    description: "Translate complex financial jargon into simple, actionable steps that you can apply immediately to your portfolio.",
  },
  {
    icon: Shield,
    title: "Bank-Grade Privacy",
    description: "Your data is encrypted end-to-end. We don't store your sensitive financial information, keeping your privacy intact.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-32 bg-background relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6">
        
        <div className="max-w-3xl mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 mb-6"
          >
            <Sparkles className="text-primary" size={20} />
            <span className="text-sm font-bold uppercase tracking-wider text-primary">Capabilities</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-6xl font-bold tracking-tight text-dark leading-[1.1] text-balance mb-8"
          >
            Designed for simplicity.
            <br />Built for financial mastery.
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 perspective-1000">
          {features.map((feature, idx) => (
            <FeatureCard key={feature.title} index={idx} {...feature} />
          ))}
        </div>

      </div>
    </section>
  );
}
