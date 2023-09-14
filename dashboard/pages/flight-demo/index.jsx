import { useEffect, useState } from 'react'
import { Connector, useMqttState, useSubscription } from 'mqtt-react-hooks'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export default function FlightDemo() {
  const [tableData, setTableData] = useState()

  // useEffect(() => {
  //   const getData = async () => {
  //     try {
  //       const res = await fetchTableOneData();
  //       setTableData(res.data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   // 0.1초마다 getData() 함수를 실행
  //   const interval = setInterval(() => {
  //     getData();
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, []);

  useEffect(() => {
    const scene = new THREE.Scene()
    // const camera = new THREE.PerspectiveCamera(
    //   75,
    //   window.innerWidth / window.innerHeight,
    //   0.1,
    //   1000
    // );

    const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 100)

    const renderer = new THREE.WebGL1Renderer({
      // canvas: document.querySelector('#bg')
    })

    scene.background = new THREE.Color(0x4e9fe5)

    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    // camera.position.set(10, 2, 0);
    camera.position.set(10, 0, 20)
    renderer.render(scene, camera)

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444)
    hemiLight.position.set(0, 20, 0)
    scene.add(hemiLight)

    const dirLight = new THREE.DirectionalLight(0xffffff)
    dirLight.position.set(-3, 10, -10)
    scene.add(dirLight)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    ambientLight.position.set(0, 0, 0)
    scene.add(ambientLight)

    const controls = new OrbitControls(camera, renderer.domElement)

    const loader = new GLTFLoader()

    loader.load('/small-airplane-v3.glb', function (gltf) {
      // gltf.scene.scale.set(0.8, 0.8, 0.8);
      gltf.scene.scale.set(1, 1, 1)
      scene.add(gltf.scene)
    })

    const resizeWindow = () => {
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(window.devicePixelRatio)
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.render(scene, camera)
    }

    window.addEventListener('resize', resizeWindow)

    function animate() {
      requestAnimationFrame(animate)
      if (tableData) {
        console.log(tableData)
        scene.rotation.y = tableData.angle_y * (Math.PI / 180)
        scene.rotation.x = tableData.angle_x * (Math.PI / 180)
      }
      controls.update()
      renderer.render(scene, camera)
    }

    // animate();

    // const getData = async () => {
    //   try {
    //     const res = await fetchTableOneData()
    //     // setTableData(res.data);
    //     // requestAnimationFrame(animate);
    //     if (res.data && res.data.length == 1) {
    //       console.log(res.data[0])
    //       scene.rotation.x = res.data[0].angle_x * (Math.PI / 180)
    //       scene.rotation.z = -1 * res.data[0].angle_y * (Math.PI / 180)
    //       controls.update()
    //       renderer.render(scene, camera)
    //     }
    //   } catch (error) {
    //     console.error(error)
    //   }
    // }

    // 0.1초마다 getData() 함수를 실행
    // const interval = setInterval(() => {
    //   getData()
    // }, 100)

    // return () => clearInterval(interval)
  }, [])

  const { client } = useMqttState()
  const { connectionStatus } = useMqttState()
  const { message } = useSubscription('telemetry')

  console.log(message)
  console.log(client)

  return (
    <Connector brokerUrl='ws://192.168.219.141:8080'>
      <canvas id='bg'></canvas>
      <h1>{`Status: ${connectionStatus}`}</h1>
      <div>
        <span>{`Topic: ${message?.topic} - Message: ${message?.message}`}</span>
      </div>
    </Connector>
  )
}
