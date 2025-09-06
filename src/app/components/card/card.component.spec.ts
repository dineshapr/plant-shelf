import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardComponent } from './card.component';
import { Plant } from '../../models/plant';
import { ActivatedRoute } from '@angular/router';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardComponent],
      providers: [
        { provide: ActivatedRoute, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    component.plant = { id: 1, name: 'Wallace-Patton', description: 'Eligendi quod eaque facere.' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept a plant input', () => {
    const testPlant: Plant = { id: 1, name: 'Wallace-Patton', description: 'Eligendi quod eaque facere.' };
    component.plant = testPlant;
    fixture.detectChanges();
    expect(component.plant).toEqual(testPlant);
  });
});
