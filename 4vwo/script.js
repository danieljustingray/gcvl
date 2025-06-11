function removeAllCSS() {
  // Remove external and internal stylesheets
  document.querySelectorAll('style, link[rel="stylesheet"]').forEach(el => el.remove());

  // Remove inline styles
  document.querySelectorAll('*').forEach(el => el.removeAttribute('style'));
}
  const defaultSize = 16;
    let fontSize = parseInt(localStorage.getItem("globalFontSize")) || defaultSize;

    function applyFontSize() {
      document.body.style.fontSize = fontSize + "px";
    }

    function changeFontSize(delta) {
      fontSize += delta;
      localStorage.setItem("globalFontSize", fontSize);
      applyFontSize();
    }

    function resetFontSize() {
      fontSize = defaultSize;
      localStorage.removeItem("globalFontSize");
      applyFontSize();
    }

    // Apply saved size on load
    applyFontSize();

    // Toggle panel visibility
    document.getElementById("accessibility-toggle").addEventListener("click", () => {
      document.getElementById("accessibility-controls").classList.toggle("show");
    });