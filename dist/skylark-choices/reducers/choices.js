/**
 * skylark-choices - A version of choices.js that ported to running on skylarkjs ui.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-choices/
 * @license MIT
 */
define(function(){"use strict";const e=[];return function(t=e,c){switch(c.type){case"ADD_CHOICE":return[...t,{id:c.id,elementId:c.elementId,groupId:c.groupId,value:c.value,label:c.label||c.value,disabled:c.disabled||!1,selected:!1,active:!0,score:9999,customProperties:c.customProperties,placeholder:c.placeholder||!1,keyCode:null}];case"ADD_ITEM":return c.activateOptions?t.map(e=>{const t=e;return t.active=c.active,t}):c.choiceId>-1?t.map(e=>{const t=e;return t.id===parseInt(c.choiceId,10)&&(t.selected=!0),t}):t;case"REMOVE_ITEM":return c.choiceId>-1?t.map(e=>{const t=e;return t.id===parseInt(c.choiceId,10)&&(t.selected=!1),t}):t;case"FILTER_CHOICES":return t.map(e=>{const t=e;return t.active=c.results.some(({item:e,score:c})=>e.id===t.id&&(t.score=c,!0)),t});case"ACTIVATE_CHOICES":return t.map(e=>{const t=e;return t.active=c.active,t});case"CLEAR_CHOICES":return e;default:return t}}});
//# sourceMappingURL=../sourcemaps/reducers/choices.js.map
