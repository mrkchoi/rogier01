import React, { useEffect, useMemo, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { BOX_COUNT } from './BoxGroup';
import { useFrame } from '@react-three/fiber';

function Box({ position, rowIdx, colIdx }) {
  const mesh = useRef(null);
  // useEffect(() => {
  //   console.log(position);
  // }, []);

  const uniforms = useMemo(() => {
    return {
      uTime: { value: 0 },
      uRow: { value: rowIdx },
      uCol: { value: colIdx },
      uTotalRows: { value: BOX_COUNT.y },
      uTotalCols: { value: BOX_COUNT.x },
      uAlpha: { value: Math.max(Math.random(), 0.5) },
    };
  }, [colIdx, rowIdx]);

  useFrame((state) => {
    const elapsedTime = state.clock.getElapsedTime();

    uniforms.uTime.value = elapsedTime;

    // use time to oscillate z position and randomize based on row and col in a cirular pattern from the center
    // const z = Math.sin(elapsedTime + rowIdx * 0.1 + colIdx * 0.1) * 1.5;
    // mesh.current.position.z = z;

    // update uAlpha based on z position, lower value is more opaque
    // uniforms.uAlpha.value = Math.abs(z) * 0.5;
  });

  return (
    <>
      <mesh ref={mesh} position={position} scale={0.9}>
        <boxGeometry args={[1, 1, 1]} />
        {/* <meshStandardMaterial color="hotpink" /> */}
        <shaderMaterial
          key={uuidv4()}
          transparent={true}
          uniforms={uniforms}
          depthTest={false}
          depthWrite={false}
          vertexShader={`
            varying vec2 vUv;
            void main() {
              vUv = uv;
              vec3 pos = position;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
          `}
          fragmentShader={`
            uniform float uRow;
            uniform float uCol;
            uniform float uTotalRows;
            uniform float uTotalCols;
            uniform float uAlpha;

            varying vec2 vUv;

            void main() {
              // remap uv based on row and col
              float row = uRow / uTotalRows;
              float col = uCol / uTotalCols;
              vec2 uv = vec2(col, row);
              gl_FragColor = vec4(uv, 1.0, uAlpha);


            
            }
          `}
        />
      </mesh>
    </>
  );
}

export default Box;
