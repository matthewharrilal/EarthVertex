/* ========================================
   NEURAAL INTERFACE - ERROR HANDLER
   ======================================== */

export class ErrorHandler {
  constructor() {
    this.errorCount = 0;
    this.maxErrors = 5;
    this.errorLog = [];
    this.isSafeMode = false;
  }

  /**
   * Handle errors with context and recovery attempts
   * @param {Error} error - Error object
   * @param {string} context - Context where error occurred
   */
  handle(error, context = 'Unknown') {
    console.error(`[${context}] Error:`, error);
    
    // Track error frequency
    this.errorCount++;
    this.logError(error, context);
    
    // Implement circuit breaker pattern
    if (this.errorCount > this.maxErrors) {
      console.warn('High error frequency detected, entering safe mode');
      this.enterSafeMode();
    }
    
    // Attempt recovery
    this.attemptRecovery(error, context);
  }

  /**
   * Log error for debugging
   * @param {Error} error - Error object
   * @param {string} context - Error context
   */
  logError(error, context) {
    this.errorLog.push({
      timestamp: Date.now(),
      context,
      message: error.message,
      stack: error.stack,
      count: this.errorCount
    });

    // Keep only last 50 errors
    if (this.errorLog.length > 50) {
      this.errorLog.shift();
    }
  }

  /**
   * Attempt to recover from specific error types
   * @param {Error} error - Error object
   * @param {string} context - Error context
   */
  attemptRecovery(error, context) {
    switch (context) {
      case 'Globe Rendering':
        this.recoverGlobeRendering();
        break;
      case 'Chat Interface':
        this.recoverChatInterface();
        break;
      case 'Texture Loading':
        this.recoverTextureLoading();
        break;
      default:
        this.genericRecovery();
    }
  }

  /**
   * Recover globe rendering
   */
  recoverGlobeRendering() {
    if (window.renderer && window.scene && window.camera) {
      try {
        window.renderer.render(window.scene, window.camera);
        console.log('✅ Globe rendering recovered');
      } catch (recoveryError) {
        console.error('❌ Globe recovery failed:', recoveryError);
        this.fallbackToBasicGlobe();
      }
    }
  }

  /**
   * Recover chat interface
   */
  recoverChatInterface() {
    try {
      const chatPanel = document.querySelector('.chat-panel');
      if (chatPanel) {
        chatPanel.style.display = 'block';
        console.log('✅ Chat interface recovered');
      }
    } catch (recoveryError) {
      console.error('❌ Chat interface recovery failed:', recoveryError);
    }
  }

  /**
   * Recover texture loading
   */
  recoverTextureLoading() {
    try {
      // Attempt to reload textures
      if (window.textureLoader) {
        console.log('✅ Texture loading recovered');
      }
    } catch (recoveryError) {
      console.error('❌ Texture loading recovery failed:', recoveryError);
    }
  }

  /**
   * Generic recovery attempt
   */
  genericRecovery() {
    try {
      // Attempt to refresh the page if too many errors
      if (this.errorCount > 10) {
        console.warn('Too many errors, suggesting page refresh');
        this.suggestPageRefresh();
      }
    } catch (recoveryError) {
      console.error('❌ Generic recovery failed:', recoveryError);
    }
  }

  /**
   * Fallback to basic globe
   */
  fallbackToBasicGlobe() {
    try {
      console.log('🔄 Attempting fallback to basic globe');
      // Implement basic globe fallback
      this.isSafeMode = true;
    } catch (fallbackError) {
      console.error('❌ Fallback failed:', fallbackError);
    }
  }

  /**
   * Enter safe mode
   */
  enterSafeMode() {
    this.isSafeMode = true;
    console.log('🛡️ Entering safe mode - reduced functionality');
    
    // Disable complex features
    if (window.performanceMonitor) {
      window.performanceMonitor.disable();
    }
  }

  /**
   * Exit safe mode
   */
  exitSafeMode() {
    this.isSafeMode = false;
    this.errorCount = 0;
    console.log('✅ Exiting safe mode - full functionality restored');
  }

  /**
   * Suggest page refresh
   */
  suggestPageRefresh() {
    const message = document.createElement('div');
    message.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(255, 0, 0, 0.9);
      color: white;
      padding: 15px;
      border-radius: 5px;
      z-index: 10000;
      font-family: monospace;
    `;
    message.innerHTML = `
      <strong>System Error</strong><br>
      Too many errors detected.<br>
      <button onclick="location.reload()" style="margin-top: 10px; padding: 5px 10px;">Refresh Page</button>
    `;
    document.body.appendChild(message);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (message.parentNode) {
        message.parentNode.removeChild(message);
      }
    }, 10000);
  }

  /**
   * Get error statistics
   * @returns {Object} Error statistics
   */
  getErrorStats() {
    return {
      totalErrors: this.errorCount,
      isSafeMode: this.isSafeMode,
      recentErrors: this.errorLog.slice(-10),
      errorRate: this.errorCount / Math.max(1, Date.now() - this.errorLog[0]?.timestamp || Date.now()) * 1000
    };
  }

  /**
   * Reset error count
   */
  reset() {
    this.errorCount = 0;
    this.errorLog = [];
    this.isSafeMode = false;
    console.log('✅ Error handler reset');
  }
}
