import * as THREE from 'js/three.module.js';

import Stats from 'lib/stats.module.js';

import { OrbitControls } from 'lib/OrbitControls.js';
import { RectAreaLightHelper } from 'lib/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'lib/RectAreaLightUniformsLib.js';

let renderer,scene,camera,light1, light2, light3, light4, meshKnot;
let stats;

init();
animate();
function init(){
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  // renderer.setAnimationLoop( animation );
  renderer.outputEncoding = THREE.sRGBEncoding;
  document.body.appendChild( renderer.domElement );

  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.set( 0, 5, - 15 );

  scene = new THREE.Scene();

  RectAreaLightUniformsLib.init();

  const lightW = 10;
  const lightH = 10;
  const lightIntensity = 5;
  const rectLight1 = new THREE.RectAreaLight( 0x1800FF, lightIntensity, lightW, lightH );
  rectLight1.position.set( - 5, 5, 5 );
  scene.add( rectLight1 );

  // const rectLight2 = new THREE.RectAreaLight( 0x00ff00, 5, 4, 10 );
  // rectLight2.position.set( 0, 5, 5 );
  // scene.add( rectLight2 );

  const rectLight3 = new THREE.RectAreaLight( 0xFF00C5, lightIntensity, lightW, lightH );
  rectLight3.position.set( 5, 5, 5 );
  scene.add( rectLight3 );

  // scene.add( new RectAreaLightHelper( rectLight1 ) );
  // scene.add( new RectAreaLightHelper( rectLight2 ) );
  // scene.add( new RectAreaLightHelper( rectLight3 ) );

  const sphere = new THREE.SphereGeometry( 0.5, 16, 8 );
  light1 = new THREE.PointLight( 0xff0040, 2, 50 );
  light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
  scene.add( light1 );

  light2 = new THREE.PointLight( 0x0040ff, 2, 50 );
  light2.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0x0040ff } ) ) );
  scene.add( light2 );

  light3 = new THREE.PointLight( 0x80ff80, 2, 50 );
  light3.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0x80ff80 } ) ) );
  scene.add( light3 );

  light4 = new THREE.PointLight( 0xffaa00, 2, 50 );
  light4.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffaa00 } ) ) );
  scene.add( light4 );

  const geoFloor = new THREE.BoxGeometry( 2000, 0.1, 2000 );
  const matStdFloor = new THREE.MeshStandardMaterial( { color: 0x808080, roughness: 0.1, metalness: 0 } );
  const mshStdFloor = new THREE.Mesh( geoFloor, matStdFloor );
  scene.add( mshStdFloor );

  const texture = new THREE.Texture( generateTexture() );
  texture.needsUpdate = true;

  const geoKnot = new THREE.TorusKnotGeometry( 1.5, 0.5, 200, 16 );
  const matKnot = new THREE.MeshBasicMaterial( { map: texture, transparent: true } ) ;
  // const matKnot = new THREE.MeshStandardMaterial( { color: 0xF0FF00, roughness: 0, metalness: 0 } );
  meshKnot = new THREE.Mesh( geoKnot, matKnot );
  meshKnot.name = 'meshKnot';
  meshKnot.position.set( 0, 5, 0 );
  scene.add( meshKnot );

  const controls = new OrbitControls( camera, renderer.domElement );
  controls.target.copy( meshKnot.position );
  controls.update();

  window.addEventListener( 'resize', onWindowResize );

  // stats = new Stats();
  // document.body.appendChild( stats.dom );

}

function onWindowResize() {

        renderer.setSize( window.innerWidth, window.innerHeight );
        camera.aspect = ( window.innerWidth / window.innerHeight );
        camera.updateProjectionMatrix();

}

function animate() {

        // const mesh = scene.getObjectByName( 'meshKnot' );
        // // mesh.rotation.y = time / 1000;

        // renderer.render( scene, camera );
        requestAnimationFrame( animate );

        render();
        // stats.update();

}

function render(){
        const time = Date.now() * 0.0005;
        // const delta = clock.getDelta();
        meshKnot.rotation.y = time;

        light1.position.x = Math.sin( time * 0.7 ) * 12;
        light1.position.y = Math.cos( time * 0.5 ) * 16;
        light1.position.z = Math.cos( time * 0.3 ) * 12;

        light2.position.x = Math.cos( time * 0.3 ) * 12;
        light2.position.y = Math.sin( time * 0.5 ) * 16;
        light2.position.z = Math.sin( time * 0.7 ) * 12;

        light3.position.x = Math.sin( time * 0.7 ) * 12;
        light3.position.y = Math.cos( time * 0.3 ) * 16;
        light3.position.z = Math.sin( time * 0.5 ) * 12;

        light4.position.x = Math.sin( time * 0.3 ) * 12;
        light4.position.y = Math.cos( time * 0.7 ) * 16;
        light4.position.z = Math.sin( time * 0.5 ) * 12;

        renderer.render( scene, camera );
}

function generateTexture() {

        const canvas = document.createElement( 'canvas' );
        canvas.width = 256;
        canvas.height = 256;

        const context = canvas.getContext( '2d' );
        const image = context.getImageData( 0, 0, 256, 256 );

        let x = 0, y = 0;

        for ( let i = 0, j = 0, l = image.data.length; i < l; i += 4, j ++ ) {

          x = j % 256;
          y = ( x === 0 ) ? y + 1 : y;

          image.data[ i ] = 255;
          image.data[ i + 1 ] = 255;
          image.data[ i + 2 ] = 255;
          image.data[ i + 3 ] = Math.floor( x ^ y );

        }

        context.putImageData( image, 0, 0 );

        return canvas;

      }
// function main() {
//   const canvas = document.querySelector('#c');
//   const renderer = new THREE.WebGLRenderer({canvas});

//   const fov = 75;
//   const aspect = 2;  // the canvas default
//   const near = 0.1;
//   const far = 50;
//   const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
//   camera.position.z = 20;

//   const scene = new THREE.Scene();
//   scene.background = new THREE.Color('red');

//   const geometry = new THREE.SphereGeometry();
//   const material = new THREE.MeshBasicMaterial({color: 'yellow'});

//   const mesh = new THREE.Mesh(geometry, material);
//   scene.add(mesh);

//   function resizeRendererToDisplaySize(renderer) {
//     const canvas = renderer.domElement;
//     const width = canvas.clientWidth;
//     const height = canvas.clientHeight;
//     const needResize = canvas.width !== width || canvas.height !== height;
//     if (needResize) {
//       renderer.setSize(width, height, false);
//     }
//     return needResize;
//   }

//   function render(time){
//     if (resizeRendererToDisplaySize(renderer)) {
//       const canvas = renderer.domElement;
//       camera.aspect = canvas.clientWidth / canvas.clientHeight;
//       camera.updateProjectionMatrix();
//     }
//     renderer.render(scene, camera);
//     // requestAnimationFrame(render);
//   }
//   requestAnimationFrame(render);
// }

// main();