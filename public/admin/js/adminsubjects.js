// =========================================================
// EXCEL YOU - ADMIN SUBJECTS
// =========================================================

// =========================================================
// ELEMENTS
// =========================================================

const body = document.body;

const sidebar =
    document.getElementById("sidebar");

const overlay =
    document.getElementById("overlay");

const mobileToggle =
    document.getElementById("mobileToggle");

const themeToggle =
    document.getElementById("themeToggle");

const subjectForm =
    document.getElementById("subjectForm");

const subjectName =
    document.getElementById("subjectName");

const subjectSlug =
    document.getElementById("subjectSlug");


// =========================================================
// MOBILE SIDEBAR
// =========================================================

function openSidebar(){

    sidebar.classList.add("active");

    overlay.classList.add("show");
}

function closeSidebar(){

    sidebar.classList.remove("active");

    overlay.classList.remove("show");
}

mobileToggle?.addEventListener(

    "click",

    () => {

        if(
            sidebar.classList.contains("active")
        ){

            closeSidebar();

        }else{

            openSidebar();
        }
    }
);

overlay?.addEventListener(

    "click",

    closeSidebar
);


// =========================================================
// THEME TOGGLE
// =========================================================

function loadTheme(){

    const savedTheme =
        localStorage.getItem("adminTheme");

    if(savedTheme === "dark"){

        body.classList.add("dark-theme");

        themeToggle.innerHTML =
            "☀️ Light";
    }
}

function toggleTheme(){

    body.classList.toggle("dark-theme");

    const isDark =
        body.classList.contains("dark-theme");

    localStorage.setItem(

        "adminTheme",

        isDark ? "dark" : "light"
    );

    themeToggle.innerHTML =
        isDark
            ? "☀️ Light"
            : "🌙 Dark";
}

themeToggle?.addEventListener(

    "click",

    toggleTheme
);


// =========================================================
// AUTO SLUG GENERATOR
// =========================================================

subjectName?.addEventListener(

    "input",

    () => {

        const slug =

            subjectName.value

            .toLowerCase()

            .trim()

            .replace(/\s+/g, "-")

            .replace(/[^\w\-]+/g, "");

        subjectSlug.value = slug;
    }
);


// =========================================================
// CREATE SUBJECT
// =========================================================

subjectForm?.addEventListener(

    "submit",

    async (e) => {

        e.preventDefault();

        const data = {

            name:
                subjectName.value.trim(),

            slug:
                subjectSlug.value.trim()
        };

        try{

            const response = await fetch(

                "/api/admin/subjects/create",

                {

                    method:"POST",

                    headers:{
                        "Content-Type":
                        "application/json"
                    },

                    body:
                        JSON.stringify(data)
                }
            );

            const result =
                await response.json();

            if(response.ok){

                alert(
                    "✅ Subject Created Successfully"
                );

                subjectForm.reset();

                window.location.reload();

            }else{

                alert(
                    result.message ||
                    "❌ Failed to create subject"
                );
            }

        }catch(error){

            console.error(error);

            alert(
                "❌ Server Error"
            );
        }
    }
);


// =========================================================
// INIT
// =========================================================

document.addEventListener(

    "DOMContentLoaded",

    () => {

        loadTheme();

        console.log(
            "✅ Admin Subjects Loaded"
        );
    }
);
```
