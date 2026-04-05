# Timer mit Kalkulation

👉 [English version: see below](#english)

Eine browserbasierte Web-App zur Zeitmessung von Arbeitsabläufen und zur Kalkulation von Produktionskosten — ohne Backend, ohne Framework, läuft komplett lokal im Browser.

---

## Wofür ist die App da?

Du definierst einen Arbeitstitel (z. B. eine Rezeptur oder einen Produktionsablauf) und die einzelnen Arbeitsschritte dazu. Dann startest du eine Session — die Stoppuhr läuft und du klickst dich Schritt für Schritt durch. Am Ende exportierst du die gemessene Zeit in die Kalkulation, gibst deinen Preis ein und siehst sofort, wie viel Umsatz du in einem bestimmten Zeitraum (z. B. 60 Min) erzielen kannst.

**Typischer Ablauf:**

1. Arbeitstitel eingeben und speichern
2. Arbeitsschritte definieren (z. B. „Vorbereitung", „Produktion", „Reinigung")
3. Session starten → Stoppuhr läuft
4. Jeden Schritt mit „Nächster Schritt" abschließen → Zeit pro Schritt wird gemessen
5. Session beenden → Gesamtzeit und Zeiten pro Schritt sichtbar
6. „Zu Kalkulation exportieren" → gemessene Zeit wird übernommen
7. Preis (Netto oder Brutto) eingeben → Umsatz / Zeit wird automatisch berechnet

---

## Features

### Arbeitstitel & Schritte

* Beliebig viele Arbeitstitel speichern
* Schritte pro Titel definieren, bearbeiten und löschen
* Titel umbenennen oder löschen
* Letzter aktiver Titel wird beim Reload wiederhergestellt

### Stoppuhr & Session

* Präzise Stoppuhr (Stunden : Minuten : Sekunden . Hundertstel)
* Session-Modus: misst die Zeit für jeden einzelnen Schritt
* Drawer-Ansicht zeigt den aktiven Schritt und alle vergangenen Zeiten
* Session jederzeit abbrechbar

### Kalkulation

* **MwSt-Rechner**: Netto ↔ Brutto (7 %, 19 % oder eigener Satz)
* **Gemessene Zeit** aus Session importierbar oder manuell eingebbar
* **Produktionskosten auf Zeit**: Umsatz pro Zeitraum berechenbar
* Arbeitstitel in der Kalkulation per Dropdown auswählbar
* Felder werden beim Titelwechsel automatisch zurückgesetzt

### Datenpersistenz

* Speicherung im `localStorage`
* Einheitliches `dataStore`-Format mit Migration

### Technisch

* Kein Framework, kein Build-Step — HTML / CSS / Vanilla JS
* Zentraler `appState`
* Event-Handling über `addEventListener`
* Responsiv (Mobile & Desktop)

---

## Dateistruktur

```md
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
    └── ui.js
```

---

## Geplante Erweiterungen

### 1. Datenbank / Backend

Aktuell lokal im Browser gespeichert.
Geplant:

* SQLite oder PostgreSQL
* API (z. B. Go / FastAPI)
* Persistenz über Geräte hinweg

### 2. Rezepturverwaltung

Erweiterung zu einer vollständigen Produktions- und Kalkulations-App:

* Zutaten mit Preisen
* Mengenberechnung
* Verknüpfung mit Zeitmessung
* automatische Preisberechnung

### 3. User & Authentifizierung

Zukünftig:

* Benutzerkonten
* persönliche Daten & Projekte
* evtl. Teilen von Rezepturen

### 4. Migration zu TypeScript

Die aktuelle Vanilla-JS-Struktur eignet sich gut für eine spätere Migration zu TypeScript.

Ziel:

* mehr Typensicherheit
* klarere Datenstrukturen (`appState`, Steps, Sessions)
* bessere Wartbarkeit bei wachsender App

---

## Lokale Nutzung

Einfach `index.html` im Browser öffnen.

Optional Dev-Server:

```bash
npx serve timer01
# oder
python3 -m http.server --directory timer01
```

---

## English

A browser-based web app for measuring workflow time and calculating production costs — no backend, no framework, runs entirely in the browser.

---

## What is this app for?

You define a job title (for example a recipe or a production workflow) and add the individual work steps. Then you start a session — the stopwatch runs and you move through the steps one by one. At the end, you export the measured time into the calculation section, enter your price, and immediately see how much revenue can be generated within a specific period of time (for example 60 minutes).

**Typical workflow:**

1. Enter and save a job title
2. Define work steps (for example “Preparation”, “Production”, “Cleaning”)
3. Start a session → the stopwatch starts running
4. Complete each step with “Next Step” → time per step is measured
5. End the session → total time and step times are displayed
6. Export to calculation → measured time is transferred
7. Enter a net or gross price → revenue per time is calculated automatically

---

## Features (EN)

### Job Titles & Steps

* Save as many job titles as needed
* Define, edit, and delete steps for each title
* Rename or delete titles
* Restore the last active title after page reload

### Stopwatch & Session

* Precise stopwatch (hours : minutes : seconds . hundredths)
* Session mode tracks the time of each individual step
* Drawer view shows the active step and all previously measured times
* Session can be canceled at any time

### Calculation

* **VAT calculator**: net ↔ gross (7%, 19%, or a custom rate)
* **Measured time** can be imported from a session or entered manually
* **Time-based production calculation**: calculate revenue for a selected time period
* Job title can be selected in the calculation section via dropdown
* Fields are reset automatically when switching titles

### Data Persistence

* Data is stored in `localStorage`
* Unified `dataStore` format with migration support for older versions

### Technical

* No framework, no build step — plain HTML / CSS / Vanilla JavaScript
* Central `appState`
* Event handling via `addEventListener`
* Responsive layout for mobile and desktop

---

## Planned Extensions

### 1. Database / Backend

At the moment, the app stores everything locally in the browser. Planned next steps:

* SQLite or PostgreSQL
* API layer (for example Go or FastAPI)
* Cross-device persistence

### 2. Recipe Management

The app can later be extended into a full production and pricing tool:

* Ingredients with prices
* Quantity calculations
* Link recipes with measured production time
* Automatic pricing calculations

### 3. Users & Authentication

Possible future features:

* User accounts
* Personal projects and saved data
* Optional sharing of recipes or workflows

### 4. Migration to TypeScript

The current Vanilla JavaScript structure is a solid base for a future migration to TypeScript.

Goals:

* better type safety
* clearer data structures (`appState`, steps, sessions)
* improved maintainability as the app grows

---

## Local Usage

Open `index.html` in your browser.

Optional local development server:

```bash
npx serve timer01
```
