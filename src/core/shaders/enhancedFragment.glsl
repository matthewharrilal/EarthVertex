// ENHANCED FRAGMENT SHADER - SIMPLIFIED FOR DEBUGGING
// Performance-optimized with basic visual effects

uniform sampler2D uColorMap;
uniform sampler2D uAlphaMap;
uniform sampler2D uElevationMap;
uniform float uWaterEffect;
uniform float uTerrainDiversity;
uniform float uTime;
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
uniform float uContrast;
uniform float uBrightness;
uniform float uSaturation;

varying float vVisible;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying float vElevation;
flat varying int vTerrainType;
varying float vLighting;
varying float vDetailLevel;

// Perlin noise function for fragment shader
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

// Fractal noise for terrain detail
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

// Basic color enhancement functions
vec3 adjustContrast(vec3 color, float contrast) {
  return ((color - 0.5) * contrast) + 0.5;
}

vec3 adjustSaturation(vec3 color, float saturation) {
  float gray = dot(color, vec3(0.299, 0.587, 0.114));
  return mix(vec3(gray), color, saturation);
}

vec3 adjustBrightness(vec3 color, float brightness) {
  return color * brightness;
}

// Dramatic terrain-specific color modification with enhanced Perlin noise
vec3 getEnhancedTerrainColor(int terrainType, vec3 baseColor, vec2 uv) {
  vec3 color = baseColor;
  
  // Smooth Perlin noise variation based on position and time
  vec3 noisePos = vPosition * 6.0 + uTime * 0.1; // Reduced time speed
  float noise1 = perlinNoise(noisePos) * 0.1; // Reduced from 0.2
  float noise2 = fractalNoise(noisePos * 2.5, 1.0, 0.6, 3) * 0.05; // Reduced from 0.1
  
  switch (terrainType) {
    case 0: // Ocean
      // Dramatic ocean colors with wave patterns
      vec3 oceanColor = vec3(0.1, 0.4, 0.8);
      float oceanNoise = noise1 + noise2;
      color = mix(color, oceanColor, 0.4 + oceanNoise);
      
      // Smooth wave patterns with gentle time animation
      float waveNoise1 = perlinNoise(vPosition * 8.0 + uTime * 0.15) * 0.15; // Reduced from 0.25
      float waveNoise2 = fractalNoise(vPosition * 16.0 + uTime * 0.1, 1.0, 0.7, 2) * 0.1; // Reduced from 0.15
      color += vec3(waveNoise1 * 0.1, waveNoise2 * 0.15, (waveNoise1 + waveNoise2) * 0.15); // Reduced amplitude
      break;
      
    case 1: // Mountain
      // Dramatic mountain colors with snow and rock
      vec3 mountainColor = vec3(0.6, 0.6, 0.7);
      float mountainNoise = noise1 + noise2;
      color = mix(color, mountainColor, 0.5 + mountainNoise);
      
      // Snow line effect with elevation
      if (vElevation > 0.7) {
        vec3 snowColor = vec3(0.9, 0.9, 1.0);
        float snowMix = smoothstep(0.7, 0.9, vElevation);
        color = mix(color, snowColor, snowMix * 0.8);
      }
      
      // Rock texture variation
      float rockNoise = fractalNoise(vPosition * 12.0 + uTime * 0.1, 1.0, 0.5, 4) * 0.2;
      color += vec3(rockNoise * 0.1, rockNoise * 0.08, rockNoise * 0.12);
      break;
      
    case 2: // Forest
      // Rich forest colors with vegetation variation
      vec3 forestColor = vec3(0.2, 0.5, 0.2);
      float forestNoise = noise1 + noise2;
      color = mix(color, forestColor, 0.4 + forestNoise);
      
      // Tree canopy variation
      float treeNoise = perlinNoise(vPosition * 15.0 + uTime * 0.08) * 0.3;
      color += vec3(treeNoise * 0.05, treeNoise * 0.15, treeNoise * 0.05);
      break;
      
    case 3: // Plains
      // Gentle plains with subtle variation
      vec3 plainsColor = vec3(0.4, 0.6, 0.3);
      float plainsNoise = noise1 + noise2;
      color = mix(color, plainsColor, 0.3 + plainsNoise);
      
      // Grass variation
      float grassNoise = fractalNoise(vPosition * 8.0 + uTime * 0.12, 1.0, 0.8, 2) * 0.15;
      color += vec3(grassNoise * 0.08, grassNoise * 0.12, grassNoise * 0.05);
      break;
      
    case 4: // Desert
      // Dramatic desert colors with sand patterns
      vec3 desertColor = vec3(0.8, 0.7, 0.4);
      float desertNoise = noise1 + noise2;
      color = mix(color, desertColor, 0.5 + desertNoise);
      
      // Sand dune patterns
      float duneNoise = fractalNoise(vPosition * 10.0 + uTime * 0.18, 1.0, 0.6, 3) * 0.25;
      color += vec3(duneNoise * 0.15, duneNoise * 0.12, duneNoise * 0.08);
      break;
      
    case 5: // Tundra
      // Frozen tundra with ice effects
      vec3 tundraColor = vec3(0.7, 0.8, 0.9);
      float tundraNoise = noise1 + noise2;
      color = mix(color, tundraColor, 0.4 + tundraNoise);
      
      // Ice crystal patterns
      float iceNoise = perlinNoise(vPosition * 20.0 + uTime * 0.05) * 0.2;
      color += vec3(iceNoise * 0.1, iceNoise * 0.12, iceNoise * 0.15);
      break;
      
    case 6: // Canyon
      // Dramatic canyon colors with erosion
      vec3 canyonColor = vec3(0.5, 0.3, 0.2);
      float canyonNoise = noise1 + noise2;
      color = mix(color, canyonColor, 0.6 + canyonNoise);
      
      // Erosion patterns
      float erosionNoise = fractalNoise(vPosition * 14.0 + uTime * 0.1, 1.0, 0.4, 4) * 0.3;
      color += vec3(erosionNoise * 0.12, erosionNoise * 0.08, erosionNoise * 0.06);
      break;
  }
  
  return color;
}

// Dramatic atmospheric effects with living, breathing terrain
vec3 applyEnhancedAtmosphericEffects(vec3 color, float elevation) {
  // Enhanced base atmospheric glow
  float atmosphericGlow = elevation * 0.15 + 0.08; // Increased from 0.1 + 0.05
  color += vec3(atmosphericGlow * 0.12, atmosphericGlow * 0.18, atmosphericGlow * 0.25);
  
  // Smooth atmospheric breathing effect
  vec3 atmosPos = vPosition * 2.5 + uTime * 0.05; // Slower breathing
  float breathingNoise = perlinNoise(atmosPos) * 0.08; // Reduced from 0.15
  float breathingCycle = sin(uTime * 0.3) * 0.05 + 0.95; // Gentler breathing cycle
  color += vec3(breathingNoise * 0.02, breathingNoise * 0.025, breathingNoise * 0.03) * breathingCycle;
  
  // Enhanced distance factor with dramatic noise
  float distanceFactor = 1.0 + (elevation - 0.5) * 0.3; // Increased from 0.2
  float noiseDistance = perlinNoise(vPosition * 4.0 + uTime * 0.15) * 0.2; // Increased from 0.1
  distanceFactor += noiseDistance;
  color *= distanceFactor;
  
  // Add cosmic atmospheric waves
  float cosmicWave1 = perlinNoise(vPosition * 1.5 + uTime * 0.12) * 0.08;
  float cosmicWave2 = fractalNoise(vPosition * 3.0 + uTime * 0.08, 1.0, 0.7, 2) * 0.06;
  color += vec3(cosmicWave1 * 0.02, cosmicWave2 * 0.03, (cosmicWave1 + cosmicWave2) * 0.04);
  
  return color;
}

void main() {
  // Early discard for backface culling
  if (vVisible < 0.5) discard;
  
  // Sample base textures
  vec3 baseColor = texture2D(uColorMap, vUv).rgb;
  float alpha = texture2D(uAlphaMap, vUv).r;
  
  // Dramatic terrain-specific color modification
  vec3 color = getEnhancedTerrainColor(vTerrainType, baseColor, vUv);
  
  // Apply lighting (from vertex shader pre-calculation)
  color *= vLighting;
  
  // Basic water effects
  if (uWaterEffect > 0.0 && alpha < 0.5) {
    vec3 waterColor = vec3(0.2, 0.4, 0.8);
    float waterMix = uWaterEffect * (1.0 - alpha);
    color = mix(color, waterColor, waterMix);
  }
  
  // Dramatic atmospheric effects with living, breathing terrain
  color = applyEnhancedAtmosphericEffects(color, vElevation);
  
  // Enhanced visual adjustments with Perlin noise
  color = adjustContrast(color, uContrast);
  color = adjustSaturation(color, uSaturation);
  color = adjustBrightness(color, uBrightness);
  
  // Add smooth final Perlin noise detail for cosmic realism
  vec3 finalNoisePos = vPosition * 12.0 + uTime * 0.1; // Reduced speed
  float finalNoise1 = perlinNoise(finalNoisePos) * 0.03; // Reduced from 0.06
  float finalNoise2 = fractalNoise(finalNoisePos * 1.5, 1.0, 0.6, 2) * 0.02; // Reduced from 0.04
  float cosmicDetail = finalNoise1 + finalNoise2;
  color += vec3(cosmicDetail * 0.015, cosmicDetail * 0.01, cosmicDetail * 0.02); // Reduced amplitude
  
  // Add gentle terrain-specific micro-detail
  float microNoise = perlinNoise(vPosition * 25.0 + uTime * 0.15) * 0.01; // Reduced from 0.02
  color += vec3(microNoise * 0.008, microNoise * 0.005, microNoise * 0.01); // Reduced amplitude
  
  // LOD-based quality adjustment
  if (uLODLevel < 1.0) {
    float detailReduction = smoothstep(0.0, 1.0, uLODLevel);
    vec3 simplifiedColor = baseColor * vLighting * uBrightness;
    color = mix(simplifiedColor, color, detailReduction);
  }
  
  // Ensure colors stay in valid range
  color = clamp(color, 0.0, 1.0);
  
  // Final alpha calculation
  float finalAlpha = 1.0;
  
  if (alpha < 0.5) {
    finalAlpha = 0.85 + alpha * 0.3;
  }
  
  gl_FragColor = vec4(color, finalAlpha);
}
