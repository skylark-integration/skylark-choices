define([
    '../lib/utils',
    '../constants'
], function (utils, constants) {
    'use strict';
    return class Input {
        constructor({element, type, classNames, preventPaste}) {
            this.element = element;
            this.type = type;
            this.classNames = classNames;
            this.preventPaste = preventPaste;
            this.isFocussed = this.element === document.activeElement;
            this.isDisabled = element.disabled;
            this._onPaste = this._onPaste.bind(this);
            this._onInput = this._onInput.bind(this);
            this._onFocus = this._onFocus.bind(this);
            this._onBlur = this._onBlur.bind(this);
        }
        set placeholder(placeholder) {
            this.element.placeholder = placeholder;
        }
        get value() {
            return utils.sanitise(this.element.value);
        }
        set value(value) {
            this.element.value = value;
        }
        addEventListeners() {
            this.element.addEventListener('paste', this._onPaste);
            this.element.addEventListener('input', this._onInput, { passive: true });
            this.element.addEventListener('focus', this._onFocus, { passive: true });
            this.element.addEventListener('blur', this._onBlur, { passive: true });
        }
        removeEventListeners() {
            this.element.removeEventListener('input', this._onInput, { passive: true });
            this.element.removeEventListener('paste', this._onPaste);
            this.element.removeEventListener('focus', this._onFocus, { passive: true });
            this.element.removeEventListener('blur', this._onBlur, { passive: true });
        }
        enable() {
            this.element.removeAttribute('disabled');
            this.isDisabled = false;
        }
        disable() {
            this.element.setAttribute('disabled', '');
            this.isDisabled = true;
        }
        focus() {
            if (!this.isFocussed) {
                this.element.focus();
            }
        }
        blur() {
            if (this.isFocussed) {
                this.element.blur();
            }
        }
        clear(setWidth = true) {
            if (this.element.value) {
                this.element.value = '';
            }
            if (setWidth) {
                this.setWidth();
            }
            return this;
        }
        setWidth() {
            const {style, value, placeholder} = this.element;
            style.minWidth = `${ placeholder.length + 1 }ch`;
            style.width = `${ value.length + 1 }ch`;
        }
        setActiveDescendant(activeDescendantID) {
            this.element.setAttribute('aria-activedescendant', activeDescendantID);
        }
        removeActiveDescendant() {
            this.element.removeAttribute('aria-activedescendant');
        }
        _onInput() {
            if (this.type !== constants.SELECT_ONE_TYPE) {
                this.setWidth();
            }
        }
        _onPaste(event) {
            if (this.preventPaste) {
                event.preventDefault();
            }
        }
        _onFocus() {
            this.isFocussed = true;
        }
        _onBlur() {
            this.isFocussed = false;
        }
    };
});