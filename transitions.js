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
		init: function(selector)
		{
			this.el = this.select(selector);
			this.reset();
			this._callbacks = {};
			this._stack = [];
			this._fn = null;
			this._debug = false;
			this._prefix=getVendorPrefix(tween.vendor.transition);
			return this;
		},
		/**
		* 
		* Clone an object
		* @param {Object} obj
		* 
		*/
		extend: function(obj)
		{
			var target = {};
			for (var i in obj) {
				if (obj.hasOwnProperty(i)) {
					target[i] = obj[i];
				}
			}
   			return target;
		},
		/**
		* 
		* Enable o disable the console output
		* @param {Boolean} b
		* 
		*/
		debug: function(b)
		{
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
			if (typeof selector !== "string") return (selector[0] || selector);
			return document.getElementById(selector) || document.querySelectorAll(selector)[0];
		},
		/**
		* 
		* Map all transitions/transformation into the style element
		* 
		*/
		applyProperties: function(props)
		{
			var el = this.el,
				str = '';
			for (var i in props){
				if (props.hasOwnProperty(i)){
					el.style.setProperty(i, props[i],'');
					str += i+": "+props[i]+"\n";
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
		rotate: function(angle)
		{
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
		skew: function(angleX, angleY)
		{
			this._transformations.push("skewX(" + angleX + "deg)");
			if (angleY){
				this._transformations.push("skewY(" + angleY + "deg)");
			}
			return this;
		},
		/**
		* 
		* Defaults the properties
		* 
		*/
		reset: function()
		{
			this._delay = tween.defaults.delay;
			this._easing = tween.defaults.easing;
			this._duration = tween.defaults.duration;
			this._transformations = [];
			this._props = {};
		},
		/**
		* 
		* Deferred upcoming transitions
		* @param {Number or string} secs 
		* 
		*/
		wait: function(secs)
		{
			var waiting = (typeof secs === "number") ?  secs : parseFloat(secs);
			this.stack();
			// Stack waiting
			this._stack.push(waiting);
			return this;
		},
		/**
		* 
		* Helper to apply the effect. DRY.
		* 
		*/
		fx: function()
		{
			if (this._stack.length){
				var state = this._stack.shift(),
					self = this;

				if (typeof state === 'number'){
					setTimeout(function(){
						self.fx()
					}, state*1000);
				} else {
					this.applyProperties(state.props);
					setTimeout(function(){
						self.trigger("stacked");
					}, (state.duration+state.delay)*1000 );
				}

			} else {
				this.off('complete', this.fx);
				this.trigger("complete");
				if (typeof this._fn === 'function'){
					this._fn.apply(null);
				}
			}
		},
		/**
		* 
		* Helper to grab an state. DRY
		* 
		*/
		stack: function()
		{
			var t = this._transformations;
			this.set(this._prefix+"transition-duration",this._duration*1000+"ms");
			if (this._delay != 0){
				this.set(this._prefix+"transition-delay",this._delay*1000+"ms");
			}
			this.set(this._prefix+"transition-timing-function",this._easing);

			if (t.length) this.set(this._prefix+"transform",t.join(' '));

			// Clone the props
			var props = this.extend(this._props),
				state = {
					delay: this._delay,
					duration: this._duration,
					props: props
				}
			// Reset 
			this.reset();
			// Stack current stage
			this._stack.push(state);
		},
		/**
		* 
		* Trigger to start the transition
		* @param {Function} fn optional callback
		* 
		*/
		now: function(fn)
		{
			this.trigger('start');
			this.stack();
			// Suscribe to 'stacked' event
			this.on('stacked', this.fx);
			// begin 
			this.fx();
			
			if (typeof fn === 'function'){
				this._fn = fn;
			}
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
		* Unsuscriber of oberver pattern implementation
		* @param {String} event 
		* @param {Function} fn callback
		* 
		*/
		off: function(event, fn)
		{
			if (typeof event !== "string") return this;
			var _e = this._callbacks[event] || [], l=_e.length;
			if (!l) return this;
			while (l--) {
				if (_e[l] === fn){
					_e.slice(l,1);
				}
				
			}
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
	* Expose to public
	* 
	*/
	window.tween = window._t = tween;

}(this, document))