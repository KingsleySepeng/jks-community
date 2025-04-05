import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgForOf } from '@angular/common';
import { Resource } from '../model/resource';
import { Router } from '@angular/router';
import { MockDataService } from '../mock-service/mock-data.service';

@Component({
  selector: 'app-upload-resource',
  standalone: true,
  imports: [FormsModule, NgForOf],
  templateUrl: './upload-resource.component.html',
  styleUrls: ['./upload-resource.component.scss']
})
export class UploadResourceComponent {
  title: string = '';
  description: string = '';
  fileUrl: string = '';    // or handle actual file uploads if needed
  videoUrl: string = '';
  category: string = 'Syllabus'; // default category
  categories = ['Syllabus', 'SeminarVideo', 'PDF', 'Other'];

  constructor(
    private mockData: MockDataService,
    private router: Router
  ) {}

  onUploadResource() {
    const newResource: Resource = {
      id: this.generateId(),
      title: this.title,
      description: this.description,
      fileUrl: this.fileUrl,
      videoUrl: this.videoUrl,
      category: this.category,
      dateCreated: new Date()
    };

    this.mockData.addResource(newResource);
    // navigate to resource list or show success message
    this.router.navigate(['/resource-list']);
  }

  private generateId(): string {
    return 'RES-' + Math.floor(Math.random() * 100000);
  }
}
