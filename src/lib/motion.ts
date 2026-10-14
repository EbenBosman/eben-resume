/**
 * Inline <head> script: marks the page `motion-ready` before first paint so [data-reveal] items
 * can start hidden without a flash. If RevealObserver never boots (JS error), it is undone after
 * 4s so content can never stay invisible.
 */
export const MOTION_BOOT_SCRIPT = `(function(){var d=document.documentElement;if(!('IntersectionObserver' in window))return;d.classList.add('motion-ready');setTimeout(function(){if(!d.classList.contains('reveal-live'))d.classList.remove('motion-ready')},4000)})();`;
