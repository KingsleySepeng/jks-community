import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Resource } from '../model/resource';
import { MockDataService } from '../mock-service/mock-data.service';
import { FormsModule } from '@angular/forms';
import { NgIf, NgForOf } from '@angular/common';
import {gapi, loadGapiInsideDOM} from 'gapi-script';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-resource-list',
  standalone: true,
  imports: [FormsModule, NgIf, NgForOf],
  templateUrl: './resource-list.component.html',
  styleUrls: ['./resource-list.component.scss']
})
export class ResourceListComponent implements OnInit {
  resources: Resource[] = [];
  filteredResources: Resource[] = [];
  categories: string[] = ['All', 'Syllabus', 'SeminarVideo', 'PDF', 'Other', 'GoogleDrive'];
  selectedCategory: string = 'All';

  constructor(private mockData: MockDataService) {
  }

  ngOnInit(): void {
    this.resources = this.mockData.getAllResources();
    this.filteredResources = [...this.resources];
  }

  onCategoryChange() {
    if (this.selectedCategory === 'All') {
      this.filteredResources = [...this.resources];
    } else {
      this.filteredResources = this.resources.filter(r => r.category === this.selectedCategory);
    }
  }
}
