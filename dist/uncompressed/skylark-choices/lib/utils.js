define(function () {
    'use strict';
    const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min) + min);
    const generateChars = length => Array.from({ length }, () => getRandomNumber(0, 36).toString(36)).join('');
    const generateId = (element, prefix) => {
        let id = element.id || element.name && `${ element.name }-${ generateChars(2) }` || generateChars(4);
        id = id.replace(/(:|\.|\[|\]|,)/g, '');
        id = `${ prefix }-${ id }`;
        return id;
    };
    const getType = obj => Object.prototype.toString.call(obj).slice(8, -1);
    const isType = (type, obj) => obj !== undefined && obj !== null && getType(obj) === type;
    const wrap = (element, wrapper = document.createElement('div')) => {
        if (element.nextSibling) {
            element.parentNode.insertBefore(wrapper, element.nextSibling);
        } else {
            element.parentNode.appendChild(wrapper);
        }
        return wrapper.appendChild(element);
    };
    const getAdjacentEl = (startEl, selector, direction = 1) => {
        if (!(startEl instanceof Element) || typeof selector !== 'string') {
            return undefined;
        }
        const prop = `${ direction > 0 ? 'next' : 'previous' }ElementSibling`;
        let sibling = startEl[prop];
        while (sibling) {
            if (sibling.matches(selector)) {
                return sibling;
            }
            sibling = sibling[prop];
        }
        return sibling;
    };
    const isScrolledIntoView = (element, parent, direction = 1) => {
        if (!element) {
            return false;
        }
        let isVisible;
        if (direction > 0) {
            isVisible = parent.scrollTop + parent.offsetHeight >= element.offsetTop + element.offsetHeight;
        } else {
            isVisible = element.offsetTop >= parent.scrollTop;
        }
        return isVisible;
    };
    const sanitise = value => {
        if (typeof value !== 'string') {
            return value;
        }
        return value.replace(/&/g, '&amp;').replace(/>/g, '&rt;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
    };
    const strToEl = (() => {
        const tmpEl = document.createElement('div');
        return str => {
            const cleanedInput = str.trim();
            tmpEl.innerHTML = cleanedInput;
            const firldChild = tmpEl.children[0];
            while (tmpEl.firstChild) {
                tmpEl.removeChild(tmpEl.firstChild);
            }
            return firldChild;
        };
    })();
    const sortByAlpha = ({value, label = value}, {
        value: value2,
        label: label2 = value2
    }) => label.localeCompare(label2, [], {
        sensitivity: 'base',
        ignorePunctuation: true,
        numeric: true
    });
    const sortByScore = (a, b) => a.score - b.score;
    const dispatchEvent = (element, type, customArgs = null) => {
        const event = new CustomEvent(type, {
            detail: customArgs,
            bubbles: true,
            cancelable: true
        });
        return element.dispatchEvent(event);
    };
    const existsInArray = (array, value, key = 'value') => array.some(item => {
        if (typeof value === 'string') {
            return item[key] === value.trim();
        }
        return item[key] === value;
    });
    const cloneObject = obj => JSON.parse(JSON.stringify(obj));
    const diff = (a, b) => {
        const aKeys = Object.keys(a).sort();
        const bKeys = Object.keys(b).sort();
        return aKeys.filter(i => bKeys.indexOf(i) < 0);
    };
    return {
        getRandomNumber: getRandomNumber,
        generateChars: generateChars,
        generateId: generateId,
        getType: getType,
        isType: isType,
        wrap: wrap,
        getAdjacentEl: getAdjacentEl,
        isScrolledIntoView: isScrolledIntoView,
        sanitise: sanitise,
        strToEl: strToEl,
        sortByAlpha: sortByAlpha,
        sortByScore: sortByScore,
        dispatchEvent: dispatchEvent,
        existsInArray: existsInArray,
        cloneObject: cloneObject,
        diff: diff
    };
});