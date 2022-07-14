// import "../style.css";
// // import * as THREE from "three";
// // import { OrbitControls, MapControls} from "https://cdn.skypack.dev/three-stdlib@2.8.5/controls/OrbitControls"; //usefull
// // import { MapControls } from 'three-stdlib/controls/OrbitControls' //nicht gedownloaded die beispiele
// // //unused packages

// // import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
// // import { MapControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';

// //alternativ
// import * as THREE from "https://cdn.skypack.dev/three@0.137";
// import { MapControls } from "https://cdn.skypack.dev/three-stdlib@2.8.5/controls/OrbitControls";

// // // import { RGBELoader } from "https://cdn.skypack.dev/three-stdlib@2.8.5/loaders/RGBELoader";
// // // import { Int8Attribute } from "three";
// import { GLTFLoader } from "https://cdn.skypack.dev/three-stdlib@2.8.5/loaders/GLTFLoader";
// // // import { GUI } from 'https://cdn.skypack.dev/dat.gui';

// import { EffectComposer } from "/node_modules/three/examples/jsm/postprocessing/EffectComposer.js";
// import { RenderPass } from "/node_modules/three/examples/jsm/postprocessing/RenderPass.js";
// import { UnrealBloomPass } from "/node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js";




// //Mars
// async function addMars() {
//   var textures = {
//     // thanks to https://free3d.com/user/ali_alkendi !
//     bump: await new THREE.TextureLoader().loadAsync("assets/marsbump.jpg"),
//     map: await new THREE.TextureLoader().loadAsync("assets/marsmap.jpg"),
//     spec: await new THREE.TextureLoader().loadAsync("assets/marsmap.jpg"),
//     // planeTrailMask: await new TextureLoader().loadAsync("assets/mask.png"),
//   };

//   // Important to know!
//   // textures.map.encoding = sRGBEncoding;
//   var mars = new THREE.Mesh(
//     new THREE.SphereGeometry(45, 32, 32),
//     new THREE.MeshPhysicalMaterial({
//       map: textures.map,
//       roughnessMap: textures.spec,
//       bumpMap: textures.bump,
//       bumpScale: 0.4,
//       sheen: 1,
//       sheenRoughness: 0.75,
//       sheenColor: new THREE.Color("#ff8a00").convertSRGBToLinear(),
//       clearcoat: 0.5,
//     })
//   );
//   mars.sunEnvIntensity = 0.4;
//   mars.moonEnvIntensity = 0.1;
//   mars.rotation.y += Math.PI * 1.25;
//   mars.receiveShadow = true;
//   mars.position.set(0, 0, 500);

//   return mars;
// }

// //Sun
// async function addSun() {
//   var textures = {
//     // thanks to https://free3d.com/user/ali_alkendi !
//     // bump: await new THREE.TextureLoader().loadAsync("assets/marsbump.jpg"),
//     map: await new THREE.TextureLoader().loadAsync("assets/sunmap.jpg"),
//     spec: await new THREE.TextureLoader().loadAsync("assets/sunmap.jpg"),
//     // planeTrailMask: await new TextureLoader().loadAsync("assets/mask.png"),
//   };

//   // Important to know!
//   // textures.map.encoding = sRGBEncoding;

//   var sphere = new THREE.Mesh(
//     new THREE.SphereGeometry(120, 32, 32),
//     new THREE.MeshBasicMaterial({
//       map: textures.map,
//       roughnessMap: textures.spec,
//       // bumpMap: textures.bump,
//       // bumpScale: 0.4,
//       sheen: 1,
//       sheenRoughness: 0.75,
//       shininess: 10,
//       sheenColor: new THREE.Color("#ff8a00").convertSRGBToLinear(),
//       clearcoat: 0.5,
//       shininess: 1,
//     })
//   );
//   // sphere.sunEnvIntensity = 0.4;
//   // sphere.moonEnvIntensity = 0.1;
//   sphere.rotation.y += Math.PI * 1.25;
//   sphere.receiveShadow = true;
//   sphere.position.set(0, 0, 0);

//   return sphere;
// }

// //bloom sun
// function addSunBloom() {
//   //bloom renderer
//   const renderScene = new RenderPass(scene, camera);
//   const bloomPass = new UnrealBloomPass(
//     new THREE.Vector2(window.innerWidth, window.innerHeight),
//     1.5,
//     0.4,
//     0.85
//   );
//   bloomPass.threshold = 0;
//   bloomPass.strength = 2; //intensity of glow
//   bloomPass.radius = 0;
//   var bloomComposer = new EffectComposer(renderer);
//   bloomComposer.setSize(window.innerWidth, window.innerHeight);
//   bloomComposer.renderToScreen = true;
//   bloomComposer.addPass(renderScene);
//   bloomComposer.addPass(bloomPass);
//   window.bloomComposerSun = bloomComposer ;

//   //sun
//   const color = new THREE.Color("#FDB813");
//   const geometry = new THREE.IcosahedronGeometry(5, 15);
//   const material = new THREE.MeshBasicMaterial({ color: color });
//   const sphere = new THREE.Mesh(geometry, material);
//   sphere.position.set(0, 0, 0);
//   // sphere.layers.set(1);
//   scene.add(sphere);

//   // sphere.sunEnvIntensity = 0.4;
//   // sphere.moonEnvIntensity = 0.1;
//   // sphere.rotation.y += Math.PI * 1.25;
//   // sphere.receiveShadow = true;
//   // sphere.position.set(0, 0, 0);

//   return sphere;
// }

// //Jupiter
// async function addJupiter() {
//   var textures = {
//     // thanks to https://free3d.com/user/ali_alkendi !
//     // bump: await new THREE.TextureLoader().loadAsync("assets/marsbump.jpg"),
//     map: await new THREE.TextureLoader().loadAsync("assets/jupitermap.jpg"),
//     spec: await new THREE.TextureLoader().loadAsync("assets/jupitermap.jpg"),
//     // planeTrailMask: await new TextureLoader().loadAsync("assets/mask.png"),
//   };

//   // Important to know!
//   // textures.map.encoding = sRGBEncoding;

//   var sphere = new THREE.Mesh(
//     new THREE.SphereGeometry(80, 32, 32),
//     new THREE.MeshPhysicalMaterial({
//       map: textures.map,
//       roughnessMap: textures.spec,
//       bumpMap: textures.bump,
//       bumpScale: 0.4,
//       sheen: 1,
//       sheenRoughness: 0.75,
//       sheenColor: new THREE.Color("#ff8a00").convertSRGBToLinear(),
//       clearcoat: 0.5,
//     })
//   );
//   sphere.sunEnvIntensity = 0.4;
//   sphere.moonEnvIntensity = 0.1;
//   sphere.rotation.y += Math.PI * 1.25;
//   sphere.receiveShadow = true;
//   sphere.position.set(0, 0, 1000);

//   return sphere;
// }

// //Earth
// async function addEarth() {
//   var textures = {
//     // thanks to https://free3d.com/user/ali_alkendi !
//     bump: await new THREE.TextureLoader().loadAsync("assets/earthbump.jpg"),
//     map: await new THREE.TextureLoader().loadAsync("assets/earthmap.jpg"),
//     spec: await new THREE.TextureLoader().loadAsync("assets/earthspec.jpg"),
//     // planeTrailMask: await new TextureLoader().loadAsync("assets/mask.png"),
//   };

//   // Important to know!
//   // textures.map.encoding = sRGBEncoding;

//   var sphere = new THREE.Mesh(
//     new THREE.SphereGeometry(50, 32, 32),
//     new THREE.MeshPhysicalMaterial({
//       map: textures.map,
//       roughnessMap: textures.spec,
//       bumpMap: textures.bump,
//       bumpScale: 0.6,
//       sheen: 1,
//       sheenRoughness: 0.75,
//       // sheenColor: new THREE.Color("#ff8a00").convertSRGBToLinear(),
//       clearcoat: 0.5,
//     })
//   );
//   sphere.sunEnvIntensity = 0.4;
//   sphere.moonEnvIntensity = 0.1;
//   sphere.rotation.y += Math.PI * 1.25;
//   sphere.receiveShadow = true;
//   sphere.position.set(0, 0, -300);
//   sphere.name = "earth";
//   return sphere;
// }

// //Moon
// async function addMoon() {
//   var textures = {
//     // thanks to https://free3d.com/user/ali_alkendi !
//     bump: await new THREE.TextureLoader().loadAsync("assets/moonbump.jpg"),
//     map: await new THREE.TextureLoader().loadAsync("assets/moonmap.jpg"),
//     spec: await new THREE.TextureLoader().loadAsync("assets/moonmap.jpg"),
//     // planeTrailMask: await new TextureLoader().loadAsync("assets/mask.png"),
//   };

//   // Important to know!
//   // textures.map.encoding = sRGBEncoding;

//   var sphere = new THREE.Mesh(
//     new THREE.SphereGeometry(25, 32, 32),
//     new THREE.MeshPhysicalMaterial({
//       map: textures.map,
//       roughnessMap: textures.spec,
//       bumpMap: textures.bump,
//       bumpScale: 0.5,
//       sheen: 1,
//       sheenRoughness: 0.75,
//       sheenColor: new THREE.Color("#ff8a00").convertSRGBToLinear(),
//       clearcoat: 0.5,
//     })
//   );
//   sphere.sunEnvIntensity = 0.4;
//   sphere.moonEnvIntensity = 0.1;
//   sphere.rotation.y += Math.PI * 1.25;
//   sphere.receiveShadow = true;
//   sphere.position.set(0, 0, 150);
//   sphere.name = "moon";
//   return sphere;
// }

// //Saturn
// async function addSaturn() {
//   var textures = {
//     // thanks to https://free3d.com/user/ali_alkendi !
//     // bump: await new THREE.TextureLoader().loadAsync("assets/marsbump.jpg"),
//     map: await new THREE.TextureLoader().loadAsync("assets/saturnmap.jpg"),
//     spec: await new THREE.TextureLoader().loadAsync("assets/saturnmap.jpg"),
//     // planeTrailMask: await new TextureLoader().loadAsync("assets/mask.png"),
//   };

//   // Important to know!
//   // textures.map.encoding = sRGBEncoding;

//   var sphere = new THREE.Mesh(
//     new THREE.SphereGeometry(65, 32, 32),
//     new THREE.MeshPhysicalMaterial({
//       map: textures.map,
//       roughnessMap: textures.spec,
//       bumpMap: textures.bump,
//       bumpScale: 0.4,
//       sheen: 1,
//       sheenRoughness: 0.75,
//       sheenColor: new THREE.Color("#ff8a00").convertSRGBToLinear(),
//       clearcoat: 0.5,
//     })
//   );
//   sphere.sunEnvIntensity = 0.4;
//   sphere.moonEnvIntensity = 0.1;
//   sphere.rotation.y += Math.PI * 1.25;
//   sphere.receiveShadow = true;
//   sphere.position.set(0, 0, 1200);

//   return sphere;
// }

// //Saturn ring
// //Test kein Async ?
// async function addSaturnRing() {
//   const saturnRingGeo = new THREE.RingGeometry(100, 150, 32);
//   const saturnRingMat = new THREE.MeshPhysicalMaterial({
//     map: await new THREE.TextureLoader().loadAsync("assets/saturnring.png"),
//     side: THREE.DoubleSide,
//   });
//   var saturnRing = new THREE.Mesh(saturnRingGeo, saturnRingMat);
//   saturnRing.rotation.x += (-Math.PI / 2) * 1.3;
//   return saturnRing;
// }

// //Circles
// function planetCircle(oTorus, aRadius) {
//   let material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
//   let geometry = new THREE.TorusGeometry(aRadius, 3, 5, 50, -1);
//   oTorus = new THREE.Mesh(geometry, material);
//   oTorus.rotation.x += Math.PI / 2;
//   scene.add(oTorus);
//   return oTorus;
// }