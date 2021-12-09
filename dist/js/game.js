var canvas;
var stage;
var bg;
var score;
var bmpList;
var bitmap;
var txt;
var play;
var gameTxt;
var mouseTarget;
var clicked;

function init() {
	canvas = document.getElementById("canvas");
	stage = new Stage(canvas);
	score = 0;
	
	canvas.onmousedown = onMouseDown;
	canvas.onmouseup = onMouseUp;
	
    
	bg = new Image();
	bg.src = "images/jungle.jpg"; /*background-image*/
	bg.onload = setBG;
	
	var image = new Image();
	image.src = "images/hunting.png"; /*enemy image*/
	image.onload = createHunter;

}

function setBG(event){
	var bgrnd = new Bitmap(bg);
	stage.addChild(bgrnd);
	stage.update();
}

function createHunter(event){
	var image = event.target;
	var container = new Container();
	stage.addChild(container);
	var l = 8;
	bmpList=[];
	for (var i=0; i<l; i++){
		bitmap = new Bitmap(image);
		container.addChild(bitmap);
		bitmap.name="ship"+i;
		resetEnemy(bitmap);
		bitmap.regX = bitmap.image.width/2|0;
		bitmap.regY = bitmap.image.height/2|0;
		bitmap.mouseEnabled = true;
		bmpList.push(bitmap);
	}
	txt = new Text ("Score: 0", "24px Arial", "#FFF");
	txt.textBaseline="top";
	txt.x = 800;
	txt.y = 20;
	stage.addChild(txt);
	play=true;
	
	Ticker.addListener(window);
}

function resetEnemy(ship){
	ship.x = canvas.width + Math.random()*500;
	ship.y = canvas.height * Math.random()|0+200;
	ship.speed = (Math.random()*8)+6;
}
function tick(){
	//check for clicking
	if (!clicked && stage.mouseX && stage.mouseY){
		mouseTarget = stage.getObjectUnderPoint(stage.mouseX, stage.mouseY);
	}
	if (clicked && mouseTarget){
		var tempText = String(mouseTarget.name);
		tempText = tempText.substring(0,4);
		if (tempText!=null && tempText=="ship"){
			resetEnemy(mouseTarget);
			score+=10;
			clicked=false;
		}
	}
	//moving the hunter
	if (play == true){
		var l=bmpList.length;
		for(var i=0; i<l; i++){
			var bmp = bmpList[i];
			if (bmp.x > 0){
				bmp.x -= bmp.speed;
			}else{
				gameOver();
				//console.log("game over");
			}
		}
	}
	txt.text = "Score: "+score;
	stage.update();
}
function gameOver(){
	gameTxt = new Text("OH NO! You're Rhino got Hunted!\n\n", "36px Arial", "#FFF"); 
	gameTxt.text += "Click to play again";
	gameTxt.textAlign = "center";
	gameTxt.x = canvas.width /2;
	gameTxt.y = canvas.height/3;
	stage.addChild(gameTxt);
	play=false;
	var l=bmpList.length;
	for(var i=0; i<l; i++){
		var bmp = bmpList[i];
		resetEnemy(bmp);
	}
	stage.update();
	canvas.onclick = handleClick;
}
function handleClick(){
	canvas.onclick=null;
	stage.removeChild(gameTxt);
	score=0;
	
	play=true;
}
function onMouseDown(){
	if(!e){var e = window.event;}
	clicked = true;
}
function onMouseUp(){
	clicked = false
}

