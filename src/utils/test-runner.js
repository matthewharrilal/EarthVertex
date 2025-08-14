/* ========================================
   NEURAAL INTERFACE - TEST RUNNER
   ======================================== */

import { QualityAssurance } from './QualityAssurance.js';
import { ErrorHandler } from './ErrorHandler.js';

// Initialize testing framework
const qa = new QualityAssurance();
const errorHandler = new ErrorHandler();

// Test runner function
async function runTests() {
  console.log('🚀 Starting NEURAAL Interface Test Suite...');
  console.log('==========================================');
  
  try {
    // Wait for page to fully load
    await new Promise(resolve => {
      if (document.readyState === 'complete') {
        resolve();
      } else {
        window.addEventListener('load', resolve);
      }
    });
    
    // Wait a bit more for Three.js to initialize
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('📋 Running comprehensive test suite...');
    const results = await qa.runFullTestSuite();
    
    console.log('\n📊 TEST RESULTS SUMMARY:');
    console.log('========================');
    console.log(qa.generateReport());
    
    // Check for any errors
    if (!results.overall) {
      console.warn('⚠️ Some tests failed - checking for issues...');
      
      // Run additional diagnostics
      await runDiagnostics();
    } else {
      console.log('✅ All tests passed! System is stable.');
    }
    
  } catch (error) {
    console.error('❌ Test suite failed:', error);
    errorHandler.handle(error, 'Test Runner');
  }
}

// Additional diagnostics
async function runDiagnostics() {
  console.log('\n🔍 Running additional diagnostics...');
  
  // Check DOM structure
  checkDOMStructure();
  
  // Check Three.js components
  checkThreeJSComponents();
  
  // Check CSS loading
  checkCSSLoading();
  
  // Check performance
  checkPerformance();
}

// Check DOM structure
function checkDOMStructure() {
  console.log('\n🏗️ DOM Structure Check:');
  
  const requiredElements = [
    '.app-container',
    '.globe-panel',
    '.globe-container',
    'canvas.webgl',
    '.chat-panel',
    '.chat-header',
    '.metrics-section'
  ];
  
  requiredElements.forEach(selector => {
    const element = document.querySelector(selector);
    const status = element ? '✅' : '❌';
    console.log(`   ${status} ${selector}: ${element ? 'Found' : 'Missing'}`);
  });
}

// Check Three.js components
function checkThreeJSComponents() {
  console.log('\n🎮 Three.js Components Check:');
  
  const components = [
    'window.renderer',
    'window.scene',
    'window.camera',
    'window.group',
    'window.earthMesh'
  ];
  
  components.forEach(component => {
    const exists = eval(component) !== undefined;
    const status = exists ? '✅' : '❌';
    console.log(`   ${status} ${component}: ${exists ? 'Available' : 'Missing'}`);
  });
}

// Check CSS loading
function checkCSSLoading() {
  console.log('\n🎨 CSS Loading Check:');
  
  const styles = getComputedStyle(document.body);
  const primaryColor = styles.getPropertyValue('--color-primary');
  const spacing = styles.getPropertyValue('--spacing-md');
  
  console.log(`   CSS Variables: ${primaryColor ? '✅ Loaded' : '❌ Missing'}`);
  console.log(`   Primary Color: ${primaryColor || 'Not set'}`);
  console.log(`   Spacing: ${spacing || 'Not set'}`);
}

// Check performance
function checkPerformance() {
  console.log('\n⚡ Performance Check:');
  
  if (window.performanceMonitor) {
    const status = window.performanceMonitor.getStatus();
    console.log(`   FPS: ${status.fps}`);
    console.log(`   Memory: ${status.memory}`);
    console.log(`   LOD: ${status.lod}`);
  } else {
    console.log('   Performance Monitor: ❌ Not available');
  }
}

// Auto-run tests after a delay
setTimeout(runTests, 1000);

// Export for manual testing
window.runNEURAALTests = runTests;
window.qa = qa;
window.errorHandler = errorHandler;

console.log('🧪 NEURAAL Interface Test Runner loaded');
console.log('Run "runNEURAALTests()" in console to start tests manually');
