// =========================
// EXCEL YOU
// STUDENT SIGNUP
// studentsignup.js
// =========================


// =========================
// ELEMENTS
// =========================

const body =
    document.body;

const themeBtn =
    document.getElementById(
        "themeBtn"
    );

const siteLogo =
    document.getElementById(
        "siteLogo"
    );

const signupForm =
    document.getElementById(
        "signupForm"
    );


// =========================
// THEME SYSTEM
// =========================

function applyTheme(theme){

    body.setAttribute(
        "data-theme",
        theme
    );

    // BUTTON ICON

    if(themeBtn){

        themeBtn.innerHTML =

            theme === "dark"

            ? "☀️"

            : "🌙";

    }

    // LOGO CHANGE

    if(siteLogo){

        siteLogo.src =

            theme === "dark"

            ? "/assets/logo/full-logo-white.png"

            : "/assets/logo/full-logo.png";

    }

}


// =========================
// LOAD SAVED THEME
// =========================

const savedTheme =

    localStorage.getItem(
        "theme"
    ) || "dark";

applyTheme(savedTheme);


// =========================
// THEME TOGGLE
// =========================

if(themeBtn){

    themeBtn.addEventListener(
        "click",
        () => {

            const currentTheme =

                body.getAttribute(
                    "data-theme"
                );

            const nextTheme =

                currentTheme === "dark"

                ? "light"

                : "dark";

            applyTheme(
                nextTheme
            );

            localStorage.setItem(
                "theme",
                nextTheme
            );

        }
    );

}

// =========================
// avatar preview
// =========================

const avatarPreview =
    document.getElementById(
        "avatarPreview"
    );

document
    .querySelectorAll(
        'input[name="gender"]'
    )
    .forEach(radio => {

        radio.addEventListener(
            "change",
            () => {

                avatarPreview.src =

                    radio.value === "female"

                    ? "/assets/avatars/female-beginner.png"

                    : "/assets/avatars/male-beginner.png";

            }
        );

    });

// =========================
// SIGNUP FORM
// =========================

if(signupForm){

    signupForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();

            // =====================
            // GET VALUES
            // =====================

            const username =
                document.getElementById(
                    "username"
                ).value.trim();

            const email =
                document.getElementById(
                    "email"
                ).value.trim();

            const password =
                document.getElementById(
                    "password"
                ).value.trim();

            const gender =
                document.querySelector(
                    'input[name="gender"]:checked'
                )?.value || "male";

            const learningPath =
                document.getElementById(
                    "learningPath"
                ).value;

            // =====================
            // VALIDATION
            // =====================

            if(

                !username ||
                !email ||
                !password

            ){

                alert(
                    "Please fill all fields."
                );

                return;

            }

            if(password.length < 6){

                alert(
                    "Password must be at least 6 characters."
                );

                return;

            }

            // =====================
            // BUTTON LOADING
            // =====================

            const submitBtn =
                signupForm.querySelector(
                    "button"
                );

            submitBtn.disabled = true;

            submitBtn.innerHTML =
                "Creating Account...";

            try {

                // =====================
                // API REQUEST
                // =====================

                const response =
                    await fetch(
                        "/api/student/signup",
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body: JSON.stringify({

                                username,
                                email,
                                password,
                                gender,
                                learningPath

                            })

                        }
                    );

                const data =
                    await response.json();

                // =====================
                // SUCCESS
                // =====================

                if(response.ok){

                    alert(
                        "✅ Account Created Successfully"
                    );

                    // REDIRECT

                    window.location.href =
                        "/student-login.html";

                }

                // =====================
                // FAILED
                // =====================

                else {

                    alert(
                        data.message ||
                        "Signup failed"
                    );

                }

            } catch(err){

                console.error(
                    "SIGNUP ERROR:",
                    err
                );

                alert(
                    "Server Error"
                );

            }

            // =====================
            // RESET BUTTON
            // =====================

            submitBtn.disabled = false;

            submitBtn.innerHTML =
                "Create Account";

        }
    );

}