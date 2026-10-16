/**
 * Initializes the WebGL 2 rendering context and pipeline.
 *
 * @param {string} canvasId - The target canvas element ID.
 * @param {string} defaultShaderCode - The default shader code.
 * @returns {Object|null} WebGL engine controller interface.
 */
export function initWebGL(canvasId, defaultShaderCode) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error(`Canvas element with id "${canvasId}" not found.`);
        return null;
    }

    const gl = canvas.getContext('webgl2');

    if (!gl) {
        console.error('WebGL2 not supported');
        return null;
    }

    // Vertex Shader (Fullscreen Quad)
    const vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, `#version 300 es
in vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}`);
    gl.compileShader(vs);

    // Quad Geometry Buffer & VAO
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    let currentProgram = null;

    function updateShader(shaderSource) {
        // Fragment Shader (Test Shader)
        const fs = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fs, shaderSource);
        gl.compileShader(fs);

        if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
            console.error('FS compile error:', gl.getShaderInfoLog(fs));
            gl.deleteShader(fs);
            return false;
        }

        // Link Program
        const program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Program link error:', gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            gl.deleteShader(fs);
            return false;
        }

        // If there was a previous program, clean it up
        if (currentProgram) {
            gl.deleteProgram(currentProgram);
        }
        currentProgram = program;

        // Configure attributes for the new program
        gl.useProgram(currentProgram);
        const posLoc = gl.getAttribLocation(currentProgram, 'a_position');
        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

        return true;
    }

    // Continuous rendering loop
    function render() {
        if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
            gl.viewport(0, 0, canvas.width, canvas.height);
        }

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        if (currentProgram) {
            gl.useProgram(currentProgram);
            gl.bindVertexArray(vao);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
    updateShader(defaultShaderCode);

    return {
        canvas,
        gl,
        updateShader
    };
}