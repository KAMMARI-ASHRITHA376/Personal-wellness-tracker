document.addEventListener('DOMContentLoaded', () => {
    // =========================================
    // === HELPER: Daily History & Journal Sentiment ===
    // =========================================
    
    // 1. Simple Keyword Lists for Client-Side Sentiment Analysis
    const positiveKeywords = ['happy', 'good', 'great', 'awesome', 'excited', 'calm', 'peace', 'love', 'productive', 'achieved', 'enjoy', 'wonderful', 'better', 'relaxed'];
    const negativeKeywords = ['sad', 'bad', 'terrible', 'anxious', 'stressed', 'angry', 'tired', 'exhausted', 'hard', 'difficult', 'worried', 'nervous', 'upset', 'failed', 'busy'];

    function analyzeJournalSentiment(text) {
        if (!text) return 'none';
        const lowerText = text.toLowerCase();
        let score = 0;

        // Simple keyword counting
        positiveKeywords.forEach(word => { if (lowerText.includes(word)) score++; });
        negativeKeywords.forEach(word => { if (lowerText.includes(word)) score--; });

        if (score > 0) return 'positive';
        if (score < 0) return 'negative';
        return 'neutral';
    }

    function getTodayDateString() {
        return new Date().toISOString().split('T')[0];
    }

    function getDailyHistory() {
        return JSON.parse(localStorage.getItem('dailyHistory')) || {};
    }

    function saveToHistory(type, value) {
        const history = getDailyHistory();
        const today = getTodayDateString();
        if (!history[today]) history[today] = { mood: null, journal: '' };
        
        history[today][type] = value;
        localStorage.setItem('dailyHistory', JSON.stringify(history));
        
        // If we just saved a journal, immediately update the weekly summary
        if (type === 'journal') {
             updateWeeklySummary();
        }
    }

    function updateWeeklySummary() {
        const history = getDailyHistory();
        const today = new Date();
        let stats = { positive: 0, negative: 0, neutral: 0, total: 0 };
        let weeklyListHTML = '<ul class="weekly-list">';

        // Loop backwards from today for 7 days
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(today.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const displayDate = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            
            let status = 'No Entry';
            let statusClass = 'no-entry';

            if (history[dateStr] && history[dateStr].journal) {
                stats.total++;
                const sentiment = analyzeJournalSentiment(history[dateStr].journal);
                
                if (sentiment === 'positive') {
                    stats.positive++;
                    status = '😊 Positive';
                    statusClass = 'positive';
                } else if (sentiment === 'negative') {
                    stats.negative++;
                    status = '😔 Challenging';
                    statusClass = 'negative';
                } else {
                    stats.neutral++;
                    status = '😐 Neutral';
                    statusClass = 'neutral';
                }
            }

            weeklyListHTML += `
                <li class="weekly-item ${statusClass}">
                    <span class="weekly-date">${i === 0 ? 'Today' : displayDate}</span>
                    <span class="weekly-status">${status}</span>
                </li>
            `;
        }
        weeklyListHTML += '</ul>';

        renderWeeklyPage(stats, weeklyListHTML);
    }

    function renderWeeklyPage(stats, listHTML) {
        const summaryContainer = document.getElementById('weekly-summary-content');
        if (!summaryContainer) return;

        if (stats.total === 0) {
            summaryContainer.innerHTML = `
                <div style="text-align: center; padding: 30px; color: #666;">
                    <h3>No journal entries this week.</h3>
                    <p>Write in your Daily Journal to get personalized insights based on your words!</p>
                    <button class="btn nav-link" data-page="journal" style="margin-top:15px;">Go to Journal</button>
                </div>
                <div style="margin-top: 30px;">
                    <h4 style="margin-bottom: 15px; color: #555;">Past 7 Days</h4>
                    ${listHTML}
                </div>`;
             summaryContainer.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', handleNav));
            return;
        }

        let recommendationHTML = '';
        // Recommendation Logic based on JOURNAL sentiment
        if (stats.negative >= stats.positive) {
             recommendationHTML = `
                <div class="recommendation-card tough-week">
                    <h3>Focus on Relaxation</h3>
                    <p>Your journal entries suggest you might be feeling stressed or down. We recommend:</p>
                    <ul>
                        <li>🧘‍♀️ <strong>Meditation:</strong> Try the "Instant Inner Peace" track.</li>
                        <li>🌬️ <strong>Games:</strong> The "Mindful Breathing" exercise can help center you.</li>
                    </ul>
                    <div style="margin-top: 15px; text-align: center;">
                        <button class="btn nav-link" data-page="meditation">Go to Meditation</button>
                    </div>
                </div>`;
        } else {
             recommendationHTML = `
                <div class="recommendation-card good-week">
                    <h3>Keep the Momentum!</h3>
                    <p>Your journal entries are looking positive! Let's keep that energy up:</p>
                    <ul>
                        <li>🎮 <strong>Games:</strong> Challenge yourself with "Quick Tap".</li>
                        <li>✅ <strong>To-Do:</strong> Set a new goal for tomorrow while you feel good.</li>
                    </ul>
                    <div style="margin-top: 15px; text-align: center;">
                        <button class="btn nav-link" data-page="games">Play Games</button>
                    </div>
                </div>`;
        }

        summaryContainer.innerHTML = `
            ${recommendationHTML}
            <div style="margin-top: 40px;">
                <h4 style="margin-bottom: 15px; color: #333; border-bottom: 2px solid #ff7e5f; padding-bottom: 10px;">Your 7-Day Journal Log</h4>
                ${listHTML}
            </div>
        `;

        summaryContainer.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', handleNav));
    }

    // =========================================
    // === END NEW HELPER SECTION ===
    // =========================================

    // --- CORE APP VARIABLES ---
    let currentUserMood = null;
    let activeGameInterval = null;

    const clearActiveGame = () => {
        if (activeGameInterval) {
            clearInterval(activeGameInterval);
            activeGameInterval = null;
        }
    };

    let users = [];
    let isLogin = true;

    const authScreen = document.getElementById('authScreen');
    const appInterface = document.getElementById('appInterface');
    const authTitle = document.getElementById('authTitle');
    const toggleAuth = document.getElementById('toggleAuth');
    const authBtn = document.getElementById('authBtn');
    const emailInput = document.getElementById('authEmail');
    const usernameInput = document.getElementById('authUsername');
    const passwordInput = document.getElementById('authPassword');

    function showAuthScreen() {
        authScreen.style.display = 'flex';
        appInterface.style.display = 'flex';
    }
    function showAppInterface() {
        authScreen.style.display = 'none';
        appInterface.style.display = 'flex';
    }

    document.querySelectorAll('.nav-link[data-page="login"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showAuthScreen();
        });
    });

    toggleAuth.addEventListener('click', () => {
        isLogin = !isLogin;
        if (isLogin) {
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

    authBtn.addEventListener('click', () => {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        const email = emailInput.value.trim();

        if (isLogin) {
            const user = users.find(u => u.username === username && u.password === password);
            if (user || (users.length === 0 && username && password)) {
                 if(users.length === 0) users.push({username, password, email: 'demo@example.com'});
                alert('Login successful!');
                showAppInterface();
            } else {
                alert('Invalid username or password!');
            }
        } else {
            if (!username || !password || !email) {
                alert('Please fill all fields!');
                return;
            }
            if (users.find(u => u.username === username)) {
                alert('Username already exists!');
                return;
            }
            users.push({ username, password, email });
            alert('Sign Up successful! You can now login.');
            toggleAuth.click();
        }
    });

    showAuthScreen();

    /* --- Navigation & Page Logic --- */
    const pages = document.querySelectorAll('.page');
    const navLinks = document.querySelectorAll('.nav-link');
    const navCards = document.querySelectorAll('.nav-card');

    const showPage = (pageId) => {
        if (pageId !== 'games') clearActiveGame();
        if (!pageId || !document.getElementById(pageId)) pageId = 'home';
        
        pages.forEach(page => page.classList.toggle('active', page.id === pageId));
        navLinks.forEach(link => {
            if (link.dataset.page !== 'login') link.classList.toggle('active', link.dataset.page === pageId);
        });

        if(pageId !== 'login') window.location.hash = pageId;
        if (pageId === 'games') renderGamesPage();
        // NEW: Refresh weekly summary every time we visit the page to ensure it's up to date
        if (pageId === 'weekly') updateWeeklySummary();
    };

    const handleNav = (event) => {
        event.preventDefault();
        const pageId = event.currentTarget.dataset.page;
        if (pageId && pageId !== 'login') showPage(pageId);
    };

    navLinks.forEach(link => link.addEventListener('click', handleNav));
    navCards.forEach(card => card.addEventListener('click', handleNav));

    const initialPage = window.location.hash.substring(1) || 'home';
    showPage(initialPage);

    /* --- Mood Tracker Logic --- */
    const moodButtons = document.querySelectorAll('.mood-btn');
    const moodConfirmation = document.getElementById('mood-confirmation');
    moodButtons.forEach(button => {
        button.addEventListener('click', () => {
            const mood = button.dataset.mood;
            currentUserMood = mood;
            saveToHistory('mood', mood);
            moodConfirmation.textContent = `Mood logged: ${mood}`;
            setTimeout(() => { if (moodConfirmation) moodConfirmation.textContent = '' }, 3000);
        });
    });

    /* --- Journal Logic --- */
    const journalEntry = document.getElementById('journal-entry');
    const saveJournalBtn = document.getElementById('save-journal-btn');
    const saveConfirmation = document.getElementById('save-confirmation');

    if (journalEntry) {
        const history = getDailyHistory();
        const today = getTodayDateString();
        if (history[today] && history[today].journal) {
            journalEntry.value = history[today].journal;
        } else {
             journalEntry.value = localStorage.getItem('journalEntry') || '';
        }
    }

    saveJournalBtn?.addEventListener('click', () => {
        saveToHistory('journal', journalEntry.value);
        localStorage.setItem('journalEntry', journalEntry.value);
        saveConfirmation.textContent = 'Saved to daily history!';
        setTimeout(() => { if (saveConfirmation) saveConfirmation.textContent = ''; }, 2000);
    });

    /* --- To-Do List Logic --- */
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
            li.innerHTML = `
                <input type="checkbox" class="complete-checkbox" data-index="${index}" ${todo.completed ? 'checked' : ''}>
                <span>${todo.text}</span>
                <button class="delete-btn" data-index="${index}" aria-label="Delete task">&times;</button>
            `;
            todoList.appendChild(li);
        });
    };

    const saveTodos = () => { localStorage.setItem('todos', JSON.stringify(todos)); };

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
            todos.splice(parseInt(target.dataset.index, 10), 1);
        } else if (target.matches('.complete-checkbox')) {
            todos[parseInt(target.dataset.index, 10)].completed = target.checked;
        }
        saveTodos();
        renderTodos();
    });
    renderTodos();

    /* --- Meditation Timer Logic --- */
    const startBtn = document.getElementById('start-timer');
    const timeDisplay = document.getElementById('time-display');
    const minutesInput = document.getElementById('minutes');
    const meditationAudio = document.getElementById('meditation-audio');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const trackSelector = document.getElementById('track-selector');
    let timerInterval;

    const audioTracks = [
        { name: "Earth Resonance", src: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=meditation-impulse-30266.mp3" },
        { name: "Peaceful Garden", src: "https://cdn.pixabay.com/download/audio/2022/03/09/audio_c8c90c59c5.mp3?filename=mindfulness-relaxation-amp-meditation-music-22174.mp3" },
        { name: "Deep Om", src: "https://cdn.pixabay.com/download/audio/2021/09/06/audio_3e6d192565.mp3?filename=meditation-music-singing-bowls-11345.mp3" }
    ];

    if (trackSelector) {
         audioTracks.forEach(track => {
            const option = document.createElement('option');
            option.value = track.src;
            option.textContent = track.name;
            trackSelector.appendChild(option);
        });
        if(meditationAudio) meditationAudio.src = audioTracks[0].src;
    }

    startBtn?.addEventListener('click', () => {
        let time = parseInt(minutesInput.value) * 60;
        if (isNaN(time) || time <= 0) { alert("Please enter a valid number of minutes."); return; }
        clearInterval(timerInterval);
        if(meditationAudio) {
             meditationAudio.play().catch(e => console.log("Audio play failed:", e));
             if(playPauseBtn) playPauseBtn.textContent = "⏸ Pause";
        }
        let mins = Math.floor(time / 60);
        let secs = time % 60;
        timeDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

        timerInterval = setInterval(() => {
            time--;
            let mins = Math.floor(time / 60);
            let secs = time % 60;
            timeDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            if (time <= 0) {
                clearInterval(timerInterval);
                if(meditationAudio) { meditationAudio.pause(); meditationAudio.currentTime = 0; }
                if(playPauseBtn) playPauseBtn.textContent = "▶ Play";
                alert("Meditation session finished!");
            }
        }, 1000);
    });

    playPauseBtn?.addEventListener('click', () => {
        if (meditationAudio.paused) {
            meditationAudio.play();
            playPauseBtn.textContent = "⏸ Pause";
        } else {
            meditationAudio.pause();
            playPauseBtn.textContent = "▶ Play";
        }
    });

    trackSelector?.addEventListener('change', (e) => { meditationAudio.src = e.target.value; });
    volumeSlider?.addEventListener('input', (e) => { meditationAudio.volume = e.target.value; });

    /* --- Cycle Tracker Logic --- */
    const lastPeriodInput = document.getElementById('last-period-date');
    const cycleLengthInput = document.getElementById('cycle-length');
    const saveCycleBtn = document.getElementById('save-cycle-btn');
    const cycleDisplayGrid = document.getElementById('cycle-display-grid');
    const cycleMessage = document.getElementById('cycle-message');
    let cycleData = JSON.parse(localStorage.getItem('cycleData')) || { lastPeriodDate: '', cycleLength: 28 };

    const saveCycleData = () => { localStorage.setItem('cycleData', JSON.stringify(cycleData)); };
    const formatDate = (date) => { return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); };

    const calculateAndDisplayCycle = () => {
        if (!cycleData.lastPeriodDate) {
            if (cycleDisplayGrid) cycleDisplayGrid.innerHTML = '';
            if (cycleMessage) cycleMessage.textContent = 'Please log your last period start date.';
            return;
        }
        if (cycleMessage) cycleMessage.textContent = '';

        const lastDate = new Date(cycleData.lastPeriodDate + 'T00:00:00');
        const cycleLen = parseInt(cycleData.cycleLength, 10) || 28;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24)) + 1;
        const nextPeriodDate = new Date(lastDate);
        nextPeriodDate.setDate(lastDate.getDate() + cycleLen);
        const ovulationDay = new Date(nextPeriodDate);
        ovulationDay.setDate(nextPeriodDate.getDate() - 14);
        const fertileStart = new Date(ovulationDay);
        fertileStart.setDate(ovulationDay.getDate() - 5);
        const fertileEnd = new Date(ovulationDay);
        fertileEnd.setDate(ovulationDay.getDate() + 1);

        if (cycleDisplayGrid) {
            cycleDisplayGrid.innerHTML = `
                <div class="cycle-info-card"><h4>Current Day</h4><p>Day ${diffDays > 0 ? diffDays : '-'}</p></div>
                <div class="cycle-info-card"><h4>Next Period</h4><p>${formatDate(nextPeriodDate)}</p></div>
                <div class="cycle-info-card"><h4>Fertile Window</h4><p>${formatDate(fertileStart)} - ${formatDate(fertileEnd)}</p></div>
            `;
        }
    };

    const loadCycleData = () => {
        if (lastPeriodInput && cycleLengthInput && cycleData.lastPeriodDate) {
            lastPeriodInput.value = cycleData.lastPeriodDate;
            cycleLengthInput.value = cycleData.cycleLength;
            calculateAndDisplayCycle();
        }
    };

    saveCycleBtn?.addEventListener('click', () => {
        if (!lastPeriodInput.value) { alert("Please select a start date."); return; }
        cycleData.lastPeriodDate = lastPeriodInput.value;
        cycleData.cycleLength = cycleLengthInput.value || 28;
        saveCycleData();
        calculateAndDisplayCycle();
        alert("Cycle data saved!");
    });
    loadCycleData();

    /* --- Games Logic --- */
    const gamesContent = document.getElementById('games-content');
    const gamesByMood = {
        'Happy': [{ id: 'reaction', title: 'Quick Tap', description: 'Test your reflexes!' }],
        'Calm': [{ id: 'breathing', title: 'Mindful Breathing', description: 'Center yourself with a guided exercise.' }],
        'Sad': [{ id: 'breathing', title: 'Mindful Breathing', description: 'Find a moment of peace and calm.' }],
        'Anxious': [{ id: 'breathing', title: 'Mindful Breathing', description: 'Soothe your anxiety with deep breaths.' }],
        'Angry': [{ id: 'reaction', title: 'Quick Tap', description: 'Channel your energy into this fast-paced game.' }]
    };

    const renderGamesPage = () => {
        clearActiveGame();
        if (!gamesContent) return;
        if (!currentUserMood) {
            gamesContent.innerHTML = `<div class="content-box"><p style="text-align:center; font-weight: 600;">Please track your mood on the Mood Tracker page first to get personalized suggestions!</p></div>`;
            return;
        }
        const suggestedGames = gamesByMood[currentUserMood] || gamesByMood['Calm'];
        gamesContent.innerHTML = `
             <div style="text-align: center; margin-bottom: 30px;"><h3>Suggestions for when you feel ${currentUserMood}</h3></div>
            <div class="features-row" id="game-suggestions">
                ${suggestedGames.map(game => `
                    <div class="feature-card games nav-card" data-game-id="${game.id}">
                        <h3>${game.title}</h3><p>${game.description}</p>
                    </div>`).join('')}
            </div>
            <div id="active-game-container" class="content-box" style="margin-top: 40px; display:none;"></div>
        `;
        document.getElementById('game-suggestions')?.addEventListener('click', (e) => {
            const card = e.target.closest('.feature-card');
            if (card) launchGame(card.dataset.gameId);
        });
    };

    const launchGame = (gameId) => {
        clearActiveGame();
        document.getElementById('game-suggestions').style.display = 'none';
        const gameContainer = document.getElementById('active-game-container');
        gameContainer.style.display = 'block';
        gameContainer.innerHTML = '';
        const backButton = document.createElement('button');
        backButton.textContent = '← Back to Games';
        backButton.className = 'btn';
        backButton.style.marginBottom = '20px';
        backButton.onclick = renderGamesPage;
        gameContainer.appendChild(backButton);

        if (gameId === 'breathing') playBreathingGame(gameContainer);
        else if (gameId === 'reaction') playReactionGame(gameContainer);
    };

    const playBreathingGame = (container) => {
        container.innerHTML += `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 30px; padding: 20px;">
                <p id="breathing-text" style="font-size: 1.8rem; font-weight: 700; color: #555; min-height: 2.5rem;">Get Ready...</p>
                <div id="breathing-circle" style="width: 150px; height: 150px; background: linear-gradient(135deg, #a1c4fd, #c2e9fb); border-radius: 50%; box-shadow: 0 10px 20px rgba(161, 196, 253, 0.4); transition: transform 4s ease-in-out;"></div>
            </div>`;
        const circle = document.getElementById('breathing-circle');
        const text = document.getElementById('breathing-text');
        const breathCycle = () => {
            if (!text || !circle || !document.getElementById('active-game-container')) return;
            text.textContent = 'Breathe In...';
            circle.style.transform = 'scale(1.5)';
            activeGameInterval = setTimeout(() => {
                text.textContent = 'Hold...';
                activeGameInterval = setTimeout(() => {
                    text.textContent = 'Breathe Out...';
                    circle.style.transform = 'scale(1)';
                    activeGameInterval = setTimeout(breathCycle, 4000);
                }, 4000);
            }, 4000);
        };
        setTimeout(breathCycle, 1000);
    };

    const playReactionGame = (container) => {
        let score = 0, timeLeft = 20;
        container.innerHTML += `
            <div style="text-align: center; margin-bottom: 15px; font-size: 1.2rem; font-weight: bold;">
                 Score: <span id="reaction-score" style="color: #ff7e5f;">0</span> | Time: <span id="reaction-time" style="color: #555;">20</span>s
            </div>
            <div id="reaction-area" style="position: relative; height: 400px; background: #f9f9f9; border: 2px dashed #ddd; border-radius: 12px; cursor: crosshair; overflow: hidden;"></div>`;
        const area = document.getElementById('reaction-area');
        const scoreEl = document.getElementById('reaction-score');
        const timeEl = document.getElementById('reaction-time');

        const spawnTarget = () => {
            if (!document.getElementById('reaction-area')) return;
            const existingTarget = area.querySelector('.target');
            if (existingTarget) existingTarget.remove();
            const target = document.createElement('div');
            target.className = 'target';
            target.style.cssText = `width: 60px; height: 60px; background: radial-gradient(circle at 30% 30%, #ff7e5f, #d9534f); position: absolute; border-radius: 50%; box-shadow: 0 4px 8px rgba(0,0,0,0.2); transition: transform 0.1s; top: ${Math.random() * (area.clientHeight - 60)}px; left: ${Math.random() * (area.clientWidth - 60)}px;`;
            target.onmousedown = () => target.style.transform = 'scale(0.9)';
            target.onmouseup = () => { score++; if(scoreEl) scoreEl.textContent = score; spawnTarget(); };
            area.appendChild(target);
        };

        activeGameInterval = setInterval(() => {
            timeLeft--;
            if (timeEl) timeEl.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(activeGameInterval);
                if(area) area.innerHTML = `<div style="display: flex; justify-content: center; align-items: center; height: 100%; flex-direction: column;"><h3 style="font-size: 2rem; color: #333;">Game Over!</h3><p style="font-size: 1.5rem; color: #ff7e5f;">Final Score: ${score}</p></div>`;
            }
        }, 1000);
        spawnTarget();
    };

    updateWeeklySummary();
});
