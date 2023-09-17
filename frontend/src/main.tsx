import './style.css'
import * as THREE from 'three'
import {OrbitControls} from 'three/addons/controls/OrbitControls.js'
import AddPlanet from "./AddPlanet.tsx";
import ReactDOM from "react-dom/client";
import React from "react";
import {getInitialPosition, orbitalPeriod, rotationIncrement} from "./utils";


const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg") ?? undefined,
})

const controls = new OrbitControls(camera, renderer.domElement)
const sunRadius = 3


renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
camera.position.setZ(30)

const geometry = new THREE.SphereGeometry(sunRadius, 32, 16)
const material = new THREE.MeshStandardMaterial({color: 0xffffff, wireframe: true})
const sun = new THREE.Mesh(geometry, material)
scene.add(sun)

const pointLight = new THREE.PointLight("#064cd5", 10, 0, 0)
pointLight.position.set(0, 0, 0)
const ambientLight = new THREE.AmbientLight("#ff007f", 0.1)
scene.add(pointLight, ambientLight)

const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(100, 50)
scene.add(lightHelper, gridHelper)

const rotateSun = () => {
  requestAnimationFrame(rotateSun)
  sun.rotation.x += 0.01
  sun.rotation.y += 0.005
  sun.rotation.z += 0.01

  controls.update()

  renderer.render(scene, camera)
}


rotateSun()

// list of [orbitRadius, planetRadius] for each planet
let radiuses: number[][] = [[0, sunRadius]]
export const addPlanet = () => {

  const planetRadius = Math.random() * 2 + 0.5
  const geometry = new THREE.SphereGeometry(planetRadius, 32, 16)
  const material = new THREE.MeshStandardMaterial({color: 0xffffff, wireframe: true})
  const planet = new THREE.Mesh(geometry, material)

  let [x, y] = [0, 0]
  try {
    [x, y] = getInitialPosition(planetRadius, radiuses)
  } catch (e) {
    console.log("***TO MANY PLANETS***")
    return
  }
  console.log("Planet Radius: ", planetRadius)
  console.log("Rotation increment: ", rotationIncrement(planetRadius))

  radiuses.push([Math.sqrt(x ** 2 + y ** 2), planetRadius])
  planet.position.set(x, y, 0)

  const orbitalRadius = Math.sqrt(x ** 2 + y ** 2)
  const orbit = new THREE.Object3D()
  orbit.position.set(0, 0, 0)
  orbit.add(planet)

  const animate = () => {
    requestAnimationFrame(animate);
    // Update the moon's position along its orbit path
    orbit.rotation.z += 1 / orbitalPeriod(orbitalRadius)
    planet.rotation.y += rotationIncrement(planetRadius)
    renderer.render(scene, camera);
  };
  animate()
  scene.add(orbit)
}


const reactRoot = ReactDOM.createRoot(document.getElementById('app'));
reactRoot.render(
  <React.StrictMode>
    <AddPlanet onClick={() => {
      addPlanet()
    }}/>
  </React.StrictMode>,
);