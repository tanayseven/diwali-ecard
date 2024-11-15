import {k} from "./game";

k.loadSprite("diya-1", "sprites/diya-1.png", {
  sliceX: 4,
  anims: {
    idle: {
      from: 0,
      to: 3,
      speed: 5,
      loop: true,
    },
  },
});

const diyaScale = 5;

const diyaDimensions = [(k.width() / 70) * 7, 200]

let diyaLocations = []

for (let x = 0; x < k.width(); x += diyaDimensions[0]) {
  const y = 10
  diyaLocations.push([x, y])
}

for (let x = 0; x < k.width(); x += diyaDimensions[0]) {
  const y = k.height() - diyaDimensions[1]
  diyaLocations.push([x, y])
}

diyaLocations.map(
  ([x, y]) => k.add([
    k.pos(x, y),
    k.sprite("diya-1", {anim: "idle"}),
    k.scale(diyaScale),
  ])
)
