import * as THREE from 'three'
import {Texture} from "three";

export const orbitalPeriod = (orbitalRadius: number) => {
  // according to Kepler's third law
  return orbitalRadius ** (3 / 2)
}

export const rotationIncrement = (planetRadius: number) => {
  // inspired by formula derived from equating inertial force with the force of gravity and omitting gravity constant (G)
  return planetRadius / (10 * Math.PI)
}

// randomly pick initial position and validate resulting orbital radius
export const getInitialPosition = (planetRadius: number, radiuses: number[][]): [number, number] => {
  const numberOfRetries = 100
  outer:
    for (let i = 0; i < numberOfRetries; i++) {
      // proposed starting point of new planet
      const [x, y] = Array(2).fill(0).map(() => THREE.MathUtils.randFloatSpread(60))
      // resulting orbit radius
      const orbitRadius = Math.sqrt(x ** 2 + y ** 2)
      for (const [someOrbitRadius, somePlanetRadius] of radiuses) {
        // check if trajectories intersect
        if (orbitRadius + planetRadius > someOrbitRadius - somePlanetRadius
          && orbitRadius - planetRadius < someOrbitRadius + somePlanetRadius) {
          console.log("Intersect, check new pair")
          continue outer
        }
      }
      return [x, y]
    }
  // The solar system seems to be crowded
  throw new DOMException("Too many planets")
}

export function generateTexture(): Promise<Texture> {
  return fetch('http://localhost:5000/get-map-url')
    .then(response => response.blob())
    .then(imageBlob => {
      const imgUrl = URL.createObjectURL(imageBlob)
      return new THREE.TextureLoader().load(imgUrl)
    })
    .catch(error => {
      console.log(error)
      return new THREE.TextureLoader().load('/moon.jpg')
    })
}




