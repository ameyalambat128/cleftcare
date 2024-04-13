import Page from "@/components/Page";
import Colors from "@/constants/Colors";
import { formatDuration } from "@/lib/utils";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { Stack, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const InitialScreenState: React.FC<{
  onStartRecording: () => void;
}> = ({ onStartRecording }) => (
  <View style={styles.bodyContainer}>
    <Text style={styles.bodyText}>Hello! How are you?</Text>
    <TouchableOpacity onPress={onStartRecording} style={styles.recordButton}>
      <Feather name="mic" size={40} color="black" />
    </TouchableOpacity>
    <Text style={styles.instructions}>
      Press the audio icon to start recording
    </Text>
  </View>
);

const RecordingState: React.FC<{
  onStopRecording: () => void;
  timer: string;
}> = ({ onStopRecording, timer }) => {
  return (
    <View style={styles.bodyContainer}>
      <Text style={[styles.bodyText, { color: Colors.tint }]}>
        Hello! How are you?
      </Text>
      <TouchableOpacity
        onPress={onStopRecording}
        style={[styles.recordButton, styles.recording]}
      >
        <Feather name="mic" size={40} color="white" />
      </TouchableOpacity>
      <Text style={[styles.timer, { color: Colors.tint }]}>{timer}</Text>
      <Text style={styles.boldInstructions}>Recording started...</Text>
    </View>
  );
};

// TODO: Edit the 2 components below
const UploadingState: React.FC<{ timer: string }> = ({ timer }) => (
  <View style={styles.bodyContainer}>
    <Text style={styles.bodyText}>Hello! How are you?</Text>
    <TouchableOpacity
      onPress={() => console.log("Uploading...")}
      style={[styles.recordButton]}
    >
      <Feather name="mic" size={40} color="black" />
    </TouchableOpacity>
    <Text style={[styles.timer]}>{timer}</Text>
    <Text style={styles.boldInstructions}>Audio is uploading...</Text>
  </View>
);

const DoneState: React.FC<{ onDone: () => void }> = ({ onDone }) => (
  <View style={styles.bodyContainer}>
    <Text style={styles.bodyText}>Hello! How are you?</Text>
    <TouchableOpacity
      onPress={() => console.log("Uploading...")}
      style={[styles.recordButton]}
    >
      <Feather name="mic" size={40} color="black" />
    </TouchableOpacity>
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 50,
      }}
    >
      <AntDesign name="checkcircle" size={20} color={Colors.tint} />
      <Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          color: Colors.text,
          textAlign: "center",
        }}
      >
        Done
      </Text>
    </View>
  </View>
);

export default function Screen() {
  const router = useRouter();

  const [screenState, setScreenState] = useState<
    "initial" | "recording" | "uploading" | "done"
  >("initial");
  const [timer, setTimer] = useState<string>("00:00");

  const [completed, setCompleted] = useState(false);
  const recordingRef = useRef<Audio.Recording | null>(null);

  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [status, setStatus] = useState<Audio.RecordingStatus | null>(null);
  const [meter, setMeter] = useState(0);

  const onStartRecording = async () => {
    try {
      if (recordingRef.current) recordingRef.current.stopAndUnloadAsync();
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          // Android-specific settings
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });

        const { recording: newRecording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY,
          onRecordingStatusUpdate
        );

        recordingRef.current = newRecording;
        // await newRecording.startAsync();
        setScreenState("recording");
        console.log("Recording started");
      }
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const onRecordingStatusUpdate = async (newStatus: Audio.RecordingStatus) => {
    setStatus(newStatus);
    console.log("Recording status:", newStatus);
    if (newStatus.canRecord && newStatus.durationMillis != null) {
      const newFormattedTime = formatDuration(newStatus.durationMillis);
      setTimer(newFormattedTime); // Update the formatted time
    }
  };

  const onStopRecording = async () => {
    const currentRecording = recordingRef.current;
    if (!currentRecording) return;
    await currentRecording.stopAndUnloadAsync();
    setScreenState("uploading");
    console.log("Recording stopped");
    // const uri = currentRecording.getURI();
    // console.log("Recording URI:", uri);
    setTimeout(() => setScreenState("done"), 2000);
  };

  const onDone = () => {
    router.push("/(tabs)/record/two");
  };

  let content;
  switch (screenState) {
    case "initial":
      content = <InitialScreenState onStartRecording={onStartRecording} />;
      break;
    case "recording":
      content = (
        <RecordingState onStopRecording={onStopRecording} timer={timer} />
      );
      break;
    case "uploading":
      content = <UploadingState timer={timer} />;
      break;
    case "done":
      content = <DoneState onDone={onDone} />;
      break;
  }

  return (
    <Page
      style={{ flex: 1, backgroundColor: Colors.background }}
      headerShown={false}
    >
      <Stack.Screen
        options={{
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back-outline" size={30} color="black" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View>
              <TouchableOpacity
                onPress={() => {
                  router.push("/record/two");
                }}
              >
                <Text
                  style={[
                    styles.headerRightText,
                    completed ? { color: Colors.tint } : { color: "gray" },
                  ]}
                >
                  Next
                </Text>
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <View style={styles.container}>
        {content}
        <View style={styles.progressTextContainer}>
          <Text style={styles.progressText}>1/</Text>
          <Text style={styles.finalProgressText}>25</Text>
        </View>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  headerRightText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  bodyContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "92%",
  },
  bodyText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  recordButton: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 40,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F0E5E5",
  },
  recording: {
    backgroundColor: Colors.tint,
  },
  timer: {
    fontSize: 30,
    fontWeight: "500",
    color: Colors.text,
  },
  instructions: {
    fontSize: 16,
    marginTop: 50,
    color: Colors.secondaryText,
    textAlign: "center",
    width: "60%",
  },
  boldInstructions: {
    fontSize: 16,
    marginTop: 50,
    fontWeight: "bold",
    color: Colors.text,
    textAlign: "center",
  },
  progressTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    position: "relative",
    bottom: 0,
  },
  progressText: {
    fontSize: 18,
    fontWeight: "500",
    color: Colors.tint,
  },
  finalProgressText: {
    fontSize: 18,
    fontWeight: "500",
    color: Colors.secondaryText,
  },
});
