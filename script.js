const mainImage = document.getElementById("mainImage");
const menuCanvas = document.getElementById("menuCanvas");
const touchLayer = document.getElementById("touchLayer");
const song = document.getElementById("song");

const images = {
    1: document.getElementById("img1"),
    2: document.getElementById("img2"),
    3: document.getElementById("img3"),
    4: document.getElementById("img4"),
    5: document.getElementById("img5"),
    6: document.getElementById("img6"),
    7: document.getElementById("img7"),
    8: document.getElementById("img8"),
    9: document.getElementById("img9"),
    10: document.getElementById("img10")
};


/* ==============================
   SONG SETTINGS
   ============================== */

const SONG_START = 109; // 1:49
const SONG_END = 242;   // 4:02


/* ==============================
   LETTER STATE
   ============================== */

let letter1Open = false;
let letter2Open = false;
let letter3Open = false;

let currentScreen = "intro";
let transitionLock = false;
let songStarted = false;


/* ==============================
   SHOW NORMAL IMAGE
   ============================== */

function showImage(number) {

    menuCanvas.style.display = "none";
    mainImage.style.display = "block";

    mainImage.src = images[number].src;
}


/* ==============================
   DRAW THE LETTER MENU
   ============================== */

function drawMenu() {

    mainImage.style.display = "none";
    menuCanvas.style.display = "block";

    const ctx = menuCanvas.getContext("2d");

    const base = images[2];

    menuCanvas.width = base.naturalWidth;
    menuCanvas.height = base.naturalHeight;

    ctx.clearRect(
        0,
        0,
        menuCanvas.width,
        menuCanvas.height
    );

    /*
       ALWAYS START WITH CLOSED MENU
    */

    ctx.drawImage(
        base,
        0,
        0,
        menuCanvas.width,
        menuCanvas.height
    );


    /*
       LETTER 1
       "Open when you think of us"

       After opening:
       ONE torn paper.
    */

    if (letter1Open) {

        drawTornLetter(
            ctx,
            images[4],
            1
        );
    }


    /*
       LETTER 2
       "Open when you feel insecure"

       After opening:
       TWO torn papers.

       Letter 1 stays torn if already opened.
    */

    if (letter2Open) {

        drawTornLetter(
            ctx,
            images[6],
            2
        );
    }


    /*
       LETTER 3
       "Open when you are sad"

       After opening:
       THREE torn papers.

       Letters 1 and 2 stay torn.
    */

    if (letter3Open) {

        drawTornLetter(
            ctx,
            images[8],
            3
        );
    }
}


/* ==============================
   DRAW TORN PAPER
   ============================== */

function drawTornLetter(ctx, tornImage, letterNumber) {

    const W = menuCanvas.width;
    const H = menuCanvas.height;


    /*
       LETTER 1
       TOP-LEFT
    */

    if (letterNumber === 1) {

        ctx.drawImage(
            tornImage,
            0,
            0,
            W * 0.50,
            H * 0.50,

            0,
            0,
            W * 0.50,
            H * 0.50
        );
    }


    /*
       LETTER 2
       TOP-RIGHT
    */

    if (letterNumber === 2) {

        ctx.drawImage(
            tornImage,

            W * 0.50,
            0,
            W * 0.50,
            H * 0.50,

            W * 0.50,
            0,
            W * 0.50,
            H * 0.50
        );
    }


    /*
       LETTER 3
       BOTTOM-LEFT
    */

    if (letterNumber === 3) {

        ctx.drawImage(
            tornImage,

            0,
            H * 0.50,
            W * 0.50,
            H * 0.50,

            0,
            H * 0.50,
            W * 0.50,
            H * 0.50
        );
    }
}


/* ==============================
   GET TAP POSITION
   ============================== */

function getTapPosition(event) {

    const rect = touchLayer.getBoundingClientRect();

    return {
        x: (event.clientX - rect.left) / rect.width,
        y: (event.clientY - rect.top) / rect.height
    };
}


/* ==============================
   FIND WHICH LETTER WAS TAPPED
   ============================== */

function getLetterAt(x, y) {

    /*
       LETTER 1
    */

    if (
        x >= 0.05 &&
        x <= 0.48 &&
        y >= 0.05 &&
        y <= 0.48
    ) {
        return 1;
    }


    /*
       LETTER 2
    */

    if (
        x >= 0.52 &&
        x <= 0.95 &&
        y >= 0.05 &&
        y <= 0.48
    ) {
        return 2;
    }


    /*
       LETTER 3
    */

    if (
        x >= 0.05 &&
        x <= 0.48 &&
        y >= 0.52 &&
        y <= 0.95
    ) {
        return 3;
    }


    /*
       LETTER 4
    */

    if (
        x >= 0.52 &&
        x <= 0.95 &&
        y >= 0.52 &&
        y <= 0.95
    ) {
        return 4;
    }


    return null;
}


/* ==============================
   SCREEN CHANGE
   ============================== */

function changeScreen(callback) {

    if (transitionLock) return;

    transitionLock = true;

    mainImage.style.visibility = "hidden";
    menuCanvas.style.visibility = "hidden";

    setTimeout(() => {

        callback();

        requestAnimationFrame(() => {

            mainImage.style.visibility = "visible";
            menuCanvas.style.visibility = "visible";

            setTimeout(() => {
                transitionLock = false;
            }, 180);

        });

    }, 120);
}


/* ==============================
   OPEN LETTER
   ============================== */

function openLetter(number) {

    /*
       LETTER 1
    */

    if (number === 1) {

        currentScreen = "letter1";

        changeScreen(() => {
            showImage(3);
        });

        return;
    }


    /*
       LETTER 2
    */

    if (number === 2) {

        currentScreen = "letter2";

        changeScreen(() => {
            showImage(5);
        });

        return;
    }


    /*
       LETTER 3
    */

    if (number === 3) {

        currentScreen = "letter3";

        changeScreen(() => {
            showImage(7);
        });

        return;
    }


    /*
       LETTER 4

       No tear.
       No progress state.
    */

    if (number === 4) {

        currentScreen = "letter4";

        changeScreen(() => {
            showImage(9);
        });

        return;
    }
}


/* ==============================
   EXIT LETTER
   ============================== */

function exitLetter(number) {

    /*
       Once opened, it NEVER closes again.
    */

    if (number === 1) {
        letter1Open = true;
    }

    if (number === 2) {
        letter2Open = true;
    }

    if (number === 3) {
        letter3Open = true;
    }


    /*
       Letter 4 does nothing here.
    */

    currentScreen = "menu";

    changeScreen(() => {
        drawMenu();
    });
}


/* ==============================
   FINAL SONG SCREEN
   ============================== */

function showFinalSongScreen() {

    currentScreen = "song";

    changeScreen(() => {
        showImage(10);
    });
}


/* ==============================
   START SONG
   ============================== */

function startSong() {

    songStarted = true;

    song.pause();

    song.currentTime = SONG_START;

    song.play().catch(() => {});
}


/* ==============================
   RESET EVERYTHING
   ============================== */

function resetProject() {

    song.pause();

    try {
        song.currentTime = 0;
    } catch (error) {}

    songStarted = false;

    /*
       EVERYTHING GOES BACK TO CLOSED
    */

    letter1Open = false;
    letter2Open = false;
    letter3Open = false;

    currentScreen = "intro";

    changeScreen(() => {
        showImage(1);
    });
}


/* ==============================
   MAIN TAP HANDLER
   ============================== */

touchLayer.addEventListener("pointerup", function(event) {

    event.preventDefault();

    if (transitionLock) return;

    const position = getTapPosition(event);

    const x = position.x;
    const y = position.y;


    /*
       INTRO
    */

    if (currentScreen === "intro") {

        currentScreen = "menu";

        changeScreen(() => {
            drawMenu();
        });

        return;
    }


    /*
       MENU
    */

    if (currentScreen === "menu") {

        const letter = getLetterAt(x, y);

        if (letter !== null) {
            openLetter(letter);
        }

        return;
    }


    /*
       LETTER 1
    */

    if (currentScreen === "letter1") {

        exitLetter(1);

        return;
    }


    /*
       LETTER 2
    */

    if (currentScreen === "letter2") {

        exitLetter(2);

        return;
    }


    /*
       LETTER 3
    */

    if (currentScreen === "letter3") {

        exitLetter(3);

        return;
    }


    /*
       LETTER 4
    */

    if (currentScreen === "letter4") {

        showFinalSongScreen();

        return;
    }


    /*
       FINAL CHARR KADAM SCREEN
    */

    if (currentScreen === "song") {

        if (!songStarted) {

            startSong();

        } else {

            resetProject();
        }

        return;
    }

});


/* ==============================
   SONG END
   ============================== */

song.addEventListener("timeupdate", function() {

    if (!songStarted) return;

    if (song.currentTime >= SONG_END) {

        song.pause();

        /*
           Do NOT reset the project.
           Stay on Chaar Kadam screen.
        */

        song.currentTime = SONG_START;
    }

});


/* ==============================
   INITIALISE
   ============================== */

function initialise() {

    letter1Open = false;
    letter2Open = false;
    letter3Open = false;

    songStarted = false;

    currentScreen = "intro";

    showImage(1);
}


/* ==============================
   WAIT FOR ALL 10 IMAGES
   ============================== */

let loadedCount = 0;

Object.values(images).forEach(img => {

    if (img.complete) {

        loadedCount++;

    } else {

        img.addEventListener("load", () => {

            loadedCount++;

            if (loadedCount === 10) {
                initialise();
            }

        });
    }

});


if (loadedCount === 10) {
    initialise();
}