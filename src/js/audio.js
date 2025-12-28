// --- Playlist: add your own audio files here (in /src/audio or anywhere you like) ---
const playlist = [
    {
        title: "Til Further Notice",
        src: "src/audio/til-further-notice.mp3"
    },
    {
        title: "Second Track",
        src: "src/audio/second-track.mp3"
    },
    {
        title: "Third Track",
        src: "src/audio/third-track.mp3"
    }
];

const audio = document.getElementById("ap-audio");
const titleEl = document.getElementById("ap-title");
const currentEl = document.getElementById("ap-current");
const durationEl = document.getElementById("ap-duration");
const playBtn = document.getElementById("ap-play");
const playIcon = document.getElementById("ap-play-icon");
const prevBtn = document.getElementById("ap-prev");
const nextBtn = document.getElementById("ap-next");
const seek = document.getElementById("ap-seek");
const fill = document.getElementById("ap-fill");
const thumb = document.getElementById("ap-thumb");
const bufferBar = document.getElementById("ap-buffer");
const volumeRange = document.getElementById("ap-volume-range");
const muteBtn = document.getElementById("ap-mute");
const volumeIconSvg = document.getElementById("ap-volume-icon-svg");

let currentIndex = 0;
let isSeeking = false;
let lastVolume = volumeRange.value;

function loadTrack(index) {
    const track = playlist[index];
    if (!track) return;
    audio.src = track.src;
    audio.load();
    titleEl.textContent = track.title;
    currentEl.textContent = "0:00";
    durationEl.textContent = "0:00";
    fill.style.width = "0%";
    thumb.style.left = "0%";
}

function formatTime(sec) {
    if (isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

function setPlayIcon(isPlaying) {
    if (isPlaying) {
        // pause icon
        playIcon.innerHTML = '<path fill="currentColor" d="M8 5h3v14H8zm5 0h3v14h-3z"/>';
    } else {
        // play icon
        playIcon.innerHTML = '<path fill="currentColor" d="M8 5v14l11-7z"/>';
    }
}

function setVolumeIcon(volume, muted) {
    if (muted || volume === 0) {
        volumeIconSvg.innerHTML = '<path fill="currentColor" d="M5 9v6h4l5 5V4L9 9H5zm9.59 3 1.7 1.71-1.41 1.41L13.17 13l1.71-1.71 1.41 1.41z"/>';
    } else if (volume < 0.4) {
        volumeIconSvg.innerHTML = '<path fill="currentColor" d="M5 9v6h4l5 5V4L9 9H5zm7 2.23v1.54c.58-.2 1-.76 1-1.43 0-.67-.42-1.23-1-1.43z"/>';
    } else {
        volumeIconSvg.innerHTML = '<path fill="currentColor" d="M5 9v6h4l5 5V4L9 9H5zm7 1v4c1.73-.55 3-2.19 3-4s-1.27-3.45-3-4v4z"/>';
    }
}

// --- Event bindings ---
playBtn.addEventListener("click", () => {
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
});

audio.addEventListener("play", () => setPlayIcon(true));
audio.addEventListener("pause", () => setPlayIcon(false));

audio.addEventListener("timeupdate", () => {
    if (isSeeking) return;
    currentEl.textContent = formatTime(audio.currentTime);
    if (audio.duration) {
        const pct = (audio.currentTime / audio.duration) * 100;
        fill.style.width = pct + "%";
        thumb.style.left = pct + "%";
    }
});

audio.addEventListener("loadedmetadata", () => {
    durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener("progress", () => {
    try {
        if (audio.buffered.length > 0 && audio.duration > 0) {
            const bufferedEnd = audio.buffered.end(audio.buffered.length - 1);
            const pct = (bufferedEnd / audio.duration) * 100;
            bufferBar.style.width = pct + "%";
        }
    } catch (e) {}
});

audio.addEventListener("ended", () => {
    // auto next, loop playlist
    currentIndex = (currentIndex + 1) % playlist.length;
    loadTrack(currentIndex);
    audio.play();
});

// seek interaction
function handleSeek(clientX) {
    const rect = seek.getBoundingClientRect();
    let pct = (clientX - rect.left) / rect.width;
    pct = Math.min(Math.max(pct, 0), 1);
    if (audio.duration) {
        const newTime = pct * audio.duration;
        audio.currentTime = newTime;
        currentEl.textContent = formatTime(newTime);
        fill.style.width = (pct * 100) + "%";
        thumb.style.left = (pct * 100) + "%";
    }
}

seek.addEventListener("pointerdown", (e) => {
    isSeeking = true;
    seek.setPointerCapture(e.pointerId);
    handleSeek(e.clientX);
});

seek.addEventListener("pointermove", (e) => {
    if (!isSeeking) return;
    handleSeek(e.clientX);
});

seek.addEventListener("pointerup", (e) => {
    isSeeking = false;
    seek.releasePointerCapture(e.pointerId);
});

seek.addEventListener("pointerleave", (e) => {
    if (isSeeking) {
        isSeeking = false;
        seek.releasePointerCapture(e.pointerId);
    }
});

// previous / next
prevBtn.addEventListener("click", () => {
    if (audio.currentTime > 3) {
        audio.currentTime = 0;
        return;
    }
    currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    loadTrack(currentIndex);
    audio.play();
});

nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % playlist.length;
    loadTrack(currentIndex);
    audio.play();
});

// volume & mute
volumeRange.addEventListener("input", (e) => {
    audio.volume = e.target.value;
    if (audio.volume > 0) lastVolume = audio.volume;
    setVolumeIcon(audio.volume, audio.muted);
});

muteBtn.addEventListener("click", () => {
    if (audio.muted || audio.volume === 0) {
        audio.muted = false;
        audio.volume = lastVolume || 0.75;
        volumeRange.value = audio.volume;
    } else {
        audio.muted = true;
        audio.volume = 0;
        volumeRange.value = 0;
    }
    setVolumeIcon(audio.volume, audio.muted);
});

// keyboard shortcuts when player focused
document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        e.preventDefault();
        playBtn.click();
    } else if (e.code === "ArrowRight") {
        audio.currentTime = Math.min(audio.currentTime + 5, audio.duration || audio.currentTime);
    } else if (e.code === "ArrowLeft") {
        audio.currentTime = Math.max(audio.currentTime - 5, 0);
    }
});

// init
audio.volume = volumeRange.value;
setVolumeIcon(audio.volume, audio.muted);
loadTrack(currentIndex);
