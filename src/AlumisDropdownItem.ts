import { Component, Attributes, createNode } from '@alumis/observables-dom';

export abstract class AlumisDropdownItem extends Component<HTMLLIElement> {

    constructor(attrs: Attributes, children: any[]) {

        super();

        this.node = createNode('li', attrs, children);
    }
}