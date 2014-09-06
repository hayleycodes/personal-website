
$("body").hide();
$("body").fadeIn(1500);
/*
$("h1").hide();
	$("h1").slideDown(1000);
	$("blogBoxTop p").hide();
	$("section").hide();
	$("section").fadeIn(1500);
	*/
	$(document).ready(function(){
  		var colors = ["#2ECCFA","#CCCCCC","#F841E3","#18DA12", "#EEEE19", "#A337F0", "#EE2A4B", "#424146", "#FF8000"];           
  		var rand = Math.floor(Math.random()*colors.length);           
  		$('#controls-wrapper').css("background-color", colors[rand]);
  		$('html').css("background", colors[rand]);
  		$('h2, h3, .twitter-timeline').css("color", colors[rand]);
	});