import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";

const STORAGE_KEY = "@toDos";

export default function App() {
  const [working, setWorking] = useState(true);
  const [toDoText, setToDoText] = useState("");
  const [toDos, setToDos] = useState({});
  const goTravel = () => setWorking(false);
  const goWork = () => setWorking(true);

  useEffect(() => {
    loadToDos();
  }, []);

  const onChangeToDo = (payload) => {
    setToDoText(payload);
  };

  const saveToDos = async (toSave) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (error) {
      console.log("MESSAGE", error.message);
    }
  };

  const loadToDos = async () => {
    try {
      const s = await AsyncStorage.getItem(STORAGE_KEY);
      s !== null ? setToDos(JSON.parse(s)) : null;
    } catch (error) {
      console.log("MESSAGE", error.message);
    }
  };

  const addToDo = async () => {
    if (toDoText === "") {
      return;
    }
    const newToDos = Object.assign({}, toDos, {
      [Date.now()]: { toDoText, working },
    });
    setToDos(newToDos);
    await saveToDos(newToDos);
    setToDoText("");
    console.log(newToDos);
  };
  const deleteToDo = (key) => {
    Alert.alert("Delete To Do", "Are you sure?",[
      { text : "Cancel" },
      { text: "Delete",
      onPress: async () => {
        const newToDos = {...toDos};
        delete newToDos[key];
        setToDos(newToDos);
        await saveToDos(newToDos);
      },},
    ]);
    
  };

  return (
    <View style={styles.container}>
      <StatusBar style='light' />
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
          autoCapitalize='sentences'
          placeholder={working ? "Add a task" : "Where do you want to go?"}
          style={styles.input}
          placeholderTextColor='#fff'
        />
        <ScrollView style={styles.toDoWrapper}>
          {Object.keys(toDos).map((key) =>
            toDos[key].working === working ? (
              <View key={key} style={styles.toDo}>
                <Text style={styles.toDoText}>{toDos[key].toDoText}</Text>
                <TouchableOpacity onPress={() => deleteToDo(key)}>
                  <FontAwesome name='trash' size={20} color='#283ac7' />
                </TouchableOpacity>
              </View>
            ) : null
          )}
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
    fontWeight: "400",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#283ac7",
  },
  toDoWrapper: {
    marginTop: 30,
  },
  toDo: {
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  toDoText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#283ac7",
  },
});
