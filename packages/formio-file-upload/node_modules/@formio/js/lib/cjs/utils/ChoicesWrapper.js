"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const choices_js_1 = __importStar(require("choices.js"));
const ExtendedKeyCodeMap = Object.assign(Object.assign({}, choices_js_1.KeyCodeMap), { TAB_KEY: 9 });
class ChoicesWrapper extends choices_js_1.default {
    constructor(...args) {
        super(...args);
        this._onTabKey = this._onTabKey.bind(this);
        this.isDirectionUsing = false;
        this.shouldOpenDropDown = true;
    }
    _onTouchEnd(event) {
        var target = (event || event.touches[0]).target;
        var touchWasWithinContainer = this._wasTap && this.containerOuter.element.contains(target);
        if (touchWasWithinContainer) {
            var containerWasExactTarget = target === this.containerOuter.element || target === this.containerInner.element;
            if (containerWasExactTarget) {
                if (this._isTextElement) {
                    this.input.focus();
                }
                else if (this._isSelectMultipleElement) {
                    this.input.focus();
                    this.showDropdown();
                }
            }
            // Prevents focus event firing
            event.stopPropagation();
        }
        this._wasTap = true;
    }
    _onEnterKey(...args) {
        const [event] = args;
        // Prevent dropdown form opening when removeItemButton was pressed using 'Enter' on keyboard
        if (event.target.className === 'choices__button') {
            this.shouldOpenDropDown = false;
        }
        super._onEnterKey(...args);
    }
    _onDirectionKey(...args) {
        if (!this._isSelectOneElement) {
            return super._onDirectionKey(...args);
        }
        this.isDirectionUsing = true;
        super._onDirectionKey(...args);
        this.onSelectValue(...args);
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.isDirectionUsing = false;
        }, 250);
    }
    _onTabKey() {
        if (this.dropdown.isActive) {
            this._selectHighlightedChoice();
        }
    }
    _selectHighlightedChoice() {
        const highlightedChoice = this.dropdown.element.querySelector(`.${this.config.classNames.highlightedState}`);
        if (highlightedChoice) {
            const id = highlightedChoice.dataset.id;
            const choice = id && this._store.getChoiceById(Number(id));
            this._addItem({
                id: choice.id,
                value: choice.value,
                label: choice.label,
                choiceId: choice.id,
                groupId: choice.groupId,
                customProperties: choice.customProperties,
                placeholder: choice.placeholder,
                keyCode: choice.keyCode
            });
            this._triggerChange(choice.value);
        }
    }
    _onKeyDown(event) {
        const keyCode = event.keyCode;
        return this._isSelectOneElement && keyCode === ExtendedKeyCodeMap.TAB_KEY
            ? this._onTabKey()
            : super._onKeyDown(event);
    }
    onSelectValue(event, hasActiveDropdown) {
        if (hasActiveDropdown) {
            this._selectHighlightedChoice();
        }
        else if (this._isSelectOneElement) {
            this.showDropdown();
            event.preventDefault();
        }
    }
    showDropdown(...args) {
        setTimeout(() => {
            if (!this.shouldOpenDropDown) {
                this.shouldOpenDropDown = true;
                return;
            }
            super.showDropdown(...args);
        }, 0);
    }
    hideDropdown(...args) {
        if (this.isDirectionUsing) {
            return;
        }
        super.hideDropdown(...args);
    }
}
exports.default = ChoicesWrapper;
