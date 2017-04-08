import { DisplayNamePipe } from "./display-name.pipe";
import { DisplayOwnerNamePipe } from "./display-owner-name.pipe";
import { RsvpPipe } from "./rsvp.pipe";
import { DisplayMainImagePipe } from "./display-main-image.pipe";
import { PositionFormatterPipe } from "./players-list.pipe";
import { MessageBox } from "./messagebox";

export const SHARED_DECLARATIONS: any[] = [
  DisplayNamePipe,
  DisplayOwnerNamePipe,
  RsvpPipe,
  DisplayMainImagePipe,
  PositionFormatterPipe,
  MessageBox
];
