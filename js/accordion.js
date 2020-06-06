/*
*  Accessible Accordion, by Edward Qiu<qkx2010@aliyun.com>
*/
(function () {

  'use strict';

  function Accordion (el, options) {

    if (!el) {
      return;
    }

    this.el = el;
    this.tabPanels = this.el.getElementsByClassName('js-tabs-panel');
    this.accordeonTriggers = this.el.getElementsByClassName('js-accordeon-trigger');

    this.options = this._extend({
      selectedTab: 0
    }, options);

    if(el.getAttribute('data-selected-tab')){
      this.options.selectedTab = parseInt(el.getAttribute('data-selected-tab'));
    }

    this._init();
  }

  Accordion.prototype._init = function () {

    this.accordeonTriggersLength = this.accordeonTriggers.length;
    this.selectedTab = 0;
    this.clickListener = this._clickEvent.bind(this);
    this.keydownListener = this._keydownEvent.bind(this);
    this.keys = {
      prev: 37,
      next: 39,
      space: 32,
      enter: 13
    };

    for (var i = 0; i < this.accordeonTriggersLength; i++) {
      this.accordeonTriggers[i].index = i;
      this.accordeonTriggers[i].addEventListener('click', this.clickListener, false);
      this.accordeonTriggers[i].addEventListener('keydown', this.keydownListener, false);

      if (this.accordeonTriggers[i].classList.contains('is-selected')) {
        this.selectedTab = i;
      }
    }

    this.el.classList.add('is-initialized');

    this.selectTab(this.selectedTab, false);

  };

  Accordion.prototype._clickEvent = function (e) {

    e.preventDefault();

    this.selectTab(e.target.index, true);
  };

  Accordion.prototype._keydownEvent = function (e) {

    var targetIndex;

    if (e.keyCode === this.keys.prev || e.keyCode === this.keys.next || e.keyCode === this.keys.space || e.keyCode === this.keys.enter) {
      e.preventDefault();
    }
    else {
      return;
    }

    if (e.keyCode === this.keys.prev && e.target.index > 0 && !this.isAccordeon) {
      targetIndex = e.target.index - 1;
    }
    else if (e.keyCode === this.keys.space || e.keyCode === this.keys.enter) {
      targetIndex = e.target.index;
    }
    else {
      return;
    }

    this.selectTab(targetIndex, true);
  };

  Accordion.prototype._show = function (index, userInvoked) {

    this.tabPanels[index].removeAttribute('tabindex');

    this.accordeonTriggers[index].setAttribute('aria-expanded', true);

    var panelContent = this.tabPanels[index].getElementsByClassName("content")[0];
    panelContent.setAttribute('aria-hidden', false);
    panelContent.classList.remove('is-hidden');
    panelContent.classList.add('is-open');

    this.tabPanels[index].classList.remove('is-hidden');
    this.tabPanels[index].classList.add('is-open');

  };

  Accordion.prototype._hide = function (index) {

    this.accordeonTriggers[index].setAttribute('aria-expanded', false);

    var panelContent = this.tabPanels[index].getElementsByClassName("content")[0];
    panelContent.setAttribute('aria-hidden', true);
    panelContent.classList.remove('is-open');
    panelContent.classList.add('is-hidden');

    this.tabPanels[index].classList.remove('is-open');
    this.tabPanels[index].classList.add('is-hidden');
    this.tabPanels[index].setAttribute('tabindex', -1);
  };

  Accordion.prototype.selectTab = function (index, userInvoked) {

    if (index === null) return;

    
    this.selectedTab = index;
    
    if(this.tabPanels[index].classList.contains('is-open')){
      this._hide(index);
    }else{
      this._show(index, userInvoked)
    }

  };

  Accordion.prototype.destroy = function () {

    this.el.classList.remove('is-initialized');
  };

  /**
    * Get the closest matching element up the DOM tree.
    * @private
    * @param  {Element} elem     Starting element
    * @param  {String}  selector Selector to match against
    * @return {Boolean|Element}  Returns null if not match found
    */
  Accordion.prototype._getClosest = function ( elem, selector ) {

    // Element.matches() polyfill
    if (!Element.prototype.matches) {
        Element.prototype.matches =
            Element.prototype.matchesSelector ||
            Element.prototype.mozMatchesSelector ||
            Element.prototype.msMatchesSelector ||
            Element.prototype.oMatchesSelector ||
            Element.prototype.webkitMatchesSelector ||
            function(s) {
                var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                    i = matches.length;
                while (--i >= 0 && matches.item(i) !== this) {}
                return i > -1;
            };
    }

    // Get closest match
    for ( ; elem && elem !== document; elem = elem.parentNode ) {
        if ( elem.matches( selector ) ) return elem;
    }

    return null;

  };

  // Pass in the objects to merge as arguments.
  // For a deep extend, set the first argument to `true`.
  Accordion.prototype._extend = function () {

      // Variables
      var extended = {};
      var deep = false;
      var i = 0;
      var length = arguments.length;

      // Check if a deep merge
      if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
          deep = arguments[0];
          i++;
      }

      // Merge the object into the extended object
      var merge = function (obj) {
          for ( var prop in obj ) {
              if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
                  // If deep merge and property is an object, merge properties
                  if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
                      extended[prop] = extend( true, extended[prop], obj[prop] );
                  } else {
                      extended[prop] = obj[prop];
                  }
              }
          }
      };

      // Loop through each object and conduct a merge
      for ( ; i < length; i++ ) {
          var obj = arguments[i];
          merge(obj);
      }

      return extended;

  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  Accordion.prototype._debounce = function (func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) { func.apply(context, args); };
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) { func.apply(context, args) };
    };
  };

  var slice = Array.prototype.slice;

  function $(expr, con) {
    return typeof expr === "string" ? (con || document).querySelector(expr) : expr || null;
  }

  function $$(expr, con) {
    return slice.call((con || document).querySelectorAll(expr));
  }

  // Initialization

  function init() {
    $$(".js-accordion").forEach(function (input) {
      new Accordion(input);
    });
  }

  // Are we in a browser? Check for Document constructor
  if (typeof Document !== "undefined") {
    // DOM already loaded?
    if (document.readyState !== "loading") {
      init();
    }
    else {
      // Wait for it
      document.addEventListener("DOMContentLoaded", init);
    }
  }

  // Export on self when in a browser
  if (typeof self !== "undefined") {
    self.Accordion = Accordion;
  }

  // Expose as a CJS module
  if (typeof module === "object" && module.exports) {
    module.exports = Accordion;
  }

  return Accordion;

})();
