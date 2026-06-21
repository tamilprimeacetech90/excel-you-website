function openArticlePreview() {
const editor =
    document.getElementById(
        "editor"
    );

if (!editor) {
    return;
}

// Clone editor content
const articleContent =
    editor.innerHTML;

// Title
const articleTitle =
    document.getElementById(
        "articleTitle"
    )?.value ||
    "Untitled Article";

// Open preview window
const previewWindow =
    window.open(
        "",
        "_blank"
    );

if (!previewWindow) {

    alert(
        "Popup blocked"
    );

    return;
}

previewWindow.document.write(`

<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8">

<meta
name="viewport"
content="width=device-width, initial-scale=1.0">

<title>
${articleTitle}
</title>

<style>

*{
    margin:0;
    padding:0;
    box-sizing:border-box;
}

body{

    font-family:
        Inter,
        Arial,
        sans-serif;

    background:#f8f9fb;

    color:#222;

    line-height:1.8;
}

.article-wrapper{

    max-width:900px;

    margin:50px auto;

    background:#fff;

    padding:50px;

    border-radius:16px;

    box-shadow:
        0 10px 30px rgba(
            0,0,0,.08
        );
}

.article-title{

    font-size:42px;

    font-weight:700;

    margin-bottom:30px;
}

.editor-block{

    margin-bottom:30px;
}

.paragraph-block{

    font-size:18px;
}

.heading-block h1,
.heading-block h2,
.heading-block h3{

    margin-top:30px;
    margin-bottom:20px;
}

.editor-image{

    width:100%;

    display:block;

    border-radius:12px;

    margin:20px auto;
}

.video-container{

    position:relative;

    width:100%;

    padding-top:56.25%;
}

.video-container iframe{

    position:absolute;

    top:0;
    left:0;

    width:100%;
    height:100%;
}

.image-caption{

    text-align:center;

    margin-top:10px;

    color:#777;

    font-size:14px;
}

.media-controls,
.block-controls,
.resize-handle{

    display:none !important;
}

</style>

</head>

<body>

<div class="article-wrapper">

<h1 class="article-title">
${articleTitle}
</h1>

${articleContent}

</div>

</body>

</html>

`);

previewWindow.document.close();

}
