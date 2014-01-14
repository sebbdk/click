$(function() {

/**
 * Setup app
 */

	var score = 0;
	var modifier = 1;
	var clicked = false;
	var startTime = 0;
	var extraBad = $('<a href="#" class="extra-click bad" title="Extraclick!">-</a>');
	var extraGood = $('<a href="#" class="extra-click" title="Extraclick!">+</a>');
	var achievements = [
		{
			show:false,
			check:function() {
				return score > 0;
			},
			text:'You are playing!<br />good for you!'
		},
		{
			show:false,
			check:function() {
				return score > 100;
			},
			text:'Get 100 clicks!<br />Who\'s a cute kitten? you are!'
		},
		{
			show:false,
			check:function() {
				return score > 1000;
			},
			text:'Get 1000 clicks!<br />Yes feel the power consume you!'
		},
		{
			show:false,
			check:function() {
				return score > 5000;
			},
			text:'Get 5000 clicks!<br />So.... are you having fun?'
		},
		{
			show:false,
			check:function() {
				return new Date().getTime() - startTime > 20 * 1000 ;
			},
			text:'Spend 20 seconds playing this game!<br />Because it\'s awesome!'
		},
		{
			show:false,
			check:function() {
				return new Date().getTime() - startTime > 27 * 1000 ;
			},
			text:'Get 4 achievements!<br />Danm you re cool!'
		},
		{
			show:false,
			check:function() {
				return new Date().getTime() - startTime > 35 * 1000 ;
			},
			text:'Get 5 achievements!<br />Okay i will stop now...'
		}
	];

	$(window).on('resize', update);	
	$(document).on('mousedown', '.click', function() {$('.click').addClass('mdown')});
	$(document).on('mouseup', '.click', clickmMouseup);
	$(document).on('mouseup', '.extra-click', extraClickmMouseup);
	$(document).on('click', '.share', share);


//run some shit
	setInterval(function() {
		if(clicked) {
			var extraClick = Math.random() > 0.4 ? extraGood.clone():extraBad.clone();
			$('body').append(extraClick);
			extraClick.css('top', ($(window).height() - extraClick.outerHeight()) * Math.random());
			extraClick.css('left', ($(window).width() - extraClick.outerWidth()) * Math.random());

			if($('.extra-click').size() > 90) {
				$('h1').fadeIn();
				$('body').css('box-shadow', '0 0 100px red inset');
			}

			if($('.extra-click').size() > 100) {
				$('.extra-click').fadeOut();
				$('h1').fadeOut();
				$('.extra-click').remove();
				$('body').css('box-shadow', '');
				score = 0;
			}			
		}
	}, 1000);

	update();
	$('.click').fadeIn();
	$('.click').addClass('loaded');

/**
 * Methods
 */

	function clickmMouseup(evt) {
		evt.preventDefault();
		$('.click').removeClass('mdown')
		score += 1*modifier;

		if(!clicked) {
			startTime = new Date().getTime();
		}

		clicked = true;
		update();
	}

	function extraClickmMouseup(evt) {
		evt.preventDefault();

		if($(this).hasClass('bad')) {
			modifier--;
		} else {
			modifier++;
		}

		update();

		$(this).fadeOut(200);
	}

	function update(evt) {
		//update score
		if(score) {
			var mod = modifier > 0 ? '+':'';
			$('.score').html('<span class="modifier">(' + mod + modifier + ')<br />' + score + '</span>');
		} else {
			$('.score').html('click me!');
		}

		//check achiements
		$.each(achievements, function(index, item) {
			if(!item.shown && item.check() && clicked) {
				item.shown = true;
				
				$('.achievement small').html(item.text);
				$('.achievement').css('top', 0);
				setTimeout(function() {
					$('.achievement').css('top', '-100%');
				}, 5000);
			}
		});

		//update position
		var y = ($(window).height() / 2) - (($('.click').outerHeight()) / 2);
		$('.click').css('top', y);

		var x = ($(window).width() / 2) - (($('.click').outerWidth()) / 2);
		$('.click').css('left', x);

		$('.extra').css('top',  ($(window).height() / 2) - 43);
		$('.extra').css('left', ($(window).width() / 2) - 43);
	}

	function share() {
		FB.ui({
			method: 'feed',
			link: document.location.href,
			caption: 'Click click!',
			description: 'i clicked ' + score + ' times!'
		}, function(response){});		
	}
});


