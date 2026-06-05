// =========================
// EXCEL YOU
// student.js
// SUBJECT HOME PAGE
// =========================


// =========================
// GLOBALS
// =========================

let allSubjects = [];


// =========================
// ELEMENTS
// =========================

const subjectContainer =
    document.getElementById(
        "subjectContainer"
    );

const searchInput =
    document.getElementById(
        "search"
    );

const subjectSelect =
    document.getElementById(
        "subjectSelect"
    );

const themeBtn =
    document.getElementById(
        "themeBtn"
    );


// =========================
// LOAD SUBJECTS
// =========================

async function loadSubjects(){

    try {

        // FETCH

        const response =
            await fetch(
                "/api/subjects"
            );

        const data =
            await response.json();

        // SAVE

        allSubjects = data;

        // RENDER

        renderSubjects(
            allSubjects
        );

        // SELECT

        populateSubjectSelect(
            allSubjects
        );

    } catch(error){

        console.error(
            "❌ SUBJECT LOAD ERROR:",
            error
        );

        subjectContainer.innerHTML = `

            <div class="empty-box">

                Failed to load subjects

            </div>

        `;

    }

}


// =========================
// RENDER SUBJECTS
// =========================

function renderSubjects(subjects){

    // RESET

    subjectContainer.innerHTML = "";

    // EMPTY

    if(!subjects.length){

        subjectContainer.innerHTML = `

            <div class="empty-box">

                No subjects found

            </div>

        `;

        return;

    }

    // LOOP

    subjects.forEach(subject => {

        // TILE

        const tile =
            document.createElement(
                "div"
            );

        tile.className =
            "subject-tile";

        
// SUBJECT IMAGES
const image =

    subject.image ||

    "/assets/subjects/DATAMINING.png";

        // HTML

        tile.innerHTML = `

            <!-- IMAGE -->

            <div class="subject-image-wrap">

                <img
                    src="${image}"
                    alt="${subject.name}"
                    class="subject-image"
                >

                <!-- INFO -->

                <button
                    class="info-btn"
                >
                    ⓘ
                </button>

            </div>

            <!-- BOTTOM -->

            <div class="subject-bottom">

                <h3>

                    ${subject.name}

                </h3>

            </div>

            <!-- INFO POPUP -->

            <div class="subject-info">

                <h4>

                    ${subject.name}

                </h4>

                <p>

                    ${
                        subject.description ||

                        "No description available."
                    }

                </p>

            </div>

        `;

        // SUBJECT OPEN

        tile.addEventListener(
            "click",
            (e) => {

                // IGNORE INFO BUTTON

                if(
                    e.target.classList.contains(
                        "info-btn"
                    )
                ){

                    return;

                }

                // CREATE SLUG

                const slug =

                    createSlug(
                        subject.name
                    );

                // REDIRECT

                window.location.href =

                    `/subject/${slug}`;

            }
        );

        // INFO BUTTON

        const infoBtn =
            tile.querySelector(
                ".info-btn"
            );

        const infoPopup =
            tile.querySelector(
                ".subject-info"
            );

        infoBtn.addEventListener(
            "click",
            (e) => {

                e.stopPropagation();

                // CLOSE OTHERS

                document
                    .querySelectorAll(
                        ".subject-info"
                    )
                    .forEach(popup => {

                        if(
                            popup !== infoPopup
                        ){

                            popup.classList.remove(
                                "active"
                            );

                        }

                    });

                // TOGGLE

                infoPopup.classList.toggle(
                    "active"
                );

            }
        );

        // APPEND

        subjectContainer.appendChild(
            tile
        );

    });

}


// =========================
// SUBJECT DROPDOWN
// =========================

function populateSubjectSelect(subjects){

    // RESET

    subjectSelect.innerHTML = `

        <option value="">
            All Subjects
        </option>

    `;

    // LOOP

    subjects.forEach(subject => {

        const option =
            document.createElement(
                "option"
            );

        option.value =
            subject.name;

        option.innerHTML =
            subject.name;

        subjectSelect.appendChild(
            option
        );

    });

}


// =========================
// SEARCH
// =========================

function searchSubjects(){

    // VALUES

    const searchValue =

        searchInput.value
            .toLowerCase()
            .trim();

    const selectedValue =

        subjectSelect.value
            .toLowerCase()
            .trim();

    // FILTER

    const filtered =

        allSubjects.filter(subject => {

            const name =

                subject.name
                    .toLowerCase();

            return (

                name.includes(
                    searchValue
                ) &&

                (
                    selectedValue === "" ||

                    name.includes(
                        selectedValue
                    )
                )

            );

        });

    // RENDER

    renderSubjects(filtered);

}


// =========================
// SLUG
// =========================

function createSlug(text){

    return text

        .toLowerCase()

        .replace(/[^a-z0-9]+/g, "-")

        .replace(/(^-|-$)/g, "");

}


// =========================
// THEME INIT
// =========================

function initTheme(){

    const savedTheme =

        localStorage.getItem(
            "theme"
        ) || "dark";

    document.body.setAttribute(
        "data-theme",
        savedTheme
    );

    updateThemeIcon();

}


// =========================
// UPDATE ICON
// =========================

function updateThemeIcon(){

    const currentTheme =

        document.body.getAttribute(
            "data-theme"
        );

    if(currentTheme === "dark"){

        themeBtn.innerHTML = "☀️";

    } else {

        themeBtn.innerHTML = "🌙";

    }

}


// =========================
// THEME TOGGLE
// =========================

themeBtn?.addEventListener(
    "click",
    () => {

        const currentTheme =

            document.body.getAttribute(
                "data-theme"
            );

        const newTheme =

            currentTheme === "dark"
                ? "light"
                : "dark";

        document.body.setAttribute(
            "data-theme",
            newTheme
        );

        localStorage.setItem(
            "theme",
            newTheme
        );

        updateThemeIcon();

    }
);


// =========================
// SEARCH EVENTS
// =========================

searchInput?.addEventListener(
    "keyup",
    searchSubjects
);

subjectSelect?.addEventListener(
    "change",
    searchSubjects
);




// =========================
// LOGIN STATUS UI
// =========================

function updateStudentNavbar(){

    const studentData =
        localStorage.getItem(
            "student"
        );

    if(!studentData){
        return;
    }

    const student =
        JSON.parse(studentData);

    const guestMenu =
        document.getElementById(
            "guestMenu"
        );

    const studentMenu =
        document.getElementById(
            "studentMenu"
        );

    const studentName =
        document.getElementById(
            "studentName"
        );

    const logoutBtn =
        document.getElementById(
            "logoutBtn"
        );

    if(guestMenu){
        guestMenu.style.display =
            "none";
    }

    if(studentMenu){
        studentMenu.style.display =
            "block";
    }

    if(studentName){
        studentName.textContent =
            student.name || "Student";
    }

    logoutBtn?.addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "student"
            );

            localStorage.removeItem(
                "studentLoggedIn"
            );

            window.location.href =
                "/student-login.html";
        }
    );

    const loginCard =
        document.querySelector(
            ".login-card"
        );

    if(loginCard){

        loginCard.innerHTML = `

            <div class="anime-box">
                ⚔️
            </div>

            <h3>
                Welcome Back,
                ${student.name || "Scholar"}
            </h3>

            <p>
                Continue your journey
                toward becoming a
                Celestial Immortal.
            </p>

            <div class="mini-benefits">

                <div class="mini-item">
                    ⚡ XP:
                    ${student.xp || 0}
                </div>

                <div class="mini-item">
                    👑 Rank:
                    ${student.rank || "Scholar"}
                </div>

                <div class="mini-item">
                    📈 Level:
                    ${student.level || 1}
                </div>

                <div class="mini-item">
                    🔥 Daily Streak:
                    ${student.streak || 0}
                </div>

            </div>

        `;
    }

    // =========================
    // DROPDOWN
    // =========================

    const dropdownBtn =
        document.getElementById(
            "studentDropdownBtn"
        );

    const dropdown =
        document.getElementById(
            "studentDropdown"
        );

    dropdownBtn?.addEventListener(
        "click",
        (e) => {

            e.stopPropagation();

            dropdown?.classList.toggle(
                "show"
            );
        }
    );

    document.addEventListener(
        "click",
        () => {

            dropdown?.classList.remove(
                "show"
            );
        }
    );

}
// =========================
// CLOSE INFO POPUPS
// =========================

document.addEventListener(
    "click",
    () => {

        document
            .querySelectorAll(
                ".subject-info"
            )
            .forEach(popup => {

                popup.classList.remove(
                    "active"
                );

            });

    }
);


// =========================
// INITIAL LOAD
// =========================

window.addEventListener(
    "load",
    () => {

        // SUBJECTS

        loadSubjects();

        // THEME

        initTheme();

        // LOGIN STATUS

        updateStudentNavbar();

    }
);