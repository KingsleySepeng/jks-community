export interface GradingEvaluation {
  techniqueId: string;
  // techniqueName: string;
  // rating: 'good' | 'average' | 'bad';
  rating: "good" | "average" | "bad" | "pass" | "fail" | "regrade"; // Now it supports all grading options

  comment?: string;
}
