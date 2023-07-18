const setupTextarea = document.getElementById("setup-textarea");
const setupInputContainer = document.getElementById("setup-input-container");
const movieBossText = document.getElementById("movie-boss-text");

document.getElementById("send-btn").addEventListener("click", () => {
    if (setupTextarea) {
        setupInputContainer.innerHTML = '<img src="images/loading.svg" class="loading" id = "loading">'
        movieBossText.innerHTML = "Stupid idea is being un-stupided..."
    }
});