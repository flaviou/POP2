import { CollectionObject } from './collection-object.model';

export interface Team extends CollectionObject {
  name: string;
  teamID: string;
  competion: string;
}
