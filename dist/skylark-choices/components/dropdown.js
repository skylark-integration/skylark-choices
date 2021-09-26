/**
 * skylark-choices - A version of choices.js that ported to running on skylarkjs ui.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-choices/
 * @license MIT
 */
define(function(){"use strict";return class{constructor({element:e,type:t,classNames:s}){this.element=e,this.classNames=s,this.type=t,this.isActive=!1}get distanceFromTopWindow(){return this.element.getBoundingClientRect().bottom}getChild(e){return this.element.querySelector(e)}show(){return this.element.classList.add(this.classNames.activeState),this.element.setAttribute("aria-expanded","true"),this.isActive=!0,this}hide(){return this.element.classList.remove(this.classNames.activeState),this.element.setAttribute("aria-expanded","false"),this.isActive=!1,this}}});
//# sourceMappingURL=../sourcemaps/components/dropdown.js.map
