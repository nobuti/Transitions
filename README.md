# Javascript CSS3 transitions helper library
Small library to manage CSS Transitions and CSS 2D Transforms.

## Getting started

First, this is important, include the script in your html file.
Then use it. Simple.
	
	function complete_cb()
	{
		console.log("callback");
	}
	function start_cb()
	{
		console.log("callback");
	}
	tween('.block')								// selector passed on tween nomenclature
		.debug(true) 							// set debug to true
		.duration(2)							// set duration to 2 secs
		.delay(1)								// set delay to 1 sec
  		.set('background-color', '#666')		// animate 'background-color' property to #666
  		.ease('ease-in-out')					// set easing function
  		.translate(100)							// "move to" transformation
  		.skew(15,15)							// "skew" tranformation
  		.on("start", start_cb)					// "start" event
		.on("complete", complete_cb)			// "complete" event
  		.now();									// begin!

  	var li = document.getElementsByTagName('li')[0];

  	_t(li)										// object passed on _t nomenclature
  		.set('font-size','30px')				// animate 'font-size' property to 30px
  		.now(complete_cb);						// begin! with callback

You have to pass the unit (px,% mainly) to «set» method. Check [here](http://www.w3.org/TR/css3-transitions/#animatable-css) which properties are animables and what type is expected.

It comes with predefined easing equations:
	
	tween.easing = {
		"ease": "cubic-bezier(0.25, 0.1, 0.25, 1.0)",
		"linear": "cubic-bezier(0.0, 0.0, 1.0, 1.0)",
		"ease-in": "cubic-bezier(0.42, 0, 1.0, 1.0)",
		"ease-out": "cubic-bezier(0, 0, 0.58, 1.0)",
		"ease-in-out": "cubic-bezier(0.42, 0, 0.58, 1.0)"
	};

but now thaks to [@leaverou](http://twitter.com/#!/leaverou) with [awesome cubic bezier generation tool](http://cubic-bezier.com/) is posible to pass whatever equation is in your mind. Just do:

	tween('.block')
		.ease('cubic-bezier(.17,.67,.83,.67)')
		.translate(100)
		.now();
