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
            engine?.updateShader?.(shaderSource);
        },

        /**
         * Handles window resize events for the active engine.
         */
        resize() {
            engine?.resize?.();
        },

        /**
         * Retrieves the shader compilation logs from the active graphics engine.
         * @returns {string|undefined} The error log string.
         */
        getLastError() {
            return engine?.getLastError?.();
        },
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
    renderer?.render?.(shaderCode);
}

/**
 * Retrieves the latest shader compilation error logs.
 * @returns {string|undefined} The raw error log string.
 */
export function loadLogs() {
    return renderer?.getLastError?.();
}