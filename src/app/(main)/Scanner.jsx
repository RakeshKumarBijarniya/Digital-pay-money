// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Linking,
// } from "react-native";
// import * as BarCodeScanner from "expo-barcode-scanner"; // ✅ Correct Import

// const Scanner = () => {
//   const [hasPermission, setHasPermission] = useState(null);
//   const [scanned, setScanned] = useState(false);

//   useEffect(() => {
//     (async () => {
//       const { status } = await BarCodeScanner.requestPermissionsAsync();
//       setHasPermission(status === "granted");
//     })();
//   }, []);

//   const handleBarCodeScanned = ({ type, data }) => {
//     setScanned(true);
//     console.log("Scanned QR Data:", data);

//     if (data.startsWith("upi://pay") || data.startsWith("http")) {
//       Linking.openURL(data);
//     } else {
//       alert("Invalid QR Code!");
//     }
//   };

//   if (hasPermission === null) {
//     return (
//       <View style={styles.center}>
//         <Text>Requesting camera permission...</Text>
//       </View>
//     );
//   }
//   if (hasPermission === false) {
//     return (
//       <View style={styles.center}>
//         <Text>No access to camera</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <BarCodeScanner.BarCodeScanner
//         onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
//         style={StyleSheet.absoluteFillObject}
//       />

//       {scanned && (
//         <TouchableOpacity
//           onPress={() => setScanned(false)}
//           style={styles.scanButton}
//         >
//           <Text style={styles.buttonText}>Scan Again</Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   scanButton: {
//     position: "absolute",
//     bottom: 50,
//     backgroundColor: "#007AFF",
//     padding: 12,
//     borderRadius: 8,
//   },
//   buttonText: {
//     color: "white",
//     fontSize: 16,
//   },
// });

// export default Scanner;
