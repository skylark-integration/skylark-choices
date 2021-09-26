/**
 * skylark-choices - A version of choices.js that ported to running on skylarkjs ui.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-choices/
 * @license MIT
 */
define(["../constants"],function(e){"use strict";return{addChoice:({value:t,label:C,id:d,groupId:l,disabled:i,elementId:o,customProperties:s,placeholder:a,keyCode:c})=>({type:e.ACTION_TYPES.ADD_CHOICE,value:t,label:C,id:d,groupId:l,disabled:i,elementId:o,customProperties:s,placeholder:a,keyCode:c}),filterChoices:t=>({type:e.ACTION_TYPES.FILTER_CHOICES,results:t}),activateChoices:(t=!0)=>({type:e.ACTION_TYPES.ACTIVATE_CHOICES,active:t}),clearChoices:()=>({type:e.ACTION_TYPES.CLEAR_CHOICES})}});
//# sourceMappingURL=../sourcemaps/actions/choices.js.map
