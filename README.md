<h1 align="center">
	<br>
	<a href="https://gravitron.notaroomba.dev"><img src="public/logo.png" alt="Gravitron" width="200"></a>
	<br>
	Gravitron
	<br>
</h1>

<h4 align="center">
	Interactive N-body gravity simulation with a Rust physics engine compiled to WebAssembly
</h4>

<div align="center">

![Rust](https://img.shields.io/badge/rust-%23000000.svg?style=for-the-badge&logo=rust&logoColor=white)
![WASM](https://img.shields.io/badge/WebAssembly-%2300969C.svg?style=for-the-badge&logo=webassembly&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![PixiJS](https://img.shields.io/badge/Pixi.js-%23FF66CC.svg?style=for-the-badge)

</div>

An interactive N-body gravity simulation that combines a high-performance physics engine (written in Rust and compiled to WASM) with a responsive web UI (React + TypeScript), and PixiJS for high-performance 2D canvas rendering.

<p align="center">
  <a href="https://gravitron.notaroomba.dev">Live demo · gravitron.notaroomba.dev</a>
</p>

## Key features

- High-performance physics core implemented in Rust and compiled to WebAssembly for accurate, real-time N-body gravitational simulation
- Smooth, interactive 2D visualization built with React, PixiJS, and TypeScript
- Barnes-Hut quadtree optimization for efficient simulation of 500+ bodies
- Multiple numerical integration methods (Euler, RK4, Verlet, Leapfrog)
- Adjustable parameters (gravity, mass, speed, quadtree theta) and simulation controls
- Real-time editing: pause to drag planets, modify properties, and adjust velocities
- Interactive viewport with pan and zoom controls
- Visual features: velocity vectors, trails, FPS counter, and quadtree visualization
- Add/remove planets dynamically with hold-to-add/remove functionality

## Preview

Open https://gravity.notaroomba.dev in a browser.

## Building

### Prerequisites
- [Rust](https://www.rust-lang.org/) and [wasm-pack](https://rustwasm.github.io/wasm-pack/)
- [Bun](https://bun.sh/) or [Node.js](https://nodejs.org/)

### Build the physics engine
```bash
npm run build:rust
# or
bun run build:rust
```

### Run the development server
```bash
npm run dev
# or
bun run dev
```

### Build for production
```bash
npm run build
# or
bun run build
```

## TODO

- Additional integration methods for improved energy conservation
- Presets for interesting orbital configurations (binary stars, solar systems, etc.)
- Export/import simulation states
- Performance optimizations for 1000+ body simulations

## Credits

- Rust and wasm-bindgen for the physics engine
- React for the UI, TailwindCSS for the styling, and PixiJS for rendering
- Barnes-Hut algorithm for quadtree optimization
- Inspiration from classic N-body simulations and orbital mechanics visualizations

## License

MIT

---

> [notaroomba.dev](https://notaroomba.dev) &nbsp;&middot;&nbsp;
> GitHub [@NotARoomba](https://github.com/NotARoomba) &nbsp;&middot;&nbsp;
