import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Resource } from '../model/resource';
import { FormsModule } from '@angular/forms';
import {NgIf, NgForOf, AsyncPipe} from '@angular/common';
import { Chart, registerables } from 'chart.js';
import {ServiceService} from '../services/service.service';
import {Observable} from 'rxjs';
Chart.register(...registerables);

@Component({
  selector: 'app-resource-list',
  standalone: true,
  imports: [FormsModule, NgIf, NgForOf, AsyncPipe],
  templateUrl: './resource-list.component.html',
  styleUrls: ['./resource-list.component.scss']
})
export class ResourceListComponent implements OnInit {
  filteredResources$!: Observable<Resource[]>;
  categories: string[] = ['All', 'Syllabus', 'SeminarVideo', 'PDF', 'Other', 'GoogleDrive'];
  selectedCategory: string = 'All';

  constructor(private serviceService: ServiceService) {}

  ngOnInit(): void {
    // this.filteredResources$ = this.serviceService.getFilteredResources();
  }

  onCategoryChange(): void {
    // this.serviceService.setSelectedCategory(this.selectedCategory);
  }

  deleteResource(id: string): void {
    // this.serviceService.deleteResourceAndRefresh(id);
  }
}
