import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
  Stats,
} from '@react-three/drei';
import React, { useEffect, useMemo, useRef } from 'react';
import Scene from './Scene';
import { useControls } from 'leva';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function Experience() {
  // const fog = useRef(null);

  const { near, far } = useControls({
    near: { value: 40, label: 'Near', step: 1 },
    far: { value: 120, label: 'Far', step: 1 },
  });

  // useFrame(() => {
  //   fog.current.color.set(color);
  //   fog.current.near = near;
  //   fog.current.far = far;
  // });

  return (
    <>
      <Stats />
      <axesHelper args={[3]} />
      {/* <color attach="background" args={['#000000']} /> */}
      {/* <fog attach="fog" args={['#ffffff', near, far]} /> */}
      <ambientLight intensity={1} />
      <directionalLight intensity={1} position={[5, 5, 0]} />
      <OrbitControls />
      <PerspectiveCamera
        makeDefault
        position={[0, 0, 5]}
        fov={75}
        aspect={2}
        near={0.1}
        far={2000}
      />
      <Environment
        background={true}
        files={[
          '/assets/cubemap/px.webp',
          '/assets/cubemap/nx.webp',
          '/assets/cubemap/py.webp',
          '/assets/cubemap/ny.webp',
          '/assets/cubemap/pz.webp',
          '/assets/cubemap/nz.webp',
        ]}
      />
      <Scene />
    </>
  );
}

export default Experience;
