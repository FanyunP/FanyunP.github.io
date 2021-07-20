import * as THREE from './js/three.module.js';
import {fragmentShader} from './skyShader.js';

let container,camera,scene,renderer;

init();
animate();

function init() {
	container = document.getElementById( 'background' );
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.autoClearColor = false;
	container.appendChild( renderer.domElement );

	camera = new THREE.OrthographicCamera(
	    -1, // left
	     1, // right
	     1, // top
	    -1, // bottom
	    -1, // near,
	     1, // far
	  );
	const scene = new THREE.Scene();
	const plane = new THREE.PlaneGeometry(2, 2);

	const uniforms = {
	    iTime: { value: 0 },
	    iResolution:  { value: new THREE.Vector3() },
	  };
	const material = new THREE.ShaderMaterial({
	    fragmentShader:fragmentShader(),
	    uniforms,
	  });
	scene.add(new THREE.Mesh(plane, material));

	window.addEventListener( 'resize', onWindowResize );
}


function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {
	requestAnimationFrame( animate );
	render();
}

function render() {
	const time = performance.now() * 0.001;
	uniforms.iTime.value = time;
	renderer.render( scene, camera );
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