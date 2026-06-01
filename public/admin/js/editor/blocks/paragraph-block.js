/* =========================================================
   EXCEL YOU PARAGRAPH BLOCK
========================================================= */

class ParagraphBlock {

    constructor(editor) {

        this.editor = editor;

        this.init();
    }

    /* =====================================================
       INIT
    ===================================================== */

    init() {

        this.setupEditor();

      
        console.log(
            "Paragraph Block Initialized ✔"
        );
    }

    /* =====================================================
       INITIAL SETUP
    ===================================================== */

    setupEditor() {

        // Empty editor starter block
        if (
            this.editor.innerHTML.trim()
            === ""
        ) {

            const block =
                this.createParagraphBlock();

            this.editor.appendChild(
                block
            );
        }
    }

    /* =====================================================
       CREATE PARAGRAPH
    ===================================================== */

    createParagraphBlock(text = "") {

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

        // Editable paragraph
        const paragraph =
            document.createElement(
                "p"
            );

        paragraph.className =
            "editor-paragraph";

        paragraph.contentEditable =
            "true";

        paragraph.spellcheck =
            true;

        paragraph.innerHTML =
            text || "<br>";

        // Append
        wrapper.appendChild(
            paragraph
        );

        // Events
        this.setupParagraphEvents(
            wrapper,
            paragraph
        );

        return wrapper;
    }

    /* =====================================================
       EVENTS
    ===================================================== */

    setupParagraphEvents(
        wrapper,
        paragraph
    ) {

        // =========================
        // ENTER KEY
        // =========================
        paragraph.addEventListener(
            "keydown",
            e => {

                if (
                    e.key === "Enter" &&
                    !e.shiftKey
                ) {

                    e.preventDefault();

                    this.createNewParagraphAfter(
                        wrapper
                    );
                }
            }
        );

        // =========================
        // EMPTY BLOCK REMOVE
        // =========================
        paragraph.addEventListener(
            "keydown",
            e => {

                if (
                    e.key === "Backspace"
                ) {

                    const text =
                        paragraph.innerText
                            .trim();

                    // Prevent deleting last block
                    const blocks =
                        this.editor
                            .querySelectorAll(
                                ".paragraph-block"
                            );

                    if (
                        text === "" &&
                        blocks.length > 1
                    ) {

                        e.preventDefault();

                        const previous =
                            wrapper.previousElementSibling;

                        wrapper.remove();

                        // Focus previous
                        if (
                            previous
                        ) {

                            const editable =
                                previous.querySelector(
                                    "[contenteditable]"
                                );

                            if (
                                editable
                            ) {

                                this.moveCursorToEnd(
                                    editable
                                );
                            }
                        }
                    }
                }
            }
        );

        // =========================
        // AUTO SAVE FLAG
        // =========================
        paragraph.addEventListener(
            "input",
            () => {

                window.hasUnsavedChanges =
                    true;
            }
        );
    }

    /* =====================================================
       CREATE AFTER
    ===================================================== */

    createNewParagraphAfter(
        currentBlock
    ) {

        const newBlock =
            this.createParagraphBlock();

        // Insert
        currentBlock.after(
            newBlock
        );

        // Focus
        const editable =
            newBlock.querySelector(
                ".editor-paragraph"
            );

        editable.focus();

        this.moveCursorToEnd(
            editable
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
            range);
    }

    /* =====================================================
       GET CONTENT
    ===================================================== */

    getContent() {

        return this.editor.innerHTML;
    }

    /* =====================================================
       SET CONTENT
    ===================================================== */

    setContent(html) {

        this.editor.innerHTML =
            html;
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

        window.paragraphBlock =
            new ParagraphBlock(
                editor
            );
    }
);
