import { CollectionObject } from './collection-object.model';

export interface Pick extends CollectionObject {
  name: string;
  owner: string;
  public: boolean;
  players?: string[];
  RegularSeason: TeamPoints;
  Playoffs: TeamPoints; 
}

interface TeamPoints {
  Goals: number;
  Assists: number;
  Points: number;
}
