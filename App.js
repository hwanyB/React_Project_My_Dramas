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
  const [doneState, setDoneState] = useState(false);
  const [toDoText, setToDoText] = useState("");
  const [editToDoText, setEditToDoText] = useState("");
  const [toDos, setToDos] = useState({});
  const [showText, setShowText] = useState(false);

  const goTravel = () => setWorking(false);
  const goWork = () => setWorking(true);

  const done = false;
  const edit = false;

  useEffect(() => {
    loadToDos();
  }, []);

  const onChangeToDo = (payload) => {
    setToDoText(payload);
  };
  const onChangeEditToDo = (payload) => {
    setEditToDoText(payload);
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
      [Date.now()]: { toDoText, working, done, edit },
    });
    setToDos(newToDos);
    await saveToDos(newToDos);
    setToDoText("");
  };
  const deleteToDo = (key) => {
    Alert.alert("Delete To Do", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: async () => {
          const newToDos = { ...toDos };
          delete newToDos[key];
          setToDos(newToDos);
          await saveToDos(newToDos);
        },
      },
    ]);
  };

  const onShowTextPress = () => {
    setShowText(!showText);
  };

  const toggleToDo = (key) => {
    const newToDos = { ...toDos };
    Alert.alert(
      newToDos[key].done === false ? "Finish To Do" : "Cancle Done",
      "Are you sure?",
      [
        { text: "Cancel" },
        {
          text: "Sure",
          onPress: async () => {
            newToDos[key].done = !newToDos[key].done;
            setToDos(newToDos);
            await saveToDos(newToDos);
          },
        },
      ]
    );
  };

  const toggleSeeDone = () => {
    setDoneState(!doneState);
  };

  const editToDo = async (key) => {
    const newToDos = { ...toDos };
    newToDos[key].edit = !newToDos[key].edit;
    newToDos[key].toDoText = editToDoText;
    setToDos(newToDos);
    await saveToDos(newToDos);
    console.log(newToDos);
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
        <View style={styles.sideIconWrapper}>
          {showText && (
            <View style={{marginRight:20}}>
              <Text style={{color:"#283ac7", fontSize:15,fontWeight:"300"}}>
                {working ? "See Finished Tasks" : "See Where I've Been"}
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={{ marginRight: 10 }}
            onPressIn={onShowTextPress}
            onPressOut={onShowTextPress}
          >
            <FontAwesome name='question-circle-o' size={15} color='#283ac7' />
          </TouchableOpacity>
          <TouchableOpacity>
            <FontAwesome
              name={doneState ? "toggle-on" : "toggle-off"}
              size={30}
              color='#283ac7'
              onPress={toggleSeeDone}
            />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.toDoWrapper}>
          {Object.keys(toDos).map((key) =>
            toDos[key].working === working && toDos[key].done === doneState ? (
              <View key={key} style={styles.toDo}>
                <TouchableOpacity
                  onPress={() => toggleToDo(key)}
                  style={{ flex: 1 }}
                >
                  <FontAwesome name='check' size={20} color='#283ac7' />
                </TouchableOpacity>
                {toDos[key].edit === false ? (
                  <TouchableOpacity style={{ flex: 4 }}>
                    <Text
                      style={[
                        styles.toDoText,
                        {
                          textDecorationLine:
                            toDos[key].done === true ? "line-through" : "none",
                        },
                      ]}
                    >
                      {toDos[key].toDoText}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TextInput
                    onChangeText={onChangeEditToDo}
                    autoFocus={true}
                    style={styles.editInput}
                    placeholder={toDos[key].toDoText}
                    value={editToDoText}
                  />
                )}
                <TouchableOpacity
                  style={{ flex: 1, alignItems: "flex-end" }}
                  onPress={() => editToDo(key)}
                >
                  <FontAwesome
                    name={
                      toDos[key].edit === true ? "check-square-o" : "pencil"
                    }
                    size={20}
                    color='#283ac7'
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flex: 1, alignItems: "flex-end" }}
                  onPress={() => deleteToDo(key)}
                >
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
    marginTop: 10,
    flex: 1,
  },
  toDo: {
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  },
  toDoText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#283ac7",
  },
  editInput: {
    flex: 4,
    fontSize: 20,
    fontWeight: "600",
    color: "#283ac7",
    borderBottomColor: "#283ac7",
    borderBottomWidth: 1,
  },
  sideIconWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 15,
  },
});
