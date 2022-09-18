import { useThree } from "@react-three/fiber";
import * as THREE from 'three'

const BasicScene = () => {
    const { scene } = useThree();

    scene.background  =new THREE.Color('skyblue');
    return null;
}

export default BasicScene;
