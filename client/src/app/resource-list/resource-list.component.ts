import { Component, OnInit } from '@angular/core';
import { Resource } from '../model/resource';
import { FormsModule } from '@angular/forms';
import { NgForOf, AsyncPipe, NgSwitch, NgSwitchCase, NgSwitchDefault} from '@angular/common';
import { Chart, registerables } from 'chart.js';
import {ServiceService} from '../services/service.service';
import {first, Observable} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
Chart.register(...registerables);

@Component({
  selector: 'app-resource-list',
  standalone: true,
  imports: [FormsModule, NgForOf, AsyncPipe, NgSwitch, NgSwitchCase, NgSwitchDefault],
  templateUrl: './resource-list.component.html',
  styleUrls: ['./resource-list.component.scss']
})
export class ResourceListComponent implements OnInit {
  filteredResources$!: Observable<Resource[]>;
  private clubId!:string | undefined
  constructor(private serviceService: ServiceService, private route: ActivatedRoute,private sanitizer: DomSanitizer
  ) {}

  // ngOnInit & deleteResource implementations
  ngOnInit(): void {
    // this.clubId = this.route.snapshot.paramMap.get('clubId')!;
    this.clubId = this.serviceService.getLoggedInUserValue()?.clubId;
    this.load();
  }


  load() {
    this.filteredResources$ = this.serviceService.getResourcesByClub(this.clubId);
  }

  deleteResource(id: string): void {
    this.serviceService.deleteResourceAndRefresh(id).pipe(first())
      .subscribe(() => this.load());
  }

  getSafeUrl(r: Resource): SafeResourceUrl {
    const dataUrl = `data:${r.contentType};base64,${r.base64Data}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(dataUrl);
  }

}
