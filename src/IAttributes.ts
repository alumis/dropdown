import { IAttributes } from '@alumis/observables-dom';
import { AlumisDropdownMenu } from './AlumisDropdownMenu';

declare module '@alumis/observables-dom' {

    export interface IAttributes {

        dropdownmenu?: AlumisDropdownMenu;
    }
}