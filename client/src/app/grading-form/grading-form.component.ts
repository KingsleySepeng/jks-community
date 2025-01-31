import {Component, OnInit} from '@angular/core';
import {Student} from '../model/user';
import {Belt} from '../model/belt';
import {Technique} from '../model/technique';
import {GradingEvaluation} from '../model/grading-evaluation';
import {MockDataService} from '../mock-service/mock-data.service';
import {MockServiceService} from '../mock-service/mock-service.service';
import {Role} from '../model/role';
import {SyllabusMap} from '../model/SyllabusMap';
import {GradingRecord} from '../model/grading-record';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-grading-form',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './grading-form.component.html',
  styleUrl: './grading-form.component.scss'
})
export class GradingFormComponent  implements OnInit  {
  belt?: Belt;
  allStudents: Student[] = [];
  eligibleStudents: Student[] = [];
  selectedStudentIds: Set<string> = new Set();
  students: Student[] = [];
  techniques: Technique[] = [];
  multiEvaluations: MultiStudentEvaluation[] = [];

  constructor(
    private mockData: MockDataService,
    private mockService: MockServiceService
  ) {}

  ngOnInit() {

    // load students for whom the user is instructor

    const instructor = this.mockService.getLoggedInUser();
    const users = this.mockData.getUsers();
    this.students = users.filter(user=>user.clubId === instructor!.clubId && user.role === Role.STUDENT) as Student[];
  }


  onBeltChange(newBelt: Belt) {
    this.belt = newBelt;
    this.techniques = SyllabusMap[newBelt] || [];
    // Recompute eligible
    this.eligibleStudents = this.allStudents.filter(s => this.mockData.isEligibleForBelt(s, newBelt));
    // Clear selected
    this.selectedStudentIds.clear();
  }

  toggleStudentSelection(studentId: string) {
    if (this.selectedStudentIds.has(studentId)) {
      this.selectedStudentIds.delete(studentId);
    } else {
      this.selectedStudentIds.add(studentId);
    }
    this.buildEvaluationMatrix();
  }

  // Build or refresh the multiEvaluations array
  buildEvaluationMatrix() {
    this.multiEvaluations = [];
    for (let studentId of this.selectedStudentIds) {
      for (let tech of this.techniques) {
        this.multiEvaluations.push({
          studentId,
          techniqueId: tech.id,
          rating: 'good',
          comment: ''
        });
      }
    }
  }

  // Accessor to find a specific rating
  findEvaluation(studentId: string, techniqueId: string): MultiStudentEvaluation | undefined {
    return this.multiEvaluations.find(m => m.studentId === studentId && m.techniqueId === techniqueId);
  }

  // Submit all
  submitGrading() {
    // For each student, create a GradingRecord
    this.selectedStudentIds.forEach(studentId => {
      const student = this.students.find(s => s.id === studentId);
      if (!student || !this.belt) return;

      const filteredEvals = this.multiEvaluations.filter(m => m.studentId === studentId);
      const record: GradingRecord = {
        id: this.generateId(),
        studentId,
        examinerId: '???',  // from auth or ...
        clubId: student.clubId,
        date: new Date(),
        currentBelt: student.belt,
        testingForBelt: this.belt,
        evaluations: filteredEvals.map(f => ({
          techniqueId: f.techniqueId,
          rating: f.rating,
          comment: f.comment
        })),
        overallDecision: 'pass', // or prompt user for each student?
        overallComment: 'Batch Grading'
      };

      this.mockData.saveGradingRecord(record);
      // optionally update belt if pass
    });
  }

  private generateId() {
    return 'GR-' + Math.floor(Math.random() * 100000);
  }

}
