# EXCEL YOU ADMIN PANEL - FULL REPLACEMENT admin.js


// =========================================================
// EXCEL YOU ADMIN PANEL
// Blogger Style CMS Editor
// MongoDB Atlas Ready
// =========================================================

// =========================================================
// GLOBAL STATE
// =========================================================

const state = {

    currentArticleId: null,

    currentStatus: "draft",

    currentView: "visual",

    autosaveTimer: null,

    hasChanges: false,

    isSaving: false,

    featuredImage: "",

    sidebarOpen: false
};


// =========================================================
// DOM ELEMENTS
// =========================================================

const elements = {};


// =========================================================
// INIT ELEMENTS
// =========================================================

function initElements() {

    elements.sidebar =
        document.getElementById("sidebar");

    elements.overlay =
        document.getElementById("overlay");

    elements.menuBtn =
        document.querySelector(".menu-btn");

    elements.themeToggle =
        document.getElementById("themeToggle");

    elements.editor =
        document.getElementById("editor");

    elements.editorTitle =
        document.getElementById("editorTitle");

    elements.previewBox =
        document.getElementById("previewBox");

    elements.editorSubject =
        document.getElementById("editorSubject");

    elements.editorTopic =
        document.getElementById("editorTopic");

    elements.postsList =
        document.getElementById("postsList");

    elements.subjectList =
        document.getElementById("subjectList");

    elements.statsBox =
        document.getElementById("statsBox");

    elements.saveStatus =
        document.getElementById("saveStatus");

    elements.featuredImageBox =
        document.querySelector(".featured-image-box");
}


// =========================================================
// SAFE HTML
// =========================================================

function sanitizeHTML(html = "") {

    if (typeof DOMPurify !== "undefined") {

        return DOMPurify.sanitize(html);
    }

    return html;
}


// =========================================================
// SIDEBAR
// =========================================================

function toggleSidebar() {

    state.sidebarOpen = !state.sidebarOpen;

    elements.sidebar?.classList.toggle("active");

    elements.overlay?.classList.toggle("show");
}

function closeSidebar() {

    state.sidebarOpen = false;

    elements.sidebar?.classList.remove("active");

    elements.overlay?.classList.remove("show");
}

function setupSidebar() {

    elements.menuBtn?.addEventListener(
        "click",
        toggleSidebar
    );

    elements.overlay?.addEventListener(
        "click",
        closeSidebar
    );
}


// =========================================================
// SECTION SWITCHING
// =========================================================

function showSection(section) {

    const sections = {

        dashboard:
            document.getElementById("dashboardSection"),

        subject:
            document.getElementById("subjectSection"),

        topic:
            document.getElementById("topicSection"),

        posts:
            document.getElementById("postsSection"),

        block:
            document.getElementById("blockSection")
    };

    Object.values(sections).forEach(sec => {

        sec?.classList.add("hidden");
    });

    sections[section]?.classList.remove("hidden");

    setActiveMenu(section);

    closeSidebar();
}


// =========================================================
// ACTIVE MENU
// =========================================================

function setActiveMenu(section) {

    document
        .querySelectorAll(".menu-item")
        .forEach(btn => {

            btn.classList.remove("active");
        });

    const target = document.querySelector(
        `[onclick="showSection('${section}')"]`
    );

    target?.classList.add("active");
}


// =========================================================
// THEME SYSTEM
// =========================================================

function setupTheme() {

    const savedTheme =
        localStorage.getItem("excel_you_theme");

    if (savedTheme === "dark") {

        document.body.classList.add(
            "dark-theme"
        );

        if (elements.themeToggle) {

            elements.themeToggle.innerHTML = "☀️";
        }
    }

    elements.themeToggle?.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "dark-theme"
            );

            const isDark =
                document.body.classList.contains(
                    "dark-theme"
                );

            elements.themeToggle.innerHTML =
                isDark ? "☀️" : "🌙";

            localStorage.setItem(
                "excel_you_theme",
                isDark ? "dark" : "light"
            );
        }
    );
}


// =========================================================
// EDITOR SETUP
// =========================================================

function setupEditor() {

    if (!elements.editor) {

        console.error("Editor not found");

        return;
    }

    elements.editor.addEventListener(
        "keyup",
        handleEditorChange
    );

    elements.editor.addEventListener(
        "paste",
        handleEditorChange
    );

    elements.editorTitle?.addEventListener(
        "input",
        handleEditorChange
    );
}


// =========================================================
// EDITOR CHANGES
// =========================================================

function handleEditorChange() {

    state.hasChanges = true;

    startAutosave();

    updatePreview();
}


// =========================================================
// EXEC COMMAND
// =========================================================

function execCmd(command, value = null) {

    document.execCommand(
        command,
        false,
        value
    );

    elements.editor.focus();

    handleEditorChange();
}


// =========================================================
// INSERT IMAGE
// =========================================================

function insertImage() {

    const input =
        document.createElement("input");

    input.type = "file";

    input.accept = "image/*";

    input.click();

    input.onchange = async () => {

        const file = input.files[0];

        if (!file) return;

        if (
            !file.type.startsWith("image/")
        ) {

            alert("Only images allowed");

            return;
        }

        const formData =
            new FormData();

        formData.append("image", file);

        try {

            const response = await fetch(
                "/api/upload",
                {
                    method: "POST",
                    body: formData
                }
            );

            const data =
                await response.json();

            if (data.url) {

                execCmd(
                    "insertImage",
                    data.url
                );
            }

        } catch (err) {

            console.error(err);

            alert("Image upload failed");
        }
    };
}


// =========================================================
// INSERT LINK
// =========================================================

function insertLink() {

    const url = prompt(
        "Enter URL"
    );

    if (!url) return;

    execCmd("createLink", url);
}


// =========================================================
// TOGGLE HTML VIEW
// =========================================================

function toggleHTML() {

    if (!elements.editor) return;

    if (state.currentView === "visual") {

        elements.editor.textContent =
            elements.editor.innerHTML;

        state.currentView = "html";

    } else {

        elements.editor.innerHTML =
            sanitizeHTML(
                elements.editor.textContent
            );

        state.currentView = "visual";
    }
}


// =========================================================
// PREVIEW
// =========================================================

function updatePreview() {

    if (!elements.previewBox) return;

    elements.previewBox.innerHTML =
        sanitizeHTML(
            elements.editor.innerHTML
        );
}


// =========================================================
// TOGGLE PREVIEW
// =========================================================

function togglePreview() {

    elements.previewBox?.classList.toggle(
        "hidden"
    );
}


// =========================================================
// AUTOSAVE
// =========================================================

function startAutosave() {

    clearTimeout(state.autosaveTimer);

    state.autosaveTimer = setTimeout(
        saveDraft,
        2000
    );
}


// =========================================================
// SAVE DRAFT
// =========================================================

async function saveDraft() {

    if (
        state.isSaving ||
        !state.hasChanges
    ) {
        return;
    }

    state.isSaving = true;

    updateSaveStatus("Saving...");

    const payload = {

        title:
            elements.editorTitle?.value || "",

        content:
            sanitizeHTML(
                elements.editor?.innerHTML || ""
            ),

        subject:
            elements.editorSubject?.value || "",

        topic:
            elements.editorTopic?.value || "",

        featuredImage:
            state.featuredImage,

        status:
            state.currentStatus
    };

    try {

        const response = await fetch(
            "/api/articles/save",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(payload)
            }
        );

        const data = await response.json();

        if (response.ok) {

            state.hasChanges = false;

            state.currentArticleId =
                data.articleId;

            updateSaveStatus("Saved ✔");

        } else {

            updateSaveStatus("Save failed");
        }

    } catch (err) {

        console.error(err);

        updateSaveStatus("Server error");

    } finally {

        state.isSaving = false;
    }
}


// =========================================================
// SAVE STATUS
// =========================================================

function updateSaveStatus(text) {

    if (elements.saveStatus) {

        elements.saveStatus.textContent = text;
    }
}


// =========================================================
// PUBLISH
// =========================================================

async function publishPost() {

    if (
        !confirm(
            "Publish this article?"
        )
    ) {
        return;
    }

    state.currentStatus = "published";

    await saveDraft();

    alert("🎉 Article Published");
}


// =========================================================
// LOAD SUBJECTS
// =========================================================

async function loadSubjects() {

    try {

        const response = await fetch(
            "/api/subjects"
        );

        const subjects =
            await response.json();

        if (!elements.editorSubject) return;

        elements.editorSubject.innerHTML =
            `<option value="">Select Subject</option>`;

        subjects.forEach(subject => {

            elements.editorSubject.innerHTML += `
            <option value="${subject._id}">
                ${subject.name}
            </option>`;
        });

    } catch (err) {

        console.error(err);
    }
}


// =========================================================
// LOAD TOPICS
// =========================================================

async function loadTopics() {

    try {

        const response = await fetch(
            "/api/topics"
        );

        const topics =
            await response.json();

        if (!elements.editorTopic) return;

        elements.editorTopic.innerHTML =
            `<option value="">Select Topic</option>`;

        topics.forEach(topic => {

            elements.editorTopic.innerHTML += `
            <option value="${topic._id}">
                ${topic.title}
            </option>`;
        });

    } catch (err) {

        console.error(err);
    }
}


// =========================================================
// LOAD POSTS
// =========================================================

async function loadPosts() {

    try {

        const response = await fetch(
            "/api/articles"
        );

        const posts =
            await response.json();

        if (!elements.postsList) return;

        elements.postsList.innerHTML = "";

        posts.forEach(post => {

            elements.postsList.innerHTML += `
            <div class="post-card">

                <h3>${post.title}</h3>

                <p>${post.status}</p>

                <button onclick="editArticle('${post._id}')">
                    Edit
                </button>
            </div>`;
        });

    } catch (err) {

        console.error(err);
    }
}


// =========================================================
// EDIT ARTICLE
// =========================================================

async function editArticle(id) {

    try {

        const response = await fetch(
            `/api/articles/${id}`
        );

        const article =
            await response.json();

        state.currentArticleId = id;

        elements.editorTitle.value =
            article.title;

        elements.editor.innerHTML =
            article.content;

        elements.editorSubject.value =
            article.subject;

        elements.editorTopic.value =
            article.topic;

        updatePreview();

        showSection("block");

    } catch (err) {

        console.error(err);
    }
}


// =========================================================
// DASHBOARD STATS
// =========================================================

async function loadDashboardStats() {

    try {

        const response = await fetch(
            "/api/dashboard/stats"
        );

        const stats = await response.json();

        if (!elements.statsBox) return;

        elements.statsBox.innerHTML = `
        <div class="stat-card">
            <h2>${stats.articles}</h2>
            <p>Articles</p>
        </div>

        <div class="stat-card">
            <h2>${stats.subjects}</h2>
            <p>Subjects</p>
        </div>

        <div class="stat-card">
            <h2>${stats.topics}</h2>
            <p>Topics</p>
        </div>

        <div class="stat-card">
            <h2>${stats.drafts}</h2>
            <p>Drafts</p>
        </div>`;

    } catch (err) {

        console.error(err);
    }
}


// =========================================================
// ADD SUBJECT
// =========================================================

async function addSubject() {

    const name = prompt(
        "Enter subject name"
    );

    if (!name) return;

    try {

        await fetch(
            "/api/subjects",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name
                })
            }
        );

        loadSubjects();

    } catch (err) {

        console.error(err);
    }
}


// =========================================================
// ADD TOPIC
// =========================================================

async function addTopic() {

    const title = prompt(
        "Enter topic name"
    );

    if (!title) return;

    try {

        await fetch(
            "/api/topics",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    title
                })
            }
        );

        loadTopics();

    } catch (err) {

        console.error(err);
    }
}


// =========================================================
// CREATE NEW ARTICLE
// =========================================================

function createNewArticle() {

    state.currentArticleId = null;

    state.currentStatus = "draft";

    elements.editorTitle.value = "";

    elements.editor.innerHTML = "";

    updatePreview();

    showSection("block");
}


// =========================================================
// LOGOUT
// =========================================================

function logout() {

    if (
        confirm("Logout now?")
    ) {

        localStorage.clear();

        window.location.href = "/login";
    }
}


// =========================================================
// INIT APP
// =========================================================

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        try {

            initElements();

            setupSidebar();

            setupTheme();

            setupEditor();

            updatePreview();

            showSection("dashboard");

            await loadDashboardStats();

            await loadSubjects();

            await loadTopics();

            await loadPosts();

            console.log(
                "✅ EXCEL YOU CMS Loaded"
            );

        } catch (err) {

            console.error(err);

            alert(
                "Admin failed to load"
            );
        }
    }
);

