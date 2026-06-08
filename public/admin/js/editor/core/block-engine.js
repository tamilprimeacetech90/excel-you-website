/* =========================================================
   EXCEL YOU BLOCK ENGINE - CLEANED VERSION
========================================================= */
class BlockEngine {
    constructor(editor) {
        this.editor = editor;
        this.blockId = 0;
        this.init();
    }

    init() {
        console.log("Block Engine Initialized ✔");
        // No need for enableBlockDragging() anymore
    }

    generateBlockId() {
        this.blockId++;
        return `block-${this.blockId}`;
    }

    createBaseBlock(type) {
        const block = document.createElement("div");
        block.className = `editor-block ${type}-block`;
        block.dataset.blockId = this.generateBlockId();
        block.dataset.blockType = type;
        
        // Let DragDropManager handle draggable attribute
        // block.draggable = true;   ← REMOVED (moved to DragDropManager)

        this.addBlockControls(block);
        return block;
    }

    addBlockControls(block) {
        const controls = document.createElement("div");
        controls.className = "block-controls";
        controls.innerHTML = `
            <button class="block-btn drag-btn" title="Drag">
                <i class="fas fa-grip-vertical"></i>
            </button>
            <button class="block-btn delete-btn" title="Delete">
                <i class="fas fa-trash"></i>
            </button>
        `;
        block.appendChild(controls);

        controls.querySelector(".delete-btn").addEventListener("click", () => {
            this.deleteBlock(block);
        });

        // Optional: Make drag button explicitly start drag
        const dragBtn = controls.querySelector(".drag-btn");
        dragBtn.addEventListener("mousedown", (e) => {
            block.draggable = true; // Ensure it's draggable when using handle
        });
    }

    createParagraphBlock(content = "") {
        const block = this.createBaseBlock("paragraph");
        const editable = document.createElement("div");
        editable.className = "editable";
        editable.contentEditable = "true";
        editable.spellcheck = true;
        editable.innerHTML = content || "<p><br></p>";
        block.appendChild(editable);
        this.insertBlockAtCursor(block);
        editable.focus();
        return block;
    }

    createHeadingBlock(content = "Heading") {
        const block = this.createBaseBlock("heading");
        const heading = document.createElement("h2");
        heading.className = "editable";
        heading.contentEditable = "true";
        heading.innerHTML = content;
        block.appendChild(heading);
        this.insertBlockAtCursor(block);
        heading.focus();
        return block;
    }

    createImageBlock(src) {
        const block = this.createBaseBlock("image");
        block.innerHTML += `
            <div class="image-container">
                <img src="${src}" class="editor-image" draggable="false">
                <div class="resize-handle"></div>
            </div>
        `;
        this.insertBlockAtCursor(block);
        return block;
    }

    createVideoBlock(videoUrl) {
        const block = this.createBaseBlock("video");
        block.innerHTML += `
            <div class="video-container">
                <iframe src="${videoUrl}" frameborder="0" allowfullscreen></iframe>
            </div>
        `;
        this.insertBlockAtCursor(block);
        return block;
    }

    createFileBlock(fileName, fileUrl) {
        const block = this.createBaseBlock("file");
        block.innerHTML += `
            <div class="file-container">
                <i class="fas fa-file"></i>
                <a href="${fileUrl}" target="_blank">${fileName}</a>
            </div>
        `;
        this.insertBlockAtCursor(block);
        return block;
    }

    insertBlockAtCursor(block) {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const currentBlock = range.startContainer.parentElement?.closest(".editor-block");
            if (currentBlock) {
                currentBlock.after(block);
                return;
            }
        }
        this.editor.appendChild(block);
    }

    deleteBlock(block) {
        if (!block) return;
        block.style.transition = "all 0.2s ease";
        block.style.opacity = "0";
        block.style.transform = "scale(0.9)";
        setTimeout(() => block.remove(), 200);
    }

    duplicateBlock(block) {
        const clone = block.cloneNode(true);
        clone.dataset.blockId = this.generateBlockId();
        block.after(clone);
    }

    moveBlockUp(block) {
        const previous = block.previousElementSibling;
        if (previous) block.after(previous); // Fixed logic
    }

    moveBlockDown(block) {
        const next = block.nextElementSibling;
        if (next) next.after(block);
    }

    exportBlocks() {
        const blocks = [];
        this.editor.querySelectorAll(".editor-block").forEach(block => {
            const type = block.dataset.blockType;
            const data = { type };

            if (type === "paragraph" || type === "heading") {
                data.content = block.querySelector(".editable").innerHTML;
            } else if (type === "image") {
                data.src = block.querySelector("img").src;
            } else if (type === "video") {
                data.src = block.querySelector("iframe").src;
            } else if (type === "file") {
                data.url = block.querySelector("a").href;
            }
            blocks.push(data);
        });
        return blocks;
    }
}

/* =========================================================
   INITIALIZE BLOCK ENGINE
========================================================= */
window.blockEngine = new BlockEngine(document.getElementById("editor"));