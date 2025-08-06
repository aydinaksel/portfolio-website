function generateAppGrid() {
    const appGrid = document.getElementById('app-grid');

    fetch('assets/data/apps.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load app data');
            }
            return response.json();
        })
        .then(apps => {
            apps.forEach(app => {
                const appItem = document.createElement('div');
                appItem.classList.add('app-item');

                const iconContainer = document.createElement('a');
                iconContainer.classList.add('app-icon-container');
                iconContainer.href = `./${app.name.toLowerCase()}.html`;

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

function generateBlogGrid() {
  const blogGrid = document.querySelector('.blog-grid');
  blogGrid.innerHTML = '';

  fetch('assets/data/blogs.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load blog data');
      }
      return response.json();
    })
    .then(blogs => {
      if (blogs.length === 0) {
        blogGrid.innerHTML = `<p class="no-results">No blog posts available at the moment.</p>`;
        return;
      }

      blogs.forEach(blog => {
        const card = document.createElement('a');
        card.href = `./blogs/${blog.slug}.html`;
        card.classList.add('blog-post__card-medium');

        card.innerHTML = `
          <div class="blog-post__image-wrapper">
            <img
              src="${blog.image}"
              class="blog-post__image"
              alt="${blog.title}"
              width="400"
              height="400">
          </div>
          <div class="blog-post__detail-wrapper">
            <h2 class="blog-post__detail">${blog.title}</h2>
            <p class="blog-post__detail">${blog.description}</p>
          </div>
        `;

        blogGrid.appendChild(card);
      });
    })
    .catch(error => {
      console.error('Error loading blog data:', error);
      blogGrid.innerHTML = '<p class="error-message">Failed to load blog posts. Please refresh the page.</p>';
    });
}

function getPlatformFromPath() {
  const path = window.location.pathname;
  const file = path.substring(path.lastIndexOf('/') + 1);
  const platform = file.replace('.html', '');
  return platform;
}

document.getElementById('currentYear').textContent = new Date().getFullYear();

const submitButton = document.getElementById('submitButton');
if (submitButton) {
  submitButton.addEventListener("click", function (e) {
    e.preventDefault();
    submitButton.innerHTML = '<div class="spinner"></div>';
    submitButton.disabled = true;

    const form = document.getElementById("contactForm");
    const main = document.querySelector("main");

    const formData = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      message: document.getElementById("message").value.trim(),
    };

    fetch("https://n8n.chichek.co.uk/webhook/8dad1106-53fb-4eb1-b8ee-62f7a7c7dd5b", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })
    .then(async response => response.json())
    .then(data => {
        form.classList.add("fade-out");

        setTimeout(() => {
          form.classList.add("hidden");
          form.style.display = "none";

          const success = document.createElement("div");
          success.className = "success-message hidden";
          success.innerHTML = `
            <div class="message-text-wrapper">
              <p>${data.message || "Submitted successfully!"}</p>
              <p><strong>Your code:</strong> ${data.submission_id}</p>
            </div>
          `;
          main.appendChild(success);

          void success.offsetWidth;

          success.classList.remove("hidden");
          success.classList.add("fade-in");

        }, 1000);
    })
    .catch(error => {
      form.classList.add("fade-out");

      setTimeout(() => {
        form.classList.add("hidden");
        form.style.display = "none";

        const errorMsg = document.createElement("div");
        errorMsg.className = "error-message hidden";
        errorMsg.innerHTML = `
          <div class="message-text-wrapper">
            <p>There was an error.</p>
            <p><strong>Error Message:</strong> ${error}</p>
          </div>
        `;
        main.appendChild(errorMsg);

        void errorMsg.offsetWidth;

        errorMsg.classList.remove("hidden");
        errorMsg.classList.add("fade-in");
      }, 1000);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;

  if (path.endsWith('index.html') || path === '/' || path === '/index') {
    generateAppGrid();
  } else if (path.endsWith('blogs.html') || path.endsWith('blogs')) {
    generateBlogGrid();
  } else {}
});
