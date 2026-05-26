/* =========================================================
   EXCEL YOU EDITOR INIT
========================================================= */

class ExcelYouEditor {

    constructor(config = {}) {

        // =====================
        // CONFIG
        // =====================
        this.config = {

            editorId:
                config.editorId ||
                "editor",

            autoSave:
                config.autoSave !== false,

            floatingToolbar:
                config.floatingToolbar !== false,

            dragDrop:
                config.dragDrop !== false,

            mediaLibrary:
                config.mediaLibrary !== false,

            shortcuts:
                config.shortcuts !== false,

            history:
                config.history !== false
        };

        // =====================
        // CORE REFERENCES
        // =====================
        this.editor = null;

        this.modules = {};

        this.initialized = false;

        // =====================
        // INIT
        // =====================
        this.init();
    }

    /* =====================================================
       INIT
    ===================================================== */

    init() {

        console.log(
            "Initializing EXCEL YOU Editor..."
        );

        // =====================
        // FIND EDITOR
        // =====================
        this.editor =
            document.getElementById(
                this.config.editorId
            );

        if (!this.editor) {

            console.error(
                "Editor container not found"
            );

            return;
        }

        // =====================
        // BASIC SETUP
        // =====================
        this.setupEditor();

        // =====================
        // LOAD CORE
        // =====================
        this.initializeCore();

        // =====================
        // LOAD BLOCKS
        // =====================
        this.initializeBlocks();

        // =====================
        // LOAD MEDIA
        // =====================
        this.initializeMedia();

        // =====================
        // LOAD TOOLBAR
        // =====================
        this.initializeToolbar();

        // =====================
        // LOAD HISTORY
        // =====================
        this.initializeHistory();

        // =====================
        // LOAD AUTOSAVE
        // =====================
        this.initializeAutoSave();

        // =====================
        // LOAD UI
        // =====================
        this.initializeUI();

        // =====================
        // LOAD SHORTCUTS
        // =====================
        this.initializeShortcuts();

        // =====================
        // READY
        // =====================
        this.initialized = true;

        console.log(
            "EXCEL YOU Editor Ready ✔"
        );

        // Notify
        if (window.notify) {

            notify.success(

                "Editor Ready",

                "Editor loaded successfully"
            );
        }
    }

    /* =====================================================
       SETUP EDITOR
    ===================================================== */

    setupEditor() {

        // Editable
        this.editor.contentEditable =
            true;

        // Class
        this.editor.classList.add(
            "excel-editor"
        );

        // Placeholder
        if (
            !this.editor.innerHTML.trim()
        ) {

            this.editor.innerHTML =
`
<p class="editor-placeholder">
Start writing here...
</p>
`;
        }
    }

    /* =====================================================
       CORE
    ===================================================== */

    initializeCore() {

        // =====================
        // BLOCK ENGINE
        // =====================
        if (
            window.BlockEngine
        ) {

            this.modules.blockEngine =
                new BlockEngine(
                    this.editor
                );
        }

        // =====================
        // BLOCK MANAGER
        // =====================
        if (
            window.BlockManager
        ) {

            this.modules.blockManager =
                new BlockManager(
                    this.editor
                );
        }

        // =====================
        // SELECTION
        // =====================
        if (
            window.SelectionManager
        ) {

            this.modules.selectionManager =
                new SelectionManager(
                    this.editor
                );
        }
    }

    /* =====================================================
       BLOCKS
    ===================================================== */

    initializeBlocks() {

        console.log(
            "Blocks Initialized ✔"
        );
    }

    /* =====================================================
       MEDIA
    ===================================================== */

    initializeMedia() {

        // =====================
        // DRAG DROP
        // =====================
        if (
            this.config.dragDrop &&
            window.DragDropManager
        ) {

            this.modules.dragDrop =
                new DragDropManager(
                    this.editor
                );
        }

        // =====================
        // IMAGE RESIZE
        // =====================
        if (
            window.ImageResize
        ) {

            this.modules.imageResize =
                new ImageResize(
                    this.editor
                );
        }

        // =====================
        // IMAGE CROP
        // =====================
        if (
            window.ImageCrop
        ) {

            this.modules.imageCrop =
                new ImageCrop(
                    this.editor
                );
        }

        // =====================
        // MEDIA LIBRARY
        // =====================
        if (
            this.config.mediaLibrary &&
            window.MediaLibrary
        ) {

            this.modules.mediaLibrary =
                new MediaLibrary(
                    this.editor
                );
        }

        console.log(
            "Media System Initialized ✔"
        );
    }

    /* =====================================================
       TOOLBAR
    ===================================================== */

    initializeToolbar() {

        if (
            window.ToolbarManager
        ) {

            this.modules.toolbar =
                new ToolbarManager(
                    this.editor
                );
        }

        console.log(
            "Toolbar Initialized ✔"
        );
    }

    /* =====================================================
       HISTORY
    ===================================================== */

    initializeHistory() {

        if (
            this.config.history &&
            window.HistoryManager
        ) {

            this.modules.history =
                new HistoryManager(
                    this.editor
                );
        }

        console.log(
            "History Initialized ✔"
        );
    }

    /* =====================================================
       AUTOSAVE
    ===================================================== */

    initializeAutoSave() {

        if (
            this.config.autoSave &&
            window.AutoSaveManager
        ) {

            this.modules.autosave =
                new AutoSaveManager(
                    this.editor
                );
        }

        console.log(
            "Autosave Initialized ✔"
        );
    }

    /* =====================================================
       UI
    ===================================================== */

    initializeUI() {

        // =====================
        // FLOATING TOOLBAR
        // =====================
        if (
            this.config.floatingToolbar &&
            window.FloatingToolbar
        ) {

            this.modules.floatingToolbar =
                new FloatingToolbar(
                    this.editor
                );
        }

        console.log(
            "UI Initialized ✔"
        );
    }

    /* =====================================================
       SHORTCUTS
    ===================================================== */

    initializeShortcuts() {

        if (
            this.config.shortcuts &&
            window.ShortcutManager
        ) {

            this.modules.shortcuts =
                new ShortcutManager(
                    this.editor
                );
        }

        console.log(
            "Shortcuts Initialized ✔"
        );
    }

    /* =====================================================
       GET HTML
    ===================================================== */

    getHTML() {

        return this.editor.innerHTML;
    }

    /* =====================================================
       SET HTML
    ===================================================== */

    setHTML(html = "") {

        this.editor.innerHTML =
            html;
    }

    /* =====================================================
       CLEAR
    ===================================================== */

    clear() {

        this.editor.innerHTML =
            "";
    }

    /* =====================================================
       DESTROY
    ===================================================== */

    destroy() {

        Object.values(
            this.modules
        ).forEach(module => {

            if (
                module &&
                typeof module.destroy ===
                "function"
            ) {

                module.destroy();
            }
        });

        this.modules = {};

        this.initialized = false;

        console.log(
            "Editor Destroyed ✔"
        );
    }
}

/* =========================================================
   AUTO INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        // =====================
        // AUTO INIT
        // =====================
        window.excelEditor =
            new ExcelYouEditor({

                editorId:
                    "editor",

                autoSave:
                    true,

                floatingToolbar:
                    true,

                dragDrop:
                    true,

                mediaLibrary:
                    true,

                shortcuts:
                    true,

                history:
                    true
            });
    }
);
