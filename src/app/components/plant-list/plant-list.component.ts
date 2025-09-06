import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { PlantService } from '../../core/services/plant.service';
import { Plant } from '../../models/plant';
import { RouterModule } from '@angular/router';
import { CardComponent } from '../card/card.component';
import { BehaviorSubject, catchError, Observable, of, Subject, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PlantListResponse } from '../../models/plant-list-response';

@Component({
  selector: 'app-plant-list',
  standalone: true,
  imports: [RouterModule, CardComponent, CommonModule],
  templateUrl: './plant-list.component.html',
  styleUrl: './plant-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlantListComponent {
  private plantService = inject(PlantService);
  private plantSubject = new BehaviorSubject<Plant[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private destroy$ = new Subject<void>();
  plantList$: Observable<Plant[]> = this.plantSubject.asObservable();
  errorMessage$ = new BehaviorSubject<string>('');
  loading$ = this.loadingSubject.asObservable();
  hasMoreResults = false;

  constructor() { }

  ngOnInit(): void {
    this.plantService.resetPagination();
    this.loadPlants();
  }

  loadPlants(): void {
    this.loadingSubject.next(true);
    this.plantService.getPlantList().pipe(
      tap((data) => {
        this.hasMoreResults = !!data.next; // Check if there are more results
        this.errorMessage$.next('');
        const currentPlants = this.plantSubject.value; // Get current list of plants
        this.plantSubject.next([...currentPlants, ...data.results]); // Append new plants to the list
        this.loadingSubject.next(false);
      }),
      catchError((error) => {
        this.errorMessage$.next(error.message);
        this.loadingSubject.next(false);
        return of({ count: 0, results: [], next: null, previous: null } as PlantListResponse);
      })
    ).subscribe();
  }

  // preventing unnecessary re-rendering of existing <app-card> components
  trackByPlantId(index: number, plant: Plant): string | number {
    return plant.id;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}



