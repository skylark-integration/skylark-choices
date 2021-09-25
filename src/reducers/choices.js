define(function () {
    'use strict';
    const defaultState = [];
    return function choices(state = defaultState, action) {
        switch (action.type) {
        case 'ADD_CHOICE': {
                return [
                    ...state,
                    {
                        id: action.id,
                        elementId: action.elementId,
                        groupId: action.groupId,
                        value: action.value,
                        label: action.label || action.value,
                        disabled: action.disabled || false,
                        selected: false,
                        active: true,
                        score: 9999,
                        customProperties: action.customProperties,
                        placeholder: action.placeholder || false,
                        keyCode: null
                    }
                ];
            }
        case 'ADD_ITEM': {
                if (action.activateOptions) {
                    return state.map(obj => {
                        const choice = obj;
                        choice.active = action.active;
                        return choice;
                    });
                }
                if (action.choiceId > -1) {
                    return state.map(obj => {
                        const choice = obj;
                        if (choice.id === parseInt(action.choiceId, 10)) {
                            choice.selected = true;
                        }
                        return choice;
                    });
                }
                return state;
            }
        case 'REMOVE_ITEM': {
                if (action.choiceId > -1) {
                    return state.map(obj => {
                        const choice = obj;
                        if (choice.id === parseInt(action.choiceId, 10)) {
                            choice.selected = false;
                        }
                        return choice;
                    });
                }
                return state;
            }
        case 'FILTER_CHOICES': {
                return state.map(obj => {
                    const choice = obj;
                    choice.active = action.results.some(({item, score}) => {
                        if (item.id === choice.id) {
                            choice.score = score;
                            return true;
                        }
                        return false;
                    });
                    return choice;
                });
            }
        case 'ACTIVATE_CHOICES': {
                return state.map(obj => {
                    const choice = obj;
                    choice.active = action.active;
                    return choice;
                });
            }
        case 'CLEAR_CHOICES': {
                return defaultState;
            }
        default: {
                return state;
            }
        }
    };
});