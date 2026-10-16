import { initWebGL } from './webgl.js';

let renderer;

/**
 * Initializes the rendering abstraction layer.
 * Coordinates the underlying graphics engine (e.g., WebGL, WebGPU).
 *
 * @param {string} canvasId - The target canvas element ID.
 * @param {string} defaultShaderCode - The default shader code.
 * @returns {Object} Renderer interface handle.
 */
export function initRenderer(canvasId, defaultShaderCode) {
    const engine = initWebGL(canvasId, defaultShaderCode);

    renderer = {
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

    return renderer;
}

/**
 * Reload the rendering abstraction layer.
 *
 * @param {string} shaderCode - The target canvas element ID.
 * @returns {Object} Renderer interface handle.
 */
export function reloadRenderer(shaderCode) {
    renderer.render(shaderCode);
}