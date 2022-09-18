import { useLoader, useThree } from "@react-three/fiber";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import * as THREE from 'three'

const FootbalScene = () => {
    const { scene } = useThree();

    const texture = useLoader(RGBELoader, '/assets/orlando_stadium_4k.hdr');

    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
    scene.environment = texture;

 
    return null;
}

export default FootbalScene;
