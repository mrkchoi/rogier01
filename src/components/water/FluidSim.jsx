import { useFrame, useThree } from '@react-three/fiber';
// import { useControls } from 'leva';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Fluid } from '@alienkitty/alien.js/three';
// import { v4 as uuidv4 } from 'uuid';
// import videoSource from '/assets/video/zajno_showreel.mp4';
import { WaterContext } from './WaterContext';
import { useContext } from 'react';

const FLUID = {
  iterate: { value: 3, min: 1, max: 10 },
  density: { value: 0.97, min: 0, max: 1 },
  velocity: { value: 0.94, min: 0, max: 1 },
  pressure: { value: 0.99, min: 0, max: 1 },
  curl: { value: 20, min: 0, max: 50 },
  // radius: { value: 0.0001, min: 0.0001, max: 0.1 },
  // radius: { value: 0.02, min: 0.01, max: 0.1 },
  deltaMultiplier: { value: 1000, min: 1, max: 10000 },
};
// const FLUID = {
//   iterate: { value: 3, min: 1, max: 10 },
//   density: { value: 0.97, min: 0, max: 1 },
//   velocity: { value: 0.94, min: 0, max: 1 },
//   pressure: { value: 0.7, min: 0, max: 1 },
//   curl: { value: 50, min: 0, max: 50 },
//   // radius: { value: 0.0001, min: 0.0001, max: 0.1 },
//   // radius: { value: 0.02, min: 0.01, max: 0.1 },
//   deltaMultiplier: { value: 1, min: 1, max: 10000 },
// };

function FluidSim({ radius = 0.0005 }) {
  // const {
  //   iterate,
  //   density,
  //   velocity,
  //   pressure,
  //   curl,
  //   // radius,
  //   deltaMultiplier,
  // } = useControls(
  //   'Fluid',
  //   {
  //     iterate: { value: 3, min: 1, max: 10 },
  //     density: { value: 0.97, min: 0, max: 1 },
  //     velocity: { value: 0.94, min: 0, max: 1 },
  //     pressure: { value: 0.7, min: 0, max: 1 },
  //     curl: { value: 50, min: 0, max: 50 },
  //     // radius: { value: 0.0001, min: 0.0001, max: 0.1 },
  //     // radius: { value: 0.02, min: 0.01, max: 0.1 },
  //     deltaMultiplier: { value: 1, min: 1, max: 10000 },
  //   },
  //   { collapsed: false }
  // );
  const { ref: mesh, refPointer } = useContext(WaterContext);
  // const mesh = useRef(null);
  const { gl, camera, raycaster, scene } = useThree();
  const mouse = useRef({
    world: new THREE.Vector2(),
    uv: new THREE.Vector2(),
    isInit: false,
  });
  // const raycaster = useRef(new THREE.Raycaster());

  const fluid = useMemo(() => {
    return new Fluid(gl, { curlStrength: 0 });
  }, [gl]);

  useEffect(() => {
    const fluidInstance = fluid;

    return () => {
      fluidInstance.destroy();
    };
  }, []);

  useEffect(() => {
    // console.log('ref.current', ref.current);
    if (!camera) return;

    const handleMouseMove = (e) => {
      const event = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };

      if (!mouse.current.isInit) {
        mouse.current.isInit = true;
        mouse.current.world.copy(event);
        mouse.current.uv.copy(event);
      }

      // console.log(refPointer.current.x, refPointer.current.y);

      raycaster.setFromCamera(mouse.current.world, camera);
      const intersects = raycaster.intersectObject(mesh.current);
      if (intersects.length > 0) {
        const { x, y } = intersects[0].uv;
        const deltaX = x - mouse.current.uv.x;
        const deltaY = y - mouse.current.uv.y;
        mouse.current.uv.copy(intersects[0].uv);
        if (Math.abs(deltaX) || Math.abs(deltaY)) {
          // console.log(x, y, deltaX, deltaY);
          if (fluid) {
            fluid.splats.push({
              // x: refPointer.current.x,
              // y: refPointer.current.y,
              x: x,
              y: y,
              dx: deltaX * FLUID.deltaMultiplier.value,
              dy: deltaY * FLUID.deltaMultiplier.value,
            });
          }
        }
      }
      mouse.current.world.copy(event);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [camera]);

  useFrame((state, delta) => {
    if (fluid) {
      if (fluid.uniform) {
        // mesh.current.material.uniforms.uFluid.value = fluid.uniform.value;
        mesh.current.material.uniforms.u_fx.value = fluid.uniform.value;
      }
      fluid.iterate = FLUID.iterate.value;
      fluid.densityDissipation = FLUID.density.value;
      fluid.velocityDissipation = FLUID.velocity.value;
      fluid.pressureDissipation = FLUID.pressure.value;
      fluid.curlStrength = FLUID.curl.value;
      fluid.radius = radius;
      fluid.update();
    }
    // mesh.current.material.uniforms.uTime.value += delta;
  });

  const uniforms = useMemo(() => {
    return {
      uFluid: { value: null },
      uTime: { value: 0 },
      uVideoTexture: { value: null },
    };
  }, [null]);

  // return (
  //   <>
  //     <mesh ref={mesh} position={[2, 6, 10]}>
  //       <planeGeometry args={[16, 9]} />
  //       <shaderMaterial
  //         key={uuidv4()}
  //         uniforms={uniforms}
  //         vertexShader={
  //           /* GLSL */ `
  //           varying vec2 vUv;

  //           void main() {
  //             vUv = uv;
  //             gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  //           }
  //         `
  //         }
  //         fragmentShader={
  //           /* GLSL */ `
  //           uniform float uTime;
  //           uniform sampler2D uVideoTexture;
  //           uniform sampler2D uFluid;
  //           // uniform int uRGBShift;

  //           varying vec2 vUv;

  //           void main() {
  //             vec3 fluid = texture2D(uFluid, vUv).rgb;
  //             vec2 uv = vUv;
  //             vec2 uv2 = vUv - (fluid.xy * .001);
  //             vec4 color = texture2D(uVideoTexture, uv2);
  //             // vec3 rgb = fluid * 0.0001;

  //             // color.r = texture2D(uVideoTexture, vec2(uv.x+rgb.x, uv.y+rgb.y)).r;
  //             // color.g = texture2D(uVideoTexture, vec2(uv.x-rgb.x, uv.y+rgb.y)).g;
  //             // color.b = texture2D(uVideoTexture, vec2(uv.x-rgb.x, uv.y-rgb.y)).b;
  //             gl_FragColor = color;
  //             // gl_FragColor = vec4(vUv, 1.0, 1.0);
  //           }
  //         `
  //         }
  //         // depthTest={false}
  //         // transparent
  //         // depthWrite={false}
  //       />
  //     </mesh>
  //   </>
  // );
  return null;
}

export default FluidSim;
