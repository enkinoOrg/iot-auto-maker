import { useEffect, useState } from 'react';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default function Airplane({ angle_x, angle_y }) {
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      30,
      window.innerWidth / window.innerHeight,
      1,
      100
    );

    const renderer = new THREE.WebGL1Renderer({
      canvas: document.querySelector('#bg'),
    });

    scene.background = new THREE.Color(0x4e9fe5);

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    // camera.position.set(10, 2, 0);
    camera.position.set(10, 0, 20);
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

    loader.load('/small-airplane-v3.glb', function (gltf) {
      gltf.scene.scale.set(1, 1, 1);
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

    const animate = () => {
      requestAnimationFrame(animate);
      scene.rotation.x = (angle_x * Math.PI) / 180;
      scene.rotation.z = (-angle_y * Math.PI) / 180;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
  }, [angle_x, angle_y]);

  return (
    <div>
      <canvas id='bg'></canvas>
    </div>
  );
}
