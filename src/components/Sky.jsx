import { useFrame } from '@react-three/fiber';
import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { v4 as uuidv4 } from 'uuid';
import { UniformsLib, UniformsUtils } from 'three';

function Sky() {
  const mesh = useRef(null);

  const uniforms = useMemo(() => {
    return THREE.UniformsUtils.merge([
      UniformsLib['fog'],
      {
        uTime: { value: 0 },
        uShader1Speed: { value: 0.5 },
      },
    ]);
  }, []);

  useFrame((state, delta) => {
    const elapsedTime = state.clock.getElapsedTime();
    mesh.current.material.uniforms.uTime.value = elapsedTime;
  });

  return (
    <>
      <mesh
        ref={mesh}
        position={[0, -50, 0]}
        // position={[0, 0, -100]}
        rotation={[0, 0, -Math.PI * 0.5]}
      >
        <icosahedronGeometry args={[75, 75]} />
        {/* <planeGeometry args={[500, 500]} /> */}
        <shaderMaterial
          key={uuidv4()}
          side={THREE.DoubleSide}
          uniforms={uniforms}
          fog={true}
          vertexShader={`
            #include <fog_pars_vertex>
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              #include <begin_vertex>
              #include <project_vertex>
              #include <fog_vertex>
            }
          `}
          fragmentShader={`
            #include <fog_pars_fragment>
            uniform float uTime;  
            uniform float uShader1Speed;
            varying vec2 vUv;

            float noiseShaderRandom(vec2 n) {
                return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
            }
            float noise(vec2 p) {
                vec2 ip = floor(p);
                vec2 u = fract(p);
                u = u * u * (3.0 - 2.0 * u);
                float res = mix(mix(noiseShaderRandom(ip), noiseShaderRandom(ip + vec2(1.0, 0.0)), u.x), mix(noiseShaderRandom(ip + vec2(0.0, 1.0)), noiseShaderRandom(ip + vec2(1.0, 1.0)), u.x), u.y);
                return res * res;
            }
            const mat2 mtx = mat2(0.80, 0.60, -0.60, 0.80);
            float fbm(vec2 p, float time, float speed) {
                float f = 0.0;
                f += 0.500000 * noise(p - time * speed);
                p = mtx * p * 2.02;
                f += 0.031250 * noise(p);
                p = mtx * p * 2.01;
                f += 0.250000 * noise(p);
                p = mtx * p * 2.03;
                f += 0.125000 * noise(p);
                p = mtx * p * 2.01;
                f += 0.062500 * noise(p - time * (speed * 5.));
                p = mtx * p * 2.04;
                f += 0.015625 * noise(p + time * (speed * 5.));
                return f / 0.96875;
            }
            float pattern(vec2 p, float time, float speed) {
                float f1 = fbm(p, time, speed);
                float f2 = fbm(p + f1, time, speed);
                return fbm(p + f2, time, speed);
            }
            vec4 noiseShader(vec2 uv, float time, float speed) {
                float shade = pattern(uv, time, speed);
                return vec4(vec3(shade), shade);           
            } 


            void main() {
              vec2 uv = vUv;
              vec2 pos = vUv.xy * 4.;
              pos.x *= 1.5;
              vec4 noise = noiseShader(pos, uTime, uShader1Speed * .1);

              gl_FragColor = vec4(noise.rgb, 1.0);
              #include <fog_fragment>
            }
          `}
        />
      </mesh>
    </>
  );
}

export default Sky;
