class BlockEngine {

constructor(editor) {

    this.editor = editor;
    this.blockId = 0;

    this.init();
}

init() {

    console.log(
        "Block Engine Initialized ✔"
    );
}

generateBlockId() {

    this.blockId++;

    return `block-${this.blockId}`;
}

/* =====================================================
   BASE BLOCK
===================================================== */

createBaseBlock(type) {

    const block =
        document.createElement("div");

    block.className =
        `editor-block ${type}-block`;

    block.dataset.blockId =
        this.generateBlockId();

    block.dataset.blockType =
        type;

    this.addBlockControls(block);

    return block;
}

/* =====================================================
   CONTROLS
===================================================== */

addBlockControls(block) {

    const controls =
        document.createElement("div");

    controls.className =
        "block-controls";

    controls.innerHTML = `

        <button
            class="block-btn delete-btn"
            title="Delete">

            <i class="fas fa-trash"></i>

        </button>

    `;

    block.appendChild(
        controls
    );

    controls
        .querySelector(".delete-btn")
        .addEventListener(
            "click",
            () => {

                this.deleteBlock(block);
            }
        );
}

/* =====================================================
   PARAGRAPH
===================================================== */

createParagraphBlock(content = "") {

    const block =
        this.createBaseBlock(
            "paragraph"
        );

    const editable =
        document.createElement("div");

    editable.className =
        "editable";

    editable.contentEditable =
        "true";

    editable.spellcheck =
        true;

    editable.innerHTML =
        content || "<p><br></p>";

    block.appendChild(
        editable
    );

    this.insertBlockAtCursor(
        block
    );

    editable.focus();

    return block;
}

/* =====================================================
   HEADING
===================================================== */

createHeadingBlock(
    content = "Heading"
) {

    const block =
        this.createBaseBlock(
            "heading"
        );

    const heading =
        document.createElement("h2");

    heading.className =
        "editable";

    heading.contentEditable =
        "true";

    heading.innerHTML =
        content;

    block.appendChild(
        heading
    );

    this.insertBlockAtCursor(
        block
    );

    heading.focus();

    return block;
}

/* =====================================================
   IMAGE
===================================================== */

createImageBlock(src) {

    const block =
        this.createBaseBlock(
            "image"
        );

    const container =
        document.createElement(
            "div"
        );

    container.className =
        "image-container";

    const image =
        document.createElement(
            "img"
        );

    image.src = src;

    image.className =
        "editor-image";

    image.draggable =
        false;

    container.appendChild(
        image
    );

    block.appendChild(
        container
    );

    this.insertBlockAtCursor(
        block
    );

    return block;
}

/* =====================================================
   VIDEO
===================================================== */

createVideoBlock(videoUrl) {

    const block =
        this.createBaseBlock(
            "video"
        );

    const container =
        document.createElement(
            "div"
        );

    container.className =
        "video-container";

    const iframe =
        document.createElement(
            "iframe"
        );

    iframe.src =
        videoUrl;

    iframe.allowFullscreen =
        true;

    iframe.draggable =
        false;

    container.appendChild(
        iframe
    );

    block.appendChild(
        container
    );

    this.insertBlockAtCursor(
        block
    );

    return block;
}

/* =====================================================
   FILE
===================================================== */

createFileBlock(
    fileName,
    fileUrl
) {

    const block =
        this.createBaseBlock(
            "file"
        );

    const container =
        document.createElement(
            "div"
        );

    container.className =
        "file-container";

    container.innerHTML = `

        <i class="fas fa-file"></i>

        <a
            href="${fileUrl}"
            target="_blank">

            ${fileName}

        </a>

    `;

    block.appendChild(
        container
    );

    this.insertBlockAtCursor(
        block
    );

    return block;
}

/* =====================================================
   INSERT
===================================================== */

insertBlockAtCursor(
    block
) {

    const selection =
        window.getSelection();

    if (
        selection &&
        selection.rangeCount > 0
    ) {

        const range =
            selection.getRangeAt(
                0
            );

        const currentBlock =
            range.startContainer
                .parentElement
                ?.closest(
                    ".editor-block"
                );

        if (
            currentBlock
        ) {

            currentBlock.after(
                block
            );

            return;
        }
    }

    this.editor.appendChild(
        block
    );
}

/* =====================================================
   DELETE
===================================================== */

deleteBlock(block) {

    if (!block) {
        return;
    }

    block.style.opacity =
        "0";

    block.style.transform =
        "scale(.9)";

    setTimeout(() => {

        block.remove();

    }, 200);
}

/* =====================================================
   EXPORT
===================================================== */

exportBlocks() {

    const blocks = [];

    this.editor
        .querySelectorAll(
            ".editor-block"
        )
        .forEach(block => {

            blocks.push({

                id:
                    block.dataset
                        .blockId,

                type:
                    block.dataset
                        .blockType
            });
        });

    return blocks;
}

}

);
