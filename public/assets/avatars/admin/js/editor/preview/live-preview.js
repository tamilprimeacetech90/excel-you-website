/* =========================================================
   EXCEL YOU LIVE PREVIEW SYSTEM
========================================================= */

class LivePreviewManager {

    constructor(editor) {

        this.editor = editor;

        this.previewFrame =
            document.getElementById(
                "livePreviewFrame"
            );

        this.previewContainer =
            document.getElementById(
                "livePreview"
            );

        this.previewToggle =
            document.getElementById(
                "previewToggle"
            );

        this.previewMode =
            "desktop";

        this.init();
    }

    /* =====================================================
       INIT
    ===================================================== */

    init() {

        this.setupLivePreview();

        this.setupPreviewToggle();

        this.setupResponsiveModes();

        this.renderPreview();

        console.log(
            "Live Preview Initialized ✔"
        );
    }

    /* =====================================================
       LIVE PREVIEW
    ===================================================== */

    setupLivePreview() {

        if (!this.editor) {
            return;
        }

        this.editor.addEventListener(
            "input",
            () => {

                this.renderPreview();
            }
        );

        // Title changes
        const titleInput =
            document.getElementById(
                "articleTitle"
            );

        if (
            titleInput
        ) {

            titleInput.addEventListener(
                "input",
                () => {

                    this.renderPreview();
                }
            );
        }
    }

    /* =====================================================
       RENDER PREVIEW
    ===================================================== */

    renderPreview() {

        if (
            !this.previewContainer
        ) {
            return;
        }

        const title =
            document.getElementById(
                "articleTitle"
            )?.value ||

            "Untitled Article";

        const content =
            this.editor.innerHTML;

        const thumbnail =
            document.querySelector(
                ".thumbnail-preview img"
            )?.src || "";

        const html =
            this.generatePreviewHTML({

                title,

                content,

                thumbnail
            });

        // =====================
        // IFRAME MODE
        // =====================
        if (
            this.previewFrame
        ) {

            const doc =
                this.previewFrame
                .contentDocument ||

                this.previewFrame
                .contentWindow
                .document;

            doc.open();

            doc.write(
                html
            );

            doc.close();
        }

        // =====================
        // DIV MODE
        // =====================
        else {

            this.previewContainer
                .innerHTML = html;
        }
    }

    /* =====================================================
       PREVIEW HTML
    ===================================================== */

    generatePreviewHTML(data) {

        return `

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<meta
name="viewport"
content="width=device-width, initial-scale=1.0">

<title>
${data.title}
</title>

<style>

body{

    font-family:
    Inter,
    sans-serif;

    background:#f8fafc;

    margin:0;

    padding:40px;

    color:#111827;

    line-height:1.8;
}

.preview-wrapper{

    max-width:900px;

    margin:auto;

    background:white;

    border-radius:24px;

    overflow:hidden;

    box-shadow:
    0 10px 40px rgba(0,0,0,.08);
}

.preview-thumbnail{

    width:100%;

    height:420px;

    object-fit:cover;
}

.preview-content{

    padding:40px;
}

.preview-title{

    font-size:42px;

    margin-bottom:20px;

    line-height:1.3;
}

.preview-content img{

    max-width:100%;

    border-radius:16px;

    margin:20px 0;
}

.preview-content iframe{

    width:100%;

    height:500px;

    border:none;

    border-radius:18px;

    margin:20px 0;
}

.preview-content pre{

    background:#111827;

    color:#f8fafc;

    padding:20px;

    border-radius:18px;

    overflow:auto;
}

.preview-content code{

    font-family:
    Consolas,
    monospace;
}

.preview-content h1,
.preview-content h2,
.preview-content h3{

    margin-top:32px;
}

.preview-content p{

    margin:18px 0;
}

.file-card{

    border:1px solid #e2e8f0;

    padding:18px;

    border-radius:16px;

    margin:20px 0;
}

</style>

</head>

<body>

<div class="preview-wrapper">

${data.thumbnail
? `
<img
src="${data.thumbnail}"
class="preview-thumbnail">
`
: ""
}

<div class="preview-content">

<h1 class="preview-title">
${data.title}
</h1>

${data.content}

</div>

</div>

</body>

</html>

        `;
    }

    /* =====================================================
       PREVIEW TOGGLE
    ===================================================== */

    setupPreviewToggle() {

        if (
            !this.previewToggle
        ) {
            return;
        }

        this.previewToggle.addEventListener(
            "click",
            () => {

                this.togglePreview();
            }
        );
    }

    /* =====================================================
       TOGGLE
    ===================================================== */

    togglePreview() {

        if (
            !this.previewContainer
        ) {
            return;
        }

        this.previewContainer
            .classList.toggle(
                "preview-hidden"
            );

        const hidden =
            this.previewContainer
            .classList.contains(
                "preview-hidden"
            );

        if (
            this.previewToggle
        ) {

            this.previewToggle.innerHTML =

                hidden

                ? `
<i class="fas fa-eye"></i>
`

                : `
<i class="fas fa-eye-slash"></i>
`;
        }
    }

    /* =====================================================
       RESPONSIVE MODES
    ===================================================== */

    setupResponsiveModes() {

        const desktopBtn =
            document.getElementById(
                "previewDesktop"
            );

        const tabletBtn =
            document.getElementById(
                "previewTablet"
            );

        const mobileBtn =
            document.getElementById(
                "previewMobile"
            );

        // Desktop
        if (
            desktopBtn
        ) {

            desktopBtn.addEventListener(
                "click",
                () => {

                    this.setPreviewMode(
                        "desktop"
                    );
                }
            );
        }

        // Tablet
        if (
            tabletBtn
        ) {

            tabletBtn.addEventListener(
                "click",
                () => {

                    this.setPreviewMode(
                        "tablet"
                    );
                }
            );
        }

        // Mobile
        if (
            mobileBtn
        ) {

            mobileBtn.addEventListener(
                "click",
                () => {

                    this.setPreviewMode(
                        "mobile"
                    );
                }
            );
        }
    }

    /* =====================================================
       SET MODE
    ===================================================== */

    setPreviewMode(mode) {

        this.previewMode =
            mode;

        if (
            !this.previewFrame
        ) {
            return;
        }

        switch (mode) {

            case "desktop":

                this.previewFrame.style.width =
                    "100%";

                this.previewFrame.style.height =
                    "100vh";

                break;

            case "tablet":

                this.previewFrame.style.width =
                    "820px";

                this.previewFrame.style.height =
                    "1180px";

                break;

            case "mobile":

                this.previewFrame.style.width =
                    "390px";

                this.previewFrame.style.height =
                    "844px";

                break;
        }
    }

    /* =====================================================
       OPEN NEW WINDOW
    ===================================================== */

    openPreviewWindow() {

        const previewHTML =
            this.generatePreviewHTML({

                title:
                    document.getElementById(
                        "articleTitle"
                    )?.value ||

                    "Untitled",

                content:
                    this.editor.innerHTML,

                thumbnail:
                    document.querySelector(
                        ".thumbnail-preview img"
                    )?.src || ""
            });

        const previewWindow =
            window.open(
                "",
                "_blank"
            );

        previewWindow.document.write(
            previewHTML
        );

        previewWindow.document.close();
    }

    /* =====================================================
       PRINT PREVIEW
    ===================================================== */

    printPreview() {

        if (
            this.previewFrame
        ) {

            this.previewFrame
                .contentWindow
                .print();
        }
    }
}

/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const editor =
            document.getElementById(
                "editor"
            );

        if (!editor) {
            return;
        }

        window.livePreviewManager =
            new LivePreviewManager(
                editor
            );
    }
);
