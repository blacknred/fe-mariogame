import { Keys } from "./lib/typings";
import { Player, Platform, Input, Decoration } from "./lib";
import platformImg from "./sprites/platform.png";
import platform2Img from "./sprites/platform2.png";
import hillsImg from "./sprites/hills.png";
import bgImg from "./sprites/bg.png";
import playerStandRight from "./sprites/playerStandRight.png";
import playerStandLeft from "./sprites/playerStandLeft.png";
import playerRunRight from "./sprites/playerRunRight.png";
import playerRunLeft from "./sprites/playerRunLeft.png";
import "./style.css";

window.addEventListener("load", function () {
  // create canvas
  const canvas = document.body.appendChild(document.createElement("canvas"));
  const ctx = canvas.getContext("2d")!;
  canvas.width = 1024;
  canvas.height = 576;

  // scoring
  let scrollOffset: number;
  // input handler
  let input: Input;
  // player
  let player: Player;
  // decorations
  let decorations: Decoration[];
  // platforms
  let platforms: Platform[];

  /** Init */

  function init(this: any) {
    scrollOffset = 0;
    input = new Input(Object.values(Keys));
    player = new Player(canvas, {
      img: playerStandRight,
      x: 100,
      y: 100,
    });
    function run(e: KeyboardEvent) {
      switch (e.key) {
        case Keys.up:
        case Keys.space:
          player.velocity.y -= 20;
          break;
        case Keys.right:
          player.setImg(playerRunRight);
          player.cropWidth = 341;
          player.width = 129;
          break;
        case Keys.left:
          player.setImg(playerRunLeft);
          player.cropWidth = 341;
          player.width = 129;
          break;
        default:
      }
    }
    function stand(e: KeyboardEvent) {
      switch (e.key) {
        case Keys.right:
          player.setImg(playerStandRight);
          player.cropWidth = 177;
          player.width = 66;
          break;
        case Keys.left:
          player.setImg(playerStandLeft);
          player.cropWidth = 177;
          player.width = 66;
          break;
        default:
      }
    }
    removeEventListener("keydown", run.bind(this));
    removeEventListener("keyup", stand.bind(this));
    addEventListener("keydown", run.bind(this));
    addEventListener("keyup", stand.bind(this));
    decorations = [
      new Decoration(canvas, {
        img: bgImg,
        x: -1,
        y: -1,
      }),
      new Decoration(canvas, {
        img: hillsImg,
        x: -1,
        y: -1,
      }),
    ];
    platforms = [
      new Platform(canvas, {
        img: platform2Img,
        x: 580 + 300,
        y: 270,
      }),
      new Platform(canvas, {
        img: platformImg,
        x: -1,
        y: 470,
      }),
      new Platform(canvas, {
        img: platformImg,
        x: 580 + 100,
        y: 470,
      }),
      new Platform(canvas, {
        img: platformImg,
        x: 580 * 2 + 200,
        y: 470,
      }),
    ];
  }

  /** Engine */

  function animate() {
    // recursive running
    requestAnimationFrame(animate);

    // clear all at first
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // render decorations
    decorations.forEach((decoration) => {
      decoration.update();
    });

    // render platforms
    platforms.forEach((platform) => {
      platform.update();
    });

    // render player
    player.update();

    // player moves horizontally only within 300px
    if (input.has(Keys.right) && player.position.x < 400) {
      player.velocity.x = player.speed;
    } else if (
      input.has(Keys.left) &&
      (player.position.x > 100 || (scrollOffset === 0 && player.position.x > 0))
    ) {
      player.velocity.x = -player.speed;
    } else {
      player.velocity.x = 0;

      // while player stands
      if (input.has(Keys.right)) {
        // enlarge scoring
        scrollOffset += player.speed;

        // scroll platforms
        platforms.forEach((platform) => {
          platform.position.x -= player.speed;
        });

        // scroll decorations with parallax due the smaller step
        decorations.forEach((decoration) => {
          decoration.position.x -= player.speed * 0.5;
        });
      } else if (input.has(Keys.left) && scrollOffset > 0) {
        // reduce scoring
        scrollOffset -= player.speed;

        // scroll platforms
        platforms.forEach((platform) => {
          platform.position.x += player.speed;
        });

        // scroll decorations with parallax due the smaller step
        decorations.forEach((decoration) => {
          decoration.position.x += player.speed * 0.5;
        });
      }
    }

    // collision detection
    platforms.forEach((platform) => {
      if (
        player.totalY <= platform.position.y &&
        player.totalY + player.velocity.y >= platform.position.y &&
        player.totalX >= platform.position.x &&
        player.position.x <= platform.totalX
      ) {
        player.velocity.y = 0;
      }
    });

    // detect win
    if (scrollOffset > 2000) {
      console.log("you are win");
    }

    // detect lose
    if (player.position.y > canvas.height) {
      init();
    }
  }

  // run
  init();
  animate();
});
