import * as THREE from './js/three.module.js';
import {fragmentShader} from './fragment.js';
import Stats from './lib/stats.module.js';
import { TransformControls } from './lib/TransformControls.js';
import { Flow  } from './lib/CurveModifier.js'
import { OutlineEffect } from './lib/OutlineEffect.js'


const ACTION_SELECT = 1, ACTION_NONE = 0;
const curveHandles = [];
const mouse = new THREE.Vector2();

let stats;
let scene,
  canvas,
  camera,
  renderer,
  rayCaster,
  control,
  flow,
  uniforms,
  effect,
  clock,
  action = ACTION_NONE;
let particleLight;

// init();
// animate();

// function init(){
//   const container = document.getElementById( 'container' );
//   renderer = new THREE.WebGLRenderer();
//   renderer.setPixelRatio( window.devicePixelRatio );
//   renderer.setSize( window.innerWidth, window.innerHeight );
//   container.appendChild( renderer.domElement );
//   renderer.autoClear = false;

//   camera = new THREE.OrthographicCamera(
//     -1, // left
//      1, // right
//      1, // top
//     -1, // bottom
//     -1, // near,
//      1, // far
//   );
//   scene = new THREE.Scene();
//   clock = new THREE.Clock();
//   const plane = new THREE.PlaneGeometry(2, 2);
//   // const fragmentShader = fragmentShader();
//   uniforms = {
//     iTime: { value: 0 },
//     iResolution:  { value: new THREE.Vector3() },
//   };

//   const material = new THREE.ShaderMaterial({
//     fragmentShader:fragmentShader(),
//     uniforms,
//   });

//   scene.add(new THREE.Mesh(plane, material));

//   onWindowResize();
//   window.addEventListener( 'resize', onWindowResize );
// }

// function onWindowResize() {

//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();

//     renderer.setSize( window.innerWidth, window.innerHeight );

// }

// function animate() {

//     requestAnimationFrame( animate );

//     render();

// }

// function render() {

//     const delta = clock.getDelta();
//     const time = performance.now() * 0.001;
//     uniforms[ "iTime" ].value *= 1.0 / 60.0;

//     // mesh.rotation.y += 0.0125 * delta;
//     // mesh.rotation.x += 0.05 * delta;

//     renderer.render( scene, camera );

// }

function main() {
  canvas = document.querySelector('#container');
  renderer = new THREE.WebGLRenderer();
  container.appendChild( renderer.domElement );
  renderer.autoClearColor = false;

  camera = new THREE.OrthographicCamera(
    -1, // left
     1, // right
     1, // top
    -1, // bottom
    -1, // near,
     1, // far
  );
  scene = new THREE.Scene();
  const plane = new THREE.PlaneGeometry(2, 2);

  // const fragmentShader = fragmentShader();
  uniforms = {
    iTime: { value: 0 },
    iResolution:  { value: new THREE.Vector3() },
  };
  const material = new THREE.ShaderMaterial({
    fragmentShader:fragmentShader(),
    uniforms,
  });
  scene.add(new THREE.Mesh(plane, material));


  function resizeRendererToDisplaySize() {
    canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render(time) {
    time *= 0.001;  // convert to seconds
    // const time = Date.now() * 0.001;
    resizeRendererToDisplaySize();

    const canvas = renderer.domElement;
    uniforms.iResolution.value.set(canvas.width, canvas.height, 1);
    uniforms.iTime.value = time;

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();