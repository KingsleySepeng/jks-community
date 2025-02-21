import {Component, OnInit} from '@angular/core';
import {GradingRecord} from '../model/grading-record';
import {Technique} from '../model/technique';
import {ActivatedRoute} from '@angular/router';
import {MockDataService} from '../mock-service/mock-data.service';
import {SyllabusMap} from '../model/SyllabusMap';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {User} from '../model/user';

@Component({
  selector: 'app-grading-detail',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    DatePipe
  ],
  templateUrl: './grading-detail.component.html',
  styleUrl: './grading-detail.component.scss'
})
export class GradingDetailComponent implements OnInit {
  record?: GradingRecord;
  kihon: Technique[] = [];
  kata: Technique[] = [];
  kumite: Technique[] = [];
  student?: User;
  examiner?: User;

  // Filtered Evaluations
  kihonEvals: GradingRecord['evaluations'] = [];
  kataEvals: GradingRecord['evaluations'] = [];
  kumiteEvals: GradingRecord['evaluations'] = [];

  constructor(
    private route: ActivatedRoute,
    private mockData: MockDataService
  ) {}

  ngOnInit(): void {
    const recordId = this.route.snapshot.paramMap.get('id');

    if (recordId) {
      this.record = this.mockData.getGradingRecord(recordId);

      if (this.record) {
        // Get all techniques for the belt
        const syllabus = SyllabusMap[this.record.testingForBelt as keyof typeof SyllabusMap];
        if (syllabus) {
          this.kihon = syllabus.kihon;
          this.kata = syllabus.kata;
          this.kumite = syllabus.kumite;
        }

        // Fetch student and examiner details
        this.student = this.mockData.getUserById(this.record.studentId);
        this.examiner = this.mockData.getUserById(this.record.examinerId);

        // Precompute the evaluations for each category
        this.kihonEvals = this.record.evaluations.filter(e => this.kihon.some(t => t.id === e.techniqueId));
        this.kataEvals = this.record.evaluations.filter(e => this.kata.some(t => t.id === e.techniqueId));
        this.kumiteEvals = this.record.evaluations.filter(e => this.kumite.some(t => t.id === e.techniqueId));
      }
    }
  }

  findTechniqueName(techniqueId: string): string {
    const allTechniques = [...this.kihon, ...this.kata, ...this.kumite];
    return allTechniques.find(t => t.id === techniqueId)?.name || techniqueId;
  }
}
