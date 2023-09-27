import { Label } from "./Label";

export interface Note {
  id: number;
  title: string;
  content: string;
  isArchived: boolean;
  showDropdown?: boolean;
  showLabelDropdown?: boolean;
  isHidden?: boolean;
  isMoreIconClicked: boolean;
  noteExist: boolean;
  labels: Label[];

}
