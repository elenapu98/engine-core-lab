# engine-core-lab
Modular C++ game engine, GLSL shader research, and WebGL visualization tools

## 📐 Layout & Shaders Architecture

To ensure cross-platform code reuse (WebGL2 / C++ Native) through a **Single Source of Truth**, all `.glsl` / `.frag` / `.vert` assets are decoupled from host runtime code and structured by domain and operational stage:

```text
shaders/
├── core/         # Fullscreen quad vertex shaders, GLSL includes, and common headers.
├── debug/        # Diagnostic shaders (pipeline checks, UV coordinate/aspect ratio tests).
├── procedural/   # Generative math, SDF primitives, lighting, and raymarching kernels.
└── postprocess/  # Screen-space passes, bloom, and color grading filters.
