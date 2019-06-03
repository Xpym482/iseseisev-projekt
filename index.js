//jshint esversion:6
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
let rules = new Image();
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
let runeIsDrawn = 0;
let score_now_invisible = 0;
let score_now_haste = 0;

rules.src = "img/rules.png";
rune_haste.src = "img/rune_haste.png";
rune_invisible.src = "img/rune_invisible.png";
rune_score.src = "img/rune_score.png";
bird.src = "img/bird.png";
empty_bird.src = "img/bird_empty";
bg.src = "img/bg.png";
fg.src = "img/fg.png";
pipeUp.src = "img/pipeUp.png";
pipeBottom.src = "img/pipeBottom.png";
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
  ctx.drawImage(runeInvisibleActivated ? empty_bird : bird, xPos, yPos); //если невидимка активирована то картинка птицы прозрачная
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
      randomizer = pseudorandom(); //рандомим руну
    }

    if(randomizer && pipeNumber >= 1){
      ctx.drawImage(randomizer, pipe[pipeNumber].x + 10, pipe[pipeNumber].y + pipeUp.height + 40); //рисуем выпавшую руну
      runeIsDrawn = 1;
    }
    else{
      runeIsDrawn = 0;
    }

    ctx.drawImage(pipeUp, pipe[i].x, pipe[i].y);
    ctx.drawImage(pipeBottom, pipe[i].x, pipe[i].y + pipeUp.height + gap);
    pipe[i].x = pipe[i].x - 1;
    runes[i].x--;

    if(!runeInvisibleActivated && xPos + bird.width >= pipe[i].x && xPos <= pipe[i].x + pipeUp.width //коллизии столкновений в разных поизциях, который не срабатывает с невидимкой
      && (yPos <= pipe[i].y + pipeUp.height || yPos + bird.height >= pipe[i].y +
      pipeUp.height + gap) || yPos + bird.height >= cvs.height - fg.height){
        window.location.href = "index.html";
    }

    if(pipe[i].x == 6){
      score++;
      score_audio.play();
    }

    if(runeIsDrawn && xPos + bird.width >= runes[i].x + 10 && runes[i].x == -10) //появилась ли руна и где находится птичка и руна начинается между трубами
    {
      switch (randomizer) {
        case rune_score:
          score = score + 3;
          randomizer = 0;
          break;
        case rune_invisible:
          runeInvisibleActivated = 1;
          score_now_invisible = i;
          randomizer = 0;
          break;
        case rune_haste:
          runeHasteActivated = 1;
          rune_grav = 1.2;
          score_now_haste = i;
          randomizer = 0;
          break;
      }
    }

    if(runeInvisibleActivated && pipe[i].x == -50 && score_now_invisible + 2 < i){
      runeInvisibleActivated = 0;
    }

    if (runeHasteActivated && pipe[i].x == -50 && score_now_haste + 2 < i) { //проверяем, находится ли птичка в нужной позиции и отсчитываем 3 трубы
      runeHasteActivated = 0;
      rune_grav = 0;
      runeIsDrawn = 0;
    }

  }
  ctx.drawImage(fg, 0, cvs.height - fg.height);
  yPos += grav + (rune_grav > 0 ? rune_grav : 0); //меняем гравитацию падению при активированной руне
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
  ctx.drawImage(rules, 50, 100);
  ctx.fillStyle = "#000";
  ctx.font = "24px Verdana";
  ctx.fillText("Score: " + score, 0, 0);
}

function pseudorandom() { //рандомим числа, когда появляется 3 или 6, то прибавляется счёт; когда 8 или 4, то руна невидимки; когда рандоимим 5, то руна гравитации;
  //в остальных случаях ничего не происходит
  let random = Math.ceil(Math.random() * 11);
  let rune_random;
  if(random == (3 || 6))
  {
    rune_random = rune_score;
  }
  else if (random % 4 == 0) {
    rune_random = rune_invisible;
  }
  else if (random == 5) {
    rune_random = rune_haste;
  }
  else {
    rune_random = 0;
  }
  return rune_random;
}
