import {Component, OnInit} from '@angular/core';
import {Resource} from '../model/resource';
import {MockDataService} from '../mock-service/mock-data.service';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-resource-list',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    NgForOf
  ],
  templateUrl: './resource-list.component.html',
  styleUrl: './resource-list.component.scss'
})
export class ResourceListComponent implements OnInit{
  resources: Resource[] = [];
  filteredResources: Resource[] = [];
  categories: string[] = ['All', 'Syllabus', 'SeminarVideo', 'PDF', 'Other'];
  selectedCategory: string = 'All';

  constructor(private mockData: MockDataService) {}

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
