/* =========================================================
   EXCEL YOU EDITOR CONSTANTS
========================================================= */

/* =========================================================
   APP
========================================================= */

const APP_NAME =
    "EXCEL YOU";

const APP_VERSION =
    "1.0.0";

/* =========================================================
   EDITOR
========================================================= */

const EDITOR_ID =
    "editor";

const EDITOR_SELECTOR =
    "#editor";

const AUTO_SAVE_DELAY =
    2000;

const MAX_HISTORY =
    100;

const MAX_BACKUPS =
    10;

/* =========================================================
   API
========================================================= */

const API = {

    SAVE_ARTICLE:
        "/api/admin/article/save",

    PUBLISH_ARTICLE:
        "/api/admin/article/publish",

    UPLOAD_IMAGE:
        "/api/admin/upload/image",

    UPLOAD_VIDEO:
        "/api/admin/upload/video",

    UPLOAD_FILE:
        "/api/admin/upload/file",

    MEDIA_LIBRARY:
        "/api/admin/media"
};

/* =========================================================
   STORAGE
========================================================= */

const STORAGE_KEYS = {

    THEME:
        "excelYouTheme",

    DRAFT:
        "excelYouDraft",

    BACKUP:
        "excelYouBackup",

    HISTORY:
        "excelYouHistory"
};

/* =========================================================
   BLOCK TYPES
========================================================= */

const BLOCK_TYPES = {

    PARAGRAPH:
        "paragraph",

    HEADING:
        "heading",

    IMAGE:
        "image",

    VIDEO:
        "video",

    CODE:
        "code",

    FILE:
        "file"
};

/* =========================================================
   CSS CLASSES
========================================================= */

const CLASSES = {

    EDITOR_BLOCK:
        "editor-block",

    PARAGRAPH_BLOCK:
        "paragraph-block",

    HEADING_BLOCK:
        "heading-block",

    IMAGE_BLOCK:
        "image-block",

    VIDEO_BLOCK:
        "video-block",

    CODE_BLOCK:
        "code-block",

    FILE_BLOCK:
        "file-block",

    SELECTED:
        "selected",

    DRAGGING:
        "dragging",

    RESIZING:
        "resizing"
};

/* =========================================================
   IMAGE SETTINGS
========================================================= */

const IMAGE = {

    MAX_SIZE:
        5 * 1024 * 1024,

    ALLOWED_TYPES: [

        "image/jpeg",

        "image/png",

        "image/webp",

        "image/gif"
    ],

    MAX_WIDTH:
        3000,

    MAX_HEIGHT:
        3000
};

/* =========================================================
   VIDEO SETTINGS
========================================================= */

const VIDEO = {

    MAX_SIZE:
        200 * 1024 * 1024,

    ALLOWED_TYPES: [

        "video/mp4",

        "video/webm",

        "video/ogg"
    ],

    YOUTUBE_REGEX:
        /(?:youtube\.com|youtu\.be)/,

    VIMEO_REGEX:
        /vimeo\.com/
};

/* =========================================================
   FILE SETTINGS
========================================================= */

const FILES = {

    MAX_SIZE:
        50 * 1024 * 1024,

    ALLOWED_TYPES: [

        "application/pdf",

        "application/zip",

        "application/x-zip-compressed",

        "application/msword",

        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ]
};

/* =========================================================
   SEO
========================================================= */

const SEO = {

    MAX_TITLE:
        60,

    MAX_DESCRIPTION:
        160,

    MIN_CONTENT:
        300
};

/* =========================================================
   SHORTCUTS
========================================================= */

const SHORTCUTS = {

    SAVE:
        "Ctrl+S",

    BOLD:
        "Ctrl+B",

    ITALIC:
        "Ctrl+I",

    UNDERLINE:
        "Ctrl+U",

    UNDO:
        "Ctrl+Z",

    REDO:
        "Ctrl+Y",

    PREVIEW:
        "Ctrl+P"
};

/* =========================================================
   TOOLBAR ACTIONS
========================================================= */

const TOOLBAR_ACTIONS = {

    BOLD:
        "bold",

    ITALIC:
        "italic",

    UNDERLINE:
        "underline",

    STRIKE:
        "strikeThrough",

    H1:
        "h1",

    H2:
        "h2",

    H3:
        "h3",

    LINK:
        "link",

    IMAGE:
        "image",

    VIDEO:
        "video",

    CODE:
        "code",

    FILE:
        "file"
};

/* =========================================================
   NOTIFICATION TYPES
========================================================= */

const NOTIFICATION_TYPES = {

    SUCCESS:
        "success",

    ERROR:
        "error",

    WARNING:
        "warning",

    INFO:
        "info"
};

/* =========================================================
   MODAL TYPES
========================================================= */

const MODAL_TYPES = {

    ALERT:
        "alert",

    CONFIRM:
        "confirm",

    IMAGE:
        "image",

    VIDEO:
        "video"
};

/* =========================================================
   PREVIEW MODES
========================================================= */

const PREVIEW_MODES = {

    DESKTOP:
        "desktop",

    TABLET:
        "tablet",

    MOBILE:
        "mobile"
};

/* =========================================================
   EXPORT
========================================================= */

window.EditorConstants = {

    APP_NAME,

    APP_VERSION,

    EDITOR_ID,

    EDITOR_SELECTOR,

    AUTO_SAVE_DELAY,

    MAX_HISTORY,

    MAX_BACKUPS,

    API,

    STORAGE_KEYS,

    BLOCK_TYPES,

    CLASSES,

    IMAGE,

    VIDEO,

    FILES,

    SEO,

    SHORTCUTS,

    TOOLBAR_ACTIONS,

    NOTIFICATION_TYPES,

    MODAL_TYPES,

    PREVIEW_MODES
};

console.log(
    "Constants Loaded ✔"
);
