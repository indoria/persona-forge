const MarkdownLoader = (function() {
    let rendererInstance = null;
    let currentRendererName = null;
    const loadedScripts = {};

    async function _loadScript(src) {
        return new Promise((resolve, reject) => {
            if (loadedScripts[src]) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = src;
            script.onload = () => {
                loadedScripts[src] = true;
                resolve();
            };
            script.onerror = () => {
                console.error('Failed to load script:', src);
                reject(new Error(`Failed to load script: ${src}`));
            };
            document.head.appendChild(script);
        });
    }

    async function setRenderer(rendererName) {
        if (currentRendererName === rendererName && rendererInstance) {
            return;
        }

        currentRendererName = rendererName;
        rendererInstance = null;

        try {
            switch (rendererName) {
                case 'markdown':
                    await _loadScript('https://cdnjs.cloudflare.com/ajax/libs/markdown.js/0.5.0/markdown.min.js');
                    if (typeof window.markdown !== 'undefined') {
                        rendererInstance = window.markdown;
                    } else {
                        throw new Error("markdown.js global object 'markdown' not found.");
                    }
                    break;
                case 'showdown':
                    await _loadScript('https://cdn.jsdelivr.net/npm/showdown@2.1.0/dist/showdown.min.js');
                    if (typeof window.showdown !== 'undefined') {
                        rendererInstance = new window.showdown.Converter();
                    } else {
                        throw new Error("showdown.js global object 'showdown' not found.");
                    }
                    break;
                case 'markdown-it':
                    await _loadScript('https://cdn.jsdelivr.net/npm/markdown-it@14.1.0/dist/markdown-it.min.js');
                    if (typeof window.markdownit !== 'undefined') {
                        rendererInstance = new window.markdownit();
                    } else {
                        throw new Error("markdown-it.js global object 'markdownit' not found.");
                    }
                    break;
                default:
                    console.warn(`Unknown renderer: ${rendererName}. Defaulting to markdown-it.`);
                    await setRenderer('markdown-it');
                    break;
            }
        } catch (error) {
            console.error(`Failed to set renderer '${rendererName}':`, error);
            currentRendererName = null;
            rendererInstance = null;
            throw error;
        }
    }

    function convertToHtml(markdownText) {
        if (!rendererInstance) {
            throw new Error("No Markdown renderer is set. Call setRenderer() first.");
        }

        switch (currentRendererName) {
            case 'markdown':
                return rendererInstance.toHTML(markdownText);
            case 'showdown':
                return rendererInstance.makeHtml(markdownText);
            case 'markdown-it':
                return rendererInstance.render(markdownText);
            default:
                return markdownText;
        }
    }

    async function loadMarkdownFile(filePath, target) {
        let targetElement;
        if (typeof target === 'string') {
            targetElement = document.querySelector(target);
        } else if (target instanceof HTMLElement) {
            targetElement = target;
        }

        if (!targetElement) {
            console.error(`Target element not found for ${filePath} with selector/element:`, target);
            return;
        }

        if (!rendererInstance) {
            targetElement.innerHTML = `<p style="color: red;">Error: Markdown renderer not initialized. Please ensure a renderer is set before loading files.</p>`;
            console.error("Markdown renderer not initialized. Call setRenderer() first.");
            return;
        }

        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status} for ${filePath}`);
            }
            const markdownText = await response.text();
            targetElement.innerHTML = convertToHtml(markdownText);
        } catch (error) {
            console.error(`Error loading or rendering '${filePath}':`, error);
            targetElement.innerHTML = `<p style="color: red;">Error loading content: ${error.message}</p>`;
        }
    }

    async function loadMultipleMarkdownFiles(filesConfig) {
        if (!Array.isArray(filesConfig)) {
            console.error("Invalid configuration for loadMultipleMarkdownFiles. Expected an array.");
            return;
        }

        const promises = filesConfig.map(config => {
            const targetElement = document.getElementById(config.targetId);
            if (!targetElement) {
                console.warn(`Skipping markdown file '${config.filePath}': Target element with ID '${config.targetId}' not found.`);
                return Promise.resolve();
            }
            return loadMarkdownFile(config.filePath, targetElement);
        });

        return Promise.allSettled(promises);
    }

    return {
        setRenderer: setRenderer,
        loadMarkdownFile: loadMarkdownFile,
        loadMultipleMarkdownFiles: loadMultipleMarkdownFiles,
        init: async function(defaultRenderer = 'markdown-it') {
            await setRenderer(defaultRenderer);
        }
    };
})();