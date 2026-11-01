import { basicSetup, EditorView } from "https://esm.sh/codemirror"
import { EditorState } from "https://esm.sh/@codemirror/state";
import { cpp } from "https://esm.sh/@codemirror/lang-cpp";
import { linter, lintGutter, lintKeymap, setDiagnostics } from "https://esm.sh/@codemirror/lint";
import { keymap } from "https://esm.sh/@codemirror/view";

const DEFAULT_COMMENT = "// Write your GLSL shader here\n";
let editorView;

/**
 * Initializes the CodeMirror 6 editor.
 *
 * @param {string} containerId
 * @param {string} shaderCode
 * @returns {EditorView}
 */
export function initEditor(containerId, shaderCode = '') {
    const containerElement = document.getElementById(containerId);

    const state = EditorState.create({
        doc: `${DEFAULT_COMMENT}${shaderCode}`,
        extensions: [
            basicSetup,
            cpp(),
            EditorView.theme({
                "&": {
                    backgroundColor: "#000000",
                    color: "#f8f8f2",
                    height: "100%",
                    fontSize: "14px"
                },
                ".cm-content": {
                    caretColor: "#f8f8f2",
                    fontFamily: "monospace"
                },
                ".cm-cursor": {
                    borderLeftColor: "#f8f8f2"
                },
                ".cm-gutters": {
                    backgroundColor: "#080808",
                    color: "#555555",
                    border: "none"
                },
                ".cm-activeLine": {
                    backgroundColor: "#121212"
                },
                ".cm-activeLineGutter": {
                    backgroundColor: "#121212",
                    color: "#ffffff"
                },
                ".cm-scroller": {
                    overflow: "auto",
                    fontFamily: "monospace"
                }
            }, { dark: true }),
            linter(),
            lintGutter(),
            keymap.of(lintKeymap)
        ]
    });

    editorView = new EditorView({
        state: state,
        parent: containerElement
    });

    return editorView;
}

/**
 * Sets the code string into the editor.
 *
 * @param {string} shaderCode
 */
export function loadCode(shaderCode) {
    if (!editorView) return;

    const transaction = editorView.state.update({
        changes: { from: 0, to: editorView.state.doc.length, insert: shaderCode }
    });

    editorView.dispatch(transaction)
}

/**
 * Load the default code string.
 *
 * @param {string} shaderCode
 */
export function loadDefaultCode(shaderCode) {
    loadCode(`${DEFAULT_COMMENT}${shaderCode}`);
}

/**
 * Set linter diagnostics.
 * @param {EditorView} view
 * @param {number} lineNumber - (0-based)
 * @param {string} severity
 * @param {string} msg
 */
export function updateLinterDiagnostics(view, lineNumber = null, severity = null, msg= null) {
    if (!view) return;

    if (lineNumber === null || lineNumber === undefined) {
        view.dispatch(setDiagnostics(view.state, []));
        return;
    }

    // CodeMirror 6 (1-based index)
    const line = view.state.doc.line(Math.max(1, lineNumber + 1));

    const diagnostics = [{
        from: line.from,
        to: line.to,
        severity: severity ?? "error",
        message: msg ?? "Syntax error in GLSL source"
    }];

    view.dispatch(setDiagnostics(view.state, diagnostics));
}