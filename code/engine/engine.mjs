/** @template EntityDataType @typedef { import("./types").GameData<EntityDataType> } GameData<EntityDataType> */

/** @template EntityDataType @typedef { import("./types").ControllerSystemMethod<EntityDataType> } ControllerSystemMethod<EntityDataType> */
/** @template EntityDataType @typedef { import("./types").SystemMethod<EntityDataType> } SystemMethod<EntityDataType> */
/** @typedef { import("./audio.mjs").AudioEngine } AudioEngine */

/**
 * Create a new game engine for the given context
 * @template EntityDataType
 * @param {GameData<EntityDataType>} base_game_data the base game data to load
 * @param {{ controller: ControllerSystemMethod<EntityDataType>[], render: SystemMethod<EntityDataType>[] }} systems The system methods
 * @param {{ rendering_context: CanvasRenderingContext2D, audio: AudioEngine }} engines The sub-engines to use
 */
export function Game(base_game_data, systems, engines) {
  const virtual_canvas = document.createElement('canvas');
  virtual_canvas.width = engines.rendering_context.canvas.width;
  virtual_canvas.height = engines.rendering_context.canvas.height;
  const context = virtual_canvas.getContext('2d');
  if (!context) throw new Error('Could not create context');
  this.should_quit = false;
  this.fps = 0;
  this.context = context;
  this.virtual_canvas = virtual_canvas;
  this.render_context = engines.rendering_context;
  /** @type {AudioEngine} */ this.audio = engines.audio;
  /** @type { Array<{ sound: "error" | "click" }> } */ this.sound_queue = [];
  /** @type {ControllerSystemMethod<EntityDataType>[]} */ this.controller_systems = systems.controller;
  /** @type {SystemMethod<EntityDataType>[]} */ this.renderer_systems = systems.render;
  /** @type {GameData<EntityDataType>} */ this.game_data = base_game_data;
  this.keyboard = {
    config: {
      up: ['z', 'ArrowUp'],
      down: ['s', 'ArrowDown'],
      left: ['q', 'ArrowLeft'],
      right: ['d', 'ArrowRight'],
      action: ['f', 'Spacebar', ' '],
      back: ['Escape'],
    },
    state: {
      up: false,
      down: false,
      left: false,
      right: false,
      action: false,
      back: false,
      shift: false,
    },
  };
  this.mouse = {
    x: -1,
    y: -1,
    primary_button: false,
    primary_button_clicked_frame: false,
    primary_button_held_clicked: false,
    secondary_button: false,
    scroll_up: false,
    scroll_down: false,
  };
  this.renderer = {
    /**
     * @param {ImageBitmap} image
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     */
    render_raw_image: function (image, x, y, width, height) {
      context.drawImage(image, x, y, width, height);
    },
  };
}

/** @param {number} elapsedTicks */
Game.prototype.update = function (elapsedTicks) {
  if (this.mouse.primary_button) {
    if (!this.mouse.primary_button_held_clicked) {
      this.mouse.primary_button_held_clicked = true;
      this.mouse.primary_button_clicked_frame = true;
    } else {
      this.mouse.primary_button_clicked_frame = false;
    }
  } else {
    this.mouse.primary_button_clicked_frame = false;
    this.mouse.primary_button_held_clicked = false;
  }

  for (const system of this.controller_systems) {
    system(this, elapsedTicks);
  }
};

/** @param {number} fps */
Game.prototype.render = function (fps) {
  // Update the FPS counter
  this.fps = fps;

  for (const system of this.renderer_systems) {
    system(this);
  }

  // Swap the contexts for double buffering
  this.render_context.drawImage(this.virtual_canvas, 0, 0);
};

Game.prototype.extra_events = function () {
  for (const event of this.sound_queue) {
    this.audio.play_once(event.sound);
  }

  this.sound_queue = [];
};

Game.prototype.show_exit_screen = function () {
  this.audio.stop_all();
  this.context.fillStyle = 'black';
  this.context.strokeStyle = 'transparent';
  this.context.fillRect(0, 0, 800, 600);
  this.context.fillStyle = 'white';
  this.context.textAlign = 'center';
  this.context.font = '40px sans-serif';
  this.context.fillText('Stopped', 400, 320);
  // Swap the contexts for double buffering
  this.render_context.drawImage(this.virtual_canvas, 0, 0);
};
