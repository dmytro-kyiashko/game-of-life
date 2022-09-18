import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'

import React from 'react';
import { extend } from '@react-three/fiber'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import Roboto from './Roboto_Regular.json'

extend({ TextGeometry })

function Title({ theme, gridSize }) {
    const font = new FontLoader().parse(Roboto);


    const colorByTheme = {
        'Space': '#ffffff',
        'Basic': '#cccccc'
    }
    const textOptions = {
       font,
       size: 7 / 50 * gridSize,
       height: 1 / 50 * gridSize
    };
    return (
       <mesh position={[-35 / 50 * gridSize, 30 / 50 * gridSize, 0]}>
          <textGeometry  args={['Game Of Life 3D', textOptions]} />
          <meshStandardMaterial attach='material' color={colorByTheme[theme]}/>
        </mesh>
     )
}

export default Title;
