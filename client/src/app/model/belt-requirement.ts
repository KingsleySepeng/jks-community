import {Belt} from './belt';

export interface BeltRequirement {
  belt: Belt;
  minAttendancePercentage: number; // e.g. 80 for 80%
  minWaitingPeriodMonths: number;  // e.g. 6
}

export const BeltRequirements: BeltRequirement[] = [
  { belt: Belt.YELLOW, minAttendancePercentage: 80, minWaitingPeriodMonths: 6 },
  { belt: Belt.ORANGE, minAttendancePercentage: 80, minWaitingPeriodMonths: 6 },
  // ...
];
