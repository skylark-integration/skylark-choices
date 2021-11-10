/**
 * skylark-choices - A version of choices.js that ported to running on skylarkjs ui.
 * @author Hudaokeji, Inc.
 * @version v0.9.0
 * @link https://github.com/skylark-integration/skylark-choices/
 * @license MIT
 */
define(["./vendors/fuse","./vendors/deepmerge","./store/store","./components/index","./constants","./templates","./actions/choices","./actions/items","./actions/groups","./actions/misc","./lib/utils"],function(e,t,i,s,n,o,h,r,l,a,c){"use strict";const u="-ms-scroll-limit"in document.documentElement.style&&"-ms-ime-align"in document.documentElement.style,m={};class p{static get defaults(){return Object.preventExtensions({get options(){return m},get templates(){return o}})}constructor(e="[data-choice]",o={}){this.config=t.all([n.DEFAULT_CONFIG,p.defaults.options,o],{arrayMerge:(e,t)=>[...t]});const h=c.diff(this.config,n.DEFAULT_CONFIG);h.length&&console.warn("Unknown config option(s) passed",h.join(", "));const r="string"==typeof e?document.querySelector(e):e;if(!(r instanceof HTMLInputElement||r instanceof HTMLSelectElement))throw TypeError("Expected one of the following types text|select-one|select-multiple");if(this._isTextElement=r.type===n.TEXT_TYPE,this._isSelectOneElement=r.type===n.SELECT_ONE_TYPE,this._isSelectMultipleElement=r.type===n.SELECT_MULTIPLE_TYPE,this._isSelectElement=this._isSelectOneElement||this._isSelectMultipleElement,this.config.searchEnabled=this._isSelectMultipleElement||this.config.searchEnabled,["auto","always"].includes(this.config.renderSelectedChoices)||(this.config.renderSelectedChoices="auto"),o.addItemFilter&&"function"!=typeof o.addItemFilter){const e=o.addItemFilter instanceof RegExp?o.addItemFilter:new RegExp(o.addItemFilter);this.config.addItemFilter=e.test.bind(e)}if(this._isTextElement?this.passedElement=new s.WrappedInput({element:r,classNames:this.config.classNames,delimiter:this.config.delimiter}):this.passedElement=new s.WrappedSelect({element:r,classNames:this.config.classNames,template:e=>this._templates.option(e)}),this.initialised=!1,this._store=new i,this._initialState={},this._currentState={},this._prevState={},this._currentValue="",this._canSearch=this.config.searchEnabled,this._isScrollingOnIe=!1,this._highlightPosition=0,this._wasTap=!0,this._placeholderValue=this._generatePlaceholderValue(),this._baseId=c.generateId(this.passedElement.element,"choices-"),this._direction=this.passedElement.dir,!this._direction){const{direction:e}=window.getComputedStyle(this.passedElement.element),{direction:t}=window.getComputedStyle(document.documentElement);e!==t&&(this._direction=e)}if(this._idNames={itemChoice:"item-choice"},this._presetGroups=this.passedElement.optionGroups,this._presetOptions=this.passedElement.options,this._presetChoices=this.config.choices,this._presetItems=this.config.items,this.passedElement.value&&(this._presetItems=this._presetItems.concat(this.passedElement.value.split(this.config.delimiter))),this.passedElement.options&&this.passedElement.options.forEach(e=>{this._presetChoices.push({value:e.value,label:e.innerHTML,selected:e.selected,disabled:e.disabled||e.parentNode.disabled,placeholder:""===e.value||e.hasAttribute("placeholder"),customProperties:e.getAttribute("data-custom-properties")})}),this._render=this._render.bind(this),this._onFocus=this._onFocus.bind(this),this._onBlur=this._onBlur.bind(this),this._onKeyUp=this._onKeyUp.bind(this),this._onKeyDown=this._onKeyDown.bind(this),this._onClick=this._onClick.bind(this),this._onTouchMove=this._onTouchMove.bind(this),this._onTouchEnd=this._onTouchEnd.bind(this),this._onMouseDown=this._onMouseDown.bind(this),this._onMouseOver=this._onMouseOver.bind(this),this._onFormReset=this._onFormReset.bind(this),this._onAKey=this._onAKey.bind(this),this._onEnterKey=this._onEnterKey.bind(this),this._onEscapeKey=this._onEscapeKey.bind(this),this._onDirectionKey=this._onDirectionKey.bind(this),this._onDeleteKey=this._onDeleteKey.bind(this),this.passedElement.isActive)return this.config.silent||console.warn("Trying to initialise Choices on element already initialised"),void(this.initialised=!0);this.init()}init(){if(this.initialised)return;this._createTemplates(),this._createElements(),this._createStructure(),this._initialState=c.cloneObject(this._store.state),this._store.subscribe(this._render),this._render(),this._addEventListeners(),(!this.config.addItems||this.passedElement.element.hasAttribute("disabled"))&&this.disable(),this.initialised=!0;const{callbackOnInit:e}=this.config;e&&"function"==typeof e&&e.call(this)}destroy(){this.initialised&&(this._removeEventListeners(),this.passedElement.reveal(),this.containerOuter.unwrap(this.passedElement.element),this.clearStore(),this._isSelectElement&&(this.passedElement.options=this._presetOptions),this._templates=null,this.initialised=!1)}enable(){return this.passedElement.isDisabled&&this.passedElement.enable(),this.containerOuter.isDisabled&&(this._addEventListeners(),this.input.enable(),this.containerOuter.enable()),this}disable(){return this.passedElement.isDisabled||this.passedElement.disable(),this.containerOuter.isDisabled||(this._removeEventListeners(),this.input.disable(),this.containerOuter.disable()),this}highlightItem(e,t=!0){if(!e)return this;const{id:i,groupId:s=-1,value:o="",label:h=""}=e,l=s>=0?this._store.getGroupById(s):null;return this._store.dispatch(r.highlightItem(i,!0)),t&&this.passedElement.triggerEvent(n.EVENTS.highlightItem,{id:i,value:o,label:h,groupValue:l&&l.value?l.value:null}),this}unhighlightItem(e){if(!e)return this;const{id:t,groupId:i=-1,value:s="",label:o=""}=e,h=i>=0?this._store.getGroupById(i):null;return this._store.dispatch(r.highlightItem(t,!1)),this.passedElement.triggerEvent(n.EVENTS.highlightItem,{id:t,value:s,label:o,groupValue:h&&h.value?h.value:null}),this}highlightAll(){return this._store.items.forEach(e=>this.highlightItem(e)),this}unhighlightAll(){return this._store.items.forEach(e=>this.unhighlightItem(e)),this}removeActiveItemsByValue(e){return this._store.activeItems.filter(t=>t.value===e).forEach(e=>this._removeItem(e)),this}removeActiveItems(e){return this._store.activeItems.filter(({id:t})=>t!==e).forEach(e=>this._removeItem(e)),this}removeHighlightedItems(e=!1){return this._store.highlightedActiveItems.forEach(t=>{this._removeItem(t),e&&this._triggerChange(t.value)}),this}showDropdown(e){return this.dropdown.isActive?this:(requestAnimationFrame(()=>{this.dropdown.show(),this.containerOuter.open(this.dropdown.distanceFromTopWindow),!e&&this._canSearch&&this.input.focus(),this.passedElement.triggerEvent(n.EVENTS.showDropdown,{})}),this)}hideDropdown(e){return this.dropdown.isActive?(requestAnimationFrame(()=>{this.dropdown.hide(),this.containerOuter.close(),!e&&this._canSearch&&(this.input.removeActiveDescendant(),this.input.blur()),this.passedElement.triggerEvent(n.EVENTS.hideDropdown,{})}),this):this}getValue(e=!1){const t=this._store.activeItems.reduce((t,i)=>{const s=e?i.value:i;return t.push(s),t},[]);return this._isSelectOneElement?t[0]:t}setValue(e){return this.initialised?(e.forEach(e=>this._setChoiceOrItem(e)),this):this}setChoiceByValue(e){if(!this.initialised||this._isTextElement)return this;return(Array.isArray(e)?e:[e]).forEach(e=>this._findAndSelectChoiceByValue(e)),this}setChoices(e=[],t="value",i="label",s=!1){if(!this.initialised)throw new ReferenceError("setChoices was called on a non-initialized instance of Choices");if(!this._isSelectElement)throw new TypeError("setChoices can't be used with INPUT based Choices");if("string"!=typeof t||!t)throw new TypeError("value parameter must be a name of 'value' field in passed objects");if(s&&this.clearChoices(),"function"==typeof e){const n=e(this);if("function"==typeof Promise&&n instanceof Promise)return new Promise(e=>requestAnimationFrame(e)).then(()=>this._handleLoadingState(!0)).then(()=>n).then(e=>this.setChoices(e,t,i,s)).catch(e=>{this.config.silent||console.error(e)}).then(()=>this._handleLoadingState(!1)).then(()=>this);if(!Array.isArray(n))throw new TypeError(`.setChoices first argument function must return either array of choices or Promise, got: ${typeof n}`);return this.setChoices(n,t,i,!1)}if(!Array.isArray(e))throw new TypeError(".setChoices must be called either with array of choices with a function resulting into Promise of array of choices");return this.containerOuter.removeLoadingState(),this._startLoading(),e.forEach(e=>{e.choices?this._addGroup({id:parseInt(e.id,10)||null,group:e,valueKey:t,labelKey:i}):this._addChoice({value:e[t],label:e[i],isSelected:e.selected,isDisabled:e.disabled,customProperties:e.customProperties,placeholder:e.placeholder})}),this._stopLoading(),this}clearChoices(){return this._store.dispatch(h.clearChoices()),this}clearStore(){return this._store.dispatch(a.clearAll()),this}clearInput(){const e=!this._isSelectOneElement;return this.input.clear(e),!this._isTextElement&&this._canSearch&&(this._isSearching=!1,this._store.dispatch(d.activateChoices(!0))),this}_render(){if(this._store.isLoading())return;this._currentState=this._store.state;const e=this._currentState.choices!==this._prevState.choices||this._currentState.groups!==this._prevState.groups||this._currentState.items!==this._prevState.items,t=this._isSelectElement,i=this._currentState.items!==this._prevState.items;e&&(t&&this._renderChoices(),i&&this._renderItems(),this._prevState=this._currentState)}_renderChoices(){const{activeGroups:e,activeChoices:t}=this._store;let i=document.createDocumentFragment();if(this.choiceList.clear(),this.config.resetScrollPosition&&requestAnimationFrame(()=>this.choiceList.scrollToTop()),e.length>=1&&!this._isSearching){const s=t.filter(e=>!0===e.placeholder&&-1===e.groupId);s.length>=1&&(i=this._createChoicesFragment(s,i)),i=this._createGroupsFragment(e,t,i)}else t.length>=1&&(i=this._createChoicesFragment(t,i));if(i.childNodes&&i.childNodes.length>0){const{activeItems:e}=this._store,t=this._canAddItem(e,this.input.value);t.response?(this.choiceList.append(i),this._highlightChoice()):this.choiceList.append(this._getTemplate("notice",t.notice))}else{let e,t;this._isSearching?(t="function"==typeof this.config.noResultsText?this.config.noResultsText():this.config.noResultsText,e=this._getTemplate("notice",t,"no-results")):(t="function"==typeof this.config.noChoicesText?this.config.noChoicesText():this.config.noChoicesText,e=this._getTemplate("notice",t,"no-choices")),this.choiceList.append(e)}}_renderItems(){const e=this._store.activeItems||[];this.itemList.clear();const t=this._createItemsFragment(e);t.childNodes&&this.itemList.append(t)}_createGroupsFragment(e,t,i=document.createDocumentFragment()){const s=e=>t.filter(t=>this._isSelectOneElement?t.groupId===e.id:t.groupId===e.id&&("always"===this.config.renderSelectedChoices||!t.selected));return this.config.shouldSort&&e.sort(this.config.sorter),e.forEach(e=>{const t=s(e);if(t.length>=1){const s=this._getTemplate("choiceGroup",e);i.appendChild(s),this._createChoicesFragment(t,i,!0)}}),i}_createChoicesFragment(e,t=document.createDocumentFragment(),i=!1){const{renderSelectedChoices:s,searchResultLimit:n,renderChoiceLimit:o}=this.config,h=this._isSearching?c.sortByScore:this.config.sorter,r=e=>{if("auto"!==s||(this._isSelectOneElement||!e.selected)){const i=this._getTemplate("choice",e,this.config.itemSelectText);t.appendChild(i)}};let l=e;"auto"!==s||this._isSelectOneElement||(l=e.filter(e=>!e.selected));const{placeholderChoices:a,normalChoices:d}=l.reduce((e,t)=>(t.placeholder?e.placeholderChoices.push(t):e.normalChoices.push(t),e),{placeholderChoices:[],normalChoices:[]});(this.config.shouldSort||this._isSearching)&&d.sort(h);let u=l.length;const m=this._isSelectOneElement?[...a,...d]:d;this._isSearching?u=n:o&&o>0&&!i&&(u=o);for(let e=0;e<u;e+=1)m[e]&&r(m[e]);return t}_createItemsFragment(e,t=document.createDocumentFragment()){const{shouldSortItems:i,sorter:s,removeItemButton:n}=this.config;i&&!this._isSelectOneElement&&e.sort(s),this._isTextElement?this.passedElement.value=e:this.passedElement.options=e;return e.forEach(e=>{const i=this._getTemplate("item",e,n);t.appendChild(i)}),t}_triggerChange(e){void 0!==e&&null!==e&&this.passedElement.triggerEvent(n.EVENTS.change,{value:e})}_selectPlaceholderChoice(){const{placeholderChoice:e}=this._store;e&&(this._addItem({value:e.value,label:e.label,choiceId:e.id,groupId:e.groupId,placeholder:e.placeholder}),this._triggerChange(e.value))}_handleButtonAction(e,t){if(!(e&&t&&this.config.removeItems&&this.config.removeItemButton))return;const i=t.parentNode.getAttribute("data-id"),s=e.find(e=>e.id===parseInt(i,10));this._removeItem(s),this._triggerChange(s.value),this._isSelectOneElement&&this._selectPlaceholderChoice()}_handleItemAction(e,t,i=!1){if(!e||!t||!this.config.removeItems||this._isSelectOneElement)return;const s=t.getAttribute("data-id");e.forEach(e=>{e.id!==parseInt(s,10)||e.highlighted?!i&&e.highlighted&&this.unhighlightItem(e):this.highlightItem(e)}),this.input.focus()}_handleChoiceAction(e,t){if(!e||!t)return;const{id:i}=t.dataset,s=this._store.getChoiceById(i);if(!s)return;const o=e[0]&&e[0].keyCode?e[0].keyCode:null,h=this.dropdown.isActive;if(s.keyCode=o,this.passedElement.triggerEvent(n.EVENTS.choice,{choice:s}),!s.selected&&!s.disabled){this._canAddItem(e,s.value).response&&(this._addItem({value:s.value,label:s.label,choiceId:s.id,groupId:s.groupId,customProperties:s.customProperties,placeholder:s.placeholder,keyCode:s.keyCode}),this._triggerChange(s.value))}this.clearInput(),h&&this._isSelectOneElement&&(this.hideDropdown(!0),this.containerOuter.focus())}_handleBackspace(e){if(!this.config.removeItems||!e)return;const t=e[e.length-1],i=e.some(e=>e.highlighted);this.config.editItems&&!i&&t?(this.input.value=t.value,this.input.setWidth(),this._removeItem(t),this._triggerChange(t.value)):(i||this.highlightItem(t,!1),this.removeHighlightedItems(!0))}_startLoading(){this._store.dispatch(a.setIsLoading(!0))}_stopLoading(){this._store.dispatch(a.setIsLoading(!1))}_handleLoadingState(e=!0){let t=this.itemList.getChild(`.${this.config.classNames.placeholder}`);e?(this.disable(),this.containerOuter.addLoadingState(),this._isSelectOneElement?t?t.innerHTML=this.config.loadingText:(t=this._getTemplate("placeholder",this.config.loadingText),this.itemList.append(t)):this.input.placeholder=this.config.loadingText):(this.enable(),this.containerOuter.removeLoadingState(),this._isSelectOneElement?t.innerHTML=this._placeholderValue||"":this.input.placeholder=this._placeholderValue||"")}_handleSearch(e){if(!e||!this.input.isFocussed)return;const{choices:t}=this._store,{searchFloor:i,searchChoices:s}=this.config,o=t.some(e=>!e.active);if(e&&e.length>=i){const t=s?this._searchChoices(e):0;this.passedElement.triggerEvent(n.EVENTS.search,{value:e,resultCount:t})}else o&&(this._isSearching=!1,this._store.dispatch(d.activateChoices(!0)))}_canAddItem(e,t){let i=!0,s="function"==typeof this.config.addItemText?this.config.addItemText(t):this.config.addItemText;if(!this._isSelectOneElement){const n=c.existsInArray(e,t);this.config.maxItemCount>0&&this.config.maxItemCount<=e.length&&(i=!1,s="function"==typeof this.config.maxItemText?this.config.maxItemText(this.config.maxItemCount):this.config.maxItemText),!this.config.duplicateItemsAllowed&&n&&i&&(i=!1,s="function"==typeof this.config.uniqueItemText?this.config.uniqueItemText(t):this.config.uniqueItemText),this._isTextElement&&this.config.addItems&&i&&"function"==typeof this.config.addItemFilter&&!this.config.addItemFilter(t)&&(i=!1,s="function"==typeof this.config.customAddItemText?this.config.customAddItemText(t):this.config.customAddItemText)}return{response:i,notice:s}}_searchChoices(t){const i="string"==typeof t?t.trim():t,s="string"==typeof this._currentValue?this._currentValue.trim():this._currentValue;if(i.length<1&&i===`${s} `)return 0;const n=this._store.searchableChoices,o=i,r=[...this.config.searchFields],l=Object.assign(this.config.fuseOptions,{keys:r}),a=new e(n,l).search(o);return this._currentValue=i,this._highlightPosition=0,this._isSearching=!0,this._store.dispatch(h.filterChoices(a)),a.length}_addEventListeners(){const{documentElement:e}=document;e.addEventListener("touchend",this._onTouchEnd,!0),this.containerOuter.element.addEventListener("keydown",this._onKeyDown,!0),this.containerOuter.element.addEventListener("mousedown",this._onMouseDown,!0),e.addEventListener("click",this._onClick,{passive:!0}),e.addEventListener("touchmove",this._onTouchMove,{passive:!0}),this.dropdown.element.addEventListener("mouseover",this._onMouseOver,{passive:!0}),this._isSelectOneElement&&(this.containerOuter.element.addEventListener("focus",this._onFocus,{passive:!0}),this.containerOuter.element.addEventListener("blur",this._onBlur,{passive:!0})),this.input.element.addEventListener("keyup",this._onKeyUp,{passive:!0}),this.input.element.addEventListener("focus",this._onFocus,{passive:!0}),this.input.element.addEventListener("blur",this._onBlur,{passive:!0}),this.input.element.form&&this.input.element.form.addEventListener("reset",this._onFormReset,{passive:!0}),this.input.addEventListeners()}_removeEventListeners(){const{documentElement:e}=document;e.removeEventListener("touchend",this._onTouchEnd,!0),this.containerOuter.element.removeEventListener("keydown",this._onKeyDown,!0),this.containerOuter.element.removeEventListener("mousedown",this._onMouseDown,!0),e.removeEventListener("click",this._onClick),e.removeEventListener("touchmove",this._onTouchMove),this.dropdown.element.removeEventListener("mouseover",this._onMouseOver),this._isSelectOneElement&&(this.containerOuter.element.removeEventListener("focus",this._onFocus),this.containerOuter.element.removeEventListener("blur",this._onBlur)),this.input.element.removeEventListener("keyup",this._onKeyUp),this.input.element.removeEventListener("focus",this._onFocus),this.input.element.removeEventListener("blur",this._onBlur),this.input.element.form&&this.input.element.form.removeEventListener("reset",this._onFormReset),this.input.removeEventListeners()}_onKeyDown(e){const{target:t,keyCode:i,ctrlKey:s,metaKey:o}=e,{activeItems:h}=this._store,r=this.input.isFocussed,l=this.dropdown.isActive,a=this.itemList.hasChildren(),c=String.fromCharCode(i),{BACK_KEY:d,DELETE_KEY:u,ENTER_KEY:m,A_KEY:p,ESC_KEY:_,UP_KEY:g,DOWN_KEY:E,PAGE_UP_KEY:f,PAGE_DOWN_KEY:v}=n.KEY_CODES,I=s||o;!this._isTextElement&&/[a-zA-Z0-9-_ ]/.test(c)&&this.showDropdown();const S={[p]:this._onAKey,[m]:this._onEnterKey,[_]:this._onEscapeKey,[g]:this._onDirectionKey,[f]:this._onDirectionKey,[E]:this._onDirectionKey,[v]:this._onDirectionKey,[u]:this._onDeleteKey,[d]:this._onDeleteKey};S[i]&&S[i]({event:e,target:t,keyCode:i,metaKey:o,activeItems:h,hasFocusedInput:r,hasActiveDropdown:l,hasItems:a,hasCtrlDownKeyPressed:I})}_onKeyUp({target:e,keyCode:t}){const{value:i}=this.input,{activeItems:s}=this._store,o=this._canAddItem(s,i),{BACK_KEY:r,DELETE_KEY:l}=n.KEY_CODES;if(this._isTextElement){if(o.notice&&i){const e=this._getTemplate("notice",o.notice);this.dropdown.element.innerHTML=e.outerHTML,this.showDropdown(!0)}else this.hideDropdown(!0)}else{const i=(t===r||t===l)&&!e.value,s=!this._isTextElement&&this._isSearching,n=this._canSearch&&o.response;i&&s?(this._isSearching=!1,this._store.dispatch(h.activateChoices(!0))):n&&this._handleSearch(this.input.value)}this._canSearch=this.config.searchEnabled}_onAKey({hasItems:e,hasCtrlDownKeyPressed:t}){if(t&&e){this._canSearch=!1,this.config.removeItems&&!this.input.value&&this.input.element===document.activeElement&&this.highlightAll()}}_onEnterKey({event:e,target:t,activeItems:i,hasActiveDropdown:s}){const{ENTER_KEY:o}=n.KEY_CODES,h=t.hasAttribute("data-button");if(this._isTextElement&&t.value){const{value:e}=this.input;this._canAddItem(i,e).response&&(this.hideDropdown(!0),this._addItem({value:e}),this._triggerChange(e),this.clearInput())}if(h&&(this._handleButtonAction(i,t),e.preventDefault()),s){const t=this.dropdown.getChild(`.${this.config.classNames.highlightedState}`);t&&(i[0]&&(i[0].keyCode=o),this._handleChoiceAction(i,t)),e.preventDefault()}else this._isSelectOneElement&&(this.showDropdown(),e.preventDefault())}_onEscapeKey({hasActiveDropdown:e}){e&&(this.hideDropdown(!0),this.containerOuter.focus())}_onDirectionKey({event:e,hasActiveDropdown:t,keyCode:i,metaKey:s}){const{DOWN_KEY:o,PAGE_UP_KEY:h,PAGE_DOWN_KEY:r}=n.KEY_CODES;if(t||this._isSelectOneElement){this.showDropdown(),this._canSearch=!1;const t=i===o||i===r?1:-1,n="[data-choice-selectable]";let l;if(s||i===r||i===h)l=t>0?this.dropdown.element.querySelector(`${n}:last-of-type`):this.dropdown.element.querySelector(n);else{const e=this.dropdown.element.querySelector(`.${this.config.classNames.highlightedState}`);l=e?c.getAdjacentEl(e,n,t):this.dropdown.element.querySelector(n)}l&&(c.isScrolledIntoView(l,this.choiceList.element,t)||this.choiceList.scrollToChildElement(l,t),this._highlightChoice(l)),e.preventDefault()}}_onDeleteKey({event:e,target:t,hasFocusedInput:i,activeItems:s}){!i||t.value||this._isSelectOneElement||(this._handleBackspace(s),e.preventDefault())}_onTouchMove(){this._wasTap&&(this._wasTap=!1)}_onTouchEnd(e){const{target:t}=e||e.touches[0];if(this._wasTap&&this.containerOuter.element.contains(t)){(t===this.containerOuter.element||t===this.containerInner.element)&&(this._isTextElement?this.input.focus():this._isSelectMultipleElement&&this.showDropdown()),e.stopPropagation()}this._wasTap=!0}_onMouseDown(e){const{target:t}=e;if(!(t instanceof HTMLElement))return;if(u&&this.choiceList.element.contains(t)){const t=this.choiceList.element.firstElementChild,i="ltr"===this._direction?e.offsetX>=t.offsetWidth:e.offsetX<t.offsetLeft;this._isScrollingOnIe=i}if(t===this.input.element)return;const i=t.closest("[data-button],[data-item],[data-choice]");if(i instanceof HTMLElement){const t=e.shiftKey,{activeItems:s}=this._store,{dataset:n}=i;"button"in n?this._handleButtonAction(s,i):"item"in n?this._handleItemAction(s,i,t):"choice"in n&&this._handleChoiceAction(s,i)}e.preventDefault()}_onMouseOver({target:e}){e instanceof HTMLElement&&"choice"in e.dataset&&this._highlightChoice(e)}_onClick({target:e}){if(this.containerOuter.element.contains(e))this.dropdown.isActive||this.containerOuter.isDisabled?this._isSelectOneElement&&e!==this.input.element&&!this.dropdown.element.contains(e)&&this.hideDropdown():this._isTextElement?document.activeElement!==this.input.element&&this.input.focus():(this.showDropdown(),this.containerOuter.focus());else{this._store.highlightedActiveItems.length>0&&this.unhighlightAll(),this.containerOuter.removeFocusState(),this.hideDropdown(!0)}}_onFocus({target:e}){this.containerOuter.element.contains(e)&&{[n.TEXT_TYPE]:()=>{e===this.input.element&&this.containerOuter.addFocusState()},[n.SELECT_ONE_TYPE]:()=>{this.containerOuter.addFocusState(),e===this.input.element&&this.showDropdown(!0)},[n.SELECT_MULTIPLE_TYPE]:()=>{e===this.input.element&&(this.showDropdown(!0),this.containerOuter.addFocusState())}}[this.passedElement.element.type]()}_onBlur({target:e}){if(this.containerOuter.element.contains(e)&&!this._isScrollingOnIe){const{activeItems:t}=this._store,i=t.some(e=>e.highlighted);({[n.TEXT_TYPE]:()=>{e===this.input.element&&(this.containerOuter.removeFocusState(),i&&this.unhighlightAll(),this.hideDropdown(!0))},[n.SELECT_ONE_TYPE]:()=>{this.containerOuter.removeFocusState(),(e===this.input.element||e===this.containerOuter.element&&!this._canSearch)&&this.hideDropdown(!0)},[n.SELECT_MULTIPLE_TYPE]:()=>{e===this.input.element&&(this.containerOuter.removeFocusState(),this.hideDropdown(!0),i&&this.unhighlightAll())}})[this.passedElement.element.type]()}else this._isScrollingOnIe=!1,this.input.element.focus()}_onFormReset(){this._store.dispatch(a.resetTo(this._initialState))}_highlightChoice(e=null){const t=Array.from(this.dropdown.element.querySelectorAll("[data-choice-selectable]"));if(!t.length)return;let i=e;Array.from(this.dropdown.element.querySelectorAll(`.${this.config.classNames.highlightedState}`)).forEach(e=>{e.classList.remove(this.config.classNames.highlightedState),e.setAttribute("aria-selected","false")}),i?this._highlightPosition=t.indexOf(i):(i=t.length>this._highlightPosition?t[this._highlightPosition]:t[t.length-1])||(i=t[0]),i.classList.add(this.config.classNames.highlightedState),i.setAttribute("aria-selected","true"),this.passedElement.triggerEvent(n.EVENTS.highlightChoice,{el:i}),this.dropdown.isActive&&(this.input.setActiveDescendant(i.id),this.containerOuter.setActiveDescendant(i.id))}_addItem({value:e,label:t=null,choiceId:i=-1,groupId:s=-1,customProperties:o=null,placeholder:h=!1,keyCode:l=null}){let a="string"==typeof e?e.trim():e;const c=l,d=o,{items:u}=this._store,m=t||a,p=i||-1,_=s>=0?this._store.getGroupById(s):null,g=u?u.length+1:1;return this.config.prependValue&&(a=this.config.prependValue+a.toString()),this.config.appendValue&&(a+=this.config.appendValue.toString()),this._store.dispatch(r.addItem({value:a,label:m,id:g,choiceId:p,groupId:s,customProperties:o,placeholder:h,keyCode:c})),this._isSelectOneElement&&this.removeActiveItems(g),this.passedElement.triggerEvent(n.EVENTS.addItem,{id:g,value:a,label:m,customProperties:d,groupValue:_&&_.value?_.value:void 0,keyCode:c}),this}_removeItem(e){if(!e||!c.isType("Object",e))return this;const{id:t,value:i,label:s,choiceId:o,groupId:h}=e,l=h>=0?this._store.getGroupById(h):null;return this._store.dispatch(r.removeItem(t,o)),l&&l.value?this.passedElement.triggerEvent(n.EVENTS.removeItem,{id:t,value:i,label:s,groupValue:l.value}):this.passedElement.triggerEvent(n.EVENTS.removeItem,{id:t,value:i,label:s}),this}_addChoice({value:e,label:t=null,isSelected:i=!1,isDisabled:s=!1,groupId:n=-1,customProperties:o=null,placeholder:r=!1,keyCode:l=null}){if(void 0===e||null===e)return;const{choices:a}=this._store,c=t||e,d=a?a.length+1:1,u=`${this._baseId}-${this._idNames.itemChoice}-${d}`;this._store.dispatch(h.addChoice({id:d,groupId:n,elementId:u,value:e,label:c,disabled:s,customProperties:o,placeholder:r,keyCode:l})),i&&this._addItem({value:e,label:c,choiceId:d,customProperties:o,placeholder:r,keyCode:l})}_addGroup({group:e,id:t,valueKey:i="value",labelKey:s="label"}){const n=c.isType("Object",e)?e.choices:Array.from(e.getElementsByTagName("OPTION")),o=t||Math.floor((new Date).valueOf()*Math.random()),h=!!e.disabled&&e.disabled;if(n){this._store.dispatch(l.addGroup({value:e.label,id:o,active:!0,disabled:h}));const t=e=>{const t=e.disabled||e.parentNode&&e.parentNode.disabled;this._addChoice({value:e[i],label:c.isType("Object",e)?e[s]:e.innerHTML,isSelected:e.selected,isDisabled:t,groupId:o,customProperties:e.customProperties,placeholder:e.placeholder})};n.forEach(t)}else this._store.dispatch(l.addGroup({value:e.label,id:e.id,active:!1,disabled:e.disabled}))}_getTemplate(e,...t){if(!e)return null;const{classNames:i}=this.config;return this._templates[e].call(this,i,...t)}_createTemplates(){const{callbackOnCreateTemplates:e}=this.config;let i={};e&&"function"==typeof e&&(i=e.call(this,c.strToEl)),this._templates=t(o,i)}_createElements(){this.containerOuter=new s.Container({element:this._getTemplate("containerOuter",this._direction,this._isSelectElement,this._isSelectOneElement,this.config.searchEnabled,this.passedElement.element.type),classNames:this.config.classNames,type:this.passedElement.element.type,position:this.config.position}),this.containerInner=new s.Container({element:this._getTemplate("containerInner"),classNames:this.config.classNames,type:this.passedElement.element.type,position:this.config.position}),this.input=new s.Input({element:this._getTemplate("input",this._placeholderValue),classNames:this.config.classNames,type:this.passedElement.element.type,preventPaste:!this.config.paste}),this.choiceList=new s.List({element:this._getTemplate("choiceList",this._isSelectOneElement)}),this.itemList=new s.List({element:this._getTemplate("itemList",this._isSelectOneElement)}),this.dropdown=new s.Dropdown({element:this._getTemplate("dropdown"),classNames:this.config.classNames,type:this.passedElement.element.type})}_createStructure(){this.passedElement.conceal(),this.containerInner.wrap(this.passedElement.element),this.containerOuter.wrap(this.containerInner.element),this._isSelectOneElement?this.input.placeholder=this.config.searchPlaceholderValue||"":this._placeholderValue&&(this.input.placeholder=this._placeholderValue,this.input.setWidth()),this.containerOuter.element.appendChild(this.containerInner.element),this.containerOuter.element.appendChild(this.dropdown.element),this.containerInner.element.appendChild(this.itemList.element),this._isTextElement||this.dropdown.element.appendChild(this.choiceList.element),this._isSelectOneElement?this.config.searchEnabled&&this.dropdown.element.insertBefore(this.input.element,this.dropdown.element.firstChild):this.containerInner.element.appendChild(this.input.element),this._isSelectElement&&(this._highlightPosition=0,this._isSearching=!1,this._startLoading(),this._presetGroups.length?this._addPredefinedGroups(this._presetGroups):this._addPredefinedChoices(this._presetChoices),this._stopLoading()),this._isTextElement&&this._addPredefinedItems(this._presetItems)}_addPredefinedGroups(e){const t=this.passedElement.placeholderOption;t&&"SELECT"===t.parentNode.tagName&&this._addChoice({value:t.value,label:t.innerHTML,isSelected:t.selected,isDisabled:t.disabled,placeholder:!0}),e.forEach(e=>this._addGroup({group:e,id:e.id||null}))}_addPredefinedChoices(e){this.config.shouldSort&&e.sort(this.config.sorter);const t=e.some(e=>e.selected),i=e.findIndex(e=>void 0===e.disabled||!e.disabled);e.forEach((e,s)=>{const{value:n,label:o,customProperties:h,placeholder:r}=e;if(this._isSelectElement)if(e.choices)this._addGroup({group:e,id:e.id||null});else{const l=!!(this._isSelectOneElement&&!t&&s===i)||e.selected,a=e.disabled;this._addChoice({value:n,label:o,isSelected:l,isDisabled:a,customProperties:h,placeholder:r})}else this._addChoice({value:n,label:o,isSelected:e.selected,isDisabled:e.disabled,customProperties:h,placeholder:r})})}_addPredefinedItems(e){e.forEach(e=>{"object"==typeof e&&e.value&&this._addItem({value:e.value,label:e.label,choiceId:e.id,customProperties:e.customProperties,placeholder:e.placeholder}),"string"==typeof e&&this._addItem({value:e})})}_setChoiceOrItem(e){({object:()=>{e.value&&(this._isTextElement?this._addItem({value:e.value,label:e.label,choiceId:e.id,customProperties:e.customProperties,placeholder:e.placeholder}):this._addChoice({value:e.value,label:e.label,isSelected:!0,isDisabled:!1,customProperties:e.customProperties,placeholder:e.placeholder}))},string:()=>{this._isTextElement?this._addItem({value:e}):this._addChoice({value:e,label:e,isSelected:!0,isDisabled:!1})}})[c.getType(e).toLowerCase()]()}_findAndSelectChoiceByValue(e){const{choices:t}=this._store,i=t.find(t=>this.config.valueComparer(t.value,e));i&&!i.selected&&this._addItem({value:i.value,label:i.label,choiceId:i.id,groupId:i.groupId,customProperties:i.customProperties,placeholder:i.placeholder,keyCode:i.keyCode})}_generatePlaceholderValue(){if(this._isSelectElement){const{placeholderOption:e}=this.passedElement;return!!e&&e.text}const{placeholder:e,placeholderValue:t}=this.config,{element:{dataset:i}}=this.passedElement;if(e){if(t)return t;if(i.placeholder)return i.placeholder}return!1}}return p});
//# sourceMappingURL=sourcemaps/choices.js.map
