import { globalAttrHandlers, generateHTMLElementId } from '@alumis/observables-dom';
import { AlumisDropdownMenu } from './AlumisDropdownMenu';
import { IAlumisButtonAttributes } from '@alumis/button';
import { OperationCancelledError, CancellationTokenNone } from '@alumis/cancellationtoken';
import { delayAsync } from '@alumis/utils';

export function bindDropdownMenu(toggleElement: HTMLElement, dropdownMenu: AlumisDropdownMenu, attrs: IAlumisButtonAttributes) {

    let dropdownOnClickOutside: boolean;

    if (attrs) {
        
        dropdownOnClickOutside = attrs.dropdowncloseonclickoutside;
        delete attrs.dropdowncloseonclickoutside;
    }

    toggleElement.setAttribute('aria-haspopup', 'true');
    toggleElement.setAttribute('aria-expanded', 'false');    
    toggleElement.addEventListener('click', togglerClickEventHandler.bind(dropdownMenu));

    dropdownMenu.node.setAttribute('aria-labelledby', toggleElement.id || (toggleElement.id = generateHTMLElementId()));

    if (dropdownOnClickOutside) {

        if (!isClickedOutsideEventHandlerAttached) {

            document.body.addEventListener('click', clickedOutsideEventHandler);

            isClickedOutsideEventHandlerAttached = true;
        }

        dropdownsToCloseOnClickOutsideSet.add(dropdownMenu);
    }

    dropdownMenu.toggleElement = toggleElement;
}

var isClickedOutsideEventHandlerAttached = false;
var dropdownsToCloseOnClickOutsideSet = new Set<AlumisDropdownMenu>();

function clickedOutsideEventHandler(event: Event) {

    for (let dropdown of dropdownsToCloseOnClickOutsideSet) {

        dropdown.hideAsync();
        dropdown.toggleElement.setAttribute('aria-expanded', 'false');
    }
}

async function togglerClickEventHandler(event: Event) {

    event.stopPropagation();

    const dropdownMenu = <AlumisDropdownMenu>this;
    const toggleElement = dropdownMenu.toggleElement;

    if (dropdownMenu.isVisible) {

        try {
            await dropdownMenu.hideAsync();
        }
        catch(error) {

            if (error instanceof OperationCancelledError) 
                return;

            throw error;
        }
        
        toggleElement.setAttribute('aria-expanded', 'false');

    } else {

        try {
            await dropdownMenu.showAsync();
        }
        catch(error) {

            if (error instanceof OperationCancelledError)
                return;

            throw error; 
        }

        toggleElement.setAttribute('aria-expanded', 'true');
    }
}

globalAttrHandlers.set('dropdownmenu', bindDropdownMenu);