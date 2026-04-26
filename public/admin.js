// =========================
// SECTION NAVIGATION
// =========================

function showSection(section) {
    const sections = [
        "dashboard",
        "subject",
        "topic",
        "block"
    ];

    sections.forEach(sec => {
        const el = document.getElementById(sec + "Section");
        if (el) el.classList.add("hidden");
    });

    const active = document.getElementById(section + "Section");
    if (active) active.classList.remove("hidden");
}


// =========================
// SAFE HTML (XSS PROTECTION)
// =========================
function escapeHTML(str = "") {
    return str.replace(/[&<>"']/g, m => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[m]));
}


// =========================
// SUBJECT
// =========================

async function addSubject() {
    const name = document.getElementById("subjectName").value;
    const description = document.getElementById("subjectDesc").value;
    const language = document.getElementById("subjectLang").value;

    await fetch("/api/admin/subject", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            name,
            description,
            language
        })
    });

    alert("Subject Created ✔");
    loadSubjects();
}

function selectSubject(id, name) {
    document.getElementById("subjectId").value = id;
    showSection("topic");
    alert("Selected Subject: " + name);
}


// =========================
// LMS TREE (SUBJECTS)
// =========================

async function loadSubjects() {
    const res = await fetch("/api/admin/subjects");
    const subjects = await res.json();

    const container = document.getElementById("subjectList");
    if (!container) return;

    container.innerHTML = "";

    subjects.forEach(sub => {
        container.innerHTML += `
            <div class="subject-node">
                <div class="subject-header"
                    onclick="toggleTopics('${sub._id}', ${JSON.stringify(sub.name)})">
                    📘 ${sub.name}
                </div>

                <div id="topics-${sub._id}" class="topic-container hidden"></div>
            </div>
        `;
    });
}


// =========================
// LOAD TOPICS UNDER SUBJECT
// =========================

async function toggleTopics(subjectId) {
    const container = document.getElementById(`topics-${subjectId}`);

    if (!container) return;

    if (!container.classList.contains("hidden")) {
        container.classList.add("hidden");
        container.innerHTML = "";
        return;
    }

    const res = await fetch(`/api/admin/topics/${subjectId}`);
    const topics = await res.json();

    container.innerHTML = "";

    topics.forEach(topic => {
        container.innerHTML += `
            <div class="topic-node"
                onclick="selectTopic('${topic._id}', ${JSON.stringify(topic.title)})">
                📖 ${topic.title}
            </div>
        `;
    });

    container.classList.remove("hidden");
}


// =========================
// TOPIC
// =========================

async function addTopic() {
    const title = document.getElementById("topicTitle").value;
    const subjectId = document.getElementById("subjectId").value;
    const language = document.getElementById("topicLang").value;

    await fetch("/api/admin/topic", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            title,
            subjectId,
            language
        })
    });

    alert("Topic Created ✔");
    loadSubjects();
}

function selectTopic(id, title) {
    document.getElementById("topicId").value = id;
    showSection("block");
    loadPreview(id);
}


// =========================
// PREVIEW (STUDENT VIEW)
// =========================

async function loadPreview(topicId) {
    const res = await fetch(`/api/topic/${topicId}`);
    const topic = await res.json();

    const box = document.getElementById("previewBox");
    if (!box) return;

    box.innerHTML = `<h2>${escapeHTML(topic.title)}</h2>`;

    (topic.contentBlocks || []).forEach(block => {
        if (block.type === "text") {
            box.innerHTML += `<p>${escapeHTML(block.value)}</p>`;
        }

        if (block.type === "heading") {
            box.innerHTML += `<h3>${escapeHTML(block.value)}</h3>`;
        }

        if (block.type === "image") {
            box.innerHTML += `<img src="${block.value}" style="max-width:100%">`;
        }

        if (block.type === "video") {
            box.innerHTML += `
                <iframe width="100%" height="300"
                src="${block.value}" frameborder="0" allowfullscreen></iframe>
            `;
        }
    });
}


// =========================
// BLOCKS
// =========================

async function addBlock() {
    const topicId = document.getElementById("topicId").value;
    const type = document.getElementById("blockType").value;
    const value = document.getElementById("blockValue").value;

    await fetch(`/api/admin/topic/${topicId}/block`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            type,
            value
        })
    });

    alert("Block Added ✔");
    loadPreview(topicId);
}

async function loadStats() {
    const res = await fetch("/api/admin/stats");
    const data = await res.json();

    document.getElementById("statsBox").innerHTML = `
        <h3>📊 Dashboard</h3>
        <p>Subjects: ${data.subjects}</p>
        <p>Topics: ${data.topics}</p>
    `;
}
// =========================
// LOGOUT
// =========================

function logout() {
    window.location.href = "/logout";
}


// =========================
// INIT
// =========================

showSection("subject");
loadSubjects();
loadStats();