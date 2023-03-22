import React, { useCallback, useContext, useEffect, useState } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import colors from "../config/colors";
import AuthContext from "../auth/context";

const shortenAddress = (address) => {
  return `${address.slice(0, 6)}...${address.slice(
    address.length - 4,
    address.length
  )}`;
};
//const msgParams = [convertUtf8ToHex(message), account[0]];

function Button({ onPress, label }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
}

function DisplayAddress({ pubAddress }) {
  if (pubAddress != null) {
    return <Text style={styles.resultText}>{pubAddress}</Text>;
  } else {
    return <Text style={styles.resultText}>NO ADDRESS</Text>;
  }
}
export default function WalletConnectExperience({ navigation }) {
  const authContext = useContext(AuthContext);
  const [pubAddress, setPubAddress] = useState([]);
  const [results, setResults] = useState([]);
  const connector = useWalletConnect();

  const personalSign = async (publicAddress, navigation) => {
    const nonceRes = await fetch("http://192.168.1.177:3000/api/token/" + publicAddress, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(response => response.json());
    const nonce = nonceRes.nonce;

    connector
      .signPersonalMessage([nonce, publicAddress, navigation])
      .then(async (results) => {
        console.log([results]);
        const loginRes = await fetch("http://192.168.1.177:3000/api/token/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            public_address: publicAddress,
            signed_nonce: results
          }),
        }).then(response => response.json());
        console.log(loginRes);
        if (results != null) {
          setResults(results);
          console.log(results);
          navigation.navigate("HomeScreen");
        }
      })
      .catch((error) => {
        // Error returned when rejected
        console.error(error);
      });
  };

  const connectWallet = useCallback(() => {
    connector.connect();
  }, [connector]);

  const killSession = useCallback(() => {
    return connector.killSession();
  }, [connector]);

  // Previous display of responses.

  //        <Text style={styles.resultText}>
  //          {shortenAddress(connector.accounts[0])}
  //        </Text>
  //        <Text style={styles.resultText}>
  //          {[connector, connector.accounts]}
  //        </Text>

  useEffect(() => {
    if (connector.connected) setPubAddress(connector.accounts[0]);
  });

  return (
    <>
      {!connector.connected ? (
        <Button onPress={connectWallet} label="Connect a Wallet" />
      ) : (
        <>
          <DisplayAddress pubAddress={pubAddress} />
          <Button
            onPress={() => personalSign(connector.accounts[0], navigation)}
            label="sign"
          />
          <Button onPress={killSession} label="Log out" />
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: colors.buttonColor,
    borderColor: colors.backgroundGrey,
    borderRadius: 25,
    borderWidth: 5,
    height: 70,
    paddingHorizontal: 16,
    paddingTop: 10,
    marginVertical: 15,
  },
  text: {
    color: colors.blue_text,
    fontSize: 18,
    fontFamily: "Rag_Bo",
  },
  resultText: {
    backgroundColor: colors.backgroundGrey,
    color: colors.red,
    fontSize: 18,
    alignItems: "center",
  },
});
