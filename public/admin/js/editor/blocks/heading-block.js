/* =========================================================
   EXCEL YOU HEADING BLOCK
========================================================= */

class HeadingBlock {

    constructor(editor) {

        this.editor = editor;

        this.init();
    }

    /* =====================================================
       INIT
    ===================================================== */

    init() {

        this.setupToolbarButton();

        console.log(
            "Heading Block Initialized ✔"
        );
    }

    /* =====================================================
       TOOLBAR BUTTON
    ===================================================== */

    setupToolbarButton() {

        const headingBtn =
            document.getElementById(
                "headingBtn"
            );

        if (!headingBtn) {
            return;
        }

        headingBtn.addEventListener(
            "click",
            () => {

                this.insertHeadingBlock();
            }
        );
    }

    /* =====================================================
       CREATE BLOCK
    ===================================================== */

    createHeadingBlock(
        level = "h2",
        text = ""
    ) {

        // Wrapper
        const wrapper =
            document.createElement(
                "div"
            );

        wrapper.className =
            "editor-block heading-block";

        wrapper.setAttribute(
            "draggable",
            "true"
        );

        // Heading element
        const heading =
            document.createElement(
                level
            );

        heading.className =
            "editor-heading";

        heading.contentEditable =
            "true";

        heading.spellcheck =
            true;

        heading.innerHTML =
            text || "Heading";

        // Controls
        const controls =
            this.createControls(
                heading
            );

        // Append
        wrapper.appendChild(
            controls
        );

        wrapper.appendChild(
            heading
        );

        // Events
        this.setupEvents(
            wrapper,
            heading
        );

        return wrapper;
    }

    /* =====================================================
       CONTROLS
    ===================================================== */

    createControls(heading) {

        const controls =
            document.createElement(
                "div"
            );

        controls.className =
            "heading-controls";

        // H1
        const h1Btn =
            document.createElement(
                "button"
            );

        h1Btn.innerText = "H1";

        h1Btn.onclick = () => {

            this.changeHeadingLevel(
                heading,
                "h1"
            );
        };

        // H2
        const h2Btn =
            document.createElement(
                "button"
            );

        h2Btn.innerText = "H2";

        h2Btn.onclick = () => {

            this.changeHeadingLevel(
                heading,
                "h2"
            );
        };

        // H3
        const h3Btn =
            document.createElement(
                "button"
            );

        h3Btn.innerText = "H3";

        h3Btn.onclick = () => {

            this.changeHeadingLevel(
                heading,
                "h3"
            );
        };

        // Append
        controls.appendChild(
            h1Btn
        );

        controls.appendChild(
            h2Btn
        );

        controls.appendChild(
            h3Btn
        );

        return controls;
    }

    /* =====================================================
       CHANGE LEVEL
    ===================================================== */

    changeHeadingLevel(
        oldHeading,
        newTag
    ) {

        const newHeading =
            document.createElement(
                newTag
            );

        newHeading.className =
            "editor-heading";

        newHeading.contentEditable =
            "true";

        newHeading.innerHTML =
            oldHeading.innerHTML;

        oldHeading.replaceWith(
            newHeading
        );

        newHeading.focus();

        this.moveCursorToEnd(
            newHeading
        );
    }

    /* =====================================================
       INSERT
    ===================================================== */

    insertHeadingBlock() {

        const block =
            this.createHeadingBlock();

        this.editor.appendChild(
            block
        );

        const heading =
            block.querySelector(
                ".editor-heading"
            );

        heading.focus();

        this.moveCursorToEnd(
            heading
        );
    }

    /* =====================================================
       EVENTS
    ===================================================== */

    setupEvents(
        wrapper,
        heading
    ) {

        // =========================
        // ENTER KEY
        // =========================
        heading.addEventListener(
            "keydown",
            e => {

                if (
                    e.key === "Enter"
                ) {

                    e.preventDefault();

                    this.insertParagraphAfter(
                        wrapper
                    );
                }
            }
        );

        // =========================
        // DELETE EMPTY
        // =========================
        heading.addEventListener(
            "keydown",
            e => {

                if (
                    e.key === "Backspace"
                ) {

                    if (
                        heading.innerText
                            .trim()
                        === ""
                    ) {

                        e.preventDefault();

                        wrapper.remove();
                    }
                }
            }
        );

        // =========================
        // SAVE FLAG
        // =========================
        heading.addEventListener(
            "input",
            () => {

                window.hasUnsavedChanges =
                    true;
            }
        );
    }

    /* =====================================================
       INSERT PARAGRAPH
    ===================================================== */

    insertParagraphAfter(
        currentBlock
    ) {

        const wrapper =
            document.createElement(
                "div"
            );

        wrapper.className =
            "editor-block paragraph-block";

        wrapper.setAttribute(
            "draggable",
            "true"
        );

        const paragraph =
            document.createElement(
                "p"
            );

        paragraph.className =
            "editor-paragraph";

        paragraph.contentEditable =
            "true";

        paragraph.innerHTML =
            "<br>";

        wrapper.appendChild(
            paragraph
        );

        currentBlock.after(
            wrapper
        );

        paragraph.focus();

        this.moveCursorToEnd(
            paragraph
        );
    }

    /* =====================================================
       CURSOR
    ===================================================== */

    moveCursorToEnd(element) {

        const range =
            document.createRange();

        const selection =
            window.getSelection();

        range.selectNodeContents(
            element
        );

        range.collapse(false);

        selection.removeAllRanges();

        selection.addRange(
            range
        );
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

        window.headingBlock =
            new HeadingBlock(
                editor
            );
    }
);
