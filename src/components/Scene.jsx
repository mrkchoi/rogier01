import React, { useMemo } from 'react';
import * as THREE from 'three';
import Floor from './Floor';
import Sky from './Sky';
import BoxGroup from './BoxGroup';

function Scene() {
  return (
    <>
      <BoxGroup />
      <Floor />
      <Sky />
    </>
  );
}

export default Scene;
