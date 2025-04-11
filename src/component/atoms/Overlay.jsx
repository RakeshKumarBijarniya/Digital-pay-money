import { Canvas, Group, Path, BlendMode } from "@shopify/react-native-skia";
import { Dimensions, Platform, StyleSheet, View } from "react-native";

const { width, height } = Dimensions.get("window");

const innerDimension = 300;

const Overlay = () => {
  if (Platform.OS === "web") {
    return (
      <View
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: "rgba(0, 0, 0, 0.5)" },
        ]}
      />
    );
  }

  return (
    <Canvas
      style={
        Platform.OS === "android" ? { flex: 1 } : StyleSheet.absoluteFillObject
      }
    >
      <Group blendMode={BlendMode.Difference}>
        <Path
          path={`M0 0 H${width} V${height} H0 V0 Z 
                M${width / 2 - innerDimension / 2} ${
            height / 2 - innerDimension / 2
          } 
                h${innerDimension} v${innerDimension} h-${innerDimension} Z`}
          color="black"
          opacity={0.5}
        />
      </Group>
    </Canvas>
  );
};

export default Overlay;
