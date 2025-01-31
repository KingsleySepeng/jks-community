import {Belt} from './belt';
import {Technique} from './technique';

export const SyllabusMap: { [belt in Belt]?: Technique[] } = {
  [Belt.WHITE]: [
    { id: 'tech-1', name: 'Punch + Step', description: 'Basic punching combo' },
    { id: 'tech-2', name: 'Front Kick', description: 'Front snap kick' },
  ],
  [Belt.YELLOW]: [
    { id: 'tech-3', name: 'Side Kick', description: 'Side snap kick' },
    // ...
  ],
  // ...
};
