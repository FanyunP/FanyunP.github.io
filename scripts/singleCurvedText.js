import * as THREE from './js/three.module.js';
import Stats from './lib/stats.module.js';
import { TransformControls } from './lib/TransformControls.js';
import { Flow  } from './lib/CurveModifier.js'

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
	action = ACTION_NONE;

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
	camera.position.set( 2, 2, 4 );
	camera.lookAt( scene.position );

	const initialPoints = [
		{ x: 1, y: 0, z: - 1 },
		{ x: 1, y: 0, z: 1 },
		{ x: - 1, y: 0, z: 1 },
		{ x: - 1, y: 0, z: - 1 },
	];

	const boxGeometry = new THREE.BoxGeometry( 0.1, 0.1, 0.1 );
	const boxMaterial = new THREE.MeshBasicMaterial();

	for ( const handlePos of initialPoints ) {

		const handle = new THREE.Mesh( boxGeometry, boxMaterial );
		handle.position.copy( handlePos );
		curveHandles.push( handle );
		scene.add( handle );

	}

	const curve = new THREE.CatmullRomCurve3(
		curveHandles.map( ( handle ) => handle.position )
		);
	curve.curveType = 'catmullrom';
	curve.tension = 1.0;
	curve.closed = false;

	const points = curve.getPoints( 50 );
	const line = new THREE.LineLoop(
		new THREE.BufferGeometry().setFromPoints( points ),
		new THREE.LineBasicMaterial( { color: 0x00ff00 } )
	);

	scene.add( line );

				//

	const light = new THREE.DirectionalLight( 0xffaa33 );
	light.position.set( - 10, 10, 10 );
	light.intensity = 1.0;
	scene.add( light );

	const light2 = new THREE.AmbientLight( 0x003973 );
	light2.intensity = 1.0;
	scene.add( light2 );

				//

	const loader = new THREE.FontLoader();
	loader.load( './font/dabangshu.json', function ( font ) {

	const geometry = new THREE.TextGeometry( 'HELLO FUTURE', {
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

	geometry.rotateX( Math.PI );

	const material = new THREE.MeshStandardMaterial( {
			color: 0x99ffff
	} );

	const objectToCurve = new THREE.Mesh( geometry, material );

	flow = new Flow( objectToCurve );
	flow.updateCurve( 0, curve );
	scene.add( flow.object3D );

	} );

				//

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

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

	stats.update();

}