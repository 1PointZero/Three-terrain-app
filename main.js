import './style.css'

import * as THREE from 'three';

// document.querySelector('#app').innerHTML = `
//   <h1>Hello Vite!</h1>
//   <a href="https://vitejs.dev/guide/features.html" target="_blank">Documentation</a>
// `


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render( scene, camera );

const geometry = new THREE.TorusGeometry( 10, 2, 100, 100 );
const material = new THREE.MeshBasicMaterial( { color: 0xFF6347 } );
const torus = new THREE.Mesh( geometry, material );

scene.add(torus);

const pointLight = new THREE.PointLight(0xFF6347);

pointLight.position.set(5,5,5);

scene.add(pointLight);

function animate() {
  requestAnimationFrame( animate );
  torus.rotation.x += 0.01;
  
  renderer.render (scene, camera);

}

animate();