// ENHANCED VERTEX SHADER - SIMPLIFIED FOR DEBUGGING
// Performance-optimized with basic terrain features

uniform float uSize;
uniform sampler2D uElevationMap;
uniform sampler2D uColorMap;
uniform sampler2D uAlphaMap;
uniform float uTime;
uniform vec3 uMouse;
uniform float uBulgeStrength;
uniform float uBulgeRadius;
uniform float uBulgeIntensity;
uniform float uTerrainDiversity;
uniform float uTerrainAnimation;
uniform float uSnowLine;
uniform float uOceanDepth;
uniform float uForestDensity;
uniform float uDesertDunes;
uniform float uMountainSharpness;

// Enhanced terrain controls
uniform float uDetailLevel;
uniform float uTerrainDensity;
uniform float uLODLevel;
uniform float uSimplifyTerrain;
uniform float uAmbientLight;
uniform float uDirectionalLight;

varying float vVisible;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying float vElevation;
flat varying int vTerrainType;
varying float vLighting;
varying float vDetailLevel;

// Enhanced Perlin noise function for realistic terrain
float perlinNoise(vec3 pos) {
  vec3 i = floor(pos);
  vec3 f = fract(pos);
  vec3 u = f * f * (3.0 - 2.0 * f);
  
  float a = dot(floor(i + vec3(0.0, 0.0, 0.0)), vec3(1.0, 57.0, 21.0));
  float b = dot(floor(i + vec3(1.0, 0.0, 0.0)), vec3(1.0, 57.0, 21.0));
  float c = dot(floor(i + vec3(0.0, 1.0, 0.0)), vec3(1.0, 57.0, 21.0));
  float d = dot(floor(i + vec3(1.0, 1.0, 0.0)), vec3(1.0, 57.0, 21.0));
  float e = dot(floor(i + vec3(0.0, 0.0, 1.0)), vec3(1.0, 57.0, 21.0));
  float f1 = dot(floor(i + vec3(1.0, 0.0, 1.0)), vec3(1.0, 57.0, 21.0));
  float g = dot(floor(i + vec3(0.0, 1.0, 1.0)), vec3(1.0, 57.0, 21.0));
  float h = dot(floor(i + vec3(1.0, 1.0, 1.0)), vec3(1.0, 57.0, 21.0));
  
  return mix(mix(mix(fract(sin(a) * 43758.5453), fract(sin(b) * 43758.5453), u.x),
                 mix(fract(sin(c) * 43758.5453), fract(sin(d) * 43758.5453), u.x), u.y),
             mix(mix(fract(sin(e) * 43758.5453), fract(sin(f1) * 43758.5453), u.x),
                 mix(fract(sin(g) * 43758.5453), fract(sin(h) * 43758.5453), u.x), u.y), u.z);
}

// Simple fractal noise for terrain detail (working version)
float fractalNoise(vec3 pos, float frequency, float amplitude, int octaves) {
  float noise = 0.0;
  float amp = 1.0;
  float freq = frequency;
  
  for(int i = 0; i < octaves; i++) {
    noise += perlinNoise(pos * freq) * amp;
    amp *= amplitude;
    freq *= 2.0;
  }
  
  return noise;
}

// Enhanced terrain classification with 7 terrain types
int classifyEnhancedTerrain(vec2 uv, vec3 worldPos, float elevation) {
  float alpha = texture2D(uAlphaMap, uv).r;
  if (alpha < 0.5) return 0; // Ocean
  
  // Use Perlin noise to create terrain variety
  vec3 noisePos = worldPos * 4.0;
  float terrainNoise = perlinNoise(noisePos);
  float elevationNoise = perlinNoise(worldPos * 8.0);
  
  // Combine elevation and noise for terrain classification
  float terrainValue = elevation + terrainNoise * 0.3 + elevationNoise * 0.2;
  
  if (terrainValue > 0.8) return 1;      // Mountain (high elevation)
  if (terrainValue > 0.6) return 2;      // Forest (medium-high elevation)
  if (terrainValue > 0.4) return 3;      // Plains (medium elevation)
  if (terrainValue > 0.2) return 4;      // Desert (low-medium elevation)
  if (terrainValue > 0.0) return 5;      // Tundra (low elevation)
  return 6;                               // Canyon (very low elevation)
}

// Dramatic terrain displacement with terrain-specific Perlin noise
vec3 calculateEnhancedTerrain(vec3 position, vec3 normal, vec2 uv, float elevation, int terrainType) {
  vec3 displacement = vec3(0.0);
  
  // Base elevation displacement (smooth and gentle)
  displacement += normal * elevation * 0.8; // Reduced from 1.2 to 0.8 for smoother look
  
  // Terrain-specific dramatic Perlin noise effects
  if (uTerrainDiversity > 0.0) {
    vec3 noisePos = position + uTime * 0.05; // Time-based noise movement
    
    switch (terrainType) {
      case 0: // Ocean
        // Smooth wave patterns
        float waveNoise1 = perlinNoise(noisePos * 6.0) * 0.3; // Reduced from 0.8
        float waveNoise2 = fractalNoise(noisePos * 12.0, 1.0, 0.6, 4) * 0.15; // Reduced from 0.4
        displacement += normal * (waveNoise1 + waveNoise2) * uTerrainDiversity;
        break;
        
      case 1: // Mountain
        // Smooth mountain ridges
        float mountainNoise1 = perlinNoise(noisePos * 4.0) * 0.6; // Reduced from 1.5
        float mountainNoise2 = fractalNoise(noisePos * 8.0, 1.0, 0.5, 5) * 0.3; // Reduced from 0.8
        float ridgeNoise = perlinNoise(noisePos * 16.0) * 0.2; // Reduced from 0.6
        displacement += normal * (mountainNoise1 + mountainNoise2 + ridgeNoise) * uTerrainDiversity;
        break;
        
      case 2: // Forest
        // Smooth forest terrain
        float forestNoise1 = perlinNoise(noisePos * 3.0) * 0.4; // Reduced from 1.0
        float forestNoise2 = fractalNoise(noisePos * 6.0, 1.0, 0.7, 3) * 0.25; // Reduced from 0.6
        float treeNoise = perlinNoise(noisePos * 20.0) * 0.15; // Reduced from 0.4
        displacement += normal * (forestNoise1 + forestNoise2 + treeNoise) * uTerrainDiversity;
        break;
        
      case 3: // Plains
        // Very gentle rolling hills
        float plainsNoise1 = perlinNoise(noisePos * 3.0) * 0.25; // Reduced from 0.6
        float plainsNoise2 = fractalNoise(noisePos * 4.0, 1.0, 0.8, 2) * 0.15; // Reduced from 0.3
        displacement += normal * (plainsNoise1 + plainsNoise2) * uTerrainDiversity;
        break;
        
      case 4: // Desert
        // Smooth sand dune patterns
        float duneNoise1 = perlinNoise(noisePos * 5.0) * 0.4; // Reduced from 1.2
        float duneNoise2 = fractalNoise(noisePos * 10.0, 1.0, 0.6, 4) * 0.25; // Reduced from 0.7
        float windNoise = perlinNoise(noisePos * 25.0) * 0.15; // Reduced from 0.5
        displacement += normal * (duneNoise1 + duneNoise2 + windNoise) * uTerrainDiversity;
        break;
        
      case 5: // Tundra
        // Smooth frozen terrain
        float tundraNoise1 = perlinNoise(noisePos * 3.5) * 0.3; // Reduced from 0.8
        float tundraNoise2 = fractalNoise(noisePos * 7.0, 1.0, 0.5, 3) * 0.2; // Reduced from 0.4
        float iceNoise = perlinNoise(noisePos * 18.0) * 0.1; // Reduced from 0.3
        displacement += normal * (tundraNoise1 + tundraNoise2 + iceNoise) * uTerrainDiversity;
        break;
        
      case 6: // Canyon
        // Smooth canyon formations
        float canyonNoise1 = perlinNoise(noisePos * 4.5) * 0.8; // Reduced from 2.0
        float canyonNoise2 = fractalNoise(noisePos * 9.0, 1.0, 0.4, 5) * 0.4; // Reduced from 1.0
        float erosionNoise = perlinNoise(noisePos * 22.0) * 0.25; // Reduced from 0.6
        displacement += normal * (canyonNoise1 + canyonNoise2 + erosionNoise) * uTerrainDiversity;
        break;
    }
    
    // Add smooth time-based animation for living terrain
    if (uTerrainAnimation > 0.0) {
      float breathingNoise = perlinNoise(noisePos * 1.5 + uTime * 0.1) * 0.15; // Reduced from 0.3
      float atmosphericNoise = fractalNoise(noisePos * 2.5 + uTime * 0.08, 1.0, 0.6, 2) * 0.1; // Reduced from 0.2
      displacement += normal * (breathingNoise + atmosphericNoise) * uTerrainAnimation;
    }
  }
  
  return displacement;
}

// Bulge calculation
float smoothFalloff(float distance, float radius) {
  if (distance >= radius) return 0.0;
  float normalizedDist = distance / radius;
  return (1.0 - normalizedDist) * (1.0 - normalizedDist);
}

vec3 calculateBulgeDisplacement(vec3 worldPos, vec3 normal, vec3 mousePos, 
                                float strength, float radius, float intensity) {
  float distance = length(worldPos - mousePos);
  float falloff = smoothFalloff(distance, radius);
  
  if (falloff <= 0.001) return vec3(0.0);
  
  // Enhanced animation for more dramatic wiggle
  float animationOffset = sin(uTime * 2.0) * 0.1 + 0.9;
  float bulgeAmount = strength * falloff * intensity * animationOffset;
  
  // Add some horizontal displacement for more organic wiggle
  vec3 horizontalDisplacement = vec3(
    sin(uTime * 3.0) * 0.02,
    cos(uTime * 2.5) * 0.02,
    sin(uTime * 1.8) * 0.02
  );
  
  return normal * bulgeAmount + horizontalDisplacement * falloff * strength;
}

// Lighting calculation
float calculateLighting(vec3 position, vec3 normal) {
  vec3 lightDirection = normalize(vec3(1.0, 1.0, 0.5));
  float directional = max(0.0, dot(normal, lightDirection)) * uDirectionalLight;
  float ambient = uAmbientLight;
  return clamp(ambient + directional, 0.0, 1.0);
}

void main() {
  vUv = uv;
  vPosition = position;
  vNormal = normal;
  
  // Sample elevation
  float elevation = texture2D(uElevationMap, uv).r;
  vElevation = elevation;
  
  // Enhanced terrain classification with 7 terrain types
  vTerrainType = classifyEnhancedTerrain(uv, position, elevation);
  
  // Calculate detail level
  vDetailLevel = uDetailLevel;
  
  // Dramatic terrain displacement with terrain-specific Perlin noise
  vec3 terrainDisplacement = calculateEnhancedTerrain(position, normal, uv, elevation, vTerrainType);
  
  vec3 newPosition = position + terrainDisplacement;
  
  // Bulge effect
  if (uBulgeStrength > 0.001) {
    vec3 bulgeDisplacement = calculateBulgeDisplacement(
      newPosition, normal, uMouse, uBulgeStrength, uBulgeRadius, uBulgeIntensity
    );
    newPosition += bulgeDisplacement;
  }
  
  // Pre-calculate lighting
  vLighting = calculateLighting(newPosition, normal);
  
  // Transform to view space
  vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
  
  // Backface culling
  vec3 vNormalMatrix = normalMatrix * normal;
  vVisible = step(0.0, dot(-normalize(mvPosition.xyz), normalize(vNormalMatrix)));
  
  gl_Position = projectionMatrix * mvPosition;
  
  // LOD-based point size
  gl_PointSize = uSize * (0.5 + 0.5 * uLODLevel);
}
