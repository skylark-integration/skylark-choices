define([
    'skylark-redux',
    './items',
    './groups',
    './choices',
    './general',
    '../lib/utils'
], function (redux, items, groups, choices, general, utils) {
    'use strict';
    const appReducer = redux.combineReducers({
        items,
        groups,
        choices,
        general
    });
    const rootReducer = (passedState, action) => {
        let state = passedState;
        if (action.type === 'CLEAR_ALL') {
            state = undefined;
        } else if (action.type === 'RESET_TO') {
            return utils.cloneObject(action.state);
        }
        return appReducer(state, action);
    };
    return rootReducer;
});