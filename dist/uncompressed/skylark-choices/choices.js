define([
    './vendors/fuse',
    './vendors/deepmerge',
    './store/store',
    './components/index',
    './constants',
    './templates',
    './actions/choices',
    './actions/items',
    './actions/groups',
    './actions/misc',
    './lib/utils'
], function (Fuse, merge, Store, components, constants, TEMPLATES, actionsChoices, actionsItems, groups, misc, utils) {
    'use strict';
    const IS_IE11 = '-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style;
    const USER_DEFAULTS = {};
    class Choices {
        static get defaults() {
            return Object.preventExtensions({
                get options() {
                    return USER_DEFAULTS;
                },
                get templates() {
                    return TEMPLATES;
                }
            });
        }
        constructor(element = '[data-choice]', userConfig = {}) {
            this.config = merge.all([
                constants.DEFAULT_CONFIG,
                Choices.defaults.options,
                userConfig
            ], { arrayMerge: (_, sourceArray) => [...sourceArray] });
            const invalidConfigOptions = utils.diff(this.config, constants.DEFAULT_CONFIG);
            if (invalidConfigOptions.length) {
                console.warn('Unknown config option(s) passed', invalidConfigOptions.join(', '));
            }
            const passedElement = typeof element === 'string' ? document.querySelector(element) : element;
            if (!(passedElement instanceof HTMLInputElement || passedElement instanceof HTMLSelectElement)) {
                throw TypeError('Expected one of the following types text|select-one|select-multiple');
            }
            this._isTextElement = passedElement.type === constants.TEXT_TYPE;
            this._isSelectOneElement = passedElement.type === constants.SELECT_ONE_TYPE;
            this._isSelectMultipleElement = passedElement.type === constants.SELECT_MULTIPLE_TYPE;
            this._isSelectElement = this._isSelectOneElement || this._isSelectMultipleElement;
            this.config.searchEnabled = this._isSelectMultipleElement || this.config.searchEnabled;
            if (![
                    'auto',
                    'always'
                ].includes(this.config.renderSelectedChoices)) {
                this.config.renderSelectedChoices = 'auto';
            }
            if (userConfig.addItemFilter && typeof userConfig.addItemFilter !== 'function') {
                const re = userConfig.addItemFilter instanceof RegExp ? userConfig.addItemFilter : new RegExp(userConfig.addItemFilter);
                this.config.addItemFilter = re.test.bind(re);
            }
            if (this._isTextElement) {
                this.passedElement = new components.WrappedInput({
                    element: passedElement,
                    classNames: this.config.classNames,
                    delimiter: this.config.delimiter
                });
            } else {
                this.passedElement = new components.WrappedSelect({
                    element: passedElement,
                    classNames: this.config.classNames,
                    template: data => this._templates.option(data)
                });
            }
            this.initialised = false;
            this._store = new Store();
            this._initialState = {};
            this._currentState = {};
            this._prevState = {};
            this._currentValue = '';
            this._canSearch = this.config.searchEnabled;
            this._isScrollingOnIe = false;
            this._highlightPosition = 0;
            this._wasTap = true;
            this._placeholderValue = this._generatePlaceholderValue();
            this._baseId = utils.generateId(this.passedElement.element, 'choices-');
            this._direction = this.passedElement.dir;
            if (!this._direction) {
                const {direction: elementDirection} = window.getComputedStyle(this.passedElement.element);
                const {direction: documentDirection} = window.getComputedStyle(document.documentElement);
                if (elementDirection !== documentDirection) {
                    this._direction = elementDirection;
                }
            }
            this._idNames = { itemChoice: 'item-choice' };
            this._presetGroups = this.passedElement.optionGroups;
            this._presetOptions = this.passedElement.options;
            this._presetChoices = this.config.choices;
            this._presetItems = this.config.items;
            if (this.passedElement.value) {
                this._presetItems = this._presetItems.concat(this.passedElement.value.split(this.config.delimiter));
            }
            if (this.passedElement.options) {
                this.passedElement.options.forEach(o => {
                    this._presetChoices.push({
                        value: o.value,
                        label: o.innerHTML,
                        selected: o.selected,
                        disabled: o.disabled || o.parentNode.disabled,
                        placeholder: o.value === '' || o.hasAttribute('placeholder'),
                        customProperties: o.getAttribute('data-custom-properties')
                    });
                });
            }
            this._render = this._render.bind(this);
            this._onFocus = this._onFocus.bind(this);
            this._onBlur = this._onBlur.bind(this);
            this._onKeyUp = this._onKeyUp.bind(this);
            this._onKeyDown = this._onKeyDown.bind(this);
            this._onClick = this._onClick.bind(this);
            this._onTouchMove = this._onTouchMove.bind(this);
            this._onTouchEnd = this._onTouchEnd.bind(this);
            this._onMouseDown = this._onMouseDown.bind(this);
            this._onMouseOver = this._onMouseOver.bind(this);
            this._onFormReset = this._onFormReset.bind(this);
            this._onAKey = this._onAKey.bind(this);
            this._onEnterKey = this._onEnterKey.bind(this);
            this._onEscapeKey = this._onEscapeKey.bind(this);
            this._onDirectionKey = this._onDirectionKey.bind(this);
            this._onDeleteKey = this._onDeleteKey.bind(this);
            if (this.passedElement.isActive) {
                if (!this.config.silent) {
                    console.warn('Trying to initialise Choices on element already initialised');
                }
                this.initialised = true;
                return;
            }
            this.init();
        }
        init() {
            if (this.initialised) {
                return;
            }
            this._createTemplates();
            this._createElements();
            this._createStructure();
            this._initialState = utils.cloneObject(this._store.state);
            this._store.subscribe(this._render);
            this._render();
            this._addEventListeners();
            const shouldDisable = !this.config.addItems || this.passedElement.element.hasAttribute('disabled');
            if (shouldDisable) {
                this.disable();
            }
            this.initialised = true;
            const {callbackOnInit} = this.config;
            if (callbackOnInit && typeof callbackOnInit === 'function') {
                callbackOnInit.call(this);
            }
        }
        destroy() {
            if (!this.initialised) {
                return;
            }
            this._removeEventListeners();
            this.passedElement.reveal();
            this.containerOuter.unwrap(this.passedElement.element);
            this.clearStore();
            if (this._isSelectElement) {
                this.passedElement.options = this._presetOptions;
            }
            this._templates = null;
            this.initialised = false;
        }
        enable() {
            if (this.passedElement.isDisabled) {
                this.passedElement.enable();
            }
            if (this.containerOuter.isDisabled) {
                this._addEventListeners();
                this.input.enable();
                this.containerOuter.enable();
            }
            return this;
        }
        disable() {
            if (!this.passedElement.isDisabled) {
                this.passedElement.disable();
            }
            if (!this.containerOuter.isDisabled) {
                this._removeEventListeners();
                this.input.disable();
                this.containerOuter.disable();
            }
            return this;
        }
        highlightItem(item, runEvent = true) {
            if (!item) {
                return this;
            }
            const {id, groupId = -1, value = '', label = ''} = item;
            const group = groupId >= 0 ? this._store.getGroupById(groupId) : null;
            this._store.dispatch(actionsItems.highlightItem(id, true));
            if (runEvent) {
                this.passedElement.triggerEvent(constants.EVENTS.highlightItem, {
                    id,
                    value,
                    label,
                    groupValue: group && group.value ? group.value : null
                });
            }
            return this;
        }
        unhighlightItem(item) {
            if (!item) {
                return this;
            }
            const {id, groupId = -1, value = '', label = ''} = item;
            const group = groupId >= 0 ? this._store.getGroupById(groupId) : null;
            this._store.dispatch(actionsItems.highlightItem(id, false));
            this.passedElement.triggerEvent(constants.EVENTS.highlightItem, {
                id,
                value,
                label,
                groupValue: group && group.value ? group.value : null
            });
            return this;
        }
        highlightAll() {
            this._store.items.forEach(item => this.highlightItem(item));
            return this;
        }
        unhighlightAll() {
            this._store.items.forEach(item => this.unhighlightItem(item));
            return this;
        }
        removeActiveItemsByValue(value) {
            this._store.activeItems.filter(item => item.value === value).forEach(item => this._removeItem(item));
            return this;
        }
        removeActiveItems(excludedId) {
            this._store.activeItems.filter(({id}) => id !== excludedId).forEach(item => this._removeItem(item));
            return this;
        }
        removeHighlightedItems(runEvent = false) {
            this._store.highlightedActiveItems.forEach(item => {
                this._removeItem(item);
                if (runEvent) {
                    this._triggerChange(item.value);
                }
            });
            return this;
        }
        showDropdown(preventInputFocus) {
            if (this.dropdown.isActive) {
                return this;
            }
            requestAnimationFrame(() => {
                this.dropdown.show();
                this.containerOuter.open(this.dropdown.distanceFromTopWindow);
                if (!preventInputFocus && this._canSearch) {
                    this.input.focus();
                }
                this.passedElement.triggerEvent(constants.EVENTS.showDropdown, {});
            });
            return this;
        }
        hideDropdown(preventInputBlur) {
            if (!this.dropdown.isActive) {
                return this;
            }
            requestAnimationFrame(() => {
                this.dropdown.hide();
                this.containerOuter.close();
                if (!preventInputBlur && this._canSearch) {
                    this.input.removeActiveDescendant();
                    this.input.blur();
                }
                this.passedElement.triggerEvent(constants.EVENTS.hideDropdown, {});
            });
            return this;
        }
        getValue(valueOnly = false) {
            const values = this._store.activeItems.reduce((selectedItems, item) => {
                const itemValue = valueOnly ? item.value : item;
                selectedItems.push(itemValue);
                return selectedItems;
            }, []);
            return this._isSelectOneElement ? values[0] : values;
        }
        setValue(items) {
            if (!this.initialised) {
                return this;
            }
            items.forEach(value => this._setChoiceOrItem(value));
            return this;
        }
        setChoiceByValue(value) {
            if (!this.initialised || this._isTextElement) {
                return this;
            }
            const choiceValue = Array.isArray(value) ? value : [value];
            choiceValue.forEach(val => this._findAndSelectChoiceByValue(val));
            return this;
        }
        setChoices(choicesArrayOrFetcher = [], value = 'value', label = 'label', replaceChoices = false) {
            if (!this.initialised) {
                throw new ReferenceError(`setChoices was called on a non-initialized instance of Choices`);
            }
            if (!this._isSelectElement) {
                throw new TypeError(`setChoices can't be used with INPUT based Choices`);
            }
            if (typeof value !== 'string' || !value) {
                throw new TypeError(`value parameter must be a name of 'value' field in passed objects`);
            }
            if (replaceChoices) {
                this.clearChoices();
            }
            if (typeof choicesArrayOrFetcher === 'function') {
                const fetcher = choicesArrayOrFetcher(this);
                if (typeof Promise === 'function' && fetcher instanceof Promise) {
                    return new Promise(resolve => requestAnimationFrame(resolve)).then(() => this._handleLoadingState(true)).then(() => fetcher).then(data => this.setChoices(data, value, label, replaceChoices)).catch(err => {
                        if (!this.config.silent) {
                            console.error(err);
                        }
                    }).then(() => this._handleLoadingState(false)).then(() => this);
                }
                if (!Array.isArray(fetcher)) {
                    throw new TypeError(`.setChoices first argument function must return either array of choices or Promise, got: ${ typeof fetcher }`);
                }
                return this.setChoices(fetcher, value, label, false);
            }
            if (!Array.isArray(choicesArrayOrFetcher)) {
                throw new TypeError(`.setChoices must be called either with array of choices with a function resulting into Promise of array of choices`);
            }
            this.containerOuter.removeLoadingState();
            this._startLoading();
            choicesArrayOrFetcher.forEach(groupOrChoice => {
                if (groupOrChoice.choices) {
                    this._addGroup({
                        id: parseInt(groupOrChoice.id, 10) || null,
                        group: groupOrChoice,
                        valueKey: value,
                        labelKey: label
                    });
                } else {
                    this._addChoice({
                        value: groupOrChoice[value],
                        label: groupOrChoice[label],
                        isSelected: groupOrChoice.selected,
                        isDisabled: groupOrChoice.disabled,
                        customProperties: groupOrChoice.customProperties,
                        placeholder: groupOrChoice.placeholder
                    });
                }
            });
            this._stopLoading();
            return this;
        }
        clearChoices() {
            this._store.dispatch(actionsChoices.clearChoices());
            return this;
        }
        clearStore() {
            this._store.dispatch(misc.clearAll());
            return this;
        }
        clearInput() {
            const shouldSetInputWidth = !this._isSelectOneElement;
            this.input.clear(shouldSetInputWidth);
            if (!this._isTextElement && this._canSearch) {
                this._isSearching = false;
                this._store.dispatch(actionsChoices.activateChoices(true));
            }
            return this;
        }
        _render() {
            if (this._store.isLoading()) {
                return;
            }
            this._currentState = this._store.state;
            const stateChanged = this._currentState.choices !== this._prevState.choices || this._currentState.groups !== this._prevState.groups || this._currentState.items !== this._prevState.items;
            const shouldRenderChoices = this._isSelectElement;
            const shouldRenderItems = this._currentState.items !== this._prevState.items;
            if (!stateChanged) {
                return;
            }
            if (shouldRenderChoices) {
                this._renderChoices();
            }
            if (shouldRenderItems) {
                this._renderItems();
            }
            this._prevState = this._currentState;
        }
        _renderChoices() {
            const {activeGroups, activeChoices} = this._store;
            let choiceListFragment = document.createDocumentFragment();
            this.choiceList.clear();
            if (this.config.resetScrollPosition) {
                requestAnimationFrame(() => this.choiceList.scrollToTop());
            }
            if (activeGroups.length >= 1 && !this._isSearching) {
                const activePlaceholders = activeChoices.filter(activeChoice => activeChoice.placeholder === true && activeChoice.groupId === -1);
                if (activePlaceholders.length >= 1) {
                    choiceListFragment = this._createChoicesFragment(activePlaceholders, choiceListFragment);
                }
                choiceListFragment = this._createGroupsFragment(activeGroups, activeChoices, choiceListFragment);
            } else if (activeChoices.length >= 1) {
                choiceListFragment = this._createChoicesFragment(activeChoices, choiceListFragment);
            }
            if (choiceListFragment.childNodes && choiceListFragment.childNodes.length > 0) {
                const {activeItems} = this._store;
                const canAddItem = this._canAddItem(activeItems, this.input.value);
                if (canAddItem.response) {
                    this.choiceList.append(choiceListFragment);
                    this._highlightChoice();
                } else {
                    this.choiceList.append(this._getTemplate('notice', canAddItem.notice));
                }
            } else {
                let dropdownItem;
                let notice;
                if (this._isSearching) {
                    notice = typeof this.config.noResultsText === 'function' ? this.config.noResultsText() : this.config.noResultsText;
                    dropdownItem = this._getTemplate('notice', notice, 'no-results');
                } else {
                    notice = typeof this.config.noChoicesText === 'function' ? this.config.noChoicesText() : this.config.noChoicesText;
                    dropdownItem = this._getTemplate('notice', notice, 'no-choices');
                }
                this.choiceList.append(dropdownItem);
            }
        }
        _renderItems() {
            const activeItems = this._store.activeItems || [];
            this.itemList.clear();
            const itemListFragment = this._createItemsFragment(activeItems);
            if (itemListFragment.childNodes) {
                this.itemList.append(itemListFragment);
            }
        }
        _createGroupsFragment(groups, choices, fragment = document.createDocumentFragment()) {
            const getGroupChoices = group => choices.filter(choice => {
                if (this._isSelectOneElement) {
                    return choice.groupId === group.id;
                }
                return choice.groupId === group.id && (this.config.renderSelectedChoices === 'always' || !choice.selected);
            });
            if (this.config.shouldSort) {
                groups.sort(this.config.sorter);
            }
            groups.forEach(group => {
                const groupChoices = getGroupChoices(group);
                if (groupChoices.length >= 1) {
                    const dropdownGroup = this._getTemplate('choiceGroup', group);
                    fragment.appendChild(dropdownGroup);
                    this._createChoicesFragment(groupChoices, fragment, true);
                }
            });
            return fragment;
        }
        _createChoicesFragment(choices, fragment = document.createDocumentFragment(), withinGroup = false) {
            const {renderSelectedChoices, searchResultLimit, renderChoiceLimit} = this.config;
            const filter = this._isSearching ? utils.sortByScore : this.config.sorter;
            const appendChoice = choice => {
                const shouldRender = renderSelectedChoices === 'auto' ? this._isSelectOneElement || !choice.selected : true;
                if (shouldRender) {
                    const dropdownItem = this._getTemplate('choice', choice, this.config.itemSelectText);
                    fragment.appendChild(dropdownItem);
                }
            };
            let rendererableChoices = choices;
            if (renderSelectedChoices === 'auto' && !this._isSelectOneElement) {
                rendererableChoices = choices.filter(choice => !choice.selected);
            }
            const {placeholderChoices, normalChoices} = rendererableChoices.reduce((acc, choice) => {
                if (choice.placeholder) {
                    acc.placeholderChoices.push(choice);
                } else {
                    acc.normalChoices.push(choice);
                }
                return acc;
            }, {
                placeholderChoices: [],
                normalChoices: []
            });
            if (this.config.shouldSort || this._isSearching) {
                normalChoices.sort(filter);
            }
            let choiceLimit = rendererableChoices.length;
            const sortedChoices = this._isSelectOneElement ? [
                ...placeholderChoices,
                ...normalChoices
            ] : normalChoices;
            if (this._isSearching) {
                choiceLimit = searchResultLimit;
            } else if (renderChoiceLimit && renderChoiceLimit > 0 && !withinGroup) {
                choiceLimit = renderChoiceLimit;
            }
            for (let i = 0; i < choiceLimit; i += 1) {
                if (sortedChoices[i]) {
                    appendChoice(sortedChoices[i]);
                }
            }
            return fragment;
        }
        _createItemsFragment(items, fragment = document.createDocumentFragment()) {
            const {shouldSortItems, sorter, removeItemButton} = this.config;
            if (shouldSortItems && !this._isSelectOneElement) {
                items.sort(sorter);
            }
            if (this._isTextElement) {
                this.passedElement.value = items;
            } else {
                this.passedElement.options = items;
            }
            const addItemToFragment = item => {
                const listItem = this._getTemplate('item', item, removeItemButton);
                fragment.appendChild(listItem);
            };
            items.forEach(addItemToFragment);
            return fragment;
        }
        _triggerChange(value) {
            if (value === undefined || value === null) {
                return;
            }
            this.passedElement.triggerEvent(constants.EVENTS.change, { value });
        }
        _selectPlaceholderChoice() {
            const {placeholderChoice} = this._store;
            if (placeholderChoice) {
                this._addItem({
                    value: placeholderChoice.value,
                    label: placeholderChoice.label,
                    choiceId: placeholderChoice.id,
                    groupId: placeholderChoice.groupId,
                    placeholder: placeholderChoice.placeholder
                });
                this._triggerChange(placeholderChoice.value);
            }
        }
        _handleButtonAction(activeItems, element) {
            if (!activeItems || !element || !this.config.removeItems || !this.config.removeItemButton) {
                return;
            }
            const itemId = element.parentNode.getAttribute('data-id');
            const itemToRemove = activeItems.find(item => item.id === parseInt(itemId, 10));
            this._removeItem(itemToRemove);
            this._triggerChange(itemToRemove.value);
            if (this._isSelectOneElement) {
                this._selectPlaceholderChoice();
            }
        }
        _handleItemAction(activeItems, element, hasShiftKey = false) {
            if (!activeItems || !element || !this.config.removeItems || this._isSelectOneElement) {
                return;
            }
            const passedId = element.getAttribute('data-id');
            activeItems.forEach(item => {
                if (item.id === parseInt(passedId, 10) && !item.highlighted) {
                    this.highlightItem(item);
                } else if (!hasShiftKey && item.highlighted) {
                    this.unhighlightItem(item);
                }
            });
            this.input.focus();
        }
        _handleChoiceAction(activeItems, element) {
            if (!activeItems || !element) {
                return;
            }
            const {id} = element.dataset;
            const choice = this._store.getChoiceById(id);
            if (!choice) {
                return;
            }
            const passedKeyCode = activeItems[0] && activeItems[0].keyCode ? activeItems[0].keyCode : null;
            const hasActiveDropdown = this.dropdown.isActive;
            choice.keyCode = passedKeyCode;
            this.passedElement.triggerEvent(constants.EVENTS.choice, { choice });
            if (!choice.selected && !choice.disabled) {
                const canAddItem = this._canAddItem(activeItems, choice.value);
                if (canAddItem.response) {
                    this._addItem({
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
            this.clearInput();
            if (hasActiveDropdown && this._isSelectOneElement) {
                this.hideDropdown(true);
                this.containerOuter.focus();
            }
        }
        _handleBackspace(activeItems) {
            if (!this.config.removeItems || !activeItems) {
                return;
            }
            const lastItem = activeItems[activeItems.length - 1];
            const hasHighlightedItems = activeItems.some(item => item.highlighted);
            if (this.config.editItems && !hasHighlightedItems && lastItem) {
                this.input.value = lastItem.value;
                this.input.setWidth();
                this._removeItem(lastItem);
                this._triggerChange(lastItem.value);
            } else {
                if (!hasHighlightedItems) {
                    this.highlightItem(lastItem, false);
                }
                this.removeHighlightedItems(true);
            }
        }
        _startLoading() {
            this._store.dispatch(misc.setIsLoading(true));
        }
        _stopLoading() {
            this._store.dispatch(misc.setIsLoading(false));
        }
        _handleLoadingState(setLoading = true) {
            let placeholderItem = this.itemList.getChild(`.${ this.config.classNames.placeholder }`);
            if (setLoading) {
                this.disable();
                this.containerOuter.addLoadingState();
                if (this._isSelectOneElement) {
                    if (!placeholderItem) {
                        placeholderItem = this._getTemplate('placeholder', this.config.loadingText);
                        this.itemList.append(placeholderItem);
                    } else {
                        placeholderItem.innerHTML = this.config.loadingText;
                    }
                } else {
                    this.input.placeholder = this.config.loadingText;
                }
            } else {
                this.enable();
                this.containerOuter.removeLoadingState();
                if (this._isSelectOneElement) {
                    placeholderItem.innerHTML = this._placeholderValue || '';
                } else {
                    this.input.placeholder = this._placeholderValue || '';
                }
            }
        }
        _handleSearch(value) {
            if (!value || !this.input.isFocussed) {
                return;
            }
            const {choices} = this._store;
            const {searchFloor, searchChoices} = this.config;
            const hasUnactiveChoices = choices.some(option => !option.active);
            if (value && value.length >= searchFloor) {
                const resultCount = searchChoices ? this._searchChoices(value) : 0;
                this.passedElement.triggerEvent(constants.EVENTS.search, {
                    value,
                    resultCount
                });
            } else if (hasUnactiveChoices) {
                this._isSearching = false;
                this._store.dispatch(actionsChoices.activateChoices(true));
            }
        }
        _canAddItem(activeItems, value) {
            let canAddItem = true;
            let notice = typeof this.config.addItemText === 'function' ? this.config.addItemText(value) : this.config.addItemText;
            if (!this._isSelectOneElement) {
                const isDuplicateValue = utils.existsInArray(activeItems, value);
                if (this.config.maxItemCount > 0 && this.config.maxItemCount <= activeItems.length) {
                    canAddItem = false;
                    notice = typeof this.config.maxItemText === 'function' ? this.config.maxItemText(this.config.maxItemCount) : this.config.maxItemText;
                }
                if (!this.config.duplicateItemsAllowed && isDuplicateValue && canAddItem) {
                    canAddItem = false;
                    notice = typeof this.config.uniqueItemText === 'function' ? this.config.uniqueItemText(value) : this.config.uniqueItemText;
                }
                if (this._isTextElement && this.config.addItems && canAddItem && typeof this.config.addItemFilter === 'function' && !this.config.addItemFilter(value)) {
                    canAddItem = false;
                    notice = typeof this.config.customAddItemText === 'function' ? this.config.customAddItemText(value) : this.config.customAddItemText;
                }
            }
            return {
                response: canAddItem,
                notice
            };
        }
        _searchChoices(value) {
            const newValue = typeof value === 'string' ? value.trim() : value;
            const currentValue = typeof this._currentValue === 'string' ? this._currentValue.trim() : this._currentValue;
            if (newValue.length < 1 && newValue === `${ currentValue } `) {
                return 0;
            }
            const haystack = this._store.searchableChoices;
            const needle = newValue;
            const keys = [...this.config.searchFields];
            const options = Object.assign(this.config.fuseOptions, { keys });
            const fuse = new Fuse(haystack, options);
            const results = fuse.search(needle);
            this._currentValue = newValue;
            this._highlightPosition = 0;
            this._isSearching = true;
            this._store.dispatch(actionsChoices.filterChoices(results));
            return results.length;
        }
        _addEventListeners() {
            const {documentElement} = document;
            documentElement.addEventListener('touchend', this._onTouchEnd, true);
            this.containerOuter.element.addEventListener('keydown', this._onKeyDown, true);
            this.containerOuter.element.addEventListener('mousedown', this._onMouseDown, true);
            documentElement.addEventListener('click', this._onClick, { passive: true });
            documentElement.addEventListener('touchmove', this._onTouchMove, { passive: true });
            this.dropdown.element.addEventListener('mouseover', this._onMouseOver, { passive: true });
            if (this._isSelectOneElement) {
                this.containerOuter.element.addEventListener('focus', this._onFocus, { passive: true });
                this.containerOuter.element.addEventListener('blur', this._onBlur, { passive: true });
            }
            this.input.element.addEventListener('keyup', this._onKeyUp, { passive: true });
            this.input.element.addEventListener('focus', this._onFocus, { passive: true });
            this.input.element.addEventListener('blur', this._onBlur, { passive: true });
            if (this.input.element.form) {
                this.input.element.form.addEventListener('reset', this._onFormReset, { passive: true });
            }
            this.input.addEventListeners();
        }
        _removeEventListeners() {
            const {documentElement} = document;
            documentElement.removeEventListener('touchend', this._onTouchEnd, true);
            this.containerOuter.element.removeEventListener('keydown', this._onKeyDown, true);
            this.containerOuter.element.removeEventListener('mousedown', this._onMouseDown, true);
            documentElement.removeEventListener('click', this._onClick);
            documentElement.removeEventListener('touchmove', this._onTouchMove);
            this.dropdown.element.removeEventListener('mouseover', this._onMouseOver);
            if (this._isSelectOneElement) {
                this.containerOuter.element.removeEventListener('focus', this._onFocus);
                this.containerOuter.element.removeEventListener('blur', this._onBlur);
            }
            this.input.element.removeEventListener('keyup', this._onKeyUp);
            this.input.element.removeEventListener('focus', this._onFocus);
            this.input.element.removeEventListener('blur', this._onBlur);
            if (this.input.element.form) {
                this.input.element.form.removeEventListener('reset', this._onFormReset);
            }
            this.input.removeEventListeners();
        }
        _onKeyDown(event) {
            const {target, keyCode, ctrlKey, metaKey} = event;
            const {activeItems} = this._store;
            const hasFocusedInput = this.input.isFocussed;
            const hasActiveDropdown = this.dropdown.isActive;
            const hasItems = this.itemList.hasChildren();
            const keyString = String.fromCharCode(keyCode);
            const {BACK_KEY, DELETE_KEY, ENTER_KEY, A_KEY, ESC_KEY, UP_KEY, DOWN_KEY, PAGE_UP_KEY, PAGE_DOWN_KEY} = constants.KEY_CODES;
            const hasCtrlDownKeyPressed = ctrlKey || metaKey;
            if (!this._isTextElement && /[a-zA-Z0-9-_ ]/.test(keyString)) {
                this.showDropdown();
            }
            const keyDownActions = {
                [A_KEY]: this._onAKey,
                [ENTER_KEY]: this._onEnterKey,
                [ESC_KEY]: this._onEscapeKey,
                [UP_KEY]: this._onDirectionKey,
                [PAGE_UP_KEY]: this._onDirectionKey,
                [DOWN_KEY]: this._onDirectionKey,
                [PAGE_DOWN_KEY]: this._onDirectionKey,
                [DELETE_KEY]: this._onDeleteKey,
                [BACK_KEY]: this._onDeleteKey
            };
            if (keyDownActions[keyCode]) {
                keyDownActions[keyCode]({
                    event,
                    target,
                    keyCode,
                    metaKey,
                    activeItems,
                    hasFocusedInput,
                    hasActiveDropdown,
                    hasItems,
                    hasCtrlDownKeyPressed
                });
            }
        }
        _onKeyUp({target, keyCode}) {
            const {value} = this.input;
            const {activeItems} = this._store;
            const canAddItem = this._canAddItem(activeItems, value);
            const {
                BACK_KEY: backKey,
                DELETE_KEY: deleteKey
            } = constants.KEY_CODES;
            if (this._isTextElement) {
                const canShowDropdownNotice = canAddItem.notice && value;
                if (canShowDropdownNotice) {
                    const dropdownItem = this._getTemplate('notice', canAddItem.notice);
                    this.dropdown.element.innerHTML = dropdownItem.outerHTML;
                    this.showDropdown(true);
                } else {
                    this.hideDropdown(true);
                }
            } else {
                const userHasRemovedValue = (keyCode === backKey || keyCode === deleteKey) && !target.value;
                const canReactivateChoices = !this._isTextElement && this._isSearching;
                const canSearch = this._canSearch && canAddItem.response;
                if (userHasRemovedValue && canReactivateChoices) {
                    this._isSearching = false;
                    this._store.dispatch(actionsChoices.activateChoices(true));
                } else if (canSearch) {
                    this._handleSearch(this.input.value);
                }
            }
            this._canSearch = this.config.searchEnabled;
        }
        _onAKey({hasItems, hasCtrlDownKeyPressed}) {
            if (hasCtrlDownKeyPressed && hasItems) {
                this._canSearch = false;
                const shouldHightlightAll = this.config.removeItems && !this.input.value && this.input.element === document.activeElement;
                if (shouldHightlightAll) {
                    this.highlightAll();
                }
            }
        }
        _onEnterKey({event, target, activeItems, hasActiveDropdown}) {
            const {ENTER_KEY: enterKey} = constants.KEY_CODES;
            const targetWasButton = target.hasAttribute('data-button');
            if (this._isTextElement && target.value) {
                const {value} = this.input;
                const canAddItem = this._canAddItem(activeItems, value);
                if (canAddItem.response) {
                    this.hideDropdown(true);
                    this._addItem({ value });
                    this._triggerChange(value);
                    this.clearInput();
                }
            }
            if (targetWasButton) {
                this._handleButtonAction(activeItems, target);
                event.preventDefault();
            }
            if (hasActiveDropdown) {
                const highlightedChoice = this.dropdown.getChild(`.${ this.config.classNames.highlightedState }`);
                if (highlightedChoice) {
                    if (activeItems[0]) {
                        activeItems[0].keyCode = enterKey;
                    }
                    this._handleChoiceAction(activeItems, highlightedChoice);
                }
                event.preventDefault();
            } else if (this._isSelectOneElement) {
                this.showDropdown();
                event.preventDefault();
            }
        }
        _onEscapeKey({hasActiveDropdown}) {
            if (hasActiveDropdown) {
                this.hideDropdown(true);
                this.containerOuter.focus();
            }
        }
        _onDirectionKey({event, hasActiveDropdown, keyCode, metaKey}) {
            const {
                DOWN_KEY: downKey,
                PAGE_UP_KEY: pageUpKey,
                PAGE_DOWN_KEY: pageDownKey
            } = constants.KEY_CODES;
            if (hasActiveDropdown || this._isSelectOneElement) {
                this.showDropdown();
                this._canSearch = false;
                const directionInt = keyCode === downKey || keyCode === pageDownKey ? 1 : -1;
                const skipKey = metaKey || keyCode === pageDownKey || keyCode === pageUpKey;
                const selectableChoiceIdentifier = '[data-choice-selectable]';
                let nextEl;
                if (skipKey) {
                    if (directionInt > 0) {
                        nextEl = this.dropdown.element.querySelector(`${ selectableChoiceIdentifier }:last-of-type`);
                    } else {
                        nextEl = this.dropdown.element.querySelector(selectableChoiceIdentifier);
                    }
                } else {
                    const currentEl = this.dropdown.element.querySelector(`.${ this.config.classNames.highlightedState }`);
                    if (currentEl) {
                        nextEl = utils.getAdjacentEl(currentEl, selectableChoiceIdentifier, directionInt);
                    } else {
                        nextEl = this.dropdown.element.querySelector(selectableChoiceIdentifier);
                    }
                }
                if (nextEl) {
                    if (!utils.isScrolledIntoView(nextEl, this.choiceList.element, directionInt)) {
                        this.choiceList.scrollToChildElement(nextEl, directionInt);
                    }
                    this._highlightChoice(nextEl);
                }
                event.preventDefault();
            }
        }
        _onDeleteKey({event, target, hasFocusedInput, activeItems}) {
            if (hasFocusedInput && !target.value && !this._isSelectOneElement) {
                this._handleBackspace(activeItems);
                event.preventDefault();
            }
        }
        _onTouchMove() {
            if (this._wasTap) {
                this._wasTap = false;
            }
        }
        _onTouchEnd(event) {
            const {target} = event || event.touches[0];
            const touchWasWithinContainer = this._wasTap && this.containerOuter.element.contains(target);
            if (touchWasWithinContainer) {
                const containerWasExactTarget = target === this.containerOuter.element || target === this.containerInner.element;
                if (containerWasExactTarget) {
                    if (this._isTextElement) {
                        this.input.focus();
                    } else if (this._isSelectMultipleElement) {
                        this.showDropdown();
                    }
                }
                event.stopPropagation();
            }
            this._wasTap = true;
        }
        _onMouseDown(event) {
            const {target} = event;
            if (!(target instanceof HTMLElement)) {
                return;
            }
            if (IS_IE11 && this.choiceList.element.contains(target)) {
                const firstChoice = this.choiceList.element.firstElementChild;
                const isOnScrollbar = this._direction === 'ltr' ? event.offsetX >= firstChoice.offsetWidth : event.offsetX < firstChoice.offsetLeft;
                this._isScrollingOnIe = isOnScrollbar;
            }
            if (target === this.input.element) {
                return;
            }
            const item = target.closest('[data-button],[data-item],[data-choice]');
            if (item instanceof HTMLElement) {
                const hasShiftKey = event.shiftKey;
                const {activeItems} = this._store;
                const {dataset} = item;
                if ('button' in dataset) {
                    this._handleButtonAction(activeItems, item);
                } else if ('item' in dataset) {
                    this._handleItemAction(activeItems, item, hasShiftKey);
                } else if ('choice' in dataset) {
                    this._handleChoiceAction(activeItems, item);
                }
            }
            event.preventDefault();
        }
        _onMouseOver({target}) {
            if (target instanceof HTMLElement && 'choice' in target.dataset) {
                this._highlightChoice(target);
            }
        }
        _onClick({target}) {
            const clickWasWithinContainer = this.containerOuter.element.contains(target);
            if (clickWasWithinContainer) {
                if (!this.dropdown.isActive && !this.containerOuter.isDisabled) {
                    if (this._isTextElement) {
                        if (document.activeElement !== this.input.element) {
                            this.input.focus();
                        }
                    } else {
                        this.showDropdown();
                        this.containerOuter.focus();
                    }
                } else if (this._isSelectOneElement && target !== this.input.element && !this.dropdown.element.contains(target)) {
                    this.hideDropdown();
                }
            } else {
                const hasHighlightedItems = this._store.highlightedActiveItems.length > 0;
                if (hasHighlightedItems) {
                    this.unhighlightAll();
                }
                this.containerOuter.removeFocusState();
                this.hideDropdown(true);
            }
        }
        _onFocus({target}) {
            const focusWasWithinContainer = this.containerOuter.element.contains(target);
            if (!focusWasWithinContainer) {
                return;
            }
            const focusActions = {
                [constants.TEXT_TYPE]: () => {
                    if (target === this.input.element) {
                        this.containerOuter.addFocusState();
                    }
                },
                [constants.SELECT_ONE_TYPE]: () => {
                    this.containerOuter.addFocusState();
                    if (target === this.input.element) {
                        this.showDropdown(true);
                    }
                },
                [constants.SELECT_MULTIPLE_TYPE]: () => {
                    if (target === this.input.element) {
                        this.showDropdown(true);
                        this.containerOuter.addFocusState();
                    }
                }
            };
            focusActions[this.passedElement.element.type]();
        }
        _onBlur({target}) {
            const blurWasWithinContainer = this.containerOuter.element.contains(target);
            if (blurWasWithinContainer && !this._isScrollingOnIe) {
                const {activeItems} = this._store;
                const hasHighlightedItems = activeItems.some(item => item.highlighted);
                const blurActions = {
                    [constants.TEXT_TYPE]: () => {
                        if (target === this.input.element) {
                            this.containerOuter.removeFocusState();
                            if (hasHighlightedItems) {
                                this.unhighlightAll();
                            }
                            this.hideDropdown(true);
                        }
                    },
                    [constants.SELECT_ONE_TYPE]: () => {
                        this.containerOuter.removeFocusState();
                        if (target === this.input.element || target === this.containerOuter.element && !this._canSearch) {
                            this.hideDropdown(true);
                        }
                    },
                    [constants.SELECT_MULTIPLE_TYPE]: () => {
                        if (target === this.input.element) {
                            this.containerOuter.removeFocusState();
                            this.hideDropdown(true);
                            if (hasHighlightedItems) {
                                this.unhighlightAll();
                            }
                        }
                    }
                };
                blurActions[this.passedElement.element.type]();
            } else {
                this._isScrollingOnIe = false;
                this.input.element.focus();
            }
        }
        _onFormReset() {
            this._store.dispatch(misc.resetTo(this._initialState));
        }
        _highlightChoice(el = null) {
            const choices = Array.from(this.dropdown.element.querySelectorAll('[data-choice-selectable]'));
            if (!choices.length) {
                return;
            }
            let passedEl = el;
            const highlightedChoices = Array.from(this.dropdown.element.querySelectorAll(`.${ this.config.classNames.highlightedState }`));
            highlightedChoices.forEach(choice => {
                choice.classList.remove(this.config.classNames.highlightedState);
                choice.setAttribute('aria-selected', 'false');
            });
            if (passedEl) {
                this._highlightPosition = choices.indexOf(passedEl);
            } else {
                if (choices.length > this._highlightPosition) {
                    passedEl = choices[this._highlightPosition];
                } else {
                    passedEl = choices[choices.length - 1];
                }
                if (!passedEl) {
                    passedEl = choices[0];
                }
            }
            passedEl.classList.add(this.config.classNames.highlightedState);
            passedEl.setAttribute('aria-selected', 'true');
            this.passedElement.triggerEvent(constants.EVENTS.highlightChoice, { el: passedEl });
            if (this.dropdown.isActive) {
                this.input.setActiveDescendant(passedEl.id);
                this.containerOuter.setActiveDescendant(passedEl.id);
            }
        }
        _addItem({value, label = null, choiceId = -1, groupId = -1, customProperties = null, placeholder = false, keyCode = null}) {
            let passedValue = typeof value === 'string' ? value.trim() : value;
            const passedKeyCode = keyCode;
            const passedCustomProperties = customProperties;
            const {items} = this._store;
            const passedLabel = label || passedValue;
            const passedOptionId = choiceId || -1;
            const group = groupId >= 0 ? this._store.getGroupById(groupId) : null;
            const id = items ? items.length + 1 : 1;
            if (this.config.prependValue) {
                passedValue = this.config.prependValue + passedValue.toString();
            }
            if (this.config.appendValue) {
                passedValue += this.config.appendValue.toString();
            }
            this._store.dispatch(actionsItems.addItem({
                value: passedValue,
                label: passedLabel,
                id,
                choiceId: passedOptionId,
                groupId,
                customProperties,
                placeholder,
                keyCode: passedKeyCode
            }));
            if (this._isSelectOneElement) {
                this.removeActiveItems(id);
            }
            this.passedElement.triggerEvent(constants.EVENTS.addItem, {
                id,
                value: passedValue,
                label: passedLabel,
                customProperties: passedCustomProperties,
                groupValue: group && group.value ? group.value : undefined,
                keyCode: passedKeyCode
            });
            return this;
        }
        _removeItem(item) {
            if (!item || !utils.isType('Object', item)) {
                return this;
            }
            const {id, value, label, choiceId, groupId} = item;
            const group = groupId >= 0 ? this._store.getGroupById(groupId) : null;
            this._store.dispatch(actionsItems.removeItem(id, choiceId));
            if (group && group.value) {
                this.passedElement.triggerEvent(constants.EVENTS.removeItem, {
                    id,
                    value,
                    label,
                    groupValue: group.value
                });
            } else {
                this.passedElement.triggerEvent(constants.EVENTS.removeItem, {
                    id,
                    value,
                    label
                });
            }
            return this;
        }
        _addChoice({value, label = null, isSelected = false, isDisabled = false, groupId = -1, customProperties = null, placeholder = false, keyCode = null}) {
            if (typeof value === 'undefined' || value === null) {
                return;
            }
            const {choices} = this._store;
            const choiceLabel = label || value;
            const choiceId = choices ? choices.length + 1 : 1;
            const choiceElementId = `${ this._baseId }-${ this._idNames.itemChoice }-${ choiceId }`;
            this._store.dispatch(actionsChoices.addChoice({
                id: choiceId,
                groupId,
                elementId: choiceElementId,
                value,
                label: choiceLabel,
                disabled: isDisabled,
                customProperties,
                placeholder,
                keyCode
            }));
            if (isSelected) {
                this._addItem({
                    value,
                    label: choiceLabel,
                    choiceId,
                    customProperties,
                    placeholder,
                    keyCode
                });
            }
        }
        _addGroup({group, id, valueKey = 'value', labelKey = 'label'}) {
            const groupChoices = utils.isType('Object', group) ? group.choices : Array.from(group.getElementsByTagName('OPTION'));
            const groupId = id || Math.floor(new Date().valueOf() * Math.random());
            const isDisabled = group.disabled ? group.disabled : false;
            if (groupChoices) {
                this._store.dispatch(groups.addGroup({
                    value: group.label,
                    id: groupId,
                    active: true,
                    disabled: isDisabled
                }));
                const addGroupChoices = choice => {
                    const isOptDisabled = choice.disabled || choice.parentNode && choice.parentNode.disabled;
                    this._addChoice({
                        value: choice[valueKey],
                        label: utils.isType('Object', choice) ? choice[labelKey] : choice.innerHTML,
                        isSelected: choice.selected,
                        isDisabled: isOptDisabled,
                        groupId,
                        customProperties: choice.customProperties,
                        placeholder: choice.placeholder
                    });
                };
                groupChoices.forEach(addGroupChoices);
            } else {
                this._store.dispatch(groups.addGroup({
                    value: group.label,
                    id: group.id,
                    active: false,
                    disabled: group.disabled
                }));
            }
        }
        _getTemplate(template, ...args) {
            if (!template) {
                return null;
            }
            const {classNames} = this.config;
            return this._templates[template].call(this, classNames, ...args);
        }
        _createTemplates() {
            const {callbackOnCreateTemplates} = this.config;
            let userTemplates = {};
            if (callbackOnCreateTemplates && typeof callbackOnCreateTemplates === 'function') {
                userTemplates = callbackOnCreateTemplates.call(this, utils.strToEl);
            }
            this._templates = merge(TEMPLATES, userTemplates);
        }
        _createElements() {
            this.containerOuter = new components.Container({
                element: this._getTemplate('containerOuter', this._direction, this._isSelectElement, this._isSelectOneElement, this.config.searchEnabled, this.passedElement.element.type),
                classNames: this.config.classNames,
                type: this.passedElement.element.type,
                position: this.config.position
            });
            this.containerInner = new components.Container({
                element: this._getTemplate('containerInner'),
                classNames: this.config.classNames,
                type: this.passedElement.element.type,
                position: this.config.position
            });
            this.input = new components.Input({
                element: this._getTemplate('input', this._placeholderValue),
                classNames: this.config.classNames,
                type: this.passedElement.element.type,
                preventPaste: !this.config.paste
            });
            this.choiceList = new components.List({ element: this._getTemplate('choiceList', this._isSelectOneElement) });
            this.itemList = new components.List({ element: this._getTemplate('itemList', this._isSelectOneElement) });
            this.dropdown = new components.Dropdown({
                element: this._getTemplate('dropdown'),
                classNames: this.config.classNames,
                type: this.passedElement.element.type
            });
        }
        _createStructure() {
            this.passedElement.conceal();
            this.containerInner.wrap(this.passedElement.element);
            this.containerOuter.wrap(this.containerInner.element);
            if (this._isSelectOneElement) {
                this.input.placeholder = this.config.searchPlaceholderValue || '';
            } else if (this._placeholderValue) {
                this.input.placeholder = this._placeholderValue;
                this.input.setWidth();
            }
            this.containerOuter.element.appendChild(this.containerInner.element);
            this.containerOuter.element.appendChild(this.dropdown.element);
            this.containerInner.element.appendChild(this.itemList.element);
            if (!this._isTextElement) {
                this.dropdown.element.appendChild(this.choiceList.element);
            }
            if (!this._isSelectOneElement) {
                this.containerInner.element.appendChild(this.input.element);
            } else if (this.config.searchEnabled) {
                this.dropdown.element.insertBefore(this.input.element, this.dropdown.element.firstChild);
            }
            if (this._isSelectElement) {
                this._highlightPosition = 0;
                this._isSearching = false;
                this._startLoading();
                if (this._presetGroups.length) {
                    this._addPredefinedGroups(this._presetGroups);
                } else {
                    this._addPredefinedChoices(this._presetChoices);
                }
                this._stopLoading();
            }
            if (this._isTextElement) {
                this._addPredefinedItems(this._presetItems);
            }
        }
        _addPredefinedGroups(groups) {
            const placeholderChoice = this.passedElement.placeholderOption;
            if (placeholderChoice && placeholderChoice.parentNode.tagName === 'SELECT') {
                this._addChoice({
                    value: placeholderChoice.value,
                    label: placeholderChoice.innerHTML,
                    isSelected: placeholderChoice.selected,
                    isDisabled: placeholderChoice.disabled,
                    placeholder: true
                });
            }
            groups.forEach(group => this._addGroup({
                group,
                id: group.id || null
            }));
        }
        _addPredefinedChoices(choices) {
            if (this.config.shouldSort) {
                choices.sort(this.config.sorter);
            }
            const hasSelectedChoice = choices.some(choice => choice.selected);
            const firstEnabledChoiceIndex = choices.findIndex(choice => choice.disabled === undefined || !choice.disabled);
            choices.forEach((choice, index) => {
                const {value, label, customProperties, placeholder} = choice;
                if (this._isSelectElement) {
                    if (choice.choices) {
                        this._addGroup({
                            group: choice,
                            id: choice.id || null
                        });
                    } else {
                        const shouldPreselect = this._isSelectOneElement && !hasSelectedChoice && index === firstEnabledChoiceIndex;
                        const isSelected = shouldPreselect ? true : choice.selected;
                        const isDisabled = choice.disabled;
                        this._addChoice({
                            value,
                            label,
                            isSelected,
                            isDisabled,
                            customProperties,
                            placeholder
                        });
                    }
                } else {
                    this._addChoice({
                        value,
                        label,
                        isSelected: choice.selected,
                        isDisabled: choice.disabled,
                        customProperties,
                        placeholder
                    });
                }
            });
        }
        _addPredefinedItems(items) {
            items.forEach(item => {
                if (typeof item === 'object' && item.value) {
                    this._addItem({
                        value: item.value,
                        label: item.label,
                        choiceId: item.id,
                        customProperties: item.customProperties,
                        placeholder: item.placeholder
                    });
                }
                if (typeof item === 'string') {
                    this._addItem({ value: item });
                }
            });
        }
        _setChoiceOrItem(item) {
            const itemType = utils.getType(item).toLowerCase();
            const handleType = {
                object: () => {
                    if (!item.value) {
                        return;
                    }
                    if (!this._isTextElement) {
                        this._addChoice({
                            value: item.value,
                            label: item.label,
                            isSelected: true,
                            isDisabled: false,
                            customProperties: item.customProperties,
                            placeholder: item.placeholder
                        });
                    } else {
                        this._addItem({
                            value: item.value,
                            label: item.label,
                            choiceId: item.id,
                            customProperties: item.customProperties,
                            placeholder: item.placeholder
                        });
                    }
                },
                string: () => {
                    if (!this._isTextElement) {
                        this._addChoice({
                            value: item,
                            label: item,
                            isSelected: true,
                            isDisabled: false
                        });
                    } else {
                        this._addItem({ value: item });
                    }
                }
            };
            handleType[itemType]();
        }
        _findAndSelectChoiceByValue(val) {
            const {choices} = this._store;
            const foundChoice = choices.find(choice => this.config.valueComparer(choice.value, val));
            if (foundChoice && !foundChoice.selected) {
                this._addItem({
                    value: foundChoice.value,
                    label: foundChoice.label,
                    choiceId: foundChoice.id,
                    groupId: foundChoice.groupId,
                    customProperties: foundChoice.customProperties,
                    placeholder: foundChoice.placeholder,
                    keyCode: foundChoice.keyCode
                });
            }
        }
        _generatePlaceholderValue() {
            if (this._isSelectElement) {
                const {placeholderOption} = this.passedElement;
                return placeholderOption ? placeholderOption.text : false;
            }
            const {placeholder, placeholderValue} = this.config;
            const {
                element: {dataset}
            } = this.passedElement;
            if (placeholder) {
                if (placeholderValue) {
                    return placeholderValue;
                }
                if (dataset.placeholder) {
                    return dataset.placeholder;
                }
            }
            return false;
        }
    }
    return Choices;
});