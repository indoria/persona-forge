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

    async function _initializeMermaid() {
        if (typeof window.mermaid !== 'undefined') {
            if (!window.mermaid.__initialized) {
                try {
                    window.mermaid.initialize({
                        startOnLoad: false,
                        theme: 'default'
                    });
                    window.mermaid.__initialized = true;
                } catch (e) {
                    console.warn("Mermaid.js initialization failed or already initialized:", e);
                }
            }
        } else {
            console.warn("Mermaid.js not loaded. Cannot initialize.");
        }
    }

    async function setRenderer(rendererName) {
        if (currentRendererName === rendererName && rendererInstance) {
            return;
        }

        currentRendererName = rendererName;
        rendererInstance = null;

        try {
            await _loadScript('https://cdn.jsdelivr.net/npm/mermaid@11.6.0/dist/mermaid.min.js');
            await _initializeMermaid();

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
                        // Showdown.js custom extension for Mermaid
                        showdown.extension('mermaid', function() {
                            return [{
                                type: 'lang',
                                regex: '```mermaid\\n([\\s\\S]*?)\\n```',
                                replace: function(s, match) {
                                    return '<pre class="mermaid">' + match + '</pre>';
                                }
                            }];
                        });
                        rendererInstance = new window.showdown.Converter({ extensions: ['mermaid'] });
                    } else {
                        throw new Error("showdown.js global object 'showdown' not found.");
                    }
                    break;
                case 'markdown-it':
                    await _loadScript('https://cdn.jsdelivr.net/npm/markdown-it@14.1.0/dist/markdown-it.min.js');
                    if (typeof window.markdownit !== 'undefined') {
                        const md = new window.markdownit({
                            html: true,
                            linkify: true,
                            typographer: true
                        });

                        const defaultFenceRender = md.renderer.rules.fence;
                        md.renderer.rules.fence = (tokens, idx, options, env, self) => {
                            const token = tokens[idx];
                            if (token.info === 'mermaid') {
                                return `<pre class="mermaid">${token.content}</pre>`;
                            }
                            return defaultFenceRender(tokens, idx, options, env, self);
                        };

                        rendererInstance = md;
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

        let htmlContent;
        switch (currentRendererName) {
            case 'markdown':
                htmlContent = markdownText.replace(/```mermaid\n([\s\S]*?)\n```/g, '<pre class="mermaid">$1</pre>');
                htmlContent = rendererInstance.toHTML(htmlContent);
                break;
            case 'showdown':
                htmlContent = rendererInstance.makeHtml(markdownText);
                break;
            case 'markdown-it':
                htmlContent = rendererInstance.render(markdownText);
                break;
            default:
                htmlContent = markdownText;
                break;
        }
        return htmlContent;
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

            if (typeof window.mermaid !== 'undefined' && window.mermaid.__initialized) {
                window.mermaid.run({
                    querySelector: `#${targetElement.id} .mermaid`,
                    suppressErrors: true
                });
            }
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

        const promises = filesConfig.map(async config => {
            const targetElement = document.getElementById(config.targetId);
            if (!targetElement) {
                console.warn(`Skipping markdown file '${config.filePath}': Target element with ID '${config.targetId}' not found.`);
                return Promise.resolve();
            }
            return loadMarkdownFile(config.filePath, targetElement);
        });

        const results = await Promise.allSettled(promises);

        if (typeof window.mermaid !== 'undefined' && window.mermaid.__initialized) {
            window.mermaid.run();
        }

        return results;
    }

    return {
        setRenderer: setRenderer,
        loadMarkdownFile: loadMarkdownFile,
        loadMultipleMarkdownFiles: loadMultipleMarkdownFiles,
        init: async function(defaultRenderer = 'markdown') {
            await setRenderer(defaultRenderer);
        }
    };
})();