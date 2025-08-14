/* ========================================
   NEURAAL INTERFACE - APP CONFIGURATION
   ======================================== */

export const AppConfig = {
  // Performance settings
  performance: {
    targetFPS: 60,
    maxVertices: 500000,
    lodLevels: [100, 200, 300, 400],
    autoOptimize: true,
    raycastThrottle: 16, // 60fps max for raycasting
    interpolationSpeed: 8.0
  },
  
  // Globe settings
  globe: {
    radius: 2.75,
    defaultPosition: [0, 0, 14],
    defaultFOV: 65,
    rotationSpeed: {
      y: 0.0005,
      x: 0.0001
    },
    sizes: {
      mobile: 240,
      tablet: 350,
      desktop: 500
    },
    bulge: {
      radius: 0.9,
      intensity: 0.3,
      strength: 0.0
    }
  },
  
  // Visual settings
  visual: {
    colors: {
      primary: '#00b33c',
      secondary: '#008829',
      accent: '#00cc33'
    },
    animations: {
      fast: 150,
      standard: 300,
      slow: 600
    },
    timeIncrement: 0.015
  },
  
  // Development settings
  debug: {
    enabled: false,
    showStats: false,
    logPerformance: false
  },
  
  // Asset paths
  assets: {
    textures: {
      star: '/circle.png',
      colorMap: '/earthmap1k.jpg',
      elevationMap: '/earthbump1k.jpg',
      alphaMap: '/earthspec1k.jpg'
    }
  }
};
