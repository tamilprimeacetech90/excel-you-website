// =========================
// EXCEL YOU
// STUDENT LOGIN JS
// =========================


// =========================
// ELEMENTS
// =========================

const loginForm =
    document.getElementById(
        "studentLoginForm"
    );

const loginBtn =
    document.getElementById(
        "loginBtn"
    );

const loginText =
    document.getElementById(
        "loginText"
    );

const loginLoader =
    document.getElementById(
        "loginLoader"
    );

const errorBox =
    document.getElementById(
        "errorBox"
    );


// =========================
// SHOW ERROR
// =========================

function showError(message){

    errorBox.innerText = message;

    errorBox.style.display = "block";

}


// =========================
// HIDE ERROR
// =========================

function hideError(){

    errorBox.style.display = "none";

}


// =========================
// BUTTON LOADING
// =========================

function setLoading(state){

    if(state){

        loginBtn.disabled = true;

        loginText.style.display =
            "none";

        loginLoader.style.display =
            "inline-block";

    }

    else{

        loginBtn.disabled = false;

        loginText.style.display =
            "inline-block";

        loginLoader.style.display =
            "none";

    }

}


// =========================
// LOGIN SUBMIT
// =========================

loginForm.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();

        hideError();

        const username =
            document.getElementById(
                "username"
            ).value.trim();

        const password =
            document.getElementById(
                "password"
            ).value.trim();

        // =====================
        // VALIDATION
        // =====================

        if(!username || !password){

            showError(
                "Please fill all fields."
            );

            return;

        }

        try {

            setLoading(true);

            const response =
                await fetch(
                    "/api/student/login",
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body: JSON.stringify({

                            username,
                            password

                        })

                    }
                );

            const data =
                await response.json();

            // =====================
            // SUCCESS
            // =====================

            if(data.success){

                localStorage.setItem(
                    "studentLoggedIn",
                    "true"
                );

                localStorage.setItem(
                    "studentName",
                    data.student.name || username
                );

                localStorage.setItem(
                    "studentRank",
                    data.student.rank ||
                    "Beginner"
                );

                localStorage.setItem(
                    "studentXP",
                    data.student.xp || 0
                );

                localStorage.setItem(
                    "studentAvatar",
                    data.student.avatar ||
                    "/assets/anime/default.png"
                );

                // REDIRECT
                window.location.href =
                    "/student";

            }

            // =====================
            // FAILED
            // =====================

            else {

                showError(

                    data.message ||

                    "Invalid login credentials."

                );

            }

        }

        catch(err){

            console.error(err);

            showError(
                "Server error. Please try again."
            );

        }

        finally {

            setLoading(false);

        }

    }
);


// =========================
// AUTO REDIRECT
// =========================

window.addEventListener(
    "load",
    () => {

        const loggedIn =
            localStorage.getItem(
                "studentLoggedIn"
            );

        if(loggedIn === "true"){

            window.location.href =
                "/student";

        }

    }
);