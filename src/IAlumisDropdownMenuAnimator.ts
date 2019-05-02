import { CancellationToken } from "@alumis/cancellationtoken";

export interface IAlumisDropdownMenuAnimator {

    showAsync(node: HTMLDivElement, cancellationToken: CancellationToken): Promise<void>;
    hideAsync(node: HTMLDivElement, cancellationToken: CancellationToken): Promise<void>;
}