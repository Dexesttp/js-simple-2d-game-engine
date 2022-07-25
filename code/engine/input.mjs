/**
 * Initialize the inputs for the game
 * @template EntityDataType
 * @param {import("./engine.mjs").Game<EntityDataType>} game
 * @param {HTMLCanvasElement} canvas
 */
export function initializeInputs(game, canvas) {
  window.addEventListener('keydown', function (event) {
    game.keyboard.state.shift = event.shiftKey;
    for (const keyName in game.keyboard.config) {
      // Typescript doesn't seem to understand (maybe with reason?) that "keyName" is not a generic string.
      //@ts-ignore
      if (game.keyboard.config[keyName] && game.keyboard.config[keyName].indexOf(event.key) >= 0) {
        //@ts-ignore
        game.keyboard.state[keyName] = true;
      }
    }
  });

  window.addEventListener('keyup', function (event) {
    game.keyboard.state.shift = event.shiftKey;
    for (const keyName in game.keyboard.config) {
      //@ts-ignore
      if (game.keyboard.config[keyName] && game.keyboard.config[keyName].indexOf(event.key) >= 0) {
        //@ts-ignore
        game.keyboard.state[keyName] = false;
      }
    }
  });

  canvas.addEventListener('mousedown', function (event) {
    game.mouse.x = event.offsetX;
    game.mouse.y = event.offsetY;
    if (event.button === 0) game.mouse.primary_button = true;
    if (event.button === 2) game.mouse.secondary_button = true;
  });

  canvas.addEventListener('mousemove', function (event) {
    game.mouse.x = event.offsetX;
    game.mouse.y = event.offsetY;
  });

  canvas.addEventListener('mouseup', function (event) {
    game.mouse.x = event.offsetX;
    game.mouse.y = event.offsetY;
    if (event.button === 0) game.mouse.primary_button = false;
    if (event.button === 2) game.mouse.secondary_button = false;
  });
}
