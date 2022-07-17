import "./style.css";

import * as THREE from "https://cdn.skypack.dev/three@0.137";
import { MapControls } from "https://cdn.skypack.dev/three-stdlib@2.8.5/controls/OrbitControls";

// // import { RGBELoader } from "https://cdn.skypack.dev/three-stdlib@2.8.5/loaders/RGBELoader";
// // import { Int8Attribute } from "three";

import { GLTFLoader } from "https://cdn.skypack.dev/three-stdlib@2.8.5/loaders/GLTFLoader";
import { GUI } from "https://cdn.skypack.dev/dat.gui";

import { EffectComposer } from "https://cdn.skypack.dev/three-stdlib@2.8.5/postprocessing/EffectComposer";
import { RenderPass } from "https://cdn.skypack.dev/three-stdlib@2.8.5/postprocessing/RenderPass";
import { UnrealBloomPass } from "https://cdn.skypack.dev/three-stdlib@2.8.5/postprocessing/UnrealBloomPass";

import { TDSLoader } from "https://cdn.skypack.dev/three-stdlib@2.8.5/loaders/TDSLoader";
import { FBXLoader } from "https://cdn.skypack.dev/three-stdlib@2.8.5/loaders/FBXLoader";

// import Stats from "https://cdn.skypack.dev/three-stdlib@2.8.5/libs/stats";
import Stats from "https://cdn.skypack.dev/stats.js.fps";
import { Water } from "https://cdn.skypack.dev/three-stdlib@2.8.5/objects/Water";
import { Sky } from "https://cdn.skypack.dev/three-stdlib@2.8.5/objects/Sky";

let renderer, scene, camera, controls;

init();

// Init
function init() {
  //Scene
  scene = new THREE.Scene();

  //Camera
  camera = new THREE.PerspectiveCamera(
    90,
    window.innerWidth / window.innerHeight,
    1,
    5000
  );
  camera.position.set(0, 400, -800);
  // camera.zoom = 5;
  // camera.position.setZ(30);
  // camera.position.set(1000, 600, 0);
  // camera.position.y = MATH.sin(90) * 500;

  // Renderer
  renderer = new THREE.WebGL1Renderer({
    // canvas: document.querySelector('#bg'),
    alpha: true,
    antialias: true, //bloom ?
  });

  renderer.setSize(innerWidth, innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.physicallyCorrectLights = true;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  // renderer.setClearColorHex( 0xffffff, 1 );

  //Skybox
  // const starGeometry = new THREE.SphereGeometry(3000, 64, 64);
  // const starMaterial = new THREE.MeshStandardMaterial({
  //   map: new THREE.TextureLoader().load("assets/minimalisticSky.jpg"),
  //   side: THREE.BackSide,
  //   transparent: true,
  // });
  // const starMesh = new THREE.Mesh(starGeometry, starMaterial);
  // window.starMesh = starMesh;
  // scene.add(starMesh);

  // OrbtiControls
  controls = new MapControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  // controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.minDistance = 100;
  controls.maxDistance = 800;
  controls.maxPolarAngle = Math.PI / 2;
  controls.keys = {
    LEFT: "ArrowLeft", //left arrow
    UP: "ArrowUp", // up arrow
    RIGHT: "ArrowRight", // right arrow
    BOTTOM: "ArrowDown", // down arrow
  };
  controls.keyPanSpeed = 50;
  controls.listenToKeyEvents(window);

  // Light
  const pointLight = new THREE.PointLight(0xfffdee, 300, 3000, 1);
  pointLight.position.set(-500, 500, 500);
  pointLight.casTShadow = true;
  scene.add(pointLight);

  const ambientLight = new THREE.AmbientLight(0x222222, 3);
  scene.add(ambientLight);

  //Events
  window.addEventListener("resize", () => {
    onWindowResize;
    bloomComposer.setSize(window.innerWidth, window.innerHeight);
  });

  //Gridhelper
  const size = 3000;
  const divisions = 10;

  const gridHelper = new THREE.GridHelper(size, divisions);
  // gridHelper.position(0,10,0);
  scene.add(gridHelper);
  //GUI
  // const gui = new GUI();
  // gui.add( gridHelper, 'visible' );r
  // const gui = new GUI();
  // const params = {
  //   exposure: 1,
  //   bloomStrength: 2.5,
  //   bloomThreshold: 0.95,
  //   bloomRadius: 0.5,
  //   rotationSpeed: 1,
  //   orbitSpeed: 1,
  // };
  // window.params = params;
  // gui
  //   .add(params, "orbitSpeed", 0.0, 5)
  //   .step(0.01)
  //   .onChange(function (value) {
  //     window.params.orbitSpeed = Number(value);
  //   }

  //Add Sun
  ///Add sun as post-processed object (bloom effects9)
  const renderScene = new RenderPass(scene, camera);
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5,
    0.4,
    0.85
  );
  bloomPass.threshold = 0.5;
  bloomPass.strength = 1.5; //intensity of glow
  bloomPass.radius = 0.1;
  // bloomPass.exposure = 0.1;
  const bloomComposer = new EffectComposer(renderer);
  bloomComposer.setSize(window.innerWidth, window.innerHeight);
  bloomComposer.renderToScreen = true;
  bloomComposer.addPass(renderScene);
  bloomComposer.addPass(bloomPass);

  //sun object //not Texture
  const color = new THREE.Color("#FDB813");
  const geometry = new THREE.IcosahedronGeometry(30, 15);
  const material = new THREE.MeshBasicMaterial({ color: color });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(-500, 500, 500);
  window.bloomComposerSun = bloomComposer;
  window.bloomPass = bloomPass;
  scene.add(sphere);

  //add Waterd
  const water = addWater();
  scene.add(water);
  window.water = water;

  //Add Main Objects
  // scene.add( createSimple());
  scene.add(createFantasy());

  //loadData
  // scene.add( createMap());

  animate();
}

var t = 0;
// Animation Function
function animate() {
  // starMesh.rotation.y += -0.0001;

  t += 0.01;

  //EarthGroup Rotation
  // window.planets.earthGroup.getObjectByName("earth").rotation.y +=
  //   0.002 * window.params.rotationSpeed;
  // window.planets.saturn.rotation.y += 0.002 * window.params.rotationSpeed;

  //Position 2D
  // window.planets.mars.position.x =
  //   600 * Math.cos(0.05 * t * window.params.orbitSpeed) + 0;
  // window.planets.mars.position.z =
  //   600 * Math.sin(0.05 * t * window.params.orbitSpeed) + 0;





  requestAnimationFrame(animate);
  controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
  render();

  
}

// Render Function
function render() {
//water Renderer
  const time = performance.now() * 0.001;
  window.water.material.uniforms[ 'time' ].value += 1.0 / 60.0;
  renderer.render(scene, camera);

  window.bloomComposerSun.render(); //durch promise asynchron und deshalb nicht abgespeichert
  renderer.setClearColor("rgb(	76, 168, 230)", 0.5); //renderer
}

//Resize Function
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function createSimple() {
  const geometry = new THREE.PlaneBufferGeometry(2160, 1080, 128, 128);

  const texture = new THREE.TextureLoader().load("assets/heightmapExample.jpg");

  //material
  const material = new THREE.MeshStandardMaterial({
    // color: 0xffffff,
    map: texture,
    // side: THREE.DoubleSide,
    displacementMap: texture,
    displacementScale: 100,
    //     transparent: true,
    //     opacity: 0.5,j
    // sheen: 1,
    // color: 0xffff00,
    // side: THREE.DoubleSide,
  });

  //plane
  const plane = new THREE.Mesh(geometry, material);
  plane.rotation.x = -Math.PI / 2;
  plane.rotation.z = Math.PI / 2;
  return plane;
}

function createFantasy() {
  const geometry = new THREE.PlaneBufferGeometry(1640, 2360, 128, 128);

  const distMap = new THREE.TextureLoader().load("assets/fantasyHeight.png");
  const texture = new THREE.TextureLoader().load("assets/fantasyMap.png");

  //material
  const material = new THREE.MeshStandardMaterial({
    // color: 0xffffff,
    map: texture,
    // side: THREE.DoubleSide,
    displacementMap: distMap,
    displacementScale: 300,
    //     transparent: true,
    //     opacity: 0.5,j
    // sheen: 1,
    // color: 0xffff00,
    // side: THREE.DoubleSide,
  });

  //plane
  const plane = new THREE.Mesh(geometry, material);
  plane.rotation.x = -Math.PI / 2;
  plane.rotation.z = Math.PI / 2;
  return plane;
}

function addWater() {

  //Water
  let water;

  const waterGeometry = new THREE.PlaneGeometry(1640, 2360);

  water = new Water(waterGeometry, {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: new THREE.TextureLoader().load(
      "assets/waternormals.jpg",
      function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      }
    ),
    sunDirection: new THREE.Vector3(),
    sunColor: 0xffffff,
    waterColor: 0x001e0f,
    distortionScale: 3.7,
    fog: scene.fog !== undefined,
  });
  water.rotation.x = -Math.PI /2 ;
  water.rotation.z = Math.PI / 2;
  water.position.set(0, 30, 0);

  // water.rotation.x = -Math.PI / 2;

  return water;

}

// function addRiverWater() {

//   //Water
//   let water;

//   const waterGeometry = new THREE.PlaneGeometry(1640, 2360);

//   water = new Water(waterGeometry, {
//     textureWidth: 512,
//     textureHeight: 512,
//     waterNormals: new THREE.TextureLoader().load(
//       "textures/waternormals.jpg",
//       function (texture) {
//         texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
//       }
//     ),
//     sunDirection: new THREE.Vector3(),
//     sunColor: 0xffffff,
//     waterColor: 0x001e0f,
//     distortionScale: 3.7,
//     fog: scene.fog !== undefined,
//   });
//   water.rotation.x = -Math.PI /2 *1.1;
//   water.rotation.z = Math.PI / 2;
//   water.position.set(0, 15, 0);

//   // water.rotation.x = -Math.PI / 2;

//   return water;

// }


// //saturn Placeholder
// function addSaturnPlaceholder() {
//   var sphere = new THREE.Object3D();
//   sphere.name = "saturnPlaceholder";
//   sphere.position.set(0, 0, 1200);
//   return sphere;
// }

// //Saturn
// async function addSaturn() {
//   var textures = {
//     // thanks to https://free3d.com/user/ali_alkendi !
//     // bump: await new THREE.TextureLoader().loadAsync("assets/marsbump.jpg"),
//     map: await new THREE.TextureLoader().loadAsync("assets/saturnmap.jpg"),
//     // planeTrailMask: await new TextureLoader().loadAsync("assets/mask.png"),
//   };

//   // Important to know!
//   // textures.map.encoding = sRGBEncoding;

//   var sphere = new THREE.Mesh(
//     new THREE.SphereGeometry(65, 32, 32),
//     new THREE.MeshStandardMaterial({
//       map: textures.map,
//       roughness: 0,
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
//   sphere.name = "saturn";
//   sphere.position.set(0, 0, 1200);

//   return sphere;
// }

// //Saturn ring
// async function addSaturnRing() {
//   const texture = new THREE.TextureLoader().load("assets/saturnring.png");
//   const geometry = new THREE.RingGeometry(70, 180, 64);
//   var pos = geometry.attributes.position;
//   var v3 = new THREE.Vector3();
//   for (let i = 0; i < pos.count; i++) {
//     v3.fromBufferAttribute(pos, i);
//     geometry.attributes.uv.setXY(i, v3.length() < 80 ? 0 : 1, 1);
//   }
//   const material = new THREE.MeshBasicMaterial({
//     map: texture,
//     color: 0xffffff,
//     side: THREE.DoubleSide,
//     transparent: true,
//     opacity: 0.5,
//     // sheen: 1,
//     // sheenRoughness: 0.75,
//     // sheenColor: new THREE.Color("#ff8a00").convertSRGBToLinear(),
//   });
//   const mesh = new THREE.Mesh(geometry, material);

//   var saturnRing = new THREE.Mesh(geometry, material);
//   saturnRing.rotation.x += (Math.PI / 2) * 1.2;
//   saturnRing.name = "saturnRing";
//   return saturnRing;
// }

// // Thanks for the deathstar!
// // https://sketchfab.com/3d-models/death-star-star-wars-3d5f01485e9e4e8b9d995d7764341afe

// //Circles
// // function planetCircle(oTorus, aRadius) {
// //   let materialCircle = new THREE.MeshStandardMaterial({ color: 0xffff00 });
// //   // let material = new THREE.MeshPhysicalMaterial({
// //   //   color: 0xffff00
// //   //   // sheen: 1,
// //   //   // sheenRoughness: 0.75,
// //   //   // sheenColor: new THREE.Color("0xffff00").convertSRGBToLinear(),
// //   //   // clearcoat: 0.5,
// //   // })

// //   let geometry = new THREE.TorusGeometry(aRadius, 3, 5, 50, -1);
// //   oTorus = new THREE.Mesh(geometry, materialCircle);
// //   oTorus.rotation.x += Math.PI / 2;
// //   // oTorus.material = darkMaterial;
// //   scene.add(oTorus);
// //   return oTorus;
// // }

// function drawCircle(radius, color, lineWidth) {
//   var points = [];

//   // 360 full circle will be drawn clockwise
//   for (let i = 0; i <= 360; i++) {
//     points.push(
//       Math.sin(i * (Math.PI / 180)) * radius,
//       Math.cos(i * (Math.PI / 180)) * radius,
//       0
//     );
//   }

//   var geometry = new THREE.LineGeometry();
//   geometry.setPositions(points);

//   var material = new THREE.LineMaterial({
//     color: color,
//     linewidth: lineWidth,
//   });

//   let line = new THREE.Line2(geometry, material);
//   //line.computeLineDistances();

//   scene.add(line);
// }

// async function addISS() {
//   // const spaceStation = (await new GLTFLoader().loadAsync("assets/spacestation/isscombined.3ds")).scene.children[0];
//   var loader = new THREE.TextureLoader();
//   var normal = loader.load("assets/greycolor.png");
//   var loader = new TDSLoader();
//   const spacestation = await loader.loadAsync(
//     "assets/spacestation/isscombined.3ds"
//   );
//   spacestation.position.set(0, 0, 65);
//   spacestation.name = "ISS";
//   spacestation.rotation.y = (Math.PI / 2) * 1.3;
//   //  spacestation.scale( 5, 5 , 5 );
//   return spacestation;

//   //     var loader = new THREE.TextureLoader();
//   //     var normal = loader.load('assets/greycolor.png');
//   //     var loader = new TDSLoader();
//   //     loader.load('assets/spacestation/isscombined.3ds', function (object) {
//   //       object.traverse(function (child) {
//   //         if (child instanceof THREE.Mesh) {
//   //           child.material.normalMap = normal;
//   //         }
//   //       });
//   //       scene.add(object);
//   //     });
// }
