import { IAlumisButtonAttributes } from '@alumis/button';

declare module '@alumis/button' {

    export interface IAlumisButtonAttributes {

        dropdownonhover?: boolean;
        dropdowncloseonclickoutside?: boolean;
    }
}