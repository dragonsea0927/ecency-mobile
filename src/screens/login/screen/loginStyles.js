import EStyleSheet from "react-native-extended-stylesheet";

export default EStyleSheet.create({
  container: {
    margin: 0,
    padding: 0,
    backgroundColor: "#f1f1f1",
    flexDirection: "column",
  },
  header: {
    flexDirection: "row",
    padding: 0,
    backgroundColor: "white",
    marginBottom: 10,
    height: 200,
    flex: 0.4,
  },
  footer: {
    flex: 0.2,
    bottom: 0,
    marginTop: 10,
    height: 80,
    backgroundColor: "white",
    flexDirection: "row",
  },
  tabView: {
    alignSelf: "center",
    backgroundColor: "transparent",
  },
  tabbar: {
    alignSelf: "center",
    height: 40,
    backgroundColor: "white",
  },
  tabbarItem: {
    flex: 1,
    backgroundColor: "#ffffff",
    minWidth: "$deviceWidth",
    height: "$deviceHeight / 1.95",
  },
  steemConnectTab: {
    backgroundColor: "#fff",
    minWidth: "$deviceWidth",
    flex: 1,
    height: "$deviceHeight / 1.95",
  },
  mainButtonWrapper: {
    position: "absolute",
    right: 24,
    bottom: 24,
    flexDirection: "row",
  },
  footerButtons: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    position: "absolute",
    bottom: 45,
    left: "$deviceWidth / 2.3",
  },
});
