/* =========================================================
   EXCEL YOU EDITOR INIT - FIXED
========================================================= */
class EditorInitializer {
    constructor(config = {}) {
        this.config = {
            editorId: config.editorId || "editor",
            dragDrop: config.dragDrop !== false,
            ...config
        };

        this.editor = null;
        this.modules = {};
        this.init();
    }

    init() {
        console.log("🚀 Initializing EXCEL YOU Editor...");

        this.editor = document.getElementById(this.config.editorId);
        if (!this.editor) {
            console.error("❌ Editor container not found");
            return;
        }

        this.setupEditor();

        // Initialize in correct order
        this.initializeCore();
        this.initializeBlocks();
        this.initializeMedia();        // DragDropManager should be here
        this.initializeToolbar();
        this.initializeUI();
        this.initializeShortcuts();

        this.initialized = true;
        console.log("✅ EXCEL YOU Editor Ready");
    }

    setupEditor() {
        this.editor.contentEditable = true;
        this.editor.classList.add("excel-editor");
    }

    initializeCore() {
        // BlockEngine first
        if (typeof BlockEngine !== "undefined") {
            this.modules.blockEngine = new BlockEngine(this.editor);
        }
    }

    initializeBlocks() {
        console.log("📦 Blocks Initialized");
    }

    initializeMedia() {
        // DragDropManager - MOST IMPORTANT
        if (this.config.dragDrop && typeof DragDropManager !== "undefined") {
            this.modules.dragDrop = new DragDropManager(this.editor);
            console.log("🔄 DragDropManager attached");
        }

        // Other media managers
        if (typeof ImageUploadManager !== "undefined") {
            this.modules.imageUpload = new ImageUploadManager(this.editor);
        }
        if (typeof ImageResizeManager !== "undefined") {
            this.modules.imageResize = new ImageResizeManager(this.editor);
        }
    }

    initializeToolbar() {
        if (typeof ToolbarManager !== "undefined") {
            this.modules.toolbar = new ToolbarManager(this.editor);
        }
    }

    initializeUI() {
        if (typeof FloatingToolbar !== "undefined") {
            this.modules.floatingToolbar = new FloatingToolbar(this.editor);
        }
    }

    initializeShortcuts() {
        if (typeof ShortcutManager !== "undefined") {
            this.modules.shortcuts = new ShortcutManager(this.editor);
        }
    }

    getHTML() {
        return this.editor.innerHTML;
    }
}

/* =========================================================
   AUTO INITIALIZE
========================================================= */
document.addEventListener("DOMContentLoaded", () => {
    window.excelEditor = new EditorInitializer({
        editorId: "editor",
        dragDrop: true
    });
});