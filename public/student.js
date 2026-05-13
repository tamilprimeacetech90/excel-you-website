<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <meta
        name="theme-color"
        content="#07111f"
    >

    <title>
        EXCEL YOU — Student Learning
    </title>

    <link
        rel="icon"
        type="image/png"
        href="/assets/logo/favicon.png"
    >

    <link rel="preconnect" href="https://fonts.googleapis.com">

    <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossorigin
    >

    <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
    >

    <style>

        :root {

            --bg: #f8fafc;
            --card: rgba(255,255,255,0.75);
            --text: #07111f;
            --muted: #64748b;
            --border: rgba(15,23,42,0.08);
            --glass: rgba(255,255,255,0.55);

            --primary: #2563eb;
            --secondary: #7c3aed;

        }

        [data-theme="dark"] {

            --bg: #07111f;
            --card: rgba(255,255,255,0.06);
            --text: #ffffff;
            --muted: #94a3b8;
            --border: rgba(255,255,255,0.08);
            --glass: rgba(255,255,255,0.05);

            --primary: #38bdf8;
            --secondary: #8b5cf6;

        }

        * {

            margin: 0;
            padding: 0;
            box-sizing: border-box;

        }

        body {

            font-family: 'Poppins', sans-serif;

            background: var(--bg);

            color: var(--text);

            overflow-x: hidden;

        }

        .topbar {

            width: 100%;

            position: sticky;

            top: 0;

            z-index: 1000;

            display: flex;

            justify-content: space-between;

            align-items: center;

            padding: 14px 5%;

            backdrop-filter: blur(18px);

            background: rgba(6,11,20,0.72);

            border-bottom: 1px solid var(--border);

        }

        .logo-img {

            width: 180px;

        }

        .controls {

            display: flex;

            align-items: center;

            gap: 12px;

        }

        .controls input,
        .controls select {

            padding: 12px 16px;

            border-radius: 14px;

            border: 1px solid var(--border);

            background: var(--glass);

            color: var(--text);

            outline: none;

        }

        .theme-btn,
        .mobile-btn {

            width: 48px;
            height: 48px;

            border: none;

            border-radius: 50%;

            cursor: pointer;

            background: linear-gradient(
                135deg,
                var(--primary),
                var(--secondary)
            );

            color: white;

            font-size: 18px;

        }

        .mobile-btn {

            display: none;

        }

        .hero {

            padding: 70px 8% 40px;

            text-align: center;

        }

        .hero h1 {

            font-size: 60px;

            margin-bottom: 18px;

        }

        .hero h1 span {

            background: linear-gradient(
                135deg,
                #60a5fa,
                #a855f7
            );

            -webkit-background-clip: text;

            -webkit-text-fill-color: transparent;

        }

        .hero p {

            color: var(--muted);

            max-width: 700px;

            margin: auto;

            line-height: 1.8;

        }

        .main-layout {

            display: grid;

            grid-template-columns: 320px 1fr;

            gap: 24px;

            padding: 0 5% 60px;

        }

        .sidebar {

            position: sticky;

            top: 100px;

            height: calc(100vh - 120px);

            overflow-y: auto;

            background: var(--card);

            border: 1px solid var(--border);

            border-radius: 28px;

            padding: 24px;

            backdrop-filter: blur(18px);

        }

        .sidebar-header {

            margin-bottom: 24px;

        }

        .subject-card,
        .topic-card {

            background: var(--glass);

            border: 1px solid var(--border);

            border-radius: 18px;

            padding: 18px;

            margin-bottom: 16px;

            cursor: pointer;

            transition: 0.3s;

        }

        .subject-card:hover,
        .topic-card:hover {

            transform: translateY(-4px);

        }

        .subject-card.active,
        .topic-card.active {

            border-color: #60a5fa;

        }

        .subject-card h3,
        .topic-card h3 {

            margin-bottom: 10px;

        }

        .subject-card p,
        .topic-card p {

            color: var(--muted);

            line-height: 1.7;

            font-size: 14px;

        }

        .welcome-box,
        .topic-box,
        .lesson-viewer {

            background: var(--card);

            border: 1px solid var(--border);

            border-radius: 28px;

            padding: 32px;

            margin-bottom: 24px;

            backdrop-filter: blur(18px);

        }

        .lesson-header {

            margin-bottom: 30px;

            border-bottom: 1px solid var(--border);

            padding-bottom: 20px;

        }

        .lesson-content {

            line-height: 1.9;

            color: var(--muted);

        }

        .lesson-content h1,
        .lesson-content h2,
        .lesson-content h3 {

            color: var(--text);

            margin-top: 24px;
            margin-bottom: 16px;

        }

        .lesson-content p {

            margin-bottom: 18px;

        }

        .lesson-content img {

            max-width: 100%;

            border-radius: 20px;

            margin: 24px 0;

        }

        .lesson-content iframe {

            width: 100%;

            min-height: 420px;

            border: none;

            border-radius: 20px;

            margin-top: 20px;

        }

        .skeleton {

            width: 100%;

            height: 120px;

            border-radius: 20px;

            margin-bottom: 16px;

            background: linear-gradient(
                90deg,
                rgba(255,255,255,0.04),
                rgba(255,255,255,0.10),
                rgba(255,255,255,0.04)
            );

            background-size: 300% 100%;

            animation: shimmer 1.5s infinite;

        }

        @keyframes shimmer {

            0% {

                background-position: 200% 0;

            }

            100% {

                background-position: -200% 0;

            }

        }

        .hidden {

            display: none;

        }

        footer {

            text-align: center;

            padding: 40px 20px;

            color: var(--muted);

            border-top: 1px solid var(--border);

        }

        @media(max-width:992px){

            .main-layout {

                grid-template-columns: 1fr;

            }

            .sidebar {

                position: fixed;

                left: -100%;

                top: 90px;

                width: 300px;

                z-index: 999;

                transition: 0.3s;

            }

            .sidebar.active {

                left: 20px;

            }

            .mobile-btn {

                display: block;

            }

        }

        @media(max-width:768px){

            .topbar {

                flex-direction: column;

                gap: 16px;

            }

            .controls {

                width: 100%;

                flex-wrap: wrap;

            }

            #search {

                width: 100%;

            }

            .hero h1 {

                font-size: 42px;

            }

        }

    </style>

</head>

<body data-theme="dark">

    <!-- TOPBAR -->

    <header class="topbar">

        <a href="/">

            <img
                src="/assets/logo/full-logo-white.png"
                alt="EXCEL YOU"
                class="logo-img"
                id="siteLogo"
            >

        </a>

        <div class="controls">

            <button
                class="mobile-btn"
                id="mobileBtn"
            >
                ☰
            </button>

            <select id="lang">

                <option value="en">
                    English
                </option>

                <option value="ta">
                    Tamil
                </option>

            </select>

            <input
                type="text"
                id="search"
                placeholder="Search subjects..."
            >

            <button
                class="theme-btn"
                id="themeBtn"
            >
                🌙
            </button>

        </div>

    </header>

    <!-- HERO -->

    <section class="hero">

        <h1>

            Learn Smarter With
            <span>EXCEL YOU</span>

        </h1>

        <p>

            Explore modern Tamil + English
            learning experiences with structured
            subjects and lessons.

        </p>

    </section>

    <!-- MAIN -->

    <main class="main-layout">

        <!-- SIDEBAR -->

        <aside
            class="sidebar"
            id="sidebar"
        >

            <div class="sidebar-header">

                <h2>
                    📚 Subjects
                </h2>

            </div>

            <div id="subjectContainer">

                <div class="skeleton"></div>
                <div class="skeleton"></div>
                <div class="skeleton"></div>

            </div>

        </aside>

        <!-- CONTENT -->

        <section>

            <!-- WELCOME -->

            <div
                class="welcome-box"
                id="welcomeBox"
            >

                <h2>
                    Welcome Student 👋
                </h2>

                <p>

                    Select a subject to start learning.

                </p>

            </div>

            <!-- TOPICS -->

            <div
                class="topic-box hidden"
                id="topicContainer"
            >

                <h2>
                    📘 Topics
                </h2>

                <div
                    class="topics-grid"
                    id="topicsGrid"
                ></div>

            </div>

            <!-- LESSON -->

            <div
                class="lesson-viewer hidden"
                id="lessonViewer"
            >

                <div class="lesson-header">

                    <h1 id="lessonTitle">

                        Lesson Title

                    </h1>

                </div>

                <div
                    class="lesson-content"
                    id="lessonContent"
                ></div>

            </div>

        </section>

    </main>

    <!-- FOOTER -->

    <footer>

        © 2026 EXCEL YOU —
        Modern Tamil + English Learning Platform

    </footer>

    <!-- STUDENT JS -->

    <script src="/js/student.js"></script>

</body>
</html>