document.addEventListener('DOMContentLoaded', function() {
    fetch('nav.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-placeholder').innerHTML = data;
        });
});

function openNav() {
    var nav = document.querySelector('#navbar-placeholder nav');
    if (nav.style.display === "block") {
        nav.style.display = "none";
    } else {
        nav.style.display = "block";
    }
}
// JavaScript (optional, for re-triggering animation if needed)
const scrollingText = document.querySelector('.scrolling-text');

scrollingText.addEventListener('animationiteration', () => {
  scrollingText.style.animation = 'none';
  requestAnimationFrame(() => scrollingText.style.animation = '');
});
