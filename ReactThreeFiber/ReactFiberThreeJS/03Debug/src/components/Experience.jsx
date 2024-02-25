import { useFrame, extend, useThree } from '@react-three/fiber'
import {useRef} from 'react'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import CustomObject from './CustomObject'

extend({OrbitControls})

const Experience = () => {

  const {camera, gl} = useThree()

  const cubeRef= useRef()
  const groupRef= useRef()

  useFrame((state, delta)=>{
    cubeRef.current.rotation.y += delta

    //const angle= state.clock.elapsedTime
    //state.camera.position.x = Math.sin(angle) * 8
    //state.camera.position.z = Math.cos(angle) * 8
    //state.camera.lookAt(0,0,0)
  })

  return (
    <>
    <orbitControls args={[camera, gl.domElement]} />

    <directionalLight position={[1,2,3]} color="red" intensity={1.5}/>
    <ambientLight intensity={0.5} />

      <group ref={groupRef}>

          <mesh position-x={-2}>
              <sphereGeometry />
              <meshStandardMaterial color="orange" />
          </mesh>

          <mesh scale={1.5} position-x={2} rotation-y={Math.PI * 0.25} ref={cubeRef}>
              <boxGeometry scale={1.5} />
              <meshStandardMaterial color="mediumpurple" wireframe={false}/>
          </mesh>

      </group>

      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
          <planeGeometry />
        <meshStandardMaterial color="greenyellow"/>
      </mesh>

      
    
    
    </>
  )
}

export default Experience