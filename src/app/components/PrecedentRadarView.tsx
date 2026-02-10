import { PrecedentRadarWorkflow } from '@/app/components/precedent-radar/PrecedentRadarWorkflow';

interface PrecedentRadarViewProps {
  onBack?: () => void;
}

export function PrecedentRadarView({ onBack }: PrecedentRadarViewProps = {}) {
  return <PrecedentRadarWorkflow onBack={onBack} />;
}