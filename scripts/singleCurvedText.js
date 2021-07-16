import * as THREE from './js/three.module.js';
import Stats from './lib/stats.module.js';
import { TransformControls } from './lib/TransformControls.js';
import { Flow  } from './lib/CurveModifier.js'
import { OutlineEffect } from './lib/OutlineEffect.js'

const ACTION_SELECT = 1, ACTION_NONE = 0;
const curveHandles = [];
const mouse = new THREE.Vector2();

let stats;
let scene,
	camera,
	renderer,
	rayCaster,
	control,
	flow,
	effect,
	action = ACTION_NONE;
let particleLight;


init();
animate();

function init() {

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(
		40,
		window.innerWidth / window.innerHeight,
		1,
		1000
	);
	// camera.position.set( 2, 2, 4 );
	camera.position.set( 0.5, 0, 5 );
	// camera.lookAt( scene.position );
	scene.background = new THREE.Color( 0x5ec3e7 );
	const initialPoints = [
		{ x: 1, y: 0, z: - 1 },
		// { x: 1, y: 0.5, z: - 1 },
		{ x: 1, y: 0, z: 1 },
		// { x: 1, y: -0.5, z: - 1 },
		{ x: - 1, y: 0, z: 1 },
		{ x: - 1, y: 0, z: - 1 },
	];

	const boxGeometry = new THREE.BoxGeometry( 0.1, 0.1, 0.1 );
	const boxMaterial = new THREE.MeshBasicMaterial();

	for ( const handlePos of initialPoints ) {

		const handle = new THREE.Mesh( boxGeometry, boxMaterial );
		handle.position.copy( handlePos );
		curveHandles.push( handle );
		// scene.add( handle );

	}

	const curve = new THREE.CatmullRomCurve3(
		curveHandles.map( ( handle ) => handle.position )
		);
	curve.curveType = 'centripetal';
	curve.closed = true;

	const points = curve.getPoints( 50 );
	const line = new THREE.LineLoop(
		new THREE.BufferGeometry().setFromPoints( points ),
		new THREE.LineBasicMaterial( { color: 0x00ff00 } )
	);

	// scene.add( line );

				//

	// const light = new THREE.DirectionalLight( 0xf0ea70 );
	// light.position.set( - 10, 10, 10 );
	// light.intensity = 1.0;
	// scene.add( light );

	// const light2 = new THREE.AmbientLight( 0xdc4d31 );
	// light2.intensity = 1.0;
	// scene.add( light2 );

				//

	const loader = new THREE.FontLoader();
	loader.load( './font/Sinisuka_Regular.json', function ( font ) {

	const geometry = new THREE.TextGeometry( 'Hello \nFuture', {
			font: font,
			size: 0.2,
			height: 0.05,
			curveSegments: 12,
			bevelEnabled: true,
			bevelThickness: 0.02,
			bevelSize: 0.01,
			bevelOffset: 0,
			bevelSegments: 5,
		} );

	// geometry.rotateX( Math.PI );

	const colors = new Uint8Array(3);
	for(let c = 0; c <= colors.length; c++){
		colors[c] = (c/colors.length) * 256;
	}
	const gradientMap = new THREE.DataTexture( colors, colors.length, 1, THREE.LuminanceFormat );
	gradientMap.minFilter = THREE.NearestFilter;
	gradientMap.magFilter = THREE.NearestFilter;
	gradientMap.generateMipmaps = false;

	const diffuseColor = new THREE.Color().setHSL( 0.1, 1, 0.5 ).multiplyScalar( 0.9 );
	const material = new THREE.MeshToonMaterial({
		color: diffuseColor,
		gradientMap:gradientMap
	});
	// const material = new THREE.MeshStandardMaterial( {
	// 		color: 0xe3b22a
	// } );

	const objectToCurve = new THREE.Mesh( geometry, material );

	flow = new Flow( objectToCurve );
	flow.updateCurve( 0, curve );
	scene.add( flow.object3D );

	const outlineMaterial = new THREE.MeshBasicMaterial({
		color: 0xff2400,
		side: THREE.BackSide
	});

	const outlineMesh1 = new THREE.Mesh(geometry,outlineMaterial);
	outlineMesh1.position.x -= 0.01;
	outlineMesh1.scale.multiplyScalar(1.06);
	scene.add(outlineMesh1);

	} );

				//

	particleLight = new THREE.Mesh(
					new THREE.SphereGeometry( 0.05, 10, 10 ),
					new THREE.MeshBasicMaterial( { color: 0xefea73 } )
				);
	scene.add( particleLight );

	particleLight.position.x = -0.5;
	particleLight.position.y = 1;
	particleLight.position.z = -1;

	scene.add( new THREE.AmbientLight( 0xf4f0c3 ) );
	const pointLight = new THREE.PointLight( 0xffffff, 2, 800 );
	particleLight.add( pointLight );

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	//effect
	renderer.outputEncoding = THREE.sRGBEncoding;
	effect = new OutlineEffect( renderer );

	renderer.domElement.addEventListener( 'pointerdown', onPointerDown );

	rayCaster = new THREE.Raycaster();
	control = new TransformControls( camera, renderer.domElement );
	control.addEventListener( 'dragging-changed', function ( event ) {

	if ( ! event.value ) {

		const points = curve.getPoints( 50 );
		line.geometry.setFromPoints( points );
		flow.updateCurve( 0, curve );

		}

	} );

	stats = new Stats();
	document.body.appendChild( stats.dom );

	window.addEventListener( 'resize', onWindowResize );

	}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function onPointerDown( event ) {

	action = ACTION_SELECT;
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

function animate() {

	requestAnimationFrame( animate );

	if ( action === ACTION_SELECT ) {

	rayCaster.setFromCamera( mouse, camera );
	action = ACTION_NONE;
	const intersects = rayCaster.intersectObjects( curveHandles );
	if ( intersects.length ) {

		const target = intersects[ 0 ].object;
		control.attach( target );
		scene.add( control );

		}

	}

	if ( flow ) {

		flow.moveAlongCurve( 0.003 );

	}

	render();

}

function render() {

	renderer.render( scene, camera );
	const timer = Date.now() * 0.00005;
	// particleLight.position.x = Math.sin( timer * 7 ) * 3;
	// particleLight.position.y = Math.cos( timer * 5) * 4;
	// particleLight.position.z = Math.cos( timer * 3 ) * 3;
	stats.update();
	// effect.render( scene, camera );
}
