```javascript
/* =========================================================
   EXCEL YOU - ADMIN ARTICLES JS
========================================================= */

/* =========================================================
   ELEMENTS
========================================================= */

const sidebar =
    document.getElementById("sidebar");

const overlay =
    document.getElementById("overlay");

const mobileToggle =
    document.getElementById("mobileToggle");

const themeToggle =
    document.getElementById("themeToggle");

const articlesList =
    document.getElementById("articlesList");

const searchInput =
    document.getElementById("searchInput");


/* =========================================================
   SIDEBAR
========================================================= */

function openSidebar() {

    sidebar.classList.add("active");

    overlay.classList.add("show");
}

function closeSidebar() {

    sidebar.classList.remove("active");

    overlay.classList.remove("show");
}

mobileToggle?.addEventListener(
    "click",
    openSidebar
);

overlay?.addEventListener(
    "click",
    closeSidebar
);


/* =========================================================
   THEME
========================================================= */

function loadTheme() {

    const savedTheme =
        localStorage.getItem("excel-theme");

    if (savedTheme === "dark") {

        document.body.classList.add(
            "dark-theme"
        );

        themeToggle.innerHTML =
            "☀️ Light";
    }
}

function toggleTheme() {

    document.body.classList.toggle(
        "dark-theme"
    );

    const isDark =
        document.body.classList.contains(
            "dark-theme"
        );

    if (isDark) {

        localStorage.setItem(
            "excel-theme",
            "dark"
        );

        themeToggle.innerHTML =
            "☀️ Light";

    } else {

        localStorage.setItem(
            "excel-theme",
            "light"
        );

        themeToggle.innerHTML =
            "🌙 Dark";
    }
}

themeToggle?.addEventListener(
    "click",
    toggleTheme
);


/* =========================================================
   LOAD ARTICLES
========================================================= */

let allArticles = [];

async function loadArticles() {

    try {

        const response =
            await fetch("/api/articles");

        const articles =
            await response.json();

        allArticles = articles;

        renderArticles(articles);

    } catch (err) {

        console.error(
            "Failed to load articles",
            err
        );

        articlesList.innerHTML = `

            <div class="empty-box">
                Failed to load articles ❌
            </div>
        `;
    }
}


/* =========================================================
   RENDER ARTICLES
========================================================= */

function renderArticles(articles) {

    articlesList.innerHTML = "";

    if (!articles.length) {

        articlesList.innerHTML = `

            <div class="empty-box">
                No articles found.
            </div>
        `;

        return;
    }

    articles.forEach(article => {

        const statusClass =
            article.status === "published"
                ? "published"
                : "draft";

        articlesList.innerHTML += `

            <div class="article-card">

                <!-- LEFT -->

                <div class="article-left">

                    <div class="article-icon">

                        <i class="fas fa-file-alt"></i>

                    </div>

                    <div class="article-info">

                        <h3>
                            ${article.title}
                        </h3>

                        <p>
                            ${article.subject || "No Subject"}
                            •
                            ${article.topic || "No Topic"}
                        </p>

                        <div class="article-meta">

                            <span class="status ${statusClass}">
                                ${article.status || "draft"}
                            </span>

                            <span>
                                ${formatDate(article.createdAt)}
                            </span>

                        </div>

                    </div>

                </div>

                <!-- RIGHT -->

                <div class="article-actions">

                    <button
                        class="edit-btn"
                        onclick="editArticle('${article.slug}')"
                    >
                        Edit
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteArticle('${article.slug}')"
                    >
                        Delete
                    </button>

                </div>

            </div>
        `;
    });
}


/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(date) {

    if (!date) return "Unknown";

    return new Date(date)
        .toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );
}


/* =========================================================
   SEARCH
========================================================= */

searchInput?.addEventListener(
    "input",
    e => {

        const value =
            e.target.value
                .toLowerCase()
                .trim();

        const filtered =
            allArticles.filter(article => {

                return (
                    article.title
                        ?.toLowerCase()
                        .includes(value)

                    ||

                    article.subject
                        ?.toLowerCase()
                        .includes(value)

                    ||

                    article.topic
                        ?.toLowerCase()
                        .includes(value)
                );
            });

        renderArticles(filtered);
    }
);


/* =========================================================
   EDIT ARTICLE
========================================================= */

function editArticle(slug) {

    window.location.href =
        `/admin/admineditor.html?article=${slug}`;
}


/* =========================================================
   DELETE ARTICLE
========================================================= */

async function deleteArticle(slug) {

    const confirmDelete =
        confirm(
            "Delete this article?"
        );

    if (!confirmDelete) return;

    try {

        const response =
            await fetch(
                `/api/articles/${slug}`,
                {
                    method: "DELETE"
                }
            );

        if (response.ok) {

            loadArticles();

        } else {

            alert(
                "Failed to delete article"
            );
        }

    } catch (err) {

        console.error(err);

        alert(
            "Server error ❌"
        );
    }
}


/* =========================================================
   LOGOUT
========================================================= */

function logout() {

    localStorage.removeItem(
        "adminToken"
    );

    window.location.href =
        "/login.html";
}


/* =========================================================
   INIT
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadTheme();

        loadArticles();
    }
);
```
