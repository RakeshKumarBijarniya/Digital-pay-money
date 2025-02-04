import { Drawer } from "expo-router/drawer";
import CustomHeader from "@/src/component/atoms/CustomHeader";
import DrawerContent from "../../component/atoms/DrawerContent";
const MainStack = () => {
  return (
    <Drawer
      screenOptions={{
        headerTitle: "",
        drawerStyle: { backgroundColor: "#ffff", width: 300 },
        headerStyle: { margin: 20 },
        header: ({ navigation }) => <CustomHeader navigation={navigation} />,
        headerShown: true,
        headerTitle: "",
        headerTransparent: true,
      }}
      drawerContent={(props) => <DrawerContent {...props} />}
    >
      <Drawer.Screen name="index" />
      <Drawer.Screen name="Profile" options={{ headerShown: false }} />
      <Drawer.Screen name="UpdateProfile" options={{ headerShown: false }} />
      <Drawer.Screen name="Electricity" options={{ headerShown: false }} />
      <Drawer.Screen name="DthRecharge" options={{ headerShown: false }} />
      <Drawer.Screen name="WaterPay" options={{ headerShown: false }} />
      <Drawer.Screen name="(tabs)" />
    </Drawer>
  );
};

export default MainStack;
