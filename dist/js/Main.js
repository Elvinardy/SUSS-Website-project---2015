/*define canvas */
var canvas; 
var stage;

/* Background */
var bgImg; 
var bg; 
var bg2Img; 
var bg2;

/* Ship */
var sImg; 
var ship;

/* Enemy */
var eImg;

/* Lives */
var lImg;

/* Bullets */
var bltImg;

/* Alert */ 
var winImg; 
var loseImg; 
var win; 
var lose;

//Declare Variables
var lives; //stores the lives gfx 
var bullets; //stores the bullets gfx 
var enemies; //stores the enemies gfx 
var score; 
var gfxLoaded; 
//used as a preloader, counts the already loaded items 
var centerX; 
var centerY; 
var timerSource; //references a setInterval method

function Main() 
{ 
    //declare variables, main function and
    //create objects
	bgImg = new Image(); 
	bg2Img = new Image();
	sImg = new Image(); 	
	eImg = new Image();	
	bImg = new Image(); 
	lImg = new Image();
	bltImg = new Image();
	winImg = new Image(); 
	loseImg = new Image(); 
	//decleare the images that you have
    //declare the number of images in the container
    
    //containers
    lives = new createjs.Container(); 
	bullets = new createjs.Container(); 
	enemies = new createjs.Container(); 
    
    //set default variables
	gfxLoaded = 0;
	centerX = 160;
	centerY = 300;
	
    /* Link Canvas */
    //ID of canvas
	canvas = document.getElementById('Shooter');
	stage = new createjs.Stage(canvas); //create stage
	stage.mouseEventsEnabled = true;
	stage.enableMouseOver(10);
    
	/* Sound */
	createjs.Sound.registerSound("sound/explo.mp3", "explo", 10);
	createjs.Sound.registerSound("sound/shot.mp3", "shot", 10);
	
	/* Load GFX */
  	bgImg.src = 'images/bg.png'; 
	bgImg.name = 'bg'; 
	bgImg.onload = loadGfx; 
	  
	bg2Img.src = 'images/bg2.png'; 
	bg2Img.name = 'bg2'; 
	bg2Img.onload = loadGfx; 
		  
	sImg.src = 'images/rhinoceros.png'; 
	sImg.name = 'rhino'; 
	sImg.onload = loadGfx; 
	  
	eImg.src = 'images/rifleguy.png'; 
	eImg.name = 'enemy'; 
	eImg.onload = loadGfx; 
	  
	lImg.src = 'images/live.png'; 
	lImg.name = 'live'; 
	lImg.onload = loadGfx; 
	  
	bltImg.src = 'images/bullet.png'; 
	bltImg.name = 'bullet'; 
	bltImg.onload = loadGfx; 
	  
	winImg.src = 'images/win.png'; 
	winImg.name = 'win'; 
	winImg.onload = loadGfx; 
	  
	loseImg.src = 'images/lose.png'; 
	loseImg.name = 'lose'; 
	loseImg.onload = loadGfx;
	
	//sets the frame rate to 30
	/* Ticker function*/
	createjs.Ticker.framerate = 30; 
	createjs.Ticker.addEventListener("tick",handleTick);
}

function handleTick(event)
{	
	/* Move Background */
    bg.y += 5; 
    bg2.y += 5; 
      
    if(bg.y >= 480) 
    { 
        bg.y = -480; 
    } 
    else if(bg2.y >= 480) 
    { 
        bg2.y = -480; 
    }
    
    /* Move Bullets */ 
	for(var i = 0; i < bullets.children.length; i++) 
    { 
        bullets.children[i].y -= 10; 
          
        /* Remove Offstage Bullets */
    if(bullets.children[i] != null && bullets.children[i].y < - 20) 
        { 
            bullets.removeChildAt(i); 
        } 
    }
    	/* Move Enemies */    
    for(var j = 0; j < enemies.children.length; j++) 
    { 
        enemies.children[j].y += 5; 
        
		for(var k = 0; k < bullets.children.length; k++) 
		{ 
			/* Bullet - Enemy Collision */
			  
			if(bullets.children[k] != null &&  enemies.children[j] != null && bullets.children[k].x >= enemies.children[j].x && bullets.children[k].x + 11 < enemies.children[j].x + 49 && bullets.children[k].y < enemies.children[j].y + 40) 
			{ 
				bullets.removeChildAt(k); 
				enemies.removeChildAt(j); 
				stage.update(); 
				createjs.Sound.play('explo'); 
				score.text = parseFloat(score.text + 50); 
			}
		}
		
		if(enemies.hitTest(ship.x, ship.y) || enemies.hitTest(ship.x + 37, ship.y)) 
		{ 
			enemies.removeChildAt(j); 
			lives.removeChildAt(lives.children.length-1); 
			ship.y = 480 + 34; 
			createjs.Tween.get(ship).to({y:425}, 500) 
		    createjs.Sound.play('explo'); 
		} 
		
		/* Remove Offstage Enemies */
        else if(enemies.children[j]!=null && enemies.children[j].y > 480 + 50) 
        { 
            enemies.removeChildAt(j); 
        }
	}
	
	/* Show Boss */
      
    if(lives.children.length <= 0) 
    { 
        endGame('lose'); 
    } 

    stage.update();
}



function loadGfx(e) //Gfx function 
{ 
    if(e.target.name = 'bg'){bg = new createjs.Bitmap(bgImg);} 
    if(e.target.name = 'bg2'){bg2 = new createjs.Bitmap(bg2Img);} 
    if(e.target.name = 'ship'){ship = new createjs.Bitmap(sImg);} 
    //loads only the images for the start of the game. background, ship
    gfxLoaded++; 
	  
    if(gfxLoaded == 8) 
    { 
        addGameView(); 
    } 
}

function addGameView() //declare position of ship
{ 
    ship.x = centerX - 18.5; 
    ship.y = 480 + 34; 
    //+34 to make the ship appear out of the screen first
     
    /* Add Lives */ 
    for(var i = 0; i < 3; i++) 
    { 
        var l = new createjs.Bitmap(lImg); 
          
        l.x = 248 + (25 * i); 
        l.y = 463; 
          
        lives.addChild(l); //add into lives container
        stage.update(); 
    } 


  /* Score Text */
      
    score = new createjs.Text('0', 'bold 14px Courier New', '#FFFFFF'); 
    score.maxWidth = 1000;  //fix for Chrome 17 
    score.x = 2; 
    score.y = 20; 
      
    /* Second Background */
      //to do the background movement effect
    bg2.y = -480; 
      
    /* Add gfx to stage and Tween Ship */
      
    stage.addChild(bg, bg2, ship, enemies, bullets, lives, score); 	//add in container
	stage.update(); 

    createjs.Tween.get(ship, {override:true}).to({y:425}, 1000).call(startGame); 
	//tweening effect
}

function startGame() 
{ 
	stage.on("stagemousemove", moveShip);
	bg.addEventListener("click",shoot);
	bg2.addEventListener("click",shoot);
  
    timerSource = setInterval('addEnemy()', 1000); 
}

function moveShip(e) 
{ 
    ship.x = e.stageX - 18.5; 
}

function shoot(e) 
{ 
    var b = new createjs.Bitmap(bltImg);  //image of bullet
      
    b.x = ship.x + 13; //bullet appear in front of ship
    b.y = ship.y - 20; 
      
    bullets.addChild(b); //add bullet in container
    stage.update(); 
      
    createjs.Sound.play('shot'); //play bullet sound
}
function addEnemy() 
{ 
    var e = new createjs.Bitmap(eImg); 
      
    e.x = Math.floor(Math.random() * (320 - 50)) 
    e.y = -50 
      
    enemies.addChild(e); 
    stage.update(); 
}

function endGame(e)
{
	 /* Remove Listeners */
	bg.removeEventListener("click",shoot);
	bg2.removeEventListener("click",shoot);
	timerSource = null; 
	
    //clearInterval(timerSource);
    
    //if (boss!= null) (clearInterval(b/* Display Correct Message */
      
    if(e == 'win') 
    { 
        win = new createjs.Bitmap(winImg); 
        //win.x = centerX - 64; 
        //win.y = centerY - 23; 
        stage.addChild(win); 
        stage.removeChild(enemies, boss); 
		win.addEventListener("click",reloadGame);
    } 
    else
    { 
        lose = new createjs.Bitmap(loseImg); 
       // lose.x = centerX - 64; 
       // lose.y = centerY - 23; 
        stage.addChild(lose); 
        stage.removeChild(enemies, ship); 
		lose.addEventListener("click",reloadGame);
    } 
	
	createjs.Ticker.removeEventListener("tick",handleTick);
	
	stage.update();
}

function reloadGame(e)
{
	e.target.removeEventListener("click",reloadGame);
	e.target.removeEventListener("click",reloadGame);
	
	Main();
}

