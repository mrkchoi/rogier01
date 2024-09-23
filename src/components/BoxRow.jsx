import React from 'react';
import Box from './Box';
import { BOX_COUNT } from './BoxGroup';

function BoxRow({ rowIdx }) {
  return (
    <>
      {Array.from({ length: BOX_COUNT.x }, (_, i) => {
        return (
          <Box
            key={i}
            position={[
              i - Math.floor(BOX_COUNT.x / 2),
              rowIdx - Math.floor(BOX_COUNT.y / 2),
              0,
            ]}
            rowIdx={rowIdx}
            colIdx={i}
          />
        );
      })}
    </>
  );
}

export default BoxRow;
