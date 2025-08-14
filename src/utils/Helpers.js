/* ========================================
   NEURAAL INTERFACE - UTILITY FUNCTIONS
   ======================================== */

/**
 * Smooth interpolation between two values
 * @param {number} start - Starting value
 * @param {number} end - Ending value
 * @param {number} factor - Interpolation factor (0-1)
 * @returns {number} Interpolated value
 */
export function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

/**
 * Smooth interpolation with exponential decay
 * @param {number} current - Current value
 * @param {number} target - Target value
 * @param {number} deltaTime - Time since last frame
 * @param {number} speed - Interpolation speed
 * @returns {number} Smoothly interpolated value
 */
export function smoothInterpolation(current, target, deltaTime, speed = 8.0) {
  const factor = Math.min(1.0, 1.0 - Math.exp(-speed * deltaTime));
  return lerp(current, target, factor);
}

/**
 * Update Three.js renderer and camera dimensions
 * @param {string} containerSelector - CSS selector for container
 * @returns {Object|false} Dimensions object or false if failed
 */
export function updateGlobeDimensions(containerSelector = '.globe-container') {
  const element = document.querySelector(containerSelector);
  if (!element) {
    console.warn(`Container ${containerSelector} not found`);
    return false;
  }
  
  const rect = element.getBoundingClientRect();
  
  if (window.renderer) {
    window.renderer.setSize(rect.width, rect.height);
  }
  
  if (window.camera) {
    window.camera.aspect = rect.width / rect.height;
    window.camera.updateProjectionMatrix();
  }
  
  return { width: rect.width, height: rect.height };
}

/**
 * Throttle function execution
 * @param {Function} func - Function to throttle
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, delay) {
  let lastCall = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      return func.apply(this, args);
    }
  };
}

/**
 * Debounce function execution
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * Clamp value between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Convert degrees to radians
 * @param {number} degrees - Degrees to convert
 * @returns {number} Radians
 */
export function degToRad(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Convert radians to degrees
 * @param {number} radians - Radians to convert
 * @returns {number} Degrees
 */
export function radToDeg(radians) {
  return radians * (180 / Math.PI);
}

/**
 * Generate random number between min and max
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random number
 */
export function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Generate random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random integer
 */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
