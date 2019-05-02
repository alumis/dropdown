import { IAttributes } from '@alumis/observables-dom';
import { AlumisDropdown } from './AlumisDropdown';

declare module '@alumis/observables-dom' {

    export interface IAttributes {

        dropdown?: AlumisDropdown;
    }
}