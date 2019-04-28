import { AlumisDropdown } from "./AlumisDropdown";
import { AlumisDropdownAttributes } from "./AlumisDropdownAttributes";

export abstract class AlumisUnorderedDropdown extends AlumisDropdown {

    constructor(attrs: AlumisDropdownAttributes, children: any[]) {

        super('ul', attrs, children);
    }
}