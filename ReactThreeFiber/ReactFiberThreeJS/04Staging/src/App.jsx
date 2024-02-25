import { Canvas } from "@react-three/fiber"
import Experience from "./components/Experience"
import * as THREE from 'three'

function App() {
 
  const cameraSettings={
    fov: 45,
    near: 0.1,
    far: 200,
    position:[3,2,6],
  }



  return (
      <Canvas
        
          dpr={1}
          camera={cameraSettings}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping ,
            outputEncoding: THREE.LinearEncoding
          }}

        
          >
            {/*<color args={['aqua']} attach="background"/>*/}
        <Experience />
      </Canvas>
  )
}

export default App
