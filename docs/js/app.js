import { initEditor, loadDefaultCode, loadCode, updateLinterDiagnostics } from './editor.js';
import { initRenderer, reloadRenderer, loadLogs } from './renderer.js';
import { headerTypes, buildShader, loadShaderFile } from './builder.js';

let currentShaderCode;
const shaderCanvasName = 'gl-canvas';

// Initialize the code editor inside the #editor container
const defaultShaderCode = await loadSafe(async () => loadDefaultShader());
currentShaderCode = defaultShaderCode;
const editorView = await loadSafe(async () => initEditor('editor', currentShaderCode));

// Initialize the rendering abstraction layer tied to the WebGL canvas
async function getBuiltDefaultCode() {
    return await loadSafe(() =>
        buildShader(defaultShaderCode ?? currentShader, {headerType: headerTypes.WEBGL})
    );
}

let renderer = await loadSafe(async () => initRenderer(shaderCanvasName, await getBuiltDefaultCode()));

async function loadSafe(asyncFn, fallback = '') {
    const { error, value } = await trySafe(asyncFn);
    if (error) {
        catchErrors(error);
        return fallback;
    }
    return value;
}

async function trySafe(asyncFn, fallbackValue = null) {
    try {
        const result = await asyncFn();
        return { error: null, value: result };
    } catch (error) {
        return { error, value: fallbackValue };
    }
}

function catchErrors(error) {
    var response = loadLogs();
    if(!response) {
        response = error.toString();
    }
    setTextToOverlay(response);
    showOverlay();
}

function setTextToOverlay(txt = '') {
    if(txt) {
        $('#log-content').text($('#log-content').text() + '\n' + txt);
    } else {
        $('#log-content').text(txt);
    }
}

async function loadDefaultShader() {
    return await loadShaderFile('../shaders/debug/plain_color.frag');
}

async function buildAndRunShader(shader = null) {
    setTextToOverlay();

    var built;
    if(shader) {
        built = await buildShader(shader, { headerType: headerTypes.WEBGL });
        loadCode(shader);
    } else {
        loadDefaultCode(defaultShaderCode);
    }

    if(!renderer){
        renderer = await initRenderer(shaderCanvasName, built);
    }
    await reloadRenderer(built ?? await getBuiltDefaultCode());
}

function resetShader() {
    buildAndRunShader();
}

function showOverlay() {
    $('#overlay').removeClass('hidden');
    $('body').css('overflow', 'hidden');
}

function hideOverlay(e) {
    const elem = $(e.target);
    if (elem.is('#overlay')) {
        elem.addClass('hidden');
        $('body').css('overflow', '');
    }
}

// Shader/Canvas events (don't use loadSafe())

$('#btn_reset').on('click', (e) => {
    resetShader();
});

$('#btn_run').on('click', async (e) => {
    currentShaderCode = editorView.state.doc.toString();

    try {
        await buildAndRunShader(currentShaderCode);

        // Clean Linter if all its ok
        updateLinterDiagnostics(editorView);
    }
    catch (error) {
        console.error(loadLogs() ?? error.toString());
        $('#log-content').text(loadLogs());

        const regex = /['\"](?<token>.*)['\"]/g;

        const [firstMatch] = error.toString().matchAll(regex);
        const targetToken = firstMatch?.groups?.token;

        const currentShaderCodeArray = currentShaderCode.split('\n');
        const matchIndex = currentShaderCodeArray.findIndex(item => item.includes(targetToken));

        const targetLine = matchIndex !== -1 ? matchIndex : 0;

        updateLinterDiagnostics(editorView, targetLine, 'error', `Syntax error: unexpected '${targetToken || 'unknown'}'`);
    }
});

// Editor events
$(document).on('click', '.cm-lint-marker-error', (e) => {
    showOverlay();
});

$(document).on('click', '#overlay', function(e) {
    hideOverlay(e);
});
