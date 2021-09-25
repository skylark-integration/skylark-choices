define([
    '../lib/utils'
], function (utils) {
    'use strict';
    return class WrappedElement {
        constructor({element, classNames}) {
            this.element = element;
            this.classNames = classNames;
            if (!(element instanceof HTMLInputElement) && !(element instanceof HTMLSelectElement)) {
                throw new TypeError('Invalid element passed');
            }
            this.isDisabled = false;
        }
        get isActive() {
            return this.element.dataset.choice === 'active';
        }
        get dir() {
            return this.element.dir;
        }
        get value() {
            return this.element.value;
        }
        set value(value) {
            this.element.value = value;
        }
        conceal() {
            this.element.classList.add(this.classNames.input);
            this.element.hidden = true;
            this.element.tabIndex = -1;
            const origStyle = this.element.getAttribute('style');
            if (origStyle) {
                this.element.setAttribute('data-choice-orig-style', origStyle);
            }
            this.element.setAttribute('data-choice', 'active');
        }
        reveal() {
            this.element.classList.remove(this.classNames.input);
            this.element.hidden = false;
            this.element.removeAttribute('tabindex');
            const origStyle = this.element.getAttribute('data-choice-orig-style');
            if (origStyle) {
                this.element.removeAttribute('data-choice-orig-style');
                this.element.setAttribute('style', origStyle);
            } else {
                this.element.removeAttribute('style');
            }
            this.element.removeAttribute('data-choice');
            this.element.value = this.element.value;
        }
        enable() {
            this.element.removeAttribute('disabled');
            this.element.disabled = false;
            this.isDisabled = false;
        }
        disable() {
            this.element.setAttribute('disabled', '');
            this.element.disabled = true;
            this.isDisabled = true;
        }
        triggerEvent(eventType, data) {
            utils.dispatchEvent(this.element, eventType, data);
        }
    };
});