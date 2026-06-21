/* =========================================================
   EXCEL YOU
   ADMIN TOPICS JS
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

const topicForm =
    document.getElementById("topicForm");

const topicName =
    document.getElementById("topicName");

const topicSlug =
    document.getElementById("topicSlug");

const topicSubject =
    document.getElementById("topicSubject");

const topicsList =
    document.getElementById("topicsList");


/* =========================================================
   MOBILE SIDEBAR
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
   AUTO SLUG
========================================================= */

topicName?.addEventListener(
    "input",
    () => {

        topicSlug.value =
            topicName.value
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "");
    }
);


/* =========================================================
   LOAD SUBJECTS
========================================================= */

async function loadSubjects() {

    try {

        const response =
            await fetch("/api/subjects");

        const subjects =
            await response.json();

        topicSubject.innerHTML = `
            <option value="">
                Select Subject
            </option>
        `;

        subjects.forEach(subject => {

            topicSubject.innerHTML += `
                <option value="${subject.name}">
                    ${subject.name}
                </option>
            `;
        });

    } catch (err) {

        console.error(
            "Failed to load subjects",
            err
        );
    }
}


/* =========================================================
   CREATE TOPIC
========================================================= */

topicForm?.addEventListener(
    "submit",
    async e => {

        e.preventDefault();

        const topicData = {

            name:
                topicName.value.trim(),

            slug:
                topicSlug.value.trim(),

            subject:
                topicSubject.value
        };

        try {

            const response =
                await fetch(
                    "/api/topics",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify(
                            topicData
                        )
                    }
                );

            const data =
                await response.json();

            if (response.ok) {

                alert(
                    "Topic created successfully ✔"
                );

                topicForm.reset();

                loadTopics();

            } else {

                alert(
                    data.message ||
                    "Failed to create topic"
                );
            }

        } catch (err) {

            console.error(err);

            alert(
                "Server error ❌"
            );
        }
    }
);


/* =========================================================
   LOAD TOPICS
========================================================= */

async function loadTopics() {

    try {

        const response =
            await fetch("/api/topics");

        const topics =
            await response.json();

        topicsList.innerHTML = "";

        if (!topics.length) {

            topicsList.innerHTML = `
                <div class="empty-box">
                    No topics created yet.
                </div>
            `;

            return;
        }

        topics.forEach(topic => {

            topicsList.innerHTML += `

                <div class="article-item">

                    <div>

                        <h4>
                            ${topic.name}
                        </h4>

                        <p>
                            ${topic.subject}
                        </p>

                    </div>

                    <div class="article-actions">

                        <button
                            class="edit-btn"
                            onclick="editTopic('${topic.slug}')"
                        >
                            Edit
                        </button>

                        <button
                            class="delete-btn"
                            onclick="deleteTopic('${topic.slug}')"
                        >
                            Delete
                        </button>

                    </div>

                </div>
            `;
        });

    } catch (err) {

        console.error(
            "Failed to load topics",
            err
        );
    }
}


/* =========================================================
   EDIT TOPIC
========================================================= */

function editTopic(slug) {

    window.location.href =
        `/admin/admineditor.html?topic=${slug}`;
}


/* =========================================================
   DELETE TOPIC
========================================================= */

async function deleteTopic(slug) {

    const confirmDelete =
        confirm(
            "Delete this topic?"
        );

    if (!confirmDelete) return;

    try {

        const response =
            await fetch(
                `/api/topics/${slug}`,
                {
                    method: "DELETE"
                }
            );

        if (response.ok) {

            loadTopics();

        } else {

            alert(
                "Failed to delete topic"
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

        loadSubjects();

        loadTopics();
    }
);

