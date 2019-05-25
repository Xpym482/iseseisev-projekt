let cvs = document.getElementById("canvas");
let ctx = cvs.getContext("2d");

let bird = new Image();
let bg = new Image();
let fg = new Image();
let pipeUp = new Image();
let pipeBottom = new Image();
let rune_invisible = new Image();
let empty_bird = new Image();
let rune_haste = new Image();
let rune_score = new Image();
let fly = new Audio();
let score_audio = new Audio();

let gap = 100;
let gameMod = "waiting";
let runeInvisibleActivated = 0;
let runeHasteActivated = 0;
let rune_bonus = 5;
let pipe = [];
let runes = [];
let score = 0;
let xPos = 10;
let yPos = 150;
let grav = 1.2;
let score_now = 0;
let rune_speed = 1;
let rune_grav = 0;
let randomizer;
let pipeNumber = 0;
let test = 0;

rune_haste.src = "img/rune_haste.png";
rune_invisible.src = "img/rune_invisible.png";
rune_score.src = "img/rune_score.png";
bird.src = "img/bird.png";
empty_bird.src = "img/bird_empty";
bg.src = "img/bg.png";
fg.src = "img/fg.png";
pipeUp.src = "img/pipeUp.png";
pipeBottom.src = "img/pipeBottom.png";
fly.src = "audio/fly.mp3";
score_audio.src = "audio/score.mp3";

document.addEventListener("keydown", moveUp);

//Сделан свитч для переключения между запущенной игрой и не запущенной
function moveUp() {
  switch (gameMod) {
    case "running":
      yPos -= 40 + (rune_grav > 0 ? rune_grav * 12 : 0);
      break;
    case "waiting":
      draw();
      gameMod = "running";
      break;
  }
  //fly.play();
}

runes[0] = {
  x : cvs.width + 130,
  y : 0
}

pipe[0] = {
  x : cvs.width,
  y : 0
}

function draw() {
  ctx.drawImage(bg, 0, 0);
  //ctx.drawImage(rune_invisble, pipe[0].x + 10, pipe[0].y + pipeUp.height + 40);
  //ctx.drawImage(rune_haste, pipe[0].x + 10, pipe[0].y + pipeUp.height + 40);
  ctx.drawImage(runeInvisibleActivated ? empty_bird : bird, xPos, yPos);
  for(let i = 0; i < pipe.length; i++){
    if(pipe[i].x == 100){
      pipe.push({
        x : cvs.width,
        y : Math.floor(Math.random() * pipeUp.height) - pipeUp.height
      });
      runes.push({
        x : cvs.width,
        y : 0
      });
      pipeNumber = i;
      randomizer = pseudorandom();
    }

    if(randomizer){
      ctx.drawImage(randomizer, pipe[pipeNumber].x + 10, pipe[pipeNumber].y + pipeUp.height + 40);
      test = 1;
    }
    else{
      test = 0;
    }

    ctx.drawImage(pipeUp, pipe[i].x, pipe[i].y);
    ctx.drawImage(pipeBottom, pipe[i].x, pipe[i].y + pipeUp.height + gap);
    pipe[i].x = pipe[i].x - rune_speed;
    runes[pipeNumber].x--;

    if(!runeInvisibleActivated && xPos + bird.width >= pipe[i].x && xPos <= pipe[i].x + pipeUp.width
      && (yPos <= pipe[i].y + pipeUp.height || yPos + bird.height >= pipe[i].y +
      pipeUp.height + gap) || yPos + bird.height >= cvs.height - fg.height){
        window.location.href = "index.html";
    }

    if(pipe[i].x == 6){
      score++;
      score_audio.play();
    }

    if(test && xPos + bird.width >= runes[pipeNumber].x + 10) //третье условие - появилась ли какая-то руна
    {
      switch (randomizer) {
        case rune_score:
          score = score + 3;
          randomizer = 0;
          break;
        case rune_invisible:
          runeInvisibleActivated = 1;
          score_now = score;
          randomizer = 0;
          break;
        case rune_haste:
          runeHasteActivated = 1;
          rune_speed = 2;
          rune_grav = 1.2;
          score_now = score;
          randomizer = 0;
          break;
      }
    }

    if((runeHasteActivated || runeInvisibleActivated) && pipe[i].x == -50 && score == score_now + 2){
      runeHasteActivated = 0;
      runeInvisibleActivated = 0;
      rune_speed = 1;
      rune_grav = 0;
      test = 0;
    }
  }
  ctx.drawImage(fg, 0, cvs.height - fg.height);
  yPos += grav + (rune_grav > 0 ? rune_grav : 0);
  ctx.fillStyle = "#000";
  ctx.font = "24px Verdana";
  ctx.fillText("Score: " + score, 10, cvs.height - 20);
  requestAnimationFrame(draw);
}
window.onload = starGame;

//загружаем картинки при запуске страницы и пишем текст
function starGame() {
  ctx.drawImage(bg, 0, 0);
  ctx.drawImage(fg, 0, cvs.height - fg.height);
  ctx.drawImage(bird, xPos, yPos);
  ctx.fillStyle = "#000";
  ctx.font = "24px Verdana";
  ctx.fillText("Press x to win", cvs.width / 5, cvs.height / 2);
}

function pseudorandom() {
  //let runes = [0, 1, 2]; //0 - прибавление счёта, 1 - невидимка, 2 - ускорение
  let runeNumber;
  let random = Math.ceil(Math.random() * 11);
  let rune_random;
  if(random == (3 || 6))
  {
    runeNumber = 0;
    rune_random = rune_score;
  }
  else if (random % 4 == 0) {
    runeNumber = 1;
    rune_random = rune_invisible;
  }
  else if (random == 5) {
    runeNumber = 2;
    rune_random = rune_haste;
  }
  else {
    rune_random = 0;
  }
  return rune_random;
}
