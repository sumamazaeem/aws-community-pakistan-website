
var words = ['AWS User Group Lahore', 'Pakistan Biggest Cloud Community Network'];
var numOfWords = words.length;
var counter = 0;

setInterval(function() {
  //make the fing thing rotate
	$('#spinner').toggleClass('rotate');
	//
}, 1750); 

setInterval(function() {

	var coreAnim = function(){ 
		var live = $('.live');
		var bottom = $('.bottom');
	
	   //live moves to top and hide
	   live.animate({ 
			opacity: 0.0,
			marginTop: "-100px"
		}, 1000, 'linear', function(){
			live.removeClass('live').addClass('bottom hidden');
			live.removeAttr('style');
		});
	   //bottom unhide moves to live 
	   bottom.text(words[counter]);
	   bottom.removeClass("hidden");
	   bottom.animate({ 
			opacity: 1.0,
			marginTop: "0px"
		}, 1000, 'linear', function(){
			bottom.removeClass('bottom').addClass('live');
			bottom.removeAttr('style');
		});
	};

	var updateCounter = function(){
		if((counter + 1) == numOfWords){
			counter = 0;
		} else {
			counter++;
		}
	};

	var cleanUp = function(){
		var item = $('.bottom');		
		$after = item.next();
		item.insertAfter($after);
	};
	
	coreAnim();
	updateCounter();
	cleanUp();

}, 3500);
