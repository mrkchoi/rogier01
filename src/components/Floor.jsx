import React, { useEffect, useMemo, useRef } from 'react';
import groundNormal from '/assets/textures/floor-normal.webp';
import * as THREE from 'three';
import { MeshReflectorMaterial } from '@react-three/drei';
import { v4 as uuidv4 } from 'uuid';
import WaterSurfaceSimple from './water/WaterSurfaceSimple';

import { ReflectorMaterial } from '@alienkitty/alien.js/src/three/materials/ReflectorMaterial.js';
import { Reflector } from '@alienkitty/alien.js/src/three/utils/Reflector.js';
import { extend, useFrame } from '@react-three/fiber';

extend({ ReflectorMaterial });

function Floor() {
  // const mesh = useRef(null);
  // // const reflector = new Reflector();

  // const reflector = useMemo(() => {
  //   return new Reflector();
  // }, []);

  // useEffect(() => {
  //   console.log(reflector);
  //   mesh.current.material.uniforms.tReflect.value =
  //     reflector.renderTargetUniform.value;
  //   mesh.current.material.uniforms.uMatrix.value =
  //     reflector.textureMatrixUniform.value;
  // }, [reflector]);

  // const groundTexture = useMemo(() => {
  //   const texture = new THREE.TextureLoader().load(groundNormal);
  //   texture.wrapS = THREE.RepeatWrapping;
  //   texture.wrapT = THREE.RepeatWrapping;
  //   texture.repeat.set(45, 45);
  //   return texture;
  // }, []);

  // useFrame(() => {
  //   mesh.current.material.uniforms.tReflect.value =
  //     reflector.renderTargetUniform.value;
  //   mesh.current.material.uniforms.uMatrix.value =
  //     reflector.textureMatrixUniform.value;
  // }, []);

  return (
    <>
      {/* <mesh
        ref={mesh}
        rotation={[-Math.PI * 0.5, 0, 0]}
        position={[0, -1.5, 0]}
      >
        <planeGeometry args={[80, 50]} />
        <reflectorMaterial
          key={uuidv4()}
          color={new THREE.Color(0xff0000)}
          // map={groundTexture}
          normalMap={groundTexture}
          // normalScale={[0.5, 0.5]}
          reflectivity={0.5}
          mirror={0.5}
          mixStrength={10}
        />
      </mesh> */}
      <group position={[0, -2, 0]}>
        <WaterSurfaceSimple speed={0} distortionScale={2} />
      </group>
    </>
  );
}

export default Floor;
