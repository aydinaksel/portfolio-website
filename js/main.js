function generateAppGrid() {
    const appGrid = document.getElementById('app-grid');

    fetch('assets/data/apps.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(apps => {
            apps.forEach(app => {
                const appItem = document.createElement('div');
                appItem.classList.add('app-item');

                const iconContainer = document.createElement('div');
                iconContainer.classList.add('app-icon-container');

                const icon = document.createElement('img');
                icon.classList.add('app-icon');
                icon.src = app.icon;
                icon.alt = `${app.name} icon`;

                const label = document.createElement('div');
                label.classList.add('app-label');
                label.textContent = app.name;

                const tooltip = document.createElement('div');
                tooltip.classList.add('tooltip');
                tooltip.textContent = app.tooltip;

                const downloadBtn = document.createElement('button');
                downloadBtn.classList.add('download-button');
                downloadBtn.textContent = 'Download';
                downloadBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    downloadIcon(app.icon, `${app.name.toLowerCase()}.svg`);
                });

                iconContainer.appendChild(icon);
                appItem.appendChild(iconContainer);
                appItem.appendChild(label);
                appItem.appendChild(tooltip);
                appItem.appendChild(downloadBtn);
                appGrid.appendChild(appItem);
            });
        })
        .catch(error => {
            console.error('Error loading apps data:', error);
            appGrid.innerHTML = '<p class="error-message">Failed to load app data. Please refresh the page.</p>';
        });
}

function downloadIcon(url, filename) {
    fetch(url)
        .then(response => response.blob())
        .then(blob => {
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = blobUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(blobUrl);
            a.remove();
        })
        .catch(e => console.error('Download failed:', e));
}

document.getElementById('currentYear').textContent = new Date().getFullYear();
document.addEventListener('DOMContentLoaded', generateAppGrid);
