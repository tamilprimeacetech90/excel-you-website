let allSubjects = [];
let allTopics = [];

async function loadSubjects() {
    const lang = document.getElementById("lang").value;

    const res = await fetch("/api/subjects");
    const data = await res.json();

    allSubjects = data.filter(s => s.language === lang);

    renderSubjects(allSubjects);
}

function renderSubjects(subjects) {
    const container = document.getElementById("subjectContainer");
    container.style.display = "block";
    document.getElementById("topicContainer").style.display = "none";

    container.innerHTML = "";

    subjects.forEach(sub => {
        container.innerHTML += `
            <div class="card" onclick="openSubject('${sub._id}', '${sub.name}')">
                <h2>${sub.name}</h2>
                <p>${sub.description || ""}</p>
            </div>
        `;
    });
}

async function openSubject(id, name) {
    const res = await fetch(`/api/topics/${id}`);
    const data = await res.json();

    allTopics = data;

    const container = document.getElementById("subjectContainer");
    const topicBox = document.getElementById("topicContainer");

    container.style.display = "none";
    topicBox.style.display = "block";

    topicBox.innerHTML = `<h2>📖 ${name}</h2>`;

    data.forEach(topic => {
        topicBox.innerHTML += `
            <div class="topic-card" onclick="openTopic('${topic._id}')">
                <h3>${topic.title}</h3>
            </div>
        `;
    });
}

async function openTopic(id) {
    const res = await fetch(`/api/topic/${id}`);
    const topic = await res.json();

    const container = document.getElementById("topicContainer");

    container.innerHTML = `<button onclick="loadSubjects()">⬅ Back</button><h2>${topic.title}</h2>`;

    topic.contentBlocks.forEach(block => {
        if (block.type === "text") {
            container.innerHTML += `<p>${block.value}</p>`;
        }

        if (block.type === "heading") {
            container.innerHTML += `<h3>${block.value}</h3>`;
        }

        if (block.type === "image") {
            container.innerHTML += `<img src="${block.value}" style="max-width:100%">`;
        }

        if (block.type === "video") {
            container.innerHTML += `
                <iframe width="100%" height="300"
                src="${block.value}"
                frameborder="0"
                allowfullscreen></iframe>
            `;
        }
    });
}

function searchSubjects() {
    const value = document.getElementById("search").value.toLowerCase();

    const filtered = allSubjects.filter(s =>
        s.name.toLowerCase().includes(value)
    );

    renderSubjects(filtered);
}

loadSubjects();