define([
    './wrapped-element'
], function (WrappedElement) {
    'use strict';
    return class WrappedInput extends WrappedElement {
        constructor({element, classNames, delimiter}) {
            super({
                element,
                classNames
            });
            this.delimiter = delimiter;
        }
        get value() {
            return this.element.value;
        }
        set value(items) {
            const itemValues = items.map(({value}) => value);
            const joinedValues = itemValues.join(this.delimiter);
            this.element.setAttribute('value', joinedValues);
            this.element.value = joinedValues;
        }
    };
});