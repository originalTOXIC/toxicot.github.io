document.addEventListener("DOMContentLoaded", function() {
    var popup = document.getElementById("valorant-popup");
    var link = document.getElementById("valorant-link");
    var close = document.getElementsByClassName("close")[0];

    link.onclick = function(event) {
        event.preventDefault();
        popup.style.display = "block";
    }

    close.onclick = function() {
        popup.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == popup) {
            popup.style.display = "none";
        }
    }
});