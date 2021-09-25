var mouse = { x : 0, y : 0},
isMouseDown = false,
canvas = document.getElementById("particle-canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx = canvas.getContext("2d"),
height = canvas.height,
width = canvas.width;

// SETTINGS
particleCount = 150;
particleCollection = [];
gravity = 0.7;
bounciness = 0.3;
ground = height / 2;

//Particle Prefab, Settings:
function Particle() {
    this.x;
    this.y;
    this.radius;
    this.color;
    this.speed;
    this.vx;
    this.vy;
    this.lockX;
    this.lockY;
    this.bounceCount;
}


Particle.prototype = {
    constructor: Particle, //Prototype constructor property. References Particle() function. Constructor function.
    draw: function(ctx) {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = this.color;  //Particle color
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, false); 
      ctx.strokeStyle = "#330033";
      ctx.lineWidth = 5;
      ctx.closePath();
      ctx.stroke();
      ctx.fill();  
   
      // Draw Shadow. 
      ctx.globalCompositeOperation = "destination-over";
      ctx.filter = "blur(1px)";
      ctx.fillStyle = "#00004d"; 
      ctx.beginPath();
      ctx.ellipse(this.x, ground + 5, 3 *this.radius * (Math.min(this.y / ground, ground)), 0.2, 0, 0, Math.PI*2, true);
      ctx.closePath();
      ctx.fill();
      ctx.filter= "none";
    },
}


if (CanvasRenderingContext2D.prototype.ellipse == undefined) {
    CanvasRenderingContext2D.prototype.ellipse = function(x, y, radiusX, radiusY,
          rotation, startAngle, endAngle, antiClockwise) {
      this.save();
      this.translate(x, y);
      this.rotate(rotation);
      this.scale(radiusX, radiusY);
      this.arc(0, 0, 1, startAngle, endAngle, antiClockwise);
      this.restore();
    }
}

document.addEventListener("mousemove", function (event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
   
    }, false
  );  

  $(document).on('mousedown mouseup', function mouseState(e) {
    if (e.type == "mousedown") {
        isMouseDown = true;
    }
    else isMouseDown = false;
});


window.onresize = function() {
    height = canvas.height = window.innerHeight;
    width = canvas.width = window.innerWidth;
  };


function animateParticleSystem() {
    requestAnimationFrame(animateParticleSystem);
    ctx.clearRect(0, 0, width, height);
    if(isMouseDown) addParticles();
  /*
    foodPoints.forEach(function(food) {
      ctx.fillStyle = "red";  //Particle color
      ctx.beginPath();
      ctx.arc(food[0], 100, 5, 0, Math.PI*2, false); 
      ctx.closePath();
      ctx.stroke();
      ctx.fill();  
    })
  */
    particleCollection.forEach(function(particle_){
  
      //The particles are supposed to have a specific behaviour. Couldn't figure out quick how to do with less code.. 
      particle_.draw(ctx);
      if(!particle_.lockY) {
        particle_.vy += gravity;
        particle_.y += particle_.vy;
        
      }
      if(!particle_.lockX) {
        particle_.vx = particle_.vx - Math.sign(particle_.vx) * 0.2;
        particle_.x += particle_.vx;
      } 
  
      if(particle_.y > ground)
      {
        if(particle_.bounceCount == 0) {
          particle_.vx =(Math.random() - 0.5) * 20;
          particle_.bounceCount += 1;
        } 
        particle_.y = ground;
        particle_.vy *= -1 * bounciness;
        if(particle_.vy > -0.5) {
          particle_.lockY = true;
          
        }
      }
      else if(particle_.y == ground && Math.abs(particle_.vx) < 0.2) {
        particle_.vx = 0;
        particle_.lockX = true;
      }
    })
  }
  

  function addParticles() {
    var m = mouse;
   
    if(particleCollection.length >= particleCount){
      particleCollection.shift();
    } 
       
    var particle = new Particle();
        let rnd = Math.random();
        if(rnd > 0.5) particle.color = "#ffcc00";
        else particle.color="#cc9900";
        particle.vy = Math.random() * 10;
        particle.vx = 0;
        particle.radius = Math.max(2, Math.random() * 5);
        particle.x = m.x;
        particle.movable = true;
        particle.y = m.y;
        particle.lockX = false;
        particle.lockY = false;
        particle.bounceCount = 0;
        particleCollection.push(particle);
  }
  
  
  
animateParticleSystem();