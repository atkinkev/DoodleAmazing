const pathToLogo = require('./assets/imgs/logo.png');
const pathToExample = require('./assets/imgs/example_doodle.jpg');
function toggleRules(){
	const greetingDiv = document.getElementById("greeting");
	const rules = document.getElementById("rules");
	if (rules.style.display == "none"){
		greetingDiv.style.display = "none";
		rules.style.display = "";
	}
	else{
		greetingDiv.style.display = "";
		rules.style.display = "none";
	}
}

var rules =
[
"Begin game by uploading or photographing a hand drawn doodle.",
"Doodles work best with dark ink on light paper with no other markings.",
"Draw an X for the hole and an O for the ball starting position."
]

module.exports = {
	removeMainMenu: function(){
	    const greetingDiv = document.getElementById("greeting");
		greetingDiv.style.display = "none";
	},

	toggleLoader: function(turnOn){
		const loader = document.getElementById("loader");
		if (turnOn){
			loader.style.display = "inline";
		}
		else{
			loader.style.display = "none";
		}
	},

	updateLoadingText: function(text){
		const progressText = document.getElementById("loadtext");
		progressText.innerText = text;
	},

	initMainMenu: function(){
		const logo = document.getElementById("logoImg");
		logo.src = pathToLogo;
		const example = document.getElementById("exampleImg");
		example.src = pathToExample;
	    const greetingDiv = document.getElementById("greeting");
		greetingDiv.style.display = "";
		const rulesText = document.getElementById("rulesText");
		for (var rule of rules){
			var ruleBullet = document.createElement("LI");
			ruleBullet.innerText = rule;
			rulesText.appendChild(ruleBullet);
		}
		const rulesButton = document.getElementById("rulesButton");
		rulesButton.addEventListener("click", function (){
			toggleRules();
		});
		const backButton = document.getElementById("backButton");
		backButton.addEventListener("click", function (){
			toggleRules();
		});
	}	
};

