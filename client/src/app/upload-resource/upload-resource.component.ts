import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';
import {Resource} from '../model/resource';
import {Router} from '@angular/router';
import {ServiceService} from '../services/service.service';

@Component({
  selector: 'app-upload-resource',
  standalone: true,
  imports: [FormsModule, NgForOf],
  templateUrl: './upload-resource.component.html',
  styleUrls: ['./upload-resource.component.scss']
})
export class UploadResourceComponent {
  title = '';
  description = '';
  category = 'Syllabus';
  categories = ['Syllabus', 'SeminarVideo', 'PDF', 'Other'];
  uploadedFile: File | null = null;

  constructor(
    private serviceService: ServiceService,
    private router: Router
  ) {
  }

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
    if (!this.uploadedFile) {
      alert('Please select a file.');
      return;
    }
    try {
      // this.serviceService.createAndAddResource({
      //   title: this.title,
      //   description: this.description,
      //   category: this.category,
      //   uploadedFile: this.uploadedFile,
      // });
      this.router.navigate(['/resource-list']);
    } catch (e: any) {
      alert(e.message);
    }
  }
}
