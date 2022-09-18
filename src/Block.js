// import { useLoader } from '@react-three/fiber';
import React from 'react';


function Box({ position, visible }) {
    return (
        <mesh position={position} visible={visible}>
            <boxGeometry args={[0.95, 0.95, 0.95]} />
            <meshPhysicalMaterial color="red" />
        </mesh>)
}

export default Box;
