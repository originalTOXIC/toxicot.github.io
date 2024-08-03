document.addEventListener("DOMContentLoaded", function() {
    var popup = document.getElementById("valorant-popup");
    var link = document.getElementById("valorant-link");

    link.onclick = function(event) {
        event.preventDefault();
        popup.style.display = "block";
    }

    window.onclick = function(event) {
        if (event.target == popup) {
            popup.style.display = "none";
        }
    }
});
