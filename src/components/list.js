define([
    '../constants'
], function (constants) {
    'use strict';
    return class List {
        constructor({element}) {
            this.element = element;
            this.scrollPos = this.element.scrollTop;
            this.height = this.element.offsetHeight;
        }
        clear() {
            this.element.innerHTML = '';
        }
        append(node) {
            this.element.appendChild(node);
        }
        getChild(selector) {
            return this.element.querySelector(selector);
        }
        hasChildren() {
            return this.element.hasChildNodes();
        }
        scrollToTop() {
            this.element.scrollTop = 0;
        }
        scrollToChildElement(element, direction) {
            if (!element) {
                return;
            }
            const listHeight = this.element.offsetHeight;
            const listScrollPosition = this.element.scrollTop + listHeight;
            const elementHeight = element.offsetHeight;
            const elementPos = element.offsetTop + elementHeight;
            const destination = direction > 0 ? this.element.scrollTop + elementPos - listScrollPosition : element.offsetTop;
            requestAnimationFrame(() => {
                this._animateScroll(destination, direction);
            });
        }
        _scrollDown(scrollPos, strength, destination) {
            const easing = (destination - scrollPos) / strength;
            const distance = easing > 1 ? easing : 1;
            this.element.scrollTop = scrollPos + distance;
        }
        _scrollUp(scrollPos, strength, destination) {
            const easing = (scrollPos - destination) / strength;
            const distance = easing > 1 ? easing : 1;
            this.element.scrollTop = scrollPos - distance;
        }
        _animateScroll(destination, direction) {
            const strength = constants.SCROLLING_SPEED;
            const choiceListScrollTop = this.element.scrollTop;
            let continueAnimation = false;
            if (direction > 0) {
                this._scrollDown(choiceListScrollTop, strength, destination);
                if (choiceListScrollTop < destination) {
                    continueAnimation = true;
                }
            } else {
                this._scrollUp(choiceListScrollTop, strength, destination);
                if (choiceListScrollTop > destination) {
                    continueAnimation = true;
                }
            }
            if (continueAnimation) {
                requestAnimationFrame(() => {
                    this._animateScroll(destination, direction);
                });
            }
        }
    };
});