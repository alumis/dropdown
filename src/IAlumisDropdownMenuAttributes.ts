import { IAttributes } from "@alumis/observables-dom";
import { IAlumisDropdownMenuAnimator } from "./IAlumisDropdownMenuAnimator";
import { DropdownMenuPlacement } from "./DropdownMenuPlacement";

export interface IAlumisDropdownMenuAttributes extends IAttributes {

    placement?: DropdownMenuPlacement;
    animator?: IAlumisDropdownMenuAnimator;
}