/**
 * skylark-choices - A version of choices.js that ported to running on skylarkjs ui.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-choices/
 * @license MIT
 */
define(function(){"use strict";const e=[];return function(t=e,i){switch(i.type){case"ADD_GROUP":return[...t,{id:i.id,value:i.value,active:i.active,disabled:i.disabled}];case"CLEAR_CHOICES":return[];default:return t}}});
//# sourceMappingURL=../sourcemaps/reducers/groups.js.map
