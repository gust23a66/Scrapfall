
const acertoAudio = new Audio('audios/acerto.mp3');
const erroAudio = new Audio('audios/erro.mp3');
let musicPlaying = true;
let isGameActive = false;
const audio = new Audio('audios/musica_fundo.mp3');
audio.loop = true;
let isPaused = false;
let coletaState = {};
let canvas, ctx, isPC, player, score, lives, gameOver, fallSpeed, lastSpeedIncreaseScore, trash, gameInterval, trashInterval;
let moedas = parseInt(localStorage.getItem("moedas") || "0");
let powerupPararTempo = parseInt(localStorage.getItem("powerupPararTempo") || "0");
let powerupPularPergunta = parseInt(localStorage.getItem("powerupPularPergunta") || "0");
if (isNaN(powerupPararTempo)) powerupPararTempo = 0;
if (isNaN(powerupPularPergunta)) powerupPularPergunta = 0;
let multiplierFireIcon;
const roboImg = new Image(); roboImg.src = 'img/robo.png';
const transmissorImg = new Image(); transmissorImg.src = 'img/transmissor.png';
const sensorImg = new Image(); sensorImg.src = 'img/sensor.png';
const parafusoImg = new Image(); parafusoImg.src = 'img/parafuso.png';
const fogoImg = new Image(); fogoImg.src = 'img/fogo.png';
const aguaImg = new Image(); aguaImg.src = 'img/agua.png';
const chaveImg = new Image(); chaveImg.src = 'img/chave.png';
const atuadoresImg = new Image(); atuadoresImg.src = 'img/atuadores.png';
const manipuladorImg = new Image(); manipuladorImg.src = 'img/manipulador.png';
const bugImg = new Image(); bugImg.src = 'img/bug.png';
const falhaImg = new Image(); falhaImg.src = 'img/falha.png';
const backgroundImg = new Image(); backgroundImg.src = 'img/fundo.png';
const energiaImg = new Image(); energiaImg.src = 'img/energia.png';
const heartItemImg = new Image(); heartItemImg.src = 'img/heart_item.png';
const heartFullImg = new Image(); heartFullImg.src = 'img/heart_full.png';
const heartEmptyImg = new Image(); heartEmptyImg.src = 'img/heart_empty.png';
let isMultiplierSessionActive = false; 
const CHANCE_FOR_SESSION_MULTIPLIER = 0.25; 
const SESSION_COIN_MULTIPLIER = 2; 

 const skins = [
  { nome: "Lixeira Padrão", img: "img/robo.png", preco: 0 },
  { nome: "Lixeira Dourada", img: "img/bin_gold.png", preco: 100 },
  { nome: "Lixeira Brasil", img: "img/bin_brasil.png", preco: 200 } ,
   { nome: "Lixeira Robô", img: "img/bin_robo.png", preco: 250} ,
  { nome: "Lixeira Pirata", img: "img/bin_pirata.png", preco: 300} ,
  { nome: "Lixeira Zombie", img: "img/bin_zombie.png", preco: 350} ,
  { nome: "Lixeira Viking", img: "img/bin_viking.png", preco: 400} ,
  { nome: "Lixeira do Dragão", img: "img/bin_dragonball.png", preco: 500},
  { nome: "Lixeira do Tanjiro", img: "img/bin_tanjiro.png", preco: 850 },
  { nome: "Lixeira do Satoro", img: "img/bin_satoro.png", preco: 900 },
  { nome: "Lixeira Batman", img: "img/bin_batman.png", preco: 1000 },
  { nome: "Lixeira Strange", img: "img/bin_strange.png", preco: 1250 },
  { nome: "Lixeira Omnitrix", img: "img/bin_ben10.png", preco: 1300 },
  { nome: "Lixeira Real", img: "img/bin_real.png", preco: 1500 },
 { nome: "Lixeira Barça", img: "img/bin_barca.png", preco: 1750 },
  { nome: "Lixeira Neymar", img: "img/bin_neymar.png", preco: 1750 },
  { nome: "Lixeira Portugal", img: "img/bin_cr7.png", preco: 2000 },
  { nome: "Lixeira Argentina", img: "img/bin_messi.png", preco: 2500 },
  { nome: "Lixeira Ninja", img: "img/bin_ninja.png", preco: 3000 },
  { nome: "Lixeira Akatsuki", img: "img/bin_akatsuki.png", preco: 3500 },
  { nome: "Lixeira Aranha", img: "img/bin_spider.png", preco: 5000}
  
];

const powerups = [
  { nome: "Parar Tempo", img: "img/powerup_time.png", preco: 50, key: "powerupPararTempo" },
  { nome: "Pular Pergunta", img: "img/powerup_skip.png", preco: 100, key: "powerupPularPergunta" }
];



function atualizarMoedas() {
    const moedasSpan = document.getElementById("moedasQtd");
    if (moedasSpan) moedasSpan.textContent = moedas;
}

function atualizarPowerupsQuiz() {
  document.getElementById("qtdPararTempo").textContent = powerupPararTempo;
  document.getElementById("qtdPularPergunta").textContent = powerupPularPergunta;
}

function getSkinsDesbloqueadas() {
    return JSON.parse(localStorage.getItem("skinsDesbloqueadas") || '["img/robo.png"]');
}

function setSkinsDesbloqueadas(arr) {
    localStorage.setItem("skinsDesbloqueadas", JSON.stringify(arr));
}

function abrirLoja() {
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("shopScreen").style.display = "block";
    const skinsList = document.getElementById("skinsList");
    const powerupsList = document.getElementById("powerupsList");
    const moedasQtdShop = document.getElementById("moedasQtdShop");
    if (moedasQtdShop) moedasQtdShop.textContent = moedas;

    skinsList.innerHTML = "";
    powerupsList.innerHTML = "";

    skins.forEach(skin => {
        const skinsDesbloqueadas = getSkinsDesbloqueadas();
        const desbloqueada = skinsDesbloqueadas.includes(skin.img);
        const card = document.createElement("div");
        card.className = "skin-card" + (skinSelecionada === skin.img ? " selected" : "");
        card.innerHTML = `
            <img src="${skin.img}" alt="${skin.nome}">
            <div class="skin-name">${skin.nome}</div>
            <div class="skin-cost">${skin.preco} <img src="img/moeda.png" alt="Moeda" class="coin-icon-small"></div>
        `;
        const btn = document.createElement("button");
        if (skinSelecionada === skin.img) {
            btn.textContent = "Selecionada";
            btn.disabled = true;
        } else if (desbloqueada) {
            btn.textContent = "Selecionar";
            btn.disabled = false;
            btn.onclick = () => {
                skinSelecionada = skin.img;
                localStorage.setItem("skinSelecionada", skinSelecionada);
                fecharLoja(); 
            };
        } else if (moedas >= skin.preco) {
            btn.textContent = "Comprar";
            btn.disabled = false;
            btn.onclick = () => comprarSkin(skin);
        } else {
            btn.textContent = "Bloqueada";
            btn.disabled = true;
        }
        card.appendChild(btn);
        skinsList.appendChild(card);
    });

    const powerupQtd = {
        powerupPararTempo,
        powerupPularPergunta
    };

    powerups.forEach(powerup => {
        const card = document.createElement("div");
        card.className = "skin-card"; 
        card.innerHTML = `
            <img src="${powerup.img}" alt="${powerup.nome}">
            <div class="skin-name">${powerup.nome}</div>
            <div class="skin-cost">${powerup.preco} <img src="img/moeda.png" alt="Moeda" class="coin-icon-small"></div>
            <div class="skin-qtd">Você tem: <span id="qtd_${powerup.key}">${powerupQtd[powerup.key]}</span></div>
        `;
        const btn = document.createElement("button");
        btn.textContent = moedas >= powerup.preco ? "Comprar" : "Bloqueado";
        btn.disabled = moedas < powerup.preco;
        btn.onclick = () => comprarPowerup(powerup);
        card.appendChild(btn);
        powerupsList.appendChild(card);
    });
}
function fecharLoja() {
  document.getElementById("shopScreen").style.display = "none";
  document.getElementById("loginScreen").style.display = "block";
}
function comprarSkin(skin) {
  let skinsDesbloqueadas = getSkinsDesbloqueadas();
  if (moedas >= skin.preco && !skinsDesbloqueadas.includes(skin.img)) {
    moedas -= skin.preco;
    localStorage.setItem("moedas", moedas);
    const moedasSpan = document.getElementById("moedasQtd");
    if (moedasSpan) moedasSpan.textContent = moedas;
    const moedasQtdShop = document.getElementById("moedasQtdShop");
    if (moedasQtdShop) moedasQtdShop.textContent = moedas;
    skinsDesbloqueadas.push(skin.img);
    setSkinsDesbloqueadas(skinsDesbloqueadas);
    skinSelecionada = skin.img;
    localStorage.setItem("skinSelecionada", skinSelecionada);
    fecharLoja();
  }
}

function comprarPowerup(powerup) {
  if (moedas >= powerup.preco) {
    moedas -= powerup.preco;
    localStorage.setItem("moedas", moedas);
  if (powerup.key === "powerupPararTempo") {
    powerupPararTempo++;
    localStorage.setItem("powerupPararTempo", powerupPararTempo);
} else if (powerup.key === "powerupPularPergunta") {
    powerupPularPergunta++;
    localStorage.setItem("powerupPularPergunta", powerupPularPergunta);
}
    document.getElementById("moedasQtd").textContent = moedas;
    abrirLoja();
    
  }
}

audio.addEventListener('canplaythrough', () => {
    if (audio.volume > 0) { 
        audio.play();
    }
});

document.addEventListener('DOMContentLoaded', () => {
     multiplierFireIcon = document.getElementById("multiplierFireIcon");
    
document.getElementById("backToLoginFromShop").addEventListener("click", fecharLoja);


document.getElementById("btnPararTempo").onclick = function() {
  if (powerupPararTempo > 0 && timerInterval) {
    clearInterval(timerInterval);
    powerupPararTempo--;
    localStorage.setItem("powerupPararTempo", powerupPararTempo);
    atualizarPowerupsQuiz();
   
    document.getElementById("btnPararTempo").disabled = true; 
  }
};

document.getElementById("btnPularPergunta").onclick = function() {
  if (powerupPularPergunta > 0) {
    powerupPularPergunta--;
    localStorage.setItem("powerupPularPergunta", powerupPularPergunta);
    atualizarPowerupsQuiz();
    nextQuestion();
    startTimer(); 
  }
};

    const isDarkModeEnabled = localStorage.getItem('darkModeEnabled');
    const startButton = document.getElementById("startButton");
    const rankingButton = document.getElementById("rankingButton").addEventListener("click", showRanking);

    const backToLoginButton = document.getElementById("backToLogin");
  
    const restartButton = document.getElementById("restartButton");
    const menuButton = document.getElementById("menuButton");
    const exitButton = document.getElementById("exitButton");
    const darkModeToggleButton = document.getElementById("darkModeToggleButton");
    const winScreen = document.getElementById("winScreen");
    const audioControlsButton = document.getElementById("audioControlsButton");
    const loginScreen = document.getElementById("loginScreen");
    const gameScreen = document.getElementById("gameScreen");
    const rankingScreen = document.getElementById("rankingScreen");
    const achievementsScreen = document.getElementById("achievementsScreen");
    const feedbackMessage = document.getElementById("feedbackMessage");
    const gameOverMessage = document.getElementById("gameOverMessage");
    const timeLeftDisplay = document.getElementById("timeLeft");
    const errorCountDisplay = document.getElementById("errorCount");
    const restartButtonWin = document.getElementById("restartButtonWin");
    const menuButtonWin = document.getElementById("menuButtonWin");
    const difficultyScreen = document.getElementById("difficultyScreen");
    const musicVolumeSlider = document.getElementById("musicVolume");
    const sfxVolumeSlider = document.getElementById("sfxVolume");
 



let currentMusicVolume = parseFloat(localStorage.getItem('musicVolume')) || 1;
let currentSfxVolume = parseFloat(localStorage.getItem('sfxVolume')) || 1;

audio.volume = currentMusicVolume;
acertoAudio.volume = currentSfxVolume;
erroAudio.volume = currentSfxVolume;



const audioSettingsScreen = document.getElementById("audioSettingsScreen");
const backToLoginFromAudioButton = document.getElementById("backToLoginFromAudio");

  if (isDarkModeEnabled === 'true') {
        document.body.classList.add('dark-mode');
        document.documentElement.classList.add('dark-mode');
        
       
        loginScreen.classList.add('dark-mode');
        difficultyScreen.classList.add('dark-mode');
        gameScreen.classList.add('dark-mode');
        rankingScreen.classList.add('dark-mode');
        achievementsScreen.classList.add('dark-mode');
        shopScreen.classList.add('dark-mode');
        modonovoScreen.classList.add('dark-mode');
        gameOverMessage.classList.add('dark-mode');
        winScreen.classList.add('dark-mode');
        audioSettingsScreen.classList.add('dark-mode');
        
    }
    
    const ALL_ACHIEVEMENTS = [
        "Primeira Vitória",
        "Perfeição Verde",
        "Quase Lá!",
        "Persistente",
        "Viciado em Sustentabilidade",
        "Rápido no Gatilho",
        "Relâmpago Verde",
        "Sem Pressa",
        "Rei da Reciclagem",
        "Herói da Energia",
        "Mestre da Alimentação",
        "Desafio Aceito",
        "Veterano Verde",
        "Aprendiz Verde",
        "Primeiro Erro",
        "Sem Segunda Chance",
        "Começo Promissor",
        "Primeira Resposta Correta ",
        "Respondeu 5 Perguntas Corretamente ",
        "Acertou 3 seguidas ",
        "Pontuação 100 ",
        "Partida Perfeita ",
        "Jogou 5 Partidas ",
        "Zero Erros ",
        "Tempo Sobrando ",
        "Resiliente ",
        "Acabou o tempo ",
        "Resposta Rápida "
    ];

    restartButtonWin.addEventListener("click", () => {
        winScreen.style.display = "none";
        startGame();
    });

    menuButtonWin.addEventListener("click", showLoginScreen);



    let gamesPlayed = parseInt(localStorage.getItem("gamesPlayed") || "0");
    let correctAnswersCount = 0;
    let correctStreak = 0;
    let shuffledThemes = [];
    let currentThemeIndex = 0;
    let questionStartTime = 0;
    let correctByTheme = {
        "Lixo": 0,
        "Energia": 0,
        "Água": 0,
        "Alimentação": 0
    };

    difficultyScreen.addEventListener("click", (e) => {
        if (e.target.classList.contains("difficultyBtn")) {
            const nivel = e.target.getAttribute("data-dificuldade");
            escolherDificuldade(nivel);
        }
    });

  
    const challenges = {
        "Água": [
    {
        "question": "Qual dessas ações ajuda a economizar água?",
        "options": [
            "Tomar banhos longos",
            "Escovar os dentes com a torneira aberta",
            "Reutilizar a água da chuva",
            "Lavar o carro todo dia"
        ],
        "answer": "Reutilizar a água da chuva"
    },
    {
        "question": "Melhor horário para regar plantas:",
        "options": [
            "Meio-dia",
            "Final da tarde",
            "Manhã cedo",
            "Qualquer hora"
        ],
        "answer": "Manhã cedo"
    },
    {
        "question": "Qual equipamento economiza mais água ao lavar louça?",
        "options": [
            "Mangueira com jato forte",
            "Esponja nova",
            "Torneira arejadora",
            "Sabão em barra"
        ],
        "answer": "Torneira arejadora"
    },
    {
        "question": "Ao lavar o carro de forma sustentável, o ideal é:",
        "options": [
            "Usar mangueira com água corrente",
            "Levar a lava-rápido todo dia",
            "Usar balde e pano",
            "Usar sabão demais para limpar melhor"
        ],
        "answer": "Usar balde e pano"
    },
    {
        "question": "Água invisível é aquela que:",
        "options": [
            "É usada em produtos sem percebermos",
            "É potável, mas transparente demais",
            "Só aparece na conta de luz",
            "Evapora muito rápido"
        ],
        "answer": "É usada em produtos sem percebermos"
    },
    {
        "question": "Qual é o ciclo natural da água?",
        "options": [
            "Evaporação → Condensação → Precipitação → Infiltração",
            "Evaporação → Precipitação → Condensação → Infiltração",
            "Condensação → Precipitação → Evaporação → Infiltração",
            "Precipitação → Evaporação → Condensação → Infiltração"
        ],
        "answer": "Evaporação → Condensação → Precipitação → Infiltração"
    },
    {
        "question": "O que é a água subterrânea?",
        "options": [
            "Água armazenada em rios e lagos",
            "Água armazenada em aquíferos abaixo da superfície",
            "Água presente na atmosfera",
            "Água proveniente da chuva"
        ],
        "answer": "Água armazenada em aquíferos abaixo da superfície"
    },
    {
        "question": "Qual é o principal uso da água doce no mundo?",
        "options": [
            "Consumo humano",
            "Agricultura",
            "Indústria",
            "Geração de energia"
        ],
        "answer": "Agricultura"
    },
    {
        "question": "O que é o desperdício de água?",
        "options": [
            "Uso excessivo sem necessidade",
            "Uso consciente e controlado",
            "Uso apenas para consumo humano",
            "Uso para geração de energia"
        ],
        "answer": "Uso excessivo sem necessidade"
    },
    {
        "question": "Como podemos economizar água ao lavar roupas?",
        "options": [
            "Lavar pequenas quantidades de roupas",
            "Lavar roupas com água quente",
            "Usar a máquina de lavar com capacidade máxima",
            "Lavar roupas com sabão em pó"
        ],
        "answer": "Usar a máquina de lavar com capacidade máxima"
    },
    {
        "question": "Qual é o impacto do desmatamento na água?",
        "options": [
            "Aumento da disponibilidade de água",
            "Diminuição da qualidade da água",
            "Aumento da quantidade de água doce",
            "Nenhum impacto"
        ],
        "answer": "Diminuição da qualidade da água"
    },
    {
        "question": "O que é a poluição da água?",
        "options": [
            "Presença de substâncias prejudiciais nos corpos d'água",
            "Aumento da quantidade de água doce",
            "Uso consciente da água",
            "Nenhum impacto"
        ],
        "answer": "Presença de substâncias prejudiciais nos corpos d'água"
    },
    {
        "question": "Como podemos evitar a poluição da água?",
        "options": [
            "Jogando lixo nos rios",
            "Usando produtos químicos na agricultura",
            "Tratando o esgoto antes de despejá-lo",
            "Nenhuma das anteriores"
        ],
        "answer": "Tratando o esgoto antes de despejá-lo"
    },
    {
        "question": "O que é a dessalinização da água?",
        "options": [
            "Processo de remoção de sal da água do mar",
            "Processo de purificação da água potável",
            "Processo de aumento da salinidade da água",
            "Nenhuma das anteriores"
        ],
        "answer": "Processo de remoção de sal da água do mar"
    },
    {
        "question": "Qual é a principal fonte de água potável no Brasil?",
        "options": [
            "Rios e lagos",
            "Aquíferos subterrâneos",
            "Água da chuva",
            "Dessalinização"
        ],
        "answer": "Rios e lagos"
    },
    {
        "question": "O que é o desperdício de água na agricultura?",
        "options": [
            "Uso excessivo de água para irrigação",
            "Uso controlado de água para irrigação",
            "Uso de técnicas de irrigação eficientes",
            "Nenhuma das anteriores"
        ],
        "answer": "Uso excessivo de água para irrigação"
    },
    {
        "question": "Como podemos economizar água na cozinha?",
        "options": [
            "Deixando a torneira aberta ao lavar pratos",
            "Usando a máquina de lavar louça com capacidade máxima",
            "Lavar pratos com água corrente",
            "Nenhuma das anteriores"
        ],
        "answer": "Usando a máquina de lavar louça com capacidade máxima"
    },
    {
        "question": "O que é a água reciclada?",
        "options": [
            "Água proveniente de fontes naturais",
            "Água tratada para reutilização",
            "Água da chuva",
            "Nenhuma das anteriores"
        ],
        "answer": "Água tratada para reutilização"
    }],
       
 

        "Energia": [
    {
        "question": "Qual lâmpada consome menos energia?",
        "options": ["Incandescente", "Halógena", "LED", "Fluorescente"],
        "answer": "LED"
    },
    {
        "question": "Uma boa prática para economizar energia é:",
        "options": ["Deixar luzes acesas", "Desligar aparelhos da tomada", "Usar o ar-condicionado o dia todo", "Carregar celular a noite inteira"],
        "answer": "Desligar aparelhos da tomada"
    },
    {
        "question": "Painéis solares são usados para:",
        "options": ["Esquentar a casa", "Produzir energia elétrica limpa", "Controlar o clima", "Filtrar água"],
        "answer": "Produzir energia elétrica limpa"
    },
    {
        "question": "Energia eólica vem de:",
        "options": ["Sol", "Água", "Vento", "Carvão"],
        "answer": "Vento"
    },
    {
        "question": "Eletrodomésticos com selo Procel A são:",
        "options": ["Mais bonitos", "Mais baratos", "Mais econômicos", "Mais pesados"],
        "answer": "Mais econômicos"
    },
    {
        "question": "Qual é a principal fonte de energia elétrica no Brasil?",
        "options": ["Carvão mineral", "Energia solar", "Energia hidrelétrica", "Energia nuclear"],
        "answer": "Energia hidrelétrica"
    },
    {
        "question": "O que é energia renovável?",
        "options": ["Energia proveniente de fontes que se esgotam rapidamente", "Energia proveniente de fontes que se renovam naturalmente", "Energia proveniente de fontes nucleares", "Energia proveniente de fontes fósseis"],
        "answer": "Energia proveniente de fontes que se renovam naturalmente"
    },
    {
        "question": "Qual é a principal vantagem da energia solar?",
        "options": ["É inesgotável e não polui", "É barata e fácil de instalar", "É mais eficiente que a energia eólica", "É mais barata que a energia hidrelétrica"],
        "answer": "É inesgotável e não polui"
    },
    {
        "question": "O que é energia nuclear?",
        "options": ["Energia proveniente da fissão de átomos", "Energia proveniente da fusão de átomos", "Energia proveniente da decomposição de matéria orgânica", "Energia proveniente da queima de combustíveis fósseis"],
        "answer": "Energia proveniente da fissão de átomos"
    },
    {
        "question": "Qual é a principal desvantagem da energia nuclear?",
        "options": ["Emissão de gases poluentes", "Geração de resíduos radioativos", "Custo elevado de instalação", "Dependência de fontes externas"],
        "answer": "Geração de resíduos radioativos"
    },
    {
        "question": "O que é energia geotérmica?",
        "options": ["Energia proveniente da decomposição de matéria orgânica", "Energia proveniente da radiação solar", "Energia proveniente do calor interno da Terra", "Energia proveniente da queima de biomassa"],
        "answer": "Energia proveniente do calor interno da Terra"
    },
    {
        "question": "Qual é a principal fonte de energia no setor de transporte?",
        "options": ["Energia elétrica", "Energia solar", "Combustíveis fósseis", "Energia nuclear"],
        "answer": "Combustíveis fósseis"
    },
    {
        "question": "O que é eficiência energética?",
        "options": ["Uso de mais energia para realizar uma tarefa", "Uso de menos energia para realizar uma tarefa", "Uso de energia renovável", "Uso de energia nuclear"],
        "answer": "Uso de menos energia para realizar uma tarefa"
    },
    {
        "question": "Qual é a principal vantagem da energia eólica?",
        "options": ["É inesgotável e não polui", "É barata e fácil de instalar", "É mais eficiente que a energia solar", "É mais barata que a energia hidrelétrica"],
        "answer": "É inesgotável e não polui"
    },
    {
        "question": "O que é energia biomassa?",
        "options": ["Energia proveniente da decomposição de matéria orgânica", "Energia proveniente da queima de combustíveis fósseis", "Energia proveniente da fissão de átomos", "Energia proveniente da fusão de átomos"],
        "answer": "Energia proveniente da decomposição de matéria orgânica"
    },
    {
        "question": "Qual é a principal desvantagem da energia solar?",
        "options": ["Emissão de gases poluentes", "Geração de resíduos radioativos", "Dependência de condições climáticas", "Custo elevado de instalação"],
        "answer": "Dependência de condições climáticas"
    },
    {
        "question": "O que é energia hidráulica?",
        "options": ["Energia proveniente da decomposição de matéria orgânica", "Energia proveniente da queima de combustíveis fósseis", "Energia proveniente do movimento da água", "Energia proveniente da fissão de átomos"],
        "answer": "Energia proveniente do movimento da água"
    },
    {
        "question": "Qual é a principal vantagem da energia hidrelétrica?",
        "options": ["É inesgotável e não polui", "É barata e fácil de instalar", "É mais eficiente que a energia solar", "É mais barata que a energia eólica"],
        "answer": "É inesgotável e não polui"
    },
    {
        "question": "O que é energia de biomassa?",
        "options": ["Energia proveniente da decomposição de matéria orgânica", "Energia proveniente da queima de combustíveis fósseis", "Energia proveniente da fissão de átomos", "Energia proveniente da fusão de átomos"],
        "answer": "Energia proveniente da decomposição de matéria orgânica"
    },
    {
        "question": "Qual é a principal desvantagem da energia eólica?",
        "options": ["Emissão de gases poluentes", "Geração de resíduos radioativos", "Dependência de condições climáticas", "Custo elevado de instalação"],
        "answer": "Dependência de condições climáticas"
    }],
    
    "Lixo": [
    {
        "question": "Qual cor da lixeira é destinada ao descarte de papel?",
        "options": ["Azul", "Verde", "Amarela", "Marrom"],
        "answer": "Azul"
    },
    {
        "question": "Onde devemos descartar pilhas e baterias?",
        "options": ["No lixo comum", "Na lixeira amarela", "Em pontos de coleta específicos", "Na lixeira verde"],
        "answer": "Em pontos de coleta específicos"
    },
    {
        "question": "O que é o chorume?",
        "options": ["Gás produzido pela decomposição de lixo", "Líquido resultante da decomposição de resíduos orgânicos", "Resíduo sólido proveniente da reciclagem", "Produto químico utilizado na limpeza de lixeiras"],
        "answer": "Líquido resultante da decomposição de resíduos orgânicos"
    },
    {
        "question": "Qual material demora mais para se decompor no meio ambiente?",
        "options": ["Vidro", "Papel", "Plástico", "Metal"],
        "answer": "Plástico"
    },
    {
        "question": "O que é reciclagem?",
        "options": ["Transformar resíduos em novos produtos", "Queimar lixo para reduzir volume", "Enterrar lixo em aterros sanitários", "Jogar lixo em terrenos baldios"],
        "answer": "Transformar resíduos em novos produtos"
    },
    {
        "question": "Qual é a principal vantagem da compostagem?",
        "options": ["Reduzir a quantidade de lixo orgânico", "Produzir energia elétrica", "Gerar empregos na indústria", "Aumentar a produção de lixo"],
        "answer": "Reduzir a quantidade de lixo orgânico"
    },
    {
        "question": "O que é coleta seletiva?",
        "options": ["Separar o lixo por tipo de material", "Misturar todos os tipos de lixo", "Queimar o lixo", "Enterrar o lixo em aterros"],
        "answer": "Separar o lixo por tipo de material"
    },
    {
        "question": "O que deve ser descartado na lixeira verde?",
        "options": ["Vidro", "Papel", "Plástico", "Metal"],
        "answer": "Vidro"
    },
    {
        "question": "Qual é o destino adequado para resíduos eletrônicos?",
        "options": ["Lixo comum", "Pontos de coleta específicos", "Lixeira amarela", "Lixeira marrom"],
        "answer": "Pontos de coleta específicos"
    },
    {
        "question": "O que é lixo orgânico?",
        "options": ["Resíduos de origem vegetal ou animal", "Resíduos de metais", "Resíduos de plásticos", "Resíduos de vidro"],
        "answer": "Resíduos de origem vegetal ou animal"
    },
    {
        "question": "Quanto tempo o plástico pode levar para se decompor?",
        "options": ["De 1 a 5 anos", "De 10 a 100 anos", "De 100 a 500 anos", "Mais de 1000 anos"],
        "answer": "Mais de 1000 anos"
    },
    {
        "question": "Qual é a cor da lixeira destinada ao lixo orgânico?",
        "options": ["Marrom", "Verde", "Amarela", "Azul"],
        "answer": "Marrom"
    },
    {
        "question": "O que é aterro sanitário?",
        "options": ["Local adequado para o descarte de lixo", "Lugar onde o lixo é queimado", "Área onde o lixo é enterrado sem controle", "Local onde o lixo é reciclado"],
        "answer": "Local adequado para o descarte de lixo"
    },
    {
        "question": "Qual é o principal objetivo da política dos 3Rs (Reduzir, Reutilizar, Reciclar)?",
        "options": ["Aumentar a produção de lixo", "Reduzir o impacto ambiental dos resíduos", "Facilitar o descarte de lixo", "Promover o consumo excessivo"],
        "answer": "Reduzir o impacto ambiental dos resíduos"
    },
    {
        "question": "O que é lixo eletrônico?",
        "options": ["Resíduos de aparelhos eletrônicos descartados", "Resíduos de alimentos", "Resíduos de papel", "Resíduos de vidro"],
        "answer": "Resíduos de aparelhos eletrônicos descartados"
    },
    {
        "question": "Qual é a cor da lixeira destinada ao descarte de metais?",
        "options": ["Amarela", "Azul", "Verde", "Marrom"],
        "answer": "Amarela"
    },
    {
        "question": "O que é compostagem?",
        "options": ["Processo de decomposição controlada de matéria orgânica", "Queima de lixo orgânico", "Enterro de lixo orgânico", "Transformação de lixo orgânico em plástico"],
        "answer": "Processo de decomposição controlada de matéria orgânica"
    },
    {
        "question": "Qual é o destino adequado para resíduos de construção civil?",
        "options": ["Lixo comum", "Pontos de coleta específicos", "Lixeira amarela", "Lixeira marrom"],
        "answer": "Pontos de coleta específicos"
    },
    {
        "question": "O que é lixo reciclável?",
        "options": ["Resíduos que podem ser transformados em novos produtos", "Resíduos que não podem ser reutilizados", "Resíduos que devem ser queimados", "Resíduos que devem ser enterrados"],
        "answer": "Resíduos que podem ser transformados em novos produtos"
    },
    {
        "question": "Qual é a cor da lixeira destinada ao descarte de resíduos de saúde?",
        "options": ["Branca", "Marrom", "Amarela", "Verde"],
        "answer": "Amarela"
    },
    {
        "question": "Qual é a principal vantagem da reciclagem do papel?",
        "options": ["Reduzir o consumo de madeira", "Aumentar a produção de lixo", "Poluir mais o meio ambiente", "Consumir mais energia"],
        "answer": "Reduzir o consumo de madeira"
    },
    {
        "question": "O que é lixo industrial?",
        "options": ["Resíduos gerados por processos industriais", "Resíduos de alimentos", "Resíduos de papel", "Resíduos de vidro"],
        "answer": "Resíduos gerados por processos industriais"
    },
    {
        "question": "Qual é a cor da lixeira destinada ao descarte de resíduos domiciliares?",
        "options": ["Marrom", "Verde", "Amarela", "Azul"],
        "answer": "Marrom"
    }],

       "Alimentação": [
    {
        "question": "Uma alimentação sustentável inclui:",
        "options": ["Alimentos ultraprocessados", "Produtos locais e sazonais", "Refrigerantes", "Fast food"],
        "answer": "Produtos locais e sazonais"
    },
    {
        "question": "Comer menos carne ajuda o planeta porque:",
        "options": ["Reduz a emissão de gases poluentes", "Gera mais lixo", "Desmata florestas", "Aumenta a energia elétrica"],
        "answer": "Reduz a emissão de gases poluentes"
    },
    {
        "question": "Desperdício de alimentos pode ser evitado com:",
        "options": ["Compras em excesso", "Guardar sobras corretamente", "Jogar fora alimentos com aparência feia", "Ignorar datas de validade"],
        "answer": "Guardar sobras corretamente"
    },
    {
        "question": "Plantar alimentos em casa ajuda porque:",
        "options": ["Gera lixo", "Evita o supermercado", "Reduz embalagem e transporte", "É caro"],
        "answer": "Reduz embalagem e transporte"
    },
    {
        "question": "Alimentos orgânicos são melhores pois:",
        "options": ["Usam mais veneno", "São mais processados", "Não usam agrotóxicos", "Duram menos"],
        "answer": "Não usam agrotóxicos"
    },
    {
        "question": "Uma forma de reduzir o desperdício é:",
        "options": ["Comer fora todos os dias", "Reaproveitar sobras de alimentos", "Comprar mais do que precisa", "Evitar hortas caseiras"],
        "answer": "Reaproveitar sobras de alimentos"
    },
    {
        "question": "Qual prática ajuda na sustentabilidade alimentar?",
        "options": ["Consumir fast food", "Comer alimentos industrializados", "Preferir produtos de época", "Desperdiçar comida"],
        "answer": "Preferir produtos de época"
    },
    {
        "question": "Alimentos processados normalmente contêm:",
        "options": ["Poucos ingredientes", "Alto teor de açúcar e sódio", "Vitaminas naturais", "Baixas calorias"],
        "answer": "Alto teor de açúcar e sódio"
    },
    {
        "question": "Reduzir o consumo de carne contribui para:",
        "options": ["Mais desmatamento", "Maior uso de água", "Menor emissão de gases de efeito estufa", "Aumento da poluição"],
        "answer": "Menor emissão de gases de efeito estufa"
    },
    {
        "question": "Como as feiras livres ajudam o meio ambiente?",
        "options": ["Produzem lixo", "Oferecem produtos locais", "Usam embalagens plásticas", "Geram mais trânsito"],
        "answer": "Oferecem produtos locais"
    },
    {
        "question": "Um exemplo de proteína vegetal é:",
        "options": ["Carne bovina", "Frango", "Feijão", "Peixe"],
        "answer": "Feijão"
    },
    {
        "question": "Qual é uma vantagem do consumo de alimentos locais?",
        "options": ["Aumenta o uso de combustíveis", "Reduz transporte e poluição", "Encarece a comida", "Reduz qualidade"],
        "answer": "Reduz transporte e poluição"
    },
    {
        "question": "Evitar o desperdício de comida também ajuda a:",
        "options": ["Poluir menos", "Gastar mais", "Usar mais energia", "Produzir mais lixo"],
        "answer": "Poluir menos"
    },
    {
        "question": "O que significa sazonais?",
        "options": ["Alimentos vendidos só à noite", "Produtos importados", "Alimentos da estação", "Comida de festa"],
        "answer": "Alimentos da estação"
    },
    {
        "question": "O que podemos fazer com cascas de frutas e legumes?",
        "options": ["Jogar fora", "Usar para adubo ou receitas", "Descartar com lixo comum", "Evitar ao máximo"],
        "answer": "Usar para adubo ou receitas"
    },
    {
        "question": "Qual dessas práticas reduz impacto ambiental na alimentação?",
        "options": ["Comprar produtos processados", "Cozinhar mais em casa", "Usar embalagens descartáveis", "Desperdiçar sobras"],
        "answer": "Cozinhar mais em casa"
    },
    {
        "question": "O que é alimentação consciente?",
        "options": ["Comer rapidamente", "Escolher alimentos pelo preço apenas", "Pensar nos impactos sociais e ambientais", "Comer o que tem vontade"],
        "answer": "Pensar nos impactos sociais e ambientais"
    },
    {
        "question": "Por que preferir alimentos orgânicos?",
        "options": ["Porque são mais baratos", "Porque vêm de longe", "Porque não usam agrotóxicos", "Porque duram mais"],
        "answer": "Porque não usam agrotóxicos"
    },
    {
        "question": "O que podemos fazer com alimentos perto do vencimento?",
        "options": ["Jogar fora", "Aproveitar em receitas", "Deixar estragar", "Doar a supermercados"],
        "answer": "Aproveitar em receitas"
    },
    {
        "question": "Como a produção de carne afeta o planeta?",
        "options": ["Ajuda na preservação", "Reduz o uso de água", "Gasta muita água e energia", "Aumenta as áreas verdes"],
        "answer": "Gasta muita água e energia"
    },
    {
        "question": "Uma atitude sustentável na alimentação é:",
        "options": ["Evitar hortas", "Reaproveitar alimentos", "Comer só fast food", "Comer mais carne"],
        "answer": "Reaproveitar alimentos"
    },
    {
        "question": "Por que comer frutas da estação é sustentável?",
        "options": ["Porque duram menos", "Porque são importadas", "Porque precisam de menos recursos para cultivo", "Porque são menos nutritivas"],
        "answer": "Porque precisam de menos recursos para cultivo"
    },
    {
        "question": "Uma boa prática é:",
        "options": ["Ignorar validade dos alimentos", "Comprar a granel e evitar embalagens", "Comprar embalagens grandes", "Evitar feiras"],
        "answer": "Comprar a granel e evitar embalagens"
    },
    {
        "question": "A produção local de alimentos contribui para:",
        "options": ["Mais trânsito urbano", "Redução das emissões de transporte", "Maior gasto energético", "Mais embalagens plásticas"],
        "answer": "Redução das emissões de transporte"
    },
    {
        "question": "Reaproveitar sobras de comida em novas receitas ajuda a:",
        "options": ["Poluir mais", "Economizar e reduzir o lixo", "Gastar mais gás", "Comprar mais alimentos"],
        "answer": "Economizar e reduzir o lixo"
    }
]

    }; 

    let username = "";
    let currentTheme = "";
    let currentQuestion = 0;
    let score = 0;
    let currentSessionAchievements = [];
    let errorCount = 0;
    let timeLeft = 30;
    let timerInterval;
    let shuffledQuestions = [];
    let currentDifficulty = "dificil";
    let perdeuSeguidas = parseInt(localStorage.getItem("perdeuSeguidas") || "0");

    
   
musicVolumeSlider.value = currentMusicVolume;
sfxVolumeSlider.value = currentSfxVolume;


 musicVolumeSlider.addEventListener('input', () => {
        currentMusicVolume = parseFloat(musicVolumeSlider.value);
        audio.volume = currentMusicVolume;
        localStorage.setItem('musicVolume', currentMusicVolume);
        
       
        if (currentMusicVolume === 0) {
            if (!audio.paused) { 
                audio.pause();   
            }
        } else { 
            if (audio.paused) { 
                audio.play();   
            }
        }
    });


sfxVolumeSlider.addEventListener('input', () => {
    currentSfxVolume = parseFloat(sfxVolumeSlider.value);
    acertoAudio.volume = currentSfxVolume;
    erroAudio.volume = currentSfxVolume;
    localStorage.setItem('sfxVolume', currentSfxVolume); 
});




audioControlsButton.addEventListener('click', () => {
    audioControlsButton.style.display = 'none'; 
    
});

function loadAndApplyAudioSettings() {
   
    const savedMusicVolume = localStorage.getItem('musicVolume') || '1';
    const savedSfxVolume = localStorage.getItem('sfxVolume') || '1';


    const musicVolume = parseFloat(savedMusicVolume);
    const sfxVolume = parseFloat(savedSfxVolume);

    musicVolumeSlider.value = musicVolume;
    sfxVolumeSlider.value = sfxVolume;

   
    audio.volume = musicVolume;
    acertoAudio.volume = sfxVolume;
    erroAudio.volume = sfxVolume;

   
    if (musicVolume > 0 && !audio.paused) {
      audio.play().catch(e => console.log("Áudio aguardando interação do usuário."));
    }
}


musicVolumeSlider.addEventListener('input', () => {
    const newVolume = parseFloat(musicVolumeSlider.value);
    audio.volume = newVolume; 
    localStorage.setItem('musicVolume', newVolume); 

    if (newVolume === 0) {
        audio.pause();
    } else {
        if (audio.paused) {
            audio.play().catch(e => console.log("Áudio aguardando interação do usuário."));
        }
    }
});


sfxVolumeSlider.addEventListener('input', () => {
    const newVolume = parseFloat(sfxVolumeSlider.value);
    acertoAudio.volume = newVolume; 
    erroAudio.volume = newVolume;   
    localStorage.setItem('sfxVolume', newVolume); 
});


loadAndApplyAudioSettings();
   
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function startGame() {

 username = document.getElementById("username").value.trim();
    const feedbackMessage = document.getElementById("feedbackMessage"); 
    const feedbackMenu = document.getElementById("feedbackMenu");
        atualizarPowerupsQuiz();
        document.getElementById("shopScreen").style.display = "none";
        if (!username) {
            feedbackMenu.textContent = "⚠️ Por favor, digite seu nome!";
            feedbackMenu.style.display = "block";
            setTimeout(() => {
                feedbackMenu.style.display = "none";
            }, 2000);
            return;
        }

    if (username.toLowerCase() === "ecoplay") {
        moedas = 1000000;
        localStorage.setItem("moedas", moedas);
        document.getElementById("moedasQtd").textContent = moedas;
    } 


        loginScreen.style.display = "none";
        difficultyScreen.style.display = "block";
       
    }

     if (audio.volume > 0) {
        audio.play();
    }

audioControlsButton.addEventListener("click", showAudioSettingsScreen);


backToLoginFromAudioButton.addEventListener("click", hideAudioSettingsScreen);



function showAudioSettingsScreen() {
    loginScreen.style.display = "none";
    difficultyScreen.style.display = "none";
    gameScreen.style.display = "none";
    rankingScreen.style.display = "none";
    achievementsScreen.style.display = "none";
    shopScreen.style.display = "none";
    modonovoScreen.style.display = "none"; 

    audioSettingsScreen.style.display = "flex"; 
   
}
function hideAudioSettingsScreen() {
    audioSettingsScreen.style.display = "none";
    loginScreen.style.display = "block";
    audioControlsButton.style.display = "block"; 
   
}


   function resetGame() {
    score = 0;
    errorCount = 0;
    currentQuestion = 0;
    correctAnswersCount = 0;
    correctStreak = 0;
    correctByTheme = { "Água": 0, "Energia": 0, "Lixo": 0, "Alimentação": 0 }; 
    timeLeft = getInitialTimeByDifficulty(); 
    
    isGameActive = true; 

    const timeLeftDisplayEl = document.getElementById("timeLeft"); 
    if (timeLeftDisplayEl) timeLeftDisplayEl.textContent = `⏳ Tempo restante: ${timeLeft}s`;
    
    const errorCountDisplayEl = document.getElementById("errorCount");
    if (errorCountDisplayEl) errorCountDisplayEl.textContent = `Erros: ${errorCount}/3`;

   
    isMultiplierSessionActive = (Math.random() < CHANCE_FOR_SESSION_MULTIPLIER);

    
    if (multiplierFireIcon) { 
        if (isMultiplierSessionActive) {
            multiplierFireIcon.style.display = 'inline-block'; 
          
          
        } else {
            multiplierFireIcon.style.display = 'none'; 
        }
    }

    
    shuffledThemes = shuffleArray(Object.keys(challenges)); 
    currentThemeIndex = 0; 
   
    shuffledQuestions = shuffleArray(
        Object.entries(challenges).flatMap(([tema, perguntas]) =>
            perguntas.map(pergunta => ({ ...pergunta, tema }))
        )
    );
    currentQuestion = 0; 

    loadQuestion();
    startTimer(); 
}

    function startTimer() {
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeLeft--;
            timeLeftDisplay.textContent = `⏳ Tempo restante: ${timeLeft}s`;
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                unlockAchievement("Acabou o tempo ");
                showGameOver();
            }
        }, 1000);
    }

    function loadQuestion() {
        

         document.getElementById("btnPararTempo").disabled = false; 
        questionStartTime = Date.now();
        const question = shuffledQuestions[currentQuestion];
        document.getElementById("themeTitle").textContent = `Tema: ${question.tema}`;
        document.getElementById("questionText").textContent = question.question;
        if (!question.options || question.options.length === 0) {
            feedbackMessage.textContent = "⚠️ Pergunta inválida. Verifique os dados.";
            return;
        }
        const optionsContainer = document.getElementById("options");
        optionsContainer.innerHTML = '';
        const shuffledOptions = shuffleArray([...question.options]);
        shuffledOptions.forEach(option => {
            const button = document.createElement("button");
            button.textContent = option;
            button.onclick = () => checkAnswer(option);
            optionsContainer.appendChild(button);
        });
    }

document.getElementById("moedasQtd").textContent = moedas;

function checkAnswer(selected) {

 if (!isGameActive) {
        return; 
    }

    const feedbackMessage = document.getElementById("feedbackMessage");
    const current = shuffledQuestions[currentQuestion];
    const correctAnswer = current.answer;

    if (selected === correctAnswer) {
        correctAnswersCount++;
        let basePoints = 10;
        let moedasGanhas = 2;

        if (currentDifficulty === "medio") {
            basePoints = 15;
            moedasGanhas = 5;
        } else if (currentDifficulty === "dificil") {
            basePoints = 20;
            moedasGanhas = 10;
        }

     
        if (isMultiplierSessionActive) {
            moedasGanhas *= SESSION_COIN_MULTIPLIER;
        }

 
        if(feedbackMessage) feedbackMessage.textContent = `✅ Você acertou!`;

       

        score += basePoints; 
        moedas += moedasGanhas;
        localStorage.setItem("moedas", moedas.toString());
        const moedasQtdSpan = document.getElementById("moedasQtd");
        if (moedasQtdSpan) moedasQtdSpan.textContent = moedas;

       
        if (correctAnswersCount === 5) unlockAchievement("Respondeu 5 Perguntas Corretamente 🎓");
        correctStreak++;
        timeLeft = Math.min(timeLeft + 5, getInitialTimeByDifficulty());
        
        const timeLeftDisplayEl = document.getElementById("timeLeft");
        if(timeLeftDisplayEl) timeLeftDisplayEl.textContent = `⏳ Tempo restante: ${timeLeft}s`;
        
        if(acertoAudio) acertoAudio.play();
        
        const scoreValueElementEl = document.getElementById("scoreValue");
        if(scoreValueElementEl) scoreValueElementEl.textContent = score;

        let firstCorrectUnlocked = (JSON.parse(localStorage.getItem("achievements")) || []).includes("Primeira Resposta Correta ");
        if (!firstCorrectUnlocked && correctAnswersCount === 1) {
            unlockAchievement("Primeira Resposta Correta ");
        }
            
        if (score >= 100) unlockAchievement("Pontuação 100 ");
        if (correctAnswersCount >= 20) {
            if(timerInterval) clearInterval(timerInterval);
            showWinScreen();
            return;
        }
        nextQuestion();
        startTimer();

    } else {  
        if(feedbackMessage) feedbackMessage.textContent = `❌ Resposta correta: ${correctAnswer}`;
        errorCount++;
        correctStreak = 0;
        if(erroAudio) erroAudio.play();
        
        const errorCountDisplayEl = document.getElementById("errorCount");
        if(errorCountDisplayEl) errorCountDisplayEl.textContent = `Erros: ${errorCount}/3`;
        
        if (errorCount >= 3) {
            isGameActive = false; 
             const optionsContainer = document.getElementById("options");
            const buttons = optionsContainer.getElementsByTagName('button');
            for (const button of buttons) {
                button.disabled = true;
            }

            if(timerInterval) clearInterval(timerInterval);
            setTimeout(showGameOver, 1000); 
        } else {
            nextQuestion();
            startTimer();
        }
    }

   
    if(feedbackMessage) {
        feedbackMessage.style.display = "block";
        setTimeout(() => {
            if(feedbackMessage) feedbackMessage.style.display = "none";
          
        }, 2000);
    }
}
    function nextQuestion() {
        currentQuestion++;
        if (currentQuestion >= shuffledQuestions.length) {
            currentThemeIndex++;
            if (currentThemeIndex >= shuffledThemes.length) {
                shuffledThemes = shuffleArray(Object.keys(challenges));
                currentThemeIndex = 0;
            }
            currentTheme = shuffledThemes[currentThemeIndex];
            shuffledQuestions = shuffleArray([...challenges[currentTheme]]);
            currentQuestion = 0;
        }
        loadQuestion();
    }

    function showWinScreen() {
    unlockAchievement("Primeira Vitória");
    if (errorCount === 0 && timeLeft > 15) unlockAchievement("Perfeição Verde");
    updateRanking();
    loginScreen.style.display = "none";
    gameScreen.style.display = "none";
    rankingScreen.style.display = "none";
    achievementsScreen.style.display = "none";
    gameOverMessage.style.display = "none";
    document.getElementById("finalScoreWin").textContent = `Pontuação Final: ${score}`;
    const sessionAchievementsDiv = document.getElementById("sessionAchievements");
    
    const trophyHeaderIcon = '<img src="img/trofeu.png" alt="Conquistas" class="session-header-icon">'; 
    const medalListItemIcon = '<img src="img/medal_icon.png" alt="Medalha" class="session-list-icon">'; 

    if (currentSessionAchievements.length > 0) {
        sessionAchievementsDiv.innerHTML = `<h3>${trophyHeaderIcon} Conquistas desbloqueadas:</h3>` + 
            "<ul>" + currentSessionAchievements.map(a => `<li>${medalListItemIcon} ${a}</li>`).join('') + "</ul>";
    } else {
        sessionAchievementsDiv.innerHTML = "<p>Nenhuma conquista desbloqueada nesta partida.</p>";
    }
    winScreen.style.display = "block";
    setTimeout(() => {
        winScreen.classList.add("show");
    }, 50);
    currentSessionAchievements = [];
    gamesPlayed++;
    localStorage.setItem("gamesPlayed", gamesPlayed);
    if (gamesPlayed === 1) unlockAchievement("Aprendiz Verde");
    if (gamesPlayed === 10) unlockAchievement("Veterano Verde");
    if (gamesPlayed === 20) unlockAchievement("Viciado em Sustentabilidade");
    perdeuSeguidas = 0;
    localStorage.setItem("perdeuSeguidas", perdeuSeguidas);
}

    function escolherDificuldade(nivel) {
         document.body.classList.add('quiz-active');
        document.getElementById("shopScreen").style.display = "none";
        if (nivel === "dificil") unlockAchievement("Desafio Aceito");
        currentDifficulty = nivel;
        switch (nivel) {
            case "facil": timeLeft = 100; break;
            case "medio": timeLeft = 60; break;
            case "dificil": timeLeft = 30; break;
            default: timeLeft = 30;
        }
        difficultyScreen.style.display = "none";
        gameScreen.style.display = "block";
        resetGame();
    }

    function getInitialTimeByDifficulty() {
        switch (currentDifficulty) {
            case "facil": return 100;
            case "medio": return 60;
            case "dificil": return 30;
            default: return 30;
        }
    }

    function updateRanking() {

  if (username.toLowerCase() === "ecoplay") return; //secreto

        let players = JSON.parse(localStorage.getItem("ranking")) || [];
        const existingPlayerIndex = players.findIndex(player => player.name.toLowerCase() === username.toLowerCase());
        if (existingPlayerIndex !== -1) {
            if (score > players[existingPlayerIndex].score) {
                players[existingPlayerIndex].score = score;
            }
        } else {
            players.push({ name: username, score: score });
        }
        players.sort((a, b) => b.score - a.score);
        localStorage.setItem("ranking", JSON.stringify(players));
    }

function loadAndApplyAudioSettings() {
   
    const savedMusicVolume = localStorage.getItem('musicVolume') || '1';
    const savedSfxVolume = localStorage.getItem('sfxVolume') || '1';
    const musicVolume = parseFloat(savedMusicVolume);
    const sfxVolume = parseFloat(savedSfxVolume);

    musicVolumeSlider.value = musicVolume;
    sfxVolumeSlider.value = sfxVolume;
    audio.volume = musicVolume;
    acertoAudio.volume = sfxVolume;
    erroAudio.volume = sfxVolume;

   
    if (musicVolume > 0 && !audio.paused) {
      audio.play().catch(e => console.log("Áudio aguardando interação do usuário."));
    }
}


    function showGameOver() {
        if (score >= 80 && errorCount >= 3) unlockAchievement("Quase Lá!");
        updateRanking();
        if (errorCount === 0) {
            unlockAchievement("Partida Perfeita ");
            gamesPlayed++;
            localStorage.setItem("gamesPlayed", gamesPlayed);
            if (gamesPlayed === 5) unlockAchievement("Jogou 5 Partidas ");
            unlockAchievement("Zero Erros ");
            if (timeLeft > 15) unlockAchievement("Tempo Sobrando ");
        }
        if (errorCount === 2) unlockAchievement("Resiliente ");
       const finalScoreDisplay = document.getElementById("finalScoreQuiz");

    if (finalScoreDisplay) {
        finalScoreDisplay.textContent = `Pontuação Final: ${score}`;
    }
        document.getElementById("gameScreen").style.display = "none";
        document.getElementById("loginScreen").style.display = "none";
        document.getElementById("rankingScreen").style.display = "none";
        document.getElementById("achievementsScreen").style.display = "none";
        finalScore.textContent = `Pontuação Final: ${score}`;
        gameOverMessage.style.display = "block";
        setTimeout(() => {
            gameOverMessage.classList.add("show");
        }, 50);
        gamesPlayed++;
        localStorage.setItem("gamesPlayed", gamesPlayed);
        if (gamesPlayed === 1) unlockAchievement("Aprendiz Verde");
        if (gamesPlayed === 10) unlockAchievement("Veterano Verde");
        if (gamesPlayed === 20) unlockAchievement("Viciado em Sustentabilidade");
        perdeuSeguidas++;
        localStorage.setItem("perdeuSeguidas", perdeuSeguidas);
        if (perdeuSeguidas === 3) unlockAchievement("Persistente");
    }

    function showLoginScreen() {
         document.body.classList.remove('quiz-active'); 
       document.getElementById("shopScreen").style.display = "none";
        loginScreen.style.display = "block";
        gameScreen.style.display = "none";
        rankingScreen.style.display = "none";
        achievementsScreen.style.display = "none";
        gameOverMessage.style.display = "none";
        winScreen.style.display = "none";
    }



function toggleDarkMode() {
   
    document.body.classList.toggle('dark-mode');
    document.documentElement.classList.toggle('dark-mode'); 

    difficultyScreen.classList.toggle('dark-mode'); 
    gameScreen.classList.toggle('dark-mode');
    loginScreen.classList.toggle('dark-mode');
    rankingScreen.classList.toggle('dark-mode');
    achievementsScreen.classList.toggle('dark-mode');
    gameOverMessage.classList.toggle('dark-mode');
    winScreen.classList.toggle('dark-mode');
    audioSettingsScreen.classList.toggle('dark-mode');
    shopScreen.classList.toggle('dark-mode');
    modonovoScreen.classList.toggle('dark-mode');

   if (document.body.classList.contains('dark-mode')) {
       
        darkModeToggleButton.innerHTML = `<img src="img/moon.png" alt="Lua (Tema Escuro)" class="dark-mode-icon"> <img src="img/sun.png" alt="Sol (Tema Claro)" class="light-mode-icon"> Tema Claro `;
    } else {
        
        darkModeToggleButton.innerHTML = `<img src="img/moon.png" alt="Lua (Tema Escuro)" class="dark-mode-icon"> <img src="img/sun.png" alt="Sol (Tema Claro)" class="light-mode-icon"> Tema Escuro`;
    }
  
    localStorage.setItem('darkModeEnabled', document.body.classList.contains('dark-mode'));

  
}

function showRanking() {
  
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("modonovoScreen").style.display = "none";
    document.getElementById("rankingScreen").style.display = "block";
    const rankingColetaList = document.getElementById("rankingColetaList");
    const coletaPlayers = JSON.parse(localStorage.getItem("rankingColeta")) || [];
    rankingColetaList.innerHTML = '';
    if (coletaPlayers.length > 0) {
        coletaPlayers.sort((a, b) => b.score - a.score);
        const top15Coleta = coletaPlayers.slice(0, 15);
        rankingColetaList.innerHTML = top5Coleta.map(player => `<p>${player.name}: ${player.score} pontos</p>`).join('');
    } else {
        rankingColetaList.innerHTML = "<p>Nenhuma pontuação registrada ainda.</p>";
    }
}

    function showAchievements() {
       document.getElementById("shopScreen").style.display = "none";
        loginScreen.style.display = "none";
        gameScreen.style.display = "none";
        rankingScreen.style.display = "none";
        gameOverMessage.style.display = "none";
        achievementsScreen.style.display = "block";
        const achievementsList = document.getElementById("achievementsList");
        achievementsList.innerHTML = "";
        const unlocked = JSON.parse(localStorage.getItem("achievements")) || [];

         const unlockedMedalHtml = '<img src="img/medal_icon.png" alt="Medalha Desbloqueada" class="achievement-medal-icon">'; 
  
    const lockedIconHtml = '<img src="img/locked_icon.png" alt="Bloqueado" class="achievement-locked-icon">'

          ALL_ACHIEVEMENTS.forEach(achievement => {
        const p = document.createElement("p");
        
        if (unlocked.includes(achievement)) {
           
            p.innerHTML = unlockedMedalHtml + achievement; 
        } else {
           
            p.innerHTML = lockedIconHtml + achievement;
        }
        
        achievementsList.appendChild(p);
    });
}

    function unlockAchievement(achievementName) {
        let achievements = JSON.parse(localStorage.getItem("achievements")) || [];
        if (!achievements.includes(achievementName)) {
            achievements.push(achievementName);
            localStorage.setItem("achievements", JSON.stringify(achievements));
            currentSessionAchievements.push(achievementName);
        }
    }

    function exitGame() {
        window.close();
    }

    startButton.addEventListener("click", startGame);
    rankingButton.addEventListener("click", showRanking);
 
   
    darkModeToggleButton.addEventListener("click", toggleDarkMode);
    backToLoginButton.addEventListener("click", showLoginScreen);
    backToLoginFromAchievementsButton.addEventListener("click", showLoginScreen);
   
   restartButton.addEventListener("click", () => {
    gameOverMessage.style.display = "none";
    gameScreen.style.display = "block";
    if (musicPlaying) { 
        audio.play();
    }
    resetGame();
});
    menuButton.addEventListener("click", showLoginScreen);
    exitButton.addEventListener("click", exitGame);
});



function showModoNovo() {
    document.getElementById("shopScreen").style.display = "none";
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('modonovoScreen').style.display = 'flex';
    startColetaGame(); 
}


function hideModoNovo() {
   document.getElementById("shopScreen").style.display = "none";
    document.getElementById('modonovoScreen').style.display = 'none';
    document.getElementById('loginScreen').style.display = 'block';
}

  function togglePause() {
    isPaused = !isPaused;
    const pauseMenu = document.getElementById('pauseMenu');
    if (isPaused) {
        pauseMenu.classList.add('show');
    } else {
        pauseMenu.classList.remove('show');
    }
    document.getElementById('pauseButton').textContent = isPaused ? '▶' : '⏸';
}
 function restartGame() {
        document.body.classList.remove('game-over');
        startColetaGame();
    }
    function toggleFullScreen() {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) { 
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) { 
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { 
            elem.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

window.addEventListener("resize", () => {
    if (canvas) {
        ajustarCanvas();
        ajustarTamanhos();
    }
});
   ;
    document.addEventListener('keydown', function (e) {
        const speed = 20;
        if (e.key === 'ArrowLeft' && player.x > 0) {
            player.x -= speed;
        } else if (e.key === 'ArrowRight' && player.x + player.width < canvas.width) {
            player.x += speed;
        }
    });
   
   

  
    window.addEventListener("resize", () => {
        ajustarCanvas();
        ajustarTamanhos();
    });
    document.addEventListener('keydown', function (e) {
        const speed = 20;
        if (e.key === 'ArrowLeft' && player && player.x > 0) {
            player.x -= speed;
        } else if (e.key === 'ArrowRight' && player && player.x + player.width < canvas.width) {
            player.x += speed;
        }
    });
   
    document.getElementById('gameCanvas').addEventListener("mousemove", function (e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const mouseX = (e.clientX - rect.left) * scaleX;
        player.x = Math.min(Math.max(mouseX - player.width / 2, 0), canvas.width - player.width);
    });
    document.getElementById('gameCanvas').addEventListener('touchstart', handleTouch, { passive: false });
    document.getElementById('gameCanvas').addEventListener('touchmove', handleTouch, { passive: false });
    document.getElementById('gameCanvas').addEventListener('touchstart', ativarTelaCheiaMobile);
    document.getElementById('gameCanvas').addEventListener('click', ativarTelaCheiaMobile);


function ajustarCanvas() {
    if (!canvas) {
        canvas = document.getElementById('gameCanvas');
        if (!canvas) return;
    }
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

const LIXEIRA_PROPORCAO_LARGURA_ALTURA = 1.0;

function ajustarTamanhos() {
    if (!player || !canvas) return;

    if (isMobile()) {
        player.width = canvas.width * 0.27; 
        player.height = player.width / LIXEIRA_PROPORCAO_LARGURA_ALTURA; 

       
        if (player.height > canvas.height * 0.20) { 
            player.height = canvas.height * 0.20; 
        }

    } else { 
        player.width = canvas.width * 0.08; 
        player.height = player.width / LIXEIRA_PROPORCAO_LARGURA_ALTURA;

       
        if (player.height > canvas.height * 0.18) {
            player.height = canvas.height * 0.18;
            player.width = player.height * LIXEIRA_PROPORCAO_LARGURA_ALTURA;
        }
    }
    player.x = (canvas.width - player.width) / 2; 
}

    function drawHearts() {
        const container = document.getElementById('livesContainer');
        container.innerHTML = '';
        const totalLives = 3;
        for (let i = 0; i < totalLives; i++) {
            const img = document.createElement('img');
            img.src = i < lives ? heartFullImg.src : heartEmptyImg.src;
            container.appendChild(img);
        }
    }

 function isMobile() {
        return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    }
    function handleTouch(e) {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const touchX = (e.touches[0].clientX - rect.left) * scaleX;
        const clampedX = Math.min(Math.max(touchX - player.width / 2, 0), canvas.width - player.width);
        player.x = clampedX;
    }
    function ativarTelaCheiaMobile() {
        if (
            isMobile() &&
            !document.fullscreenElement &&
            document.documentElement.requestFullscreen
        ) {
            document.documentElement.requestFullscreen();
        }
        canvas.removeEventListener('touchstart', ativarTelaCheiaMobile);
        canvas.removeEventListener('click', ativarTelaCheiaMobile);
    }

     function loadImages(callback) {
        let loaded = 0;
        const images = [
            roboImg, parafusoImg, fogoImg, aguaImg, backgroundImg, energiaImg,
            heartFullImg, heartEmptyImg, bugImg, heartItemImg,
            chaveImg, atuadoresImg, manipuladorImg
        ];
        function checkLoaded() {
            loaded++;
            if (loaded === images.length) callback();
        }
        images.forEach(img => {
            if (img.complete) checkLoaded();
            else img.onload = checkLoaded;
        });
    }

    function updateGame() {
    if (gameOver || isPaused) return;
    if (score >= lastSpeedIncreaseScore + 10 && fallSpeed < 20) {
        fallSpeed += 0.5;
        lastSpeedIncreaseScore = score;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(roboImg, player.x, canvas.height - player.height, player.width, player.height);

   

    for (let i = 0; i < trash.length; i++) {
        let t = trash[i];
        t.y += fallSpeed;
        const img =
            t.type === 'bug' ? bugImg :
            t.type === 'falha' ? falhaImg :
            t.type === 'fogo' ? fogoImg :
            t.type === 'agua' ? aguaImg :
            t.type === 'energia' ? energiaImg :
            t.type === 'chave' ? chaveImg :
            t.type === 'glass' ? atuadoresImg :
            t.type === 'manipulador' ? manipuladorImg :
            t.type === 'heart' ? heartItemImg :
            t.type === 'transmissor' ? transmissorImg :
            t.type === 'sensor' ? sensorImg :
            parafusoImg;

        let drawWidth = t.width;
        let drawHeight = t.height;
        if (t.type === 'heart') {
            const size = Math.min(t.width, t.height);
            drawWidth = size;
            drawHeight = size;
        }

        ctx.drawImage(img, t.x, t.y, drawWidth, drawHeight);

        
        const hitboxPaddingX = 20;
        const hitboxPaddingY = 20;

        const lixoBateuNoChao = t.y + t.height >= canvas.height;
        
        const colidiuComLixeira =
            t.x < player.x + player.width - hitboxPaddingX &&
            t.x + t.width > player.x + hitboxPaddingX &&
            t.y + t.height >= (canvas.height - player.height) + hitboxPaddingY;


        if (colidiuComLixeira) {
            const tipo = t.type;
            trash.splice(i, 1);
            i--;
            if (tipo === 'fogo' || tipo === 'bug' || tipo === 'falha' || tipo === 'agua') {
                erroAudio.currentTime = 0;
                erroAudio.play();
                lives--;
                drawHearts();
                if (lives <= 0) endGame();
            } else if (tipo === 'heart') {
                if (lives < 3) {
                    lives++;
                    drawHearts();
                }
                acertoAudio.currentTime = 0;
                acertoAudio.play();
            } else {
                acertoAudio.currentTime = 0;
                acertoAudio.play();
                switch (tipo) {
                    case 'recycle': score += 1; break;
                    case 'transmissor': score += 1; break;
                    case 'sensor': score += 2; break;
                    case 'chave': score += 2; break;
                    case 'manipulador': score += 3; break;
                    case 'glass': score += 4; break;
                    case 'energia': score += 10; break;
                }
            }
            document.getElementById('score').innerText = score;
           
       } else if (lixoBateuNoChao) {
    trash.splice(i, 1);
    i--;

}
    }
}
  function spawnTrash() {
    if (isPaused || gameOver) return;
    let baseWidth, baseHeight;
    if (isMobile()) {
        baseWidth = canvas.width * 0.10;
        baseHeight = canvas.height * 0.06;
    } else {
        baseWidth = canvas.width * 0.04;
        baseHeight = canvas.height * 0.06;
    }
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
    trash.push({ x, y: 0, width: baseWidth, height: baseHeight, type });
    if (score >= (coletaState.lastHeartScore || 0) + 100) {
        spawnHeartItem();
        coletaState.lastHeartScore = score;
    }
}

    function spawnHeartItem() {
        let baseWidth = canvas.width * 0.07;
        let baseHeight = canvas.height * 0.07;
        let x = Math.random() * (canvas.width - baseWidth);
        trash.push({ x, y: 0, width: baseWidth, height: baseHeight, type: 'heart' });
    }

function endGame() {
 
    clearInterval(gameInterval);
    clearInterval(trashInterval);
    gameOver = true;

  

    const usernameInput = document.getElementById('username');
    
  
    const finalName = (usernameInput && usernameInput.value.trim()) || "Anônimo";
    
    const finalScore = score;
 
    updateColetaRanking(finalName, finalScore);

   
    setTimeout(() => {
        const finalScoreDisplay = document.getElementById('finalScore');
        if (finalScoreDisplay) {
            finalScoreDisplay.innerText = `Pontuação final: ${finalScore}`;
        }
        document.getElementById('gameOverScreen').classList.add('show');
        document.body.classList.add('game-over');
    }, 300);
}


function updateColetaRanking(name, scoreToSave) {
    try {
        let coletaPlayers = JSON.parse(localStorage.getItem("rankingColeta")) || [];
        
        const existingPlayerIndex = coletaPlayers.findIndex(p => p.name.toLowerCase() === name.toLowerCase());

        if (existingPlayerIndex !== -1) {
            
            if (scoreToSave > coletaPlayers[existingPlayerIndex].score) {
                coletaPlayers[existingPlayerIndex].score = scoreToSave;
            }
        } else {
            coletaPlayers.push({ name: name, score: scoreToSave });
        }
        
        coletaPlayers.sort((a, b) => b.score - a.score);
        localStorage.setItem("rankingColeta", JSON.stringify(coletaPlayers));

    } catch (e) {
        console.error("ERRO ao tentar salvar o ranking de coleta:", e);
    }
}

let skinSelecionada = localStorage.getItem("skinSelecionada") || "img/robo.png";

function startColetaGame() {

    roboImg.src = skinSelecionada;
   
    canvas = document.getElementById('gameCanvas');
ctx = canvas.getContext('2d');
    isPC = !/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    player = { x: 170, width: 60, height: 60 };
    score = 0;
    lives = 3;
    gameOver = false;
    fallSpeed = 4;
    lastSpeedIncreaseScore = 0;
    trash = [];
    coletaState.lastHeartScore = 0;
    isPaused = false;


    ajustarCanvas();
    ajustarTamanhos();
   loadImages(() => {
    score = 0;
    lives = 3;
    trash = [];
    gameOver = false;
    fallSpeed = 4;
    lastSpeedIncreaseScore = 0;
    coletaState.lastHeartScore = 0;
    isPaused = false;
    document.getElementById('gameOverScreen').classList.remove('show');
    document.getElementById('pauseMenu').classList.remove('show');
    document.getElementById('score').innerText = score;
    const pauseIcon = document.getElementById('pauseIcon');
if (pauseIcon) pauseIcon.src = 'img/pause.png';
    drawHearts();
    if (gameInterval) clearInterval(gameInterval);
    if (trashInterval) clearInterval(trashInterval);
    gameInterval = setInterval(updateGame, 20);
    trashInterval = setInterval(spawnTrash, 1000);
});

    if (!canvas.listenersAdded) {
        canvas.addEventListener("mousemove", function (e) {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const mouseX = (e.clientX - rect.left) * scaleX;
            player.x = Math.min(Math.max(mouseX - player.width / 2, 0), canvas.width - player.width);
        });
        document.addEventListener('keydown', function (e) {
            const speed = 20;
            if (e.key === 'ArrowLeft' && player.x > 0) {
                player.x -= speed;
            } else if (e.key === 'ArrowRight' && player.x + player.width < canvas.width) {
                player.x += speed;
            }
        });
        canvas.addEventListener('touchstart', handleTouch, { passive: false });
        canvas.addEventListener('touchmove', handleTouch, { passive: false });
        canvas.addEventListener('touchstart', ativarTelaCheiaMobile);
        canvas.addEventListener('click', ativarTelaCheiaMobile);
        canvas.listenersAdded = true;
    }
}



window.addEventListener("resize", () => {
    if (canvas) {
        ajustarCanvas();
        ajustarTamanhos();
    }
});document.getElementById("backToLogin").addEventListener("click", function() {
    document.getElementById("rankingScreen").style.display = "none";
    document.getElementById("loginScreen").style.display = "block";
});
