import { Plant } from "./plant";

export interface PlantListResponse {
    count: number;
    next?: string | null;
    previous?: string | null;
    results: Plant[];
}
