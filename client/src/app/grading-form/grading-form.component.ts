import { Component, OnInit } from '@angular/core';
import { Student, User } from '../model/user';
import { Belt } from '../model/belt';
import { Technique } from '../model/technique';
import { SyllabusMap } from '../model/SyllabusMap';
import { GradingRecord } from '../model/grading-record';
import { MultiStudentEvaluation } from '../model/multi-student-evaluation';
import { MockDataService } from '../mock-service/mock-data.service';
import { Role } from '../model/role';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { loadGapiInsideDOM } from 'gapi-script';
declare var gapi: any;

@Component({
  selector: 'app-grading-form',
  standalone: true,
  imports: [FormsModule, NgForOf, NgIf],
  templateUrl: './grading-form.component.html',
  styleUrls: ['./grading-form.component.scss']
})
export class GradingFormComponent implements OnInit {
  belt?: Belt;
  allStudents: Student[] = [];
  selectedStudents: Student[] = [];
  studentSearchTerm: string = '';
  filteredStudents: Student[] = [];
  techniques: { kihon: Technique[]; kata: Technique[]; kumite: Technique[] } = { kihon: [], kata: [], kumite: [] };
  multiEvaluations: MultiStudentEvaluation[] = [];
  instructor?: User;
  allBelts: Belt[] = [Belt.WHITE, Belt.YELLOW, Belt.GREEN, Belt.BLUE, Belt.RED, Belt.BLACK];
  showModal: boolean = false;
  public categories: Array<'kihon' | 'kata' | 'kumite'> = ['kihon', 'kata', 'kumite'];

  // New property: Final decisions per student
  finalDecisions: { [studentId: string]: { decision: 'pass' | 'fail' | 'regrade'; comment: string } } = {};

  constructor(private mockDataService: MockDataService) {}

  async ngOnInit() {
    // Load instructor and students.
    this.instructor = this.mockDataService.getLoggedInUser();
    if (!this.instructor || !this.instructor.roles.includes(Role.INSTRUCTOR)) {
      console.error('No instructor is logged in!');
      return;
    }
    this.allStudents = this.mockDataService.getUsers().filter(user => user.roles.includes(Role.STUDENT) ) as Student[];
    await this.initializeGapiClient();
  }

  async initializeGapiClient(): Promise<void> {
    await loadGapiInsideDOM();
    gapi.load('client:auth2', async () => {
      await gapi.client.init({
        apiKey: 'YOUR_API_KEY',
        clientId: 'YOUR_CLIENT_ID',
        discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
        scope: 'https://www.googleapis.com/auth/spreadsheets'
      });
    });
  }

  onBeltChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const newBelt = target?.value as Belt;
    if (!newBelt) {
      console.error('No belt selected!');
      return;
    }
    this.belt = newBelt;
    // Load techniques for the selected belt.
    this.techniques = SyllabusMap[this.belt as keyof typeof SyllabusMap] || { kihon: [], kata: [], kumite: [] };
    this.buildEvaluationMatrix();
  }

  filterStudents() {
    const term = this.studentSearchTerm.toLowerCase();
    this.filteredStudents = this.allStudents.filter(student =>
      (student.firstName.toLowerCase().includes(term) || student.lastName.toLowerCase().includes(term))
      && !this.selectedStudents.some(s => s.id === student.id)
    );
  }

  addStudent(student: Student) {
    this.selectedStudents.push(student);
    // Initialize final decision for the new student.
    this.finalDecisions[student.id] = { decision: 'pass', comment: '' };
    // Clear search input and suggestions.
    this.studentSearchTerm = '';
    this.filteredStudents = [];
    this.buildEvaluationMatrix();
  }

  removeStudent(studentId: string) {
    this.selectedStudents = this.selectedStudents.filter(s => s.id !== studentId);
    delete this.finalDecisions[studentId];
    this.buildEvaluationMatrix();
  }

  buildEvaluationMatrix() {
    this.multiEvaluations = [];
    for (let student of this.selectedStudents) {
      for (let tech of [...this.techniques.kihon, ...this.techniques.kata, ...this.techniques.kumite]) {
        this.multiEvaluations.push({
          studentId: student.id,
          techniqueId: tech.id,
          rating: 'good',
          comment: ''
        });
      }
    }
  }

  getEvaluation(studentId: string, techniqueId: string): MultiStudentEvaluation {
    let evaluation = this.multiEvaluations.find(e => e.studentId === studentId && e.techniqueId === techniqueId);
    if (!evaluation) {
      evaluation = { studentId, techniqueId, rating: 'average', comment: '' };
      this.multiEvaluations.push(evaluation);
    }
    return evaluation;
  }

  updateRating(studentId: string, techniqueId: string, rating: MultiStudentEvaluation['rating']) {
    const evaluation = this.getEvaluation(studentId, techniqueId);
    evaluation.rating = rating;
  }

  updateComment(studentId: string, techniqueId: string, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const evaluation = this.getEvaluation(studentId, techniqueId);
    evaluation.comment = inputElement.value;
  }

  async updateGoogleSheetsWithGradingData(record: GradingRecord): Promise<void> {
    const spreadsheetId = 'YOUR_SPREADSHEET_ID';
    const range = 'Sheet1!A1';
    const values = [
      [record.studentId, record.examinerId, record.clubId, record.date.toISOString(), record.currentBelt, record.testingForBelt, record.overallDecision, record.overallComment]
    ];
    const body = { values };
    try {
      await gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        resource: body
      });
      console.log('Data appended to Google Sheets: ', record);
    } catch (error) {
      console.error('Error appending data to Google Sheets: ', error);
    }
  }

  async submitGrading() {
    if (!this.instructor || !this.belt) return;

    // Iterate over each selected student.
    for (let student of this.selectedStudents) {
      const filteredEvals = this.multiEvaluations.filter(m => m.studentId === student.id);
      const finalDecisionForStudent = this.finalDecisions[student.id] || { decision: 'pass', comment: '' };

      const record: GradingRecord = {
        id: this.generateId(),
        studentId: student.id,
        examinerId: this.instructor.id,
        clubId:'',
        date: new Date(),
        currentBelt: student.belt,
        testingForBelt: this.belt,
        evaluations: filteredEvals.map(f => ({
          techniqueId: f.techniqueId,
          rating: f.rating,
          comment: f.comment
        })),
        overallDecision: finalDecisionForStudent.decision,
        overallComment: finalDecisionForStudent.comment
      };
      this.mockDataService.saveGradingRecord(record);
      await this.updateGoogleSheetsWithGradingData(record);
    }
    // Clear selections and evaluations after submission.
    this.selectedStudents = [];
    this.multiEvaluations = [];
    this.finalDecisions = {};
    // Show submission confirmation modal.
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  private generateId() {
    return 'GR-' + Math.floor(Math.random() * 100000);
  }
}
