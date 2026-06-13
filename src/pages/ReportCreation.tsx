import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Report, INJURY_CAUSES, LOCALISATION_OPTIONS } from '@/types/report';
import { toast } from 'sonner';
import { demanderAvis } from '@/api/avis';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ReportCreationProps {
  onSubmit: (report: Report) => void;
}

export default function ReportCreation({ onSubmit }: ReportCreationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const imageUri = (location.state as any)?.imageUri as string | undefined;

  const [localisation, setLocalisation] = useState<string>('');
  const [meca, setMeca] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!imageUri) {
      toast.error('Aucune photo détectée');
      return;
    }

    setIsSubmitting(true);
    try {
      const avisResult = await demanderAvis(imageUri, localisation || undefined, meca || undefined);

      const uid = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const report: Report = {
        id: uid,
        timestamp: new Date().toISOString(),
        imageUri,
        medicalConditions: [],
        injuryCause: meca ? [meca] : [],
        localisation: localisation || null,
        ageRange: null,
        status: 'Analyzed',
        avisResult,
      };

      onSubmit(report);
      navigate(`/report/${report.id}`, { replace: true });
    } catch {
      toast.error("Erreur de connexion au serveur");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate('/camera')} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-base font-bold text-foreground">Nouvelle analyse</h1>
      </div>

      <div className="flex-1 p-4 space-y-5 max-w-lg mx-auto w-full">
        {/* Photo */}
        {imageUri && (
          <div className="aspect-square rounded-2xl overflow-hidden border border-border shadow-sm">
            <img src={imageUri} alt="Plaie" className="w-full h-full object-cover" />
          </div>
        )}

        {/* Optional fields */}
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wide">
            Informations optionnelles
          </p>

          {/* Localisation */}
          <Select value={localisation} onValueChange={setLocalisation}>
            <SelectTrigger className="w-full rounded-xl h-11">
              <SelectValue placeholder="Localisation de la plaie" />
            </SelectTrigger>
            <SelectContent>
              {LOCALISATION_OPTIONS.map(opt => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Mécanisme */}
          <div className="flex flex-wrap gap-2">
            {INJURY_CAUSES.map(cause => (
              <button
                key={cause}
                onClick={() => setMeca(meca === cause ? '' : cause)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                  meca === cause
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-foreground border-border hover:bg-muted'
                }`}
              >
                {cause}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Analyse button */}
      <div className="sticky bottom-0 p-4 bg-background/80 backdrop-blur-md border-t border-border">
        <div className="max-w-lg mx-auto">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !imageUri}
            className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold text-base flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 transition-transform"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyse en cours…
              </>
            ) : (
              'Analyser'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
