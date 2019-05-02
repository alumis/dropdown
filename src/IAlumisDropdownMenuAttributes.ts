import { IAttributes } from "@alumis/observables-dom";
import { Observable } from "@alumis/observables";
import { IAlumisDropdownMenuAnimator } from "./IAlumisDropdownMenuAnimator";
import { Placement } from "popper.js";

export interface IAlumisDropdownMenuAttributes extends IAttributes {

    show: boolean | Observable<boolean> | (() => boolean);
    placement?: Placement;
    animator?: IAlumisDropdownMenuAnimator;
}