import { useCubeTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

const SkyBox = () => {
    const { scene } = useThree();

    const texture = useCubeTexture(
        ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg"],
        { path: "assets/space/" }
    );


    scene.background = texture;
    return null;
}

export default SkyBox;
