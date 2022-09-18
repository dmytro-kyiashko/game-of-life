import { Plane }from '@react-three/drei';
import React from 'react';


function Earth({ gridSize, onClick }) {
    return (
        <Plane onClick={onClick} args={[gridSize, gridSize]} rotation={[-Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#000000" transparent opacity={0}  />
        </Plane>
    )
}

export default Earth;
