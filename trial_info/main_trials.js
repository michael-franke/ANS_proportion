var main_trials = _.map(_.shuffle(_.range(24)), function(i) {
	var addition = _.random(1,18); 
	var PicNumber = addition + i * 18;
	var variant = _.shuffle(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"])[0]
	var PicString = "images/" + PicNumber + "red_dots_" + variant + ".png"
	return {picture: PicString} })