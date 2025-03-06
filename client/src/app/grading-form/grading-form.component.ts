import {Component, OnInit} from '@angular/core';
import {Instructor, Student, User} from '../model/user';
import {Belt} from '../model/belt';
import {Technique} from '../model/technique';
import {Role} from '../model/role';
import {SyllabusMap} from '../model/SyllabusMap';
import {GradingRecord} from '../model/grading-record';
import {FormsModule} from '@angular/forms';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {MultiStudentEvaluation} from '../model/multi-student-evaluation';
import {MockDataService} from '../mock-service/mock-data.service';
import { loadGapiInsideDOM } from 'gapi-script';

@Component({
  selector: 'app-grading-form',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
  ],
  templateUrl: './grading-form.component.html',
  styleUrl: './grading-form.component.scss'
})
export class GradingFormComponent  implements OnInit  {
  belt?: Belt;
  allStudents: Student[] = [];
  eligibleStudents: Student[] = [];
  selectedStudentIds: Set<string> = new Set();
  techniques: { kihon: Technique[]; kata: Technique[]; kumite: Technique[] } = { kihon: [], kata: [], kumite: [] };
  multiEvaluations: MultiStudentEvaluation[] = [];
  instructor?: User;
  allBelts: Belt[] = [Belt.WHITE, Belt.YELLOW, Belt.GREEN, Belt.BLUE, Belt.RED, Belt.BLACK];

  constructor(private mockDataService: MockDataService) {}

  async ngOnInit() {
    // Load instructor
    this.instructor = this.mockDataService.getLoggedInUser();
    if (!this.instructor || this.instructor.role !== Role.INSTRUCTOR) {
      console.error('No instructor is logged in!');
      return;  // Prevents execution if no instructor is found
    }
    // Load all students
    this.allStudents = this.mockDataService.getUsers().filter(user => user.role === Role.STUDENT) as Student[];

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

  async updateGoogleSheetsWithGradingData(record: GradingRecord): Promise<void> {
    const spreadsheetId = 'YOUR_SPREADSHEET_ID';
    const range = 'Sheet1!A1'; // Adjust the range as needed

    const values = [
      [record.studentId, record.examinerId, record.clubId, record.date.toISOString(), record.currentBelt, record.testingForBelt, record.overallDecision, record.overallComment]
    ];

    const body = {
      values: values
    };

    try {
      const response = await gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: spreadsheetId,
        range: range,
        valueInputOption: 'RAW',
        resource: body
      });
      console.log('Data appended to Google Sheets: ', response);
    } catch (error) {
      console.error('Error appending data to Google Sheets: ', error);
    }
  }

  onBeltChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const newBelt = target?.value as Belt;

    if (!newBelt) {
      console.error('No belt selected!');
      return;
    }
    this.belt = newBelt;

    // Load techniques categorized
    this.techniques = SyllabusMap[this.belt as keyof typeof SyllabusMap] || { kihon: [], kata: [], kumite: [] };

    // Find eligible students for this belt
    this.eligibleStudents = this.allStudents.filter(s => this.mockDataService.isEligibleForBelt(s, newBelt));
    this.selectedStudentIds.clear();
    this.buildEvaluationMatrix();
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
      for (let tech of [...this.techniques.kihon, ...this.techniques.kata, ...this.techniques.kumite]) {
        this.multiEvaluations.push({
          studentId,
          techniqueId: tech.id,
          rating: 'good',
          comment: ''
        });
      }
    }
  }

  findEvaluation(studentId: string, techniqueId: string): MultiStudentEvaluation | undefined {
    return this.multiEvaluations.find(m => m.studentId === studentId && m.techniqueId === techniqueId);
  }

  updateRating(studentId: string, techniqueId: string, rating: MultiStudentEvaluation['rating']) {
    const evaluation = this.findEvaluation(studentId, techniqueId);
    if (evaluation) {
      evaluation.rating = rating;
    }
  }

  getEvaluation(studentId: string, techniqueId: string): MultiStudentEvaluation {
    let evaluation:MultiStudentEvaluation | undefined = this.multiEvaluations.find(e => e.studentId === studentId && e.techniqueId === techniqueId);

    if (!evaluation) {
      // Create a default evaluation if not found
      evaluation = { studentId, techniqueId, rating: 'average', comment: '' };
      this.multiEvaluations.push(evaluation);
    }

    return evaluation;
  }
  updateComment(studentId: string, techniqueId: string,event:Event) {
    const inputElement = event.target as HTMLInputElement;
    if (!inputElement) return;
    const evaluation = this.getEvaluation(studentId, techniqueId);
    evaluation.comment = inputElement.value;
  }


  async submitGrading() {
    if (!this.instructor || !this.belt) return;

    this.selectedStudentIds.forEach(async studentId => {
      const student = this.allStudents.find(s => s.id === studentId);
      if (!student) return;

      const filteredEvals = this.multiEvaluations.filter(m => m.studentId === studentId);

      const record: GradingRecord = {
        id: this.generateId(),
        studentId,
        examinerId: this.instructor?.id ?? 'Unknown',
        clubId: student.clubId,
        date: new Date(),
        currentBelt: student.belt,
        testingForBelt: this.belt ?? Belt.WHITE, // Fallback to WHITE belt
        evaluations: filteredEvals.map(f => ({
          techniqueId: f.techniqueId,
          rating: f.rating,
          comment: f.comment
        })),
        overallDecision: 'pass', // This can be determined by further logic.
        overallComment: 'Batch Grading'
      };

      this.mockDataService.saveGradingRecord(record);
      await this.updateGoogleSheetsWithGradingData(record);
    });

    // Clear selection after grading
    this.selectedStudentIds.clear();
    this.multiEvaluations = [];
  }

  private generateId() {
    return 'GR-' + Math.floor(Math.random() * 100000);
  }
}
