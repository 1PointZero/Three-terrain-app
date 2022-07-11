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
  
//  import '../style.css';

//  ( async function venusInit() {
//   let pmrem = new PMREMGenerator(renderer);
//   let envmapTexture = await new RGBELoader()
//     .setDataType(FloatType)
//     .loadAsync("assets/old_room_2k.hdr");  // thanks to https://polyhaven.com/hdris !
//   let envMap = pmrem.fromEquirectangular(envmapTexture).texture;

//   let textures = {
//     // thanks to https://free3d.com/user/ali_alkendi !
//     bump: await new TextureLoader().loadAsync("assets/venusbump.jpg"),
//     map: await new TextureLoader().loadAsync("assets/venusmap.jpg"),
//     spec: await new TextureLoader().loadAsync("assets/venusmap.jpg"),
//     planeTrailMask: await new TextureLoader().loadAsync("assets/mask.png"),
//   };

//   // Important to know!
//   // textures.map.encoding = sRGBEncoding;

//   let sphere = new Mesh(
//     new SphereGeometry(10, 70, 70),
//     new MeshPhysicalMaterial({
//       map: textures.map,
//       roughnessMap: textures.spec,
//       bumpMap: textures.bump,
//       bumpScale: 0.3,
//       envMap,
//       envMapIntensity: 0.4,
//       sheen: 1,
//       sheenRoughness: 0.75,
//       sheenColor: new Color("#ff8a00").convertSRGBToLinear(),
//       clearcoat: 0.5,
//     }),
//   );
//   sphere.sunEnvIntensity = 0.4;
//   sphere.moonEnvIntensity = 0.1;
//   sphere.rotation.y += Math.PI * 1.25;
//   sphere.receiveShadow = true;
//   scene.add(sphere);


//   const ring1 = new Mesh(
//     new RingGeometry(15, 13.5, 80, 1, 0),
//     new MeshPhysicalMaterial({
//       color: new Color("#FFCB8E").convertSRGBToLinear().multiplyScalar(200),
//       roughness: 0.25,
//       envMap,
//       envMapIntensity: 1.8,
//       side: DoubleSide,
//       transparent: true,
//       opacity: 0.35,
//     })
//   );
//   ring1.name = "ring";
//   ring1.sunOpacity = 0.35;
//   ring1.moonOpacity = 0.03;
//   ringsScene.add(ring1);

//   const ring2 = new Mesh(
//     new RingGeometry(16.5, 15.75, 80, 1, 0), 
//     new MeshBasicMaterial({
//       color: new Color("#FFCB8E").convertSRGBToLinear(),
//       transparent: true,
//       opacity: 0.5,
//       side: DoubleSide,
//     })
//   );
//   ring2.name = "ring";
//   ring2.sunOpacity = 0.35;
//   ring2.moonOpacity = 0.1;
//   ringsScene.add(ring2);

//   const ring3 = new Mesh(
//     new RingGeometry(18, 17.75, 80),
//     new MeshBasicMaterial({
//       color: new Color("#FFCB8E").convertSRGBToLinear().multiplyScalar(50),
//       transparent: true,
//       opacity: 0.5,
//       side: DoubleSide,
//     })
//   );
//   ring3.name = "ring";
//   ring3.sunOpacity = 0.35;
//   ring3.moonOpacity = 0.03;
//   ringsScene.add(ring3);

//   // https://sketchfab.com/3d-models/cartoon-plane-f312ec9f87794bdd83630a3bc694d8ea#download
//   // "Cartoon Plane" (https://skfb.ly/UOLT) by antonmoek is licensed under Creative Commons Attribution 
//   // (http://creativecommons.org/licenses/by/4.0/).
//   let plane = (await new GLTFLoader().loadAsync("assets/plane/scene.glb")).scene.children[0];
//   let planesData = [
//     makePlane(plane, textures.planeTrailMask, envMap, scene),
//     makePlane(plane, textures.planeTrailMask, envMap, scene),
//     makePlane(plane, textures.planeTrailMask, envMap, scene),
//     makePlane(plane, textures.planeTrailMask, envMap, scene),
//     makePlane(plane, textures.planeTrailMask, envMap, scene),
//   ];


//   let daytime = true;
//   let animating = false;
//   window.addEventListener("mousemove", (e) => {
//     if(animating) return;
    
//     let anim = [0, 1];

//     if(e.clientX > (innerWidth - 200) && !daytime) {
//       anim = [1, 0];
//     } else if(e.clientX < 200 && daytime) {
//       anim = [0, 1];
//     } else {
//       return;
//     }

//     animating = true;

//     let obj = { t: 0 };
//     anime({
//       targets: obj,
//       t: anim,
//       complete: () => {
//         animating = false;
//         daytime = !daytime;
//       },
//       update: () => {
//         sunLight.intensity = 3.5 * (1-obj.t);
//         moonLight.intensity = 3.5 * obj.t;

//         sunLight.position.setY(20 * (1-obj.t));
//         moonLight.position.setY(20 * obj.t);

//         sphere.material.sheen = (1-obj.t);
//         scene.children.forEach((child) => {
//           child.traverse((object) => {
//             if(object instanceof Mesh && object.material.envMap) {
//               object.material.envMapIntensity = object.sunEnvIntensity * (1-obj.t) + object.moonEnvIntensity * obj.t;
//             }
//           });
//         });
      
//         ringsScene.children.forEach((child, i) => {
//           child.traverse((object) => {
//             object.material.opacity = object.sunOpacity * (1-obj.t) + object.moonOpacity * obj.t;
//           });
//         });

//         // sunBackground.style.opacity = 1-obj.t;
//         // moonBackground.style.opacity = obj.t;
//       },
//       easing: 'easeInOutSine',
//       duration: 500,
//     });
//   });


//   let clock = new Clock();

//   renderer.setAnimationLoop(() => {

//     let delta = clock.getDelta();
//     sphere.rotation.y += delta * 0.05;

//     controls.update();
//     renderer.render(scene, camera);

//     ring1.rotation.x = ring1.rotation.x * 0.95 + mousePos.y * 0.05 * 1.2;
//     ring1.rotation.y = ring1.rotation.y * 0.95 + mousePos.x * 0.05 * 1.2;

//     ring2.rotation.x = ring2.rotation.x * 0.95 + mousePos.y * 0.05 * 0.375;
//     ring2.rotation.y = ring2.rotation.y * 0.95 + mousePos.x * 0.05 * 0.375;

//     ring3.rotation.x = ring3.rotation.x * 0.95 - mousePos.y * 0.05 * 0.275;
//     ring3.rotation.y = ring3.rotation.y * 0.95 - mousePos.x * 0.05 * 0.275;


//     planesData.forEach(planeData => {
//       let plane = planeData.group;
    
//       plane.position.set(0,0,0);
//       plane.rotation.set(0,0,0);
//       plane.updateMatrixWorld();
//       /**
//        * idea: first rotate like that:
//        * 
//        *          y-axis
//        *  airplane  ^
//        *      \     |     /
//        *       \    |    /
//        *        \   |   /
//        *         \  |  /
//        *     angle ^
//        * 
//        * then at the end apply a rotation on a random axis
//        */           
//       planeData.rot += delta * 0.25;
//       plane.rotateOnAxis(planeData.randomAxis, planeData.randomAxisRot); // random axis
//       plane.rotateOnAxis(new Vector3(0, 1, 0), planeData.rot);    // y-axis rotation
//       plane.rotateOnAxis(new Vector3(0, 0, 1), planeData.rad);    // this decides the radius
//       plane.translateY(planeData.yOff);
//       plane.rotateOnAxis(new Vector3(1,0,0), +Math.PI * 0.5);
//     });

//     renderer.autoClear = false;
//     renderer.render(ringsScene, ringsCamera);
//     renderer.autoClear = true;
//   });
// })();