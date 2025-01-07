# Cleft Care

Architected and led the development of **Cleft Care**, a speech analysis mobile application built with **React Native**, **Google Cloud Run**, and **PostgreSQL**, designed to collect, process, and evaluate speech samples for clinicians globally. Developed and fine-tuned a **custom deep neural network model** for precise speech analysis, with backend APIs served via **AWS Lambda**. Integrated seamless data workflows and efficient audio recording functionalities, enabling secure storage and real-time analysis through **AWS S3** and **OHM Model APIs**. Implemented multilingual support and robust authentication mechanisms, enhancing clinicians' ability to access, analyze, and manage patient data effortlessly across borders.

- **Cleft Care API:** [Cleft Care API Repository](https://github.com/ameyalambat128/cleftcare-api)
- **OHM Model Inference API:** [OHM Inference API Repository](https://github.com/ameyalambat128/cleftcare-ohm-api)

## Features

### Core Functionalities:

- **User Authentication:** Secure login and user session management.
- **Record Management:** Add, edit, and manage patient records with details such as name, birthdate, gender, address, and hearing status.
- **Audio Recording:** Integrated audio recording and file uploads to AWS S3 for OHM analysis.
- **OHM Integration:** Real-time audio analysis with OHM Model API for predictive metrics.
- **Multilingual Support:** Available in **English** and **Kannada** using `i18n`.

## Setup and Installation

### **1. Prerequisites**

Ensure the following are installed:

- **Node.js** (v16+)
- **Expo CLI**
- **Android Studio** (For Android Emulator)
- **Xcode** (For iOS Simulator)

### **2. Installation**

Clone the repository and install dependencies:

```shell
git clone https://github.com/ameyalambat128/cleftcare-api.git
cd cleftCare
npm install
```

### **3. Build for Android**

To create a production build for Android:

```shell
cd android && ./gradlew assembleRelease
```

### **4. Install on Emulator with adb**

Deploy the APK to an emulator:

```shell
adb install /Users/ameya/Code/digitaldx/cleftCare/android/app/build/outputs/apk/release/app-release.apk
```

### **5. Start the Development Server**

Start the Expo development server:

```shell
bun start
```
