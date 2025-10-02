export default ChoicesWrapper;
declare class ChoicesWrapper extends Choices {
    constructor(...args: any[]);
    _onTabKey(): void;
    isDirectionUsing: boolean;
    shouldOpenDropDown: boolean;
    _onTouchEnd(event: any): void;
    _onEnterKey(...args: any[]): void;
    _onDirectionKey(...args: any[]): void;
    timeout: NodeJS.Timeout | undefined;
    _selectHighlightedChoice(): void;
    _onKeyDown(event: any): void;
    onSelectValue(event: any, hasActiveDropdown: any): void;
    showDropdown(...args: any[]): void;
    hideDropdown(...args: any[]): void;
}
import Choices from 'choices.js';
