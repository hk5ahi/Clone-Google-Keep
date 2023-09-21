export interface Note {
  id: number;
  title: string;
  content: string;
  isArchived: boolean;
  showDropdown?: boolean;
  isHidden?: boolean;
  isMoreIconClicked: boolean;
  noteExist:boolean;

}
