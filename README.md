# Javascript CSS3 transitions helper library
Small library to manage CSS Transitions and CSS 2D Transforms.

## Getting started

Firts, this is important, include the script on your html file.
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
  		.set('font-size',30)					// animate 'font-size' property to 30px
  		.now(complete_cb);						// begin! with callback

