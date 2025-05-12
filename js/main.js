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

                    fetch(app.icon)
                      .then(res => res.text())
                      .then(svgText => {
                        const iconWrapper = document.createElement('div');
                        iconWrapper.classList.add('app-icon');
                        iconWrapper.innerHTML = svgText;

                        const svgElement = iconWrapper.querySelector('svg');
                        if (svgElement) {
                          svgElement.setAttribute('fill', 'currentColor');
                          svgElement.style.setProperty('display', 'flex');
                        }

                        iconWrapper.style.setProperty('--hover-color', app.color);

                        iconContainer.appendChild(iconWrapper);
                      })
                    .catch(err => {
                        console.error(`Failed to load SVG icon: ${app.icon}`, err);
                    });

                const label = document.createElement('div');
                label.classList.add('app-label');
                label.textContent = app.name;

                appItem.appendChild(iconContainer);
                appItem.appendChild(label);
                appGrid.appendChild(appItem);
            });
        })
        .catch(error => {
            console.error('Error loading apps data:', error);
            appGrid.innerHTML = '<p class="error-message">Failed to load app data. Please refresh the page.</p>';
        });
}

document.getElementById('currentYear').textContent = new Date().getFullYear();
document.addEventListener('DOMContentLoaded', generateAppGrid);
