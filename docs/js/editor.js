import {basicSetup, EditorView} from "https://esm.sh/codemirror"
import { EditorState } from "https://esm.sh/@codemirror/state";
import { cpp } from "https://esm.sh/@codemirror/lang-cpp";

/**
 * Initializes the CodeMirror 6 editor.
 * @param {string} containerId
 * @returns {EditorView}
 */
export function initEditor(containerId) {
    const containerElement = document.getElementById(containerId);

    const startState = EditorState.create({
        doc: "// Write your GLSL shader here\nvoid main() {\n\n}",
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
            }, { dark: true })
        ]
    });

    return new EditorView({
        state: startState,
        parent: containerElement
    });
}