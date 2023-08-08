import { useMediaQuery, useTheme } from "@mui/material";
import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useRef } from "react";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

interface ModelMeshProps {
  gltf: GLTF;
  isMobile: boolean;
}
interface NFTModelProps {
  model: string;
}

const ModelMesh: React.FC<ModelMeshProps> = (props) => {
  const ref = useRef<any>();

  useFrame(({ mouse }) => {
    if (ref.current) {
      ref.current.rotation.y += 0.01;
    }
  });

  return <primitive object={props.gltf.scene} scale={2} position={[0, -4, 1]} ref={ref} />;
};

const NFTModel: React.FC<NFTModelProps> = (props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const gltf = useLoader(GLTFLoader, props.model);

  return (
    <Canvas style={{ height: isMobile ? 200 : isTablet ? 250 : 350, width: isMobile ? 200 : isTablet ? 250 : 300, margin: "auto" }}>
      <ambientLight intensity={1} />
      {/* <pointLight position={[0, 25, 10]} intensity={1.5} /> */}
      <spotLight intensity={1} angle={20} penumbra={1} position={[0, 20, 10]} castShadow />
      <ModelMesh gltf={gltf} isMobile={isMobile} />
      <OrbitControls enablePan={true} enableZoom={false} enableRotate={true} />
    </Canvas>
  );
};

export default NFTModel;
