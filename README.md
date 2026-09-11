<div align="center">

# 🏃 No Run — Ultra-Realistic GPX & Strava Telemetry Engine

**Générez des tracés sportifs ultra-réalistes et calibrés pour Strava, Garmin & Apple Watch.**

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Website](https://img.shields.io/badge/Website-no--run.com-fc5200?style=flat-square)](https://no-run.com)

</div>

---

## ⚡ Présentation

**No Run** est une application web moderne conçue pour concevoir, modéliser et exporter des fichiers GPX d'activités sportives (course à pied, cyclisme, natation). 

L'algorithme modélise les données biomécaniques réelles pour produire une télémétrie indétectable :
- **Altimétrie SRTM** : Dénivelé calculé à partir de modèles topographiques réels.
- **Asservissement physiologique GAP** (*Gradient Adjusted Pace*) : Ralentissement réaliste en côte et relance en descente.
- **Variabilité Cardiaque (FC)** : Simulation de la fréquence cardiaque avec dérive thermique et pics d'effort.
- **Signatures matérielles** : Métadonnées calibrées pour Garmin Forerunner, Apple Watch et Wahoo.

---

## 🚀 Fonctionnalités Clés

- 🗺️ **Cartographie Vectorielle Épurée** : Interface Leaflet & MapLibre propulsée par CartoDB Positron pour une lisibilité maximale.
- 📐 **Calcul d'Itinéraire Automatique** : Magnétisme aux routes et sentiers pédestres/cyclables via OSRM.
- 📈 **Profil d'Élévation Interactif** : Visualisation continue du profil altimétrique et de la pente.
- ⏱️ **Télémétrie Personnalisable** : Sélection de l'allure cible (min/km ou km/h), heure de départ, dispersion aléatoire réaliste.
- 🔒 **Confidentialité & RGPD** : Sauvegarde locale dans le navigateur (`localStorage`), aucun traçage intrusif, export direct côté client.
- 🛡️ **Sécurité Intégrée** : Headers HTTP renforcés (HSTS, CSP, X-Frame-Options) et limitation de débit (Rate Limiting).

---

## 🛠️ Stack Technique

- **Framework** : [Next.js 14](https://nextjs.org/) (App Router, mode Standalone)
- **Langage** : [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styles** : [Tailwind CSS](https://tailwindcss.com/) + Notion-style minimalism
- **Cartographie** : [Leaflet](https://leafletjs.com/) + [MapLibre GL](https://maplibre.org/)
- **Icônes** : [Lucide React](https://lucide.dev/)
- **Déploiement** : Docker multi-stage + Caddy (SSL automatique Let's Encrypt)

---

## 📦 Installation Locale

### Prérequis
- Node.js 18+ ou 20+
- npm, pnpm ou yarn

### Démarrage rapide

```bash
# 1. Cloner le dépôt
git clone https://github.com/TETSUYAV/no-run.git
cd no-run

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

---

## 🐳 Déploiement en Production (Docker + Caddy)

Le projet inclut une configuration Docker optimisée avec Caddy pour obtenir automatiquement un certificat SSL HTTPS :

```bash
# Lancer les conteneurs en tâche de fond
docker compose up -d --build
```

---

## 📄 Licence

Ce projet est sous licence open-source [MIT](LICENSE).
