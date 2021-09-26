/**
 * skylark-choices - A version of choices.js that ported to running on skylarkjs ui.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-choices/
 * @license MIT
 */
define(["./wrapped-element"],function(e){"use strict";return class extends e{constructor({element:e,classNames:t,delimiter:s}){super({element:e,classNames:t}),this.delimiter=s}get value(){return this.element.value}set value(e){const t=e.map(({value:e})=>e).join(this.delimiter);this.element.setAttribute("value",t),this.element.value=t}}});
//# sourceMappingURL=../sourcemaps/components/wrapped-input.js.map
