import { useFrame} from '@react-three/fiber'
import {useRef} from 'react'
import {OrbitControls, useHelper, softShadows, AccumulativeShadows, RandomizedLight, ContactShadows, Sky} from '@react-three/drei'
import * as THREE from 'three'

/*
softShadows({
  frustum: 3.75,
  size: 0.005,
  near: 9.5,
  samples: 17,
  rings: 11
})
*/

const Experience = () => {

  const directionalLight= useRef()

  useHelper(directionalLight, THREE.DirectionalLightHelper, 1) 

  const cubeRef= useRef()
  const groupRef= useRef()

  useFrame((state, delta)=>{
    
   const time= state.clock.elapsedTime

    cubeRef.current.position.x= 2 + Math.sin(time) 
    cubeRef.current.rotation.y += delta


    //const angle= state.clock.elapsedTime
    //state.camera.position.x = Math.sin(angle) * 8
    //state.camera.position.z = Math.cos(angle) * 8
    //state.camera.lookAt(0,0,0)
  })

  return (
    <>
    
    <OrbitControls />

   { /*  <AccumulativeShadows
        position={[0,-0.99,0]}
        colors="#316d39"
        opacity={0.8}
        frames={Infinity}
        temporal 
        blend={100}
      >
        <RandomizedLight
          position={[1,2,3]}
          intensity={1}
          amount={8}
          radius={1}
          ambient={0.5}
          bias={0.001}
          />
        


  </AccumulativeShadows> */}

  <ContactShadows position={[0,-0.99,0]} />

      <directionalLight 
      position={[1,2,3]} 
      color="red" 
      intensity={1.5} 
      ref={directionalLight} 
      castShadow 
      shadow-mapSize={[1024,1024]}
      shadow-camera-far={10}
      shadow-camera-top={2}
      />
    <ambientLight intensity={0.5} />

    <Sky sunPosition={[1,2,3]}/>

      <group ref={groupRef}>

          <mesh position-x={-2} castShadow>
              <sphereGeometry />
              <meshStandardMaterial color="orange" />
          </mesh>

          <mesh scale={1.5} position-x={2} rotation-y={Math.PI * 0.25} ref={cubeRef} castShadow>
              <boxGeometry scale={1.5} />
              <meshStandardMaterial color="mediumpurple" wireframe={false}/>
          </mesh>

      </group>

      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10} /* receiveShadow*/>
          <planeGeometry />
        <meshStandardMaterial color="greenyellow"/>
      </mesh>

      
    
    
    </>
  )
}

export default Experience