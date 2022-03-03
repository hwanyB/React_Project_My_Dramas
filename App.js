import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView
} from "react-native";

export default function App() {
  const [working, setWorking] = useState(true);
  const [toDoText, setToDoText] = useState("");
  const [toDos, setToDos] = useState({});
  const goTravel = () => setWorking(false);
  const goWork = () => setWorking(true);

  const onChangeToDo = (payload) => {
    setToDoText(payload);
  };

  const addToDo = () => {
    if (toDoText === "") {
      return;
    }
    const newToDos = Object.assign({}, toDos, {
      [Date.now()]: { toDoText, work: working },
    });
    setToDos(newToDos);
    setToDoText("");
    console.log(newToDos);
  };

  return (
    <View style={styles.container}>
      <StatusBar style='auto' />
      <View style={styles.header}>
        <TouchableOpacity>
          <Text
            style={[styles.btnText, { color: working ? "#fff" : "#4154e0" }]}
            onPress={goWork}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text
            style={[styles.btnText, { color: !working ? "#fff" : "#4154e0" }]}
            onPress={goTravel}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.main}>
        <TextInput
          returnKeyType='done'
          onSubmitEditing={addToDo}
          onChangeText={onChangeToDo}
          value={toDoText}
          autoCapitalize='sentence'
          placeholder={working ? "Add a task" : "Where do you want to go?"}
          style={styles.input}
          auto
        />
        <ScrollView style={styles.toDoWrapper}>
          {
            Object.keys(toDos).map(key => (
              <View key={key} style={styles.toDo}>
                <Text style={styles.toDoText}>{toDos[key].toDoText}</Text>
              </View>
            ))
          }
        </ScrollView>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#283ac7",
  },
  header: {
    flex: 0.5,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  btnText: {
    fontSize: 25,
    fontWeight: "700",
  },
  main: {
    backgroundColor: "#edeff7",
    flex: 10,
    paddingHorizontal: 30,
    borderTopStartRadius: 25,
    borderTopRightRadius: 25,
  },
  input: {
    marginTop: 40,
    borderRadius: 25,
    color: "#fff",
    fontSize: 20,
    fontWeight: 400,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#283ac7",
    placeholderTextColor: "#fff",
  },
  toDoWrapper : {
    marginTop:30,
  },
  toDo: {
    marginBottom:10,
  },
  toDoText: {
    fontSize: 20,
    fontWeight:"600",
    backgroundColor:"#fff",
    color:"#283ac7",
    borderRadius:5,
    paddingVertical: 10,
    paddingHorizontal:20,
  }
});
