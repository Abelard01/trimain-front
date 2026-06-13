import { useNavigate } from 'react-router-dom';
import { Report } from '@/types/report';
import { Camera, Clock, ChevronRight, Hand } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface HomeScreenProps {
  reports: Report[];
}

export default function HomeScreen({ reports }: HomeScreenProps) {
  const navigate = useNavigate();
  const recent = reports.slice(0, 5);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-primary px-6 pt-14 pb-10 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary-foreground/10 flex items-center justify-center mb-4">
          <Hand className="w-9 h-9 text-primary-foreground" />
        </div>
        <h1 className="text-3xl font-black text-primary-foreground tracking-tight">TRIMAIN</h1>
        <p className="text-primary-foreground/60 text-sm mt-1">Triage IA des plaies de la main</p>
      </div>

      {/* Main CTA */}
      <div className="px-6 -mt-5">
        <button
          onClick={() => navigate('/camera')}
          className="w-full py-5 bg-primary text-primary-foreground rounded-2xl font-bold text-lg shadow-xl shadow-primary/30 flex items-center justify-center gap-3 active:scale-95 transition-transform"
        >
          <Camera className="w-6 h-6" />
          Analyser une plaie
        </button>
      </div>

      {/* History */}
      <div className="flex-1 px-6 pt-8">
        {recent.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-muted-foreground text-sm">
              Les analyses apparaîtront ici
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Récents</h2>
            </div>
            <div className="space-y-2">
              {recent.map(report => (
                <button
                  key={report.id}
                  onClick={() => navigate(`/report/${report.id}`)}
                  className="w-full flex items-center gap-3 p-3 bg-card rounded-xl border border-border text-left active:bg-muted transition-colors"
                >
                  <div className="w-11 h-11 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                    <img src={report.imageUri} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${report.avisResult ? 'text-red-600' : 'text-green-600'}`}>
                      {report.avisResult ? 'Chirurgien requis' : 'Prise en charge urgentiste'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {format(new Date(report.timestamp), "dd MMM · HH:mm", { locale: fr })}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <p className="text-center text-xs text-muted-foreground/50 pb-8 pt-4 px-6">
        Outil d'aide à la décision — ne remplace pas le jugement clinique
      </p>
    </div>
  );
}
