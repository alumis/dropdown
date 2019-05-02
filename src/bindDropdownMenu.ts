import { globalAttrHandlers, generateHTMLElementId } from '@alumis/observables-dom';
import { AlumisDropdownMenu } from './AlumisDropdownMenu';
import { IAlumisButtonAttributes } from '@alumis/button';
import { OperationCancelledError, CancellationTokenNone } from '@alumis/cancellationtoken';
import { delayAsync } from '@alumis/utils';

export function bindDropdownMenu(toggleElement: HTMLElement, dropdownMenu: AlumisDropdownMenu, attrs: IAlumisButtonAttributes) {

    let dropdownOnHover: boolean;
    let dropdownOnClickOutside: boolean;

    if (attrs) {
        
        dropdownOnHover = attrs.dropdownonhover;
        dropdownOnClickOutside = attrs.dropdowncloseonclickoutside;

        delete attrs.dropdownonhover;
        delete attrs.dropdowncloseonclickoutside;
    }

    toggleElement.setAttribute('aria-haspopup', 'true');
    toggleElement.setAttribute('aria-expanded', 'false');    

    dropdownMenu.node.setAttribute('aria-labelledby', toggleElement.id || (toggleElement.id = generateHTMLElementId()));
    
    if (dropdownOnHover) {

        toggleElement.addEventListener('mouseenter', togglerMouseEnterEventHandler.bind(dropdownMenu));
        toggleElement.addEventListener('mouseleave', togglerMouseLeaveEventHandler.bind(dropdownMenu));

        const dropdownMenuElement = dropdownMenu.node;

        dropdownMenuElement.addEventListener('mouseenter', dropdownMenuMouseEnterEventHandler.bind(dropdownMenu));
        dropdownMenuElement.addEventListener('mouseleave', dropdownMenuMouseLeaveEventHandler.bind(dropdownMenu));

    } else {

        toggleElement.addEventListener('click', togglerClickEventHandler.bind(dropdownMenu));
    }

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

        let toggleElement = dropdown.toggleElement;
        toggleElement.setAttribute('aria-expanded', 'false');
    }
}

async function togglerMouseEnterEventHandler(event: Event) {

    const dropdown = <AlumisDropdownMenu>this;
    const toggleElement = dropdown.toggleElement;

    toggleElement[IS_HOVERING] = true;

    if (dropdown.emmidiateIsVisible) {
        return;
    }

    try {
        await dropdown.showAsync();
    }
    catch(error) {

        if (error instanceof OperationCancelledError)
            return;
        
        throw error;
    }    

    toggleElement.setAttribute('aria-expanded', 'true');
}

async function togglerMouseLeaveEventHandler(event: Event) {

    const dropdown = <AlumisDropdownMenu>this;
    const toggleElement = dropdown.toggleElement;

    toggleElement[IS_HOVERING] = false;

    await delayAsync(0, CancellationTokenNone.singleton);

    if (dropdown[IS_HOVERING])
        return;

    try {
        dropdown.hideAsync();
    }
    catch(error) {
        
        if (error instanceof OperationCancelledError) 
            return;

        throw error;
    }    
    
    toggleElement.setAttribute('aria-expanded', 'false');
}

function dropdownMenuMouseEnterEventHandler(event: Event) {

    const dropdownMenu = <AlumisDropdownMenu>this;

    dropdownMenu[IS_HOVERING] = true;
}

async function dropdownMenuMouseLeaveEventHandler(event: Event) {

    const dropdownMenu = <AlumisDropdownMenu>this;
    const toggleElement = dropdownMenu.toggleElement;

    dropdownMenu[IS_HOVERING] = false;

    await delayAsync(0, CancellationTokenNone.singleton);

    if (!toggleElement[IS_HOVERING]) {

        try {
            await dropdownMenu.hideAsync();
        }
        catch(error) {

            if (error instanceof OperationCancelledError) 
                return;

            throw error;
        }

        toggleElement.setAttribute('aria-expanded', 'false');
    }
}

async function togglerClickEventHandler(event: Event) {

    const dropdownMenu = <AlumisDropdownMenu>this;
    const toggleElement = dropdownMenu.toggleElement;

    if (dropdownMenu.emmidiateIsVisible) {

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

const IS_HOVERING = '__isHovering';

globalAttrHandlers.set('dropdownmenu', bindDropdownMenu);