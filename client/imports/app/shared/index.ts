import { DisplayNamePipe } from './display-name.pipe';
import { RsvpPipe } from "./rsvp.pipe";
import { DisplayMainImagePipe } from "./display-main-image.pipe";
import { PositionFormatterPipe } from "./players-list.pipe"

export const SHARED_DECLARATIONS: any[] = [
  DisplayNamePipe,
  RsvpPipe,
  DisplayMainImagePipe,
  PositionFormatterPipe
];
