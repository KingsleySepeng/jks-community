export interface Technique {
  category: string;
  id: string;        // e.g., "Tech-001"
  name: string;      // e.g., "Front Kick Combination"
  description?: string;
  // We might store belt-level info if relevant
}
