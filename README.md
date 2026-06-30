# Opportun Messenger

Application mobile de messagerie d'entreprise premium pour la communication interne et la collaboration entre services.

## 🚀 Fonctionnalités Principales

### 💬 Messagerie Instantanée
- Messages texte avec support des émojis
- Partage de fichiers et d'images
- Indicateurs de lecture et de réception
- Notifications push en temps réel
- Conversations privées et de groupe

### 📞 Appels Audio/Video
- Appels audio HD
- Appels vidéo avec partage d'écran
- Conférences multi-participants
- Historique des appels détaillé
- Intégration avec les contacts de l'entreprise

### 📅 Réunions en Ligne
- Planification de réunions
- Salles de visioconférence
- Intégration calendrier
- Rappels automatiques
- Enregistrement des sessions

### 📁 Partage et Collaboration
- Stockage sécurisé des documents
- Partage de fichiers de tout format
- Permissions d'accès granulaires
- Versioning des documents
- Recherche avancée

## 🛠️ Installation

### Prérequis

- **Node.js** >= 16.0.0
- **npm** >= 8.0.0
- **React Native CLI**
- **Android Studio** (pour Android)
- **Xcode** (pour iOS)

### Installation des Dépendances

```bash
# Cloner le projet
git clone https://github.com/opportun/opportun-messenger.git
cd opportun-messenger

# Installer les dépendances
npm install

# Installation des dépendances iOS
cd ios && pod install && cd ..
```

### Configuration Environment

```bash
# Copier le fichier d'environnement
cp .env.example .env

# Configurer les variables
nano .env
```

Variables requises:
```
API_URL=https://api.opportun-messenger.com
WEBSOCKET_URL=wss://ws.opportun-messenger.com
PUSH_NOTIFICATION_KEY=votre_cle_firebase
GOOGLE_SIGNIN_KEY=votre_cle_google
MICROSOFT_CLIENT_ID=votre_id_microsoft
```

## 🏃‍♂️ Lancement

### Développement

```bash
# Démarrer le serveur Metro
npm start

# Lancer sur Android
npm run android

# Lancer sur iOS
npm run ios

# Version Web
npm run web
```

### Production

```bash
# Build Android
npm run build:android

# Build iOS
npm run build:ios
```

## 📱 Structure du Projet

```
opportun-messenger/
├── src/
│   ├── components/          # Composants réutilisables
│   ├── screens/            # Écrans de l'application
│   ├── navigation/         # Configuration navigation
│   ├── services/           # Services API
│   ├── utils/              # Utilitaires
│   ├── hooks/              # Hooks personnalisés
│   ├── store/              # Gestion d'état
│   └── types/              # Types TypeScript
├── assets/                 # Images et ressources
├── android/               # Configuration Android
├── ios/                   # Configuration iOS
├── styles.css             # Styles globaux
└── *.html                 # Interfaces HTML/CSS
```

## 🎨 Interfaces HTML/CSS

Le projet inclut des interfaces complètes exportables créées avec Stitch:

- **splash.html** - Écran de lancement
- **login.html** - Connexion utilisateur
- **otp.html** - Vérification 2FA
- **home.html** - Tableau de bord
- **chats.html** - Liste des conversations
- **conversation.html** - Interface de chat
- **groups.html** - Groupes par département
- **calls.html** - Historique des appels
- **audio-call.html** - Interface appel audio
- **video-call.html** - Interface appel vidéo
- **meetings.html** - Réunions programmées
- **meeting-room.html** - Salle visioconférence
- **files.html** - Fichiers partagés
- **notifications.html** - Centre de notifications
- **profile.html** - Profil utilisateur
- **settings.html** - Paramètres application

## 🔧 Configuration React Native

### Android

1. **Configuration Firebase**:
```bash
# Télécharger google-services.json
# Placer dans android/app/
```

2. **Permissions**:
```xml
<!-- android/app/src/main/AndroidManifest.xml -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

### iOS

1. **Configuration Firebase**:
```bash
# Télécharger GoogleService-Info.plist
# Placer dans ios/Runner/
```

2. **Info.plist**:
```xml
<key>NSCameraUsageDescription</key>
<string>Cette application a besoin d'accéder à la caméra pour les appels vidéo</string>
<key>NSMicrophoneUsageDescription</key>
<string>Cette application a besoin d'accéder au microphone pour les appels audio</string>
```

## 🔐 Sécurité

### Authentification
- JWT tokens avec expiration
- Refresh tokens sécurisés
- Authentification biométrique
- 2-Factor Authentication (2FA)

### Chiffrement
- Messages chiffrés de bout en bout
- Fichiers chiffrés au repos
- Communications sécurisées (TLS 1.3)
- Stockage sécurisé des clés

### Permissions
- Contrôle d'accès granulaire
- Rôles et permissions par département
- Audit trail des actions
- Politiques de rétention

## 📊 Performance

### Optimisations
- Lazy loading des composants
- Virtualisation des listes
- Cache intelligent
- Compression des images
- Optimisation du bundle

### Monitoring
- Crash reporting avec Sentry
- Performance monitoring
- Analytics utilisateur
- Surveillance en temps réel

## 🧪 Tests

```bash
# Lancer les tests unitaires
npm test

# Tests avec coverage
npm run test:coverage

# Tests E2E
npm run test:e2e
```

### Structure des Tests

```
__tests__/
├── components/          # Tests composants
├── screens/            # Tests écrans
├── services/           # Tests services
├── utils/              # Tests utilitaires
└── e2e/                # Tests end-to-end
```

## 🚀 Déploiement

### Android

```bash
# Build APK
cd android
./gradlew assembleRelease

# Build AAB (Play Store)
./gradlew bundleRelease
```

### iOS

```bash
# Build pour App Store
cd ios
xcodebuild -workspace Runner.xcworkspace -scheme Runner -configuration Release archive
```

### Distribution

- **Google Play Store** (Android)
- **App Store** (iOS)
- **Enterprise Distribution** (Interne)
- **Web App** (Progressive Web App)

## 🔧 Développement

### Standards de Code

```bash
# Linter
npm run lint

# Formatter
npm run format

# Pre-commit hooks
npm run prepare
```

### Git Hooks

- **Pre-commit**: Linting et formatting
- **Commit-msg**: Validation des messages
- **Pre-push**: Tests automatiques

### Branching Strategy

```
main                    # Production
├── develop           # Développement
├── feature/*         # Nouvelles fonctionnalités
├── bugfix/*          # Corrections de bugs
├── hotfix/*          # Corrections urgentes
└── release/*         # Préparation release
```

## 📚 Documentation

### API Documentation

- **REST API**: `/api/docs`
- **WebSocket**: `/ws/docs`
- **GraphQL**: `/graphql/docs`

### Guides

- [Guide de démarrage rapide](docs/quickstart.md)
- [Guide de développement](docs/development.md)
- [Guide de déploiement](docs/deployment.md)
- [Guide de sécurité](docs/security.md)

## 🤝 Contribution

### Comment Contribuer

1. Fork le projet
2. Créer une branche `feature/nouvelle-fonctionnalite`
3. Committer les changements
4. Pusher vers la branche
5. Créer une Pull Request

### Convention de Commits

```
type(scope): description

feat: nouvelle fonctionnalité
fix: correction de bug
docs: mise à jour documentation
style: formatting code
refactor: refactoring code
test: ajout de tests
chore: maintenance
```

## 📞 Support

### Assistance Technique

- **Email**: support@opportun-messenger.com
- **Slack**: #opportun-support
- **Documentation**: [docs.opportun-messenger.com](https://docs.opportun-messenger.com)
- **Statut**: [status.opportun-messenger.com](https://status.opportun-messenger.com)

### FAQ

- [Questions fréquentes](docs/faq.md)
- [Dépannage](docs/troubleshooting.md)
- [Bonnes pratiques](docs/best-practices.md)

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🏆 Crédits

Développé avec ❤️ par l'équipe Opportun

- **Lead Developer**: [Jean Dupont](https://github.com/jeandupont)
- **UI/UX Designer**: [Marie Curie](https://github.com/mariecurie)
- **Backend Developer**: [Thomas Lambert](https://github.com/thomaslambert)
- **Mobile Developer**: [Sophie Dubois](https://github.com/sophiedubois)

## 📈 Roadmap

### Version 1.1 (Q1 2026)
- [ ] Intégration IA pour suggestions
- [ ] Templates de messages
- [ ] Réactions aux messages
- [ ] Mode sombre avancé

### Version 1.2 (Q2 2026)
- [ ] Appels de groupe
- [ ] Tableau blanc partagé
- [ ] Intégration calendrier avancée
- [ ] Widgets personnalisables

### Version 2.0 (Q3 2026)
- [ ] Interface bureau complète
- [ ] API publique
- [ ] Marketplace d'intégrations
- [ ] Analytics avancés

---

**Opportun Messenger** - La communication d'entreprise, réinventée.

Made with ❤️ by Opportun Team © 2026
