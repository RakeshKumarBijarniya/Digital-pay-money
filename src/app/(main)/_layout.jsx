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
      <Drawer.Screen name="(tabs)" />
      <Drawer.Screen name="Profile" options={{ headerShown: false }} />
      <Drawer.Screen name="UpdateProfile" options={{ headerShown: false }} />
      <Drawer.Screen name="Electricity" options={{ headerShown: false }} />
      <Drawer.Screen name="DthRecharge" options={{ headerShown: false }} />
      <Drawer.Screen name="WaterPay" options={{ headerShown: false }} />
      <Drawer.Screen name="GasPay" options={{ headerShown: false }} />
      <Drawer.Screen name="LpgGasPay" options={{ headerShown: false }} />
      <Drawer.Screen name="LicBillPayment" options={{ headerShown: false }} />
      <Drawer.Screen name="MobileRecharge" options={{ headerShown: false }} />
      <Drawer.Screen name="BarCodeScanner" options={{ headerShown: false }} />
      <Drawer.Screen name="WalletToWallet" options={{ headerShown: false }} />
      <Drawer.Screen name="History" options={{ headerShown: false }} />
      <Drawer.Screen name="WalletTopUp" options={{ headerShown: false }} />
    </Drawer>
  );
};

export default MainStack;
