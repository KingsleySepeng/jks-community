export interface GradingEvaluation {
  techniqueId: string;
  // techniqueName: string;
  rating: 'good' | 'average' | 'bad';
  comment?: string;
}
