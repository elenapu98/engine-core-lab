import { initWebGL } from './webgl.js';

/**
 * Initializes the rendering abstraction layer.
 * Coordinates the underlying graphics engine (e.g., WebGL, WebGPU).
 *
 * @param {string} canvasId - The target canvas element ID.
 * @returns {Object} Renderer interface handle.
 */
export function initRenderer(canvasId) {
    const engine = initWebGL(canvasId);

    return {
        /**
         * Updates and renders the given shader source code.
         * @param {string} shaderSource - GLSL fragment shader source.
         */
        render(shaderSource) {
            if (engine && engine.updateShader) {
                engine.updateShader(shaderSource);
            }
        },

        /**
         * Handles window resize events for the active engine.
         */
        resize() {
            if (engine && engine.resize) {
                engine.resize();
            }
        }
    };
}