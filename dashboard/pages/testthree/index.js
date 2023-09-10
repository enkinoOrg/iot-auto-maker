import * as THREE from 'three';
import { useEffect } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

function App() {
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGL1Renderer({
      canvas: document.querySelector('#bg'),
    });

    scene.background = new THREE.Color(0x4e9fe5);

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.set(10, 2, 0);
    renderer.render(scene, camera);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(-3, 10, -10);
    scene.add(dirLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    ambientLight.position.set(0, 0, 0);
    scene.add(ambientLight);

    const controls = new OrbitControls(camera, renderer.domElement);

    const loader = new GLTFLoader();

    // loader.load("/small-airplane-v3.glb", function (gltf) {
    loader.load('/plane.glb', function (gltf) {
      gltf.scene.scale.set(0.8, 0.8, 0.8);
      scene.add(gltf.scene);
    });

    const resizeWindow = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    };

    window.addEventListener('resize', resizeWindow);

    function animate() {
      requestAnimationFrame(animate);

      // controls.autoRotate = true;
      // controls.autoRotateSpeed = 4.0;

      controls.update();

      renderer.render(scene, camera);
    }

    animate();
  }, []);

  return <canvas id='bg'></canvas>;
}

export default App;
