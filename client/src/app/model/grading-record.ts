import {Belt} from './belt';
import {GradingEvaluation} from './grading-evaluation';

export interface GradingRecord {
  id: string;
  studentId: string;
  examinerId: string;     // e.g., instructor or examiner user ID
  clubId: string;
  date: Date;
  currentBelt: Belt;      // the student's belt at the time
  testingForBelt: Belt;   // the belt being tested for
  evaluations: GradingEvaluation[]; // array of technique evaluations
  overallDecision: 'pass' | 'fail' | 'exempted' | 'regrade';
  overallComment?: string;
}
