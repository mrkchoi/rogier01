import { useMemo, useRef } from 'react';
import { PlaneGeometry, RepeatWrapping, Vector2, Vector3 } from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { WaterSimple } from './WaterSimple';

import { WaterContext } from './WaterContext';

export default function WaterSurfaceSimple({
  width = 100,
  length = 100,
  dimensions = 2048,
  waterColor = 0x000000,
  position = [0, -0.1, 0],
  distortionScale = 0.7,
  fxDistortionFactor = 0.2,
  fxDisplayColorAlpha = 0.0,
  fxMixColor = 0x000000,
  children,
  geometry,
  speed = 0.5,
}) {
  const ref = useRef(null);
  const refPointer = useRef(new Vector2(0, 0));

  const gl = useThree((state) => state.gl);
  const waterNormals = useTexture('/assets/textures/waternormals.jpeg');
  // const waterNormals = useTexture('/assets/textures/floor-normal.webp');
  waterNormals.wrapS = waterNormals.wrapT = RepeatWrapping;
  waterNormals.repeat.set(45, 45);
  const geom = useMemo(() => new PlaneGeometry(width, length), [length, width]);
  const config = useMemo(
    () => ({
      textureWidth: dimensions,
      textureHeight: dimensions,
      waterNormals,

      waterColor: waterColor,
      distortionScale: distortionScale,
      fxDistortionFactor: fxDistortionFactor,
      fxDisplayColorAlpha: fxDisplayColorAlpha,
      fxMixColor: fxMixColor,
      fog: true,
      format: gl.encoding,
    }),
    [
      dimensions,
      distortionScale,
      fxDisplayColorAlpha,
      fxDistortionFactor,
      fxMixColor,
      gl,
      waterColor,
      waterNormals,
    ]
  );
  useFrame((state, delta) => {
    if (ref.current) ref.current.material.uniforms.time.value += delta * speed;
  });

  //const refPointer = useRef(new Vector2(0, 0));

  const waterObj = useMemo(
    () => new WaterSimple(geometry ?? geom, config),
    [geometry, geom, config]
  );

  const handlePointerMove = (e) => {
    refPointer.current = e.uv.multiplyScalar(2).subScalar(1);
    // console.log(e.uv);
  };

  return (
    <WaterContext.Provider value={{ ref: ref, refPointer: refPointer }}>
      <primitive
        ref={ref}
        onPointerMove={handlePointerMove}
        object={waterObj}
        rotation-x={-Math.PI / 2}
        position={position}
      />

      {children}
    </WaterContext.Provider>
  );
}
