import { Label } from "./Label";

export interface Note {
    id: number;
    title: string;
    content: string;
    isArchived: boolean;
    showDropdown: boolean;
    showLabelDropdown: boolean;
    labels: Label[];
}
