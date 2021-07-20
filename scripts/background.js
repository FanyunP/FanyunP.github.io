import * as THREE from './js/three.module.js';
import {fragmentShader} from './skyShader.js';

let container,camera,scene,renderer;
let uniforms;

init();
animate();

function init() {
	container = document.getElementById( 'background' );
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	// renderer.autoClearColor = false;
	container.appendChild( renderer.domElement );

	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(
		40,
		window.innerWidth / window.innerHeight,
		1,
		1000
	);
	camera.position.set( 0.5, 0, 5 );
	
	// const plane = new THREE.PlaneGeometry(2, 2);
	const boxGeometry = new THREE.BoxGeometry( 0.1, 0.1, 0.1 );
	const boxMaterial = new THREE.MeshBasicMaterial();
	const test = new THREE.Mesh( boxGeometry, boxMaterial );
	scene.add( test );

	// uniforms = {
	//     iTime: { value: 0 },
	//     iResolution:  { value: new THREE.Vector3() },
	//   };
	// const material = new THREE.ShaderMaterial({
	//     fragmentShader:fragmentShader(),
	//     uniforms,
	//   });
	// scene.add(new THREE.Mesh(plane, material));

	// window.addEventListener( 'resize', onWindowResize );
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
