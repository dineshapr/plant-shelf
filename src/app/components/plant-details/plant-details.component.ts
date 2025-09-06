import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, switchMap } from 'rxjs';
import { Plant } from '../../models/plant';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PlantService } from '../../services/plant.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-plant-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './plant-details.component.html',
  styleUrl: './plant-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlantDetailsComponent {
  private plantService = inject(PlantService);
  plant$!: Observable<Plant>;
  errorMessage$ = new BehaviorSubject<string>('');

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.plant$ = this.route.paramMap.pipe(
      switchMap((params) => {
        // Extract the plant ID from route parameters
        const id = params.get('id');
        if (!id) {
          this.errorMessage$.next('Invalid plant ID');
          return of(null as any);
        }
        return this.plantService.getPlantById(+id).pipe(
          catchError((error) => {
            this.errorMessage$.next('Failed to load plant details');
            return of(null as any);
          })
        );
      })
    );
  }
}
