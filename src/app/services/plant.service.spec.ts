import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PlantService } from './plant.service';
import { PlantListResponse } from '../models/plant-list-response';
import { Plant } from '../models/plant';

describe('PlantService', () => {
  let service: PlantService;
  let httpMock: HttpTestingController;

  const apiUrl = 'https://sg666zbdmf.execute-api.us-east-1.amazonaws.com/dev';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PlantService]
    });

    service = TestBed.inject(PlantService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch plant list with pagination', () => {
    const mockResponse: PlantListResponse = {
      count: 2,
      next: 'next-page-url',
      results: [
        { id: 1, name: 'Rose' } as Plant,
        { id: 2, name: 'Tulip' } as Plant
      ]
    };

    service.getPlantList().subscribe((res) => {
      expect(res.count).toBe(2);
      expect(res.results.length).toBe(2);
      expect(res.results[0].name).toBe('Rose');
    });

    // Verify request URL includes offset and limit
    const req = httpMock.expectOne(`${apiUrl}?offset=0&limit=10`);
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

  it('should fetch plant by id', () => {
    const mockPlant: Plant = { id: 1, name: 'Rose' } as Plant;

    service.getPlantById(1).subscribe((res) => {
      expect(res).toEqual(mockPlant);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPlant);
  });

  it('should increment offset after calling getPlantList', () => {
    const mockResponse: PlantListResponse = {
      count: 0,
      next: null,
      results: []
    };

    service.getPlantList().subscribe();
    httpMock.expectOne(`${apiUrl}?offset=0&limit=10`).flush(mockResponse);

    service.getPlantList().subscribe();
    httpMock.expectOne(`${apiUrl}?offset=10&limit=10`).flush(mockResponse);
  });

  it('should reset pagination', () => {
    const mockResponse: PlantListResponse = { count: 0, next: null, results: [] };

    // First call increments offset
    service.getPlantList().subscribe();
    httpMock.expectOne(`${apiUrl}?offset=0&limit=10`).flush(mockResponse);

    // Reset pagination
    service.resetPagination();

    service.getPlantList().subscribe();
    httpMock.expectOne(`${apiUrl}?offset=0&limit=10`).flush(mockResponse);
  });

  it('should handle error when getPlantList fails', (done) => {
    service.getPlantList().subscribe({
      next: () => fail('Expected an error, not data'),
      error: (err) => {
        expect(err.status).toBe(500);
        done();
      }
    });

    const req = httpMock.expectOne(`${apiUrl}?offset=0&limit=10`);
    req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
  });

  it('should handle error when getPlantById fails', (done) => {
    service.getPlantById(123).subscribe({
      next: () => fail('Expected an error, not data'),
      error: (err) => {
        expect(err.status).toBe(404);
        done();
      }
    });

    const req = httpMock.expectOne(`${apiUrl}/123`);
    req.flush('Not Found', { status: 404, statusText: 'Not Found' });
  });
});
