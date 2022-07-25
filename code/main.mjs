import { AudioEngine } from './engine/audio.mjs';
import { initializeInputs } from './engine/input.mjs';
import { Game } from './engine/engine.mjs';

/** @type {HTMLCanvasElement} */
// @ts-ignore (for some reason, this next line isn't cast in the proper type automatically)
const canvas = document.getElementById('game');
const context = (() => {
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Could not create 2D context');
  return context;
})();

const launch_warning_message = document.getElementById('launch_warning');
if (launch_warning_message) {
  launch_warning_message.remove();
}

const MS_BETWEEN_TICKS = 1000 / 20;
const MAX_MS_BETWEEN_FRAMES = 1000 / 60;

/** @type {Promise<Game<never>>} */
const game_promise = new Promise((resolve) => {
  resolve(
    new Game(
      {
        entities: [],
      },
      {
        controller: [],
        render: [],
      },
      {
        rendering_context: context,
        audio: new AudioEngine({ snippets: {} }),
      }
    )
  );
});

game_promise.then((game) => {
  initializeInputs(game, canvas);

  (function gameLoop() {
    let lastLoop = Date.now();
    let lastTick = Date.now();
    let should_quit = false;
    function singleLoop() {
      const currentLoop = Date.now();
      if (currentLoop > lastTick + MS_BETWEEN_TICKS) {
        const elapsedMsBetweenNowAndThen = currentLoop - lastTick;
        const remainingMs = elapsedMsBetweenNowAndThen % MS_BETWEEN_TICKS;
        const elapsedTicks = (elapsedMsBetweenNowAndThen - remainingMs) / MS_BETWEEN_TICKS;
        game.update(elapsedTicks);
        lastTick = currentLoop - remainingMs;
      }
      if (currentLoop > lastLoop + MAX_MS_BETWEEN_FRAMES) {
        const fps = 1000 / (currentLoop - lastLoop);
        game.render(fps);
        lastLoop = currentLoop;
      }
      if (game.keyboard.state.back) {
        should_quit = true;
      }
    }
    function insideLoop() {
      singleLoop();
      if (!should_quit) {
        window.requestAnimationFrame(insideLoop);
      } else {
        game.show_exit_screen();
      }
    }
    window.requestAnimationFrame(insideLoop);
  })();
});
