let canvas = document.getElementById("canvas");
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
let ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 700;
let knife = new Image();
knife.src = "img/kunai.png";
let startAngle = (2 * Math.PI);
let endAngle = (Math.PI * 2);       //Welcome to my knife hit
let currentAngle = 0;             //Level-1- Normal game
let rectheight = canvas.height - 90;  //Level-2- Pre-fixed Knifes_rem
let knife_moving = 0;               // level-3-Inverse rotating target
let knifes_remaining = 10;          //level-4-Mirroring target on knife hit
let hit = 0;                        //Further levels to be added
let level = 1;
let flag = 0;
let hit_knifes = [];

const popup = document.getElementById("game-over-popup");
popup.style.display = "none";
popup.style.display = "block";
let raf = window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  window.oRequestAnimationFrame;

const loadGameOverScreen = () => {
  // Membuat objek GIF dari file GIF
  let gif = new GIF({
    workers: 2,
    quality: 10,
  });

  // Menambahkan frame GIF ke objek GIF
  let imageElement = document.createElement("img");
  imageElement.src = "../img/QeMS.gif";
  
  gif.addFrame(imageElement, { delay: 100 });

  // Menyimpan dan menampilkan hasil GIF
  gif.on("finished", function (blob) {
    let image = document.createElement("img");
    image.src = URL.createObjectURL(blob);
    document.body.appendChild(image);

    let ctx = canvas.getContext("2d");
    image.onload = function () {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 100, 100);
    };
  });

  // Mengakhiri proses pembuatan GIF
  gif.render();

  // let canvas = document.getElementById('canvas')
  // let ctx = canvas.getContext('2d')
  // let gifWidth = gif.width
  // let gifHeight = gif.height
  // let gifX = (canvas.width - gifWidth) / 2 // Calculate center position of GIF animation horizontally
  // let gifY = (canvas.height - gifHeight) / 2 // Calculate center position of GIF animation vertically
}

function check_rect_collision(curarc) {
  console.log(curarc.current_angle);
  for (i in hit_knifes) {
    if (Math.abs(curarc.current_angle - hit_knifes[i].cangle) < 0.15) {
      ctx.clearRect(0, 0, canvas.width / 2, canvas.height / 2);
      alert("Aww.. You lost you're cool man!");
      loadGameOverScreen();
    }
  }
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
      cangle: curarc.current_angle
    });
    knifes_remaining--;
    return true;
  }
  return false;
}

function change_status() {
  if (knife_moving === 0)
    knife_moving = 1;
  //  else
  //knife_moving=0;
}

function Update() {

  if (level == 2 && flag == 0) {
    hit_knifes = [];
    currentAngle = 0;
    hit_knifes.push({
      x: canvas.width / 2,
      y: 295,
      width: 40,
      height: 80,
      r: 100,
      angle: 0,
      cangle: 0
    });
    hit_knifes.push({
      x: canvas.width / 2,
      y: 295,
      width: 40,
      height: 80,
      r: 100,
      angle: 2.35,
      cangle: 2.35
    });
    hit_knifes.push({
      x: canvas.width / 2,
      y: 295,
      width: 40,
      height: 80,
      r: 100,
      angle: 4.27,
      cangle: 4.27
    });
    knifes_remaining = 8;
    flag++;
  }

  if (level == 3 && flag == 1) {
    hit_knifes = [];
    currentAngle = 0;
    knifes_remaining = 10;
    flag++;
  }

  if (level == 4 && flag == 2) {
    hit_knifes = [];
    currentAngle = 0;
    knifes_remaining = 12;
    flag++;
  }

  if (knifes_remaining > 0) {
    if (rectheight < 0 || hit == 1) {
      rectheight = canvas.height - 90;
      knife_moving = 0;
      hit = 0;
    }
    window.onload = function what() { }
    document.getElementById("Knifes_rem").innerHTML = `Knifes Remaining: ${(knifes_remaining - 1)}`;
    let current_arc =
    {
      "centerX": canvas.width / 2,
      "centerY": 200,
      "radius": 100,
      "current_angle": currentAngle,
      "direction": false,
      "lineWidth": 33
    }

    //Clears
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.drawImage(knife, canvas.width / 2, rectheight, 40, 80);
    ctx.fillStyle = "red";
    let current_rec =
    {
      "x": canvas.width / 2,
      "y": rectheight,
      "width": 40,
      "height": 80,
    }
    if (Object.keys(hit_knifes).length > 0) {
      for (i in hit_knifes) {
        ctx.save();
        ctx.translate(canvas.width / 2, 200);
        ctx.beginPath();
        if (level == 3)
          ctx.rotate(6.28 - hit_knifes[i].angle);
        else if (level == 4 && knifes_remaining % 2 == 0)
          ctx.rotate(hit_knifes[i].angle);
        else if (level == 4 && knifes_remaining % 2 != 0)
          ctx.rotate(6.28 - hit_knifes[i].angle);
        else
          ctx.rotate(hit_knifes[i].angle);
        ctx.fillStyle = "red";
        ctx.drawImage(knife, hit_knifes[i].x - canvas.width / 2, hit_knifes[i].y - 200, 40, 80);
        ctx.closePath();
        ctx.translate(-canvas.width / 2, -200);
        ctx.restore();
        hit_knifes[i].angle += Math.PI / 180;
        hit_knifes[i].angle %= 2 * Math.PI;
      }
    }
    //Drawing
    ctx.beginPath();
    ctx.arc(canvas.width / 2, 200, 100, startAngle + currentAngle, startAngle + currentAngle + Math.PI * 2, false);
    ctx.strokeStyle = "purple";
    ctx.lineWidth = 40.0;
    ctx.stroke();

    currentAngle += Math.PI / 180;

    currentAngle %= 2 * Math.PI;
    ctx.closePath();

    if (knife_moving === 1)
      rectheight -= 15;
    //console.log(typeof(hit_knifes));
    document.getElementById("Level").innerHTML = level;
    let result = check_collision(current_arc, current_rec);

    raf(Update);
  }
  else {
    alert("YOU COMPLETED THE LEVEL ! CONGRATUALTIONS");
    if (level == 4) {
      alert("Thank you for playing the game");
      window.location.reload();
    }
    level++;
    raf(Update);
  }

}
raf(Update);
