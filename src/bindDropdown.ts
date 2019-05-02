import { globalAttrHandlers } from '@alumis/observables-dom';
import { AlumisDropdown } from './AlumisDropdown';
import { IAlumisButtonAttributes } from '@alumis/button';

export function bindDropdown(node: HTMLElement, dropdown: AlumisDropdown<HTMLElement>, attrs: IAlumisButtonAttributes) {

    let dropdownOnHover: boolean;
    let dropdownOnClickOutside: boolean;

    if (attrs) {
        
        dropdownOnHover = attrs.dropdownonhover;
        dropdownOnClickOutside = attrs.dropdowncloseonclickoutside;

        delete attrs.dropdownonhover;
        delete attrs.dropdowncloseonclickoutside;
    }

    toggleElementsOfDropdown.set(dropdown, node);

    node.setAttribute('aria-haspopup', 'true');
    node.setAttribute('aria-expanded', 'false');    

    if (node.id)
        dropdown.node.setAttribute('aria-labelledby', node.id);
    
    if (dropdownOnHover) {

        node.addEventListener('mouseenter', mouseEnterEventHandler.bind(dropdown));
        node.addEventListener('mouseleave', mouseLeaveEventHandler.bind(dropdown));

    } else {

        node.addEventListener('click', clickEventHandler.bind(dropdown));
    }

    if (dropdownOnClickOutside) {

        if (!isClickedOutsideEventHandlerAttached) {

            document.body.addEventListener('click', clickedOutsideEventHandler);

            isClickedOutsideEventHandlerAttached = true;
        }

        dropdownsToCloseOnClickOutsideSet.add(dropdown);
    }

    dropdown.referenceElement = node;
    dropdown.initialize();
}

var toggleElementsOfDropdown = new Map<AlumisDropdown<HTMLElement>, HTMLElement>();

var isClickedOutsideEventHandlerAttached = false;
var dropdownsToCloseOnClickOutsideSet = new Set<AlumisDropdown<HTMLElement>>();

function clickedOutsideEventHandler(event: Event) {

    for (let dropdown of dropdownsToCloseOnClickOutsideSet) {

        dropdown.showAsObservable.value = false;

        let toggleElement = toggleElementsOfDropdown.get(dropdown);
        toggleElement.setAttribute('aria-expanded', 'false');
    }
}

function mouseEnterEventHandler(event: Event) {

    let dropdown = <AlumisDropdown<HTMLElement>>this;

    dropdown.showAsObservable.value = true;

    let toggleElement = toggleElementsOfDropdown.get(dropdown);
    toggleElement.setAttribute('aria-expanded', 'true');
}

function mouseLeaveEventHandler(event: Event) {

    let dropdown = <AlumisDropdown<HTMLElement>>this;

    dropdown.showAsObservable.value = false;

    let toggleElement = toggleElementsOfDropdown.get(dropdown);
    toggleElement.setAttribute('aria-expanded', 'false');
}

function clickEventHandler(event: Event) {

    let dropdown = <AlumisDropdown<HTMLElement>>this;

    dropdown.showAsObservable.value = !dropdown.showAsObservable.value;

    let toggleElement = toggleElementsOfDropdown.get(dropdown);
    toggleElement.setAttribute('aria-expanded',  dropdown.showAsObservable.value + '');
}

globalAttrHandlers.set('dropdown', bindDropdown);