import { Report } from '@/types/report';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Clock, AlertTriangle, Check } from 'lucide-react';

interface ReportCardProps {
  report: Report;
  onClick: () => void;
}

export function ReportCard({ report, onClick }: ReportCardProps) {
  const date = new Date(report.timestamp);

  return (
    <button
      onClick={onClick}
      className="w-full flex overflow-hidden rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow text-left bg-card"
    >
      <div className="flex-1 flex items-center gap-4 p-4 min-w-0">
        <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
          <img src={report.imageUri} alt="Wound" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground truncate">
            Rapport du {format(date, 'dd MMM yyyy', { locale: fr })}
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
            <Clock className="w-3.5 h-3.5" />
            {format(date, 'HH:mm')}
          </p>
        </div>
      </div>
      {report.avisResult === true && (
        <div className="w-10 flex-shrink-0 flex items-center justify-center bg-red-500 text-white">
          <AlertTriangle className="w-5 h-5" />
        </div>
      )}
      {report.avisResult === false && (
        <div className="w-10 flex-shrink-0 flex items-center justify-center bg-green-500 text-white">
          <Check className="w-5 h-5" />
        </div>
      )}
    </button>
  );
}
