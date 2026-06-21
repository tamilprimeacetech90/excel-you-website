// =========================
// EXCEL YOU
// NEW STUDENT SIGNUP
// newstudentsignupform.js
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

const avatarPreview =
    document.getElementById(
        "avatarPreview"
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

    // LOGO SWITCH

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
// HOLOGRAPHIC SCHOLAR PREVIEW
// =========================

if(avatarPreview){

    const avatars = [

        "/assets/avatars/male-beginner.png",

        "/assets/avatars/female-beginner.png"

    ];

    let currentAvatar = 0;

    setInterval(() => {

        currentAvatar =

            (currentAvatar + 1)

            % avatars.length;

        avatarPreview.src =

            avatars[currentAvatar];

    }, 4000);

}

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

            const confirmPassword =

                document.getElementById(
                    "confirmPassword"
                ).value.trim();

         

            // =====================
            // VALIDATION
            // =====================

            if(

                !username ||
                !email ||
                !password ||
                !confirmPassword

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

            if(password !== confirmPassword){

                alert(
                    "Passwords do not match."
                );

                return;

            }


            // =====================
            // BUTTON LOADING
            // =====================

            const submitBtn =

                signupForm.querySelector(
                    ".signup-btn"
                );

            submitBtn.disabled = true;

            submitBtn.innerHTML =

                "⏳ Creating Account...";


            try{

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
                                 gender: null
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

                    window.location.href =

                        "/student-login.html";

                }


                // =====================
                // FAILED
                // =====================

                else{

                    alert(

                        data.message ||

                        "Signup failed."

                    );

                }

            }

            catch(err){

                console.error(

                    "SIGNUP ERROR:",

                    err

                );

                alert(

                    "Server Error. Please try again."

                );

            }


            // =====================
            // RESET BUTTON
            // =====================

            submitBtn.disabled = false;

            submitBtn.innerHTML =

                "🚀 Create Account";

        }
    );

}
//======================
// GOOGLE LOGIN
//======================

