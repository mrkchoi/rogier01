import React from 'react';
import Box from './Box';
import BoxRow from './BoxRow';

export const BOX_COUNT = {
  x: 36,
  y: 20,
};

function BoxGroup() {
  return (
    <>
      <group scale={0.15}>
        {Array.from({ length: BOX_COUNT.y }, (_, i) => {
          return <BoxRow key={i} rowIdx={i} />;
        })}
      </group>
    </>
  );
}

export default BoxGroup;
