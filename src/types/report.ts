export type ReportStatus = 'Pending' | 'Analyzed';

export type AgeRange = '0-3' | '4-10' | '10-18' | '18+';

export const MEDICAL_CONDITIONS = ['Diabète', 'Immuno-suppression', 'Anti-coagulants'] as const;

export const INJURY_CAUSES = [
  'Morsure', 'Ecrasement', 'Verre', 'Section',
  'Perforation', 'Bague', 'Autre', 'Injection sous pression',
  'Dermabrasion', 'Brûlure', 'Autolyse'
] as const;

export const CLINICAL_EXAM = [
  'Perte de sensibilité',
  'Fièvre',
  'Fracture',
  'Perte de mobilité',
] as const;

export const COULEUR = ['Inflammatoire', 'Ischémie'] as const;

export const LOCALISATION_OPTIONS = [
  'Autre',
  'Commissures',
  'Plaie du poignet face dorsale',
  'Plaie du poignet face palmaire',
  'Plaies de la paume de la main',
  'Plaies digitales dorsales',
  'Plaies digitales palmaires',
  'Plaies du dos de la main',
  'Plaies pulpaires distales',
] as const;

export const AGE_RANGES: AgeRange[] = ['0-3', '4-10', '10-18', '18+'];

export interface Report {
  id: string;
  timestamp: string;
  imageUri: string;
  medicalConditions: string[];
  injuryCause: string[];
  /** Clinical exam findings (e.g. Perte de sensibilité, Fièvre, Fracture, Perte de mobilité) */
  clinicalExam?: string[];
  /** Color assessment (Inflammatoire, Ischémie) */
  couleur?: string[];
  /** Injury location */
  localisation?: string | null;
  ageRange: AgeRange | null;
  status: ReportStatus;
  /** Result from "Demander un avis" API: true = SOS main, false = prise en charge non spécialisée */
  avisResult?: boolean;
}
