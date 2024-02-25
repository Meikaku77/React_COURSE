# REACT THREE FIBER (FIBER)

- Installation
> npm i three@0.145 @react-three/fiber@8.8

- react-three is a big system. @ means a big system, we call it scope
- You'll have a multiple paths from here
- Later I will install more packages from this scope 
-----
# SYNTAXIS

- In native Threejs we need to have a new instance of mesh, mesh.geometry and mesh.material

~~~js
const mesh = new THREE.Mesh()

mesh.geometry = new THREE.BoxGeometry(1,1,1)
mesh.material = new THREE.MeshBasicMaterial({color: 'red'})

scene.add(mesh)
~~~

- In Fiber looks like this

~~~js
<>
    <mesh>
        <boxGeometry />
        <meshBasicMaterial color="red">
    </mesh>
</>
~~~

- Change position and rotation 
- In Native Three will be

~~~js
mesh.position.set(1,2,3)
mesh.rotation.x= 0.5
~~~

- In Fiber will be like this

~~~js
<>
    <mesh position={[1,2,3]} rotation-x={0.5}>
        <boxGeometry />
        <meshBasicMaterial color="red">
    </mesh>
</>
~~~

- If I want to create a group just in Native Threejs will be

~~~js
const group = new THREE.Group()

scene.add(group)

group.add(mesh1, mesh2)
~~~

- In Fiber will be in this way.   add() is called automatically

~~~js
<>
    <group>
        <mesh position={[1,2,3]} rotation-x={0.5}>
            <boxGeometry />
            <meshBasicMaterial color="red">
        </mesh>
        <mesh position={[1,2,3]} rotation-x={0.5}>
            <sphereGeometry />
            <meshBasicMaterial color="orange">
        </mesh>
    </group>
</>
~~~

- attach atribute. 
- When the name ends with Geometry, it will assign it to the geometry property
- When the name ends with Material, it will assign it to the material property
- It's automatic, I don't have to use attach

~~~js
<>
    <group>
        <mesh position={[1,2,3]} rotation-x={0.5}>
            <boxGeometry attach="geometry" />
            <meshBasicMaterial attach="material" color="red">
        </mesh>
        <mesh position={[1,2,3]} rotation-x={0.5}>
            <sphereGeometry  attach="geometry"/>
            <meshBasicMaterial attach="material" color="orange">
        </mesh>
    </group>
</>
~~~

- The classes in three.js are called as a tags in FIBER (?)

~~~js
THREE.boxGeometry => <boxGeometry>
THREE.meshBasicMaterial => <meshBasicMaterial>
~~~

- The updates will work automatically
- Automatically generated primitive componens are in camelCase
- More specific components are in PascalCase

# FIRST SCENE

## Canvas 

> import { Canvas } from "@react-three/fiber"

- Render a torus

~~~js
import { Canvas } from "@react-three/fiber"

function App() {
 

  return (
      <Canvas>
        <mesh>
          <torusKnotGeometry />
          <meshNormalMaterial />
        </mesh>
      </Canvas>
  )
}

export default App
~~~

- For resize de canvas go to index.css

~~~css
html, body, #root{
    position: fixed;
    top: 0;
    left:0;
    width: 100%;
    height: 100%;
    overflow: hidden;
}
~~~
- With Fiber:
    - We dont have toi create a scene, WebGLRenderer, a PerspectiveCamera
    - We dont have to pull back from the center
    - Is responsive
    - We don't have to import mesh, meshNormalMaterial, etc
    - We don't have to reload the page
-----
# The **hooks from fiber** only works with components inside the canvas

- I use a component called Experience to render it inside the Canvas
~~~js
function App() {
 

  return (
      <Canvas>
        <Experience />
      </Canvas>
  )
}
~~~

- I changed the geometry and material from Experience

~~~js
const Experience = () => {


  return (
    <mesh>
        <sphereGeometry />
        <meshBasicMaterial />
   </mesh>
  )
}
~~~

- I can use the documentation to see the parameters that are avaliable for this geometry
- Will be radius (1 by default), widthSegments(32 by default), heightSegments(32 by default)
- The parameters of the constructor will be in the prop args with an array

~~~js
const Experience = () => {


  return (
    <mesh>
        <sphereGeometry  args={[1.5, 32,32]}/>
        <meshBasicMaterial />
   </mesh>
  )
}
~~~

## Be carefull not to update those values too much, cause it will means destroy and recreate the figure again

- If you want it bigger you can change the scale on the mesh
- In the material I can pass args too. Only one parameter inside the array, and is an object
~~~js
import React from 'react'

const Experience = () => {


  return (
    <mesh>
        <sphereGeometry  args={[1.5, 32,32]}/>
        <meshBasicMaterial args={[{ color: 'red', wireframe: true}]}/>
   </mesh>
  )
}

export default Experience
~~~

- You can do it in this way, but also you can use props as a parameters

~~~js
  return (
    <mesh>
        <sphereGeometry  args={[1.5, 32,32]}/>
        <meshBasicMaterial color="mediumpurple" wireframe />
   </mesh>
  )
~~~

- We can play with the position, rotation, and scale on the mesh
- scale = x,y,z
- If you put in just one value will be the x value

~~~js
  return (
    <mesh scale={[1.5, 1.5, 1.5]} position={[2, 0, 0]} rotation={Math.PI * 0.25}>
        <sphereGeometry  args={[1.5, 32,32]}/>
        <meshBasicMaterial color="mediumpurple" wireframe/>
   </mesh>
  )
~~~

- I will add another figure. I will change sphere to a box, and set the parameters quite different

~~~js
import React from 'react'

const Experience = () => {


  return (
    <>
    <mesh position-x={-2}>
        <sphereGeometry />
        <meshBasicMaterial color="orange" />
    </mesh>

    <mesh scale={1.5} position-x={2} rotation-y={Math.PI * 0.25}>
        <boxGeometry scale={1.5} />
        <meshBasicMaterial color="mediumpurple" wireframe/>
   </mesh>
    
    </>
  )
}

export default Experience
~~~

- I will add another figure
- If I dont put the - on Math.PI I will se the backface, so I can´t see anything

~~~js
<mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
       <meshBasicMaterial color="greenyellow"/>
   </mesh>
~~~

## ANIMATE

- Using the useFrame hook from Fiber to change the mesh's parameters
- To do that I will use a reference using useRef
- Always use **.current** for a ref

~~~js
import { useFrame } from '@react-three/fiber'
import {useRef} from 'react'

const Experience = () => {

  const cubeRef= useRef()

  useFrame(()=>{
    cubeRef.current.rotation.y += 0.01
  })

  return (
    <>
    <mesh position-x={-2}>
        <sphereGeometry />
        <meshBasicMaterial color="orange" />
    </mesh>

    <mesh scale={1.5} position-x={2} rotation-y={Math.PI * 0.25} ref={cubeRef}>
        <boxGeometry scale={1.5} />
        <meshBasicMaterial color="mediumpurple" wireframe/>
   </mesh>

   <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
       <meshBasicMaterial color="greenyellow"/>
   </mesh>
    
    </>
  )
}

export default Experience
~~~

- We are incrementing the rotation.y without takimg care of the frame rate
- We need to know how much time passed since the last frame
- The first parameter of useFrame is a state, the secons is deltaTime (you can use just delta)


~~~js
  useFrame((state, delta)=>{
    cubeRef.current.rotation.y += delta
  })
~~~
----

- We can group  objects with the Group class
- I will put the sphere and the cube inside a group and animated like a carroussel

~~~js
import { useFrame } from '@react-three/fiber'
import {useRef} from 'react'

const Experience = () => {

  const cubeRef= useRef()
  const groupRef= useRef()

  useFrame((state, delta)=>{
    cubeRef.current.rotation.y += delta
    groupRef.current.rotation.y += delta
  })

  return (
    <>
    <group ref={groupRef}>

        <mesh position-x={-2}>
            <sphereGeometry />
            <meshBasicMaterial color="orange" />
        </mesh>

        <mesh scale={1.5} position-x={2} rotation-y={Math.PI * 0.25} ref={cubeRef}>
            <boxGeometry scale={1.5} />
            <meshBasicMaterial color="mediumpurple" wireframe/>
      </mesh>

    </group>

   <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
        <planeGeometry />
       <meshBasicMaterial color="greenyellow"/>
   </mesh>
    
    </>
  )
}

export default Experience
~~~

## OrbitControls

- In the next lesson we will see another way to implement orbit controls faster and easer.
- Now, we will use a little bit difficult way
- OrbitControls is not a part of THREE.js
- We are going to import it and convert it into a declarative vresion

> import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

- Then import extend from fiber
- If I want to use OrbitControls as a tag/component I need extends

> import { extend } from '@react-three/fiber'

- You can use it in this way outside the component

~~~js
extend({OrbitControls})
~~~

- You can add it more with a ,
- Now the component OrbitControls is avaliable
- You will need 2 parameters: the camera and the DOM element
- I can find them in the state from useFrame
- You can use a console.log to see a lot of values inside state
- Two of those are camera and gl
- To using these values I need another THREE.js hook called **useThree**

# WITH useThree WE GET THE STATE

- I can use desestructuring to get the values from useThree
- I pass it to orbitControls with an array in args

~~~js
import { useFrame, extend, useThree } from '@react-three/fiber'
import {useRef} from 'react'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'


extend({OrbitControls})

const Experience = () => {

  const {camera, gl} = useThree()

  const cubeRef= useRef()
  const groupRef= useRef()

  useFrame((state, delta)=>{
    cubeRef.current.rotation.y += delta
    groupRef.current.rotation.y += delta
  })

  return (
    <>
    <orbitControls args={[camera, gl.domElement]} />


      <group ref={groupRef}>

          <mesh position-x={-2}>
              <sphereGeometry />
              <meshBasicMaterial color="orange" />
          </mesh>

          <mesh scale={1.5} position-x={2} rotation-y={Math.PI * 0.25} ref={cubeRef}>
              <boxGeometry scale={1.5} />
              <meshBasicMaterial color="mediumpurple" wireframe/>
          </mesh>

      </group>

      <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
          <planeGeometry />
        <meshBasicMaterial color="greenyellow"/>
      </mesh>
    
    
    </>
  )
}

export default Experience
~~~
----
## LIGHTS

- I use the tag directionalLight
- To see the lights I need to change to another material like StandardMaterial

~~~js
import { useFrame, extend, useThree } from '@react-three/fiber'
import {useRef} from 'react'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'


extend({OrbitControls})

const Experience = () => {

  const {camera, gl} = useThree()

  const cubeRef= useRef()
  const groupRef= useRef()

  useFrame((state, delta)=>{
    cubeRef.current.rotation.y += delta
    groupRef.current.rotation.y += delta
  })

  return (
    <>
    <orbitControls args={[camera, gl.domElement]} />

    <directionalLight />

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
~~~

- I can change the direction with the prop position

~~~js
<directionalLight position={[1,2,3]}/>
~~~

- I can change the color and the intensity

~~~js
<directionalLight position={[1,2,3]} color="red" intensity={1.5}/>
~~~

- I can use an ambientLight to normalize the light

~~~js
   <directionalLight position={[1,2,3]} color="red" intensity={1.5}/>
    <ambientLight intensity={0.5} />
~~~

----

## CUSTOM GEOMETRY

- Process:
    - Create a Float32Array
    - Put a bunch of values in it
    - Create a BufferAttribute out of this Float32Array
    - Add it to the attributes of the BufferGeometry

- I will create a new component as a CustomObject
- (see the comments)
- I change to bufferGeometry and put in the bufferAttribute

~~~js
const CustomObject = () => {

    const verticesCount = 10 * 3 // 30 positions, 10 triangle, 3 points vertex per triangle(x,y,z)
    const positions= new Float32Array(verticesCount * 3) //Each vertex needs 3 points(x,y,z)
    
    for(let i = 0; i < verticesCount * 3; i++){
        positions[i]= (Math.random() - 0.5) * 3 //Math random will go from -0.5 to positive 0.5. Random triangles
    }

  return (
    <mesh>
        <bufferGeometry>
            <bufferAttribute />
        </bufferGeometry>
        <meshBasicMaterial color="red"/>
    </mesh>
  )
}
~~~

- We need a way to specify that this attribute is the position attribute.
- We can do it with the attach attribute
- It will result as Geometry.attributes.position ( the dash will be a dot)
- I need to provide three more values
- How many vortices will have
    - count
- How many values for one vertex === 3 => x,y,z
    - itemSize
- How many positions, will be an array
    - array
~~~js
import { Mesh, MeshPhysicalMaterial } from "three"


const CustomObject = () => {

    const verticesCount = 10 * 3 // 30 positions, 10 triangle, 3 points vertex per triangle(x,y,z)
    const positions= new Float32Array(verticesCount * 3) //Each vertex needs 3 points(x,y,z)
    
    for(let i = 0; i < verticesCount * 3; i++){
        positions[i]= (Math.random() - 0.5) * 3 //Math random will go from -0.5 to positive 0.5. Random triangles
    }

  return (
    <mesh>
        <bufferGeometry>
            <bufferAttribute 
                attach="attributes-position" //it will be 
                count={verticesCount}
                itemSize={3} //(x,y,z)
                array={positions} //random, any weird figure can appear
            />
        </bufferGeometry>
        <meshBasicMaterial color="red"/>
    </mesh>
  )
}

export default CustomObject
~~~

- By default we can only see their frontside
- We need to set the side property to THREE.DoubleSide but we don't have access tho the THREE variable
- import all from THREE

> import * as THREE from 'three'

- Now I can use de DoubleSide to see the both faces

~~~js
    <mesh>
        <bufferGeometry>
            <bufferAttribute 
                attach="attributes-position" //it will be 
                count={verticesCount}
                itemSize={3} //(x,y,z)
                array={positions} //random, any weird figure can appear
            />
        </bufferGeometry>
        <meshBasicMaterial color="red" side={THREE.DoubleSide}/>
    </mesh>
~~~
----
## OPTIMICE VERTICES WITH USING USEMEMO

- WE MADE A MISTAKE
- The code inde CustomObject will be called everytime the compoennt needs to be drawn
- In this case I only have 10 triangles, but it can be thousands, so it's important to optimize it
- useMemo will keep the value i want and give it as a memory
- We can specify when useMemo will forget the value and save the new value again
- With an empty array will kepp the value forever
- I put the Float32Array and the for loop inside the useMemo
- And I return the positions

~~~js
    const positions= useMemo(()=>{
        const positions= new Float32Array(verticesCount * 3) //Each vertex needs 3 points(x,y,z)
    
        for(let i = 0; i < verticesCount * 3; i++){
            positions[i]= (Math.random() - 0.5) * 3 //Math random will go from -0.5 to positive 0.5. Random triangles
        }

        return positions
    }, [])
  ~~~

  - You can use useState in place of useMemo in this case. We will see it later

---

## COMPUTE VERTEX NORMAL
- If I change it to a StandardMaterial the light don't affect it, everything is dark in our CustomObject
- We dont provide some normals, so is missing data here
- Normals are associations with vertex that telling where is the outside. 
- Instead of calculating and sending our own normal attribute, we can ask Three.js to do it with **computeVertexNormals** on bufferGeometry
- You need useRef

~~~js

    const geometryRef= useRef()

    geometryRef.current.computeVertexNormals()

  return (
    <mesh>
        <bufferGeometry ref={geometryRef}>
            <bufferAttribute 
                attach="attributes-position" //it will be 
                count={verticesCount}
                itemSize={3} //(x,y,z)
                array={positions} //random, any weird figure can appear

            />
        </bufferGeometry>
        <meshStandardMaterial color="red" side={THREE.DoubleSide}/>
    </mesh>
  )
~~~

- Now we have a problem. If I reload the app crashes because it's nothing as a ref in bufferGeometry
- It's because the JSX does not been rendered in to a Three.js
- We need to wait the first render to be done with useEffect

~~~js
    useEffect(()=>{
        geometryRef.current.computeVertexNormals()

    },[])
~~~
---

## CHANGE SETTINGS

- Sometimes we need to change the settings
- These settings are still accesible and most of them can be changed with attributes on the Canvas element
  - fov is a field of view

~~~js
import { Canvas } from "@react-three/fiber"
import Experience from "./components/Experience"

function App() {
 
  return (
      <Canvas 
          camera={{
            fov: 45,
            near: 0.1,
            far: 200,
            position:[3,2,6]
          }}>
        <Experience />
      </Canvas>
  )
}

export default App
~~~

- How can I add an OrthographicCamera?
- But now the scene appears too far
- If I adjust the values top, left, right, and bottom I will get close but I can use the property zoom
~~~js
      <Canvas 
          orthographic
          camera={{
            fov: 45,
            near: 0.1,
            far: 200,
            position:[3,2,6],
            zoom: 100
          }}>
        <Experience />
      </Canvas>
~~~

- I can put those values in an object and put it on camera

~~~js
  const cameraSettings={
    fov: 45,
    near: 0.1,
    far: 200,
    position:[3,2,6],
  }

  return (
      <Canvas
          camera={cameraSettings}>
        <Experience />
      </Canvas>
  )
~~~

- I removed the ortographic and the zoom
-----

## LOOK AT THE CENTER OF THE SCENE

- Remove orbitControls
- We need to move the camera in x and z, not y
- So we will create an angle and use sinus(x) and cosinus(z) (trigonometry) to calculate the position in a circle
- First we need to get acces to camera, it's in the state from useFrame
- I need the elapsed time. I can use Date.now() and that stuff but are other ways like state.clock.elapsedTime
- You can use the method state.clock.getElapsedTime() to get a single value
- If you want the circle bigger, you can multiply the values

~~~js
  useFrame((state, delta)=>{
    cubeRef.current.rotation.y += delta

    const angle= state.clock.elapsedTime
    state.camera.position.x = Math.sin(angle) * 8
    state.camera.position.z = Math.cos(angle) * 8
  })
~~~

- To centrate the camera I can use a method called lookAt()

~~~js
  useFrame((state, delta)=>{
    cubeRef.current.rotation.y += delta

    const angle= state.clock.elapsedTime
    state.camera.position.x = Math.sin(angle) * 8
    state.camera.position.z = Math.cos(angle) * 8
    state.camera.lookAt(0,0,0)
  })
~~~

- Just for fun. I will comment this animation and put orbitControls again

----

## The Antialias

- The antialias it's on by default
- We can remove it adding a gl attribute to the Canvas and send it an object, as we did with the camera

~~~js
return (
      <Canvas
          camera={cameraSettings}
          gl={{
            antialias: false
          }}>
            
        <Experience />
      </Canvas>
  )
~~~
---
## TONE MAPPING

- R3F sets the toneMapping to ACESFilmicToneMapping
- Tone mapping is used when you have extrem and dinamic values, like now I look up and see the sun, and look down and see my shadow
- A high dynamic range
- Values that go beyond the classic ranges like 0 to 1
- Then you compressed this values to a range from 0 to 1. Thats what's toneMapping is doing

- It's not a true HDR to LDR since the default render is already in LDR, but it tweaks the color to make it look like HDR
- To remove it we can add the flat attribute to the Canvas

~~~js
return (
      <Canvas
        flat
          camera={cameraSettings}
          gl={{
            antialias: false
          }}>
            
        <Experience />
      </Canvas>
  )
~~~
- You can provide your own toneMapping
- Import Three.js

> import * as THREE from 'three'

> console.log(THREE.CineonToneMapping) // It's just a number, but it's the number that I have to provide

- Remove flat

~~~js
  return (
      <Canvas
        
          camera={cameraSettings}
          gl={{
            antialias: true,
            toneMapping: THREE.CineonToneMapping //or THREE.ACESFilmicToneMapping as it's by default
          }}
          >
            
        <Experience />
      </Canvas>
  )
~~~
---
## OUTPUT ENCODING

- The ouptutEncoding it's already set to sRGBEncoding
- Color encoding is a way of encoding and decoding colors, so we store color info in a better and optimised way, since we are limited by the amount of possible values by channel
- For better results I will use sRGBEncoding
- We usually want to put colors as sRGBEncoding as it is by default, but we can change it to LinearEncoding if needed

~~~js
  return (
      <Canvas
          camera={cameraSettings}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping ,
            outputEncoding: THREE.LinearEncoding
          }}
          >
            
        <Experience />
      </Canvas>
  )
~~~
----

## ALPHA

- The background of the render is transparent by default
- I can use CSS to change the background
- In another lesson we will cover the change of transparent render

## PIXEL RATIO

- R3F handles the pixel ratio automatically
- It's a good practice to clamp it in order to avoid performance issues on devices with very high pixel ratio
- We can force it by sending an specific value to the dpr attribute on Canvas

~~~js
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
            
        <Experience />
      </Canvas>
  )
~~~

- I can put an array of range
- 1 and 2 are the values by default used by Fiber

~~~js
  return (
      <Canvas
          dpr={[1,2]}
          camera={cameraSettings}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping ,
            outputEncoding: THREE.LinearEncoding
          }}
          >
            
        <Experience />
      </Canvas>
  )
~~~
----

## PERFORMANCE

Everything apllies in Three.js apllies here
  - Minimise draw calls
  - Simplify models
  - Avoid big textures, etc

- Look at
  - "Awwwards-type" website by Paul Henschel => TUTORIAL ADVANCED FOR THREE.JS WEBSITES
  - poimandres
  - Three.js Journey lessons with r3F by @HazemOlbrahim