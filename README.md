# 🌍 GlobeClock
[![🌐 Live Website](https://img.shields.io/badge/Live%20Website-Visit-blue)](https://globeclock.netlify.app/)
[![📲 Download APK](https://img.shields.io/badge/Android-Download%20APK-green)](https://github.com/Sabithulla-16/Metal-Price-Visualizer/raw/main/GlobeClock.apk)
[![📦 PWA](https://img.shields.io/badge/PWA-Installable-orange)](https://globeclock.netlify.app/)
[![👨‍💻 Developer](https://img.shields.io/badge/Developer-Valtry-purple)](https://github.com/Sabithulla-16)

GlobeClock is a **real-time world clock and timezone utility platform** that lets users and developers work with global time effortlessly 🌍. It is built as a **Progressive Web App (PWA)**, includes **serverless APIs**, **embeddable widgets**, and is also available as an **Android APK**.

🌐 Live Website: https://globeclock.netlify.app/  
📲 Android APK: https://github.com/Sabithulla-16/Metal-Price-Visualizer/raw/main/GlobeClock.apk  

## ✨ Features
- 🌍 Real-time global timezone tracking
- ⏱️ Live updating clocks without refresh
- 🔄 Easy timezone comparison
- 📦 Installable Progressive Web App (PWA)
- 📲 Android APK support
- 🧩 Embeddable clock widgets
- ⚡ Fast, lightweight, responsive UI
- 🔌 Public APIs for time, timezone, list, and widgets

## 🔌 Public APIs
Timezone Details API:
GET https://globeclock.netlify.app/.netlify/functions/timezone?tz=America%2FNew_York

Current Time API:
GET https://globeclock.netlify.app/.netlify/functions/time?tz=America%2FNew_York

Timezone List API:
GET https://globeclock.netlify.app/.netlify/functions/list

Widget Page URL:
https://globeclock.netlify.app/?widget=1&tz=America%2FNew_York&clock=digital&theme=auto

Widget API:
GET https://globeclock.netlify.app/.netlify/functions/widget?tz=America%2FNew_York&clock=digital&theme=auto

These APIs can be used in web apps, mobile apps, dashboards, widgets, and automation workflows.

## 🛠️ Tech Stack
HTML5, CSS3, Vanilla JavaScript, Netlify Functions (Serverless), Service Workers, Web App Manifest

## 📥 Installation Options
PWA Installation: Open the website in Chrome or Edge and select Install App from the browser prompt.  
APK Installation: Download the APK, open it on your Android device, allow unknown sources if prompted, and complete installation.

⚠️ Note: The Install App option installs the PWA version. APK installation must be done manually due to Android security restrictions.

## 🎯 Use Cases
Instantly check global timezones, compare time across regions, build timezone-based apps using the API, embed live clock widgets, and automate time-based workflows.

## 📄 License
MIT License — free to use, modify, and distribute.

## 👨‍💻 Developer
Sabithulla  
GitHub: https://github.com/Sabithulla-16

## 📝 Note
This project was built as part of self-learning and practical experimentation with web technologies, timezones, widgets, and serverless APIs, intended for educational and utility purposes.
