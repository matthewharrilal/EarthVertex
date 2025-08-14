// NEURAAL_INTERFACE CONTROLLER
class NeuraalInterface {
  constructor() {
    this.initializeInterface();
    this.setupGlobeSystem();
    this.startDataStreams();
    this.setupInteractivity();
  }
  
  initializeInterface() {
    console.log('🧠 NEURAAL_INTERFACE initializing...');
    
                  // Initialize chat data streams
              this.dataStreams = {
                readyCommands: this.generateReadyData(),
                efficiency: this.generateEfficiencyData()
              };
    
    // Start real-time updates
    this.startRealTimeUpdates();
  }
  
  setupGlobeSystem() {
    // Setup globe with enlarged container and no coordinates
    this.enlargeGlobeContainer();
    this.adjustCameraForLargerGlobe();
    this.enhanceStarFieldForLargerGlobe();
    
    console.log('🌍 Enlarged globe system initialized');
  }
  
  enlargeGlobeContainer() {
    const globeContainer = document.querySelector('.earth-globe-container');
    if (globeContainer) {
      // Ensure container uses larger size
      globeContainer.style.width = '500px';
      globeContainer.style.height = '500px';
      globeContainer.style.margin = '0 auto';
      console.log('📏 Globe container enlarged to 500x500px');
    }
  }
  
  adjustCameraForLargerGlobe() {
    if (window.camera) {
      // Zoom out camera extremely to show maximum stars and cosmic context
      window.camera.position.set(0, 0, 14); // Much further back to show maximum star field
      window.camera.fov = 65; // Maximum field of view for cosmic immersion
      window.camera.updateProjectionMatrix();
      console.log('📷 Camera extremely zoomed out for maximum cosmic view with enhanced star field');
    }
    
    // Update renderer for larger container
    if (window.renderer) {
      const container = document.querySelector('.earth-globe-container');
      if (container) {
        const rect = container.getBoundingClientRect();
        window.renderer.setSize(rect.width, rect.height);
        console.log(`📐 Renderer updated to ${rect.width}x${rect.height}`);
      }
    }
  }
  
  enhanceStarFieldForLargerGlobe() {
    // Enhance star field to complement larger globe
    if (window.scene && window.textures) {
      // Remove existing stars
      const existingStars = window.scene.getObjectByName('starField');
      if (existingStars) {
        window.scene.remove(existingStars);
      }
      
      // Add enhanced star field
      const enhancedStars = this.createEnhancedStarField();
      enhancedStars.name = 'starField';
      window.scene.add(enhancedStars);
      console.log('✨ Enhanced star field added for larger globe');
    }
  }
  
  createEnhancedStarField() {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const colors = [];
    
    const numStars = 12000; // Even more stars for zoomed out cosmic view
    
    for (let i = 0; i < numStars; i++) {
      // Create stars in multiple layers for depth
      const layer = Math.random();
      let radius;
      
      if (layer < 0.6) {
        // Close stars (around globe)
        radius = 15 + Math.random() * 10;
      } else if (layer < 0.9) {
        // Medium distance stars
        radius = 25 + Math.random() * 20;
      } else {
        // Far background stars
        radius = 45 + Math.random() * 30;
      }
      
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      vertices.push(x, y, z);
      
      // Varying star brightness and color for depth
      const brightness = 0.3 + Math.random() * 0.7;
      const colorVariation = Math.random();
      
      if (colorVariation < 0.7) {
        // White/blue stars (most common)
        colors.push(brightness, brightness * 0.9, brightness * 0.8);
      } else if (colorVariation < 0.85) {
        // Slightly yellow stars
        colors.push(brightness, brightness * 0.95, brightness * 0.7);
      } else {
        // Rare red stars
        colors.push(brightness, brightness * 0.6, brightness * 0.5);
      }
    }
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
      size: 3.0, // Larger stars for better visibility when zoomed out
      map: window.textures.starTexture,
      transparent: true,
      opacity: 0.95,
      vertexColors: true,
      blending: THREE.AdditiveBlending
    });
    
    return new THREE.Points(geometry, material);
  }
  
  setupOrbitalRings() {
    const outerRing = document.querySelector('.outer-ring');
    const innerRing = document.querySelector('.inner-ring');
    
    // Add random data points to rings
    this.addDataPointsToRings(outerRing, 8);
    this.addDataPointsToRings(innerRing, 6);
  }
  
  addDataPointsToRings(ring, count) {
    for (let i = 0; i < count; i++) {
      const dataPoint = document.createElement('div');
      dataPoint.className = 'ring-data-point';
      dataPoint.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: #00ff41;
        border-radius: 50%;
        top: 50%;
        left: 50%;
        transform: rotate(${(360 / count) * i}deg) translateX(${ring.offsetWidth / 2}px) translateX(-2px) translateY(-2px);
        box-shadow: 0 0 8px rgba(0, 255, 65, 0.6);
      `;
      ring.appendChild(dataPoint);
    }
  }
  
  generateReadyData() {
    return [
      "Ituned dolore lux primconduo sit quis faucibus nuis molus 2008 venenconlam sit tellus tellus sealum ipsum aurutmullus in tur dictu cursurabs.",
      "Mauris placerat in nias ipsum seatine iaculis lorem quis so tellus iaculis cursuratum lorem placerat tellus tellus venen cursurante consecur in eget et lorem ipsum tellus.",
      "Lorem diturit sit lorem tellus placerat niat tellus venenconlam sit tellus molestie ipsum aurutmullus in tur dictu cursurabs tellus lorem tellus placerat auctor amet lorem ipsum tellus."
    ];
  }
  
  generateEfficiencyData() {
    return [
      { label: "Lat", value: "sisitim sit bultamate liutuasse eiciladr" },
      { label: "Long", value: "plaucum consequat sit lincidunt" },
      { label: "Diturit tellus", value: "placerat sit cursurante" }
    ];
  }
  
  startRealTimeUpdates() {
    // Update data streams every 5 seconds
    setInterval(() => {
      this.updateDataStreams();
    }, 5000);
    
    // Update coordinate rings every 2 seconds
    setInterval(() => {
      this.updateCoordinateRings();
    }, 2000);
    
    // Update progress indicator
    setInterval(() => {
      this.updateProgressIndicator();
    }, 3000);
  }
  
  updateDataStreams() {
    // Simulate data stream updates
    const timestamp = this.getCurrentTimestamp();
    console.log(`[${timestamp}] NEURAAL_INTERFACE: Data streams updated`);
  }
  
  updateCoordinateRings() {
    const rings = document.querySelectorAll('.coordinate-ring');
    rings.forEach((ring, index) => {
      // Add subtle pulse effect
      ring.style.animation = 'pulse-glow 1s ease-in-out';
      setTimeout(() => {
        ring.style.animation = '';
      }, 1000);
    });
  }
  
  updateProgressIndicator() {
    const progressValue = document.querySelector('.progress-value');
    if (progressValue) {
      const currentValue = parseInt(progressValue.textContent) || 0;
      const newValue = Math.min(100, currentValue + Math.floor(Math.random() * 3));
      progressValue.textContent = String(newValue).padStart(3, '0') + '%';
    }
  }
  
  setupInteractivity() {
    // Setup chat interactions (no coordinate interactions)
    const chatSections = document.querySelectorAll('.ready-section, .efficiency-section, .additional-data-section');
    chatSections.forEach(section => {
      section.addEventListener('mouseenter', () => {
        section.style.backgroundColor = 'rgba(0, 20, 10, 0.2)';
      });
      
      section.addEventListener('mouseleave', () => {
        section.style.backgroundColor = 'transparent';
      });
    });
    
    console.log('💬 Chat interactivity initialized');
  }
  
  getCurrentTimestamp() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }
  
  // Integration with existing Three.js globe
  integrateWithExistingGlobe() {
    // Modify existing globe setup for center placement
    if (window.setupEnhancedGlobe) {
      // Override globe setup for center panel
      const originalSetup = window.setupEnhancedGlobe;
      window.setupEnhancedGlobe = () => {
        originalSetup();
        
        // Adjust for center placement
        if (window.camera) {
          window.camera.position.set(0, 0, 4.5);
          window.camera.fov = 55;
          window.camera.updateProjectionMatrix();
        }
        
        // Update controls for center globe
        if (window.controls) {
          window.controls.enableDamping = true;
          window.controls.dampingFactor = 0.03; // Smoother rotation
          window.controls.autoRotate = true;
          window.controls.autoRotateSpeed = 0.5;
        }
      };
    }
  }
}

// Initialize NEURAAL_INTERFACE
let neuraalInterface;
document.addEventListener('DOMContentLoaded', () => {
  neuraalInterface = new NeuraalInterface();
});

// Export for global access
window.neuraalInterface = neuraalInterface;
