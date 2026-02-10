import { useState } from 'react';
import { RadarSetupWizard } from '@/app/components/precedent-radar/RadarSetupWizard';
import { RadarPreview } from '@/app/components/precedent-radar/RadarPreview';
import { RadarDashboard, RadarItem } from '@/app/components/precedent-radar/RadarDashboard';
import { CaseFeed } from '@/app/components/precedent-radar/CaseFeed';
import { toast } from 'sonner';

type Phase = 'dashboard' | 'setup' | 'preview' | 'case-feed';

interface SetupData {
  proposition: string;
  jurisdictions: string[];
}

interface PrecedentRadarWorkflowProps {
  onBack?: () => void;
}

export function PrecedentRadarWorkflow({ onBack }: PrecedentRadarWorkflowProps = {}) {
  const [phase, setPhase] = useState<Phase>('dashboard');
  const [setupData, setSetupData] = useState<SetupData | null>(null);
  const [selectedRadarId, setSelectedRadarId] = useState<string | null>(null);
  const [radars, setRadars] = useState<RadarItem[]>([]);

  const handleSetupComplete = (data: SetupData) => {
    setSetupData(data);
    setPhase('preview');
  };

  const handlePreviewEdit = () => {
    setPhase('setup');
  };

  const handlePreviewConfirm = () => {
    if (!setupData) return;

    // Create new radar
    const newRadar: RadarItem = {
      id: Date.now().toString(),
      proposition: setupData.proposition,
      jurisdictions: setupData.jurisdictions,
      status: 'active',
      notificationsEnabled: true,
      casesIntercepted: 0,
      articlesIntercepted: 0,
      createdAt: new Date()
    };

    setRadars([newRadar, ...radars]);
    setSetupData(null);
    setPhase('dashboard');
    
    toast.success('Radar activated successfully!', {
      description: 'Your radar is now live and monitoring for new case laws.'
    });
  };

  const handleCreateNew = () => {
    setSetupData(null);
    setPhase('setup');
  };

  const handleSelectRadar = (radarId: string) => {
    setSelectedRadarId(radarId);
    setPhase('case-feed');
  };

  const handleBackToDashboard = () => {
    setSelectedRadarId(null);
    setPhase('dashboard');
  };

  const handleBackFromSetup = () => {
    setSetupData(null);
    setPhase('dashboard');
  };

  const handleToggleStatus = (radarId: string) => {
    setRadars(radars.map(radar => 
      radar.id === radarId 
        ? { ...radar, status: radar.status === 'active' ? 'inactive' : 'active' }
        : radar
    ));
    
    const radar = radars.find(r => r.id === radarId);
    if (radar) {
      toast.success(
        radar.status === 'active' ? 'Radar paused' : 'Radar activated',
        {
          description: radar.status === 'active' 
            ? 'Monitoring has been paused for this radar.'
            : 'Radar is now live and monitoring.'
        }
      );
    }
  };

  const handleToggleNotifications = (radarId: string) => {
    setRadars(radars.map(radar => 
      radar.id === radarId 
        ? { ...radar, notificationsEnabled: !radar.notificationsEnabled }
        : radar
    ));
    
    const radar = radars.find(r => r.id === radarId);
    toast.success(
      radar?.notificationsEnabled ? 'Notifications disabled' : 'Notifications enabled',
      {
        description: radar?.notificationsEnabled 
          ? 'You will no longer receive alerts for this radar.'
          : 'You will receive alerts when new cases are intercepted.'
      }
    );
  };

  const handleEdit = (radarId: string) => {
    toast.info('Edit functionality', {
      description: 'Edit radar parameters (coming soon)'
    });
  };

  const handleDuplicate = (radarId: string) => {
    const radarToDuplicate = radars.find(r => r.id === radarId);
    if (!radarToDuplicate) return;

    const duplicatedRadar: RadarItem = {
      ...radarToDuplicate,
      id: Date.now().toString(),
      status: 'inactive',
      casesIntercepted: 0,
      createdAt: new Date(),
      lastActivity: undefined
    };

    setRadars([duplicatedRadar, ...radars]);
    toast.success('Radar duplicated', {
      description: 'A copy has been created. Activate it to start monitoring.'
    });
  };

  const handleDelete = (radarId: string) => {
    setRadars(radars.filter(r => r.id !== radarId));
    toast.success('Radar deleted', {
      description: 'The radar has been removed from your dashboard.'
    });
  };

  const handleRefineRadar = () => {
    toast.info('Refine radar', {
      description: 'You can edit radar parameters to improve result relevance.'
    });
  };

  const selectedRadar = radars.find(r => r.id === selectedRadarId);

  return (
    <div className="h-screen flex flex-col bg-background">
      {phase === 'dashboard' && (
        <RadarDashboard
          radars={radars}
          onCreateNew={handleCreateNew}
          onSelectRadar={handleSelectRadar}
          onToggleStatus={handleToggleStatus}
          onToggleNotifications={handleToggleNotifications}
          onEdit={handleEdit}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
          onBack={onBack}
        />
      )}

      {phase === 'setup' && (
        <RadarSetupWizard onComplete={handleSetupComplete} onBack={handleBackFromSetup} />
      )}

      {phase === 'preview' && setupData && (
        <RadarPreview
          proposition={setupData.proposition}
          jurisdictions={setupData.jurisdictions}
          onConfirm={handlePreviewConfirm}
          onEdit={handlePreviewEdit}
        />
      )}

      {phase === 'case-feed' && selectedRadar && (
        <CaseFeed
          radarId={selectedRadar.id}
          proposition={selectedRadar.proposition}
          onBack={handleBackToDashboard}
          onRefineRadar={handleRefineRadar}
        />
      )}
    </div>
  );
}