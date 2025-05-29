(function() {
    const MarkdownTabsModule = (function() {
        let currentPathPrefix = '';
        let currentTabFiles = [];
        let markdownFilesConfig = [];

        function normalizeName(name) {
            return name.replace(/^[0-9]+-/, '').replace(/-/g, ' ');
        }

        async function createTabbedMarkdownContent(fileBaseNames, pathPrefix) {
            const tabNav = document.getElementById('tabNav');
            const tabContentWrapper = document.getElementById('tabContentWrapper');
            const filesConfig = [];

            if (!tabNav || !tabContentWrapper) {
                console.error('Tab navigation or content wrapper elements not found.');
                return;
            }

            tabNav.innerHTML = '';
            tabContentWrapper.innerHTML = '';

            fileBaseNames.forEach((baseName, index) => {
                const sectionId = `section${baseName.replace(/-/g, '')}`;
                const tabButtonId = `${baseName}-tab`;
                const markdownFilePath = `<span class="math-inline">\{pathPrefix\}/</span>{baseName}.md`;
                const tabTitle = normalizeName(baseName);

                const button = document.createElement('button');
                button.classList.add('tab-button');
                button.id = tabButtonId;
                button.textContent = tabTitle;
                button.setAttribute('data-target-tab', sectionId);
                tabNav.appendChild(button);

                const contentDiv = document.createElement('div');
                contentDiv.classList.add('tab-content');
                contentDiv.id = sectionId;
                contentDiv.innerHTML = `<p>Loading ${tabTitle} content...</p>`;
                tabContentWrapper.appendChild(contentDiv);

                filesConfig.push({
                    filePath: markdownFilePath,
                    targetId: sectionId
                });

                button.addEventListener('click', () => {
                    openTab(event, sectionId);
                    MarkdownLoader.loadMarkdownFile(markdownFilePath, `#${sectionId}`);
                });
            });

            markdownFilesConfig = filesConfig;

            await MarkdownLoader.loadMultipleMarkdownFiles(filesConfig);

            if (fileBaseNames.length > 0) {
                const firstTabButton = document.getElementById(`${fileBaseNames[0]}-tab`);
                if (firstTabButton) {
                    firstTabButton.click();
                }
            }
        }

        function openTab(evt, tabId) {
            let i, tabcontent, tablinks;

            tabcontent = document.getElementsByClassName("tab-content");
            for (i = 0; i < tabcontent.length; i++) {
                tabcontent[i].classList.remove("active");
            }

            tablinks = document.getElementsByClassName("tab-button");
            for (i = 0; i < tablinks.length; i++) {
                tablinks[i].classList.remove("active");
            }

            document.getElementById(tabId).classList.add("active");
            if (evt) {
                evt.currentTarget.classList.add("active");
            } else {
                const btn = document.querySelector(`.tab-button[data-target-tab="${tabId}"]`);
                if (btn) btn.classList.add("active");
            }
        }

        async function init(pathPrefix, tabFiles) {
            currentPathPrefix = pathPrefix;
            currentTabFiles = tabFiles;

            await MarkdownLoader.init('markdown-it');
            await createTabbedMarkdownContent(currentTabFiles, currentPathPrefix);
            attachEventListeners();
        }

        async function switchContent(newPathPrefix, newTabFiles) {
            currentPathPrefix = newPathPrefix;
            currentTabFiles = newTabFiles;
            await createTabbedMarkdownContent(currentTabFiles, currentPathPrefix);
        }

        function attachEventListeners() {
            document.getElementById('useMarkdownJS')?.addEventListener('click', async () => {
                await MarkdownLoader.setRenderer('markdown');
                await createTabbedMarkdownContent(currentTabFiles, currentPathPrefix);
            });

            document.getElementById('useShowdownJS')?.addEventListener('click', async () => {
                await MarkdownLoader.setRenderer('showdown');
                await createTabbedMarkdownContent(currentTabFiles, currentPathPrefix);
            });

            document.getElementById('useMarkdownItJS')?.addEventListener('click', async () => {
                await MarkdownLoader.setRenderer('markdown-it');
                await createTabbedMarkdownContent(currentTabFiles, currentPathPrefix);
            });

            document.getElementById('reloadContentBtn')?.addEventListener('click', async () => {
                const activeTabContent = document.querySelector('.tab-content.active');
                if (activeTabContent) {
                    const activeTabConfig = markdownFilesConfig.find(config => config.targetId === activeTabContent.id);
                    if (activeTabConfig) {
                        activeTabContent.innerHTML = 'Reloading...';
                        await MarkdownLoader.loadMarkdownFile(activeTabConfig.filePath, `#${activeTabConfig.targetId}`);
                    }
                }
            });

            document.getElementById('clearCacheBtn')?.addEventListener('click', async () => {
                console.log('Clearing cache...');
                const success = await MarkdownCache.clear();
                if (success) {
                    alert('Cache cleared successfully!');
                    const activeTabContent = document.querySelector('.tab-content.active');
                    if (activeTabContent) {
                        const activeTabConfig = markdownFilesConfig.find(config => config.targetId === activeTabContent.id);
                        if (activeTabConfig) {
                            activeTabContent.innerHTML = 'Reloading after cache clear...';
                            await MarkdownLoader.loadMarkdownFile(activeTabConfig.filePath, `#${activeTabConfig.targetId}`);
                        }
                    }
                } else {
                    alert('Failed to clear cache.');
                }
            });

            document.getElementById('cacheDriverSelect')?.addEventListener('change', async (event) => {
                const selectedDriver = event.target.value;
                let driverInstance;
                switch (selectedDriver) {
                    case 'localStorage':
                        driverInstance = StorageDrivers.localStorage();
                        break;
                    case 'sessionStorage':
                        driverInstance = StorageDrivers.sessionStorage();
                        break;
                    case 'indexedDB':
                        driverInstance = StorageDrivers.indexedDB();
                        break;
                    default:
                        console.warn('Unknown driver selected.');
                        return;
                }
                await MarkdownCache.init(driverInstance);
                alert(`Cache driver switched to ${selectedDriver}. Try reloading content!`);
            });
        }

        return {
            init: init,
            switchContent: switchContent
        };
    })();

    document.addEventListener('DOMContentLoaded', async () => {
        const defaultPathPrefix = '/data/playground';
        const defaultTabFiles = ['1-1-design', '1-2-features', '1-3-prompt'];

        MarkdownCache.init(StorageDrivers.localStorage());

        await MarkdownTabsModule.init(defaultPathPrefix, defaultTabFiles);
    });
})();