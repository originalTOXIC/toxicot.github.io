document.addEventListener("DOMContentLoaded", function() {
    var valorantPopup = document.getElementById("valorant-popup");
    var valorantLink = document.getElementById("valorant-link");
    var discordPopup = document.getElementById("discord-popup");
    var discordLink = document.getElementById("discord-link");

    valorantLink.onclick = function(event) {
        event.preventDefault();
        valorantPopup.style.display = "block";
    }

    discordLink.onclick = function(event) {
        event.preventDefault();
        discordPopup.style.display = "block";
    }

    window.onclick = function(event) {
        if (event.target == valorantPopup) {
            valorantPopup.style.display = "none";
        }
        if (event.target == discordPopup) {
            discordPopup.style.display = "none";
        }
    }
});
