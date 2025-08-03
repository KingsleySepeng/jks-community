import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';
import {Resource} from '../model/resource';
import {Router} from '@angular/router';
import {ServiceService} from '../services/service.service';
import {first} from 'rxjs';

@Component({
  selector: 'app-upload-resource',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './upload-resource.component.html',
  styleUrls: ['./upload-resource.component.scss']
})
export class UploadResourceComponent {
  title = '';
  description = '';
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

  // upload-resource.component.ts (key bits)
  onUploadResource(): void {
    const clubId = this.serviceService.getLoggedInUserValue()?.clubId!;
    this.serviceService.createResource({
      clubId,
      title: this.title,
      description: this.description,
      file: this.uploadedFile!
    }).subscribe(() => this.router.navigate(['/resource-list', { clubId }]));
  }



}
