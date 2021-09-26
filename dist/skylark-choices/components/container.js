/**
 * skylark-choices - A version of choices.js that ported to running on skylarkjs ui.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-choices/
 * @license MIT
 */
define(["../lib/utils","../constants"],function(e,t){"use strict";return class{constructor({element:e,type:t,classNames:s,position:i}){this.element=e,this.classNames=s,this.type=t,this.position=i,this.isOpen=!1,this.isFlipped=!1,this.isFocussed=!1,this.isDisabled=!1,this.isLoading=!1,this._onFocus=this._onFocus.bind(this),this._onBlur=this._onBlur.bind(this)}addEventListeners(){this.element.addEventListener("focus",this._onFocus),this.element.addEventListener("blur",this._onBlur)}removeEventListeners(){this.element.removeEventListener("focus",this._onFocus),this.element.removeEventListener("blur",this._onBlur)}shouldFlip(e){if("number"!=typeof e)return!1;let t=!1;return"auto"===this.position?t=!window.matchMedia(`(min-height: ${e+1}px)`).matches:"top"===this.position&&(t=!0),t}setActiveDescendant(e){this.element.setAttribute("aria-activedescendant",e)}removeActiveDescendant(){this.element.removeAttribute("aria-activedescendant")}open(e){this.element.classList.add(this.classNames.openState),this.element.setAttribute("aria-expanded","true"),this.isOpen=!0,this.shouldFlip(e)&&(this.element.classList.add(this.classNames.flippedState),this.isFlipped=!0)}close(){this.element.classList.remove(this.classNames.openState),this.element.setAttribute("aria-expanded","false"),this.removeActiveDescendant(),this.isOpen=!1,this.isFlipped&&(this.element.classList.remove(this.classNames.flippedState),this.isFlipped=!1)}focus(){this.isFocussed||this.element.focus()}addFocusState(){this.element.classList.add(this.classNames.focusState)}removeFocusState(){this.element.classList.remove(this.classNames.focusState)}enable(){this.element.classList.remove(this.classNames.disabledState),this.element.removeAttribute("aria-disabled"),this.type===t.SELECT_ONE_TYPE&&this.element.setAttribute("tabindex","0"),this.isDisabled=!1}disable(){this.element.classList.add(this.classNames.disabledState),this.element.setAttribute("aria-disabled","true"),this.type===t.SELECT_ONE_TYPE&&this.element.setAttribute("tabindex","-1"),this.isDisabled=!0}wrap(t){e.wrap(t,this.element)}unwrap(e){this.element.parentNode.insertBefore(e,this.element),this.element.parentNode.removeChild(this.element)}addLoadingState(){this.element.classList.add(this.classNames.loadingState),this.element.setAttribute("aria-busy","true"),this.isLoading=!0}removeLoadingState(){this.element.classList.remove(this.classNames.loadingState),this.element.removeAttribute("aria-busy"),this.isLoading=!1}_onFocus(){this.isFocussed=!0}_onBlur(){this.isFocussed=!1}}});
//# sourceMappingURL=../sourcemaps/components/container.js.map
