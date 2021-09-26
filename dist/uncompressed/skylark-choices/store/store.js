define([
    'skylark-redux',
    '../reducers/index'
], function (redux, rootReducer) {
    'use strict';
    return class Store {
        constructor() {
            this._store = redux.createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
        }
        subscribe(onChange) {
            this._store.subscribe(onChange);
        }
        dispatch(action) {
            this._store.dispatch(action);
        }
        get state() {
            return this._store.getState();
        }
        get items() {
            return this.state.items;
        }
        get activeItems() {
            return this.items.filter(item => item.active === true);
        }
        get highlightedActiveItems() {
            return this.items.filter(item => item.active && item.highlighted);
        }
        get choices() {
            return this.state.choices;
        }
        get activeChoices() {
            return this.choices.filter(choice => choice.active === true);
        }
        get selectableChoices() {
            return this.choices.filter(choice => choice.disabled !== true);
        }
        get searchableChoices() {
            return this.selectableChoices.filter(choice => choice.placeholder !== true);
        }
        get placeholderChoice() {
            return [...this.choices].reverse().find(choice => choice.placeholder === true);
        }
        get groups() {
            return this.state.groups;
        }
        get activeGroups() {
            const {groups, choices} = this;
            return groups.filter(group => {
                const isActive = group.active === true && group.disabled === false;
                const hasActiveOptions = choices.some(choice => choice.active === true && choice.disabled === false);
                return isActive && hasActiveOptions;
            }, []);
        }
        isLoading() {
            return this.state.general.loading;
        }
        getChoiceById(id) {
            return this.activeChoices.find(choice => choice.id === parseInt(id, 10));
        }
        getGroupById(id) {
            return this.groups.find(group => group.id === id);
        }
    };
});