import { Attributes } from "@alumis/observables-dom";
import { Observable } from "@alumis/observables";
import { IAlumisDropdownAnimator } from "./IAlumisDropdownAnimator";
import { Placement } from "popper.js";

export interface IAlumisDropdownAttributes extends Attributes {

    show: boolean | Observable<boolean> | (() => boolean);
    placement: Placement;
    animator: IAlumisDropdownAnimator;
    animate: boolean;
}