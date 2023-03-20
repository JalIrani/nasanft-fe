import React, { useContext, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import CountDown from "react-native-countdown-component";

import AppText from "../components/AppText";
import colors from "../config/colors";
import CustomButton from "../components/CustomButton";
import HelpButton from "../components/HelpButton";
import ScreenSetUp from "../components/ScreenSetUp";
import AuthContext from "../auth/context";
import UserIconBar from "../components/UserIconBar";

const timerExpired = false;

function HomeScreen({ navigation }) {
  const { user, token } = useContext(AuthContext);
  const [neoTime, setNeoTime] = useState(1679432820000);
  const [duration, setDuration] = useState(10);
  const [nextQuiz, setNextQuiz] = useState(10);
  const [loading, setLoading] = useState(true);

  const getNEO = async () => {
    return await fetch("http://192.168.1.177:3000/api/nft_data", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setNeoTime(data.date);
        cache.store("neoTime", data.date);
        return data;
      });
  };

  const getNFTDuration = () => {
    setLoading(true);
    const currentTime = Date.now();
    const endTime = neoTime;
    const difference = endTime - currentTime;
    console.log(
      "current " +
        currentTime +
        " endTime " +
        endTime +
        " difference " +
        difference
    );
    const seconds = Math.floor(difference / 1000).toFixed(0);
    setDuration(seconds);
    setLoading(false);
  };

  const getTilMidnight = () => {
    setLoading(true);
    var midnight = new Date();
    midnight.setHours(24);
    midnight.setMinutes(0);
    midnight.setSeconds(0);
    midnight.setMilliseconds(0);
    const remaining = Math.floor(
      (midnight.getTime() - new Date().getTime()) / 1000
    );
    console.log("remaining " + remaining);
    setNextQuiz(remaining);
    setLoading(false);
  };

  useEffect(() => {
    //getNEO();
    getNFTDuration();
    getTilMidnight();
  }, [duration, nextQuiz]);

  return loading ? (
    <Text>Loading</Text>
  ) : (
    <ScreenSetUp style={{ backgroundColor: colors.backgroundGrey }}>
      <UserIconBar navigation={navigation}></UserIconBar>

      <View style={styles.points}>
        <AppText color="red" fontSize={26}>
          SCORE PLACEHOLDER
        </AppText>
      </View>
      <View style={styles.timerBox}>
        <AppText fontSize={22}>Time until next quiz</AppText>
        <View style={{ flex: 1 }}>
          <View style={styles.counter1}>
            <Ionicons name="timer-outline" size={26} color={colors.blue_text} />
            <CountDown
              //has id prop to use to reset
              until={nextQuiz}
              size={30}
              onFinish={() => (timerExpired = true)}
              digitStyle={{ backgroundColor: "transparent" }}
              digitTxtStyle={{ color: colors.blue_text }}
              timeToShow={["H", "M", "S"]}
              timeLabels={{}}
              separatorStyle={{ color: colors.blue_text }}
              showSeparator
            />
          </View>
        </View>
      </View>

      <View style={styles.quizButton}>
        <CustomButton
          //set unclickable till timerExpired = true
          title="Start Daily Quiz"
          onPress={() => navigation.navigate("QuizScreen")}
          fontSize={28}
          fontFamily="Rag_Bo"
          borderColor="blue_text"
        />
      </View>
      <View
        style={{
          alignItems: "center",
          justifyContent: "flex-end",
          borderWidth: 5,
          borderColor: "yellow",
          height: 150,
          marginTop: 90,
        }}
      >
        <AppText fontSize={20}>Time until next NFT is awarded</AppText>
        <View style={styles.counter}>
          <Ionicons name="timer-outline" size={26} color={colors.blue_text} />
          <CountDown
            //has id prop to use to reset
            until={duration}
            size={30}
            onFinish={() => (timerExpired = true)}
            digitStyle={{ backgroundColor: "transparent" }}
            digitTxtStyle={{ color: colors.blue_text }}
            timeToShow={["D", "H", "M", "S"]}
            timeLabels={{}}
            separatorStyle={{ color: colors.blue_text }}
            showSeparator
          />
        </View>
      </View>
      <HelpButton navigation={navigation} />
    </ScreenSetUp>
  );
}

const styles = StyleSheet.create({
  backArrow: {
    borderRadius: 80,
    position: "absolute",
    right: "90%",
    top: 50,
  },
  counter: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  counter1: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  counterIcon: {
    alignSelf: "center",
  },
  points: {
    alignItems: "center",
    height: 100,
    top: 10,
  },
  text: {
    alignSelf: "center",
  },
  timerBox: {
    alignItems: "center",
    borderColor: "yellow",
    borderWidth: 5,
    height: 150,
    marginBottom: 50,
    paddingTop: 20,
  },
  quizButton: {
    alignSelf: "center",
    height: 80,
    marginBottom: 40,
    paddingBottom: 20,
    width: "80%",
  },
  userIcon: {
    borderColor: colors.backgroundGrey,
    borderRadius: 80,
    left: "90%",
    position: "absolute",
    top: 50,
  },
});
export default HomeScreen;

// goes where score placeholder is when user is set          {user.current_score}
