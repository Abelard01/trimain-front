import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Report } from '@/types/report';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ArrowLeft, Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface ReportDetailProps {
  getReport: (id: string) => Report | null;
  onDelete: (id: string) => void;
}

export default function ReportDetail({ getReport, onDelete }: ReportDetailProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const report = id ? getReport(id) : null;

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  if (!report) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Analyse introuvable</p>
      </div>
    );
  }

  const urgent = report.avisResult === true;
  const date = new Date(report.timestamp);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="text-center">
          <p className="text-xs font-semibold text-foreground">{format(date, 'dd MMMM yyyy', { locale: fr })}</p>
          <p className="text-xs text-muted-foreground">{format(date, 'HH:mm')}</p>
        </div>
        <button
          onClick={() => {
            onDelete(report.id);
            toast.success('Analyse supprimée');
            navigate('/');
          }}
          className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 p-4 space-y-4 max-w-lg mx-auto w-full">
        {/* Result banner — the hero */}
        {urgent ? (
          <div className="rounded-2xl bg-red-600 p-6 flex flex-col items-center text-center gap-3 shadow-lg shadow-red-200">
            <AlertTriangle className="w-10 h-10 text-white" strokeWidth={2.5} />
            <div>
              <p className="text-white font-black text-xl leading-tight">Chirurgien requis</p>
              <p className="text-red-100 text-sm mt-1">Orienter vers un chirurgien de la main</p>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-green-600 p-6 flex flex-col items-center text-center gap-3 shadow-lg shadow-green-200">
            <CheckCircle2 className="w-10 h-10 text-white" strokeWidth={2.5} />
            <div>
              <p className="text-white font-black text-xl leading-tight">Prise en charge urgentiste</p>
              <p className="text-green-100 text-sm mt-1">Suture simple envisageable</p>
            </div>
          </div>
        )}

        {/* Photo */}
        <div className="aspect-square rounded-2xl overflow-hidden border border-border shadow-sm">
          <img src={report.imageUri} alt="Plaie" className="w-full h-full object-cover" />
        </div>

        {/* Optional metadata summary */}
        {(report.localisation || (report.injuryCause && report.injuryCause.length > 0)) && (
          <div className="bg-card rounded-xl border border-border p-4 space-y-3">
            {report.localisation && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Localisation</p>
                <p className="text-sm text-foreground">{report.localisation}</p>
              </div>
            )}
            {report.injuryCause && report.injuryCause.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Mécanisme</p>
                <p className="text-sm text-foreground">{report.injuryCause.join(', ')}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <p className="text-center text-xs text-muted-foreground/40 pb-8 px-6">
        Outil d'aide à la décision — ne remplace pas le jugement clinique
      </p>
    </div>
  );
}
