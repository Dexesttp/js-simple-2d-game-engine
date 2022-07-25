# Simple 2D starter engine

## Running the game

- Install node
- Run `node server.js`
- Open `http://localhost:5000/`

Alternatively:

- Set up your browser so it ignores CORS
- Open the "index.html" file in your browser

## Development

### Basic commands: Linting and Typechecking

First, you need to run `npm install --global prettier` and `npm install --global typescript`

The two main commands are, for linting:

```sh
prettier -w code
```

And for typechecking:

```sh
tsc -p jsconfig.json
```

### Basic layout of the engine

The engine is made of four components:
- The input/output engine (handles mouse and keyboard input, accessible on the game object via `game.mouse` and `game.keyboard`)
- The audio engine (handles volume management, accessible on the game object via `game.audio`)
- The canvas-based renderer (handles drawing things on screen, accessible via `game.context`)
- The ECS game loop (handles entities, systems are defined on startup via `new Game({ entities: [] }, { controller: [], renderer:[] }, {...})`)

## License

This software is provided under the MIT license - see [the LICENSE file](./LICENSE) for details.
