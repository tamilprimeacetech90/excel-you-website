/* =========================================================
   EXCEL YOU MODAL SYSTEM
========================================================= */

class ModalManager {

    constructor() {

        this.activeModal = null;

        this.init();
    }

    /* =====================================================
       INIT
    ===================================================== */

    init() {

        this.createRoot();

        this.setupEscapeKey();

        console.log(
            "Modal Manager Initialized ✔"
        );
    }

    /* =====================================================
       ROOT
    ===================================================== */

    createRoot() {

        if (
            document.getElementById(
                "modalRoot"
            )
        ) {
            return;
        }

        const root =
            document.createElement(
                "div"
            );

        root.id =
            "modalRoot";

        document.body.appendChild(
            root
        );
    }

    /* =====================================================
       OPEN MODAL
    ===================================================== */

    open({

        title = "Modal",

        content = "",

        width = "700px",

        closable = true,

        actions = []

    }) {

        this.close();

        // =====================
        // OVERLAY
        // =====================
        const overlay =
            document.createElement(
                "div"
            );

        overlay.className =
            "modal-overlay";

        // =====================
        // MODAL
        // =====================
        const modal =
            document.createElement(
                "div"
            );

        modal.className =
            "modal-box";

        modal.style.width =
            width;

        // =====================
        // ACTION BUTTONS
        // =====================
        const actionHTML =
            actions.map(action => {

                return `

<button
class="modal-btn ${action.type || ""}"
id="${action.id || ""}">

${action.label}

</button>

                `;
            }).join("");

        // =====================
        // CLOSE BUTTON
        // =====================
        const closeButton =
            closable

            ? `

<button class="modal-close">

<i class="fas fa-xmark"></i>

</button>

            `

            : "";

        // =====================
        // HTML
        // =====================
        modal.innerHTML = `

<div class="modal-header">

    <h2>
        ${title}
    </h2>

    ${closeButton}

</div>

<div class="modal-body">

    ${content}

</div>

<div class="modal-footer">

    ${actionHTML}

</div>

        `;

        overlay.appendChild(
            modal
        );

        document.getElementById(
            "modalRoot"
        ).appendChild(
            overlay
        );

        // Animate
        setTimeout(() => {

            overlay.classList.add(
                "show"
            );

        }, 10);

        // Close event
        if (closable) {

            overlay
                .querySelector(
                    ".modal-close"
                )
                ?.addEventListener(
                    "click",
                    () => {

                        this.close();
                    }
                );

            overlay.addEventListener(
                "click",
                e => {

                    if (
                        e.target === overlay
                    ) {

                        this.close();
                    }
                }
            );
        }

        // Action events
        actions.forEach(action => {

            const btn =
                modal.querySelector(
                    `#${action.id}`
                );

            if (!btn) {
                return;
            }

            btn.addEventListener(
                "click",
                () => {

                    action.onClick?.();

                    if (
                        action.closeOnClick !==
                        false
                    ) {

                        this.close();
                    }
                }
            );
        });

        this.activeModal =
            overlay;

        return overlay;
    }

    /* =====================================================
       CLOSE MODAL
    ===================================================== */

    close() {

        if (
            !this.activeModal
        ) {
            return;
        }

        this.activeModal
            .classList.remove(
                "show"
            );

        setTimeout(() => {

            this.activeModal
                ?.remove();

            this.activeModal =
                null;

        }, 250);
    }

    /* =====================================================
       ESC KEY
    ===================================================== */

    setupEscapeKey() {

        document.addEventListener(
            "keydown",
            e => {

                if (
                    e.key === "Escape"
                ) {

                    this.close();
                }
            }
        );
    }

    /* =====================================================
       ALERT MODAL
    ===================================================== */

    alert({

        title = "Alert",

        message = ""

    }) {

        this.open({

            title,

            content:
`
<p>${message}</p>
`,

            width: "420px",

            actions: [

                {

                    id: "alertOk",

                    label: "OK",

                    type: "primary"
                }
            ]
        });
    }

    /* =====================================================
       CONFIRM MODAL
    ===================================================== */

    confirm({

        title = "Confirm",

        message = "",

        onConfirm = () => {},

        onCancel = () => {}

    }) {

        this.open({

            title,

            width: "460px",

            content:
`
<p>${message}</p>
`,

            actions: [

                {

                    id: "cancelBtn",

                    label: "Cancel",

                    type: "secondary",

                    onClick:
                        onCancel
                },

                {

                    id: "confirmBtn",

                    label: "Confirm",

                    type: "danger",

                    onClick:
                        onConfirm
                }
            ]
        });
    }

    /* =====================================================
       IMAGE MODAL
    ===================================================== */

    image(src) {

        this.open({

            title: "Image Preview",

            width: "900px",

            content:
`

<img
src="${src}"
class="modal-preview-image">

            `,

            actions: [

                {

                    id: "closeImage",

                    label: "Close",

                    type: "primary"
                }
            ]
        });
    }

    /* =====================================================
       VIDEO MODAL
    ===================================================== */

    video(src) {

        this.open({

            title: "Video Preview",

            width: "1000px",

            content:
`

<div class="modal-video-wrapper">

<iframe
src="${src}"
allowfullscreen>

</iframe>

</div>

            `,

            actions: [

                {

                    id: "closeVideo",

                    label: "Close",

                    type: "primary"
                }
            ]
        });
    }

    /* =====================================================
       CUSTOM HTML
    ===================================================== */

    custom({

        title,

        html,

        width = "700px"

    }) {

        this.open({

            title,

            content: html,

            width
        });
    }

    /* =====================================================
       LOADING MODAL
    ===================================================== */

    loading(message = "Loading...") {

        this.open({

            title: "Please Wait",

            width: "380px",

            closable: false,

            content:
`

<div class="modal-loading">

<div class="modal-spinner"></div>

<p>${message}</p>

</div>

            `
        });
    }
}

/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        window.modal =
            new ModalManager();
    }
);

/* =========================================================
   EXAMPLES
========================================================= */

// modal.alert({
//     title: "Saved",
//     message: "Article saved successfully"
// });

// modal.confirm({
//     title: "Delete Article",
//     message: "Are you sure?",
//     onConfirm: () => {
//         console.log("Deleted");
//     }
// });

// modal.image("image.jpg");

// modal.video("https://youtube.com/embed/...");
