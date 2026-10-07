import { initEditor } from './editor.js';
import { initRenderer } from './renderer.js';

// Initialize the code editor inside the #editor container
const editorView = initEditor('editor');

// Initialize the rendering abstraction layer tied to the WebGL canvas
const renderer = initRenderer('gl-canvas');