let currentS = 1;

// Función para cambiar de sección
function goToSection(n) {
    document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
    document.getElementById(`sec${n}`).classList.remove('hidden');

    // Actualizar puntos
    document.querySelectorAll('.dot').forEach((d, i) => {
        d.classList.toggle('active', (i + 1) === n);
    });

    // --- ESTE ES EL TRUCO PARA EL BOTÓN DEL MEDIO (SECCIÓN 2) ---
    if (n === 2) {
        resetBook();
    }

    currentS = n;
    if (n === 3) {
        // Inicializar reproductor si no se ha hecho
        if (document.getElementById('ipod-title').innerText === "Cargando...") {
            loadSong(0);
        }
    }
}

// Función para cerrar todas las páginas del libro
function resetBook() {
    // Buscamos todas las páginas y les quitamos la clase 'flipped'
    document.querySelectorAll('.page').forEach((page, index) => {
        page.classList.remove('flipped');
        // Restauramos el Z-Index original (P1: 3, P2: 2, P3: 1)
        page.style.zIndex = (3 - index);
    });
    // Reiniciamos el contador interno del libro
    currentP = 1;
    document.getElementById('myBook').classList.remove('open');
}

function navStep(step) {
    let target = currentS + step;
    if (target >= 1 && target <= 3) goToSection(target);
}

// Lógica del Libro (Tocar página para voltear)
let currentP = 1; // Variable global para el seguimiento del libro

function flipPage(num) {
    const page = document.getElementById(`p${num}`);
    if (page.classList.contains('flipped')) {
        page.classList.remove('flipped');
        // Retrasamos el z-index para que no tape bruscamente la animación
        setTimeout(() => {
            page.style.zIndex = (4 - num);
        }, 300);
        currentP--;
    } else {
        page.classList.add('flipped');
        // Retrasamos el z-index para que no tape bruscamente la animación
        setTimeout(() => {
            page.style.zIndex = num;
        }, 300);
        currentP++;
    }

    // Centrar el libro al abrirse
    if (currentP > 1) {
        document.getElementById('myBook').classList.add('open');
    } else {
        document.getElementById('myBook').classList.remove('open');
    }
}

// ==========================================
// LÓGICA DEL IPOD (Lista de canciones y mensajes)
// ==========================================
const playlist = [
    {
        title: "GO!",
        artist: "Cortis",
        cover: "img/mp3/14.jpg",
        src: "audio/GO!.mp3",
        message: "♪ «Por más crisis existenciales, cafés infinitos y risas de las que duelen. ¡Feliz vida!»"
    },
    {
        title: "What You Want",
        artist: "Cortis",
        cover: "img/mp3/15.jpg",
        src: "audio/what you want.mp3",
        message: "♪ «Agradecida con la vida por tenerte cerca tantos años. ¡Que este sea tu mejor año!»"
    },
    {
        title: "FaSHion",
        artist: "Cortis",
        cover: "img/mp3/145.jpg",
        src: "audio/FaSHion.mp3",
        message: "♪ «Deseo que este año tu cuenta bancaria suba tanto como tus notas y que el estrés sea lo único que te falte."
    },
    {
        title: "JoyRide",
        artist: "Cortis",
        cover: "img/mp3/GO!.jpg",
        src: "audio/JoyRide.mp3",
        message: "♪ «Deseos de compartir mas salidas de las que nos merecemos esos cafes y salidas abuelitas»"
    },
    {
        title: "Lulluby",
        artist: "Cortis",
        cover: "img/mp3/CORTIS!!.jpg",
        src: "audio/Lullaby.mp3",
        message: "♪ «¡Por muchos años más de locuras juntas, feliz cumpleaños!»"
    }
];

let currentSongIndex = 0;
let isPlaying = false;
let isMenuOpen = false;

function loadSong(index) {
    const song = playlist[index];
    document.getElementById('ipod-title').innerText = song.title;
    document.getElementById('ipod-artist').innerText = song.artist;

    // Si la imagen está vacía, usar local o la predefinida
    const coverUrl = song.cover && song.cover.trim() !== "" ? song.cover : "snopy.png";
    document.getElementById('ipod-cover').src = coverUrl;

    document.getElementById('musica-source').src = song.src;
    document.getElementById('musica').load();

    // Efecto de desvanecimiento suave para el mensaje
    const msgObj = document.getElementById('ipod-message');
    msgObj.style.opacity = 0;
    setTimeout(() => {
        msgObj.innerText = song.message;
        msgObj.style.opacity = 1;
    }, 300);

    updatePlayBtnText();
}

function updatePlayBtnText() {
    const btn = document.getElementById('wheel-center-btn');
    if (btn) {
        btn.innerText = isPlaying ? "Pause" : "Play";
    }
}

function togglePlay() {
    const audio = document.getElementById('musica');
    if (isPlaying) {
        audio.pause();
        isPlaying = false;
    } else {
        audio.play().catch(e => console.log("Esperando interacción para autoplay"));
        isPlaying = true;
    }
    updatePlayBtnText();
}

function changeVolume(val) {
    const audio = document.getElementById('musica');
    const slider = document.getElementById('volume-slider');

    // Si viene de los iconos, ajustamos si es 0 (mutear) o 1 (max)
    if (val === 0 || val === 1) {
        audio.volume = val;
        if (slider) slider.value = val;
    } else {
        audio.volume = val;
    }
}

function toggleMenu() {
    const menuEl = document.getElementById('ipod-menu');
    isMenuOpen = !isMenuOpen;
    if (isMenuOpen) {
        renderMenu();
        menuEl.classList.remove('hidden');
    } else {
        menuEl.classList.add('hidden');
    }
}

function renderMenu() {
    const listEl = document.getElementById('ipod-playlist');
    listEl.innerHTML = '';
    playlist.forEach((song, i) => {
        const li = document.createElement('li');
        li.innerText = `${i + 1}. ${song.title} - ${song.artist}`;
        if (i === currentSongIndex) {
            li.classList.add('active');
        }
        li.onclick = () => selectSong(i);
        listEl.appendChild(li);
    });
}

function selectSong(index) {
    currentSongIndex = index;
    isPlaying = true; // Forzar play al seleccionar
    loadSong(index);

    const audio = document.getElementById('musica');
    audio.play().catch(e => console.log("Autoplay bloqueado"));

    toggleMenu(); // Ocultar el menú tras seleccionar
}

function nextSong() {
    currentSongIndex++;
    if (currentSongIndex > playlist.length - 1) {
        currentSongIndex = 0; // Vuelve al inicio
    }
    loadSong(currentSongIndex);
    if (isPlaying) {
        const audio = document.getElementById('musica');
        audio.play().catch(e => console.log("Esperando interacción para autoplay"));
    }
}

function prevSong() {
    currentSongIndex--;
    if (currentSongIndex < 0) {
        currentSongIndex = playlist.length - 1; // Va al final
    }
    loadSong(currentSongIndex);
    if (isPlaying) {
        const audio = document.getElementById('musica');
        audio.play().catch(e => console.log("Esperando interacción para autoplay"));
    }
}



// Configurar Autoplay al terminar una canción
document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('musica');
    if (audio) {
        audio.addEventListener('ended', () => {
            nextSong();
        });
    }
});