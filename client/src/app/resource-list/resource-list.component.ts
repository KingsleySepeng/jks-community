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
export class ResourceListComponent implements OnInit, AfterViewInit {
  resources: Resource[] = [];
  filteredResources: Resource[] = [];
  categories: string[] = ['All', 'Syllabus', 'SeminarVideo', 'PDF', 'Other', 'GoogleDrive'];
  selectedCategory: string = 'All';

  constructor(private mockData: MockDataService) {}

  async ngOnInit(): Promise<void> {
    this.resources = this.mockData.getAllResources();
    this.filteredResources = [...this.resources];
    await this.initializeGapiClient();
    await this.fetchResourcesFromGoogleDrive();
  }

  async ngAfterViewInit(): Promise<void> {
    this.createResourceChart();
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
        files.forEach((file: { id: any; name: any; webViewLink: any; createdTime: string | number | Date; }) => {
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
        this.createResourceChart();
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
    this.createResourceChart();
  }

  private createResourceChart() {
    const categoryCounts: { [key: string]: number } = {};
    // Count resources in filtered list
    this.filteredResources.forEach(res => {
      const categoryKey = res.category || 'Other';
      categoryCounts[categoryKey] = (categoryCounts[categoryKey] || 0) + 1;
    });
    const labels = Object.keys(categoryCounts);
    const data = labels.map(label => categoryCounts[label]);

    const ctx = (document.getElementById('resourceChart') as HTMLCanvasElement)?.getContext('2d');
    if (ctx) {
      // Destroy previous chart instance if exists
      if ((this as any).resourceChartInstance) {
        (this as any).resourceChartInstance.destroy();
      }
      (this as any).resourceChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
          labels,
          datasets: [{
            data,
            backgroundColor: ['#4CAF50', '#FFC107', '#2196F3', '#FF5722', '#9C27B0']
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'bottom' }
          }
        }
      });
    }
  }
}
