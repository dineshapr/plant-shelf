import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantDetailsComponent } from './plant-details.component';
import { PlantService } from '../../services/plant.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Plant } from '../../models/plant';

describe('PlantDetailsComponent', () => {
  let component: PlantDetailsComponent;
  let fixture: ComponentFixture<PlantDetailsComponent>;
  let plantServiceMock: jasmine.SpyObj<PlantService>;
  let activatedRouteMock: any;

  const mockPlant: Plant = {
    id: 1,
    name: 'Fern',
    description: 'A lush, green plant.',
  };


  beforeEach(async () => {
    plantServiceMock = jasmine.createSpyObj('PlantService', ['getPlantById']);

    activatedRouteMock = {
      paramMap: of({ get: (key: string) => '1' })
    };

    await TestBed.configureTestingModule({
      imports: [PlantDetailsComponent, HttpClientTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: PlantService, useValue: plantServiceMock },
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PlantDetailsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load plant details on initialization', () => {
    plantServiceMock.getPlantById.and.returnValue(of(mockPlant));

    fixture.detectChanges();

    component.plant$.subscribe((plant) => {
      expect(plant).toEqual(mockPlant);
    });
    expect(plantServiceMock.getPlantById).toHaveBeenCalledWith(1); // <-- use number, not string
  });

  it('should handle errors when loading plant details', () => {
    const errorMessage = 'Failed to load plant details';
    plantServiceMock.getPlantById.and.returnValue(throwError({ message: errorMessage }));

    fixture.detectChanges();

    component.errorMessage$.subscribe((error) => {
      expect(error).toBe(errorMessage);
    });
  })


});
