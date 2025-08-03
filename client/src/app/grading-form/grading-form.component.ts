import {Component, OnInit} from '@angular/core';
import {User} from '../model/user';
import {Belt} from '../model/belt';
import {Technique} from '../model/technique';
import {GradingRecord} from '../model/grading-record';
import {MultiStudentEvaluation} from '../model/multi-student-evaluation';
import {Role} from '../model/role';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {ServiceService} from '../services/service.service';
import {first} from 'rxjs';

@Component({
  selector: 'app-grading-form',
  standalone: true,
  imports: [FormsModule, NgForOf, NgIf],
  templateUrl: './grading-form.component.html',
  styleUrls: ['./grading-form.component.scss']
})
export class GradingFormComponent implements OnInit {
  belt?: Belt;
  allStudents: User[] = [];
  selectedStudents: User[] = [];
  studentSearchTerm: string = '';
  filteredStudents: User[] = [];
  techniques: { kihon: Technique[]; kata: Technique[]; kumite: Technique[] } = {kihon: [], kata: [], kumite: []};
  multiEvaluations: MultiStudentEvaluation[] = [];
  instructor?: User;
  allBelts: Belt[] = [Belt.WHITE, Belt.YELLOW, Belt.GREEN, Belt.BLUE, Belt.RED, Belt.BLACK];
  showModal: boolean = false;
  errorMessage: string = '';
  public categories: Array<'kihon' | 'kata' | 'kumite'> = ['kihon', 'kata', 'kumite'];

  // New property: Final decisions per student
  finalDecisions: { [studentId: string]: { decision: 'pass' | 'fail' | 'regrade'; comment: string } } = {};

  constructor(private service: ServiceService) {
  }

  ngOnInit() {
    this.instructor = this.service.getLoggedInUserValue();
    if (!this.instructor?.roles.includes(Role.INSTRUCTOR)) return;
    this.service.getUsersByClub(this.instructor.clubId)
      .pipe(first())
      .subscribe(users => this.allStudents = users);
  }

  submitGrading() {
    if (!this.instructor || !this.belt) return;
    const batch: GradingRecord[] = this.selectedStudents.map(student => {
      const evals = this.multiEvaluations
        .filter(m => m.studentId === student.id)
        .map(m => ({
          techniqueId: m.techniqueId,
          rating: m.rating,
          comment: m.comment
        }));
      const final = this.finalDecisions[student.id];
      return {
        id: '', // backend will generate
        studentId: student.id,
        examinerId: this.instructor!.id,
        clubId: this.instructor!.clubId!,
        date: new Date(),
        currentBelt: student.belt,
        testingForBelt: this.belt!,
        evaluations: evals,
        overallDecision: final.decision,
        overallComment: final.comment
      };
    });

    this.service.saveGradingRecord(batch)
      .pipe(first())
      .subscribe({
        next: () => this.showModal = true,
        error: () => this.errorMessage = 'Save failed'
      });
  }

  closeModal() {
    this.showModal = false;
  }

  getEvaluation(studentId: string, techniqueId: string): { rating: 'good' | 'average' | 'bad', comment: string } {
    let evalRecord = this.multiEvaluations.find(
      m => m.studentId === studentId && m.techniqueId === techniqueId
    );
    if (!evalRecord) {
      evalRecord = {
        studentId,
        techniqueId,
        rating: 'average', // default value
        comment: ''
      };
      this.multiEvaluations.push(evalRecord);
    }
    return {rating: evalRecord.rating, comment: evalRecord.comment};
  }

  updateRating(studentId: string, techniqueId: string, rating: 'good' | 'average' | 'bad') {
    const evalRecord = this.multiEvaluations.find(
      m => m.studentId === studentId && m.techniqueId === techniqueId
    );
    if (evalRecord) {
      evalRecord.rating = rating;
    } else {
      this.multiEvaluations.push({studentId, techniqueId, rating, comment: ''});
    }
  }

  updateComment(studentId: string, techniqueId: string, event: Event) {
    const input = event.target as HTMLInputElement;
    const comment = input.value;
    const evalRecord = this.multiEvaluations.find(
      m => m.studentId === studentId && m.techniqueId === techniqueId
    );
    if (evalRecord) {
      evalRecord.comment = comment;
    } else {
      this.multiEvaluations.push({studentId, techniqueId, rating: 'average', comment});
    }
  }

  addStudent(student: User) {
    if (!this.selectedStudents.some(s => s.id === student.id)) {
      this.selectedStudents.push(student);
      this.finalDecisions[student.id] = {decision: 'pass', comment: ''};
    }
    this.studentSearchTerm = '';
    this.filteredStudents = [];
  }

  removeStudent(studentId: string) {
    this.selectedStudents = this.selectedStudents.filter(s => s.id !== studentId);
    delete this.finalDecisions[studentId];
    this.multiEvaluations = this.multiEvaluations.filter(e => e.studentId !== studentId);
  }

  filterStudents() {
    const term = this.studentSearchTerm.toLowerCase();
    this.filteredStudents = this.allStudents.filter(student =>
      `${student.firstName} ${student.lastName}`.toLowerCase().includes(term) &&
      !this.selectedStudents.some(s => s.id === student.id)
    );
  }

  onBeltChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value as Belt;
    this.belt = value;
    this.loadTechniquesForBelt(this.belt);
  }

  loadTechniquesForBelt(belt: Belt) {
    this.service.getTechniquesForBelt(belt)
      .pipe(first())
      .subscribe(techs => {
        this.techniques = {
          kihon: techs.filter(t => t.category === 'kihon'),
          kata: techs.filter(t => t.category === 'kata'),
          kumite: techs.filter(t => t.category === 'kumite')
        };
      });
  }

}
