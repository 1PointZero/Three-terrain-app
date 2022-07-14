import "./style.css";
// import * as THREE from "three";
// import { OrbitControls, MapControls} from "https://cdn.skypack.dev/three-stdlib@2.8.5/controls/OrbitControls"; //usefull
// import { MapControls } from 'three-stdlib/controls/OrbitControls' //nicht gedownloaded die beispiele
// //unused packages

// import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
// import { MapControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';

//alternativ
import * as THREE from "https://cdn.skypack.dev/three@0.137";
import { MapControls } from "https://cdn.skypack.dev/three-stdlib@2.8.5/controls/OrbitControls";

// // import { RGBELoader } from "https://cdn.skypack.dev/three-stdlib@2.8.5/loaders/RGBELoader";
// // import { Int8Attribute } from "three";
import { GLTFLoader } from "https://cdn.skypack.dev/three-stdlib@2.8.5/loaders/GLTFLoader";
import { GUI } from "https://cdn.skypack.dev/dat.gui";

import { EffectComposer } from "https://cdn.skypack.dev/three-stdlib@2.8.5/postprocessing/EffectComposer";
import { RenderPass } from "https://cdn.skypack.dev/three-stdlib@2.8.5/postprocessing/RenderPass";
import { UnrealBloomPass } from "https://cdn.skypack.dev/three-stdlib@2.8.5/postprocessing/UnrealBloomPass";

let renderer, scene, camera, controls;

init();
// animate();

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
  camera.position.set(800, 200, 0);
  // camera.position.setZ(30);
  // camera.position.set(1000, 600, 0);

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
  const starGeometry = new THREE.SphereGeometry(3000, 64, 64);
  const starMaterial = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load("assets/milkywayBackground.jpg"),
    side: THREE.BackSide,
    transparent: true,
  });
  const starMesh = new THREE.Mesh(starGeometry, starMaterial);
  window.starMesh = starMesh;
  scene.add(starMesh);

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
  const pointLight = new THREE.PointLight(0xfffdee, 800, 3000);
  pointLight.position.set(0, 0, 0);
  pointLight.casTShadow = true;
  scene.add(pointLight);

  const ambientLight = new THREE.AmbientLight(0x222222, 0.3);
  scene.add(ambientLight);

  //Events

  window.addEventListener("resize", () => {
    onWindowResize;
    bloomComposer.setSize(window.innerWidth, window.innerHeight);
  });



  //GUI
  // const gui = new GUI();
  // gui.add( gridHelper, 'visible' );r

  const gui = new GUI();

  const params = {
    exposure: 1,
    bloomStrength: 2.1,
    bloomThreshold: 0.95,
    bloomRadius: 0.1,
    rotationSpeed: 1,
    orbitSpeed: 1,
  };

  window.params = params;

  gui.add(params, "exposure", 0.1, 2).onChange(function (value) {
    renderer.toneMappingExposure = Math.pow(value, 4.0);
  });

  gui.add(params, "bloomThreshold", 0.0, 1).onChange(function (value) {
    window.bloomPass.threshold = Number(value);
  });

  gui.add(params, "bloomStrength", 0.0, 5.0).onChange(function (value) {
    window.bloomPass.strength = Number(value);
  });

  gui
    .add(params, "bloomRadius", 0.0, 1.0)
    .step(0.01)
    .onChange(function (value) {
      window.bloomPass.radius = Number(value);
    });

  gui
    .add(params, "rotationSpeed", 0.0, 5)
    .step(0.01)
    .onChange(function (value) {
      window.params.rotationSpeed = Number(value);
    });

  gui
    .add(params, "orbitSpeed", 0.0, 5)
    .step(0.01)
    .onChange(function (value) {
      window.params.orbitSpeed = Number(value);
    });


  //Add Planets


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
  bloomPass.radius = 0.01;
  // bloomPass.exposure = 0.1;
  const bloomComposer = new EffectComposer(renderer);
  bloomComposer.setSize(window.innerWidth, window.innerHeight);
  bloomComposer.renderToScreen = true;
  bloomComposer.addPass(renderScene);
  bloomComposer.addPass(bloomPass);

  //sun object //not Texture
  const color = new THREE.Color("#FDB813");
  const geometry = new THREE.IcosahedronGeometry(100, 15);
  const material = new THREE.MeshBasicMaterial({ color: color });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(0, 0, 0);
  window.bloomComposerSun = bloomComposer;
  window.bloomPass = bloomPass;
  scene.add(sphere);

  //load Planets
  var aPlanets = [];
  window.planets = {};

  const promiseJupiter = addJupiter();
  const promiseSun = addSun();
  const promiseMars = addMars();
  const promiseEarth = addEarth();
  const promiseMoon = addMoon();
  const promiseSaturn = addSaturn();
  const promiseSaturnRing = addSaturnRing();

  aPlanets.push(promiseSun);
  aPlanets.push(promiseMars);
  aPlanets.push(promiseJupiter);
  aPlanets.push(promiseEarth);
  aPlanets.push(promiseMoon);
  aPlanets.push(promiseSaturn);
  aPlanets.push(promiseSaturnRing);

  Promise.all(aPlanets).then((aResponse) => {
    // window.planets["sun"] = aResponse[0];
    window.planets["mars"] = aResponse[1];
    window.planets["jupiter"] = aResponse[2];

    window.planets["earth"] = aResponse[3];
    window.planets["earthGroup"] = addEarthPlaceholder();
    window.planets.earthGroup.add(aResponse[4]);

    window.planets.earth.add(addEarthClouds());

    window.planets["saturn"] = aResponse[5];
    window.planets["saturnRingGroup"] = addSaturnPlaceholder();
    window.planets.saturnRingGroup.add(aResponse[6]);

    //sun einbauen
    // scene.add(window.planets.sun);
    // window.planets["sunBloom"] = addSunBloom();
    // scene.add( window.planets.sunBloom );

    scene.add(window.planets.mars);
    scene.add(window.planets.jupiter);
    scene.add(window.planets.earth);
    scene.add(window.planets.earthGroup);
    scene.add(window.planets.saturn);
    scene.add(window.planets.saturnRingGroup);

    //Zusatz nicht asynchron
    // window.planets.earthGroup["earthClouds"] = addEarthClouds();
    // window.planets.earthGroup[]

    animate();
  });

  // planetCircle();
  // var torusEarth;
  // torusEarth = planetCircle(torusEarth, 400);
  // window.torusEarth = torusEarth;

  // var torusJupiter;
  // torusJupiter = planetCircle(torusJupiter, 900);
  // window.torusJupiter = torusJupiter;

  // var torusMars;
  // torusMars = planetCircle(torusMars, 600);
  // window.torusMars = torusMars;

  // var torusSaturn;
  // torusSaturn = planetCircle(torusSaturn, 1200);
  // window.torusSaturn = torusSaturn;
}

var t = 0;
// Animation Function
function animate() {
  //Graphic Effects
  // camera.layers.set(1);

  // bloomComposer.render();

  starMesh.rotation.y += -0.0001;

  //Planet Movements
  t += 0.01;

  //Rotation
  window.planets.mars.rotation.y += 0.001 * window.params.rotationSpeed;
  // window.planets.sun.rotation.y += 0.001;
  window.planets.jupiter.rotation.y += 0.001 * window.params.rotationSpeed;
  window.planets.earthGroup.rotation.y += 0.001 * window.params.rotationSpeed;
  window.planets.earth.rotation.y += 0.002 * window.params.rotationSpeed;
  window.planets.saturn.rotation.y += 0.002 * window.params.rotationSpeed;
  // window.planets.saturnGroup.getObjectByName("saturn").rotation.y += 0.0005; //moon is rotation locked
  // window.planets.earthGroup.getObjectByName("earthClouds").rotation.y += 0.0005; //moon is rotation locked

  //Torus /Schweif
  // window.torusEarth.rotation.z = 0.1 * t + Math.PI / 2; //earth speed als konstante anlegen
  // window.torusMars.rotation.z = 0.05 * t;
  // window.torusJupiter.rotation.z = 0.03 * t + Math.PI / 2;
  // window.torusSaturn.rotation.z = 0.02 * t + Math.PI;

  //Position 2D
  window.planets.mars.position.x =
    600 * Math.cos(0.05 * t * window.params.orbitSpeed) + 0;
  window.planets.mars.position.z =
    600 * Math.sin(0.05 * t * window.params.orbitSpeed) + 0;

  window.planets.earth.position.x =
    400 * Math.cos(0.1 * t * window.params.orbitSpeed + Math.PI / 2) + 0;
  window.planets.earth.position.z =
    400 * Math.sin(0.1 * t * window.params.orbitSpeed + Math.PI / 2) + 0;
  window.planets.earthGroup.position.x =
    400 * Math.cos(0.1 * t * window.params.orbitSpeed + Math.PI / 2) + 0;
  window.planets.earthGroup.position.z =
    400 * Math.sin(0.1 * t * window.params.orbitSpeed + Math.PI / 2) + 0;

  // window.planets.earthGroup.getObjectByName("moon").position.x = 400*Math.cos(0.3*t + Math.PI/2) + 0;
  // window.planets.earthGroup.getObjectByName("moon").position.z = 400*Math.sin(0.3*t + Math.PI/2) + 0;

  window.planets.jupiter.position.x =
    900 * Math.cos(0.03 * t * window.params.orbitSpeed + Math.PI / 2) + 0;
  window.planets.jupiter.position.z =
    900 * Math.sin(0.03 * t * window.params.orbitSpeed + Math.PI / 2) + 0;

  window.planets.saturn.position.x =
    1200 * Math.cos(0.02 * t * window.params.orbitSpeed + Math.PI) + 0;
  window.planets.saturn.position.z =
    1200 * Math.sin(0.02 * t * window.params.orbitSpeed + Math.PI) + 0;

  window.planets.saturnRingGroup.position.x =
    1200 * Math.cos(0.02 * t * window.params.orbitSpeed + Math.PI) + 0;
  window.planets.saturnRingGroup.position.z =
    1200 * Math.sin(0.02 * t * window.params.orbitSpeed + Math.PI) + 0;

  requestAnimationFrame(animate);
  controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
  render();

  window.bloomComposerSun.render(); //durch promise asynchron und deshalb nicht abgespeichert
}

// Render Function
function render() {
  renderer.render(scene, camera);
}

//Resize Function
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

//Mars
async function addMars() {
  var textures = {
    // thanks to https://free3d.com/user/ali_alkendi !
    bump: await new THREE.TextureLoader().loadAsync("assets/marsbump.jpg"),
    map: await new THREE.TextureLoader().loadAsync("assets/marsmap.jpg"),
    // spec: await new THREE.TextureLoader().loadAsync("assets/marsmap.jpg"),
    // planeTrailMask: await new TextureLoader().loadAsync("assets/mask.png"),
  };

  // Important to know!
  // textures.map.encoding = sRGBEncoding;
  var mars = new THREE.Mesh(
    new THREE.SphereGeometry(45, 32, 32),
    new THREE.MeshPhysicalMaterial({
      toneMapped: true,
      map: textures.map,
      // roughnessMap: textures.spec,
      bumpMap: textures.bump,
      bumpScale: 0.3,
      sheen: 1,
      sheenRoughness: 0.5,
      sheenColor: new THREE.Color("#ff8a00").convertSRGBToLinear(),
      clearcoat: 0.5,
    })
  );
  mars.sunEnvIntensity = 0.4;
  mars.moonEnvIntensity = 0.1;
  mars.rotation.y += Math.PI * 1.25;
  mars.receiveShadow = true;
  mars.position.set(0, 0, 500);

  return mars;
}

//Sun
async function addSun() {
  var textures = {
    // thanks to https://free3d.com/user/ali_alkendi !
    // bump: await new THREE.TextureLoader().loadAsync("assets/marsbump.jpg"),
    map: await new THREE.TextureLoader().loadAsync("assets/sunmap.jpg"),
    spec: await new THREE.TextureLoader().loadAsync("assets/sunmap.jpg"),
    // planeTrailMask: await new TextureLoader().loadAsync("assets/mask.png"),
  };

  // Important to know!
  // textures.map.encoding = sRGBEncoding;

  var sphere = new THREE.Mesh(
    new THREE.SphereGeometry(120, 32, 32),
    new THREE.MeshBasicMaterial({
      map: textures.map,
      roughnessMap: textures.spec,
      // bumpMap: textures.bump,
      // bumpScale: 0.4,
      sheen: 1,
      sheenRoughness: 0.75,
      shininess: 10,
      sheenColor: new THREE.Color("#ff8a00").convertSRGBToLinear(),
      clearcoat: 0.5,
      shininess: 1,
    })
  );
  // sphere.sunEnvIntensity = 0.4;
  // sphere.moonEnvIntensity = 0.1;
  sphere.rotation.y += Math.PI * 1.25;
  sphere.receiveShadow = true;
  sphere.position.set(0, 0, 0);

  return sphere;
}

//bloom sun
function addSunBloom() {
  const renderScene = new RenderPass(scene, camera);
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5,
    0.4,
    0.85
  );
  // bloomPass.threshold = 1;
  // bloomPass.strength = 1; //intensity of glow
  // bloomPass.radius = 0;

  bloomPass.threshold = params.bloomThreshold;
  bloomPass.strength = params.bloomStrength;
  bloomPass.radius = params.bloomRadius;

  // bloomPass.expose = 1;
  const bloomComposer = new EffectComposer(renderer);
  // bloomComposer.setSize(window.innerWidth, window.innerHeight);
  bloomComposer.setSize(512, 512);
  bloomComposer.renderToScreen = true;
  bloomComposer.addPass(renderScene);
  bloomComposer.addPass(bloomPass);

  //sun object
  const color = new THREE.Color("#FDB813");
  const geometry = new THREE.IcosahedronGeometry(1, 15);
  const material = new THREE.MeshBasicMaterial({ color: color });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(0, 0, 0);

  window.bloomComposerSun = bloomComposer;
  return sphere;
}

//Jupiter
async function addJupiter() {
  var textures = {
    // thanks to https://free3d.com/user/ali_alkendi !
    // bump: await new THREE.TextureLoader().loadAsync("assets/marsbump.jpg"),
    map: await new THREE.TextureLoader().loadAsync("assets/jupitermap.jpg"),
    spec: await new THREE.TextureLoader().loadAsync("assets/jupitermap.jpg"),
    // planeTrailMask: await new TextureLoader().loadAsync("assets/mask.png"),
  };

  // Important to know!
  // textures.map.encoding = sRGBEncoding;

  var sphere = new THREE.Mesh(
    new THREE.SphereGeometry(80, 32, 32),
    new THREE.MeshPhysicalMaterial({
      map: textures.map,
      roughnessMap: textures.spec,
      // bumpMap: textures.bump,
      // bumpScale: 0.4,
      // sheen: 1,
      // sheenRoughness: 0.75,
      // sheenColor: new THREE.Color("#ff8a00").convertSRGBToLinear(),
      clearcoat: 0.5,
    })
  );
  sphere.sunEnvIntensity = 0.4;
  sphere.moonEnvIntensity = 0.1;
  sphere.rotation.y += Math.PI * 1.25;
  sphere.receiveShadow = true;
  sphere.position.set(0, 0, 1000);

  return sphere;
}

function addEarthPlaceholder() {
  var sphere = new THREE.Object3D();
  sphere.name = "saturnPlaceholder";
  sphere.position.set(0, 0, 1200);
  return sphere;
}

//Earth
async function addEarth() {
  var textures = {
    // thanks to https://free3d.com/user/ali_alkendi !
    bump: await new THREE.TextureLoader().loadAsync("assets/earthbump.jpg"),
    map: await new THREE.TextureLoader().loadAsync("assets/earthmap.jpg"),
    spec: await new THREE.TextureLoader().loadAsync("assets/earthspec.jpg"),
    // planeTrailMask: await new TextureLoader().loadAsync("assets/mask.png"),
  };

  // Important to know!
  // textures.map.encoding = sRGBEncoding;

  var sphere = new THREE.Mesh(
    new THREE.SphereGeometry(50, 32, 32),
    new THREE.MeshPhysicalMaterial({
      map: textures.map,
      roughnessMap: textures.spec,
      bumpMap: textures.bump,
      bumpScale: 0.6,
      // sheen: 1,
      // sheenRoughness: 0.75,
      // sheenColor: new THREE.Color("#ff8a00").convertSRGBToLinear(),
      clearcoat: 0.1,
    })
  );
  sphere.sunEnvIntensity = 0.4;
  sphere.moonEnvIntensity = 0.1;
  sphere.rotation.y += Math.PI * 1.25;
  sphere.receiveShadow = true;
  sphere.position.set(0, 0, -300);
  sphere.name = "earth";
  return sphere;
}

//earthCLouds
function addEarthClouds() {
  var geometry = new THREE.SphereGeometry(52, 32, 32);
  var material = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load("assets/earthclouds.jpg"),
    side: THREE.DoubleSide,
    opacity: 0.8,
    transparent: true,
    depthWrite: false,
  });
  var cloudMesh = new THREE.Mesh(geometry, material);
  // earthMesh.add(cloudMesh);
  return cloudMesh;
}

//Moon
async function addMoon() {
  var textures = {
    // thanks to https://free3d.com/user/ali_alkendi !
    bump: await new THREE.TextureLoader().loadAsync("assets/moonbump.jpg"),
    map: await new THREE.TextureLoader().loadAsync("assets/moonmap.jpg"),
    spec: await new THREE.TextureLoader().loadAsync("assets/moonmap.jpg"),
    // planeTrailMask: await new TextureLoader().loadAsync("assets/mask.png"),
  };

  // Important to know!
  // textures.map.encoding = sRGBEncoding;

  var sphere = new THREE.Mesh(
    new THREE.SphereGeometry(25, 32, 32),
    new THREE.MeshPhysicalMaterial({
      map: textures.map,
      roughnessMap: textures.spec,
      bumpMap: textures.bump,
      bumpScale: 0.5,
      // sheen: 1,
      // sheenRoughness: 0.75,
      // sheenColor: new THREE.Color("#ff8a00").convertSRGBToLinear(),
      clearcoat: 0.5,
    })
  );
  sphere.sunEnvIntensity = 0.4;
  sphere.moonEnvIntensity = 0.1;
  sphere.rotation.y += Math.PI * 1.25;
  sphere.receiveShadow = true;
  sphere.position.set(0, 0, 150);
  sphere.name = "moon";
  return sphere;
}

//saturn Placeholder
function addSaturnPlaceholder() {
  var sphere = new THREE.Object3D();
  sphere.name = "saturnPlaceholder";
  sphere.position.set(0, 0, 1200);
  return sphere;
}

//Saturn
async function addSaturn() {
  var textures = {
    // thanks to https://free3d.com/user/ali_alkendi !
    // bump: await new THREE.TextureLoader().loadAsync("assets/marsbump.jpg"),
    map: await new THREE.TextureLoader().loadAsync("assets/saturnmap.jpg"),
    spec: await new THREE.TextureLoader().loadAsync("assets/saturnmap.jpg"),
    // planeTrailMask: await new TextureLoader().loadAsync("assets/mask.png"),
  };

  // Important to know!
  // textures.map.encoding = sRGBEncoding;

  var sphere = new THREE.Mesh(
    new THREE.SphereGeometry(65, 32, 32),
    new THREE.MeshStandardMaterial({
      map: textures.map,
      roughnessMap: textures.spec,
      sheen: 1,
      sheenRoughness: 0.75,
      sheenColor: new THREE.Color("#ff8a00").convertSRGBToLinear(),
      clearcoat: 0.5,
    })
  );
  sphere.sunEnvIntensity = 0.4;
  sphere.moonEnvIntensity = 0.1;
  sphere.rotation.y += Math.PI * 1.25;
  sphere.receiveShadow = true;
  sphere.name = "saturn";
  sphere.position.set(0, 0, 1200);

  return sphere;
}

//Saturn ring
async function addSaturnRing() {
  const texture = new THREE.TextureLoader().load("assets/saturnring.png");
  const geometry = new THREE.RingGeometry(70, 180, 64);
  var pos = geometry.attributes.position;
  var v3 = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v3.fromBufferAttribute(pos, i);
    geometry.attributes.uv.setXY(i, v3.length() < 80 ? 0 : 1, 1);
  }
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    color: 0xffffff,
    side: THREE.DoubleSide,
    transparent: true,
  });
  const mesh = new THREE.Mesh(geometry, material);

  var saturnRing = new THREE.Mesh(geometry, material);
  saturnRing.rotation.x += (-Math.PI / 2) * 1.2;
  saturnRing.name = "saturnRing";
  return saturnRing;
}

// Thanks for the deathstar!
// https://sketchfab.com/3d-models/death-star-star-wars-3d5f01485e9e4e8b9d995d7764341afe

//Circles
// function planetCircle(oTorus, aRadius) {
//   let materialCircle = new THREE.MeshStandardMaterial({ color: 0xffff00 });
//   // let material = new THREE.MeshPhysicalMaterial({
//   //   color: 0xffff00
//   //   // sheen: 1,
//   //   // sheenRoughness: 0.75,
//   //   // sheenColor: new THREE.Color("0xffff00").convertSRGBToLinear(),
//   //   // clearcoat: 0.5,
//   // })

//   let geometry = new THREE.TorusGeometry(aRadius, 3, 5, 50, -1);
//   oTorus = new THREE.Mesh(geometry, materialCircle);
//   oTorus.rotation.x += Math.PI / 2;
//   // oTorus.material = darkMaterial;
//   scene.add(oTorus);
//   return oTorus;
// }

function drawCircle(radius, color, lineWidth) {
  var points = [];

  // 360 full circle will be drawn clockwise
  for (let i = 0; i <= 360; i++) {
    points.push(
      Math.sin(i * (Math.PI / 180)) * radius,
      Math.cos(i * (Math.PI / 180)) * radius,
      0
    );
  }

  var geometry = new THREE.LineGeometry();
  geometry.setPositions(points);

  var material = new THREE.LineMaterial({
    color: color,
    linewidth: lineWidth,
  });

  let line = new THREE.Line2(geometry, material);
  //line.computeLineDistances();

  scene.add(line);
}
