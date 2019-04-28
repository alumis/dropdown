import { globalAttrHandlers } from '@alumis/observables-dom';
import { AlumisDropdown } from './AlumisDropdown';
import { IAlumisButtonAttributes } from '@alumis/button';
import './IAlumisButtonAttributes';

export function bindDropdown(node: HTMLDivElement, dropdown: AlumisDropdown, attrs: IAlumisButtonAttributes) {

    let dropdownOnHover: boolean;
    let dropdownOnClickOutside: boolean;

    if (attrs) {
        
        dropdownOnHover = attrs.dropdownOnHover;
        dropdownOnClickOutside = attrs.dropdownCloseOnClickOutside;

        delete attrs.dropdownOnHover;
        delete attrs.dropdownCloseOnClickOutside;
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
}

var toggleElementsOfDropdown = new Map<AlumisDropdown, HTMLDivElement>();

var isClickedOutsideEventHandlerAttached = false;
var dropdownsToCloseOnClickOutsideSet = new Set<AlumisDropdown>();

function clickedOutsideEventHandler(event: Event) {

    for (let dropdown of dropdownsToCloseOnClickOutsideSet) {

        dropdown.showAsObservable.value = false;

        let toggleElement = toggleElementsOfDropdown.get(dropdown);
        toggleElement.setAttribute('aria-expanded', 'false');
    }
}

function mouseEnterEventHandler(event: Event, dropdown: AlumisDropdown) {

    dropdown.showAsObservable.value = true;

    let toggleElement = toggleElementsOfDropdown.get(dropdown);
    toggleElement.setAttribute('aria-expanded', 'true');
}

function mouseLeaveEventHandler(event: Event, dropdown: AlumisDropdown) {

    dropdown.showAsObservable.value = false;

    let toggleElement = toggleElementsOfDropdown.get(dropdown);
    toggleElement.setAttribute('aria-expanded', 'false');
}

function clickEventHandler(event: Event, dropdown: AlumisDropdown) {

    dropdown.showAsObservable.value = !dropdown.showAsObservable.value;

    let toggleElement = toggleElementsOfDropdown.get(dropdown);
    toggleElement.setAttribute('aria-expanded',  dropdown.showAsObservable.value + '');
}

globalAttrHandlers.set('dropdown', bindDropdown);