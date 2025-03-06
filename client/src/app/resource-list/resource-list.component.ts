import {Component, OnInit} from '@angular/core';
import {Resource} from '../model/resource';
import {MockDataService} from '../mock-service/mock-data.service';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import { loadGapiInsideDOM } from 'gapi-script';

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

  async ngOnInit(): Promise<void> {
    this.resources = this.mockData.getAllResources();
    this.filteredResources = [...this.resources];
    await this.initializeGapiClient();
    await this.fetchResourcesFromGoogleDrive();
  }

  async initializeGapiClient(): Promise<void> {
    await loadGapiInsideDOM();
    gapi.load('client:auth2', async () => {
      await gapi.client.init({
        apiKey: 'YOUR_API_KEY',
        clientId: 'YOUR_CLIENT_ID',
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
        scope: 'https://www.googleapis.com/auth/drive.readonly'
      });
    });
  }

  async fetchResourcesFromGoogleDrive(): Promise<void> {
    try {
      const response = await gapi.client.drive.files.list({
        q: "'YOUR_FOLDER_ID' in parents",
        fields: 'files(id, name, mimeType, webViewLink, createdTime)'
      });

      const files = response.result.files;
      if (files && files.length > 0) {
        files.forEach(file => {
          const newResource: Resource = {
            id: file.id,
            title: file.name,
            description: '',
            fileUrl: file.webViewLink,
            category: 'GoogleDrive',
            dateCreated: new Date(file.createdTime)
          };
          this.resources.push(newResource);
        });
        this.filteredResources = [...this.resources];
      }
    } catch (error) {
      console.error('Error fetching resources from Google Drive: ', error);
    }
  }

  onCategoryChange() {
    if (this.selectedCategory === 'All') {
      this.filteredResources = [...this.resources];
    } else {
      this.filteredResources = this.resources.filter(r => r.category === this.selectedCategory);
    }
  }
}
