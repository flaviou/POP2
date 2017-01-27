import { CollectionObject } from './collection-object.model';

export interface Player extends CollectionObject {
  ID: number;
  LastName: string;
  FirstName: string;
  JerseyNumber: number;
  Position: string;
  Height: string;
  Weight: string;
  BirthDate: string;
  Age: number;
  BirthCity: string;
  BirthCountry: string;
  IsRookie: boolean;
  Team: string;
}

