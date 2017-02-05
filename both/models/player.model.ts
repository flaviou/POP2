import { CollectionObject } from './collection-object.model';

export interface Player extends CollectionObject {
  Season: string;
  ID: number;
  FirstName: string;
  LastName: string;
  JerseyNumber: number;
  Position: string;
  TeamName: string;
  RegularSeason: PlayerPoints;
  Playoffs?: PlayerPoints;
}

interface PlayerPoints {
  GamesPlayed: number;
  Goals: number;
  Assists: number;
  Points: number;
}
