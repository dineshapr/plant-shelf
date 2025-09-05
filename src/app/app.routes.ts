import { Routes } from '@angular/router';
import { PlantListComponent } from './components/plant-list/plant-list.component';
import { PlantDetailsComponent } from './components/plant-details/plant-details.component';

export const routes: Routes = [
    { path: '', redirectTo: '/plants', pathMatch: 'full' },
    { path: 'plants', component: PlantListComponent },
    { path: 'plants/:id', component: PlantDetailsComponent },
    { path: '**', redirectTo: '/plants' }
];
