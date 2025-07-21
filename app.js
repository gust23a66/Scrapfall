// =============================================================
// VARIÁVEIS GLOBAIS
// =============================================================
const acertoAudio = new Audio('audios/acerto.mp3');
const erroAudio = new Audio('audios/erro.mp3');
const audio = new Audio('audios/musica_fundo.mp3');
audio.loop = true;

// Imagens do Jogo (serão carregadas quando o jogo iniciar)
const roboImg = new Image();
const parafusoImg = new Image();
const fogoImg = new Image();
const aguaImg = new Image();
const bugImg = new Image();
const falhaImg = new Image();
const backgroundImg = new Image();
const energiaImg = new Image();
const heartItemImg = new Image();
const heartFullImg = new Image();
const heartEmptyImg = new Image();
const transmissorImg = new Image();
const sensorImg = new Image();
const chaveImg = new Image();
const atuadoresImg = new Image();
const manipuladorImg = new Image();

// Lista de objetos de imagem para o pré-carregamento
const allGameImages = [
    roboImg, parafusoImg, fogoImg, aguaImg, bugImg, falhaImg, backgroundImg, energiaImg,
    heartItemImg, heartFullImg, heartEmptyImg, transmissorImg, sensorImg, chaveImg,
    atuadoresImg, manipuladorImg
];

// Estado do Jogo
let canvas, ctx, player, score, lives, gameOver, fallSpeed, gameInterval, trashInterval;
let isPaused = false;
let currentPlayerName = "Anônimo";
let skinSelecionada = localStorage.getItem("skinSelecionada") || "img/robo.png";
let listenersAdded = false;

// =============================================================
// FUNÇÕES DE CONTROLE DE TELA
// =============================================================

function showScreen(screenId) {
    const screens = ["loginScreen", "modonovoScreen", "rankingScreen", "audioSettingsScreen", "shopScreen"];
    screens.forEach(id => {
        const screen = document.getElementById(id);
        if (screen) {
            const displayStyle = (id === 'modonovoScreen' || id === 'audioSettingsScreen') ? 'flex' : 'block';
            screen.style.display = 'none'; // Primeiro esconde todas
            if (id === screenId) {
                screen.style.display = displayStyle; // Depois mostra a correta
            }
        }
    });
}

function showLoginScreen() {
    showScreen('loginScreen');
    if (gameInterval) clearInterval(gameInterval);
    if (trashInterval) clearInterval(trashInterval);
}

function showModoNovo() {
    const usernameInput = document.getElementById('username');
    if (usernameInput) {
        currentPlayerName = usernameInput.value.trim() || "Anônimo";
    } else {
        currentPlayerName = "Anônimo";
    }

     try {
        audio.play();
    } catch (e) {
        console.error("Erro ao tocar música de fundo:", e);
    }
    
    // Define a fonte das imagens antes de pré-carregar
    roboImg.src = skinSelecionada;
    transmissorImg.src = 'img/transmissor.png';
    sensorImg.src = 'img/sensor.png';
    parafusoImg.src = 'img/parafuso.png';
    fogoImg.src = 'img/fogo.png';
    aguaImg.src = 'img/agua.png';
    chaveImg.src = 'img/chave.png';
    atuadoresImg.src = 'img/atuadores.png';
    manipuladorImg.src = 'img/manipulador.png';
    bugImg.src = 'img/bug.png';
    falhaImg.src = 'img/falha.png';
    backgroundImg.src = 'img/fundo.png';
    energiaImg.src = 'img/energia.png';
    heartItemImg.src = 'img/heart_item.png';
    heartFullImg.src = 'img/heart_full.png';
    heartEmptyImg.src = 'img/heart_empty.png';

    showScreen('modonovoScreen');
    runGameWhenReady(startColetaGame);
}

function hideModoNovo() {
    showLoginScreen();
}

function showRanking() {
    showScreen('rankingScreen');
    const rankingList = document.getElementById("rankingColetaList");
    if (!rankingList) return;

    try {
        const players = JSON.parse(localStorage.getItem("rankingColeta")) || [];
        rankingList.innerHTML = '';
        if (players.length > 0) {
            players.sort((a, b) => b.score - a.score);
            const topPlayers = players.slice(0, 15);
            rankingList.innerHTML = topPlayers.map(p => `<p>${p.name}: ${p.score} pontos</p>`).join('');
        } else {
            rankingList.innerHTML = "<p>Nenhuma pontuação registrada ainda.</p>";
        }
    } catch (e) {
        console.error("Erro ao carregar ranking:", e);
    }
}

function showAudioSettingsScreen() {
    showScreen('audioSettingsScreen');
}

// =============================================================
// LÓGICA DE PRÉ-CARREGAMENTO
// =============================================================
function runGameWhenReady(callback) {
    let loadedCount = 0;
    const totalImages = allGameImages.length;
    if (totalImages === 0) {
        callback();
        return;
    }

    allGameImages.forEach(img => {
        if (img.complete && img.naturalHeight !== 0) {
            loadedCount++;
        } else {
            img.onload = () => {
                loadedCount++;
                if (loadedCount === totalImages) callback();
            };
            img.onerror = () => {
                console.error("Falha ao carregar imagem:", img.src);
                loadedCount++;
                if (loadedCount === totalImages) callback();
            };
        }
    });

    if (loadedCount === totalImages) {
        callback();
    }
}

// =============================================================
// FUNÇÕES DO JOGO
// =============================================================
function togglePause() {
    isPaused = !isPaused;
    const pauseMenu = document.getElementById('pauseMenu');
    if (pauseMenu) {
        pauseMenu.classList.toggle('show', isPaused);
    }
}

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

function startColetaGame() {
    canvas = document.getElementById('gameCanvas');
    if (!canvas) {
        console.error("Canvas não encontrado!");
        return;
    }
    ctx = canvas.getContext('2d');
    
    score = 0;
    lives = 3;
    fallSpeed = 4;
    isPaused = false;
    gameOver = false;
    trash = [];
    player = { x: 0, y: 0, width: 60, height: 60 };

    const pauseMenu = document.getElementById('pauseMenu');
    if (pauseMenu) pauseMenu.classList.remove('show');
    const gameOverScreen = document.getElementById('gameOverScreen');
    if (gameOverScreen) gameOverScreen.classList.remove('show');

    ajustarCanvas();
    ajustarTamanhos();
    drawHearts();
    document.getElementById('score').innerText = score;

    if (gameInterval) clearInterval(gameInterval);
    if (trashInterval) clearInterval(trashInterval);

    gameInterval = setInterval(updateGame, 20);
    trashInterval = setInterval(spawnTrash, 1000);
}

function restartGame() {
    const gameOverScreen = document.getElementById('gameOverScreen');
    if (gameOverScreen) gameOverScreen.classList.remove('show');
    showModoNovo();
}

function endGame() {
    gameOver = true;
    clearInterval(gameInterval);
    clearInterval(trashInterval);

    const finalScoreDisplay = document.getElementById('finalScore');
    if (finalScoreDisplay) finalScoreDisplay.innerText = `Pontuação final: ${score}`;
    
    const gameOverScreen = document.getElementById('gameOverScreen');
    if (gameOverScreen) gameOverScreen.classList.add('show');
    
    updateColetaRanking(currentPlayerName, score);
}

function updateGame() {
    if (gameOver || isPaused) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (backgroundImg.complete) ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

    for (let i = trash.length - 1; i >= 0; i--) {
        const t = trash[i];
        t.y += fallSpeed;
        const imgMap = {
            'bug': bugImg, 'falha': falhaImg, 'fogo': fogoImg, 'agua': aguaImg,
            'energia': energiaImg, 'chave': chaveImg, 'atuadores': atuadoresImg,
            'manipulador': manipuladorImg, 'heart': heartItemImg, 'transmissor': transmissorImg,
            'sensor': sensorImg, 'parafuso': parafusoImg
        };
        const img = imgMap[t.type] || parafusoImg;
        if (img.complete) ctx.drawImage(img, t.x, t.y, t.width, t.height);

        if (t.y > canvas.height) {
            trash.splice(i, 1);
            continue;
        }

       // Dentro da função updateGame, localize este trecho e adicione as linhas com .play()

        const colidiu = t.x < player.x + player.width && t.x + t.width > player.x && t.y + t.height > player.y;
        if (colidiu) {
            if (['fogo', 'bug', 'falha', 'agua'].includes(t.type)) {
                lives--;
                erroAudio.play(); // <--- ADICIONE ESTA LINHA
                drawHearts();
                if (lives <= 0) endGame();
            } else if (t.type === 'heart') {
                if (lives < 3) lives++;
                acertoAudio.play(); // <--- ADICIONE ESTA LINHA (som de acerto para vida extra)
                drawHearts();
            } else {
                const scoreMap = { 'recycle': 1, 'transmissor': 1, 'sensor': 2, 'chave': 2, 'manipulador': 3, 'glass': 4, 'energia': 10 };
                score += scoreMap[t.type] || 0;
                acertoAudio.play(); // <--- ADICIONE ESTA LINHA (som de acerto para pontos)
                document.getElementById('score').innerText = score;
            }
            trash.splice(i, 1);
        }
    }
    
    player.y = canvas.height - player.height;
    if (roboImg.complete) ctx.drawImage(roboImg, player.x, player.y, player.width, player.height);
}

function spawnTrash() {
    if (isPaused || gameOver || !canvas) return;
    const isMobile = /Android|iPhone/i.test(navigator.userAgent);
    let baseWidth = canvas.width * (isMobile ? 0.10 : 0.04);
    let baseHeight = baseWidth;
    let x = Math.random() * (canvas.width - baseWidth);
    
    const random = Math.random();
    let type;
    if (random < 0.05) type = 'bug';
    else if (random < 0.10) type = 'falha';
    else if (random < 0.18) type = 'transmissor';
    else if (random < 0.26) type = 'sensor';
    else if (random < 0.36) type = 'fogo';
    else if (random < 0.44) type = 'agua';
    else if (random < 0.52) type = 'chave';
    else if (random < 0.68) type = 'manipulador';
    else if (random < 0.84) type = 'glass';
    else if (random < 0.94) type = 'recycle';
    else type = 'energia';
    
    trash.push({ x, y: -baseHeight, width: baseWidth, height: baseHeight, type });
}

function ajustarCanvas() {
    canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

function ajustarTamanhos() {
    if (!player || !canvas) return;
    const isMobile = /Android|iPhone/i.test(navigator.userAgent);
    player.width = canvas.width * (isMobile ? 0.20 : 0.08);
    player.height = player.width;
    player.x = (canvas.width - player.width) / 2;
    player.y = canvas.height - player.height;
}

function drawHearts() {
    const container = document.getElementById('livesContainer');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 3; i++) {
        const img = document.createElement('img');
        img.src = i < lives ? heartFullImg.src : heartEmptyImg.src;
        container.appendChild(img);
    }
}

function updateColetaRanking(name, scoreToSave) {
    try {
        let players = JSON.parse(localStorage.getItem("rankingColeta")) || [];
        const playerIndex = players.findIndex(p => p.name.toLowerCase() === name.toLowerCase());

        if (playerIndex > -1) {
            if (scoreToSave > players[playerIndex].score) {
                players[playerIndex].score = scoreToSave;
            }
        } else {
            players.push({ name: name, score: scoreToSave });
        }
        players.sort((a, b) => b.score - a.score);
        localStorage.setItem("rankingColeta", JSON.stringify(players));
    } catch (e) {
        console.error("Erro ao salvar ranking:", e);
    }
}

// =============================================================
// INICIALIZAÇÃO E EVENT LISTENERS
// =============================================================

// =============================================================
// FUNÇÕES DE CONTROLE DE ÁUDIO
// =============================================================
function setupAudioControls() {
    const musicVolumeSlider = document.getElementById('musicVolume');
    const sfxVolumeSlider = document.getElementById('sfxVolume');

    if (musicVolumeSlider) {
        // Define o valor inicial do slider com base no volume atual do áudio
        musicVolumeSlider.value = audio.volume; 
        
        musicVolumeSlider.addEventListener('input', (e) => {
            // Pega o valor do slider (que já está entre 0 e 1) e aplica ao volume
            const newVolume = parseFloat(e.target.value); 
            audio.volume = newVolume;
        });
    }

    if (sfxVolumeSlider) {
        // Define o valor inicial para os efeitos sonoros
        sfxVolumeSlider.value = acertoAudio.volume;

        sfxVolumeSlider.addEventListener('input', (e) => {
            // Pega o valor do slider e aplica aos efeitos sonoros
            const newVolume = parseFloat(e.target.value);
            // Altera o volume de AMBOS os efeitos sonoros ao mesmo tempo
            acertoAudio.volume = newVolume;
            erroAudio.volume = newVolume;
        });
    }
}



function setupEventListeners() {
    const buttonActions = {
        "startButton": showModoNovo,
        "rankingButton": showRanking,
        "audioControlsButton": showAudioSettingsScreen,
        "backToLogin": showLoginScreen,
        "backToLoginFromAudio": showLoginScreen,
        "restartGameButton": restartGame,
        "backToMenuButton": showLoginScreen
    };

    for (const id in buttonActions) {
        const button = document.getElementById(id);
        if (button) {
            button.addEventListener('click', buttonActions[id]);
        } else {
            console.warn(`Aviso: Botão com ID '${id}' não foi encontrado.`);
        }
    }
    
    const gameCanvas = document.getElementById('gameCanvas');
    if (!gameCanvas) return;

    const movePlayer = (clientX) => {
        if (!player || !gameCanvas || isPaused || gameOver) return;
        const rect = gameCanvas.getBoundingClientRect();
        const scaleX = gameCanvas.width / rect.width;
        const targetX = (clientX - rect.left) * scaleX;
        player.x = Math.min(Math.max(targetX - player.width / 2, 0), gameCanvas.width - player.width);
    };

    document.addEventListener('keydown', e => {
        if (!player || !gameCanvas || isPaused || gameOver) return;
        const speed = 20;
        if (e.key === 'ArrowLeft') player.x -= speed;
        if (e.key === 'ArrowRight') player.x += speed;
        player.x = Math.min(Math.max(player.x, 0), gameCanvas.width - player.width);
    });
    
    gameCanvas.addEventListener('mousemove', e => movePlayer(e.clientX));
    gameCanvas.addEventListener('touchmove', e => {
        e.preventDefault();
        movePlayer(e.touches[0].clientX);
    }, { passive: false });

    window.addEventListener("resize", () => {
        if (canvas && !gameOver) {
            ajustarCanvas();
            ajustarTamanhos();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    setupAudioControls(); // <--- ADICIONE ESTA LINHA
    showLoginScreen();
});
