import { AlumisDropdown } from "./AlumisDropdown";
import { IAlumisDropdownAttributes } from "./IAlumisDropdownAttributes";

export abstract class AlumisUnorderedDropdown extends AlumisDropdown {

    constructor(attrs: IAlumisDropdownAttributes, children: any[]) {

        super('ul', attrs, children);
    }
}