$(document).ready(function(){
	/**
	 * Data Link
	 * (lots of tiny mirrors reflect data throughout the kingDOM)
	 * 
	 * Link an Element's value (case INPUT) or html (case OTHER) to another element.
	 * On data fill events, the onChange handler will fire manually. Can set multiple links.
	 * 
	 * @example <... datalink="otherElement">
	 * @example <... datalink="otherElement anotherEl another">
	 * 
	 *
	 * Data Link Visible will fire on change() event fired by user input blur or when an item becomes visible.
	 * @example <... datalinkvisible="otherElement">
	 * @example <... datalinkvisible="otherElement anotherEl another">
	 * 
	 * Data Transform Option
	 * (maybe you'd like to reflect it through a prism...)
	 * 
	 * Transform data before it gets to it's destination. (Works with datalink= and datalinkvisible=)
	 * Preceeding a target with = signifies that it should be transformed by the filter specified by the datatransform= tag.
	 * @example <... datalink="otherElement =transformedElement" datatransform="numeric">
	 */
// Files needed: jquery.js, jquery.livequery.js, plus the datalink and log functions, below.
	 
	var debug = true;
	var log = function() {
		if (!debug)
			return false;
		try {
			if (window.console && window.console.firebug || typeof firebug === 'object')
	  			console.log.apply(this, arguments);
	  	} catch(err) {
			alert(err.description+'\nmake sure firebug light\nis included in the header before\nautomator.js');
		}
	}
	
	
	var dataLinkSelector		= '[datalink]';
	var dataTransformTag		= 'datatransform';
	var dataLinkVisibleSelector	= '[datalinkvisible]';
	var regularDataLinkTag		= 'datalink';
	var dataLinkTag			= 'datalink';
	var visibleDataLinkTag		= 'datalinkvisible';
	
	var dataReflect = function() {
		try {
			if ($(this).attr(visibleDataLinkTag)) {
				var dataLinkTag = visibleDataLinkTag;
			} else {
				var dataLinkTag = regularDataLinkTag;
			}
			log(dataLinkTag);
			var source = $(this), targets = $(this).attr(dataLinkTag).split(" ");
			for (var t in targets) {
				var target = targets[t], usetransform = false;
				if (target.substring(0,1) == "=") {
					target = target.substring(1);
					usetransform = true;
				}
				target = $('#'+target);
				var sourceName = source.attr('tagName'), targetName = target.attr('tagName'); // make local references to reduce lookup time
				var thedata = (sourceName == 'INPUT' || sourceName == 'SELECT') ? source.val() : source.html();
				
				if (source.attr(dataTransformTag) && usetransform) {
					var transtype = source.attr(dataTransformTag);
					switch(transtype){
						case 'numeric':
							var regex = /\D/g; // match any non-digit character
							thedata = thedata.replace(regex,'');
							break;
						case 'ccmask':
							var regex = /.{12}/; // match any non-digit character
							thedata = thedata.replace(regex,'XXXX XXXX XXXX ');
							break;
						case 'sum':
							//target.change();
							return;
							break;
						default:
							break;
					}
				}
				log(thedata);
				
				if (targetName == 'INPUT' || targetName == 'SELECT') {
					target.val(thedata);
					if (targetName == 'SELECT')
						target.change();
				} else {
					target.html(thedata);
				}

			}
		} catch(err) {
			log(err);
			log('Thrown in Data Link (datalink=) trying to update some values.');
		}
	}
	
	$(dataLinkSelector).livequery(function(){
		$(this).change(dataReflect);
	});
	
	$(dataLinkVisibleSelector).livequery(function(){
		$(this).change(dataReflect);
	});
	
	$(dataLinkVisibleSelector+":visible").livequery(function(){
		$(this).each(dataReflect);
	});
	/**
	 * Data Sum
	 *
	 * Add the value of multiple elements together.
	 * @example <.. datasum="elem1 elem2 elem3">
	 */
	
	var dataSumSelector	= "[datasum]";
	var dataSumTag		= "datasum";
	
	var dataSumCalc = function(source) {
		var targets = source.attr(dataSumTag).split(" ");
		var sum = 0;
		for (var t in targets) {
			sum += ($('#'+targets[t]).val()/1 || $('#'+targets[t]).html()/1);
			log("sum "+t+":"+sum);
		}
		log("total:"+sum);
		(source.attr('tagName') == 'INPUT' || source.attr('tagName') == 'SELECT') ? source.val(sum) : source.html(sum);
	}
	
	$(dataSumSelector).each(function(){
		var source = $(this), targets = $(this).attr(dataSumTag).split(" ");
		for (var t in targets) {
			$('#'+targets[t]).change(function() { dataSumCalc(source) });
			log("changeeventon::"+source);
		}
	});
	
	
});