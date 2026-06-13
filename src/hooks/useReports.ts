import { useState, useEffect, useCallback, useRef } from 'react';
import { Report } from '@/types/report';
import { saveImage, loadAllImages, deleteImage } from '@/lib/imageStore';

const STORAGE_KEY = 'hand-wound-reports';

interface StoredReport {
  id: string;
  imageUri?: string;
  [key: string]: unknown;
}

function loadStoredReports(): StoredReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [ready, setReady] = useState(false);
  const skipPersist = useRef(true);

  useEffect(() => {
    const stored = loadStoredReports();

    const migratePromises: Promise<void>[] = [];
    for (const r of stored) {
      if (r.imageUri && r.imageUri.startsWith('data:')) {
        migratePromises.push(saveImage(r.id, r.imageUri));
      }
    }

    Promise.all(migratePromises).then(() => {
      if (migratePromises.length > 0) {
        const stripped = stored.map(({ imageUri: _, ...rest }) => rest);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stripped));
      }

      return loadAllImages();
    }).then(images => {
      const hydrated = stored.map(({ imageUri: _, ...rest }) => ({
        ...rest,
        imageUri: images.get(rest.id) ?? '',
      })) as Report[];
      setReports(hydrated);
      skipPersist.current = false;
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (skipPersist.current) return;
    const stripped = reports.map(({ imageUri: _, ...rest }) => rest);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stripped));
    } catch {
      // localStorage full — metadata-only, so this is unlikely
    }
  }, [reports]);

  const addReport = useCallback((report: Report) => {
    saveImage(report.id, report.imageUri);
    setReports(prev => [report, ...prev]);
  }, []);

  const getReport = useCallback((id: string) => {
    return reports.find(r => r.id === id) ?? null;
  }, [reports]);

  const deleteReport = useCallback((id: string) => {
    deleteImage(id);
    setReports(prev => prev.filter(r => r.id !== id));
  }, []);

  return { reports, addReport, getReport, deleteReport, ready };
}
