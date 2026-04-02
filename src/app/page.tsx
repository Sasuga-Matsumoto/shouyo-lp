export const dynamic = 'force-dynamic';

import Header from '@/src/components/Header';
import HeroSection from '@/src/components/HeroSection';
import MeritSection from '@/src/components/MeritSection';
import PainSolutionSection from '@/src/components/PainSolutionSection';
import ServiceDetailSection from '@/src/components/ServiceDetailSection';
import SimulatorSection from '@/src/components/SimulatorSection';
import FaqSection from '@/src/components/FaqSection';
import FinalCtaSection from '@/src/components/FinalCtaSection';
import StickyCTA from '@/src/components/StickyCTA';

export default function Home() {
  return (
    <>
      <Header variant="top" />
      <HeroSection />
      <MeritSection />
      <PainSolutionSection />
      <ServiceDetailSection />
      <SimulatorSection />
      <FaqSection />
      <FinalCtaSection />
      <StickyCTA />
    </>
  );
}
