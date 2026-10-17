# engine-core-lab

Modular C++ game engine, GLSL shader research, and WebGL visualization tools

## 📐 Layout & Shaders Architecture

To ensure cross-platform code reuse (WebGL2 / C++ Native) through a **Single Source of Truth**, all `.glsl` / `.frag` /
`.vert` assets are decoupled from host runtime code and structured by domain and operational stage:

```text
shaders/
├── core/         # Fullscreen quad vertex shaders, GLSL includes, and common headers.
├── debug/        # Diagnostic shaders (pipeline checks, UV coordinate/aspect ratio tests).
├── procedural/   # Generative math, SDF primitives, lighting, and raymarching kernels.
└── postprocess/  # Screen-space passes, bloom, and color grading filters.
```

## 🛠️ Web Engine Architecture

The web application is built with native ES modules and zero heavy frameworks, ensuring a clean, modular runtime layer that decouples editor state from the underlying graphics API.

### Core Modules Breakdown

* **`editor.js`**: Manages the CodeMirror 6 instance, handling user input, syntax highlighting, and editor themes. It operates exclusively on raw GLSL code without headers.
* **`builder.js`**: Handles shader assembly and header injection (e.g., injecting core headers like `#version 300 es`) before passing source code to the rendering pipeline.
* **`renderer.js`**: Provides a technology-agnostic abstraction layer for the rendering interface, isolating application logic from target graphics APIs.
* **`webgl.js`**: Implements the WebGL 2 pipeline, managing context setup, vertex buffers, program compilation, and render loop execution. Designed as a interchangeable backend module (e.g., future WebGPU implementations).
* **`app.js`**: Acts as the main application orchestrator, managing component initialization and inter-module event communication.

## 🕹️ Viewer User Guide

* **Editing Shaders**: The left panel contains the CodeMirror editor where you can view and modify raw GLSL code.
* **Resetting State**: Click the **Reset** button to reload the default initial shader into the editor and immediately re-render the canvas with this default code.
* **Canvas Output**: The right panel displays the rendered GLSL output in real-time within the canvas boundaries defined by the layout. (The default initial shader outputs a solid green screen to confirm that the pipeline compiled successfully).