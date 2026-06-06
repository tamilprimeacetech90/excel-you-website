/* =========================================================
   EXCEL YOU TEXT FORMAT SYSTEM
========================================================= */
console.log("TEXT-FORMAT.JS LOADED");
class TextFormatManager {

    constructor(editor) {

        this.editor = editor;

        this.init();
    }

    /* =====================================================
       INIT
    ===================================================== */

    init() {

        this.setupFormatting();

        console.log(
            "Text Format Manager Initialized ✔"
        );
    }

    /* =====================================================
       MAIN FORMATTING
    ===================================================== */

    setupFormatting() {

        // =========================
        // BOLD
        // =========================
        this.bindFormat(
            "boldBtn",
            () => {

                this.exec(
                    "bold"
                );
            }
        );

        // =========================
        // ITALIC
        // =========================
        this.bindFormat(
            "italicBtn",
            () => {

                this.exec(
                    "italic"
                );
            }
        );

        // =========================
        // UNDERLINE
        // =========================
        this.bindFormat(
            "underlineBtn",
            () => {

                this.exec(
                    "underline"
                );
            }
        );

        // =========================
        // STRIKE
        // =========================
        this.bindFormat(
            "strikeBtn",
            () => {

                this.exec(
                    "strikeThrough"
                );
            }
        );

        // =========================
        // H2
        // =========================
        this.bindFormat(
            "headingBtn",
            () => {

                this.exec(
                    "formatBlock",
                    "H2"
                );
            }
        );

        // =========================
        // BLOCKQUOTE
        // =========================
        this.bindFormat(
            "quoteBtn",
            () => {

                this.exec(
                    "formatBlock",
                    "BLOCKQUOTE"
                );
            }
        );

        // =========================
        // BULLET LIST
        // =========================
        this.bindFormat(
            "bulletListBtn",
            () => {

                this.exec(
                    "insertUnorderedList"
                );
            }
        );

        // =========================
        // ORDERED LIST
        // =========================
        this.bindFormat(
            "orderedListBtn",
            () => {

                this.exec(
                    "insertOrderedList"
                );
            }
        );

        // =========================
        // CODE BLOCK
        // =========================
        this.bindFormat(
            "codeBtn",
            () => {

                this.wrapSelection(
                    "pre"
                );
            }
        );

        // =========================
        // INLINE CODE
        // =========================
        this.bindFormat(
            "inlineCodeBtn",
            () => {

                this.wrapSelection(
                    "code"
                );
            }
        );
    }

    /* =====================================================
       GENERIC EXEC
    ===================================================== */

    exec(command, value = null) {

        this.editor.focus();

        document.execCommand(

            command,

            false,

            value
        );
    }

    /* =====================================================
       BUTTON BINDER
    ===================================================== */

    bindFormat(id, callback) {

        const button =
            document.getElementById(
                id
            );

        if (!button) {
            return;
        }

        button.addEventListener(
            "click",
            callback
        );
    }

    /* =====================================================
       WRAP SELECTION
    ===================================================== */

    wrapSelection(tagName) {

        const selection =
            window.getSelection();

        if (
            !selection.rangeCount
        ) {
            return;
        }

        const range =
            selection.getRangeAt(0);

        const selectedText =
            range.extractContents();

        const wrapper =
            document.createElement(
                tagName
            );

        wrapper.appendChild(
            selectedText
        );

        range.insertNode(
            wrapper
        );

        selection.removeAllRanges();

        const newRange =
            document.createRange();

        newRange.selectNodeContents(
            wrapper
        );

        selection.addRange(
            newRange
        );
    }

    /* =====================================================
       REMOVE FORMAT
    ===================================================== */

    clearFormatting() {

        this.exec(
            "removeFormat"
        );
    }

    /* =====================================================
       INSERT PARAGRAPH
    ===================================================== */

    insertParagraph() {

        this.exec(
            "formatBlock",
            "P"
        );
    }

    /* =====================================================
       INSERT H1
    ===================================================== */

    insertHeading1() {

        this.exec(
            "formatBlock",
            "H1"
        );
    }

    /* =====================================================
       INSERT H3
    ===================================================== */

    insertHeading3() {

        this.exec(
            "formatBlock",
            "H3"
        );
    }

    /* =====================================================
       INSERT HR
    ===================================================== */

    insertDivider() {

        const hr =
            document.createElement(
                "hr"
            );

        const selection =
            window.getSelection();

        if (
            !selection.rangeCount
        ) {
            return;
        }

        const range =
            selection.getRangeAt(0);

        range.insertNode(
            hr
        );
    }
}


/* =========================================================
   HTML TOOLBAR COMPATIBILITY
========================================================= */

function formatText(command) {

    document.execCommand(
        command,
        false,
        null
    );
}

function undoEditor() {

    document.execCommand(
        "undo"
    );
}

function redoEditor() {

    document.execCommand(
        "redo"
    );
}

function insertLink() {

    const url =
        prompt("Enter URL");

    if (!url) return;

    document.execCommand(
        "createLink",
        false,
        url
    );
}

function insertImage() {

    const input =
        document.createElement("input");

    input.type = "file";

    input.accept = "image/*";

    input.onchange = e => {

        const file =
            e.target.files[0];

        if (!file) return;

        const reader =
            new FileReader();

        reader.onload = event => {

            document.execCommand(
                "insertImage",
                false,
                event.target.result
            );
        };

        reader.readAsDataURL(file);
    };

    input.click();
}

function insertVideo() {

    let url =
        prompt(
            "Paste YouTube URL"
        );

    if (!url) return;

    let videoId = "";

    if (
        url.includes("watch?v=")
    ) {

        videoId =
            url.split(
                "watch?v="
            )[1]
            .split("&")[0];

    } else if (
        url.includes("youtu.be/")
    ) {

        videoId =
            url.split(
                "youtu.be/"
            )[1]
            .split("?")[0];
    }

    if (!videoId) {

        alert(
            "Invalid YouTube URL"
        );

        return;
    }

    const embedUrl =
        `https://www.youtube.com/embed/${videoId}`;

    document.execCommand(
        "insertHTML",
        false,
        `
        <div class="video-block">
            <iframe
                src="${embedUrl}"
                frameborder="0"
                allowfullscreen>
            </iframe>
        </div>
        `
    );
}
function toggleHTMLMode() {

    const editor =
        document.getElementById(
            "editor"
        );

    if (!editor) return;

    if (
        editor.getAttribute(
            "contenteditable"
        ) === "true"
    ) {

        editor.textContent =
            editor.innerHTML;

        editor.setAttribute(
            "contenteditable",
            "false"
        );

    } else {

        editor.innerHTML =
            editor.textContent;

        editor.setAttribute(
            "contenteditable",
            "true"
        );
    }
}

window.formatText = formatText;
window.undoEditor = undoEditor;
window.redoEditor = redoEditor;
window.insertLink = insertLink;
window.insertImage = insertImage;
window.insertVideo = insertVideo;
window.toggleHTMLMode = toggleHTMLMode;

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

        window.textFormatManager =
            new TextFormatManager(
                editor
            );
    }
);
