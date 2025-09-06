import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { PlantListComponent } from './plant-list.component';
import { PlantService } from '../../core/services/plant.service';
import { Plant } from '../../models/plant';
import { CommonModule } from '@angular/common';

// Mock data
const mockPlants: Plant[] = [
  { id: 1, name: 'Rose' } as Plant,
  { id: 2, name: 'Tulip' } as Plant,
];

const mockResponse = {
  count: 2,
  results: mockPlants,
  next: 'page2'
};

describe('PlantListComponent', () => {
  let component: PlantListComponent;
  let fixture: ComponentFixture<PlantListComponent>;
  let plantServiceSpy: jasmine.SpyObj<PlantService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('PlantService', ['getPlantList', 'resetPagination']);

    await TestBed.configureTestingModule({
      imports: [PlantListComponent, CommonModule],
      providers: [
        { provide: PlantService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PlantListComponent);
    component = fixture.componentInstance;
    plantServiceSpy = TestBed.inject(PlantService) as jasmine.SpyObj<PlantService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call resetPagination and loadPlants on init', () => {
    plantServiceSpy.getPlantList.and.returnValue(of(mockResponse));

    component.ngOnInit();

    expect(plantServiceSpy.resetPagination).toHaveBeenCalled();
    expect(plantServiceSpy.getPlantList).toHaveBeenCalled();
  });

  it('should update plant list and hasMoreResults when service returns data', (done) => {
    plantServiceSpy.getPlantList.and.returnValue(of(mockResponse));

    component.loadPlants();

    component.plantList$.subscribe(plants => {
      expect(plants.length).toBe(2);
      expect(plants).toEqual(mockPlants);
      expect(component.hasMoreResults).toBeTrue();
      expect(component.errorMessage$.value).toBe('');
      done();
    });
  });

  it('should set errorMessage when service throws error', (done) => {
    const error = { message: 'Service failed' };
    plantServiceSpy.getPlantList.and.returnValue(throwError(() => error));

    component.loadPlants();

    setTimeout(() => {
      expect(component.errorMessage$.value).toBe('Service failed');
      done();
    });
  });

  it('should complete destroy$ on ngOnDestroy', () => {
    spyOn(component['destroy$'], 'next').and.callThrough();
    spyOn(component['destroy$'], 'complete').and.callThrough();

    component.ngOnDestroy();

    expect(component['destroy$'].next).toHaveBeenCalled();
    expect(component['destroy$'].complete).toHaveBeenCalled();
  });
});
