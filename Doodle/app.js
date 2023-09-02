document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const doodler = document.createElement("div");
  const startBtn = document.querySelector(".btn--start");
  const GRID_HEIGHT = 700;
  const GRID_WIDTH = 400;
  const DOODLER_WIDTH = 87;
  const PLATFORM_COUNT = 5;
  let startPoint = 150;
  let doodlerBottomSpace = startPoint;
  let doodlerLeftSpace;
  let isGameOver = false;
  let platforms = [];
  let upTimerId;
  let downTimerId;
  let isJumping = true;
  let isGoingLeft = false;
  let isGoingRight = false;
  let leftTimerId;
  let rightTimerId;
  let score = 0;
  let highScore = 0;
  let message;

  class Platform {
    constructor(newPlatformBottom) {
      this.bottom = newPlatformBottom;
      this.left = Math.random() * (GRID_WIDTH - DOODLER_WIDTH);
      this.visual = document.createElement("div");

      const visual = this.visual;
      visual.classList.add("platform");
      visual.style.left = this.left + "px";
      visual.style.bottom = this.bottom + "px";
      grid.appendChild(visual);
    }
  }

  const createPlatforms = () => {
    for (let i = 0; i < PLATFORM_COUNT; i++) {
      const platformGap = GRID_HEIGHT / PLATFORM_COUNT;
      const newPlatformBottom = 100 + i * platformGap;
      const newPlatform = new Platform(newPlatformBottom);
      platforms.push(newPlatform);
    }
  };

  const createDoodler = () => {
    grid.appendChild(doodler);
    doodler.classList.add("doodler");
    doodlerLeftSpace = platforms[0].left;
    doodler.style.left = doodlerLeftSpace + "px";
    doodler.style.bottom = doodlerBottomSpace + "px";
  };

  const movePlatforms = () => {
    if (doodlerBottomSpace > 200) {
      platforms.forEach((platform) => {
        platform.bottom -= 3;
        const visual = platform.visual;
        visual.style.bottom = platform.bottom + "px";

        if (platform.bottom <= 0) {
          let firstPlatform = platforms[0].visual;
          firstPlatform.classList.remove("platform");
          platforms.shift();
          score++;
          let newPlatform = new Platform(GRID_HEIGHT);
          platforms.push(newPlatform);
        }
      });
    }
  };

  const jump = () => {
    clearInterval(downTimerId);
    isJumping = true;
    upTimerId = setInterval(() => {
      doodlerBottomSpace += 15;
      doodler.style.bottom = doodlerBottomSpace + "px";
      if (doodlerBottomSpace >= 600) {
        fall();
      }
      if (doodlerBottomSpace > startPoint + 200) {
        fall();
      }
    }, 30);
  };

  const fall = () => {
    clearInterval(upTimerId);
    isJumping = false;
    downTimerId = setInterval(() => {
      doodlerBottomSpace -= 7;
      doodler.style.bottom = doodlerBottomSpace + "px";
      if (doodlerBottomSpace <= 0) {
        gameOver();
      }
      platforms.forEach((platform) => {
        if (
          doodlerBottomSpace >= platform.bottom &&
          doodlerBottomSpace <= platform.bottom + 15 &&
          doodlerLeftSpace + 60 >= platform.left &&
          doodlerLeftSpace <= platform.left + 85 &&
          !isJumping
        ) {
          startPoint = doodlerBottomSpace;
          jump();
        }
      });
    }, 30);
  };

  function moveStraight() {
    isGoingLeft = false;
    isGoingRight = false;
    clearInterval(rightTimerId);
    clearInterval(leftTimerId);
  }

  function moveLeft() {
    if (isGoingLeft) return;
    if (isGoingRight) {
      clearInterval(rightTimerId);
      isGoingRight = false;
    }
    isGoingLeft = true;
    leftTimerId = setInterval(() => {
      if (doodlerLeftSpace >= 0) {
        doodlerLeftSpace -= 5;
        doodler.style.left = doodlerLeftSpace + "px";
      }
    }, 20);
  }

  function moveRight() {
    if (isGoingRight) return;
    if (isGoingLeft) {
      clearInterval(leftTimerId);
      isGoingLeft = false;
    }
    isGoingRight = true;
    rightTimerId = setInterval(() => {
      if (doodlerLeftSpace <= GRID_WIDTH - DOODLER_WIDTH) {
        doodlerLeftSpace += 5;
        doodler.style.left = doodlerLeftSpace + "px";
      }
    }, 20);
  }

  const gameOver = () => {
    if (score > highScore) {
      highScore = score;
    }
    isGameOver = true;
    while (grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }
    message = `Score: ${score} <br>
    High score: ${highScore}`;
    grid.innerHTML = message;
    startBtn.innerHTML = "New Game";
  };

  const control = (e) => {
    if (e.key === "ArrowLeft") {
      moveLeft();
    } else if (e.key === "ArrowRight") {
      moveRight();
    } else if (e.key === "ArrowUp") {
      moveStraight();
    }
  };

  const reset = () => {
    clearInterval(upTimerId);
    clearInterval(downTimerId);
    clearInterval(rightTimerId);
    clearInterval(leftTimerId);
    grid.innerHTML = "";
    score = 0;
    startPoint = 150;
    doodlerBottomSpace = startPoint;
    isGameOver = false;
    platforms = [];
    isJumping = true;
    isGoingLeft = false;
    isGoingRight = false;
    start();
  };

  const start = () => {
    if (!isGameOver) {
      createPlatforms();
      createDoodler();
      setInterval(movePlatforms, 40);
      jump();
      document.addEventListener("keyup", control);
    }
  };

  startBtn.addEventListener("click", reset);
});
