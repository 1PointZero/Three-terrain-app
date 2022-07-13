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
// // import { GUI } from 'https://cdn.skypack.dev/dat.gui';

let renderer, scene, camera, controls;

init();
// animate();

// Init
function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    100,
    window.innerWidth / window.innerHeight,
    1,
    2000
  );
  camera.position.set(400, 200, 0);

  renderer = new THREE.WebGL1Renderer({
    // canvas: document.querySelector('#bg'),
    alpha: true,
  });

  // Scene (Background if alpha of webgl1renderer is not)
  // const starBackground = new THREE.TextureLoader().load( "assets/backgroundStars.jpg" );
  // const starBackground = new THREE.TextureLoader().load( "assets/backgroundStars.jpg" );
  // scene.background = starBackground;

  // Renderer
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

  // camera.position.setZ(30);
  camera.position.set(1000, 600, 0);

  //light
  const sunLight = new THREE.DirectionalLight(
    new THREE.Color("#FFFFFF").convertSRGBToLinear(),
    3.5
  );
  sunLight.position.set(0, 0, 0);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 512;
  sunLight.shadow.mapSize.height = 512;
  sunLight.shadow.camera.near = 0.5;
  sunLight.shadow.camera.far = 100;
  sunLight.shadow.camera.left = -10;
  sunLight.shadow.camera.bottom = -10;
  sunLight.shadow.camera.top = 10;
  sunLight.shadow.camera.right = 10;
  scene.add(sunLight);

  //Controls

  // OrbtiControls
  // MApControls, predefined Control of OrbitCOntrols
  // var MapControls = function ( object, domElement ) {
  //   THREE.OrbitControls.call( this, object, domElement );
  //   this.mouseButtons.LEFT = THREE.MOUSE.PAN;
  //   this.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;
  //   this.touches.ONE = THREE.TOUCH.PAN;
  //   this.touches.TWO = THREE.TOUCH.DOLLY_ROTATE;
  // };
  // THREE.MapControls.prototype = Object.create( THREE.EventDispatcher.prototype );
  // THREE.MapControls.prototype.constructor = THREE.MapControls;

  controls = new MapControls(camera, renderer.domElement);

  controls.target.set(0, 0, 0);
  // controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)
  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.minDistance = 100;
  controls.maxDistance = 500;
  controls.maxPolarAngle = Math.PI / 2;
  controls.keys = {
    LEFT: "ArrowLeft", //left arrow
    UP: "ArrowUp", // up arrow
    RIGHT: "ArrowRight", // right arrow
    BOTTOM: "ArrowDown", // down arrow
  };
  controls.keyPanSpeed = 50;
  controls.listenToKeyEvents(window);

  //World
  // const worldGeometry = new THREE.BoxGeometry(1, 1, 1);
  // worldGeometry.translate(0, 0.5, 0);
  // const worldMaterial = new THREE.MeshPhongMaterial({
  //   color: 0xffffff,
  //   flatShading: true,
  // });

  // for (let i = 0; i < 500; i++) {
  //   const mesh = new THREE.Mesh(worldGeometry, worldMaterial);
  //   mesh.position.x =
  //   // mesh.position.x = Math.random() * 1600 - 800;
  //   // mesh.position.y = 0;
  //   // mesh.position.z = Math.random() * 1600 - 800;
  //   // mesh.scale.x = 20;
  //   // mesh.scale.y = Math.random() * 80 + 10;
  //   // mesh.scale.z = 20;
  //   mesh.color = 0xffffff;
  //   mesh.updateMatrix();
  //   mesh.matrixAutoUpdate = false;
  //   scene.add(mesh);
  // }
  const size = 10000;
  const divisions = 100;
  const gridHelper = new THREE.GridHelper(size, divisions);
  scene.add(gridHelper);

  // Torus Object
  // const geometry = new THREE.TorusGeometry(10, 2, 100, 100);
  // const material = new THREE.MeshBasicMaterial({ color: 0xff6347 });
  // const torus = new THREE.Mesh(geometry, material);

  // scene.add(torus);

  // Light
  const pointLight = new THREE.PointLight(0xff6347);

  pointLight.position.set(5, 5, 5);

  scene.add(pointLight);

  const dirLight1 = new THREE.DirectionalLight(0xffffff);
  dirLight1.position.set(1, 1, 1);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0x002288);
  dirLight2.position.set(-1, -1, -1);
  scene.add(dirLight2);

  const ambientLight = new THREE.AmbientLight(0x222222);
  scene.add(ambientLight);

  window.addEventListener("resize", onWindowResize);

  // const gui = new GUI();
  // gui.add( controls, 'screenSpacePanning' );

  //Add Planets


  
 
//einzlene MEthode
  // addMars().then((mars) => {
  //   window.planets = { "mars": mars } ;
  //   scene.add(window.planets.mars);
  //   // const marsTest = mars;
  //   // const marsTest3 = ({
  //   //   "marsTest3": mars
  //   // });
  //   animate();
  // });

  //PLanenten laden
  var aPlanets = [];
  window.planets = {};

  const promiseEarth = addEarth();
  const promiseJupiter = addJupiter();
  const promiseSun = addSun();
  const promiseMars = addMars();

  aPlanets.push(promiseSun);
  aPlanets.push(promiseMars);
  aPlanets.push(promiseJupiter);
  aPlanets.push(promiseEarth);

  Promise.all(aPlanets ).then(( aResponse ) => {
    window.planets["sun"]  = aResponse[0];
    window.planets["mars"] = aResponse[1];
    window.planets["jupiter"] = aResponse[2];
    window.planets["earth"] = aResponse[3];
    scene.add(window.planets.sun);
    scene.add(window.planets.mars);
    scene.add(window.planets.jupiter);
    scene.add(window.planets.earth);
    animate();
  });


}

// Animation Function
function animate() {
  window.planets.mars.rotation.y += 0.001;
  window.planets.sun.rotation.y += 0.001;
  window.planets.jupiter.rotation.y += 0.001;
  window.planets.earth.rotation.y += 0.001;
  requestAnimationFrame(animate);
  controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
  render();
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

async function addMars() {
  var textures = {
    // thanks to https://free3d.com/user/ali_alkendi !
    bump: await new THREE.TextureLoader().loadAsync("assets/marsbump.jpg"),
    map: await new THREE.TextureLoader().loadAsync("assets/marsmap.jpg"),
    spec: await new THREE.TextureLoader().loadAsync("assets/marsmap.jpg"),
    // planeTrailMask: await new TextureLoader().loadAsync("assets/mask.png"),
  };

  // Important to know!
  // textures.map.encoding = sRGBEncoding;
  var mars = new THREE.Mesh(
    new THREE.SphereGeometry(50, 32, 32),
    new THREE.MeshPhysicalMaterial({
      map: textures.map,
      roughnessMap: textures.spec,
      bumpMap: textures.bump,
      bumpScale: 0.4,
      sheen: 1,
      sheenRoughness: 0.75,
      sheenColor: new THREE.Color("#ff8a00").convertSRGBToLinear(),
      clearcoat: 0.5,
    })
  );
  mars.sunEnvIntensity = 0.4;
  mars.moonEnvIntensity = 0.1;
  mars.rotation.y += Math.PI * 1.25;
  mars.receiveShadow = true;
  mars.position.set(0, 0, 300);

  return mars;
}

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
    new THREE.MeshPhysicalMaterial({
      map: textures.map,
      roughnessMap: textures.spec,
      // bumpMap: textures.bump,
      // bumpScale: 0.4,
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
  sphere.position.set(0, 0, 0);

  return sphere;
}

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
      bumpMap: textures.bump,
      bumpScale: 0.4,
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
  sphere.position.set(0, 0, 500);

  return sphere;
}

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
      // bumpMap: textures.bump,
      // bumpScale: 0.4,
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
  sphere.position.set(0, 0, -300);

  return sphere;
}


// (async function () {
//   renderer.setAnimationLoop(() => {
//    let delta = clock.getDelta();
//     sphere.rotation.y += delta * 0.05;
//     controls.update();
//     renderer.render(scene, camera);
//   });
// })();

// const sunLight = new DirectionalLight(
//   new Color("#FFFFFF").convertSRGBToLinear(),
//   3.5,
// );
// sunLight.position.set(10, 20, 10);
// sunLight.castShadow = true;
// sunLight.shadow.mapSize.width = 512;
// sunLight.shadow.mapSize.height = 512;
// sunLight.shadow.camera.near = 0.5;
// sunLight.shadow.camera.far = 100;
// sunLight.shadow.camera.left = -10;
// sunLight.shadow.camera.bottom = -10;
// sunLight.shadow.camera.top = 10;
// sunLight.shadow.camera.right = 10;
// scene.add(sunLight);

// const moonLight = new DirectionalLight(
//   new Color("#77ccff").convertSRGBToLinear(),
//   0,
// );
// moonLight.position.set(-10, 20, 10);
// moonLight.castShadow = true;
// moonLight.shadow.mapSize.width = 512;
// moonLight.shadow.mapSize.height = 512;
// moonLight.shadow.camera.near = 0.5;
// moonLight.shadow.camera.far = 100;
// moonLight.shadow.camera.left = -10;
// moonLight.shadow.camera.bottom = -10;
// moonLight.shadow.camera.top = 10;
// moonLight.shadow.camera.right = 10;
// scene.add(moonLight);

// // // Create a helper for the shadow camera (optional)
// // const helper = new CameraHelper( light.shadow.camera );
// // scene.add( helper );

// const controls = new OrbitControls(camera, renderer.domElement);
// controls.target.set(0, 0, 0);
// controls.dampingFactor = 0.05;
// controls.enableDamping = true;
// controls.enableRotate = false;

// let mousePos = new Vector2(0,0);

// import {
//     DoubleSide,
//     PCFSoftShadowMap,
//     MeshPhysicalMaterial,
//     TextureLoader,
//     FloatType,
//     PMREMGenerator,
//     Scene,
//     PerspectiveCamera,
//     WebGLRenderer,
//     Color,
//     ACESFilmicToneMapping,
//     sRGBEncoding,
//     Mesh,
//     SphereGeometry,
//     MeshBasicMaterial,
//     Vector2,
//     DirectionalLight,
//     Clock,
//     RingGeometry,
//     Vector3,
//     PlaneGeometry,
//     CameraHelper,
//     Group,
//   } from "https://cdn.skypack.dev/three@0.137";

//   import { RGBELoader } from "https://cdn.skypack.dev/three-stdlib@2.8.5/loaders/RGBELoader";
//   import { OrbitControls } from "https://cdn.skypack.dev/three-stdlib@2.8.5/controls/OrbitControls";
//   import { GLTFLoader } from "https://cdn.skypack.dev/three-stdlib@2.8.5/loaders/GLTFLoader";
//   import anime from 'https://cdn.skypack.dev/animejs@3.2.1';

//  import './style.css';
// // //   import { venusInit } from './src/venus.js';
// //     //  import { jupiterInit } from '../src/jupiter.js';

//   const scene = new Scene();

//   // let sunBackground = document.querySelector(".sun-background");
//   // let moonBackground = document.querySelector(".moon-background");
//   let starBackground = document.querySelector(".star-background");

//   // const ringsScene = new Scene();

//   const camera = new PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 1000);
//   camera.position.set(0, 15, 50);

//   // const ringsCamera = new PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 1000);
//   // ringsCamera.position.set(0, 0, 50);

//   const renderer = new WebGLRenderer({ antialias: true, alpha: true });
//   renderer.setSize(innerWidth, innerHeight);
//   renderer.toneMapping = ACESFilmicToneMapping;
//   renderer.outputEncoding = sRGBEncoding;
//   renderer.physicallyCorrectLights = true;
//   renderer.shadowMap.enabled = true;
//   renderer.shadowMap.type = PCFSoftShadowMap;
//   document.body.appendChild(renderer.domElement);

//   const sunLight = new DirectionalLight(
//     new Color("#FFFFFF").convertSRGBToLinear(),
//     3.5,
//   );
//   sunLight.position.set(10, 20, 10);
//   sunLight.castShadow = true;
//   sunLight.shadow.mapSize.width = 512;
//   sunLight.shadow.mapSize.height = 512;
//   sunLight.shadow.camera.near = 0.5;
//   sunLight.shadow.camera.far = 100;
//   sunLight.shadow.camera.left = -10;
//   sunLight.shadow.camera.bottom = -10;
//   sunLight.shadow.camera.top = 10;
//   sunLight.shadow.camera.right = 10;
//   scene.add(sunLight);

//   const moonLight = new DirectionalLight(
//     new Color("#77ccff").convertSRGBToLinear(),
//     0,
//   );
//   moonLight.position.set(-10, 20, 10);
//   moonLight.castShadow = true;
//   moonLight.shadow.mapSize.width = 512;
//   moonLight.shadow.mapSize.height = 512;
//   moonLight.shadow.camera.near = 0.5;
//   moonLight.shadow.camera.far = 100;
//   moonLight.shadow.camera.left = -10;
//   moonLight.shadow.camera.bottom = -10;
//   moonLight.shadow.camera.top = 10;
//   moonLight.shadow.camera.right = 10;
//   scene.add(moonLight);

//   // // Create a helper for the shadow camera (optional)
//   // const helper = new CameraHelper( light.shadow.camera );
//   // scene.add( helper );

//   const controls = new OrbitControls(camera, renderer.domElement);
//   controls.target.set(0, 0, 0);
//   controls.dampingFactor = 0.05;
//   controls.enableDamping = true;
//   controls.enableRotate = false;

//   let mousePos = new Vector2(0,0);

//         /**
//          * Venus  ------------------------------------------------------------------------------------------
//          */

//   (async function () {
//     let pmrem = new PMREMGenerator(renderer);
//     let envmapTexture = await new RGBELoader()
//       .setDataType(FloatType)
//       .loadAsync("assets/old_room_2k.hdr");  // thanks to https://polyhaven.com/hdris !
//     let envMap = pmrem.fromEquirectangular(envmapTexture).texture;

//     let textures = {
//       // thanks to https://free3d.com/user/ali_alkendi !
//       bump: await new TextureLoader().loadAsync("assets/marsbump.png"),
//       map: await new TextureLoader().loadAsync("assets/marsmap.jpg"),
//       spec: await new TextureLoader().loadAsync("assets/marsmap.jpg"),
//       planeTrailMask: await new TextureLoader().loadAsync("assets/mask.png"),
//     };

//     // Important to know!
//     // textures.map.encoding = sRGBEncoding;

//     let sphere = new Mesh(
//       new SphereGeometry(10, 70, 70),
//       new MeshPhysicalMaterial({
//         map: textures.map,
//         roughnessMap: textures.spec,
//         bumpMap: textures.bump,
//         bumpScale: 0.3,
//         // envMap,
//         // envMapIntensity: 0.4,
//         sheen: 1,
//         sheenRoughness: 0.75,
//         sheenColor: new Color("#ff8a00").convertSRGBToLinear(),
//         clearcoat: 0.5,
//       }),
//     );
//     sphere.sunEnvIntensity = 0.4;
//     sphere.moonEnvIntensity = 0.1;
//     sphere.rotation.y += Math.PI * 1.25;
//     sphere.receiveShadow = true;
//     // sphere.position.x = 50;
//     scene.add(sphere);

//     const ring2 = new Mesh(
//       new RingGeometry(16.5, 15.75, 80, 1, 0),
//       new MeshBasicMaterial({
//         color: new Color("#FFCB8E").convertSRGBToLinear(),
//         transparent: true,
//         opacity: 0.5,
//         side: DoubleSide,
//       })
//     );
//     ring2.name = "ring";
//     ring2.sunOpacity = 0.35;
//     ring2.moonOpacity = 0.1;
//     ringsScene.add(ring2);

//     const ring3 = new Mesh(
//       new RingGeometry(18, 17.75, 80),
//       new MeshBasicMaterial({
//         color: new Color("#FFCB8E").convertSRGBToLinear().multiplyScalar(50),
//         transparent: true,
//         opacity: 0.5,
//         side: DoubleSide,
//       })
//     );
//     ring3.name = "ring";
//     ring3.sunOpacity = 0.35;
//     ring3.moonOpacity = 0.03;
//     ringsScene.add(ring3);

//     // var holder = new THREE.Group();
//     // holder.add(ring3);
//     // scene.add(holder);

//     // https://sketchfab.com/3d-models/cartoon-plane-f312ec9f87794bdd83630a3bc694d8ea#download
//     // "Cartoon Plane" (https://skfb.ly/UOLT) by antonmoek is licensed under Creative Commons Attribution
//     // (http://creativecommons.org/licenses/by/4.0/).
//     let plane = (await new GLTFLoader().loadAsync("assets/plane/scene.glb")).scene.children[0];
//     let planesData = [
//       makePlane(plane, textures.planeTrailMask, envMap, scene),
//       makePlane(plane, textures.planeTrailMask, envMap, scene),
//       makePlane(plane, textures.planeTrailMask, envMap, scene),
//       makePlane(plane, textures.planeTrailMask, envMap, scene),
//       makePlane(plane, textures.planeTrailMask, envMap, scene),
//     ];

//     let daytime = true;
//     let animating = false;
//     window.addEventListener("mousemove", (e) => {
//       if(animating) return;

//       let anim = [0, 1];

//       if(e.clientX > (innerWidth - 200) && !daytime) {
//         anim = [1, 0];
//       } else if(e.clientX < 200 && daytime) {
//         anim = [0, 1];
//       } else {
//         return;
//       }

//       animating = true;

//     renderer.setAnimationLoop(() => {

//       let delta = clock.getDelta();
//       sphere.rotation.y += delta * 0.05;

//       controls.update();
//       renderer.render(scene, camera);

//       ring1.rotation.x = ring1.rotation.x * 0.95 + mousePos.y * 0.05 * 1.2;
//       ring1.rotation.y = ring1.rotation.y * 0.95 + mousePos.x * 0.05 * 1.2;

//       ring2.rotation.x = ring2.rotation.x * 0.95 + mousePos.y * 0.05 * 0.375;
//       ring2.rotation.y = ring2.rotation.y * 0.95 + mousePos.x * 0.05 * 0.375;

//       ring3.rotation.x = ring3.rotation.x * 0.95 - mousePos.y * 0.05 * 0.275;
//       ring3.rotation.y = ring3.rotation.y * 0.95 - mousePos.x * 0.05 * 0.275;

//       planesData.forEach(planeData => {
//         let plane = planeData.group;

//         plane.position.set(0,0,0);
//         plane.rotation.set(0,0,0);
//         plane.updateMatrixWorld();
//         /**
//          * idea: first rotate like that:
//          *
//          *          y-axis
//          *  airplane  ^
//          *      \     |     /
//          *       \    |    /
//          *        \   |   /
//          *         \  |  /
//          *     angle ^
//          *
//          * then at the end apply a rotation on a random axis
//          */
//         planeData.rot += delta * 0.25;
//         plane.rotateOnAxis(planeData.randomAxis, planeData.randomAxisRot); // random axis
//         plane.rotateOnAxis(new Vector3(0, 1, 0), planeData.rot);    // y-axis rotation
//         plane.rotateOnAxis(new Vector3(0, 0, 1), planeData.rad);    // this decides the radius
//         plane.translateY(planeData.yOff);
//         plane.rotateOnAxis(new Vector3(1,0,0), +Math.PI * 0.5);
//       });

//       renderer.autoClear = false;
//       renderer.render(ringsScene, ringsCamera);
//       renderer.autoClear = true;
//     });
//   })();

//         /**
//          * Jupiter  ------------------------------------------------------------------------------------------
//          */

//          (async function () {
//             let pmrem = new PMREMGenerator(renderer);
//             let envmapTexture = await new RGBELoader()
//               .setDataType(FloatType)
//               .loadAsync("assets/old_room_2k.hdr");  // thanks to https://polyhaven.com/hdris !
//             let envMap = pmrem.fromEquirectangular(envmapTexture).texture;

//             let textures = {
//               // thanks to https://free3d.com/user/ali_alkendi !

//               map: await new TextureLoader().loadAsync("assets/jupitermap.jpg"),
//               spec: await new TextureLoader().loadAsync("assets/venusmap.jpg"),
//               planeTrailMask: await new TextureLoader().loadAsync("assets/mask.png"),
//             };

//             // Important to know!
//             // textures.map.encoding = sRGBEncoding;

//             let sphere = new Mesh(
//               new SphereGeometry(10, 70, 70),
//               new MeshPhysicalMaterial({
//                 map: textures.map,
//                 roughnessMap: textures.spec,
//                 // envMap,
//                 // envMapIntensity: 0.4,
//                 sheen: 1,
//                 sheenRoughness: 0.75,
//                 sheenColor: new Color("#ff8a00").convertSRGBToLinear(),
//                 clearcoat: 0.5,
//               }),
//             );
//             sphere.sunEnvIntensity = 0.4;
//             sphere.moonEnvIntensity = 0.1;
//             sphere.rotation.y += Math.PI * 1.25;
//             sphere.receiveShadow = true;
//             sphere.position.x = 30;
//             scene.add(sphere);

//             const ring1 = new Mesh(
//               new RingGeometry(15, 13.5, 80, 1, 0),
//               new MeshPhysicalMaterial({
//                 color: new Color("#FFCB8E").convertSRGBToLinear().multiplyScalar(200),
//                 roughness: 0.25,
//                 envMap,
//                 envMapIntensity: 1.8,
//                 side: DoubleSide,
//                 transparent: true,
//                 opacity: 0.35,
//               })
//             );
//             ring1.name = "ring";
//             ring1.sunOpacity = 0.35;
//             ring1.moonOpacity = 0.03;
//             ringsScene.add(ring1);

//             const ring2 = new Mesh(
//               new RingGeometry(16.5, 15.75, 80, 1, 0),
//               new MeshBasicMaterial({
//                 color: new Color("#FFCB8E").convertSRGBToLinear(),
//                 transparent: true,
//                 opacity: 0.5,
//                 side: DoubleSide,
//               })
//             );
//             ring2.name = "ring";
//             ring2.sunOpacity = 0.35;
//             ring2.moonOpacity = 0.1;
//             ringsScene.add(ring2);

//             const ring3 = new Mesh(
//               new RingGeometry(18, 17.75, 80),
//               new MeshBasicMaterial({
//                 color: new Color("#FFCB8E").convertSRGBToLinear().multiplyScalar(50),
//                 transparent: true,
//                 opacity: 0.5,
//                 side: DoubleSide,
//               })
//             );
//             ring3.name = "ring";
//             ring3.sunOpacity = 0.35;
//             ring3.moonOpacity = 0.03;
//             ringsScene.add(ring3);

//             // var holder = new THREE.Group();
//             // holder.add(ring3);
//             // scene.add(holder);

//             // https://sketchfab.com/3d-models/cartoon-plane-f312ec9f87794bdd83630a3bc694d8ea#download
//             // "Cartoon Plane" (https://skfb.ly/UOLT) by antonmoek is licensed under Creative Commons Attribution
//             // (http://creativecommons.org/licenses/by/4.0/).
//             let plane = (await new GLTFLoader().loadAsync("assets/plane/scene.glb")).scene.children[0];
//             let planesData = [
//               makePlane(plane, textures.planeTrailMask, envMap, scene),
//               makePlane(plane, textures.planeTrailMask, envMap, scene),
//               makePlane(plane, textures.planeTrailMask, envMap, scene),
//               makePlane(plane, textures.planeTrailMask, envMap, scene),
//               makePlane(plane, textures.planeTrailMask, envMap, scene),
//             ];

//             let daytime = true;
//             let animating = false;
//             window.addEventListener("mousemove", (e) => {
//               if(animating) return;

//               let anim = [0, 1];

//               if(e.clientX > (innerWidth - 200) && !daytime) {
//                 anim = [1, 0];
//               } else if(e.clientX < 200 && daytime) {
//                 anim = [0, 1];
//               } else {
//                 return;
//               }

//               animating = true;

//               let obj = { t: 0 };
//               anime({
//                 targets: obj,
//                 t: anim,
//                 complete: () => {
//                   animating = false;
//                   daytime = !daytime;
//                 },
//                 update: () => {
//                   sunLight.intensity = 3.5 * (1-obj.t);
//                   moonLight.intensity = 3.5 * obj.t;

//                   sunLight.position.setY(20 * (1-obj.t));
//                   moonLight.position.setY(20 * obj.t);

//                   sphere.material.sheen = (1-obj.t);
//                   scene.children.forEach((child) => {
//                     child.traverse((object) => {
//                       if(object instanceof Mesh && object.material.envMap) {
//                         object.material.envMapIntensity = object.sunEnvIntensity * (1-obj.t) + object.moonEnvIntensity * obj.t;
//                       }
//                     });
//                   });

//                   ringsScene.children.forEach((child, i) => {
//                     child.traverse((object) => {
//                       object.material.opacity = object.sunOpacity * (1-obj.t) + object.moonOpacity * obj.t;
//                     });
//                   });

//                   // sunBackground.style.opacity = 1-obj.t;
//                   // moonBackground.style.opacity = obj.t;
//                 },
//                 easing: 'easeInOutSine',
//                 duration: 500,
//               });
//             });

//             let clock = new Clock();

//             renderer.setAnimationLoop(() => {

//               let delta = clock.getDelta();
//               sphere.rotation.y += delta * 0.05;

//               controls.update();
//               renderer.render(scene, camera);

//               ring1.rotation.x = ring1.rotation.x * 0.95 + mousePos.y * 0.05 * 1.2;
//               ring1.rotation.y = ring1.rotation.y * 0.95 + mousePos.x * 0.05 * 1.2;

//               ring2.rotation.x = ring2.rotation.x * 0.95 + mousePos.y * 0.05 * 0.375;
//               ring2.rotation.y = ring2.rotation.y * 0.95 + mousePos.x * 0.05 * 0.375;

//               ring3.rotation.x = ring3.rotation.x * 0.95 - mousePos.y * 0.05 * 0.275;
//               ring3.rotation.y = ring3.rotation.y * 0.95 - mousePos.x * 0.05 * 0.275;

//               planesData.forEach(planeData => {
//                 let plane = planeData.group;

//                 plane.position.set(0,0,0);
//                 plane.rotation.set(0,0,0);
//                 plane.updateMatrixWorld();
//                 /**
//                  * idea: first rotate like that:
//                  *
//                  *          y-axis
//                  *  airplane  ^
//                  *      \     |     /
//                  *       \    |    /
//                  *        \   |   /
//                  *         \  |  /
//                  *     angle ^
//                  *
//                  * then at the end apply a rotation on a random axis
//                  */
//                 planeData.rot += delta * 0.25;
//                 plane.rotateOnAxis(planeData.randomAxis, planeData.randomAxisRot); // random axis
//                 plane.rotateOnAxis(new Vector3(0, 1, 0), planeData.rot);    // y-axis rotation
//                 plane.rotateOnAxis(new Vector3(0, 0, 1), planeData.rad);    // this decides the radius
//                 plane.translateY(planeData.yOff);
//                 plane.rotateOnAxis(new Vector3(1,0,0), +Math.PI * 0.5);
//               });

//               renderer.autoClear = false;
//               renderer.render(ringsScene, ringsCamera);
//               renderer.autoClear = true;
//             });
//           })();

//         /**
//          * Saturn  ------------------------------------------------------------------------------------------
//          */
//          (async function () {
//           let pmrem = new PMREMGenerator(renderer);
//           let envmapTexture = await new RGBELoader()
//             .setDataType(FloatType)
//             .loadAsync("assets/old_room_2k.hdr");  // thanks to https://polyhaven.com/hdris !
//           let envMap = pmrem.fromEquirectangular(envmapTexture).texture;

//           let textures = {
//             // thanks to https://free3d.com/user/ali_alkendi !
//             map: await new TextureLoader().loadAsync("assets/saturnmap.jpg"),
//             spec: await new TextureLoader().loadAsync("assets/saturnmap.jpg")
//           };

//           const SaturnGroup = new THREE.Group();

//           // Important to know!
//           // textures.map.encoding = sRGBEncoding;

//           let saturn = new Mesh(
//             new SphereGeometry(10, 70, 70),
//             new MeshPhysicalMaterial({
//               map: textures.map,
//               roughnessMap: textures.spec,
//               // envMap,
//               // envMapIntensity: 0.4,
//               sheen: 1,
//               sheenRoughness: 0.75,
//               sheenColor: new Color("#ff8a00").convertSRGBToLinear(),
//               clearcoat: 0.5,
//             }),
//           );
//           saturn.sunEnvIntensity = 0.4;
//           saturn.moonEnvIntensity = 0.1;
//           saturn.rotation.y += Math.PI * 1.25;
//           saturn.receiveShadow = true;
//           saturn.position.x = 60;

//           group.add( saturn );

//           // const ringSaturn = new Mesh(
//           //   new RingGeometry(15, 13.5, 80, 1, 0),
//           //   new MeshPhysicalMaterial({
//           //     color: new Color("#FFCB8E").convertSRGBToLinear().multiplyScalar(200),
//           //     roughness: 0.25,
//           //     envMap,
//           //     envMapIntensity: 1.8,
//           //     side: DoubleSide,
//           //     transparent: true,
//           //     opacity: 0.35,
//           //   })
//           // );

//           // ringSaturn.name = "ring";
//           // ringSaturn.sunOpacity = 0.35;
//           // ringSaturn.moonOpacity = 0.03;
//           // ringsScene.add( ringSaturn );

//           group.add( ringSaturn );

//           scene.add( saturnGroup );

//           // var holder = new THREE.Group();
//           // holder.add(ring3);
//           // scene.add(holder);

//           let daytime = true;
//           let animating = false;
//           window.addEventListener("mousemove", (e) => {
//             if(animating) return;

//             let anim = [0, 1];

//             if(e.clientX > (innerWidth - 200) && !daytime) {
//               anim = [1, 0];
//             } else if(e.clientX < 200 && daytime) {
//               anim = [0, 1];
//             } else {
//               return;
//             }

//             animating = true;

//             let obj = { t: 0 };
//             anime({
//               targets: obj,
//               t: anim,
//               complete: () => {
//                 animating = false;
//                 daytime = !daytime;
//               },
//               update: () => {
//                 sunLight.intensity = 3.5 * (1-obj.t);
//                 saturn.material.sheen = (1-obj.t);

//                 // sunBackground.style.opacity = 1-obj.t;
//                 // moonBackground.style.opacity = obj.t;
//               },
//               easing: 'easeInOutSine',
//               duration: 500,
//             });
//           });

//           let clock = new Clock();

//           renderer.setAnimationLoop(() => {

//             let delta = clock.getDelta();
//             sphere.rotation.y += delta * 0.05;

//             controls.update();
//             renderer.render(scene, camera);

//             // ringSaturn.rotation.x = ringSaturn.rotation.x * 0.95 + mousePos.y * 0.05 * 1.2;
//             // ringSaturn.rotation.y = ringSaturn.rotation.y * 0.95 + mousePos.x * 0.05 * 1.2;

//           });
//         })();

//         /**
//          * Rest ------------------------------------------------------------------------------------------
//          */

//   function nr() {
//     return Math.random() * 2 - 1;
//   }

//   function makePlane(planeMesh, trailTexture, envMap, scene) {
//     let plane = planeMesh.clone();
//     plane.scale.set(0.001, 0.001, 0.001);
//     plane.position.set(0,0,0);
//     plane.rotation.set(0,0,0);
//     plane.updateMatrixWorld();

//     plane.traverse((object) => {
//       if(object instanceof Mesh) {
//         object.material.envMap = envMap;
//         object.sunEnvIntensity = 1;
//         object.moonEnvIntensity = 0.3;
//         object.castShadow = true;
//         object.receiveShadow = true;
//       }
//     });

//     let trail = new Mesh(
//       new PlaneGeometry(1, 2),
//       new MeshPhysicalMaterial({
//         envMap,
//         envMapIntensity: 3,

//         roughness: 3,
//         metalness: 0,
//         transmission: 1,

//         transparent: true,
//         opacity: 3,
//         alphaMap: trailTexture,
//       })
//     );
//     trail.sunEnvIntensity = 3;
//     trail.moonEnvIntensity = 0.7;
//     trail.rotateX(Math.PI);
//     trail.translateY(1.1);

//     let group = new Group();
//     group.add(plane);
//     group.add(trail);

//     scene.add(group);

//     return {
//       group,
//       yOff: 10.5 + Math.random() * 1.0,
//       rot: Math.PI * 2,  // just to set a random starting point
//       rad: Math.random() * Math.PI * 0.45 + Math.PI * 0.05,
//       randomAxis: new Vector3(nr(), nr(), nr()).normalize(),
//       randomAxisRot: Math.random() * Math.PI * 2,
//     };
//   }

//   window.addEventListener("mousemove", (e) => {
//     let x = e.clientX - innerWidth * 0.5;
//     let y = e.clientY - innerHeight * 0.5;

//     mousePos.x = x * 0.0003;
//     mousePos.y = y * 0.0003;
//   });
