import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgForOf } from '@angular/common';
import { Resource } from '../model/resource';
import { Router } from '@angular/router';
import { MockDataService } from '../mock-service/mock-data.service';
import {ServiceService} from '../services/service.service';

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
  fileUrl: string = '';
  videoUrl: string = '';
  category: string = 'Syllabus';
  categories = ['Syllabus', 'SeminarVideo', 'PDF', 'Other'];
  uploadedFile: File | null = null;

  constructor(
    private serviceService: ServiceService,
    private router: Router
  ) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.uploadedFile = input.files?.[0] ?? null;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer?.files?.length) {
      this.uploadedFile = event.dataTransfer.files[0];
    }
  }

  onUploadResource(): void {
    const loggedInUser = this.serviceService.getLoggedInUserValue();
    if (!loggedInUser || !loggedInUser.clubId) {
      alert('Only instructors with a club can upload resources.');
      return;
    }

    const isVideo = this.uploadedFile?.type.startsWith('video/');
    const isPdf = this.uploadedFile?.type === 'application/pdf';

    const newResource: Resource = {
      id: this.generateId(),
      title: this.title || this.uploadedFile?.name || 'Untitled',
      description: this.description,
      category: this.category,
      fileUrl: isPdf ? URL.createObjectURL(this.uploadedFile!) : '',
      videoUrl: isVideo ? URL.createObjectURL(this.uploadedFile!) : '',
      dateCreated: new Date(),
      clubId: loggedInUser.clubId,
    };

    this.serviceService.addResource(newResource);
    this.router.navigate(['/resource-list']);
  }


  private generateId(): string {
    return 'RES-' + Math.floor(Math.random() * 100000);
  }
}
