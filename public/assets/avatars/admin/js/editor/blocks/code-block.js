/* =========================================================
   EXCEL YOU CODE BLOCK
========================================================= */

class CodeBlock {

    constructor(editor) {

        this.editor = editor;

        this.languages = [

            "javascript",
            "html",
            "css",
            "python",
            "java",
            "cpp",
            "json",
            "sql",
            "php"
        ];

        this.init();
    }

    /* =====================================================
       INIT
    ===================================================== */

    init() {

        this.setupToolbarButton();

        console.log(
            "Code Block Initialized ✔"
        );
    }

    /* =====================================================
       TOOLBAR BUTTON
    ===================================================== */

    setupToolbarButton() {

        const codeBtn =
            document.getElementById(
                "codeBtn"
            );

        if (!codeBtn) {
            return;
        }

        codeBtn.addEventListener(
            "click",
            () => {

                this.insertCodeBlock();
            }
        );
    }

    /* =====================================================
       INSERT BLOCK
    ===================================================== */

    insertCodeBlock() {

        const block =
            this.createCodeBlock();

        this.editor.appendChild(
            block
        );

        const textarea =
            block.querySelector(
                ".code-editor"
            );

        textarea.focus();

        block.scrollIntoView({

            behavior: "smooth",

            block: "center"
        });
    }

    /* =====================================================
       CREATE BLOCK
    ===================================================== */

    createCodeBlock(
        code = "",
        language = "javascript"
    ) {

        // Wrapper
        const wrapper =
            document.createElement(
                "div"
            );

        wrapper.className =
            "editor-block code-block";

        wrapper.setAttribute(
            "draggable",
            "true"
        );

        // =========================
        // HEADER
        // =========================
        const header =
            document.createElement(
                "div"
            );

        header.className =
            "code-header";

        // Language selector
        const select =
            document.createElement(
                "select"
            );

        select.className =
            "code-language";

        this.languages.forEach(
            lang => {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    lang;

                option.innerText =
                    lang;

                if (
                    lang === language
                ) {

                    option.selected =
                        true;
                }

                select.appendChild(
                    option
                );
            }
        );

        // Copy button
        const copyBtn =
            document.createElement(
                "button"
            );

        copyBtn.className =
            "copy-code-btn";

        copyBtn.innerHTML =
`
<i class="fas fa-copy"></i>
`;

        // Delete button
        const deleteBtn =
            document.createElement(
                "button"
            );

        deleteBtn.className =
            "delete-code-btn";

        deleteBtn.innerHTML =
`
<i class="fas fa-trash"></i>
`;

        // =========================
        // TEXTAREA
        // =========================
        const textarea =
            document.createElement(
                "textarea"
            );

        textarea.className =
            "code-editor";

        textarea.spellcheck =
            false;

        textarea.placeholder =
`
Write your code here...
`;

        textarea.value =
            code;

        // =========================
        // FOOTER
        // =========================
        const footer =
            document.createElement(
                "div"
            );

        footer.className =
            "code-footer";

        footer.innerHTML =
`
<span>
Code Block
</span>
`;

        // =========================
        // APPEND
        // =========================
        header.appendChild(
            select
        );

        header.appendChild(
            copyBtn
        );

        header.appendChild(
            deleteBtn
        );

        wrapper.appendChild(
            header
        );

        wrapper.appendChild(
            textarea
        );

        wrapper.appendChild(
            footer
        );

        // Events
        this.setupEvents(

            wrapper,

            textarea,

            copyBtn,

            deleteBtn
        );

        return wrapper;
    }

    /* =====================================================
       EVENTS
    ===================================================== */

    setupEvents(

        wrapper,

        textarea,

        copyBtn,

        deleteBtn

    ) {

        // =========================
        // TAB SUPPORT
        // =========================
        textarea.addEventListener(
            "keydown",
            e => {

                if (
                    e.key === "Tab"
                ) {

                    e.preventDefault();

                    const start =
                        textarea.selectionStart;

                    const end =
                        textarea.selectionEnd;

                    textarea.value =

                        textarea.value.substring(
                            0,
                            start
                        ) +

                        "    " +

                        textarea.value.substring(
                            end
                        );

                    textarea.selectionStart =
                        textarea.selectionEnd =
                        start + 4;
                }
            }
        );

        // =========================
        // AUTO HEIGHT
        // =========================
        textarea.addEventListener(
            "input",
            () => {

                textarea.style.height =
                    "auto";

                textarea.style.height =
                    textarea.scrollHeight +
                    "px";

                window.hasUnsavedChanges =
                    true;
            }
        );

        // =========================
        // COPY
        // =========================
        copyBtn.addEventListener(
            "click",
            async () => {

                try {

                    await navigator
                        .clipboard
                        .writeText(

                            textarea.value
                        );

                    copyBtn.innerHTML =
`
<i class="fas fa-check"></i>
`;

                    setTimeout(() => {

                        copyBtn.innerHTML =
`
<i class="fas fa-copy"></i>
`;

                    }, 1500);

                } catch {

                    alert(
                        "Copy failed"
                    );
                }
            }
        );

        // =========================
        // DELETE
        // =========================
        deleteBtn.addEventListener(
            "click",
            () => {

                const confirmDelete =
                    confirm(
                        "Delete code block?"
                    );

                if (
                    !confirmDelete
                ) {
                    return;
                }

                wrapper.remove();
            }
        );

        // =========================
        // FOCUS STYLE
        // =========================
        textarea.addEventListener(
            "focus",
            () => {

                wrapper.classList.add(
                    "active-code-block"
                );
            }
        );

        textarea.addEventListener(
            "blur",
            () => {

                wrapper.classList.remove(
                    "active-code-block"
                );
            }
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

        window.codeBlock =
            new CodeBlock(
                editor
            );
    }
);
