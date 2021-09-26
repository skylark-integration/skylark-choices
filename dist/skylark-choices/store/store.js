/**
 * skylark-choices - A version of choices.js that ported to running on skylarkjs ui.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-choices/
 * @license MIT
 */
define(["skylark-redux","../reducers/index"],function(e,t){"use strict";return class{constructor(){this._store=e.createStore(t,window.__REDUX_DEVTOOLS_EXTENSION__&&window.__REDUX_DEVTOOLS_EXTENSION__())}subscribe(e){this._store.subscribe(e)}dispatch(e){this._store.dispatch(e)}get state(){return this._store.getState()}get items(){return this.state.items}get activeItems(){return this.items.filter(e=>!0===e.active)}get highlightedActiveItems(){return this.items.filter(e=>e.active&&e.highlighted)}get choices(){return this.state.choices}get activeChoices(){return this.choices.filter(e=>!0===e.active)}get selectableChoices(){return this.choices.filter(e=>!0!==e.disabled)}get searchableChoices(){return this.selectableChoices.filter(e=>!0!==e.placeholder)}get placeholderChoice(){return[...this.choices].reverse().find(e=>!0===e.placeholder)}get groups(){return this.state.groups}get activeGroups(){const{groups:e,choices:t}=this;return e.filter(e=>{const i=!0===e.active&&!1===e.disabled,s=t.some(e=>!0===e.active&&!1===e.disabled);return i&&s},[])}isLoading(){return this.state.general.loading}getChoiceById(e){return this.activeChoices.find(t=>t.id===parseInt(e,10))}getGroupById(e){return this.groups.find(t=>t.id===e)}}});
//# sourceMappingURL=../sourcemaps/store/store.js.map
