import { globalAttrHandlers } from '@alumis/observables-dom';
import { AlumisDropdownMenu } from './AlumisDropdownMenu';
import { IAlumisButtonAttributes } from '@alumis/button';

export function bindDropdownMenu(node: HTMLElement, dropdownMenu: AlumisDropdownMenu, attrs: IAlumisButtonAttributes) {

    let dropdownOnHover: boolean;
    let dropdownOnClickOutside: boolean;

    if (attrs) {
        
        dropdownOnHover = attrs.dropdownonhover;
        dropdownOnClickOutside = attrs.dropdowncloseonclickoutside;

        delete attrs.dropdownonhover;
        delete attrs.dropdowncloseonclickoutside;
    }

    toggleElementsOfDropdown.set(dropdownMenu, node);

    node.setAttribute('aria-haspopup', 'true');
    node.setAttribute('aria-expanded', 'false');    

    if (node.id)
        dropdownMenu.node.setAttribute('aria-labelledby', node.id);
    
    if (dropdownOnHover) {

        node.addEventListener('mouseenter', mouseEnterEventHandler.bind(dropdownMenu));
        node.addEventListener('mouseleave', mouseLeaveEventHandler.bind(dropdownMenu));

    } else {

        node.addEventListener('click', clickEventHandler.bind(dropdownMenu));
    }

    if (dropdownOnClickOutside) {

        if (!isClickedOutsideEventHandlerAttached) {

            document.body.addEventListener('click', clickedOutsideEventHandler);

            isClickedOutsideEventHandlerAttached = true;
        }

        dropdownsToCloseOnClickOutsideSet.add(dropdownMenu);
    }

    dropdownMenu.referenceElement = node;
    dropdownMenu.initialize();
}

var toggleElementsOfDropdown = new Map<AlumisDropdownMenu, HTMLElement>();

var isClickedOutsideEventHandlerAttached = false;
var dropdownsToCloseOnClickOutsideSet = new Set<AlumisDropdownMenu>();

function clickedOutsideEventHandler(event: Event) {

    for (let dropdown of dropdownsToCloseOnClickOutsideSet) {

        dropdown.showAsObservable.value = false;

        let toggleElement = toggleElementsOfDropdown.get(dropdown);
        toggleElement.setAttribute('aria-expanded', 'false');
    }
}

function mouseEnterEventHandler(event: Event) {

    let dropdown = <AlumisDropdownMenu>this;

    dropdown.showAsObservable.value = true;

    let toggleElement = toggleElementsOfDropdown.get(dropdown);
    toggleElement.setAttribute('aria-expanded', 'true');
}

function mouseLeaveEventHandler(event: Event) {

    let dropdown = <AlumisDropdownMenu>this;

    dropdown.showAsObservable.value = false;

    let toggleElement = toggleElementsOfDropdown.get(dropdown);
    toggleElement.setAttribute('aria-expanded', 'false');
}

function clickEventHandler(event: Event) {

    let dropdown = <AlumisDropdownMenu>this;

    dropdown.showAsObservable.value = !dropdown.showAsObservable.value;

    let toggleElement = toggleElementsOfDropdown.get(dropdown);
    toggleElement.setAttribute('aria-expanded',  dropdown.showAsObservable.value + '');
}

globalAttrHandlers.set('dropdownmenu', bindDropdownMenu);