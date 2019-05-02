import { Component, IAttributes, createNode } from '@alumis/observables-dom';

export abstract class AlumisDropdownItem extends Component<HTMLElement> {

    constructor(attrs: IAttributes, children: any[]) {

        super();

        this.node = createNode('li', attrs, children);
    }
}