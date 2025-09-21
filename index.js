// Combined and consistent logic for Wellness Hub, including authentication and navigation
document.addEventListener('DOMContentLoaded', () => {
let currentUserMood = null; // Store the user's latest mood
let activeGameInterval = null; // To hold the active game's interval/timeout ID

// --- Helper to clear any running game interval/timeout ---
const clearActiveGame = () => {
    if (activeGameInterval) {
        // clearInterval can also clear timeouts
        clearInterval(activeGameInterval);
        activeGameInterval = null;
    }
};

// --- Authentication Logic ---
let users = []; // In-memory users array
let isLogin = true;
const authScreen = document.getElementById('authScreen');
const appInterface = document.getElementById('appInterface');
const authTitle = document.getElementById('authTitle');
const toggleAuth = document.getElementById('toggleAuth');
const authBtn = document.getElementById('authBtn');
const emailInput = document.getElementById('authEmail');
const usernameInput = document.getElementById('authUsername');
const passwordInput = document.getElementById('authPassword');
// Show login screen on first load
function showAuthScreen() {
authScreen.style.display = 'flex';
appInterface.style.display = 'none';
}
function showAppInterface() {
authScreen.style.display = 'none';
appInterface.style.display = 'block';
}
// If user clicks 'Login' in nav, show login screen
document.querySelectorAll('.nav-link[data-page="login"]').forEach(link => {
link.addEventListener('click', (e) => {
e.preventDefault();
showAuthScreen();
});
});
// Toggle between Login and Sign Up
toggleAuth.addEventListener('click', () => {
isLogin = !isLogin;
if(isLogin) {
authTitle.innerText = 'Login';
authBtn.innerText = 'Login';
emailInput.style.display = 'none';
toggleAuth.innerText = "Don't have an account? Sign Up";
} else {
authTitle.innerText = 'Sign Up';
authBtn.innerText = 'Sign Up';
emailInput.style.display = 'block';
toggleAuth.innerText = "Already have an account? Login";
}
});
// Login/Sign Up actions
authBtn.addEventListener('click', () => {
const username = usernameInput.value.trim();
const password = passwordInput.value.trim();
const email = emailInput.value.trim();

if(isLogin) {
    // Login
    const user = users.find(u => u.username === username && u.password === password);
    if(user) {
        alert('Login successful!');
        showAppInterface();
    } else {
        alert('Invalid username or password!');
    }
} else {
    // Sign Up
    if(!username || !password || !email) {
        alert('Please fill all fields!');
        return;
    }
    if(users.find(u => u.username === username)) {
        alert('Username already exists!');
        return;
    }
    users.push({username, password, email});
    alert('Sign Up successful! You can now login.');
    toggleAuth.click();
}
});
// Initial state: show login
showAuthScreen();
// --- Page Navigation Logic ---
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-link');
const navCards = document.querySelectorAll('.nav-card');
const showPage = (pageId) => {
// Clear active game if navigating away from the games page
if (pageId !== 'games') {
    clearActiveGame();
}

// Fallback for null or non-existent pageId
if (!pageId || !document.getElementById(pageId)) {
pageId = 'home';
}
pages.forEach(page => {
page.classList.toggle('active', page.id === pageId);
});
navLinks.forEach(link => {
link.classList.toggle('active', link.dataset.page === pageId);
});
window.location.hash = pageId;

// Render games page if that's the new page
if (pageId === 'games') {
renderGamesPage();
}
};
const handleNav = (event) => {
event.preventDefault();
const pageId = event.currentTarget.dataset.page;
if (pageId && pageId !== 'login') {
showPage(pageId);
}
};
navLinks.forEach(link => link.addEventListener('click', handleNav));
navCards.forEach(card => card.addEventListener('click', handleNav));
// Show initial page based on hash or default to home
const initialPage = window.location.hash.substring(1) || 'home';
showPage(initialPage);
// --- Mood Tracker Logic ---
const moodButtons = document.querySelectorAll('.mood-btn');
const moodConfirmation = document.getElementById('mood-confirmation');
moodButtons.forEach(button => {
button.addEventListener('click', () => {
const mood = button.dataset.mood;
currentUserMood = mood; // Save the mood
moodConfirmation.textContent = `Thank you for logging your mood: ${mood}`;
setTimeout(() => {
if (moodConfirmation) moodConfirmation.textContent = ''
}, 3000);
});
});
// --- Daily Journal Logic ---
const journalEntry = document.getElementById('journal-entry');
const saveJournalBtn = document.getElementById('save-journal-btn');
const saveConfirmation = document.getElementById('save-confirmation');
if (journalEntry) {
journalEntry.value = localStorage.getItem('journalEntry') || '';
}
saveJournalBtn?.addEventListener('click', () => {
localStorage.setItem('journalEntry', journalEntry.value);
saveConfirmation.textContent = 'Saved!';
setTimeout(() => {
if (saveConfirmation) saveConfirmation.textContent = '';
}, 2000);
});
// --- To-Do List Logic ---
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
let todos = JSON.parse(localStorage.getItem('todos')) || [];
const renderTodos = () => {
if (!todoList) return;
todoList.innerHTML = '';
todos.forEach((todo, index) => {
const li = document.createElement('li');
li.className = todo.completed ? 'completed' : '';
li.innerHTML = `<input type="checkbox" class="complete-checkbox" data-index="${index}" ${todo.completed ? 'checked' : ''}> <span>${todo.text}</span> <button class="delete-btn" data-index="${index}" aria-label="Delete task">&times;</button>`;
todoList.appendChild(li);
});
};
const saveTodos = () => {
localStorage.setItem('todos', JSON.stringify(todos));
};
todoForm?.addEventListener('submit', (e) => {
e.preventDefault();
const newTodoText = todoInput.value.trim();
if (newTodoText) {
todos.push({ text: newTodoText, completed: false });
todoInput.value = '';
saveTodos();
renderTodos();
}
});
todoList?.addEventListener('click', (e) => {
const target = e.target;
if (target.matches('.delete-btn')) {
const index = parseInt(target.dataset.index, 10);
todos.splice(index, 1);
} else if (target.matches('.complete-checkbox')) {
const index = parseInt(target.dataset.index, 10);
todos[index].completed = !todos[index].completed;
}
saveTodos();
renderTodos();
});
renderTodos();
// --- Meditation Timer Logic ---
const startBtn = document.getElementById('start-timer');
const timeDisplay = document.getElementById('time-display');
const minutesInput = document.getElementById('minutes');
let timerInterval;

startBtn?.addEventListener('click', () => {
  let time = parseInt(minutesInput.value) * 60;
  if (isNaN(time) || time <= 0) return;

  clearInterval(timerInterval);

  // Auto-start audio when timer begins
  meditationAudio.play();
  playPauseBtn.textContent = "⏸ Pause";

  timerInterval = setInterval(() => {
    let mins = Math.floor(time / 60);
    let secs = time % 60;
    timeDisplay.textContent =
      `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    if (time-- <= 0) {
      clearInterval(timerInterval);

      // Auto-stop audio when timer ends
      meditationAudio.pause();
      meditationAudio.currentTime = 0;
      playPauseBtn.textContent = "▶ Play";
    }
  }, 1000);
});

// --- Meditation Audio Logic ---
const meditationAudio = document.getElementById('meditation-audio');
const playPauseBtn = document.getElementById('play-pause-btn');
const volumeSlider = document.getElementById('volume-slider');
const trackSelector = document.getElementById('track-selector');

const audioTracks = [
  { name: "Earth Resonance Frequency", src: "Earth.mp3" },
  { name: "Instant Inner Peace", src: "Peace.mp3" },
  { name: "Positive Energy", src: "Positive.mp3" }
];

// Populate track dropdown
audioTracks.forEach(track => {
  const option = document.createElement('option');
  option.value = track.src;
  option.textContent = track.name;
  trackSelector.appendChild(option);
});

// Set default audio
meditationAudio.src = audioTracks[0].src;

// Play/Pause toggle
playPauseBtn?.addEventListener('click', () => {
  if (meditationAudio.paused) {
    meditationAudio.play();
    playPauseBtn.textContent = "⏸ Pause";
  } else {
    meditationAudio.pause();
    playPauseBtn.textContent = "▶ Play";
  }
});

// Change track
trackSelector?.addEventListener('change', (e) => {
  meditationAudio.src = e.target.value;
  meditationAudio.play();
  playPauseBtn.textContent = "⏸ Pause";
});

// Volume control
volumeSlider?.addEventListener('input', (e) => {
  meditationAudio.volume = e.target.value;
});

// --- HerCycle Logic ---
const lastPeriodInput = document.getElementById('last-period-date');
const cycleLengthInput = document.getElementById('cycle-length');
const saveCycleBtn = document.getElementById('save-cycle-btn');
const cycleDisplayGrid = document.getElementById('cycle-display-grid');
const cycleMessage = document.getElementById('cycle-message');
let cycleData = JSON.parse(localStorage.getItem('cycleData')) || {
lastPeriodDate: '',
cycleLength: 28,
};
const saveCycleData = () => {
localStorage.setItem('cycleData', JSON.stringify(cycleData));
};
const formatDate = (date) => {
return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
};
const calculateAndDisplayCycle = () => {
if (!cycleData.lastPeriodDate || !cycleDisplayGrid || !cycleMessage) {
    if(cycleDisplayGrid) cycleDisplayGrid.innerHTML = '';
    if(cycleMessage) cycleMessage.textContent = 'Please log your last period start date to see predictions.';
    return;
}
cycleMessage.textContent = '';
const lastDate = new Date(cycleData.lastPeriodDate + 'T00:00:00');
const cycleLength = parseInt(cycleData.cycleLength, 10);
// Current Day
const today = new Date();
today.setHours(0, 0, 0, 0);
const diffTime = today - lastDate; // No abs needed if today is always after
const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
// Next Period
const nextPeriodDate = new Date(lastDate);
nextPeriodDate.setDate(lastDate.getDate() + cycleLength);
// Fertile Window (Approximate: 12-16 days before next period)
const ovulationDay = new Date(nextPeriodDate);
ovulationDay.setDate(nextPeriodDate.getDate() - 14);
const fertileStart = new Date(ovulationDay);
fertileStart.setDate(ovulationDay.getDate() - 5);
const fertileEnd = new Date(ovulationDay);
fertileEnd.setDate(ovulationDay.getDate() + 1);
cycleDisplayGrid.innerHTML = `<div class="cycle-info-card"> <h4>Current Day</h4> <p>Day ${diffDays}</p> </div> <div class="cycle-info-card"> <h4>Next Period</h4> <p>~ ${formatDate(nextPeriodDate)}</p> </div> <div class="cycle-info-card"> <h4>Fertile Window</h4> <p>${formatDate(fertileStart)} - ${formatDate(fertileEnd)}</p> </div>`;
};
const loadCycleData = () => {
if(lastPeriodInput && cycleLengthInput) {
    if (cycleData.lastPeriodDate) {
        lastPeriodInput.value = cycleData.lastPeriodDate;
    }
    cycleLengthInput.value = cycleData.cycleLength;
    calculateAndDisplayCycle();
}
};
saveCycleBtn?.addEventListener('click', () => {
if (!lastPeriodInput.value) {
if(cycleMessage) cycleMessage.textContent = "Please select a start date.";
return;
}
cycleData.lastPeriodDate = lastPeriodInput.value;
cycleData.cycleLength = cycleLengthInput.value || 28;
saveCycleData();
calculateAndDisplayCycle();
if(cycleMessage) {
    cycleMessage.textContent = "Your cycle data has been saved!";
    setTimeout(() => cycleMessage.textContent = '', 3000);
}
});
loadCycleData();
// --- Stress-Relief Games Logic ---
const gamesContent = document.getElementById('games-content');
const gamesByMood = {
    'Happy': [{ id: 'reaction', title: 'Quick Tap', description: 'Test your reflexes!' }],
    'Calm': [{ id: 'breathing', title: 'Mindful Breathing', description: 'Center yourself with a guided exercise.' }],
    'Sad': [{ id: 'breathing', title: 'Mindful Breathing', description: 'Find a moment of peace and calm.' }],
    'Anxious': [{ id: 'breathing', title: 'Mindful Breathing', description: 'Soothe your anxiety with deep breaths.' }],
    'Angry': [{ id: 'reaction', title: 'Quick Tap', description: 'Channel your energy into this fast-paced game.' }]
};
const renderGamesPage = () => {
    clearActiveGame(); // Ensure no game is running when showing suggestions
    if (!gamesContent) return;
    if (!currentUserMood) {
        gamesContent.innerHTML = `<p style="text-align:center; font-weight: 600;">Please track your mood on the Mood Tracker page to get personalized game suggestions!</p>`;
        return;
    }
    const suggestedGames = gamesByMood[currentUserMood] || gamesByMood['Calm'];
    gamesContent.innerHTML = `
        <h3 style="text-align: center; margin-bottom: 20px; font-size: 1.2rem;">Based on your mood (${currentUserMood}), here are some suggestions:</h3>
        <div class="feature-grid" id="game-suggestions">
            ${suggestedGames.map(game => `
                <div class="card" data-game-id="${game.id}" style="background: linear-gradient(to bottom right, #00b09b, #96c93d); cursor: pointer;">
                    <h3>${game.title}</h3>
                    <p>${game.description}</p>
                </div>
            `).join('')}
        </div>
        <div id="active-game-container" style="margin-top: 20px;"></div>
    `;
    document.getElementById('game-suggestions')?.addEventListener('click', (e) => {
        const card = e.target.closest('.card');
        if (card) {
            const gameId = card.dataset.gameId;
            launchGame(gameId);
        }
    });
};
const launchGame = (gameId) => {
    clearActiveGame(); // Clear any previous game before starting a new one
    const gameSuggestions = document.getElementById('game-suggestions');
    if(gameSuggestions) gameSuggestions.style.display = 'none';

    const gameContainer = document.getElementById('active-game-container');
    if(!gameContainer) return;
    gameContainer.innerHTML = '';
    
    const backButton = document.createElement('button');
    backButton.textContent = '← Back to Suggestions';
    backButton.className = 'btn';
    backButton.style.marginBottom = '20px';
    backButton.onclick = renderGamesPage;
    gameContainer.appendChild(backButton);

    if (gameId === 'breathing') {
        playBreathingGame(gameContainer);
    } else if (gameId === 'reaction') {
        playReactionGame(gameContainer);
    }
};
const playBreathingGame = (container) => {
    container.innerHTML += `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 20px;">
            <p id="breathing-text" style="font-size: 1.5rem; font-weight: 600; min-height: 2rem;"></p>
            <div id="breathing-circle" style="width: 100px; height: 100px; background-color: #a1c4fd; border-radius: 50%; transition: transform 4s ease-in-out;"></div>
        </div>
    `;
    const circle = document.getElementById('breathing-circle');
    const text = document.getElementById('breathing-text');

    const breathCycle = () => {
        if(!text || !circle) return;
        text.textContent = 'Breathe In...';
        circle.style.transform = 'scale(2)';
        activeGameInterval = setTimeout(() => {
            text.textContent = 'Hold';
            activeGameInterval = setTimeout(() => {
                text.textContent = 'Breathe Out...';
                circle.style.transform = 'scale(1)';
                activeGameInterval = setTimeout(breathCycle, 6000); // 6s exhale
            }, 4000); // 4s hold
        }, 4000); // 4s inhale
    };
    
    breathCycle();
};
const playReactionGame = (container) => {
    let score = 0;
    let timeLeft = 20;
    container.innerHTML += `
        <div style="text-align: center; margin-bottom: 15px;">
             <p style="font-size: 1.2rem;">Score: <span id="reaction-score">0</span> | Time Left: <span id="reaction-time">20</span>s</p>
        </div>
        <div id="reaction-area" style="position: relative; height: 300px; background: #f0f0f0; border-radius: 8px; cursor: crosshair;"></div>
    `;
    const area = document.getElementById('reaction-area');
    const scoreEl = document.getElementById('reaction-score');
    const timeEl = document.getElementById('reaction-time');

    if(!area || !scoreEl || !timeEl) return;

    const spawnTarget = () => {
        const existingTarget = area.querySelector('.target');
        if (existingTarget) existingTarget.remove();

        const target = document.createElement('div');
        target.className = 'target';
        target.style.width = '50px';
        target.style.height = '50px';
        target.style.background = '#ff7e5f';
        target.style.position = 'absolute';
        target.style.borderRadius = '50%';
        target.style.top = `${Math.random() * (area.clientHeight - 50)}px`;
        target.style.left = `${Math.random() * (area.clientWidth - 50)}px`;
        target.onclick = () => {
            score++;
            scoreEl.textContent = score;
            spawnTarget();
        };
        area.appendChild(target);
    };

    const endGame = () => {
        clearActiveGame();
        area.innerHTML = `<p style="font-size: 1.5rem; font-weight: bold; text-align: center; padding-top: 120px;">Game Over! Your score: ${score}</p>`;
    };
    
    activeGameInterval = setInterval(() => {
        timeLeft--;
        if (timeEl) {
          timeEl.textContent = timeLeft;
        }
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
    
    spawnTarget();
};

});