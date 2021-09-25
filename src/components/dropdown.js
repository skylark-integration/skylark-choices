define(function () {
    'use strict';
    return class Dropdown {
        constructor({element, type, classNames}) {
            this.element = element;
            this.classNames = classNames;
            this.type = type;
            this.isActive = false;
        }
        get distanceFromTopWindow() {
            return this.element.getBoundingClientRect().bottom;
        }
        getChild(selector) {
            return this.element.querySelector(selector);
        }
        show() {
            this.element.classList.add(this.classNames.activeState);
            this.element.setAttribute('aria-expanded', 'true');
            this.isActive = true;
            return this;
        }
        hide() {
            this.element.classList.remove(this.classNames.activeState);
            this.element.setAttribute('aria-expanded', 'false');
            this.isActive = false;
            return this;
        }
    };
});