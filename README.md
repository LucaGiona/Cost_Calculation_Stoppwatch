<a id="top"></a>

# Timer mit Kalkulation

![Status](https://img.shields.io/badge/status-active-success)
![Tech](https://img.shields.io/badge/tech-VanillaJS-blue)
![Storage](https://img.shields.io/badge/storage-localStorage-orange)
![i18n](https://img.shields.io/badge/i18n-DE%20%7C%20EN-purple)

[GB English see below](#timer-with-calculation)

---

## Überblick

Eine browserbasierte Web-App zur Zeitmessung von Arbeitsabläufen und zur Kalkulation von Produktionskosten — ohne Backend, ohne Framework, läuft komplett lokal im Browser.

---

## Preview

![App Preview](/timer01/img/Stoppuhr.png)

---

## Wofür ist die App da?

Du definierst einen Arbeitstitel (z. B. eine Rezeptur oder einen Produktionsablauf) und die einzelnen Arbeitsschritte dazu. Dann startest du eine Session — die Stoppuhr läuft und du klickst dich Schritt für Schritt durch.

Am Ende exportierst du die gemessene Zeit in die Kalkulation, gibst deinen Preis ein und siehst sofort, wie viel Umsatz du in einem bestimmten Zeitraum erzielen kannst.

---

## Typischer Ablauf

1. Arbeitstitel eingeben und speichern
2. Arbeitsschritte definieren
3. Session starten → Stoppuhr läuft
4. Schritte einzeln abschließen → Zeit wird gemessen
5. Session beenden → Zeiten sichtbar
6. Export zur Kalkulation
7. Preis eingeben → Umsatz wird berechnet

---

## Features

### Arbeitstitel & Schritte

![Arbeitstitel](/timer01/img/Arbeitstitel.png)

![Schritte](/timer01/img/Schritte_eingeben.png)

- Beliebig viele Titel speichern
- Schritte erstellen, bearbeiten, löschen
- Titel umbenennen oder entfernen
- Letzter Titel wird automatisch geladen

### Stoppuhr & Session

![Stoppuhr](/timer01/img/Stoppuhr.png)

- Präzise Zeitmessung
- Schrittbasierte Session
- Drawer zeigt Fortschritt und Zeiten
- Session jederzeit abbrechbar

### Kalkulation

![Kalkulation](/timer01/img/Kalkulation1.png)

![Schnelltest](/timer01/img/Schnelltest.png)

- MwSt-Rechner (7 %, 19 %, custom)
- Zeit importieren oder manuell eingeben
- Umsatz pro Zeitraum berechnen
- Automatisches Reset bei Titelwechsel

### Datenpersistenz

- Speicherung über `localStorage`
- Zentrales `dataStore`-Format

### Technisch

- Vanilla JS (kein Framework)
- Modularer Aufbau
- Zentraler `appState`
- Event Handling via `addEventListener`
- Responsive Design

---

## Internationalisierung (DE / EN)

Die App unterstützt Deutsch und Englisch über ein leichtgewichtiges clientseitiges i18n-System.

### Umsetzung

- Texte über `translations.js`
- HTML nutzt `data-i18n` und `data-i18n-placeholder`
- Dynamische Texte via `t(key, vars)`
- Sprache wird in `localStorage` gespeichert

### Einschränkung

Die Screenshots im Info-Modal zeigen aktuell die deutsche Version der App.

---

## Dateistruktur

```text
timer01/
├── index.html
├── css/
│   ├── style.css
│   ├── steps.css
│   ├── accordion.css
│   └── timer-steps.css
└── js/
    ├── appState.js
    ├── storage.js
    ├── stopwatch.js
    ├── steps.js
    ├── kalkulation.js
    ├── costKalkulation.js
    ├── timer-steps.js
    ├── accordion.js
    ├── ui.js
    ├── i18n.js
    └── translations.js
```

---

<a id="english"></a>

# Timer with Calculation

![Status](https://img.shields.io/badge/status-active-success)
![Tech](https://img.shields.io/badge/tech-VanillaJS-blue)
![Storage](https://img.shields.io/badge/storage-localStorage-orange)
![i18n](https://img.shields.io/badge/i18n-DE%20%7C%20EN-purple)

🇩🇪 [Deutsche Version](#top)

---

## Overview

A browser-based web app for timing work processes and calculating production costs — no backend, no framework, runs entirely in the browser.

---
## Information

The screenshots in the info modal currently show the German version of the app.

---
## Preview

![App Preview](/timer01/img/Stoppuhr.png)

---

## What is the app for?

You define a work title (e.g. a recipe or production process) and the individual steps involved. Then you start a session — the stopwatch runs and you click through each step one by one.

At the end you export the measured time into the calculation, enter your price and immediately see how much revenue you can generate within a given time period.

---

## Typical Workflow

1. Enter and save a work title
2. Define work steps
3. Start session → stopwatch runs
4. Complete steps one by one → time is measured
5. End session → times are displayed
6. Export to calculation
7. Enter price → revenue is calculated

---

## Features

### Work Title & Steps

![Work Title](/timer01/img/Arbeitstitel.png)

![Define Steps](/timer01/img/Schritte_eingeben.png)

- Save any number of titles
- Create, edit and delete steps
- Rename or remove titles
- Last active title is automatically restored

### Stopwatch & Session

![Stopwatch](/timer01/img/Stoppuhr.png)

- Precise time measurement
- Step-based session
- Drawer shows progress and times
- Session can be cancelled at any time

### Calculation

![Calculation](/timer01/img/Kalkulation1.png)

![Quick Time Entry](/timer01/img/Schnelltest.png)

- VAT calculator (7%, 19%, custom)
- Import time or enter manually
- Calculate revenue per time period
- Automatic reset when switching titles

### Data Persistence

- Stored via `localStorage`
- Central `dataStore` format

### Technical

- Vanilla JS (no framework)
- Modular structure
- Central `appState`
- Event handling via `addEventListener`
- Responsive design

---

## Internationalisation (DE / EN)

The app supports German and English via a lightweight client-side i18n system.

### Implementation

- Texts via `translations.js`
- HTML uses `data-i18n` and `data-i18n-placeholder`
- Dynamic texts via `t(key, vars)`
- Language is stored in `localStorage`


---

## File Structure

```text
timer01/
├── index.html
├── css/
│   ├── style.css
│   ├── steps.css
│   ├── accordion.css
│   └── timer-steps.css
└── js/
    ├── appState.js
    ├── storage.js
    ├── stopwatch.js
    ├── steps.js
    ├── kalkulation.js
    ├── costKalkulation.js
    ├── timer-steps.js
    ├── accordion.js
    ├── ui.js
    ├── i18n.js
    └── translations.js
```
