import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PlantService } from '../../services/plant.service';
import { Plant } from '../../models/plant';
import { RouterModule } from '@angular/router';
import { CardComponent } from "../card/card.component";
import { BehaviorSubject, catchError, Observable, of, Subject, takeUntil, tap } from 'rxjs';
import { CommonModule } from '@angular/common';

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
  private destroy$ = new Subject<void>();
  plantList$: Observable<Plant[]> = this.plantSubject.asObservable();
  errorMessage$ = new BehaviorSubject<string>('');
  hasMoreResults = false;

  constructor() { }

  ngOnInit(): void {
    this.plantService.resetPagination();
    this.loadPlants();
  }

  loadPlants(): void {
    this.plantService.getPlantList().pipe(
      tap((data) => {
        // Check if there are more results to load
        this.hasMoreResults = !!data.next;
        this.errorMessage$.next('');

        // Update the list of plants
        const currentPlants = this.plantSubject.value;
        this.plantSubject.next([...currentPlants, ...data.results])
      }),
      catchError((error) => {
        this.errorMessage$.next(error.message);
        return of({ results: [], next: null });
      }),
      takeUntil(this.destroy$)
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
