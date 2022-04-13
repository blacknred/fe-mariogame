import { Game } from "./game";
import { Decoration, Platform, PlatformObject, Player } from "./lib";
import bgImg from "./sprites/bg.png";
import giftImg from "./sprites/gift.png";
import gift2Img from "./sprites/gift2.png";
import hillsImg from "./sprites/hills.png";
import platformImg from "./sprites/platform.png";
import platform2Img from "./sprites/platform2.png";
import playerRunLeft from "./sprites/player_run_left.png";
import playerRunRight from "./sprites/player_run_right.png";
import playerStandLeft from "./sprites/player_stand_left.png";
import playerStandRight from "./sprites/player_stand_right.png";
import "./style.css";

addEventListener("load", function () {
  // init
  const game = new Game(
    [
      new Decoration({
        imgs: [bgImg],
        x: -1,
        y: -1,
      }),
      new Decoration({
        imgs: [hillsImg],
        x: -1,
        y: -1,
      }),
    ],
    [
      new Platform({
        imgs: [platform2Img],
        x: 580 + 300,
        y: 225,
        gifts: [
          new PlatformObject({
            imgs: [giftImg],
            score: 100,
          }),
        ],
      }),
      new Platform({
        imgs: [platform2Img],
        x: 580 * 2 + 600,
        y: 225,
      }),
      new Platform({
        imgs: [platform2Img],
        x: 580 * 5 + 400,
        y: 225,
      }),
      //
      new Platform({
        imgs: [platformImg],
        x: -1,
        y: 470,
      }),
      new Platform({
        imgs: [platformImg],
        x: 580 + 150,
        y: 450,
        enemies: [
          new PlatformObject({
            width: 60,
            height: 60,
            score: 200,
          }),
        ],
      }),
      new Platform({
        imgs: [platformImg],
        x: 580 * 2 + 400,
        y: 450,
        gifts: [
          new PlatformObject({
            imgs: [giftImg],
            score: 100,
          }),
          new PlatformObject({
            imgs: [gift2Img],
            x: 580 * 2 + 400,
            y: 210,
            score: 50,
          }),
          new PlatformObject({
            imgs: [gift2Img],
            x: 580 * 2 + 500,
            y: 180,
            score: 50,
          }),
        ],
      }),
      new Platform({
        imgs: [platformImg],
        x: 580 * 3 + 600,
        y: 510,
      }),
      new Platform({
        imgs: [platformImg],
        x: 580 * 4 + 850,
        y: 470,
      }),
      new Platform({
        imgs: [platformImg],
        x: 580 * 5 + 1000,
        y: 450,
      }),
    ],
    new Player({
      imgs: [
        {
          img: playerStandRight,
          cropWidth: 177,
          maxWidth: 66,
          maxFrame: 59,
        },
        { img: playerStandLeft, cropWidth: 177, maxWidth: 66, maxFrame: 59 },
        { img: playerRunRight, cropWidth: 341, maxWidth: 129, maxFrame: 29 },
        { img: playerRunLeft, cropWidth: 341, maxWidth: 129, maxFrame: 29 },
      ],
      width: 66,
      height: 150,
      x: 100,
      y: 100,
    })
  );

  // start
  game.start();
});
