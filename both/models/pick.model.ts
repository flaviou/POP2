import { CollectionObject } from './collection-object.model';

export interface Pick extends CollectionObject {
  name: string;
  owner: string;
  public: boolean;
  players?: string[];
  cost?: number;
  points?: TeamPoints; 
}

interface TeamPoints {
  Goals: number;
  Assists: number;
  Points: number;
}
