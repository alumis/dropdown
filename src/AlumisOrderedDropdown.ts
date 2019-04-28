import { AlumisDropdown } from "./AlumisDropdown";
import { IAlumisDropdownAttributes } from "./IAlumisDropdownAttributes";

export abstract class AlumisOrderedDropdown extends AlumisDropdown {

    constructor(attrs: IAlumisDropdownAttributes, children: any[]) {

        super('ol', attrs, children);
    }
}