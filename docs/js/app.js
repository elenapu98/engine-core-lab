import { initEditor, loadDefaultCode, loadCode } from './editor.js';
import { initRenderer, reloadRenderer } from './renderer.js';
import { headerTypes, buildShader, loadShaderFile } from './builder.js';

// Initialize the code editor inside the #editor container
const shaderCode = await loadShaderFile('../shaders/debug/plain_color.frag');
const editorView = initEditor('editor', shaderCode);

// Initialize the rendering abstraction layer tied to the WebGL canvas
const buildedCode = await buildShader(shaderCode, {headerType: headerTypes.WEBGL})
const renderer = initRenderer('gl-canvas', buildedCode);

function resetShader() {
    loadDefaultCode(shaderCode);
    reloadRenderer(buildedCode);
}

$('#btn_reset').on('click', (e) => {
    resetShader();
});