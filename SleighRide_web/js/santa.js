const cvs = document.getElementById("gamecanvas");
const ctx = cvs.getContext("2d");

let frames = 0;
let starCounter = 0;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); 
}

//BACKGROUND sky
const sky = new Image();
sky.src = './img/sky.png';
const bgsky = {
	x : 0,
	y : 0,
	w : cvs.width,
	h : cvs.height,

	draw : function(){
		ctx.drawImage(sky,this.x,this.y,this.w,this.h);
	},
}

//BACKGROUND city
const citybkgimg = new Image();
citybkgimg.src = './img/citybkg.png';
const citybkg = {
	x : 0,
	y : 200,
	w : 0,
	h : 300,
	speed : 0.1,
	draw : function(){
		this.w = this.h * (citybkgimg.width/citybkgimg.height);
		// console.log(this.w);
		ctx.drawImage(citybkgimg,this.x,this.y,this.w,this.h);
	},

	update : function(){
		if(this.w > 0){
			this.x -= this.speed;
			if(this.x <= -1 * this.w + cvs.width){
				this.x = 0;
			}
		}
	}
}

//BACKGROUND city2
const citybkgimg2 = new Image();
citybkgimg2.src = './img/citybkg2.png';
const citybkg2 = {
	x : 0,
	y : 120,
	w : 0,
	h : 360,
	speed : 0.35,
	draw : function(){
		this.w = this.h * (citybkgimg2.width/citybkgimg2.height);
		ctx.drawImage(citybkgimg2,this.x,this.y,this.w,this.h);
	},

	update : function(){
		if(this.w > 0){
			this.x -= this.speed;
			if(this.x <= -1 * this.w + cvs.width){
				this.x = 0;
			}
		}
	}
}

//BACKGROUND bridge
const bridgeimg = new Image();
bridgeimg.src = './img/bridges.png';
const bridge = {
	x : -100,
	y : 380,
	w : 0,
	h : 120,

	speed : 0.3,
	draw : function(){
		this.w = this.h * (bridgeimg.width/bridgeimg.height);
		ctx.drawImage(bridgeimg,this.x,this.y,this.w,this.h);
	},

	update : function(){
		if(this.w > 0){
			this.x -= this.speed;
			if(this.x <= -1 * this.w + cvs.width){
				this.x = 0;
			}
		}
	}
}

//stars
const starsimg = new Image();
const starburst = new Image();
starsimg.src = './img/STAR.png';
starburst.src = './img/STAR_BURST_.png'

const cloudimg = new Image();
cloudimg.src = './img/CLOUD_STILL.png';
const stars = {
	position_star : [],
	size_star : [],
	maxH_star : 80,
	speed_star : 0.3,

	position_cloud : [],
	origin_size : {
		x : 18.5,
		y : 4.2
	},
	size_cloud : [],
	maxH_cloud :150,
	speed_cloud : 0.65,
	draw : function(){
		// console.log(this.position.length);
		for(let i = 0; i < this.position_star.length; i++){
			ctx.drawImage(starsimg,350,350,400,400,this.position_star[i].x,this.position_star[i].y,this.size_star[i],this.size_star[i]);
		}
		for(let i = 0; i < this.position_cloud.length; i++){
			ctx.drawImage(cloudimg,1000,900,1850,428,this.position_cloud[i].x,this.position_cloud[i].y,this.size_cloud[i].w,this.size_cloud[i].h);
			// ctx.beginPath();
			// ctx.rect(this.position_cloud[i].x,this.position_cloud[i].y,this.size_cloud[i].w,this.size_cloud[i].h);
			// ctx.stroke();
		}
	},

	update : function(){
		if(frames%300 == 0){
			this.position_star.push({
				x : getRandomInt(260,cvs.width),
				y : getRandomInt(20,this.maxH_star)
			});
			this.size_star.push(getRandomInt(15,28));
		}
		if(frames%700 == 0){
			let curRam = getRandomInt(3,8);
			this.position_cloud.push({
				x : getRandomInt(200,cvs.width),
				y : getRandomInt(60,this.maxH_cloud)
			});
			this.size_cloud.push({
				w : this.origin_size.x * curRam,
				h : this.origin_size.y * curRam
			});
		}

		let curThreshold = {
			xmin : santaSleigh.x,
			xmax : santaSleigh.x + (santaSleigh.origin_size.w * santaSleigh.size_ratio) * 0.9,
			ymin : santaSleigh.y + 10,
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
			if(this.size_star.length > 0){
				const isCollidStar = collisionDetection(curThreshold,p,curSize);
				if(isCollidStar){
					if(starCounter < 5){
						score.score_state[starCounter] = 1;
						starCounter += 1;
					}
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
			if(this.size_cloud.length>0){
				const isCollidCloud = collisionDetection(curThreshold,p,this.size_cloud[i]);
				if(isCollidCloud){
					if(starCounter > 0){
						starCounter -= 1;
						score.score_state[starCounter] = 0;
					}
					this.position_cloud.shift();
					this.size_cloud.shift();
				}
			}
		}
		// if(starCounter >= 4){
		// 	starCounter = 4;
		// }else if(starCounter<=0){
		// 	starCounter = 0;
		// }
		// console.log(starCounter);
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
	x : 0,
	y : 220,
	w : 0,
	h : 260,

	speed : 0.35,
	draw : function(){
		this.w = this.h * (forgroundcityimg.width/forgroundcityimg.height);
		ctx.drawImage(forgroundcityimg,this.x,this.y,this.w,this.h);
	},

	update : function(){
		if(this.w > 0){
			this.x -= this.speed;
			if(this.x <= -1 * this.w + cvs.width){
				this.x = 0;
			}
		}
	}
}

//LOAD SANTA
const santa = [];
for(let i = 0; i < 90; i++){
	let curframe = new Image();
	curframe.src = './img/SANTA_SLEIGH/SANTA_SLEIGH_' + (i+1) + '.png';
	santa.push(curframe);
}
// const dir = './img/SANTA_SLEIGH/SANTA_SLEIGH_';
// var fileextension = ".png";
// var path;
 //"./img/Santa-Ride.js"

const santaSleigh = {
	x : 100,
	y : 50,
	origin_size : {
		w : 200,
		h : 100
	},
	size_ratio : 0.8,
	frame : 0,
	frameSpeed : 5,
	animationFrames : 90,

	gravity : 0.05,
	jump : 2.5,
	speed : 0,
	maxH:150,

	draw : function(){
		// path = dir + (this.frame + 1) + fileextension;
		// santa.src = path;
		ctx.drawImage(santa[this.frame],568,358,800,315,this.x,this.y,this.origin_size.w * this.size_ratio,this.origin_size.h * this.size_ratio);
	},

	flap : function(){
		this.speed =- this.jump;
	},

	update :function(){
		// increment the frame by 1, each period
		this.frame += frames % this.frameSpeed == 0 ? 1 : 0;
		//frames goes from 0 to 90, then again to 0
		this.frame = this.frame % this.animationFrames;
		this.speed += this.gravity;
		this.y += this.speed;
		if(this.y >= this.maxH){
			this.y = this.maxH;
		}
		else if(this.y <= (-1 * this.origin_size.h * this.size_ratio)/2){
			this.y = -1 * this.origin_size.h * this.size_ratio/2;	
		}
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
	ratio : 0.25,
	num : 5,
	score_state : [0,0,0,0,0],

	draw : function(){
		for(let i = 0 ; i < this.num; i++){
			let curPos = {
				x : 30 * i + 10,
				y : 10
			}
			// console.log(this.score_state[i]);
			ctx.drawImage(scoreimg[this.score_state[i]],curPos.x,curPos.y,this.origin_size.x * this.ratio,this.origin_size.y * this.ratio);
		}
	}
}

//GAME STATE
const state = {
	current : 0,
	getReady : 0,
	game : 1,
	over : 2
}
//CONTROL THE GAME
document.addEventListener("click",function(evt){
	santaSleigh.flap();
	// switch(state.current){
	// 	case state.getReady:
	// 		state.current = state.game;
	// 		break;
	// 	case state.game:
	// 		santaSleigh.ride();
	// 		break;
	// 	case state.over:
	// 		state.current = state.getReady;
	// 		break;
	// }
})

function draw(){
	// ctx.fillStyle = "#70c5ce";
	// ctx.fillRect(0,0,cvs.width,cvs.height);

	ctx.clearRect(0, 0, cvs.width,cvs.height);
	bgsky.draw();
	citybkg.draw();
	citybkg2.draw();
	bridge.draw();
	stars.draw();
	santaSleigh.draw();
	forgroundcity.draw();
	score.draw();
}

function update(){
	citybkg.update();
	citybkg2.update();
	stars.update();
	santaSleigh.update();
	bridge.update();
	forgroundcity.update();
}

function loop(){
	update();
	draw();
	frames ++;

	requestAnimationFrame(loop);
}

loop();