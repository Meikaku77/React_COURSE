# Environment and Stagging

- We will discover a lot of environment features
- It's about shadows, environment mapp, automatic stuff, helpers

## Background color

- The default is transparent ( white )
- I can use CSS
- You can use setClearColor on the renderer
- You need acces to the renderer only once when it has been created
- WebGLRenderer has a method named setClearColor
- I can use the attribute on Canvas onCreated and put the function I created
    - the instructions will be called when the canvas is ready
    - I have the state. In state.gl I have WebGLRenderer
    - I can desestructure form state as a parameter gl
    - Now I have setClearColor disponible. I can pass the channel alpha with a coma
~~~js
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

  const created =({gl})=>{
    gl.setClearColor('#ff0000', 1)
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

          onCreated={created}
          >
            
        <Experience />
      </Canvas>
  )
}

export default App
~~~

- I can do the same on scene, desestructuring from state ( as a paremeter )
- Import THREE

> import * as THREE from 'three'

~~~js
  const created =({scene})=>{
    scene.background= new THREE.Color('purple')

  }
~~~

- And I have another option to do the same
- Create a color tag inside the canvas
- args is always an array
- I need to assign the color by using attach

~~~js
    <Canvas
        dpr={1}
        camera={cameraSettings}
        gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping ,
        outputEncoding: THREE.LinearEncoding
        }}


        >
        <color args={['red']} attach="background"/>
    <Experience />
    </Canvas>
~~~

- You can put this code anywhere and it will works because color attach to scene

## Lights

- All default Three.js lights are supported in R3F
  - ambientLight
  - hemisphereLight
  - directionalLight
  - pointLight
  - rectAreaLight
  - spotLight
- Using the helpers to figure out where is the light
- When you have an issue, there is a helper
- Use useHelper from **drei**
- You need a reference to a directionalLight

> const directionalLight= useRef()

- Associate it

~~~js
<directionalLight position={[1,2,3]} color="red" intensity={1.5} ref={directionalLight}/>
~~~

- Import useHelper from drei
- The first parameter is the reference to the light, the second is the helper class we want to use form Three.js
- Are helpers for specific lights, cameras, etc
- You need to import Three.js

> import * as THREE from 'three'

- The number of the third parameter is the size of the helper

~~~js


const directionalLight = useRef()

useHelper(directionalLight, THREE.DirectionalLightHelper, 1)
~~~

# SHADOWS

### Default Shadows

- First activate shadows on Canvas with the property shadows

~~~js
<Canvas
  shadows
    dpr={1}
    camera={cameraSettings}
    gl={{
      antialias: true,
      toneMapping: THREE.ACESFilmicToneMapping ,
      outputEncoding: THREE.LinearEncoding
    }}

  
    >
      <color args={['aqua']} attach="background"/>
  <Experience />
</Canvas>
~~~
- You need to assign shadows to the mesh
  - Add castShadow to the directionaLight tag
  - Add castShadow to the cube mesh and sphere mesh
  - Add receiveShadow to the mesh of the floor

~~~js
 <OrbitControls />
  <directionalLight position={[1,2,3]} color="red" intensity={1.5} ref={directionalLight} castShadow />
  <ambientLight intensity={0.5} />

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

    <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10} receiveShadow>
        <planeGeometry />
      <meshStandardMaterial color="greenyellow"/>
    </mesh>
~~~

### Configurin the shadows

- Each light  casting shadows will render the scene ina specific way and output it in what we call "shadow map"
- This shadow map is then used to know if a surface is in the shade or not
- By default, that shadow map resolution israther low in order to mantain solid performance
- In pure JavaScript you will see (parameters are x and y)

~~~js
directionalLight.shadow.mapSize.set(1024, 1024)
~~~

- In R3F, we can acces to this properties using a dash

~~~js
<directionalLight 
      position={[1,2,3]} 
      color="red" 
      intensity={1.5} 
      ref={directionalLight} 
      castShadow 
      shadow-mapSize={[1024,1024]}
      />
~~~

- You can multiply the resolution by 2 but be careful with the performance
- We can do the same with the near, far, top, right, bottom and left properties from the camera to render the scene in the shadow map

~~~js
 <directionalLight 
      position={[1,2,3]} 
      color="red" 
      intensity={1.5} 
      ref={directionalLight} 
      castShadow 
      shadow-mapSize={[1024,1024]}
      shadow-camera-near={1}
      shadow-camera-far={10}
      shadow-camera-top={2}
      />
~~~

- With a negative number you will get a smooth shadow

### Soft Shadows

- The default shadow are too sharp
- PCSS will make the shadow look blurry
- Implementing this solution implies modifying the shader chunks of Three.js directly, which is a bit messy
- Three.js shaders are going be update directly
- drei comes to the rescue with softShadows()
- To make that works, we call it once at the begining and outside of any component because this function will modify Three.js directly
- We only want to call it once

- outside the component:
~~~js
softShadows({
  frustum: 3.75,
  size: 0.005,
  near: 9.5,
  samples: 17,
  rings: 11
})
~~~

- The parameters I am sending to softShadows are used directly in the compile shaders and modifying themimplies re-compiling all thematerials shaders
- Be very carefull with this values, this are values that are took from experience. Others can do the shadows sharper 
- In the latest version you can use the component SoftShadow with the same values

~~~js
<SoftShadows 
  frustum={3.75}
  size={0.005}
  near={9.5}
  samples={17}
  rings={11}
/>
~~~

### AccumulativeShadows

- The AccumulativeShadows will accumulate multiple shadow renders, and we are going to move the light randomly before each render
- The shadow will be composed of multiple renders from various angles, making it look soft and veryrealistic
- Can be rendered on a plane only. 
- Since the AccumulativeShadow will be a shadow on its own, we should deactivate the shadows on the mesh corresponding to the floor
- Import from drei
- Add it to the scene just after the directionalLight tag and don't auto close it
- Ineed to put it right above the floor
- The default scale is 10 units which matches our scene perfectly, but if you need smaller or bigger just use scale attr
- We need to proviode the lights and we need to move it randomly on each frame
  - Using RandomizedLight (import it from drei)

~~~js
  <AccumulativeShadows
    position={[0,-0.99,0]}
  >
    <RandomizedLight 
      position={[1,2,3]}
      
    />
  </AccumulativeShadows>
~~~

- RandomizedLight has a lot of attributes to control the behaviour of the light
  - amount: how many lights
  - radius: amplitude
  - intensity
  - ambient: act like a global light
  - near and far: how close and how far the shadow map camera will render
  - castShadow
  - bias: the bias offset like for directional light shadows. If you see shadows on the mesh, you can play with bias toi fix it
  - mapSize: the shadow map size. Resolution
  - size: the amplitusde (top, right, left, bottom, all at once)
- Take this parameters!

~~~js
    <RandomizedLight
          position={[1,2,3]}
          intensity={1}
          amount={8}
          radius={1}
          ambient={0.5}
          bias={0.001}
          />
~~~

- We also have more attributes on AccumulativeShadows like:
  - colors: the color of the shadow
  - opacity
  - frames: how many shadow renders to do
  - temporal: spread the renders across multiple frames

~~~js

  <AccumulativeShadows
    position={[0,-0.99,0]}
    colors="#316d39"
    opacity={0.8}
    frames={100}
    temporal 
  >
~~~

- Appears some lines, we gonna fix it
- It's because the helper, remove it
- Now, the shadow is static and the cube is moving. Let's fix it!
- In the useFrame, retrieve the clock elpasedTime and assign it to a time variable
- I'm gona use sinus to move the cube in x

~~~js
  useFrame((state, delta)=>{
    
    const time= state.clock.elapsedTime
    
    cubeRef.current.position.x= 2 + Math.sin(time)
    cubeRef.current.rotation.y += delta
  })
~~~

- We need the cube's shadow follows the cube!!
- Add to frames the word Infinity
- Using Infinity, is only blending the last 20 shadow renders
- Use blend and set it to 100

~~~js
  <AccumulativeShadows
    position={[0,-0.99,0]}
    colors="#316d39"
    opacity={0.8}
    frames={Infinity}
    temporal 
    blend={100}
  >
~~~

- Accumulative shadows it's not great to animate objects
- If it moves slow it's great but if it moves fast you will have a delay or loose the shadow
- Comment the animation of the cube and put back the light helper

### Contact Shadows

- ContactShadows doesn't rely on the default shadow system of Three.js. Deactivate shadows on the Canvas
- works whithout a light and on a plane
- The ContactShadow will render the whole scene a bit like how directionalLight does but with the camera taking place of the floor instead of the light
- It will then blur the shadow map to make it look better. A simple blur
- ContactShadow will render from the floor
- Put the tag autoclosed somewhere inside the scene ( component )
- Appears the shadow in the center of the scene, lets put it on the right place (just above the floor with -0.99 on y)

~~~js
  <ContactShadows position={[0,-0.99,0]} />
~~~

- You can use attr as scale, resolution (512)
- We can choose how far the shadow will render objects above with the far attr
- If you render birds far away from the floor you will need increase far to see their shadows
----

## Leva

- Install leva with npm i leva@0.9
- Import useControls
- Desestructuring before the return of the component color, opacity, blur
- Create a folder in leva called contact shadows

~~~js
 const {color, opacity, blur} = useControls('contact shadows', {
      color: '#000000',
      opacity:{value: 0.5, min: 0, max: 1},
      blur: {value: 1, min: 0, max: 10}

 })
~~~

- Use them on the ContactShadows

~~~js
<ContactShadows position={[0,-0.99,0]} 
  resolution={512}
  far={5}
  color={color}
  opacity={opacity}
  blur= {blur}
  /*frames={1}*/
/>
~~~

- ContactShadows has his own limitations
  - The shadows always comes from the front of the plane
  - It's not phisically accurate
  - It blurs the shadow regardless of the distance from the objects
  - It pulls quite a lot on the performance

## Sky

- With drei you have Sky helper
- Put it somewhere in the scene

~~~js
 <Sky />
~~~

- This class is based in physics and tries to reproduce a realistic sky according to various parameters:
  - mieCoefficient
  - mieDirectionalG
  - rayleigh
  - turbidity
- Call useControls, set the first parameter as 'sky' and send and object with a sunPosition property set to have a vector 3 tweak
- This is for using leva to have the parameter controls on screen
~~~js
const {sunPosition} = useControls('sky',{
  sunPosition: {value:[1,2,3]}
})
~~~

- I can use this attr in Sky without leva

~~~js

    <Sky sunPosition={[1,2,3]}/>

~~~

- For sun position is better to use spherical coordinates
  - Create a Spherical
  - Create a Vector3
  - Use its setFromSpherical method
- Spherical is a mathematical class in Three.js, and you will have a radius, phi (north to south) and theta (ecuador)
- Convert it to a Vector3 cause it has setFromSpherical method
- We can use the sunPosition in the directionalLight adding the attr

----
## Environment Map

1:26:48






