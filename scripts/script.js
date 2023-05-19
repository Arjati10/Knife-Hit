var Canvas = document.getElementById("canvas");
var imageLvl = document.getElementById("levelImage");
Canvas.width = document.body.clientWidth;
Canvas.height = document.body.clientHeight;
var ctx = Canvas.getContext("2d");
canvas.width = 500;
canvas.height = 700;

var knife = new Image();
let target = new Image();
var levelIMG = new Image();
target.src = "assets/tree.png";
knife.src = "assets/knife.png";
var ctx = canvas.getContext("2d");

var startAngle = 2 * Math.PI;
var endAngle = Math.PI * 2; //Welcome to my knife hit
var currentAngle = 0; //Level-1- Normal game
var rectheight = Canvas.height - 90; //Level-2- Pre-fixed Knifes_rem
var knife_moving = 0; // level-3-Inverse rotating target
var knifes_remaining = 10; //level-4-Mirroring target on knife hit
var hit = 0; //Further levels to be added
var level = 1;
var flag = 0;
var hit_knifes = [];

const bgm = document.getElementById("bgm");
const hitSound = document.getElementById("hitSound");

var raf =
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  window.oRequestAnimationFrame;

function check_rect_collision(curarc) {
  console.log(curarc.current_angle);
  for (i in hit_knifes) {
    if (Math.abs(curarc.current_angle - hit_knifes[i].cangle) < 0.15) {
      ctx.clearRect(0, 0, Canvas.width / 2, Canvas.height / 2);
      document.getElementById("loser-screen-container").style.scale = "1";
    }
  }
}

function reloadd() {
  window.location.reload();
}

let leveling = document.getElementById("leveling");

function nextLevel() {
  document.getElementById("level-screen-container").style.scale = "0";
  document.getElementById("leveling").innerHTML = level;
  console.log(leveling);
  leveling++;
}

function check_collision(curarc, currec) {
  if (currec.y - curarc.centerY <= curarc.radius) {
    //  alert("Hit");
    hit = 1;
    //console.log(currec.y);
    check_rect_collision(curarc);
    hit_knifes.push({
      x: currec.x,
      y: currec.y,
      width: currec.width,
      height: currec.height,
      r: curarc.radius,
      angle: 0,
      cangle: curarc.current_angle,
    });
    hitSound.play();
    knifes_remaining--;
    return true;
  }
  return false;
}

function change_status() {
  if (knife_moving === 0) knife_moving = 1;
  //  else
  //knife_moving=0;
}

function Update() {
  if (level == 2 && flag == 0) {
    imageLvl.src = "assets/lv2-01.png";
    hit_knifes = [];
    currentAngle = 0;
    hit_knifes.push({
      x: canvas.width / 2,
      y: 295,
      width: 40,
      height: 80,
      r: 100,
      angle: 0,
      cangle: 0,
    });
    hit_knifes.push({
      x: canvas.width / 2,
      y: 295,
      width: 40,
      height: 80,
      r: 100,
      angle: 2.35,
      cangle: 2.35,
    });
    hit_knifes.push({
      x: canvas.width / 2,
      y: 295,
      width: 40,
      height: 80,
      r: 100,
      angle: 4.27,
      cangle: 4.27,
    });
    knifes_remaining = 8;
    flag++;
  }

  if (level == 3 && flag == 1) {
    imageLvl.src = "assets/lvl3-01.png";
    hit_knifes = [];
    currentAngle = 0;
    knifes_remaining = 10;
    flag++;
  }

  if (level == 4 && flag == 2) {
    imageLvl.src = "assets/lv4-01.png";
    hit_knifes = [];
    currentAngle = 0;
    knifes_remaining = 12;
    flag++;
  }

  if (level == 5 && flag == 3) {
    imageLvl.src = "assets/lv boss-01.png";
    hit_knifes = [];
    currentAngle = 0;
    hit_knifes.push({
      x: Canvas.width / 2,
      y: 295,
      width: 40,
      height: 80,
      r: 100,
      angle: 0.65,
      cangle: 0.65,
    });
    hit_knifes.push({
      x: Canvas.width / 2,
      y: 295,
      width: 40,
      height: 80,
      r: 100,
      angle: 4.65,
      cangle: 4.65,
    });
    hit_knifes.push({
      x: Canvas.width / 2,
      y: 295,
      width: 40,
      height: 80,
      r: 100,
      angle: 5.35,
      cangle: 5.35,
    });
    hit_knifes.push({
      x: Canvas.width / 2,
      y: 295,
      width: 40,
      height: 80,
      r: 100,
      angle: 7.35,
      cangle: 7.35,
    });
    knifes_remaining = 14;
    flag++;
  }

  if (knifes_remaining > 0) {
    if (rectheight < 0 || hit == 1) {
      rectheight = Canvas.height - 90;
      knife_moving = 0;
      hit = 0;
    }
    document.getElementById("Knifes_rem").innerHTML =
      "Knifes Remaining:" + (knifes_remaining - 1);
    var current_arc = {
      centerX: Canvas.width / 2,
      centerY: 200,
      radius: 100,
      current_angle: currentAngle,
      direction: false,
      lineWidth: 33,
    };

    //Clears
    ctx.clearRect(0, 0, Canvas.width, Canvas.height);
    ctx.beginPath();
    ctx.drawImage(knife, Canvas.width / 2, rectheight, 40, 80);
    ctx.fillStyle = "red";
    var current_rec = {
      x: Canvas.width / 2,
      y: rectheight,
      width: 40,
      height: 80,
    };
    if (Object.keys(hit_knifes).length > 0) {
      for (i in hit_knifes) {
        ctx.save();
        ctx.translate(Canvas.width / 2, 200);
        ctx.beginPath();
        if (level == 3) ctx.rotate(6.28 - hit_knifes[i].angle);
        else if (level == 4 && knifes_remaining % 2 == 0)
          ctx.rotate(hit_knifes[i].angle);
        else if (level == 4 && knifes_remaining % 2 != 0)
          ctx.rotate(6.28 - hit_knifes[i].angle);
        else if (level == 5 && knifes_remaining % 2 == 0)
          ctx.rotate(hit_knifes[i].angle);
        else if (level == 5 && knifes_remaining % 2 != 0)
          ctx.rotate(6.35 - hit_knifes[i].angle);
        else ctx.rotate(hit_knifes[i].angle);
        ctx.fillStyle = "red";
        ctx.drawImage(
          knife,
          hit_knifes[i].x - Canvas.width / 2,
          hit_knifes[i].y - 200,
          40,
          80
        );
        ctx.closePath();
        ctx.translate(-Canvas.width / 2, -200);
        ctx.restore();
        hit_knifes[i].angle += Math.PI / 180;
        hit_knifes[i].angle %= 2 * Math.PI;
      }
    }
    //Drawing
    ctx.beginPath();
    ctx.drawImage(target, Canvas.width / 2 - 100, 100, 200, 200);

    // ctx.strokeStyle = "black";
    // ctx.lineWidth = 33.0;
    // ctx.stroke();

    currentAngle += Math.PI / 180;
    currentAngle %= 2 * Math.PI;
    // ctx.rotate(currentAngle);

    ctx.closePath();

    if (knife_moving === 1) rectheight -= 35;
    //console.log(typeof(hit_knifes));
    document.getElementById("Level").innerHTML = level;
    var result = check_collision(current_arc, current_rec);

    raf(Update);
  } else {
    document.getElementById("level-screen-container").style.scale = "1";
    if (level == 5) {
      document.getElementById("winner-screen-container").style.scale = "1";
    }
    level++;
    raf(Update);
  }
}

raf(Update);
