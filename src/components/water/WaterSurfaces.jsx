import React, { useMemo } from 'react';
import * as THREE from 'three';
import WaterSurfaceSimple from './WaterSurfaceSimple';
import FluidSim from './FluidSim';
import { isMobile } from 'react-device-detect';

function WaterSurfaces() {
  const waterInteriorGeometry = useMemo(() => {
    return new THREE.CircleGeometry(15, 25);
  }, []);

  return (
    <>
      <WaterSurfaceSimple
        width={100}
        length={100}
        distortionScale={1}
        fxDistortionFactor={0.1}
        // fxDistortionFactor={0.01}
        speed={0.1}
        // position={[0, 0.2, 0]}
        position={[0, -0.05, 0]}
      >
        {/* <WaterSurfaceSimple
        width={300}
        length={300}
        distortionScale={1}
        fxDistortionFactor={0.1}
        // fxDistortionFactor={0.01}
        speed={0.1}
        position={[0, 0.2, 0]}
        // position={[0, -0.05, 0]}
      > */}
        {!isMobile && <FluidSim radius={0.0005} />}
        {/* <FluidSim radius={0.00025} /> */}
      </WaterSurfaceSimple>

      {/* <WaterSurfaceSimple
        width={175}
        length={175}
        distortionScale={1}
        fxDistortionFactor={0.1}
        // fxDistortionFactor={0.01}
        speed={0.2}
        position={[-150, -0.1, -220]}
      >
        <FluidSim radius={0.0005} />
      </WaterSurfaceSimple> */}
      {/* <WaterSurfaceSimple
        distortionScale={1}
        fxDistortionFactor={0.1}
        // fxDistortionFactor={0.01}
        speed={0.2}
        position={[100, -0.05, -200]}
      ></WaterSurfaceSimple> */}
      <WaterSurfaceSimple
        position={[-38.268, 0.3, -114.098]}
        geometry={waterInteriorGeometry}
        distortionScale={0.4}
        fxDistortionFactor={0.025}
        speed={0.2}
      >
        {!isMobile && <FluidSim radius={0.005} />}
      </WaterSurfaceSimple>
    </>
  );
}

// <WaterSurfaceSimple
//   width={100}
//   length={100}
//   distortionScale={1}
//   fxDistortionFactor={0.1}
//   // fxDistortionFactor={0.01}
//   speed={0.1}
//   // position={[0, 0.2, 0]}
//   position={[0, -0.05, 0]}
// >
//   {/* <WaterSurfaceSimple
//         width={300}
//         length={300}
//         distortionScale={1}
//         fxDistortionFactor={0.1}
//         // fxDistortionFactor={0.01}
//         speed={0.1}
//         position={[0, 0.2, 0]}
//         // position={[0, -0.05, 0]}
//       > */}
//   <FluidSim radius={0.0005} />
//   {/* <FluidSim radius={0.00025} /> */}
// </WaterSurfaceSimple>;

export default WaterSurfaces;
