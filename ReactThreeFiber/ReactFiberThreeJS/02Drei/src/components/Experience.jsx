import { useFrame } from '@react-three/fiber'
import {useRef} from 'react'
import { OrbitControls, TransformControls, PivotControls, Html, Text, Float, MeshReflectorMaterial } from '@react-three/drei'
import "@fontsource/roboto"



const Experience = () => {

  

  const cubeRef= useRef()
  const sphereRef= useRef()
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
  
    <OrbitControls makeDefault/>
    <directionalLight position={[1,2,3]} color="red" intensity={1.5}/>
    <ambientLight intensity={0.5} />

      <group ref={groupRef}>

        <PivotControls anchor={[0,0,0]} depthTest={false}
        lineWidth={4}
        axisColors={['#9381ff', '#ff4d6d', '#7ae582']}
        scale={100}
        fixed={true}
        >
          
          <mesh position-x={-2} ref={sphereRef}>
              <sphereGeometry />
              <meshStandardMaterial color="orange" />
              <Html position={[1,2,0]}
              wrapperClass="label"
              center
              distanceFactor={6}
              occlude={[sphereRef, cubeRef ]}
              >Sphere</Html>
          </mesh>
        </PivotControls>

          

          <mesh scale={1.5} position-x={2} rotation-y={Math.PI * 0.25} ref={cubeRef}>
              <boxGeometry scale={1.5} />
              <meshStandardMaterial color="mediumpurple" wireframe={false}/>
          </mesh>

        <TransformControls object={cubeRef} mode="rotate"/>
      

      </group>

      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
          <planeGeometry />
        <MeshReflectorMaterial resolution={512} blur={[1000, 1000]} mixBlur={.5} mirror={.5} color="red"/>
      </mesh>

    <Float
      speed={5}
      floatIntensity={2}
    >
      <Text
        fontSize={1}
        position={[1,1,1]}
        color="red"
        rotation-y={-Math.PI * 0.5} 
        maxWidth={1}
        textAlign="center" 
      >3D Text

      <MeshReflectorMaterial />

      </Text>
      </Float>
    
    </>
  )
}

export default Experience