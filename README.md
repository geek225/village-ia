# 🌍 Village IA — Le Sanctuaire des Agents & Esprits d'Afrique

[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

> **Village IA** est une plateforme web immersive où une communauté d'agents intelligents inspirés des traditions africaines collaborent pour résoudre des quêtes, concevoir des architectures et réaliser en direct des applications et mini-jeux jouables immédiatement.

---

## ✨ Points Forts & Fonctionnalités

### 🏛️ 1. Orchestration Multi-Agents & Débat Collaboratif
- **Le Griot (Messager)** : Réceptionne les requêtes et court au Palais Royal porter le message.
- **Le Roi (Souverain & Arbitre)** : Consulte les Masques Ancestraux et orchestre le binôme de spécialistes adapté à la quête.
- **Les Spécialistes en Relais** :
  - **Le Développeur** : Spécialiste frontend/backend, algorithmique et code exécutable.
  - **Le Chercheur** : Spécialiste données, sciences et documentation.
  - **La Créative** : Spécialiste design, UX, direction artistique et narration.
  - **Le Conseiller** : Spécialiste stratégie, affaires, éthique et synthèse.
- **La Guérisseuse (Garante de la Qualité)** : Vérifie, audite et scelle le livrable final avec recommandations.

### 🎮 2. Playground d'Applications & Jeux en Direct
- **Exécution instantanée** : Dès qu'une calculatrice, un mini-jeu (Snake, Pong, Pacman...) ou un widget est généré, il est immédiatement jouable en plein écran.
- **Simulateur multi-appareils** : Basculez en un clic entre les vues **Mobile (390px)**, **Tablette (768px)** et **Plein Écran Desktop**.
- **Contrôles Tactiles (D-Pad Virtuel)** : Jouez aux jeux au clavier physique ou avec les touches directionnelles tactiles superposées.
- **Export ZIP complet** : Téléchargez l'application générée prête pour un hébergement en production (Vercel, Netlify, GitHub Pages).
- **Auto-Guérison IA** : Si une anomalie survient pendant l'exécution, La Guérisseuse la détecte et Le Développeur la corrige à la volée.

### 🌿 3. Écosystème Vivant & Immersion Sensorielle
- **Paysage vectoriel animé** : Poissons qui sautent dans la rivière, femme qui pile le manioc, enfants qui jouent autour du puits, volaille et chèvre qui broutent, nuages dérivants et fumée des toits.
- **Paysage sonore procédural (Web Audio API)** : Bruissement du vent, chants d'oiseaux, pilonnage de manioc, pulsation des tam-tams et bruits d'animaux réactifs au clic (sans aucun fichier audio externe lourd).
- **Voix de synthèse africaine** : Récitation vivante des paroles des agents via Web Speech API.

### 🔮 4. Raccordement Universel des Modèles IA (Les Masques Sacrés)
- **Google Gemini** (Gemini 2.5 Flash & Pro)
- **OpenRouter** (Llama 3.3, Mistral, DeepSeek R1/V3, Claude 3.5, GPT-4o)
- **OpenAI** (Direct API GPT-4o)
- **xKiro** (Multi-modèles gratuits)
- **Agnes AI** (Passerelle IA)
- **Masques Personnalisés (BYOK)** : Branchez n'importe quel fournisseur compatible OpenAI avec votre propre clé API via les paramètres du Village.
- **Mode de Secours Autonome** : L'application fonctionne instantanément même sans aucune clé configurée grâce au moteur de simulation réaliste intégré.

---

## 🚀 Démarrage Rapide (Local)

### Prérequis
- [Node.js](https://nodejs.org/) v20 ou supérieur
- npm ou pnpm

### Installation

```bash
# 1. Cloner le projet
git clone https://github.com/VOTRE_PSEUDO/village-ia.git
cd village-ia

# 2. Installer les dépendances
npm install

# 3. (Optionnel) Configurer vos clés API
cp .env.example .env
# Éditez .env pour renseigner vos clés (Gemini, OpenRouter, OpenAI, etc.)

# 4. Lancer le serveur de développement
npm run dev
```

Ouvrez ensuite [http://localhost:5173](http://localhost:5173) dans votre navigateur.

---

## ☁️ Déploiement en 1 Clic sur Vercel

Le projet contient déjà un fichier [`vercel.json`](./vercel.json) optimisé pour les applications Single-Page React + Vite.

1. Poussez votre code sur votre compte **GitHub**.
2. Rendez-vous sur [Vercel](https://vercel.com/) et cliquez sur **Add New Project**.
3. Importez votre dépôt `village-ia`.
4. (Optionnel) Dans l'onglet **Environment Variables**, ajoutez vos clés API (`VITE_GEMINI_API_KEY`, `VITE_OPENROUTER_API_KEY`, etc.).
5. Cliquez sur **Deploy**. En moins de 2 minutes, votre Village IA est en ligne dans le monde entier !

---

## 🛠️ Scripts Utiles

```bash
# Lancer le serveur de développement
npm run dev

# Compiler pour la production (TypeScript + Vite)
npm run build

# Prévisualiser la version de production en local
npm run preview
```

---

## 🛡️ Sécurité & Confidentialité

- **Zero Credential Leak** : Les clés saisies par les utilisateurs dans les paramètres sont conservées exclusivement dans leur navigateur (`localStorage`).
- **Scanners automatisés** : Projet audité régulièrement avec **Semgrep**, **Trivy** et **Gitleaks** (0 vulnérabilité HIGH/CRITICAL).
- **Bac à sable Iframe** : Les mini-applications et jeux exécutés dans le Playground sont isolés dans des iframes sécurisées (`sandbox="allow-scripts allow-modals allow-same-origin"`).

---

## 📜 Licence

Ce projet est sous licence [MIT](LICENSE). Libre d'utilisation, de modification et de distribution.
