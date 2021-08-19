const cvs = document.getElementById("gamecanvas");
const ctx = cvs.getContext("2d");

cvs.width = window.innerWidth;
cvs.height = window.innerHeight;

let frames = 0;
let starCounter = 0;
let isWindowOpened = false;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); 
}

function map_range(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

//BACKGROUND sky
const sky = [];
for(let i = 1; i <= 141; i++){
	let curframe = new Image();
	curframe.src = './img/bg/bg ('+ i +').jpg';
	sky.push(curframe);
}

const bgsky = {
	imgx : 0,//256
	imgy : 0,
	imgw : 1920,
	imgh : this.imgw * (cvs.height/cvs.width),

	x : 0,
	y : 0,
	w : cvs.width,
	h : cvs.height,

	frame : 0,
	animationFrames : 141,
	frameSpeed : 5,

	draw : function(){
		// this.imgw = this.imgh * (cvs.width/cvs.height);
		ctx.drawImage(sky[this.frame],this.imgx,this.imgy,this.imgw,this.imgh,this.x,this.y,this.w,this.h);
	},

	update :function(){
		// increment the frame by 1, each period
		this.frame += frames % this.frameSpeed == 0 ? 1 : 0;
		//frames goes from 1 to 141, then again to 0
		this.frame = this.frame % this.animationFrames;
	},

	resize : function(){
		this.imgh = this.imgw * (cvs.height/cvs.width);
		this.h = cvs.height;
		this.w = cvs.width;
	}
}

//BACKGROUND city
const citybkgimg0 = new Image();
const citybkgimg = new Image();
citybkgimg0.src = './img/citybkg0.png';
citybkgimg.src = './img/citybkg.png';
const citybkg = {
	w : 0,
	h : cvs.height * 0.5,
	x : 0,
	y : 0,
	speed : 0.5,
	draw : function(){
		// console.log(this.w);
		ctx.drawImage(citybkgimg0,this.x-150,this.y-50,this.w,this.h);
		ctx.drawImage(citybkgimg,this.x,this.y,this.w,this.h);
	},

	update : function(){
		if(this.w > 0 && state.current < state.over){
			this.x -= this.speed;
			if(this.x <= -1 * this.w + cvs.width){
				this.x = 0;
			}
		}
	},

	resize : function(){
		this.h = cvs.height * 0.5;
		this.w = this.h * (citybkgimg.width/citybkgimg.height);
		this.y = cvs.height - this.h;
	}
}

//BACKGROUND city2
const citybkgimg2 = new Image();
citybkgimg2.src = './img/citybkg2.png';
const citybkg2 = {
	w : 0,
	h : cvs.height * 0.65,
	x : 0,
	y : cvs.height - this.h,
	speed : 0.95,
	draw : function(){
		ctx.drawImage(citybkgimg2,this.x,this.y,this.w,this.h);
	},

	update : function(){
		if(this.w > 0 && state.current < state.over){
			this.x -= this.speed;
			if(this.x <= -1 * this.w + cvs.width){
				this.x = 0;
			}
		}
	},

	resize : function(){
		this.h = cvs.height * 0.65,
		this.y = cvs.height - this.h;
		this.w = this.h * (citybkgimg2.width/citybkgimg2.height);
	}
}

//BACKGROUND bridge
const bridgeimg = new Image();
bridgeimg.src = './img/bridges.png';
const bridge = {
	w : 0,
	h : cvs.height * 0.2,
	x : -100,
	y : cvs.height - this.h,

	speed : 0.8,
	draw : function(){
		ctx.drawImage(bridgeimg,this.x,this.y,this.w,this.h);
	},

	update : function(){
		if(this.w > 0 && state.current < state.over){
			this.x -= this.speed;
			if(this.x <= -1 * this.w + cvs.width){
				this.x = 0;
			}
		}
	},

	resize:function(){
		this.h = cvs.height * 0.2;
		this.y = cvs.height - this.h;
		this.w = this.h * (bridgeimg.width/bridgeimg.height);
	}
}

//macys building
const storeimg = new Image();
storeimg.src = './img/store.png';
const macys = {
	x : 150,
	y : 320,
	w : 980,
	h : 699,
	ratio : 0.25,

	speed : 2.5,
	middleX : 60,

	draw : function(){
		if(state.current >= state.end){
			ctx.drawImage(storeimg,this.x,this.y,this.w * this.ratio,this.h * this.ratio);
		}
	},

	update : function(){
		if(state.current == state.end){ 
			this.x -= this.speed;
			// console.log(this.x);
			if(this.x <= this.middleX){
				this.x = this.middleX;
				state.current = state.over;
				santaSleigh.forzeFrame = santaSleigh.frame;
			}
		}
	},

	resize : function(){
		this.ratio = ((cvs.height - santaSleigh.origin_size.h * santaSleigh.size_ratio) * 0.5/this.h) * 0.8;
		this.y = cvs.height - this.h * this.ratio;
		this.middleX = (cvs.width - this.w * this.ratio) * 0.5; //santaSleigh.x * 0.9;
	},

	restart : function(){
		this.x = cvs.width - this.w * this.ratio;
		this.speed = this.x/200;
	}
}

//stars
// const starsimg = new Image();
const starburst = [];
// starsimg.src = './img/STAR.png';
for(let i = 10; i <= 50; i++){
	let curframe = new Image();
	curframe.src = './img/STAR_BURST ANIMATION/STAR_BURST ANIMATION_ ('+i+').png';
	starburst.push(curframe);
}
const cloudimg = new Image();
const cloudburst = [];
for(let i = 12; i <= 31; i++){
	let curframe = new Image();
	curframe.src = './img/CLOUD ANIMATED/CLOUD_ ('+i+').png';
	cloudburst.push(curframe);
}
cloudimg.src = './img/CLOUD_STILL.png';
const stars = {
	position_star : [],
	size_star : [],
	maxH_star : 80,
	speed_star : 1,
	frameSpeed : 5,
	burststars:{
		size: [],
		frame : [],
		pos : []
	},
	burstclouds:{
		origin_size : {
			w:890 * 0.02,
			h:531 * 0.02
		},
		size : [],
		frame : [],
		pos : []
	},
	ratio : 1,
	position_cloud : [],
	origin_size : {
		x : 784 * 0.02,
		y : 179 * 0.02
	},
	size_cloud : [],
	maxH_cloud :150,
	speed_cloud : 1.5,
	draw : function(){
		// console.log(this.position.length);
		for(let i = 0; i < this.position_star.length; i++){
			ctx.drawImage(starburst[0],550,550,400,400,this.position_star[i].x,this.position_star[i].y,this.size_star[i],this.size_star[i]);
		}
		for(let i = 0; i< this.burststars.pos.length; i++){
			// console.log(this.burststars.pos[i].x);
			ctx.drawImage(starburst[this.burststars.frame[i]],550,550,400,400,this.burststars.pos[i].x,this.burststars.pos[i].y,this.burststars.size[i],this.burststars.size[i]);
		}
		for(let i = 0; i < this.position_cloud.length; i++){
			ctx.drawImage(cloudburst[0],574,495,784,179,this.position_cloud[i].x,this.position_cloud[i].y,this.size_cloud[i].w,this.size_cloud[i].h);
			// ctx.beginPath();
			// ctx.rect(this.position_cloud[i].x,this.position_cloud[i].y,this.size_cloud[i].w,this.size_cloud[i].h);
			// ctx.stroke();
		}
		for(let i = 0; i< this.burstclouds.pos.length; i++){
			ctx.drawImage(cloudburst[this.burstclouds.frame[i]],520,410,890,531,this.burstclouds.pos[i].x,this.burstclouds.pos[i].y,this.burstclouds.size[i].w,this.burstclouds.size[i].h);
		}
	},

	burst : function(){
		for(let i = 0; i < this.burststars.pos.length; i++){
			this.burststars.frame[i] += frames % this.frameSpeed == 0 ? 1 : 0;
			// this.burststars.frame[i] = this.burststars.frame[i] % starburst.length;
			if(this.burststars.frame[i] >= starburst.length-12){
				this.burststars.frame.shift();
				this.burststars.pos.shift();
				this.burststars.size.shift();
			}
		}
		for(let i = 0; i < this.burstclouds.pos.length; i++){
			this.burstclouds.frame[i] += frames % this.frameSpeed == 0 ? 1 : 0;
			// this.burststars.frame[i] = this.burststars.frame[i] % starburst.length;
			if(this.burstclouds.frame[i] >= cloudburst.length-12){
				this.burstclouds.frame.shift();
				this.burstclouds.pos.shift();
				this.burstclouds.size.shift();
			}
		}
	},

	update : function(){
		if(frames%150 == 0){
			this.position_star.push({
				x : getRandomInt(cvs.width * 0.9,cvs.width),
				y : getRandomInt(20,this.maxH_star)
			});
			this.size_star.push(getRandomInt(15,28) * this.ratio);
		}
		if(frames%600 == 0){
			let curRam = getRandomInt(3,8);
			this.position_cloud.push({
				x : getRandomInt(cvs.width * 0.95,cvs.width),
				y : getRandomInt(60,this.maxH_cloud)
			});
			this.size_cloud.push({
				w : this.origin_size.x * curRam * this.ratio,
				h : this.origin_size.y * curRam * this.ratio
			});
		}

		let curThreshold = {
			xmin : santaSleigh.x,
			xmax : santaSleigh.x + (santaSleigh.origin_size.w * santaSleigh.size_ratio) * 0.9,
			ymin : santaSleigh.y,
			ymax : santaSleigh.y + (santaSleigh.origin_size.h * santaSleigh.size_ratio) * 0.8//+ (santaSleigh.origin_size.h * santaSleigh.size_ratio)/2
		}
		// console.log(curThreshold.ymin);
		for(let i = 0; i < this.position_star.length; i++){
			let p = this.position_star[i];
			p.x -= this.speed_star;
			if(p.x + this.size_star[i] <= -5){
				this.position_star.shift();
				this.size_star.shift();
			}
			let curSize = {
				w : this.size_star[i],
				h : this.size_star[i]
			};
			if(this.size_star.length > 0 && state.current == state.game){
				const isCollidStar = collisionDetection(curThreshold,p,curSize);
				if(isCollidStar){
					if(starCounter < 5){
						score.score_state[starCounter] = 1;
						starCounter += 1;
						if(starCounter == 5 &&!santaSleigh.isLandingInitialized){
							state.current = state.end;
						}
					}
					this.burststars.pos.push(this.position_star[i]);
					this.burststars.size.push(this.size_star[i]); 
					this.burststars.frame.push(0);
					this.position_star.shift();
					this.size_star.shift();
				}
			}
		}
		for(let i = 0; i < this.position_cloud.length; i++){
			let p = this.position_cloud[i];
			p.x -= this.speed_cloud;
			if(p.x + this.size_cloud[i].w <= -5){
				this.position_cloud.shift();
				this.size_cloud.shift();
			}
			// console.log(p.y-this.size_cloud.y - curThreshold.ymin);
			if(this.size_cloud.length>0 && state.current == state.game){
				const isCollidCloud = collisionDetection(curThreshold,p,this.size_cloud[i]);
				if(isCollidCloud){
					if(starCounter > 0){
						starCounter -= 1;
						score.score_state[starCounter] = 0;
					}
					this.burstclouds.pos.push(this.position_cloud[i]);
					let cur_burst_size = {
						w:this.burstclouds.origin_size.w * (this.size_cloud[i].w/this.origin_size.x),
						h:this.burstclouds.origin_size.h * (this.size_cloud[i].h/this.origin_size.y)
					};
					// console.log(this.size_cloud[i].w);
					this.burstclouds.size.push(cur_burst_size); 
					this.burstclouds.frame.push(0);
					this.position_cloud.shift();
					this.size_cloud.shift();
				}
			}
		}
		this.burst();
	},

	resize : function(){
		this.ratio = 1 + (cvs.width-320)/320 * 0.15;
		if(this.ratio <= 1){
			this.ratio = 1;
		}
		this.maxH_star = cvs.height * 0.25;
		this.maxH_cloud = cvs.height * 0.3;
		this.speed_star = this.ratio;
		this.speed_cloud = 1.5 * this.speed_star;
	},

	restart : function() {
		if(this.position_star.length > 0){
			this.position_star.splice(0,this.position_star.length);
			this.size_star.splice(0,this.size_star.length);
		}
		if(this.position_cloud.length > 0){
			this.position_cloud.splice(0,this.position_cloud.length);
			this.size_cloud.splice(0,this.size_cloud.length);
		}
	}
}

function collisionDetection(threshold,input,size){
	  const pos = [({x : input.x, y : input.y}),({x: input.x + size.w, y: input.y}),
	  							({x : input.x,y : input.y + size.h}),({x : input.x + size.w, y: input.y + size.h})];
	  // const pos = [({x : input.x, y : input.y}),({x: input.x + size.w/2, y: input.y}),
	  // 							({x : input.x,y : input.y + size.h/2}),({x : input.x + size.w/2, y: input.y + size.h/2})];
	  for(let i = 0 ; i < pos.length; i++){
	  	if(pos[i].x > threshold.xmin && pos[i].x < threshold.xmax&& 
	  		 pos[i].y > threshold.ymin && pos[i].y < threshold.ymax){
	  		return true;
	  	}
	  }
	  return false;
}

//foreground bridge
const forgroundcityimg = new Image();
forgroundcityimg.src = './img/forgroundcity.png';
const forgroundcity = {
	w : 0,
	h : cvs.height * 0.45,
	x : 0,
	y : cvs.height - this.h,

	speed : 0.75,
	draw : function(){
		ctx.drawImage(forgroundcityimg,this.x,this.y,this.w,this.h);
	},

	update : function(){
		if(this.w > 0 && state.current < state.over){
			this.x -= this.speed;
			if(this.x <= -1 * this.w + cvs.width){
				this.x = 0;
			}
		}
	},

	resize : function(){
		this.h = cvs.height * 0.45;
		this.y = cvs.height - this.h;
		this.w = this.h * (forgroundcityimg.width/forgroundcityimg.height);
	}
}

//LOAD SANTA
const santa = [];
for(let i = 1; i <= 90; i++){
	let curframe = new Image();
	curframe.src = './img/SANTA_SLEIGH/SANTA_SLEIGH_' + i + '.png';
	santa.push(curframe);
}

const landing = [];
for(let i = 1 ; i <= 68; i++){
	let curframe = new Image();
	curframe.src = './img/SANTA_LANDING/LANDING_ ('+i+').png';
	landing.push(curframe);
}
const santaSleigh = {
	x : cvs.width * 0.5,
	y : cvs.height * 0.5,//50
	origin_size : {
		w : 240,
		h : 100
	},
	size_ratio : 1,
	frame : 0,
	frameSpeed : 5,
	forzeFrame : 0,

	gravity : 0.2,
	jump : 4,
	speed : 0,
	maxH0 : 200,
	maxH:260,
	speedY : 0,

	isLandingInitialized : false,

	draw : function(){
		// path = dir + (this.frame + 1) + fileextension;
		// santa.src = path;
		if(state.current != state.end){
			ctx.drawImage(santa[this.frame],590,410,710,260,this.x,this.y,this.origin_size.w * this.size_ratio,this.origin_size.h * this.size_ratio);
			// ctx.beginPath();
			// ctx.rect(this.x,this.y,this.origin_size.w * this.size_ratio,this.origin_size.h * this.size_ratio);
			// ctx.stroke();
		}else{
			ctx.drawImage(landing[this.frame],50,60,710,260,this.x,this.y,this.origin_size.w * this.size_ratio,this.origin_size.h * this.size_ratio);
		}
	},

	flap : function(){
		this.speed =- this.jump;
	},

	update :function(){
		// increment the frame by 1, each period
		if(state.current <= state.end){
			this.frame += frames % this.frameSpeed == 0 ? 1 : 0;
		}
		if(state.current < state.end){
					//frames goes from 0 to 90, then again to 0
			this.frame = this.frame % santa.length;
			this.speed += this.gravity;
			this.y += this.speed;
			if(this.y >= this.maxH0){
				this.y = this.maxH0;
			}
			else if(this.y <= (-1 * this.origin_size.h * this.size_ratio)/2){
				this.y = -1 * this.origin_size.h * this.size_ratio/2;	
			}
		}else if(state.current == state.end){
			// console.log(this.y);
			if(!this.isLandingInitialized){
				this.frame = 0;
				this.isLandingInitialized = true;
				this.speedY = (this.maxH - this.y)/((macys.x - macys.middleX)/macys.speed);
			}else{
				this.frame = this.frame % landing.length;
				this.y += this.speedY;
				if(this.y >= this.maxH){
					this.y = this.maxH;
				}
			}
		}
	},

	loadLandig : function(){
	},

	resize : function(){
		this.size_ratio = 1 + (cvs.height-640)/640 * 0.1;
		if(this.size_ratio <= 0.8){
			this.size_ratio = 0.8;
		}
		this.x = (cvs.width - this.origin_size.w * this.size_ratio) * 0.5; 
		this.y = (cvs.height - this.origin_size.h * this.size_ratio) * 0.5;
		this.maxH0 = cvs.height * 0.4;
		this.maxH = cvs.height * 0.55;
		this.jump = cvs.height/160;
		this.gravity = this.jump * 0.05;
	},

	restart : function(){
		this.isLandingInitialized = false;
	}

}

//WINNER
const winimg = [];
for(let i = 1 ; i <= 68; i++){
	let curframe = new Image();
	curframe.src = './img/WINNER/WINNER_ ('+i+').png';
	winimg.push(curframe);
}
const win = {
	origin_size : {
		w : 1920,
		h : 1080
	},
	ratio : 0.2,
	pos : {
		x : -25,
		y : 100
	},
	frame : 0,
	frameSpeed : 5,

	draw : function(){
		if(state.current >= state.end){
			ctx.drawImage(winimg[this.frame],this.pos.x,this.pos.y,this.origin_size.w * this.ratio, this.origin_size.h * this.ratio);
		}
	},

	update : function(){
		if(state.current >= state.end){
			this.frame += frames % this.frameSpeed == 0 ? 1 : 0;
			this.frame = this.frame % winimg.length;
		}
	},

	resize : function(){
			this.ratio = ((santaSleigh.origin_size.w * santaSleigh.size_ratio)/this.origin_size.w) * 1.9;
			this.pos.x = (cvs.width - this.origin_size.w * this.ratio) * 0.5; 
			this.pos.y = cvs.height * 0.2;//(cvs.height - this.origin_size.h * this.ratio) * 0.5;
	}
}


//SOCRES
const scoreimg = [new Image(),new Image()];
const score_outline_dir = './img/star_0.png';
const score_fill_dir = './img/star_1.png';
scoreimg[0].src = score_outline_dir;
scoreimg[1].src = score_fill_dir;
// const scoreimg = new Image();

const score = {
	origin_size : {
		x : 143,
		y : 108
	},
	pos:{
		x : 10,
		y : 10,
		space : 30
	},
	ratio : 0.25,
	num : 5,
	score_state : [0,0,0,0,0],

	draw : function(){
		// this.ratio = (cvs.width - 320)/
		for(let i = 0 ; i < this.num; i++){
			let curPos = {
				x : this.pos.space * i + this.pos.x,
				y : this.pos.x
			}
			// console.log(this.score_state[i]);
			ctx.drawImage(scoreimg[this.score_state[i]],curPos.x,curPos.y,this.origin_size.x * this.ratio,this.origin_size.y * this.ratio);
		}
	},

	resize : function(){
		this.ratio = 0.25 + (cvs.width - 320)/320 * 0.05;
		if(this.ratio <= 0.25){
			this.ratio = 0.25;
		}
		this.pos.space = 30 * (this.ratio/0.25);
	},

	restart : function(){
		this.score_state = [0,0,0,0,0];
	}
}

//GAME STATE
const state = {
	current : 0,
	getReady : 0,
	game : 1,
	end : 2,
	over : 3
}

//Game Instruction
const textInstructor = {
	content : ["Click to Start the Game","Click to ReStart the Game"],
	font : 0,
	color : "white",
	x : 0,
	y : 0,

	draw : function(){
		if(state.current == state.getReady){
			ctx.font = this.font;
			ctx.fillStyle = this.color;
			ctx.textAlign = "center";
			ctx.fillText(this.content[0], this.x, this.y);
		}else if(state.current == state.over){
			this.color = "white";
			ctx.fillText(this.content[1], this.x, this.y);
		}
	},

	resize : function() {
		let cursize = (cvs.height * 0.04);
		if(cursize >= 35){
			cursize = 35;
		}else if(cursize <= 25){
			cursize = 25;
		}
		this.font = cursize + 'px'+' Arial';
		this.x = cvs.width/2;
		this.y = cvs.height * 0.9;
	}
}

//CONTROL THE GAME
document.addEventListener("click",function(evt){
	switch(state.current){
		case state.getReady:
			state.current = state.game;
			restart();
			break;
		case state.game:
			santaSleigh.flap();
			break;
		case state.end:
			santaSleigh.loadLandig();
			break;
		case state.over : 
			state.current = state.getReady;
			break;
	}
})

function resize() {
	bgsky.resize();
	citybkg.resize();
	citybkg2.resize();
	bridge.resize();
	santaSleigh.resize();
	forgroundcity.resize();
	stars.resize();
	win.resize();
	score.resize();
	textInstructor.resize();
	macys.resize();
	// console.log("ReStart");
}

function restart() {
	frames = 0;
	starCounter = 0;
	santaSleigh.restart();
	stars.restart();
	macys.restart();
	score.restart();
}

window.addEventListener('resize',function(evt){
	var size = {
		width: window.innerWidth || document.body.clientWidth,
	  height: window.innerHeight || document.body.clientHeight
	}
	cvs.width = size.width;
	cvs.height = size.height;
	resize();
});


function draw(){

	ctx.clearRect(0, 0, cvs.width,cvs.height);
	ctx.fillStyle = "#4BAEBE";
	ctx.fillRect(0, 0, cvs.width, cvs.height);
	bgsky.draw();
	citybkg.draw();
	citybkg2.draw();
	bridge.draw();
	stars.draw();
	santaSleigh.draw();
	macys.draw();
	forgroundcity.draw();
	win.draw();
	score.draw();
	textInstructor.draw();
}

function update(){
	bgsky.update();
	citybkg.update();
	citybkg2.update();
	stars.update();
	santaSleigh.update();
	macys.update();
	bridge.update();
	forgroundcity.update();
	win.update();
}

function loop(){
	update();
	draw();
	frames ++;
	if(frames<=50){
		resize();
	}else if(frames >= 5000){
		frames = 0;
	}
	requestAnimationFrame(loop);
}
loop();