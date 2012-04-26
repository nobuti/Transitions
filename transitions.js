(function(window, document, undefined){

	var slice = Array.prototype.slice;

	/**
	* 
	* Helper to get vendor prefixes.
	* @param {Array} prefixes
	* 
	*/
	function getVendorPrefix(prefixes) {
   		var tmp = document.createElement("div"),
   			result = "",
   			l = prefixes.length;

		while (l--) {
			if (typeof tmp.style[prefixes[l]] != 'undefined') {
	      		return tween.vendor.prefix[l];
	   		} 
		}
   		return "";
	}

	/**
	* 
	* Console.log fallback
	* 
	*/
	(function(){try{console.log();return window.console;}catch(a){return (window.console={});}}());

	/**
	* 
	* Constructor
	* @param {String or object} selector
	* 
	*/
	var Tween = function(selector){
		return this.init(selector)
	}
	Tween.prototype.constructor = Tween;
	Tween.prototype = {
		/**
		* 
		* Initialization
		* @param {String or object} selector
		* 
		*/
		init: function(selector){
			this.el = (typeof selector === "string" ? this.select(selector) : selector);
			this._delay = tween.defaults.delay;
			this._easing = tween.defaults.easing;
			this._duration = tween.defaults.duration;
			this._transformations = [];
			this._props = {};
			this._callbacks = {};
			this._debug = false;
			this._prefix=getVendorPrefix(tween.vendor.transition);
			return this;
		},
		/**
		* 
		* Enable o disable the console output
		* @param {Boolean} b
		* 
		*/
		debug: function(b){
			(typeof b !== "boolean") ? this._debug = false : this._debug = b;
			return this;
		},
		/**
		* 
		* Set style property
		* @param {String} property
		* @param {String} value
		* 
		*/
		set: function(property, value)
		{
			this._props[property] = value;
			return this;
		},
		/**
		* 
		* Helper dom select function
		* @param {String or object} selector
		* 
		*/
		select: function(selector)
		{
			if (typeof selector !== "string") return selector;
			return document.getElementById(selector) || document.querySelectorAll(selector)[0];
		},
		/**
		* 
		* Map all transitions/transformation into the style element
		* 
		*/
		applyProperties: function(){
			var props = this._props,
				el = this.el,
				str = '';
			for (var i in props){
				if (props.hasOwnProperty(i)){
					el.style.setProperty(i, props[i]+(tween.units[i] ? tween.units[i] : ''),'');
					str += i+": "+props[i]+(tween.units[i] ? tween.units[i] : '')+"\n";
				}
			}
			if (this._debug)
				console.log(str);
		},
		/**
		* 
		* Set the easing function
		* @param {String} fn
		* 
		*/
		ease: function(fn)
		{
			(typeof fn !== "string") ? this._easing = tween.easing.ease : this._easing = fn;
			return this;
		},
		/**
		* 
		* Set the duration
		* @param {Number or string} secs
		* 
		*/
		duration: function(secs)
		{
			(typeof secs === "number") ? this._duration = secs : this._duration = parseFloat(secs);
			return this;
		},
		/**
		* 
		* Set the transition's delay
		* @param {Number or string} secs
		* 
		*/
		delay: function(secs)
		{
			(typeof secs === "number") ? this._delay = secs : this._delay = parseFloat(secs);
			return this;
		},
		/**
		* 
		* Translate function helper
		* @param {Number} x
		* @param {Number} y optional
		* 
		*/
		translate: function(x,y){
			this._transformations.push("translate(" + x + "px, " + (y || 0) + "px)");
			return this;
		},
		/**
		* 
		* Scale function helper
		* @param {Number} w
		* @param {Number} h optional
		* 
		*/
		scale: function(w,h){
			this._transformations.push("scale(" + w + ", " + (h || 1) + ")");
			return this;
		},
		/**
		* 
		* Rotate function helper
		* @param {Number} angle
		* 
		*/
		rotate: function(angle){
			this._transformations.push("rotate(" + angle + "deg)");
			return this;
		},
		/**
		* 
		* Skew function helper
		* @param {Number} angleX
		* @param {Number} angleY optional
		* 
		*/
		skew: function(angleX, angleY){
			this._transformations.push("skewX(" + angleX + "deg)");
			if (angleY){
				this._transformations.push("skewY(" + angleY + "deg)");
			}
			return this;
		},
		/**
		* 
		* Trigger to start the transition
		* @param {Function} fn optional callback
		* 
		*/
		now: function(fn)
		{
			var t = this._transformations;
			this.trigger('start');

			this.set(this._prefix+"transition-duration",this._duration*1000+"ms");
			this.set(this._prefix+"transition-delay",this._delay*1000+"ms");
			this.set(this._prefix+"transition-timing-function",this._easing);

			if (t.length) this.set(this._prefix+"transform",t.join(' '));

			this.applyProperties();
			
			var self = this;
			setTimeout(function(){
				self.trigger("complete");
				this._transformations = [];
				this._props = {};
				if (typeof fn === 'function'){
					fn.apply(null);
				}
			}, (this._duration+this._delay)*1000 )
			
			return this;
		},
		/**
		* 
		* Suscriber of oberver pattern implementation
		* @param {String} event 
		* @param {Function} fn callback
		* 
		*/
		on: function(event, fn)
		{
			if (typeof event !== "string") return this;
			var _e = this._callbacks[event] || (this._callbacks[event] = []);
			_e.push(fn);
			return this;
		},
		/**
		* 
		* Trigger of oberver pattern implementation. For internal use.
		* @param {String} event 
		* 
		*/
		trigger: function(event)
		{
			if (typeof event !== "string") return this;
			var _e = this._callbacks[event] || [], l=_e.length, args = slice.call(arguments, 1);
			if (!l) return this;
			while (l--) {
				_e[l].apply(this, args);
			}
		}
	}
	/**
	* 
	* Helper to expose
	* @param {String or object} element 
	* 
	*/
	var tween = function(element){
		return new Tween(element);
	};
	/**
	* 
	* Defaults properties of transitions
	* 
	*/
	tween.defaults = {
		duration: 0.6,
		delay: 0,
		easing: "ease"
	};
	/**
	* 
	* Transitions functions implementations
	* 
	*/
	tween.easing = {
		"ease": "cubic-bezier(0.25, 0.1, 0.25, 1.0)",
		"linear": "cubic-bezier(0.0, 0.0, 1.0, 1.0)",
		"ease-in": "cubic-bezier(0.42, 0, 1.0, 1.0)",
		"ease-out": "cubic-bezier(0, 0, 0.58, 1.0)",
		"ease-in-out": "cubic-bezier(0.42, 0, 0.58, 1.0)"
	};
	/**
	* 
	* Properties to get vendor's prefix
	* 
	*/
	tween.vendor = {
		"transform": ["transform", "msTransform", "MozTransform", "WebkitTransform", "OTransform"],
		"transition": ["transition", "msTransition", "MozTransition", "WebkitTransition", "OTransition"],
		"animation": ["animation", "msAnimation", "MozAnimation", "WebkitAnimation", "OAnimation"],
		"prefix": ["","-ms-","-moz-","-webkit-","-o-"]
	};
	/**
	* 
	* Map of properties than use px in their units
	* 
	*/
	tween.units = {
		'top': 'px',
		'bottom': 'px',
		'left': 'px',
		'right': 'px',
		'width': 'px',
		'height': 'px',
		'font-size': 'px',
		'margin': 'px',
		'margin-top': 'px',
		'margin-bottom': 'px',
		'margin-left': 'px',
		'margin-right': 'px',
		'padding': 'px',
		'padding-top': 'px',
		'padding-bottom': 'px',
		'padding-left': 'px',
		'padding-right': 'px'
	};
	/**
	* 
	* Expose to public
	* 
	*/
	window.tween = window._t = tween;

}(this, document))