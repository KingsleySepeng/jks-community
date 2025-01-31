import {Component, OnInit} from '@angular/core';
import {GradingRecord} from '../model/grading-record';
import {Technique} from '../model/technique';
import {ActivatedRoute} from '@angular/router';
import {MockDataService} from '../mock-service/mock-data.service';
import {SyllabusMap} from '../model/SyllabusMap';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-grading-detail',
  standalone: true,
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './grading-detail.component.html',
  styleUrl: './grading-detail.component.scss'
})
export class GradingDetailComponent implements OnInit {
  record?: GradingRecord;
  techniques: Technique[] = [];

  constructor(
    private route: ActivatedRoute,
    private mockData: MockDataService
  ) {}

  ngOnInit(): void {
    const recordId = this.route.snapshot.paramMap.get('id');
    if (recordId) {
      this.record = this.mockData.getGradingRecord(recordId);
      if (this.record) {
        this.techniques = SyllabusMap[this.record.testingForBelt] || [];
      }
    }
  }
}
