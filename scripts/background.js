import * as THREE from './js/three.module.js';
import {fragmentShader} from './skyShader.js';

let container,camera,scene,renderer;
let uniforms;

init();

function init() {
	container = document.getElementById( 'background' );
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.autoClearColor = false;
	container.appendChild( renderer.domElement );

	scene = new THREE.Scene();
  
  camera = new THREE.OrthographicCamera(
    -1, // left
     1, // right
     1, // top
    -1, // bottom
    -1, // near,
     1, // far
  );
	// camera = new THREE.PerspectiveCamera(
	// 	40,
	// 	window.innerWidth / window.innerHeight,
	// 	1,
	// 	1000
	// );
	// camera.position.set( 0.5, 0, 5 );
	// scene.background = new THREE.Color( 0x5ec3e7 );
	const plane = new THREE.PlaneGeometry(4, 2);

	uniforms = {
	    iTime: { value: 0 },
	    iResolution:  { value: new THREE.Vector3() },
	  };
	const material = new THREE.ShaderMaterial({
	    fragmentShader:fragmentShader(),
	    uniforms,
	  });
  const background = new THREE.Mesh(plane, material);
	scene.add(background);

	window.addEventListener( 'resize', onWindowResize );
  requestAnimationFrame( render );
}


function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function render(time){
  time *= 0.001;
  const canvas = renderer.domElement;
  uniforms.iResolution.value.set(canvas.width, canvas.height, 1);
  uniforms.iTime.value = time;
  renderer.render( scene, camera );
  requestAnimationFrame( render );
}

// function main() {
// 	container = document.getElementById( 'background' );
// 	renderer = new THREE.WebGLRenderer();
// 	renderer.setPixelRatio( window.devicePixelRatio );
// 	renderer.setSize( window.innerWidth, window.innerHeight );
// 	renderer.autoClearColor = false;
// 	container.appendChild( renderer.domElement );
//   // const canvas = document.querySelector('#c');
//   // const renderer = new THREE.WebGLRenderer({canvas});
  

//      camera = new THREE.OrthographicCamera(
//     -1, // left
//      1, // right
//      1, // top
//     -1, // bottom
//     -1, // near,
//      1, // far
//   );
//   const scene = new THREE.Scene();
//   const plane = new THREE.PlaneGeometry(2, 2);

//   const uniforms = {
//     iTime: { value: 0 },
//     iResolution:  { value: new THREE.Vector3() },
//   };
//   const material = new THREE.ShaderMaterial({
//     fragmentShader:fragmentShader(),
//     uniforms,
//   });
//   scene.add(new THREE.Mesh(plane, material));

//   function resizeRendererToDisplaySize() {
//     const canvas = renderer.domElement;
//     const width = canvas.clientWidth;
//     const height = canvas.clientHeight;
//     const needResize = canvas.width !== width || canvas.height !== height;
//     if (needResize) {
//       renderer.setSize(width, height, false);
//     }
//     return needResize;
//   }

//   function render(time) {
//     time *= 0.001;  // convert to seconds

//     resizeRendererToDisplaySize(renderer);

//     const canvas = renderer.domElement;
//     uniforms.iResolution.value.set(canvas.width, canvas.height, 1);
//     uniforms.iTime.value = time;

//     renderer.render(scene, camera);

//     requestAnimationFrame(render);
//   }

//   requestAnimationFrame(render);
// }

// main();
