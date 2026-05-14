// =========================
// GLOBAL
// =========================
let quill;
let saveTimer;

const AUTO_SAVE_DELAY = 2000;

const elements = {};


// =========================
// INIT ELEMENTS
// =========================
function initElements() {

    elements.postsList =
        document.getElementById("postsList");

    elements.previewBox =
        document.getElementById("previewBox");

    elements.subjectList =
        document.getElementById("subjectList");

    elements.statsBox =
        document.getElementById("statsBox");

    elements.topicId =
        document.getElementById("topicId");

    elements.editorTitle =
        document.getElementById("editorTitle");

    elements.editorSubject =
        document.getElementById("editorSubject");

    elements.editorTopic =
        document.getElementById("editorTopic");

    elements.publishBtn =
        document.getElementById("publishBtn");

    elements.statusBadge =
        document.getElementById("statusBadge");

    elements.saveStatus =
        document.getElementById("saveStatus");
}


// =========================
// API HELPER
// =========================
async function api(url, options = {}) {

    const res =
        await fetch(url, options);

    let data = null;

    try {
        data = await res.json();
    } catch {
        data = null;
    }

    if (!res.ok) {

        throw new Error(
            data?.message || "Request failed"
        );
    }

    return data;
}


// =========================
// SAFE HTML
// =========================
function escapeHTML(str = "") {

    return String(str).replace(/[&<>"']/g, m => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[m]));
}


// =========================
// SAFE RENDER
// =========================
function renderHTML(html = "") {

    if (typeof DOMPurify !== "undefined") {

        return DOMPurify.sanitize(html);
    }

    return html;
}


// =========================
// SECTION NAVIGATION
// =========================
function showSection(section) {

    [
        "dashboard",
        "subject",
        "topic",
        "posts",
        "block"
    ].forEach(sec => {

        document
            .getElementById(sec + "Section")
            ?.classList.add("hidden");
    });

    document
        .getElementById(section + "Section")
        ?.classList.remove("hidden");
}


// =========================
// SUBJECT
// =========================
async function addSubject() {

    const name =
        document.getElementById("subjectName")
            ?.value.trim();

    const description =
        document.getElementById("subjectDesc")
            ?.value.trim();

    const language =
        document.getElementById("subjectLang")
            ?.value || "en";

    if (!name) {

        alert("Subject name required ❌");

        return;
    }

    try {

        await api("/api/admin/subject", {

            method: "POST",

            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded"
            },

            body: new URLSearchParams({
                name,
                description,
                language
            })
        });

        alert("Subject Created ✔");

        document.getElementById("subjectName").value = "";
        document.getElementById("subjectDesc").value = "";

        await Promise.all([
            loadSubjects(),
            loadSubjectFilter(),
            loadStats()
        ]);

    } catch (err) {

        console.error(err);

        alert(err.message);
    }
}


function selectSubject(id) {

    const subjectInput =
        document.getElementById("subjectId");

    if (subjectInput) {
        subjectInput.value = id;
    }

    showSection("topic");
}


// =========================
// LOAD SUBJECT FILTERS
// =========================
async function loadSubjectFilter() {

    try {

        const subjects =
            await api("/api/admin/subjects");

        const filterSelect =
            document.getElementById("filterSubject");

        const subjectSelect =
            document.getElementById("subjectId");

        const editorSubject =
            document.getElementById("editorSubject");

        const defaultHTML = `
            <option value="">
                Select Subject
            </option>
        `;

        if (filterSelect) {

            filterSelect.innerHTML = `
                <option value="">
                    All Subjects
                </option>
            `;
        }

        if (subjectSelect) {
            subjectSelect.innerHTML = defaultHTML;
        }

        if (editorSubject) {
            editorSubject.innerHTML = defaultHTML;
        }

        let optionsHTML = "";

        subjects.forEach(sub => {

            optionsHTML += `
                <option value="${sub._id}">
                    ${escapeHTML(sub.name)}
                </option>
            `;
        });

        if (filterSelect) {
            filterSelect.innerHTML += optionsHTML;
        }

        if (subjectSelect) {
            subjectSelect.innerHTML += optionsHTML;
        }

        if (editorSubject) {
            editorSubject.innerHTML += optionsHTML;
        }

    } catch (err) {

        console.error(err);

        alert("Failed to load subjects ❌");
    }
}


// =========================
// LOAD POSTS
// =========================
async function loadPosts() {

    try {

        if (elements.postsList) {

            elements.postsList.innerHTML =
                `<div class="empty-posts">Loading...</div>`;
        }

        const subjectId =
            document.getElementById("filterSubject")
                ?.value || "";

        const visibility =
            document.getElementById("filterVisibility")
                ?.value || "";

        const search =
            document.getElementById("searchPost")
                ?.value.trim() || "";

        const query =
            new URLSearchParams({
                subjectId,
                visibility,
                search
            });

        const posts =
            await api(
                `/api/admin/posts?${query.toString()}`
            );

        if (!elements.postsList) return;

        if (!Array.isArray(posts) || !posts.length) {

            elements.postsList.innerHTML = `
                <div class="empty-posts">
                    No posts found.
                </div>
            `;

            return;
        }

        const html = posts.map(post => {

            const isPublic =
                post.visibility === "public";

            return `
                <div class="post-card">

                    <div class="post-top">

                        <div class="post-info">

                            <div class="post-title">
                                ${escapeHTML(
                                    post.title || "Untitled"
                                )}
                            </div>

                            <div class="post-subject">
                                📘 ${escapeHTML(
                                    post.subjectId?.name || "Unknown"
                                )}
                            </div>

                            <div class="post-date">
                                Updated:
                                ${new Date(
                                    post.updatedAt || Date.now()
                                ).toLocaleString()}
                            </div>

                        </div>

                        <span class="badge ${isPublic ? "published" : "draft"}">
                            ${isPublic ? "Published" : "Draft"}
                        </span>

                    </div>

                    <div class="post-actions">

                        <button
                            class="edit-btn"
                            onclick="editPost('${post._id}')"
                        >
                            ✏️ Edit
                        </button>

                        <button
                            class="delete-btn"
                            onclick="deletePost('${post._id}')"
                        >
                            🗑 Delete
                        </button>

                    </div>

                </div>
            `;
        }).join("");

        elements.postsList.innerHTML = html;

    } catch (err) {

        console.error(err);

        if (elements.postsList) {

            elements.postsList.innerHTML = `
                <div class="empty-posts">
                    Failed to load posts ❌
                </div>
            `;
        }
    }
}


// =========================
// EDIT POST
// =========================
function editPost(id) {

    if (elements.topicId) {
        elements.topicId.value = id;
    }

    showSection("block");

    loadPreview(id);
}


// =========================
// DELETE POST
// =========================
async function deletePost(id) {

    if (!confirm("Delete this post?")) return;

    try {

        await api(`/api/admin/topic/${id}`, {
            method: "DELETE"
        });

        await Promise.all([
            loadPosts(),
            loadStats(),
            loadSubjects()
        ]);

    } catch (err) {

        console.error(err);

        alert(err.message);
    }
}


// =========================
// LOAD SUBJECTS
// =========================
async function loadSubjects() {

    try {

        if (elements.subjectList) {

            elements.subjectList.innerHTML =
                `<div class="empty-posts">Loading...</div>`;
        }

        const subjects =
            await api("/api/admin/subjects");

        if (!elements.subjectList) return;

        if (!Array.isArray(subjects) || !subjects.length) {

            elements.subjectList.innerHTML = `
                <div class="empty-posts">
                    No subjects found.
                </div>
            `;

            return;
        }

        const html = subjects.map(sub => `

            <div class="subject-node">

                <div
                    class="subject-header"
                    onclick="toggleTopics('${sub._id}')">

                    📘 ${escapeHTML(sub.name)}

                </div>

                <div
                    id="topics-${sub._id}"
                    class="topic-container hidden">
                </div>

            </div>

        `).join("");

        elements.subjectList.innerHTML = html;

    } catch (err) {

        console.error(err);

        if (elements.subjectList) {

            elements.subjectList.innerHTML = `
                <div class="empty-posts">
                    Failed to load subjects ❌
                </div>
            `;
        }
    }
}


// =========================
// TOGGLE TOPICS
// =========================
async function toggleTopics(subjectId) {

    const container =
        document.getElementById(`topics-${subjectId}`);

    if (!container) return;

    if (!container.classList.contains("hidden")) {

        container.classList.add("hidden");
        container.innerHTML = "";

        return;
    }

    try {

        container.innerHTML =
            `<div class="empty-posts">Loading...</div>`;

        const topics =
            await api(
                `/api/admin/topics/${subjectId}`
            );

        const html = topics.map(topic => `

            <div
                class="topic-node"
                onclick="selectTopic('${topic._id}')">

                ${topic.visibility === "public" ? "🟢" : "🟡"}

                📖 ${escapeHTML(topic.title)}

            </div>

        `).join("");

        container.innerHTML = html;

        container.classList.remove("hidden");

    } catch (err) {

        console.error(err);

        container.innerHTML = `
            <div class="empty-posts">
                Failed to load topics ❌
            </div>
        `;

        container.classList.remove("hidden");
    }
}


// =========================
// CREATE TOPIC
// =========================
async function addTopic() {

    const title =
        document.getElementById("topicTitle")
            ?.value.trim();

    const subjectId =
        document.getElementById("subjectId")
            ?.value;

    const language =
        document.getElementById("topicLang")
            ?.value || "en";

    if (!title || !subjectId) {

        alert("Title & Subject required ❌");

        return;
    }

    try {

        const topic =
            await api("/api/admin/topic", {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded"
                },

                body: new URLSearchParams({
                    title,
                    subjectId,
                    language
                })
            });

        alert("Topic Created ✔");

        document.getElementById("topicTitle").value = "";

        await Promise.all([
            loadSubjects(),
            loadPosts(),
            loadStats()
        ]);

        if (topic?._id) {

            selectTopic(topic._id);
        }

    } catch (err) {

        console.error(err);

        alert(err.message);
    }
}


// =========================
// SELECT TOPIC
// =========================
function selectTopic(id) {

    if (elements.topicId) {
        elements.topicId.value = id;
    }

    showSection("block");

    loadPreview(id);
}


// =========================
// LOAD PREVIEW
// =========================
async function loadPreview(topicId) {

    try {

        const topic =
            await api(
                `/api/admin/topic/${topicId}`
            );

        if (!topic || !topic._id) {

            throw new Error("Invalid topic");
        }

        if (elements.topicId) {
            elements.topicId.value = topic._id;
        }

        if (elements.editorTitle) {

            elements.editorTitle.value =
                topic.title || "";
        }

        if (
            elements.editorSubject &&
            topic.subjectId?._id
        ) {

            elements.editorSubject.value =
                topic.subjectId._id;
        }

        await loadTopicsForEditor(
            topic.subjectId?._id
        );

        if (elements.editorTopic) {

            elements.editorTopic.value =
                topic._id;
        }

        if (quill) {

            quill.root.innerHTML =
                topic.contentHTML || "";
        }

        if (elements.previewBox) {

            elements.previewBox.innerHTML =
                renderHTML(
                    topic.contentHTML || ""
                );
        }

        if (
            elements.statusBadge &&
            elements.publishBtn
        ) {

            if (topic.visibility === "public") {

                elements.statusBadge.innerText =
                    "Published";

                elements.statusBadge.className =
                    "badge published";

                elements.publishBtn.innerText =
                    "🔒 Unpublish";

                elements.publishBtn.dataset.mode =
                    "unpublish";

            } else {

                elements.statusBadge.innerText =
                    "Draft";

                elements.statusBadge.className =
                    "badge draft";

                elements.publishBtn.innerText =
                    "🚀 Publish";

                elements.publishBtn.dataset.mode =
                    "publish";
            }
        }

        showSection("block");

    } catch (err) {

        console.error(err);

        alert(err.message);
    }
}


// =========================
// LOAD TOPICS FOR EDITOR
// =========================
async function loadTopicsForEditor(
    selectedSubjectId = null
) {

    const subjectId =
        selectedSubjectId ||
        elements.editorSubject?.value;

    if (!elements.editorTopic) return;

    elements.editorTopic.innerHTML = `
        <option value="">
            Select Article
        </option>
    `;

    if (!subjectId) return;

    try {

        const topics =
            await api(
                `/api/admin/topics/${subjectId}`
            );

        let html = "";

        topics.forEach(topic => {

            html += `
                <option value="${topic._id}">
                    ${escapeHTML(topic.title)}
                </option>
            `;
        });

        elements.editorTopic.innerHTML += html;

    } catch (err) {

        console.error(err);

        alert(err.message);
    }
}


// =========================
// OPEN SELECTED TOPIC
// =========================
function openSelectedTopic() {

    const topicId =
        elements.editorTopic?.value;

    if (!topicId) return;

    loadPreview(topicId);
}


// =========================
// AUTO SAVE
// =========================
function setupAutoSave() {

    if (!quill) return;

    quill.on("text-change", () => {

        clearTimeout(saveTimer);

        if (elements.saveStatus) {
            elements.saveStatus.innerText = "Saving...";
        }

        saveTimer =
            setTimeout(
                autoSaveDraft,
                AUTO_SAVE_DELAY
            );
    });

    if (elements.editorTitle) {

        elements.editorTitle.addEventListener(
            "input",
            () => {

                clearTimeout(saveTimer);

                if (elements.saveStatus) {

                    elements.saveStatus.innerText =
                        "Saving...";
                }

                saveTimer =
                    setTimeout(
                        autoSaveDraft,
                        AUTO_SAVE_DELAY
                    );
            }
        );
    }
}


// =========================
// SAVE DRAFT
// =========================
async function autoSaveDraft() {

    const topicId =
        elements.topicId?.value;

    if (!topicId || !quill) return;

    const contentHTML =
        quill.root.innerHTML;

    const title =
        elements.editorTitle?.value.trim()
        || "Untitled";

    try {

        await api(
            `/api/admin/topic/${topicId}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    title,
                    contentHTML
                })
            }
        );

        if (elements.previewBox) {

            elements.previewBox.innerHTML =
                renderHTML(contentHTML);
        }

        if (elements.saveStatus) {

            elements.saveStatus.innerText =
                `Saved ✔ ${new Date()
                    .toLocaleTimeString()}`;
        }

        loadPosts().catch(console.error);

    } catch (err) {

        console.error(err);

        if (elements.saveStatus) {

            elements.saveStatus.innerText =
                "Save failed ❌";
        }
    }
}


// =========================
// TOGGLE PUBLISH
// =========================
async function togglePublish() {

    const topicId =
        elements.topicId?.value;

    if (!topicId) {

        alert("No topic selected ❌");

        return;
    }

    try {

        const isPublish =
            elements.publishBtn?.dataset.mode
                === "publish";

        const endpoint =
            isPublish
                ? `/api/admin/topic/publish/${topicId}`
                : `/api/admin/topic/unpublish/${topicId}`;

        await api(endpoint, {
            method: "POST"
        });

        await Promise.all([
            loadPreview(topicId),
            loadPosts(),
            loadSubjects()
        ]);

    } catch (err) {

        console.error(err);

        alert(err.message);
    }
}


// =========================
// DASHBOARD
// =========================
async function loadStats() {

    try {

        const data =
            await api("/api/admin/stats");

        if (!elements.statsBox) return;

        elements.statsBox.innerHTML = `
            <div class="stats-grid">

                <div class="stat-card">
                    <div class="icon">📘</div>
                    <h3>Subjects</h3>
                    <h1 id="subjectsCount">0</h1>
                </div>

                <div class="stat-card">
                    <div class="icon">📖</div>
                    <h3>Topics</h3>
                    <h1 id="topicsCount">0</h1>
                </div>

            </div>
        `;

        animateCount(
            "subjectsCount",
            data.subjects || 0
        );

        animateCount(
            "topicsCount",
            data.topics || 0
        );

    } catch (err) {

        console.error(err);
    }
}


function animateCount(id, target) {

    let current = 0;

    const step =
        Math.max(1, Math.ceil(target / 40));

    const interval =
        setInterval(() => {

            current += step;

            if (current >= target) {

                current = target;

                clearInterval(interval);
            }

            document.getElementById(id)
                .innerText = current;

        }, 20);
}


// =========================
// SIDEBAR
// =========================
function toggleSidebar() {

    document.querySelector(".sidebar")
        ?.classList.toggle("active");

    document.querySelector(".overlay")
        ?.classList.toggle("show");
}


function closeSidebar() {

    document.querySelector(".sidebar")
        ?.classList.remove("active");

    document.querySelector(".overlay")
        ?.classList.remove("show");
}


// =========================
// SIDEBAR ACTIVE
// =========================
function initSidebarActiveState() {

    document.querySelectorAll(".sidebar button")
        .forEach(btn => {

            btn.addEventListener("click", () => {

                document.querySelectorAll(
                    ".sidebar button"
                ).forEach(b =>
                    b.classList.remove("active")
                );

                btn.classList.add("active");
            });
        });
}


// =========================
// LOGOUT
// =========================
function logout() {

    window.location.href = "/logout";
}


// =========================
// WINDOW INIT
// =========================
window.onload = async () => {

    try {

        initElements();

        if (typeof Quill === "undefined") {

            throw new Error("Quill not loaded");
        }

        if (
            typeof ImageUploader !== "undefined"
        ) {

            Quill.register(
                "modules/imageUploader",
                ImageUploader
            );
        }

        quill = new Quill("#editor", {

            theme: "snow",

            placeholder:
                "Write your article content here...",

            modules: {

                toolbar: [

                    [{ font: [] }],

                    [{
                        size: [
                            "small",
                            false,
                            "large",
                            "huge"
                        ]
                    }],

                    [{
                        header: [
                            1,
                            2,
                            3,
                            4,
                            5,
                            6,
                            false
                        ]
                    }],

                    [
                        "bold",
                        "italic",
                        "underline",
                        "strike"
                    ],

                    [
                        { color: [] },
                        { background: [] }
                    ],

                    [
                        { script: "sub" },
                        { script: "super" }
                    ],

                    [
                        { list: "ordered" },
                        { list: "bullet" }
                    ],

                    [
                        { indent: "-1" },
                        { indent: "+1" }
                    ],

                    [{ direction: "rtl" }],

                    [{ align: [] }],

                    [
                        "blockquote",
                        "code-block"
                    ],

                    [
                        "link",
                        "image",
                        "video",
                        "formula"
                    ],

                    ["clean"]
                ],

                ...(typeof ImageUploader !== "undefined" && {

                    imageUploader: {

                        upload: async file => {

                            try {

                                const formData =
                                    new FormData();

                                formData.append(
                                    "image",
                                    file
                                );

                                const data =
                                    await api(
                                        "/api/upload",
                                        {
                                            method: "POST",
                                            body: formData
                                        }
                                    );

                                if (!data?.url) {

                                    throw new Error(
                                        "Invalid image URL"
                                    );
                                }

                                return data.url;

                            } catch (err) {

                                console.error(err);

                                alert(
                                    "Image upload failed ❌"
                                );

                                return "";
                            }
                        }
                    }
                })
            }
        });

        showSection("subject");

        closeSidebar();

        await Promise.all([
            loadSubjectFilter(),
            loadPosts(),
            loadSubjects(),
            loadStats()
        ]);

        initSidebarActiveState();

        setupAutoSave();

        console.log(
            "Admin panel loaded successfully ✔"
        );

    } catch (err) {

        console.error(err);

        alert(
            "Application failed to load ❌"
        );
    }
};