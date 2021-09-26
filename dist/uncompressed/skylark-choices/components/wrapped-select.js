define([
    './wrapped-element'
], function (WrappedElement) {
    'use strict';
    return class WrappedSelect extends WrappedElement {
        constructor({element, classNames, template}) {
            super({
                element,
                classNames
            });
            this.template = template;
        }
        get placeholderOption() {
            return this.element.querySelector('option[value=""]') || this.element.querySelector('option[placeholder]');
        }
        get optionGroups() {
            return Array.from(this.element.getElementsByTagName('OPTGROUP'));
        }
        get options() {
            return Array.from(this.element.options);
        }
        set options(options) {
            const fragment = document.createDocumentFragment();
            const addOptionToFragment = data => {
                const option = this.template(data);
                fragment.appendChild(option);
            };
            options.forEach(optionData => addOptionToFragment(optionData));
            this.appendDocFragment(fragment);
        }
        appendDocFragment(fragment) {
            this.element.innerHTML = '';
            this.element.appendChild(fragment);
        }
    };
});