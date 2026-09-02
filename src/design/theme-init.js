// Pre-paint theme initialization. Inlined into <head> via Next.js <Script strategy="beforeInteractive">
// or a raw <script> in layout to avoid a flash of the wrong theme.
//
// Resolution order:
//   1. Persisted explicit override ("theme" localStorage value: "light" | "dark")
//   2. Otherwise, follow prefers-color-scheme
// The chosen mode is applied as a .dark class on <html>.
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var dark = stored === "dark" || (!stored && prefersDark);
    document.documentElement.classList.toggle("dark", dark);
  } catch {
    /* no-op: localStorage may be unavailable */
  }
})();
