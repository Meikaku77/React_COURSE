# DREI

- Useful helpers

> https://github.com/pmndrs/drei

## Orbit Controls

- Let's implement orbitControls in an easier way
- Remove orbitControls and all relationated with this
- We need to acces to the drei helpers
- react-three is a scope for multiple libraries
- Install:

> npm i @react-three/drei@9.32

- Import orbitControls in the project

~~~js
import { OrbitControls } from '@react-three/drei'
~~~

- Put the component in the project inside the return of the component

~~~js
import { useFrame } from '@react-three/fiber'
import {useRef} from 'react'
import { OrbitControls } from '@react-three/drei'


const Experience = () => {

  

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
  
    <OrbitControls />
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
~~~

- That's it!
- I can disable damping with the prop enableDamping in false

~~~js
<OrbitControls enableDamping={false} />
~~~

- TransformControls
- import it
- Wrap the mesh you want to add the gizmo
~~~js

        <TransformControls>
          <mesh scale={1.5} position-x={2} rotation-y={Math.PI * 0.25} ref={cubeRef}>
              <boxGeometry scale={1.5} />
              <meshStandardMaterial color="mediumpurple" wireframe={false}/>
          </mesh>
          </TransformControls>
~~~

- I want the gizmo above the object, not in the center
- To fix this, I can put the position in TransfromControls
~~~js
       <TransformControls position-x={2}>
          <mesh scale={1.5} rotation-y={Math.PI * 0.25} ref={cubeRef}>
              <boxGeometry scale={1.5} />
              <meshStandardMaterial color="mediumpurple" wireframe={false}/>
          </mesh>
          </TransformControls>
~~~

- We can use another way, that is separate them, but reassociate them with a ref
- I put the TransformControl after the mesh to fix a bug
- Use useRef to associate the object with the ref attribute
- Add to the object attribute of the TransfromControls

~~~js
const cubeRef= useRef()
~~~

~~~js
          <mesh scale={1.5} position-x={2} rotation-y={Math.PI * 0.25} ref={cubeRef}> 
              <boxGeometry scale={1.5} />
              <meshStandardMaterial color="mediumpurple" wireframe={false}/>
          </mesh>

        <TransformControls object={cubeRef} />
~~~

- Fix it!

- Now, when I use the gizmo to move the object, the orbitControls moves the camera too
- To fix it add makeDefault attribute to OrbitControls

~~~js
<OrbitControls makeDefault/>
~~~

## Modes

- We can use other modes with TransformControls like rotate or scale (translate by default)

~~~js
 <TransformControls object={cubeRef} mode="rotate"/>
~~~

## Pivot Controls

- It's an alternative solution to TransfromControls
- TransformControls looks a developer tool
- Pivot Controls looks nice
- wrap the mesh component

~~~js
    <PivotControls>
      <mesh position-x={-2} ref={sphereRef}>
          <sphereGeometry />
          <meshStandardMaterial color="orange" />
      </mesh>
    </PivotControls>
~~~

- PivotControls does not work as a group like TransfromControls
- To move the gizmo you can use the anchore attribute and set it to 0,0,0 (x,y,z)
- If you put 0,1,0 will means that the gizmo will stand at the top of the figure

~~~js

    <PivotControls anchor={[0,0,0]}>
      <mesh position-x={-2} ref={sphereRef}>
          <sphereGeometry />
          <meshStandardMaterial color="orange" />
      </mesh>
    </PivotControls>
~~~

- To fix the bug (because it's hidden inside the figure) you can use depthTest in false

~~~js
<PivotControls anchor={[0,0,0]} depthTest={false}>
~~~

- You can personalize PivotControls
- If you put fixed you will fix the size

~~~js
    <PivotControls anchor={[0,0,0]} depthTest={false}
      lineWidth={4}
      axisColors={['#9381ff', '#ff4d6d', '#7ae582']}
      scale={50}
      fixed={true}
      >
~~~

## Html

- Html adds a DOM element that will stick to your object
- Import Html from drei

~~~js
<Html>Test</Html>
~~~

- You can add it to a mesh, a group or anything that inherits from an Object3D
- You can put it in PivotControls or inside a mesh
- I can use position attribute

~~~js
    <PivotControls anchor={[0,0,0]} depthTest={false}
    lineWidth={4}
    axisColors={['#9381ff', '#ff4d6d', '#7ae582']}
    scale={50}
    fixed={true}
    >
      <mesh position-x={-2} ref={sphereRef}>
          <sphereGeometry />
          <meshStandardMaterial color="orange" />
          <Html position={[0,1,0]}>Test</Html>
      </mesh>
    </PivotControls>
~~~

## Class and style

- I can add a class to target it in css, with wrapperClass attribute

~~~js
   <Html position={[0,1,0]}
        wrapperClass="label"
   >Test</Html>
~~~

- You can target the small div inside like this (also you can target label at all)

~~~css
.label > div{
    font-size: 2rem;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    color: white;
    background: rgba(0,0,0,.8);
    padding: 10px;
    border-radius: 30px;
    user-select: none;
~~~

- You can add center attribute to center the html
- We can simulate perspective with the distanceFactor attr
- It looks that is part of the 3D scene

~~~js
  <mesh position-x={-2} ref={sphereRef}>
      <sphereGeometry />
      <meshStandardMaterial color="orange" />
      <Html position={[0,1,0]}
      wrapperClass="label"
      center
      distanceFactor={6}
      >Sphere</Html>
  </mesh>
~~~

- You can hide the html when objects are in fornt of it with occlude attr
- First need to have a reference to indicate what object will occlude the html

~~~js
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
~~~

## TEXT

- Generating a 3D text geometry has its limits
  - We can notice the poligons
  - Takes a lot of CPU resources
  - Some fonts won't look very good
  - Doesn't support line breaks

## SDF

- Signed Distance Field is usually used to draw shapes
- We send a 2D or 3D point to an SDF shape function that returns how far the point is from the shape
- There are manyt possible shapes
- If I have a cercle with radius 1, all positions below to 1 will be inside, above to 1 will be outside and don't draw anything
- It gets more complicated for more complex shapes (specially 3D shapes)

  NOTE: More information search Iñigo Quilez (@iquilezles) 2D SDF Functions, 3D SDF Functions
- With this functions you'll get the distance from the point to the center of the figure

## SDF Fonts

- You can't express a font mathematically, like the distance of a point to the font
- Developers have created scripts that generate textures (como una malla de pixels) containing the distance information for each character of a font
- We can use that texture to indicate the distance between the fragment we are drawing and the suposed character
- If the distance is closer to a specific value, we draw the text; otherwise, we draw nothing
- You can change the thickness
- Adding an outline
- Adding a blur
- Drawing huge text

- The natural interpolation between pixels makes the techinque works with huge texts
- Some developers have done most of the heavy lifting in the **Troika** library (more precisely troika-three-text) and drei is implementing that solution in the Text helper
- Import Text from @react-three/drei
- install roboto

> npm i @fontsource/roboto

- import the font

> import "@fontsource/roboto"

- Wrap the text in Text component
- You can change the font using a .woff file provided in the public folder

~~~js
<Text
  font="./font-file.woff"
>3D TEXT</Text>
~~~

- You can use another material

~~~js

  <Text
    fontSize={1}
    position={[1,1,1]}
    color="red"        
  >3D Text
    <meshNormalMaterial />
  </Text>
~~~

- There are a lot of attributes

~~~js
<Text
        fontSize={1}
        position={[1,1,1]}
        color="red"
        rotation-y={-Math.PI * 0.5} 
        maxWidth={1}
        textAlign="center" 
              
      >3D Text
      </Text>
~~~

- Float (import from drei) will give the llok to floating as a balloon. Wrap the text component
- You can change the speed and the intensity

~~~js
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
~~~

## MeshReflectorMaterial

- Import it from drei and put it inside the Text component
- Only works on plane mesh
- You can change the resolution
- Put some blur, and mixBlur (between 0 and 1)
~~~js
  <MeshReflectorMaterial resolution={512} blur={[1000, 1000]} mixBlur={.5}/>
~~~

- Other attribute is mirror ( between 0 and 1 )
- Other is color





