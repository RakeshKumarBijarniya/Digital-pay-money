import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import React from "react";
import { moderateScale, scale } from "react-native-size-matters";

const latestArticels = [
  {
    image: require("@/src/assets/images/articleImage.png"),
    title: "Top Fashion Trends",
    subTitle: "Spring/Summer Collection",
    hasTags: ["Fashion", "Trends"],
    desc: "Explore the latest fashion trends for the upcoming season.",
    bottomTitle: "Fashionista Magazine",
    magazineIcon: require("@/src/assets/images/bookIcon.png"),
  },
  {
    image: require("@/src/assets/images/articleImage.png"),
    title: "Top Fashion Trends",
    subTitle: "Spring/Summer Collection",
    hasTags: ["Fashion", "Trends"],
    desc: "Explore the latest fashion trends for the upcoming season.",
    bottomTitle: "Fashionista Magazine",
    magazineIcon: require("@/src/assets/images/bookIcon.png"),
  },
];

const LatestArticles = () => {
  return (
    <View style={styles.mainContainer}>
      <Text style={{ fontFamily: "SansitaSwashedBold", fontSize: 17 }}>
        Latest Articles
      </Text>
      <ScrollView style={{ flexDirection: "row" }} horizontal={true}>
        {latestArticels.map((item, key) => (
          <View style={styles.styleItemsContainer} key={key}>
            <View style={styles.leftContainer}>
              <Image
                source={item.image}
                resizeMode="contain"
                style={{
                  width: moderateScale(100),
                  height: moderateScale(100),
                }}
              />
            </View>
            <View style={styles.rightContainer}>
              <Text>{item.title}</Text>
              <Text style={{ opacity: 0.6 }}>{item.subTitle}</Text>
              <View style={{ flexDirection: "row", gap: 10 }}>
                {item.hasTags.map((i, k) => (
                  <View key={k}>
                    <View
                      style={{
                        backgroundColor: "#dee1e3",
                        width: 80,
                        height: 30,
                        padding: 5,
                      }}
                    >
                      <Text
                        style={{
                          color: "#000000",
                          fontFamily: "SansitaSwashed",
                          fontSize: 15,
                        }}
                      >
                        {i}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
              <Text>{item.desc}</Text>
              <View
                style={{
                  flexDirection: "row",
                  flexShrink: 1,
                  justifyContent: "space-between",
                  paddingRight: 10,
                }}
              >
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <View
                    style={{
                      width: moderateScale(30),
                      height: moderateScale(30),
                      backgroundColor: "#79D7BE",
                      borderRadius: "50%",
                    }}
                  >
                    <Text></Text>
                  </View>
                  <Text style={{ top: 5 }}>{item.bottomTitle}</Text>
                </View>
                <Image source={item.magazineIcon} />
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#F6F4F0",
    top: 40,
    padding: 10,
    borderRadius: 10,
    height: 220,
    marginTop: 20,
    paddingBottom: 10,
    marginBottom: 50,
  },
  styleItemsContainer: {
    flexDirection: "row",
    width: moderateScale(330),
    marginRight: 20,
  },
  leftContainer: { flex: 1, width: "30%" },
  rightContainer: {
    flexShrink: 1,
    left: 10,
    gap: 10,
    width: "70%",
  },
});

export default LatestArticles;
