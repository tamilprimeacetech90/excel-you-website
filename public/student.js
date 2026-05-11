// =========================
// GLOBAL
// =========================
let allSubjects = [];
let allTopics = [];
let activeSubjectId = null;


// =========================
// SAFE HTML
// =========================
function escapeHTML(str = "") {

    return str.replace(/[&<>"']/g, match => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[match]));
}


// =========================
// SHOW LOADER
// =========================
function showLoading(containerId) {

    const container =
        document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = `

        <div class="loading-box">

            <div class="loader"></div>

            <p>
                Loading...
            </p>

        </div>

    `;
}


// =========================
// LOAD SUBJECTS
// =========================
async function loadSubjects() {

    try {

        showLoading("subjectContainer");

        const lang =
            document.getElementById("lang").value;

        const res =
            await fetch("/api/subjects");

        const data =
            await res.json();

        // FILTER LANGUAGE
        allSubjects = data.filter(subject =>
            subject.language === lang
        );

        renderSubjects(allSubjects);

        // RESET UI
        document
            .getElementById("welcomeBox")
            ?.classList.remove("hidden");

        document
            .getElementById("topicContainer")
            ?.classList.add("hidden");

        document
            .getElementById("lessonViewer")
            ?.classList.add("hidden");

    } catch (err) {

        console.error(
            "LOAD SUBJECTS ERROR:",
            err
        );

    }
}


// =========================
// RENDER SUBJECTS
// =========================
function renderSubjects(subjects) {

    const container =
        document.getElementById(
            "subjectContainer"
        );

    if (!container) return;

    container.innerHTML = "";

    if (!subjects.length) {

        container.innerHTML = `

            <div class="empty-box">

                No subjects found.

            </div>

        `;

        return;
    }

    subjects.forEach(subject => {

        const activeClass =
            activeSubjectId === subject._id
            ? "active-subject"
            : "";

        container.innerHTML += `

            <div
                class="subject-card ${activeClass}"
                onclick="openSubject(
                    '${subject._id}',
                    '${escapeHTML(subject.name)}'
                )"
            >

                <h3>
                    📘 ${escapeHTML(subject.name)}
                </h3>

                <p>
                    ${escapeHTML(
                        subject.description ||
                        "No description available"
                    )}
                </p>

            </div>

        `;
    });
}


// =========================
// OPEN SUBJECT
// =========================
async function openSubject(id, name) {

    try {

        activeSubjectId = id;

        renderSubjects(allSubjects);

        const topicContainer =
            document.getElementById(
                "topicContainer"
            );

        showLoading("topicContainer");

        // HIDE OTHER AREAS
        document
            .getElementById("welcomeBox")
            ?.classList.add("hidden");

        document
            .getElementById("lessonViewer")
            ?.classList.add("hidden");

        topicContainer.classList.remove("hidden");

        const res =
            await fetch(`/api/topics/${id}`);

        const topics =
            await res.json();

        allTopics = topics;

        topicContainer.innerHTML = `

            <div class="topic-header">

                <h2>
                    📖 ${escapeHTML(name)}
                </h2>

                <p>
                    ${topics.length}
                    Topics Available
                </p>

            </div>

        `;

        if (!topics.length) {

            topicContainer.innerHTML += `

                <div class="empty-box">

                    No topics available.

                </div>

            `;

            return;
        }

        topics.forEach(topic => {

            topicContainer.innerHTML += `

                <div
                    class="topic-card"
                    onclick="openTopic(
                        '${topic._id}'
                    )"
                >

                    <h3>
                        ${escapeHTML(topic.title)}
                    </h3>

                </div>

            `;
        });

    } catch (err) {

        console.error(
            "OPEN SUBJECT ERROR:",
            err
        );

    }
}


// =========================
// OPEN TOPIC
// =========================
async function openTopic(id) {

    try {

        const res =
            await fetch(`/api/topic/${id}`);

        const topic =
            await res.json();

        if (!topic) return;

        // HIDE TOPICS
        document
            .getElementById("topicContainer")
            ?.classList.add("hidden");

        // SHOW LESSON
        const lessonViewer =
            document.getElementById(
                "lessonViewer"
            );

        lessonViewer.classList.remove("hidden");

        // TITLE
        document.getElementById(
            "lessonTitle"
        ).innerText = topic.title;

        // CONTENT
        const content =
            document.getElementById(
                "lessonContent"
            );

        content.innerHTML = "";

        // =========================
        // HTML CONTENT SUPPORT
        // =========================
        if (topic.contentHTML) {

            content.innerHTML =
                topic.contentHTML;

            return;
        }

        // =========================
        // BLOCK CONTENT SUPPORT
        // =========================
        if (topic.contentBlocks?.length) {

            topic.contentBlocks.forEach(block => {

                // TEXT
                if (block.type === "text") {

                    content.innerHTML += `

                        <p>
                            ${block.value}
                        </p>

                    `;
                }

                // HEADING
                if (block.type === "heading") {

                    content.innerHTML += `

                        <h2>
                            ${block.value}
                        </h2>

                    `;
                }

                // IMAGE
                if (block.type === "image") {

                    content.innerHTML += `

                        <img
                            src="${block.value}"
                            class="lesson-image"
                        >

                    `;
                }

                // VIDEO
                if (block.type === "video") {

                    content.innerHTML += `

                        <iframe
                            class="lesson-video"
                            src="${block.value}"
                            frameborder="0"
                            allowfullscreen
                        ></iframe>

                    `;
                }

            });
        }

    } catch (err) {

        console.error(
            "OPEN TOPIC ERROR:",
            err
        );

    }
}


// =========================
// SEARCH SUBJECTS
// =========================
function searchSubjects() {

    const value =
        document.getElementById("search")
            .value
            .toLowerCase();

    const filtered =
        allSubjects.filter(subject =>

            subject.name
                .toLowerCase()
                .includes(value)
        );

    renderSubjects(filtered);
}


// =========================
// INITIAL LOAD
// =========================
window.onload = () => {

    loadSubjects();

};