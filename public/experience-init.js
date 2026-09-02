(function () {
  var stored = null;
  var prefersReducedMotion = false;

  try {
    stored = window.localStorage.getItem("mks98-experience");
  } catch {}

  if (stored !== "immersive" && stored !== "accessible") {
    try {
      prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {}
  }

  document.documentElement.setAttribute(
    "data-experience",
    stored === "immersive" || stored === "accessible"
      ? stored
      : prefersReducedMotion
        ? "accessible"
        : "immersive",
  );
})();
