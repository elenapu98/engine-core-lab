/**
 * Supported shader header technologies for core injection.
 * @readonly
 * @enum {string}
 */
export const headerTypes = Object.freeze({
    WEBGL: 'webgl',
    OPENGL: 'opengl'
});

/**
 * Assembles shader source code.
 *
 * @param {string} body - The core logic of the shader.
 * @param {Object} [options={}] - Build configurations.
 * @param {boolean} [options.includeHeader=true] - Whether to prepend the header.
 * @param {string} [options.headerType='webgl'] - Technology variant matching the file in core/ (e.g., 'webgl', 'opengl').
 * @returns {Promise<string>} The final processed shader source.
 */
export async function buildShader(body, options = {}) {
    const { includeHeader = true, headerType = headerTypes.WEBGL } = options;

    if (!includeHeader) {
        return body;
    }

    const headerContent = await loadShaderFile(`../shaders/core/${headerType}.glsl`);

    return `${headerContent}\n\n${body}`;
}

/**
 * Loads shader source code.
 *
 * @param {string} filePath - Path to the file.
 * @returns {Promise<string>} The shader source code.
 */
export async function loadShaderFile(filePath) {
    const response = await fetch(filePath);

    if (!response.ok) {
        throw new Error(`Failed to load file: ${filePath}`);
    }

    const fileContent = await response.text();

    return fileContent;
}