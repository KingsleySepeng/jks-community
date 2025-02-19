export interface MultiStudentEvaluation {
  studentId: string;
  techniqueId: string;
  rating: 'good' | 'average' | 'bad';
  comment?: string;
}
