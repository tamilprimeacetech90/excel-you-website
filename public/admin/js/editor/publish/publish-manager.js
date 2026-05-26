/* =========================================================
   EXCEL YOU PUBLISH MANAGER
========================================================= */

class PublishManager {

    constructor(editor) {

        this.editor = editor;

        this.isSaving = false;

        this.hasUnsavedChanges = false;

        this.autoSaveDelay = 2000;

        this.autoSaveTimer = null;

        this.init();
    }

    /* =====================================================
       INIT
    ===================================================== */

    init() {

        this.setupAutoSave();

        this.setupPublishButton();

        this.setupDraftRestore();

        this.setupBeforeUnload();

        console.log(
            "Publish Manager Initialized ✔"
        );
    }

    /* =====================================================
       AUTOSAVE
    ===================================================== */

    setupAutoSave() {

        this.editor.addEventListener(
            "input",
            () => {

                this.hasUnsavedChanges =
                    true;

                clearTimeout(
                    this.autoSaveTimer
                );

                this.autoSaveTimer =
                    setTimeout(() => {

                        this.saveDraft();

                    }, this.autoSaveDelay);
            }
        );
    }

    /* =====================================================
       SAVE DRAFT
    ===================================================== */

    async saveDraft() {

        if (this.isSaving) {
            return;
        }

        try {

            this.isSaving = true;

            this.setStatus(
                "Saving..."
            );

            // =====================
            // SERIALIZE CONTENT
            // =====================
            const articleData =
                this.generateArticleJSON();

            // =====================
            // LOCAL BACKUP
            // =====================
            localStorage.setItem(

                "editorDraft",

                JSON.stringify(
                    articleData
                )
            );

            // =====================
            // API SAVE
            // =====================
            // Replace later
            console.log(
                "Draft Saved",
                articleData
            );

            this.hasUnsavedChanges =
                false;

            this.setStatus(
                "Draft Saved ✔"
            );

        } catch (err) {

            console.error(
                err
            );

            this.setStatus(
                "Save Failed ❌"
            );

        } finally {

            this.isSaving = false;
        }
    }

    /* =====================================================
       GENERATE ARTICLE JSON
    ===================================================== */

    generateArticleJSON() {

        // =====================
        // TITLE
        // =====================
        const title =
            document.getElementById(
                "articleTitle"
            )?.value || "";

        // =====================
        // CONTENT
        // =====================
        const content =
            this.editor.innerHTML;

        // =====================
        // THUMBNAIL
        // =====================
        const thumbnail =
            document.querySelector(
                ".thumbnail-preview img"
            )?.src || "";

        // =====================
        // SEO
        // =====================
        const seoTitle =
            document.getElementById(
                "seoTitle"
            )?.value || "";

        const seoDescription =
            document.getElementById(
                "seoDescription"
            )?.value || "";

        const slug =
            document.getElementById(
                "articleSlug"
            )?.value || "";

        // =====================
        // BLOCKS
        // =====================
        const blocks =
            this.extractBlocks();

        return {

            title,

            slug,

            thumbnail,

            content,

            blocks,

            seo: {

                title:
                    seoTitle,

                description:
                    seoDescription
            },

            updatedAt:
                new Date()
                .toISOString()
        };
    }

    /* =====================================================
       EXTRACT BLOCKS
    ===================================================== */

    extractBlocks() {

        const blocks = [];

        this.editor
            .querySelectorAll(
                ".editor-block"
            )
            .forEach(block => {

                // Paragraph
                if (
                    block.classList.contains(
                        "paragraph-block"
                    )
                ) {

                    blocks.push({

                        type:
                            "paragraph",

                        content:
                            block.innerHTML
                    });
                }

                // Heading
                else if (
                    block.classList.contains(
                        "heading-block"
                    )
                ) {

                    const heading =
                        block.querySelector(
                            ".editor-heading"
                        );

                    blocks.push({

                        type:
                            "heading",

                        tag:
                            heading.tagName,

                        content:
                            heading.innerHTML
                    });
                }

                // Image
                else if (
                    block.classList.contains(
                        "image-block"
                    )
                ) {

                    const image =
                        block.querySelector(
                            "img"
                        );

                    blocks.push({

                        type:
                            "image",

                        src:
                            image.src
                    });
                }

                // Video
                else if (
                    block.classList.contains(
                        "video-block"
                    )
                ) {

                    const iframe =
                        block.querySelector(
                            "iframe"
                        );

                    blocks.push({

                        type:
                            "video",

                        src:
                            iframe.src
                    });
                }

                // Code
                else if (
                    block.classList.contains(
                        "code-block"
                    )
                ) {

                    const code =
                        block.querySelector(
                            ".code-editor"
                        );

                    const language =
                        block.querySelector(
                            ".code-language"
                        );

                    blocks.push({

                        type:
                            "code",

                        language:
                            language.value,

                        code:
                            code.value
                    });
                }

                // File
                else if (
                    block.classList.contains(
                        "file-block"
                    )
                ) {

                    blocks.push({

                        type:
                            "file",

                        content:
                            block.innerHTML
                    });
                }
            });

        return blocks;
    }

    /* =====================================================
       PUBLISH
    ===================================================== */

    setupPublishButton() {

        const publishBtn =
            document.getElementById(
                "publishBtn"
            );

        if (!publishBtn) {
            return;
        }

        publishBtn.addEventListener(
            "click",
            async () => {

                await this.publishArticle();
            }
        );
    }

    /* =====================================================
       PUBLISH ARTICLE
    ===================================================== */

    async publishArticle() {

        try {

            this.setStatus(
                "Publishing..."
            );

            // =====================
            // VALIDATION
            // =====================
            if (
                !this.validateArticle()
            ) {
                return;
            }

            // Save latest draft
            await this.saveDraft();

            // Article payload
            const article =
                this.generateArticleJSON();

            // =====================
            // SEND API
            // =====================
            console.log(
                "Publishing...",
                article
            );

            // Replace later
            await new Promise(

                resolve =>

                    setTimeout(
                        resolve,
                        1500
                    )
            );

            this.setStatus(
                "Published ✔"
            );

            alert(
                "Article Published Successfully ✔"
            );

        } catch (err) {

            console.error(
                err
            );

            this.setStatus(
                "Publish Failed ❌"
            );
        }
    }

    /* =====================================================
       VALIDATION
    ===================================================== */

    validateArticle() {

        const title =
            document.getElementById(
                "articleTitle"
            )?.value
            ?.trim();

        if (!title) {

            alert(
                "Title is required"
            );

            return false;
        }

        const text =
            this.editor.innerText
            .trim();

        if (!text) {

            alert(
                "Content cannot be empty"
            );

            return false;
        }

        return true;
    }

    /* =====================================================
       RESTORE DRAFT
    ===================================================== */

    setupDraftRestore() {

        const backup =
            localStorage.getItem(
                "editorDraft"
            );

        if (!backup) {
            return;
        }

        try {

            const parsed =
                JSON.parse(
                    backup
                );

            // Restore title
            const titleInput =
                document.getElementById(
                    "articleTitle"
                );

            if (
                titleInput
            ) {

                titleInput.value =
                    parsed.title || "";
            }

            // Restore editor
            this.editor.innerHTML =
                parsed.content || "";

            console.log(
                "Draft Restored ✔"
            );

        } catch (err) {

            console.error(
                "Restore Failed",
                err
            );
        }
    }

    /* =====================================================
       STATUS
    ===================================================== */

    setStatus(message) {

        const status =
            document.getElementById(
                "saveStatus"
            );

        if (!status) {
            return;
        }

        status.innerText =
            message;
    }

    /* =====================================================
       UNSAVED WARNING
    ===================================================== */

    setupBeforeUnload() {

        window.addEventListener(
            "beforeunload",
            e => {

                if (
                    this.hasUnsavedChanges
                ) {

                    e.preventDefault();

                    e.returnValue = "";
                }
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

        window.publishManager =
            new PublishManager(
                editor
            );
    }
);
