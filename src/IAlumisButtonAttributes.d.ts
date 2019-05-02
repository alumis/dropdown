import { IAlumisButtonAttributes } from '@alumis/button';

declare module '@alumis/button' {

    export interface IAlumisButtonAttributes {

        dropdownOnHover: boolean;
        dropdownCloseOnClickOutside: boolean;    
    }
}
