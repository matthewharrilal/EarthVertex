// ENHANCED SCRIPT.JS - Performance & Visual Enhancements
// Simplified version with enhanced terrain features

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import getStarField from "./getStarField";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";
import enhancedVertexShader from "./shaders/enhancedVertex.glsl";
import enhancedFragmentShader from "./shaders/enhancedFragment.glsl";
// Neuraal interface is imported and initialized by neuraalInterface.js

/**
 * PERFORMANCE MONITORING SYSTEM
 */
class PerformanceMonitor {
  constructor() {
    this.frameCount = 0;
    this.lastFPSUpdate = 0;
    this.currentFPS = 60;
    this.frameHistory = [];
    this.memoryUsage = 0;
    this.isOptimizing = false;
  }
  
  update() {
    this.frameCount++;
    const now = performance.now();
    
    if (now - this.lastFPSUpdate >= 1000) {
      this.currentFPS = this.frameCount;
      this.frameCount = 0;
      this.lastFPSUpdate = now;
      
      // UPDATE NEURAAL INTERFACE DISPLAYS
      if (window.neuraalInterface) {
        window.neuraalInterface.updateDataStreams();
      }
      
      // Auto-optimize if FPS drops below 45
      if (this.currentFPS < 45 && !this.isOptimizing) {
        this.triggerOptimization();
      }
      
      // Memory usage estimation
      if (window.performance && window.performance.memory) {
        this.memoryUsage = window.performance.memory.usedJSHeapSize / 1024 / 1024;
      }
    }
  }
  
  triggerOptimization() {
    console.warn(`🔧 Auto-optimization triggered: FPS ${this.currentFPS}`);
    this.isOptimizing = true;
    
    // Reduce terrain diversity automatically
    if (earthMesh && earthMesh.material.uniforms) {
      const uniforms = earthMesh.material.uniforms;
      uniforms.uTerrainDiversity.value *= 0.7;
      console.log(`📉 Terrain diversity reduced to ${uniforms.uTerrainDiversity.value.toFixed(2)}`);
    }
    
    // Reset optimization flag after delay
    setTimeout(() => { this.isOptimizing = false; }, 3000);
  }
  
  getStatus() {
    return {
      fps: this.currentFPS,
      memory: this.memoryUsage.toFixed(1) + 'MB',
      isOptimizing: this.isOptimizing
    };
  }
}

/**
 * LEVEL OF DETAIL (LOD) SYSTEM
 */
class LODManager {
  constructor() {
    this.currentLOD = 300; // Start with highest quality
    this.targetLOD = 300;
    this.lodLevels = [
      { distance: 15, vertices: 100, label: 'Far' },      // 10K vertices
      { distance: 10, vertices: 150, label: 'Medium' },   // 22.5K vertices
      { distance: 7, vertices: 200, label: 'Near' },      // 40K vertices
      { distance: 0, vertices: 300, label: 'Close' }      // 90K vertices
    ];
    this.needsGeometryUpdate = false;
  }
  
  calculateOptimalLOD(cameraDistance) {
    for (let level of this.lodLevels) {
      if (cameraDistance >= level.distance) {
        return level.vertices;
      }
    }
    return 300; // Default to highest quality
  }
  
  update(camera, earthPosition) {
    const distance = camera.position.distanceTo(earthPosition);
    this.targetLOD = this.calculateOptimalLOD(distance);
    
    // Only update if LOD change is significant (prevents constant updates)
    if (Math.abs(this.targetLOD - this.currentLOD) >= 50) {
      this.currentLOD = this.targetLOD;
      this.needsGeometryUpdate = true;
      
      const level = this.lodLevels.find(l => l.vertices === this.currentLOD);
      console.log(`🔄 LOD Update: ${level?.label} (${this.currentLOD}×${this.currentLOD} = ${(this.currentLOD * this.currentLOD).toLocaleString()} vertices)`);
    }
  }
  
  createGeometry() {
    const geometry = new THREE.SphereGeometry(2.75, this.currentLOD, this.currentLOD);
    this.needsGeometryUpdate = false;
    return geometry;
  }
}

/**
 * ENHANCED TERRAIN CALCULATION CACHE
 */
class EnhancedTerrainCache {
  constructor() {
    this.terrainCache = new Map();
    this.cacheSize = 0;
    this.maxCacheSize = 20000; // Reduced for better performance
    this.cacheHitRate = 0;
    this.totalRequests = 0;
  }
  
  generateKey(u, v, terrainDiversity) {
    const uInt = Math.floor(u * 100);
    const vInt = Math.floor(v * 100);
    const diversityInt = Math.floor(terrainDiversity * 10);
    return `${uInt}_${vInt}_${diversityInt}`;
  }
  
  get(u, v, terrainDiversity) {
    const key = this.generateKey(u, v, terrainDiversity);
    this.totalRequests++;
    
    const result = this.terrainCache.get(key);
    if (result) {
      this.cacheHitRate = (this.cacheHitRate * 0.9) + 0.1;
    }
    
    return result;
  }
  
  set(u, v, terrainDiversity, terrainData) {
    if (this.cacheSize >= this.maxCacheSize) {
      // Remove oldest entries
      const keysToDelete = Array.from(this.terrainCache.keys()).slice(0, 1000);
      keysToDelete.forEach(key => this.terrainCache.delete(key));
      this.cacheSize -= 1000;
    }
    
    const key = this.generateKey(u, v, terrainDiversity);
    this.terrainCache.set(key, terrainData);
    this.cacheSize++;
  }
  
  clear() {
    this.terrainCache.clear();
    this.cacheSize = 0;
    this.cacheHitRate = 0;
    this.totalRequests = 0;
    console.log('🗑️ Enhanced terrain cache cleared');
  }
  
  getStats() {
    return {
      cacheSize: this.cacheSize,
      hitRate: (this.cacheHitRate * 100).toFixed(1) + '%',
      totalRequests: this.totalRequests
    };
  }
}

/**
 * Base setup with performance optimizations
 */
// MODIFY CANVAS SELECTION FOR REFINED CATHEDRAL LAYOUT
let canvas = null;

// Wait for DOM to be ready
const waitForCanvas = () => {
  canvas = document.querySelector("canvas.webgl");
  if (canvas) {
    console.log('✅ Canvas found:', canvas);
    console.log('📐 Canvas dimensions:', canvas.width, 'x', canvas.height);
    console.log('📐 Canvas style dimensions:', canvas.style.width, 'x', canvas.style.height);
    console.log('📐 Canvas offset dimensions:', canvas.offsetWidth, 'x', canvas.offsetHeight);
    
    // Check if canvas has proper dimensions
    if (canvas.offsetWidth === 0 || canvas.offsetHeight === 0) {
      console.warn('⚠️ Canvas has zero dimensions - this might cause rendering issues');
    }
    
    return true;
  }
  console.log('⏳ Canvas not found, waiting...');
  return false;
};

// MODIFY SCENE SETUP TO FIT LEFT ZONE (30% WIDTH)
const camera = new THREE.PerspectiveCamera(
  60, // Wider FOV for cosmic view with more stars visible
  1, // Square aspect ratio for optimal globe viewing
  0.1,
  1000
);
console.log('✅ Camera created with FOV:', camera.fov);

// POSITION CAMERA FOR EXTREMELY ZOOMED OUT COSMIC VIEW
camera.position.set(0, 0, 14); // Much further back to show maximum star field and cosmic context
console.log('📷 Camera positioned at:', camera.position.toArray());

// Scene
const scene = new THREE.Scene();
console.log('✅ Three.js scene created');

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
console.log('📏 Window sizes:', sizes);

// Performance systems
const performanceMonitor = new PerformanceMonitor();
const lodManager = new LODManager();
const terrainCache = new EnhancedTerrainCache();

// Creating a group
const group = new THREE.Group();
scene.add(group);
console.log('✅ Group created and added to scene');

// OPTIMIZED: Bulge system variables with smoother performance
let mouse = new THREE.Vector3(0, 0, 0);
let targetMouse = new THREE.Vector3(0, 0, 0);
let isMouseOverEarth = false;
let bulgeStrength = 0.0;
let targetBulgeStrength = 0.0;
let bulgeRadius = 0.9;
let bulgeIntensity = 0.3; // Reduced from 0.5 for smoother effect

// OPTIMIZED: Performance optimization with better throttling
let lastRaycastTime = 0;
const RAYCAST_THROTTLE = 16; // 60fps max for raycasting
const raycaster = new THREE.Raycaster();
const mouseNDC = new THREE.Vector2();
let earthMesh = null;

// Animation timing
let lastTime = 0;
let frameCount = 0;

// Debug mode
let debugMode = false;

// MODIFY RENDERER SETUP FOR ENHANCED GLOBE
let renderer = null;

const setupRenderer = () => {
  if (!canvas) {
    console.error('❌ Cannot setup renderer: canvas not ready');
    return false;
  }
  
  console.log('🔧 Setting up renderer...');
  console.log('📐 Canvas dimensions:', canvas.width, 'x', canvas.height);
  
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true, // Transparent background
    powerPreference: "high-performance"
  });

  // Set initial size for enhanced globe container - match CSS container size
  const containerSize = 500; // Match --globe-size-desktop from CSS
  renderer.setSize(containerSize, containerSize);
  renderer.setClearColor(0x000000, 0); // Transparent
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  console.log('✅ Renderer setup complete');
  console.log('📐 Renderer size set to:', containerSize, 'x', containerSize);
  console.log('🎨 Clear color set to transparent');
  return true;
};

/**
 * OPTIMIZED: Controls with performance tuning
 */
let controls = null;

const setupControls = () => {
  if (!canvas || !camera) {
    console.error('❌ Cannot setup controls: canvas or camera not ready');
    return false;
  }
  
  controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enablePan = false;
  controls.enableZoom = true;
  controls.zoomSpeed = 0.8; // Slightly slower for smoother feel
  controls.rotateSpeed = 0.8;
  
  console.log('✅ Controls setup complete');
  return true;
};

/**
 * Camera and textures
 */
// MODIFY CAMERA SETUP FOR 60% WIDTH LAYOUT
const textureLoader = new THREE.TextureLoader();

// OPTIMIZED: Texture loading with better error handling and performance
const loadTextures = () => {
  return new Promise((resolve, reject) => {
    const textures = {};
    let loadedCount = 0;
    const totalTextures = 4;
    let hasError = false;
    
    console.log('🔍 Starting texture loading...');
    
    const checkAllLoaded = () => {
      loadedCount++;
      console.log(`📦 Texture loaded: ${loadedCount}/${totalTextures}`);
      if (loadedCount === totalTextures && !hasError) {
        console.log('✅ All textures loaded successfully');
        console.log('📊 Loaded textures:', Object.keys(textures));
        
        // OPTIMIZATION: Set texture parameters for better performance
        Object.values(textures).forEach(texture => {
          if (texture instanceof THREE.Texture) {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.minFilter = THREE.LinearMipmapLinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.generateMipmaps = true;
          }
        });
        
        resolve(textures);
      }
    };
    
    const handleError = (error) => {
      if (!hasError) {
        hasError = true;
        console.error('❌ Texture loading error:', error);
        console.error('🔍 Failed texture URL:', error.target?.src || 'unknown');
        reject(error);
      }
    };
    
    console.log('🔄 Loading star texture: /circle.png');
    textures.starTexture = textureLoader.load("/circle.png", checkAllLoaded, undefined, handleError);
    
    console.log('🔄 Loading color map: /earthmap1k.jpg');
    textures.colorMap = textureLoader.load("/earthmap1k.jpg", checkAllLoaded, undefined, handleError);
    
    console.log('🔄 Loading elevation map: /earthbump1k.jpg');
    textures.elevationMap = textureLoader.load("/earthbump1k.jpg", checkAllLoaded, undefined, handleError);
    
    console.log('🔄 Loading alpha map: /earthspec1k.jpg');
    textures.alphaMap = textureLoader.load("/earthspec1k.jpg", checkAllLoaded, undefined, handleError);
  });
};

// OPTIMIZED: Enhanced interpolation with performance focus
function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

function smoothInterpolation(current, target, deltaTime, speed = 8.0) {
  // Reduced speed for better performance
  const factor = Math.min(1.0, 1.0 - Math.exp(-speed * deltaTime));
  return lerp(current, target, factor);
}

// OPTIMIZED: Hover tracking with better performance
function updateHoverPosition(clientX, clientY) {
  const currentTime = performance.now();
  
  // Performance throttling
  if (currentTime - lastRaycastTime < RAYCAST_THROTTLE) return;
  lastRaycastTime = currentTime;
  
  if (!earthMesh) return;
  
  const rect = canvas.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  
  const canvasWidth = rect.width;
  const canvasHeight = rect.height;
  
  mouseNDC.x = (x / canvasWidth) * 2 - 1;
  mouseNDC.y = -(y / canvasHeight) * 2 + 1;
  
  camera.updateMatrixWorld();
  raycaster.setFromCamera(mouseNDC, camera);
  
  const intersects = raycaster.intersectObject(earthMesh);
  
  if (intersects.length > 0) {
    const intersectionPoint = intersects[0].point;
    const localPoint = new THREE.Vector3();
    localPoint.copy(intersectionPoint);
    group.worldToLocal(localPoint);
    
    targetMouse.copy(localPoint);
    targetBulgeStrength = 1.0;
    isMouseOverEarth = true;
    
    // Enhanced terrain diversity on hover for more visible effect
    if (earthMesh && earthMesh.material && earthMesh.material.uniforms) {
      earthMesh.material.uniforms.uTerrainDiversity.value = 1.5; // Increase diversity on hover
    }
    
    // Debug: Log bulge activation
    if (debugMode) {
      console.log('🌊 Bulge activated at:', localPoint.toArray().map(n => n.toFixed(3)));
    }
  } else {
    targetBulgeStrength = 0.0;
    isMouseOverEarth = false;
    
    // Reset terrain diversity when not hovering
    if (earthMesh && earthMesh.material && earthMesh.material.uniforms) {
      earthMesh.material.uniforms.uTerrainDiversity.value = 1.0; // Reset to normal
    }
  }
  
  // UPDATE REFINED CATHEDRAL COORDINATE DISPLAYS
        if (intersects.length > 0 && window.neuraalInterface) {
    const worldPos = intersects[0].point;
    // Convert to lat/lon and update refined cathedral display
    const lat = (Math.asin(worldPos.y / 2.75) * 180 / Math.PI).toFixed(4);
    const lon = (Math.atan2(worldPos.x, worldPos.z) * 180 / Math.PI).toFixed(4);
    
    // Update refined cathedral coordinate displays
    const latitudeDisplay = document.getElementById('latitude');
    const longitudeDisplay = document.getElementById('longitude');
    
    if (latitudeDisplay) {
      latitudeDisplay.textContent = lat;
    }
    if (longitudeDisplay) {
      longitudeDisplay.textContent = lon;
    }
  }
}

// OPTIMIZED: Setup hover tracking with debouncing
function setupHoverTracking() {
  let mouseMoveTimeout;
  
  window.addEventListener('mousemove', (event) => {
    // Debounce rapid mouse movements
    clearTimeout(mouseMoveTimeout);
    mouseMoveTimeout = setTimeout(() => {
      updateHoverPosition(event.clientX, event.clientY);
    }, 8); // Reduced to 8ms for responsiveness
  });
  
  canvas.addEventListener('mouseleave', () => {
    targetBulgeStrength = 0.0;
    isMouseOverEarth = false;
  });
  
  window.addEventListener('click', (event) => {
    if (isMouseOverEarth && debugMode) {
      console.log('🌍 Clicked on Earth at:', targetMouse.toArray().map(n => n.toFixed(3)));
    }
  });
}

// Initialize the application
const init = async () => {
  try {
    console.log('🚀 Starting initialization...');
    
    // Wait for canvas to be ready
console.log('🔍 Waiting for canvas to be ready...');
let canvasWaitCount = 0;
while (!waitForCanvas()) {
  canvasWaitCount++;
  console.log(`⏳ Canvas wait attempt ${canvasWaitCount}...`);
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Prevent infinite loop
  if (canvasWaitCount > 50) { // 5 seconds max
    console.error('❌ Canvas wait timeout - canvas not found after 5 seconds');
    throw new Error('Canvas not found');
  }
}
console.log('✅ Canvas is ready!');
    
    // Setup renderer
    if (!setupRenderer()) {
      throw new Error('Failed to setup renderer');
    }
    
    // Setup controls
    if (!setupControls()) {
      throw new Error('Failed to setup controls');
    }
    
    // Load textures and create scene
    console.log('📦 Loading textures...');
    const textures = await loadTextures();
    console.log('✅ Textures loaded successfully:', Object.keys(textures));
    window.textures = textures;
    console.log('🌍 Creating Earth mesh...');
    createEarthMesh();
    console.log('🌍 Earth mesh created, checking if it was added to scene...');
    console.log('🌍 Earth mesh exists:', !!earthMesh);
    console.log('🌍 Earth mesh in group:', !!earthMesh && group.children.includes(earthMesh));
    console.log('🌍 Group children count:', group.children.length);
    console.log('🚀 Enhanced Earth visualization system initialized');
    
    // Start animation loop
    console.log('🎬 Starting animation loop...');
    animate(0);
  } catch (error) {
    console.error('❌ Initialization error:', error);
    console.error('🔍 Error details:', error.message);
    console.error('🔍 Error stack:', error.stack);
    // Fallback to basic rendering
    console.log('⚠️ Falling back to basic Earth mesh...');
    createBasicEarthMesh();
  }
};

// Start the application when DOM is ready
console.log('🚀 Script loading...');
console.log('📋 Document ready state:', document.readyState);

if (document.readyState === 'loading') {
  console.log('⏳ DOM still loading, waiting for DOMContentLoaded...');
  document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ DOMContentLoaded fired, starting init...');
    init();
  });
} else {
  console.log('✅ DOM already ready, starting init immediately...');
  init();
}

/**
 * ENHANCED: Advanced Earth mesh creation with LOD support and terrain density
 */
function createEarthMesh() {
  console.log('🔧 Starting createEarthMesh...');
  // Start with initial geometry
  let pointsGeometry = lodManager.createGeometry();
  console.log('📐 Geometry created with', pointsGeometry.attributes.position.count, 'vertices');
  
  // ENHANCED: Advanced shader material with terrain density controls
  console.log('🔧 Creating enhanced shader material...');
  console.log('📝 Vertex shader:', typeof enhancedVertexShader);
  console.log('📝 Fragment shader:', typeof enhancedFragmentShader);
  
  let pointsMaterial;
  try {
    pointsMaterial = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        // Existing uniforms
        uTime: { value: 0.0 },
        uSize: { value: 1.2 }, // Slightly larger points for better visibility
        uElevationMap: { value: window.textures.elevationMap },
        uColorMap: { value: window.textures.colorMap },
        uAlphaMap: { value: window.textures.alphaMap },
        uMouse: { value: new THREE.Vector3(0, 0, 0) },
        uBulgeStrength: { value: 0.0 },
        uBulgeRadius: { value: bulgeRadius },
        uBulgeIntensity: { value: bulgeIntensity },
        uWaterEffect: { value: 0.3 },
        
        // Enhanced terrain controls
        uTerrainDiversity: { value: 1.0 }, // MAXIMUM for dramatic effects
        uTerrainAnimation: { value: 1.0 },
        uSnowLine: { value: 0.7 }, // Lower snow line for more dramatic snow coverage
        uOceanDepth: { value: 1.0 }, // Maximum ocean effects
        uForestDensity: { value: 1.0 }, // Maximum forest density
        uDesertDunes: { value: 1.0 }, // Maximum desert dune effects
        uMountainSharpness: { value: 1.0 }, // Maximum mountain sharpness
        
        // Enhanced terrain density controls
        uDetailLevel: { value: 1.0 }, // Full detail by default
        uTerrainDensity: { value: 1.5 }, // Increased for dramatic effect
        
        // Lighting and brightness controls
        uAmbientLight: { value: 0.7 }, // Increased base brightness
        uDirectionalLight: { value: 1.0 }, // Maximum directional lighting
        uContrast: { value: 1.4 }, // Increased contrast for dramatic effect
        uBrightness: { value: 1.5 }, // Increased brightness for maximum visibility
        uSaturation: { value: 1.3 }, // Increased saturation for vibrant colors
        
        // Performance controls
        uLODLevel: { value: 1.0 }, // LOD quality multiplier
        uSimplifyTerrain: { value: 0.0 } // Terrain simplification factor
      },
      vertexShader: enhancedVertexShader,
      fragmentShader: enhancedFragmentShader
    });
    
    console.log('✅ Enhanced shader material created successfully');
  } catch (error) {
    console.error('❌ Failed to create enhanced shader material:', error);
    throw error;
  }
  
  earthMesh = new THREE.Points(pointsGeometry, pointsMaterial);
  group.add(earthMesh);
  console.log('🌍 Earth mesh added to group, group now has', group.children.length, 'children');
  console.log('🌍 Earth mesh position:', earthMesh.position.toArray());
  console.log('🌍 Earth mesh visible:', earthMesh.visible);

  // Setup systems
  setupHoverTracking();
  setupEnhancedControls(pointsMaterial);

  // Add enhanced star field for zoomed out cosmic view
  const stars = getStarField({ numStars: 5000, sprite: window.textures.starTexture }); // More stars for cosmic view
  scene.add(stars);
  
  // Add additional distant star layer for depth
  const distantStars = getStarField({ numStars: 3000, sprite: window.textures.starTexture });
  distantStars.scale.set(2.5, 2.5, 2.5); // Scale up distant stars
  scene.add(distantStars);
  
  console.log('🌍 Enhanced Earth mesh created with DRAMATIC PERLIN NOISE TERRAIN!');
  console.log('🔧 7 terrain types: Ocean, Mountain, Forest, Plains, Desert, Tundra, Canyon');
  console.log('📊 Terrain-specific Perlin noise with dramatic displacement');
  console.log('⚡ Living, breathing terrain with time-based animation');
  console.log('🌊 Interactive bulge system ACTIVE - hover over globe to see wiggle effect!');
  console.log('🎮 Controls: T (terrain), A (animation), D (debug), H (help)');
}

// Fallback for texture loading failures
function createBasicEarthMesh() {
  const pointsGeometry = new THREE.SphereGeometry(2.75, 200, 200); // Lower quality fallback
  const basicMaterial = new THREE.PointsMaterial({
    color: 0x4a90e2,
    size: 1.0
  });
  
  earthMesh = new THREE.Points(pointsGeometry, basicMaterial);
  group.add(earthMesh);
  console.log('🌍 Basic Earth mesh added to group, group now has', group.children.length, 'children');
  console.log('🌍 Basic Earth mesh position:', earthMesh.position.toArray());
  console.log('🌍 Basic Earth mesh visible:', earthMesh.visible);
  
  console.log('⚠️ Basic Earth mesh created (fallback mode)');
}

// REFINED CATHEDRAL RESIZE HANDLER - Globe uses full container size
window.addEventListener("resize", () => {
  // Globe now uses full container dimensions
  const container = document.querySelector(".globe-container");
  if (container && renderer && camera) {
    const containerRect = container.getBoundingClientRect();
    renderer.setSize(containerRect.width, containerRect.height);
    camera.aspect = containerRect.width / containerRect.height;
    camera.updateProjectionMatrix();

    console.log('REFINED_CATHEDRAL_LAYOUT: Globe updated to', containerRect.width, 'x', containerRect.height);
  }
});

// OPTIMIZED: Animation loop with LOD and performance monitoring
const animate = (currentTime) => {
  const deltaTime = Math.min((currentTime - lastTime) * 0.001, 0.016);
  lastTime = currentTime;
  
  // Performance monitoring
  performanceMonitor.update();
  
  // Debug: Check if we have the necessary components
  if (!renderer || !scene || !camera) {
    console.error('❌ Missing renderer, scene, or camera in animate loop');
    return;
  }
  
  // LOD system update
  lodManager.update(camera, group.position);
  
  // Update geometry if LOD changed
  if (lodManager.needsGeometryUpdate && earthMesh) {
    const newGeometry = lodManager.createGeometry();
    earthMesh.geometry.dispose(); // Clean up old geometry
    earthMesh.geometry = newGeometry;
  }
  
  // Smooth Earth rotation for cosmic view
  group.rotation.y += 0.0005; // Reduced for smoother rotation
  group.rotation.x += 0.0001; // Reduced for gentler x rotation
  
  if (earthMesh && earthMesh.material && earthMesh.material.uniforms) {
    const uniforms = earthMesh.material.uniforms;
    
    // Optimized interpolation
    mouse.x = smoothInterpolation(mouse.x, targetMouse.x, deltaTime, 10.0);
    mouse.y = smoothInterpolation(mouse.y, targetMouse.y, deltaTime, 10.0);
    mouse.z = smoothInterpolation(mouse.z, targetMouse.z, deltaTime, 10.0);
    
    bulgeStrength = smoothInterpolation(bulgeStrength, targetBulgeStrength, deltaTime, 8.0);
    
    // Smooth time animation frequency
    uniforms.uTime.value += 0.015; // Reduced for smoother animation
    
    // Update uniforms
    uniforms.uMouse.value.copy(mouse);
    uniforms.uBulgeStrength.value = bulgeStrength;
    uniforms.uBulgeRadius.value = bulgeRadius;
    uniforms.uBulgeIntensity.value = bulgeIntensity;
    
    // Update LOD level
    if (uniforms.uLODLevel) {
      uniforms.uLODLevel.value = lodManager.currentLOD / 300; // Normalize to 0-1
    }
  }
  
  controls.update();
  renderer.render(scene, camera);
  console.log('🎬 Frame rendered, scene children:', scene.children.length, 'group children:', group.children.length);
  window.requestAnimationFrame(animate);
};

// Animation will be started after initialization is complete

/**
 * ENHANCED: Simplified controls with enhanced terrain features
 */
function setupEnhancedControls(material) {
  const uniforms = material.uniforms;
  
  window.addEventListener('keydown', (event) => {
    switch(event.key.toLowerCase()) {
      case 't': // Toggle terrain diversity
        const diversity = uniforms.uTerrainDiversity.value;
        uniforms.uTerrainDiversity.value = diversity > 0.5 ? 0.0 : 1.5; // Increased to 1.5 for dramatic effect
        console.log(`🌍 Terrain Diversity: ${diversity > 0.5 ? 'OFF' : 'MAXIMUM'} (${uniforms.uTerrainDiversity.value.toFixed(1)})`);
        break;
        
      case 'g': // Increase terrain diversity
        uniforms.uTerrainDiversity.value = Math.min(1.0, uniforms.uTerrainDiversity.value + 0.1);
        console.log(`⬆️ Terrain Diversity: ${uniforms.uTerrainDiversity.value.toFixed(1)}`);
        break;
        
      case 'f': // Decrease terrain diversity
        uniforms.uTerrainDiversity.value = Math.max(0.0, uniforms.uTerrainDiversity.value - 0.1);
        console.log(`⬇️ Terrain Diversity: ${uniforms.uTerrainDiversity.value.toFixed(1)}`);
        break;
        
      case 'b': // Brightness control
        uniforms.uBrightness.value = Math.min(2.0, uniforms.uBrightness.value + 0.1);
        console.log(`💡 Brightness: ${uniforms.uBrightness.value.toFixed(1)}`);
        break;
        
      case 'v': // Decrease brightness
        uniforms.uBrightness.value = Math.max(0.5, uniforms.uBrightness.value - 0.1);
        console.log(`🔅 Brightness: ${uniforms.uBrightness.value.toFixed(1)}`);
        break;
        
      case 'c': // Contrast control
        uniforms.uContrast.value = Math.min(2.0, uniforms.uContrast.value + 0.1);
        console.log(`📊 Contrast: ${uniforms.uContrast.value.toFixed(1)}`);
        break;
        
      case 'x': // Decrease contrast
        uniforms.uContrast.value = Math.max(0.5, uniforms.uContrast.value - 0.1);
        console.log(`📉 Contrast: ${uniforms.uContrast.value.toFixed(1)}`);
        break;
        
      case 'l': // LOD control
        const currentLOD = lodManager.currentLOD;
        const nextLOD = currentLOD >= 300 ? 150 : currentLOD >= 150 ? 100 : 300;
        lodManager.currentLOD = nextLOD;
        lodManager.needsGeometryUpdate = true;
        console.log(`🔄 Manual LOD: ${nextLOD}×${nextLOD} vertices`);
        break;
        
      case 'p': // Performance report
        const status = performanceMonitor.getStatus();
        const cacheStats = terrainCache.getStats();
        console.log(`📊 Performance: ${status.fps}fps, ${status.memory}, LOD: ${lodManager.currentLOD}`);
        console.log(`🗄️ Cache: ${cacheStats.cacheSize} entries, ${cacheStats.hitRate} hit rate`);
        break;
        
      case 'r': // Reset to defaults
        resetToEnhancedDefaults();
        break;
        
      case 'h': // Help menu
        showEnhancedHelpMenu();
        break;
        
      case 'd': // Toggle debug mode
        debugMode = !debugMode;
        console.log(`🐛 Debug mode: ${debugMode ? 'ON' : 'OFF'}`);
        break;
        
      case 'a': // Toggle terrain animation
        const animation = uniforms.uTerrainAnimation.value;
        uniforms.uTerrainAnimation.value = animation > 0.5 ? 0.0 : 1.0;
        console.log(`🌊 Terrain Animation: ${animation > 0.5 ? 'OFF' : 'ON'} (${uniforms.uTerrainAnimation.value.toFixed(1)})`);
        break;
    }
  });
  
  // Automatic performance optimization warning
  setTimeout(() => {
    console.log('⚡ Enhanced Terrain System Ready!');
    console.log('🎮 Press H for controls, P for performance stats');
    console.log('🌍 Enhanced terrain with density controls');
    console.log('💡 Auto-optimization enabled for smooth performance');
  }, 1000);
}

// Reset to enhanced defaults
function resetToEnhancedDefaults() {
  const uniforms = earthMesh.material.uniforms;
  
  // DRAMATIC: Enhanced terrain defaults for maximum visual impact
  uniforms.uTerrainDiversity.value = 1.0; // MAXIMUM for dramatic effects
  uniforms.uDetailLevel.value = 1.0;
  uniforms.uTerrainDensity.value = 1.5; // Increased for dramatic effect
  
  // DRAMATIC: Maximum terrain effects
  uniforms.uSnowLine.value = 0.7; // Lower snow line for more dramatic snow coverage
  uniforms.uOceanDepth.value = 1.0; // Maximum ocean effects
  uniforms.uForestDensity.value = 1.0; // Maximum forest density
  uniforms.uDesertDunes.value = 1.0; // Maximum desert dune effects
  uniforms.uMountainSharpness.value = 1.0; // Maximum mountain sharpness
  
  // DRAMATIC: Enhanced visual defaults for maximum impact
  uniforms.uBrightness.value = 1.5; // Increased brightness for maximum visibility
  uniforms.uContrast.value = 1.4; // Increased contrast for dramatic effect
  uniforms.uSaturation.value = 1.3; // Increased saturation for vibrant colors
  uniforms.uAmbientLight.value = 0.7; // Increased base brightness
  uniforms.uDirectionalLight.value = 1.0; // Maximum directional lighting
  
  // LOD reset
  lodManager.currentLOD = 300;
  lodManager.needsGeometryUpdate = true;
  
  // Cache clear
  terrainCache.clear();
  
  console.log('🔄 Reset to DRAMATIC terrain defaults for maximum visual impact!');
}

// Enhanced help menu
function showEnhancedHelpMenu() {
  console.log(`
🌍 ENHANCED TERRAIN SYSTEM CONTROLS:

🎨 VISUAL CONTROLS:
T - Toggle terrain diversity MAXIMUM on/off
G/F - Increase/decrease terrain diversity
B/V - Increase/decrease brightness
C/X - Increase/decrease contrast
A - Toggle terrain animation (breathing effects)

⚡ PERFORMANCE CONTROLS:
L - Manual LOD control (cycles through quality levels)
P - Performance report (FPS, memory, LOD, cache stats)
R - Reset to enhanced defaults

🌍 ENHANCED TERRAIN FEATURES:
- Dramatic terrain classification with 7 types (Ocean, Mountain, Forest, Plains, Desert, Tundra, Canyon)
- Terrain-specific Perlin noise patterns with dramatic displacement
- Living, breathing terrain with time-based animation
- LOD-based performance optimization
- Advanced caching system for smooth performance
- Auto-optimization for consistent 60fps

🌊 INTERACTIVE BULGE SYSTEM:
- Hover over globe to see terrain wiggle effect
- Dynamic bulge displacement with mouse tracking
- Animated bulge with time-based variation
- Press D to toggle debug mode for bulge logging

💡 Pro Tips:
- Use G/F to control terrain complexity
- Use L to manually control detail level
- Press P to monitor performance
- R resets everything to optimal settings
  `);
}

// Export performance monitoring for external access
window.earthPerformance = {
  getStatus: () => performanceMonitor.getStatus(),
  getLOD: () => ({ current: lodManager.currentLOD, needsUpdate: lodManager.needsGeometryUpdate }),
  clearCache: () => terrainCache.clear(),
  toggleDebug: () => { debugMode = !debugMode; console.log(`Debug: ${debugMode ? 'ON' : 'OFF'}`); },
  getEnhancedTerrainStats: () => terrainCache.getStats()
};

// CATHEDRAL INTERFACE INTEGRATION
// Cathedral interface is initialized by cathedralInterface.js
// This ensures proper integration with the microscopic globe

// ADD REFINED CATHEDRAL INTEGRATION HOOKS
    // Neuraal interface is initialized by neuraalInterface.js

// MODIFY CONSOLE MESSAGES FOR REFINED CATHEDRAL INTEGRATION
console.log('🌌 REFINED DIGITAL CATHEDRAL EARTH SYSTEM LOADED!');
console.log('🌍 ENHANCED GLOBE: 30% width with no size constraints');
console.log('🌌 UNIFIED BACKGROUND: Consistent black atmosphere throughout');
console.log('💬 PROMINENT CHAT: 25% width with highly legible interface');
            console.log('🎯 LAYOUT: 50-50 clean two-column design with left globe, right chat');

// INTEGRATE WITH REFINED CATHEDRAL INTERFACE
    // Neuraal interface will be initialized by neuraalInterface.js
// This ensures proper integration with the enhanced globe

// CALL ENHANCED GLOBE SETUP AFTER SCENE INITIALIZATION
setTimeout(() => {
  setupEnhancedGlobe();
}, 1000);

// ENHANCED GLOBE SETUP FUNCTION
function setupEnhancedGlobe() {
  // Update camera for extremely zoomed out cosmic view
  if (camera) {
    camera.fov = 65; // Even wider FOV for maximum cosmic view
    camera.position.set(0, 0, 14); // Much further back to show maximum star field
    camera.updateProjectionMatrix();
  }
  
  // Enhanced globe material for larger scale
  if (earthMesh && earthMesh.material && earthMesh.material.uniforms) {
    earthMesh.material.uniforms.uSize.value = 1.5; // Larger points for bigger globe
    earthMesh.material.uniforms.uDetailLevel.value = 1.0; // Maximum detail for larger view
  }
  
  // Larger geometry for more detail
  if (earthMesh && earthMesh.geometry) {
    const newGeometry = new THREE.SphereGeometry(2.75, 400, 400); // Higher resolution
    earthMesh.geometry.dispose();
    earthMesh.geometry = newGeometry;
  }
  
  console.log('🌍 ENHANCED GLOBE SETUP COMPLETE - Larger scale with no constraints');
}

// RESPONSIVE GLOBE SIZING
function updateGlobeSize() {
  const container = document.querySelector('.earth-globe-container');
  const rect = container.getBoundingClientRect();
  const size = Math.min(rect.width, rect.height);
  
  if (renderer) {
    renderer.setSize(size, size);
  }
  
  if (camera) {
    camera.aspect = 1;
    camera.updateProjectionMatrix();
  }
}

// Update on resize
window.addEventListener("resize", updateEnlargedGlobeSize);

// MODIFY EXISTING GLOBE SETUP FOR LEFT PANEL PLACEMENT

// 4. GLOBE SETUP FOR ENLARGED DISPLAY
function setupEnlargedGlobe() {
  const container = document.querySelector('.earth-globe-container');
  if (container) {
    const rect = container.getBoundingClientRect();
    if (renderer) {
      renderer.setSize(rect.width, rect.height);
      renderer.setClearColor(0x000000, 0); // Transparent for overlays
    }
  }
  
  // Enhanced globe material for zoomed out cosmic view
  if (earthMesh && earthMesh.material && earthMesh.material.uniforms) {
    earthMesh.material.uniforms.uSize.value = 1.5; // Larger points for zoomed out view
    earthMesh.material.uniforms.uDetailLevel.value = 1.0; // Maximum detail for larger view
  }
  
  // High-resolution geometry for enlarged display
  if (earthMesh && earthMesh.geometry) {
    const newGeometry = new THREE.SphereGeometry(2.5, 400, 400); // Higher resolution for larger display
    earthMesh.geometry.dispose();
    earthMesh.geometry = newGeometry;
  }
  
  console.log('🌍 ENLARGED GLOBE SETUP COMPLETE - 500px container with enhanced materials');
}

// 5. UPDATE RESIZE HANDLER FOR ENLARGED GLOBE
function updateEnlargedGlobeSize() {
  const container = document.querySelector('.earth-globe-container');
  if (container && window.renderer && window.camera) {
    const rect = container.getBoundingClientRect();
    window.renderer.setSize(rect.width, rect.height);
    window.camera.aspect = 1; // Maintain circular aspect
    window.camera.updateProjectionMatrix();
  }
}

// 6. ENHANCED CONTROLS FOR EXTREMELY ZOOMED OUT GLOBE
function setupEnlargedGlobeControls() {
  if (camera) {
    // Zoom out camera extremely to show maximum stars and cosmic context
    camera.position.set(0, 0, 14); // Much further back to show maximum star field
    camera.fov = 65; // Maximum field of view for cosmic immersion
    camera.updateProjectionMatrix();
    console.log('📷 Camera extremely zoomed out for maximum cosmic view with enhanced star field');
  }
  
  if (controls) {
    controls.enableDamping = true;
    controls.dampingFactor = 0.03; // Smoother rotation
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.zoomSpeed = 0.5;
    controls.rotateSpeed = 0.6;
    controls.autoRotate = true; // Auto-rotation for dynamic effect
    controls.autoRotateSpeed = 0.3;
  }
}

// 7. CAMERA RESET FOR EXTREME COSMIC VIEW
function resetCameraForCosmicView() {
  if (camera) {
    // Ensure camera is positioned for maximum cosmic view
    camera.position.set(0, 0, 14);
    camera.fov = 65;
    camera.updateProjectionMatrix();
    console.log('🌌 Camera reset for maximum cosmic view with enhanced star field');
  }
}

// 8. INITIAL CAMERA SETUP
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    resetCameraForCosmicView();
  }, 500);
});
