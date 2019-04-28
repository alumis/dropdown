import { AlumisDropdown } from "./AlumisDropdown";
import { AlumisDropdownAttributes } from "./AlumisDropdownAttributes";

export abstract class AlumisOrderedDropdown extends AlumisDropdown {

    constructor(attrs: AlumisDropdownAttributes, children: any[]) {

        super('ol', attrs, children);
    }
}