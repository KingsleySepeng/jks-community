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
  uploadedFile: File | null = null;

  constructor(
    private mockData: MockDataService,
    private router: Router
  ) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.uploadedFile = input.files?.[0] ?? null;
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onFileDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files?.length) {
      this.uploadedFile = event.dataTransfer.files[0];
    }
  }


  onUploadResource() {
    const isVideo = this.uploadedFile?.type.startsWith('video/');
    const isPdf = this.uploadedFile?.type === 'application/pdf';

    const newResource: Resource = {
      id: this.generateId(),
      title: this.title || this.uploadedFile?.name || 'Untitled',
      description: this.description,
      category: this.category,
      fileUrl: isPdf ? URL.createObjectURL(this.uploadedFile!) : '',
      videoUrl: isVideo ? URL.createObjectURL(this.uploadedFile!) : '',
      dateCreated: new Date()
    };

    this.mockData.addResource(newResource);
    this.router.navigate(['/resource-list']);
  }


  private generateId(): string {
    return 'RES-' + Math.floor(Math.random() * 100000);
  }
}
