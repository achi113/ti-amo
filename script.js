/* =========================================
   🌙 JULY'S PLANET 2.0
   Script principale
========================================= */


/* =========================================
   AUDIO ENGINE
========================================= */

let audioEnabled = true;
let audioContext = null;

function initAudio() {
    if (!audioContext) {
        audioContext = new (
            window.AudioContext ||
            window.webkitAudioContext
        )();
    }

    if (audioContext.state === "suspended") {
        audioContext.resume();
    }
}


function playSFX(type = "click") {

    if (!audioEnabled) return;

    initAudio();

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    let frequency = 440;
    let duration = 0.15;
    let wave = "sine";

    switch (type) {

        case "click":
            frequency = 440;
            duration = 0.10;
            break;

        case "pop":
            frequency = 620;
            duration = 0.12;
            wave = "sine";
            break;

        case "flip":
            frequency = 330;
            duration = 0.12;
            wave = "triangle";
            break;

        case "success":
            frequency = 720;
            duration = 0.25;
            wave = "triangle";
            break;

        case "water":
            frequency = 520;
            duration = 0.18;
            break;

        case "sun":
            frequency = 760;
            duration = 0.25;
            break;

        case "block":
            frequency = 390;
            duration = 0.12;
            break;

        case "line":
            frequency = 900;
            duration = 0.30;
            wave = "triangle";
            break;

        case "gameover":
            frequency = 180;
            duration = 0.40;
            wave = "sawtooth";
            break;
    }

    oscillator.type = wave;
    oscillator.frequency.setValueAtTime(
        frequency,
        audioContext.currentTime
    );

    gain.gain.setValueAtTime(
        0.0001,
        audioContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
        0.12,
        audioContext.currentTime + 0.01
    );

    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        audioContext.currentTime + duration
    );

    oscillator.start();

    oscillator.stop(
        audioContext.currentTime + duration + 0.02
    );
}


/* =========================================
   UTILITY
========================================= */

const $ = selector =>
    document.querySelector(selector);

const $$ = selector =>
    [...document.querySelectorAll(selector)];


function showScreen(id) {

    $$(".screen").forEach(screen => {
        screen.classList.remove("active");
    });

    const screen = $("#" + id);

    if (screen) {
        screen.classList.add("active");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    if (id === "bubble") {
        initBubble();
    }

    if (id === "stars") {
        initStars();
    }

    if (id === "memory") {
        initMemory();
    }

    if (id === "blocks") {
        initBlocks();
    }
}


function showToast(message) {

    const toast = $("#toast");

    if (!toast) return;

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 1600);
}


/* =========================================
   NAVIGAZIONE
========================================= */

$$("[data-go]").forEach(button => {

    button.addEventListener("click", () => {

        playSFX("click");

        showScreen(
            button.dataset.go
        );

    });

});


$$(".game-card").forEach(button => {

    button.addEventListener("click", () => {

        playSFX("click");

        showScreen(
            button.dataset.game
        );

    });

});


/* =========================================
   AUDIO BUTTON
========================================= */

const soundButton = $("#soundBtn");

if (soundButton) {

    soundButton.addEventListener(
        "click",
        () => {

            audioEnabled = !audioEnabled;

            soundButton.textContent =
                audioEnabled
                    ? "🔊"
                    : "🔇";

            if (audioEnabled) {
                playSFX("click");
            }

        }
    );

}


/* =========================================
   🫧 BUBBLE POP
========================================= */

let bubbleScore = 0;


function initBubble() {

    const arena = $("#bubbleArena");

    if (!arena) return;

    arena.innerHTML = "";

    bubbleScore = 0;

    $("#bubbleScore").textContent =
        bubbleScore;


    for (let i = 0; i < 10; i++) {

        createBubble(arena);

    }

}


function createBubble(arena) {

    const bubble =
        document.createElement("button");

    bubble.className = "bubble";

    const size =
        38 + Math.random() * 55;

    bubble.style.width =
        size + "px";

    bubble.style.height =
        size + "px";

    bubble.style.left =
        Math.random() *
        Math.max(1, arena.clientWidth - size)
        + "px";

    bubble.style.top =
        Math.random() *
        Math.max(1, arena.clientHeight - size)
        + "px";


    bubble.addEventListener(
        "click",
        () => {

            if (
                bubble.classList.contains(
                    "pop"
                )
            ) {
                return;
            }


            bubble.classList.add("pop");

            playSFX("pop");

            bubbleScore++;

            $("#bubbleScore").textContent =
                bubbleScore;


            setTimeout(() => {

                bubble.remove();

                createBubble(arena);

            }, 250);

        }
    );


    arena.appendChild(bubble);
}


/* =========================================
   🌌 STAR CONNECT
========================================= */

let nextStar = 1;
let previousStar = null;


function initStars() {

    const arena =
        $("#starArena");

    if (!arena) return;

    arena.innerHTML = "";

    nextStar = 1;
    previousStar = null;

    $("#starScore").textContent = "0";


    for (
        let number = 1;
        number <= 8;
        number++
    ) {

        createStar(
            arena,
            number
        );

    }

}


function createStar(
    arena,
    number
) {

    const star =
        document.createElement("button");

    star.className = "star";

    star.textContent =
        number;

    star.style.left =
        (8 + Math.random() * 78)
        + "%";

    star.style.top =
        (7 + Math.random() * 80)
        + "%";


    star.addEventListener(
        "click",
        () => {

            if (number !== nextStar) {

                showToast(
                    "✨ Cerca la stella " +
                    nextStar
                );

                return;
            }


            star.classList.add(
                "done"
            );

            playSFX("click");


            if (previousStar) {

                const x =
                    star.offsetLeft +
                    17 -
                    previousStar.x;

                const y =
                    star.offsetTop +
                    17 -
                    previousStar.y;


                const line =
                    document.createElement("div");

                line.className =
                    "line";

                line.style.width =
                    Math.hypot(x, y) +
                    "px";

                line.style.left =
                    previousStar.x +
                    "px";

                line.style.top =
                    previousStar.y +
                    "px";

                line.style.transform =
                    `rotate(${Math.atan2(y, x)}rad)`;


                arena.appendChild(line);

            }


            previousStar = {

                x:
                    star.offsetLeft + 17,

                y:
                    star.offsetTop + 17

            };


            nextStar++;

            $("#starScore").textContent =
                nextStar - 1;


            if (nextStar === 9) {

                playSFX("success");

                showToast(
                    "🌌 Costellazione completata!"
                );

            }

        }
    );


    arena.appendChild(star);
}


const newStarsButton =
    $("#newStars");

if (newStarsButton) {

    newStarsButton.addEventListener(
        "click",
        () => {

            playSFX("click");

            initStars();

        }
    );

}


/* =========================================
   🃏 MEMORY
========================================= */

const memorySymbols = [
    "💜",
    "🌙",
    "⭐",
    "🌸",
    "🦋",
    "🍓",
    "🐻",
    "☁️"
];


function initMemory() {

    const grid =
        $("#memoryGrid");

    if (!grid) return;

    grid.innerHTML = "";


    let cards = [
        ...memorySymbols,
        ...memorySymbols
    ];


    cards.sort(
        () => Math.random() - 0.5
    );


    let selected = [];


    cards.forEach(symbol => {

        const card =
            document.createElement("button");

        card.className =
            "memory-card";

        card.textContent =
            symbol;


        card.addEventListener(
            "click",
            () => {

                if (
                    card.classList.contains(
                        "open"
                    ) ||
                    card.classList.contains(
                        "matched"
                    ) ||
                    selected.length >= 2
                ) {
                    return;
                }


                playSFX("flip");

                card.classList.add(
                    "open"
                );


                selected.push({
                    card,
                    symbol
                });


                if (
                    selected.length === 2
                ) {

                    if (
                        selected[0].symbol ===
                        selected[1].symbol
                    ) {

                        selected.forEach(item => {

                            item.card.classList.add(
                                "matched"
                            );

                        });


                        playSFX("success");

                        selected = [];


                        const matched =
                            $$(".memory-card.matched")
                                .length;


                        if (matched === 16) {

                            setTimeout(() => {

                                showToast(
                                    "💜 Hai trovato tutte le coppie!"
                                );

                            }, 300);

                        }

                    } else {

                        setTimeout(() => {

                            selected.forEach(item => {

                                item.card.classList.remove(
                                    "open"
                                );

                            });

                            selected = [];

                        }, 700);

                    }

                }

            }
        );


        grid.appendChild(card);

    });

}


const restartMemory =
    $("#restartMemory");

if (restartMemory) {

    restartMemory.addEventListener(
        "click",
        () => {

            playSFX("click");

            initMemory();

        }
    );

}


/* =========================================
   🌱 MINI GARDEN
========================================= */

let growth = 0;


function updateGarden(
    amount,
    message,
    sound
) {

    growth =
        Math.min(
            100,
            growth + amount
        );


    const growthBar =
        $("#growth");

    const plant =
        $("#plant");

    const text =
        $("#gardenText");


    if (growthBar) {

        growthBar.style.width =
            growth + "%";

    }


    if (plant) {

        if (growth < 25) {

            plant.textContent =
                "🌱";

        } else if (growth < 50) {

            plant.textContent =
                "🌿";

        } else if (growth < 75) {

            plant.textContent =
                "🌷";

        } else {

            plant.textContent =
                "🌸";

        }

    }


    if (text) {

        text.textContent =
            message;

    }


    playSFX(sound);


    if (growth >= 100) {

        showToast(
            "🌸 Il tuo fiore è sbocciato!"
        );

    }

}


const waterButton =
    $("#water");

if (waterButton) {

    waterButton.addEventListener(
        "click",
        () => {

            updateGarden(
                12,
                "💧 Il semino ha bevuto un po' d'acqua.",
                "water"
            );

        }
    );

}


const sunButton =
    $("#sun");

if (sunButton) {

    sunButton.addEventListener(
        "click",
        () => {

            updateGarden(
                10,
                "☀️ Il fiore ama il sole.",
                "sun"
            );

        }
    );

}


/* =========================================
   🧱 LOVE BLOCKS
   STILE BLOCK BLAST
========================================= */

const BOARD_SIZE = 8;

let blockBoard = [];

let selectedPiece = null;

let blockScore = 0;


/*
   Forme dei pezzi.
*/

const blockShapes = [

    [
        [0, 0]
    ],

    [
        [0, 0],
        [0, 1]
    ],

    [
        [0, 0],
        [1, 0]
    ],

    [
        [0, 0],
        [0, 1],
        [0, 2]
    ],

    [
        [0, 0],
        [1, 0],
        [2, 0]
    ],

    [
        [0, 0],
        [1, 0],
        [0, 1]
    ],

    [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1]
    ],

    [
        [0, 0],
        [0, 1],
        [0, 2],
        [1, 1]
    ]

];


function initBlocks() {

    blockBoard =
        Array.from(
            {
                length: BOARD_SIZE
            },
            () =>
                Array(
                    BOARD_SIZE
                ).fill(false)
        );


    blockScore = 0;

    selectedPiece = null;


    const score =
        $("#blockScore");

    if (score) {

        score.textContent =
            blockScore;

    }


    renderBlockBoard();

    generateBlockPieces();

}


function renderBlockBoard() {

    const board =
        $("#blockBoard");

    if (!board) return;

    board.innerHTML = "";


    for (
        let row = 0;
        row < BOARD_SIZE;
        row++
    ) {

        for (
            let col = 0;
            col < BOARD_SIZE;
            col++
        ) {

            const cell =
                document.createElement("button");

            cell.className =
                "block-cell";


            if (
                blockBoard[row][col]
            ) {

                cell.classList.add(
                    "filled"
                );

            }


            cell.addEventListener(
                "click",
                () => {

                    placeBlock(
                        row,
                        col
                    );

                }
            );


            board.appendChild(cell);

        }

    }

}


function generateBlockPieces() {

    const pieces =
        $("#pieces");

    if (!pieces) return;

    pieces.innerHTML = "";


    for (
        let i = 0;
        i < 3;
        i++
    ) {

        const shape =
            blockShapes[
                Math.floor(
                    Math.random() *
                    blockShapes.length
                )
            ];


        const piece =
            document.createElement("button");

        piece.className =
            "piece";


        piece.dataset.shape =
            JSON.stringify(shape);


        piece.style.display =
            "grid";

        piece.style.gridTemplateRows =
            "repeat(4, 18px)";

        piece.style.gridTemplateColumns =
            "repeat(4, 18px)";


        shape.forEach(
            ([row, col]) => {

                const mini =
                    document.createElement("span");

                mini.className =
                    "mini";

                mini.style.gridRow =
                    row + 1;

                mini.style.gridColumn =
                    col + 1;


                piece.appendChild(
                    mini
                );

            }
        );


        piece.addEventListener(
            "click",
            () => {

                $$(".piece")
                    .forEach(p =>
                        p.classList.remove(
                            "selected"
                        )
                    );


                piece.classList.add(
                    "selected"
                );


                selectedPiece = {
                    element: piece,
                    shape
                };


                playSFX("click");

            }
        );


        pieces.appendChild(
            piece
        );

    }

}


function placeBlock(
    row,
    col
) {

    if (!selectedPiece) {

        showToast(
            "🧱 Scegli prima un pezzo!"
        );

        return;

    }


    const shape =
        selectedPiece.shape;


    /*
       Controlliamo se il pezzo
       può entrare.
    */

    const canPlace =
        shape.every(
            ([dr, dc]) => {

                const r =
                    row + dr;

                const c =
                    col + dc;


                return (
                    r >= 0 &&
                    r < BOARD_SIZE &&
                    c >= 0 &&
                    c < BOARD_SIZE &&
                    !blockBoard[r][c]
                );

            }
        );


    if (!canPlace) {

        showToast(
            "😅 Qui non entra!"
        );

        playSFX("click");

        return;

    }


    /*
       Inseriamo il pezzo.
    */

    shape.forEach(
        ([dr, dc]) => {

            blockBoard[
                row + dr
            ][
                col + dc
            ] = true;

        }
    );


    blockScore +=
        shape.length;


    playSFX("block");


    /*
       Rimuoviamo il pezzo
       dalla selezione.
    */

    selectedPiece.element.remove();

    selectedPiece = null;


    clearCompletedLines();


    const score =
        $("#blockScore");

    if (score) {

        score.textContent =
            blockScore;

    }


    renderBlockBoard();


    /*
       Se abbiamo usato tutti
       e tre i pezzi,
       ne generiamo altri.
    */

    if (
        $$(".piece").length === 0
    ) {

        generateBlockPieces();

    }


    /*
       Controlliamo il Game Over.
    */

    if (!hasPossibleMove()) {

        playSFX("gameover");

        showToast(
            "💜 Fine partita! Premi ↻ per ricominciare."
        );

    }

}


function clearCompletedLines() {

    const rowsToClear = [];

    const columnsToClear = [];


    /*
       Righe complete.
    */

    for (
        let row = 0;
        row < BOARD_SIZE;
        row++
    ) {

        if (
            blockBoard[row]
                .every(Boolean)
        ) {

            rowsToClear.push(
                row
            );

        }

    }


    /*
       Colonne complete.
    */

    for (
        let col = 0;
        col < BOARD_SIZE;
        col++
    ) {

        let complete = true;


        for (
            let row = 0;
            row < BOARD_SIZE;
            row++
        ) {

            if (
                !blockBoard[row][col]
            ) {

                complete = false;

                break;

            }

        }


        if (complete) {

            columnsToClear.push(
                col
            );

        }

    }


    /*
       Se non c'è niente da cancellare,
       usciamo.
    */

    if (
        rowsToClear.length === 0 &&
        columnsToClear.length === 0
    ) {

        return;

    }


    /*
       Cancella righe.
    */

    rowsToClear.forEach(
        row => {

            blockBoard[row].fill(
                false
            );

        }
    );


    /*
       Cancella colonne.
    */

    columnsToClear.forEach(
        col => {

            for (
                let row = 0;
                row < BOARD_SIZE;
                row++
            ) {

                blockBoard[row][col] =
                    false;

            }

        }
    );


    const cleared =
        rowsToClear.length +
        columnsToClear.length;


    /*
       Bonus.
    */

    blockScore +=
        cleared * 10;


    playSFX("line");


    if (cleared === 1) {

        showToast(
            "✨ Linea completata!"
        );

    } else {

        showToast(
            "💜 " +
            cleared +
            " linee completate!"
        );

    }

}


function hasPossibleMove() {

    const pieces =
        $$(".piece");


    /*
       Se non ci sono pezzi,
       tecnicamente possiamo
       generarne altri.
    */

    if (pieces.length === 0) {

        return true;

    }


    for (
        const piece of pieces
    ) {

        const shape =
            JSON.parse(
                piece.dataset.shape
            );


        for (
            let row = 0;
            row < BOARD_SIZE;
            row++
        ) {

            for (
                let col = 0;
                col < BOARD_SIZE;
                col++
            ) {

                const possible =
                    shape.every(
                        ([dr, dc]) => {

                            const r =
                                row + dr;

                            const c =
                                col + dc;


                            return (
                                r >= 0 &&
                                r < BOARD_SIZE &&
                                c >= 0 &&
                                c < BOARD_SIZE &&
                                !blockBoard[r][c]
                            );

                        }
                    );


                if (possible) {

                    return true;

                }

            }

        }

    }


    return false;

}


/* =========================================
   RESTART BLOCKS
========================================= */

const restartBlocks =
    $("#restartBlocks");

if (restartBlocks) {

    restartBlocks.addEventListener(
        "click",
        () => {

            playSFX("click");

            initBlocks();

        }
    );

}


/* =========================================
   AVVIO
========================================= */

showScreen("home");
