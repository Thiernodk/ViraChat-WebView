# 📺 Limon+ TV Box

Application TV Box moderne avec interface de contrôle overlay, reproduisant fidèlement le comportement d'un décodeur IPTV professionnel.

## 🎯 Concept

**Mode décodeur plein écran** - Aucune navigation par pages, uniquement un lecteur vidéo fullscreen avec overlay interactif.

## ✅ Fonctionnalités principales

### 🖥️ Comportement TV Box
- **Lancement direct** : Lecture automatique de la première chaîne
- **Plein écran permanent** : Mode paysage forcé
- **Interface overlay** : Contrôles qui apparaissent/disparaissent
- **Zapping fluide** : Changement de chaîne instantané

### 🎮 Contrôles télécommande
- **OK** : Afficher/cacher l'interface
- **↑↓** : Changer de chaîne (zapping)
- **←→** : Navigation dans les menus

### 📊 Interface de contrôle
- **En-tête** : Nom chaîne | Heure | Infos qualité
- **Barre EPG** : Programme en cours avec progression temps réel
- **Menu horizontal** : PROGRAMME | CHAÎNES | LISTE | RÉGLAGE
- **Contenu dynamique** : Selon l'onglet sélectionné

## 🎨 Design Limon+

- 🟢 **Vert principal** : `#00ff41` (Limon+)
- ⚫ **Noir transparent** : Fond overlay
- ⚪ **Blanc** : Texte principal
- ✨ **Effets** : Verre, ombres lumineuses, bordures vertes

## 📁 Structure du projet

```
LimonTVBox/
├── App.js                 # Application principale
├── app.json              # Configuration Expo
├── components/           # Composants UI
│   ├── Player.js         # Lecteur vidéo fullscreen
│   ├── ControlsOverlay.js # Interface de contrôle
│   ├── EPGBar.js         # Barre EPG avec progression
│   ├── ChannelList.js    # Liste des chaînes
│   └── MenuTabs.js       # Menus horizontaux
├── services/             # Services logiques
│   └── iptvService.js    # Service IPTV et EPG
└── assets/               # Ressources
```

## 🚀 Installation

```bash
# Cloner le projet
cd LimonTVBox

# Installer les dépendances
npm install

# Lancer l'application
npm start
```

## 📱 Commandes

```bash
# Développement
npm start          # Lancer Expo Dev Tools
npm run android    # Tester sur Android
npm run ios        # Tester sur iOS
npm run web        # Tester navigateur

# Production
npm run build      # Build de production
```

## 🔧 Configuration

### Sources IPTV
Modifier `services/iptvService.js` pour ajouter vos propres sources :

```javascript
// Remplacer les URLs par vos flux M3U réels
const mockChannels = [
  {
    id: '1',
    name: 'Votre Chaîne',
    logo: 'https://votre-logo.png',
    url: 'http://votre-flux.m3u8',
    category: 'Catégorie'
  }
];
```

### Mode paysage
L'application force automatiquement le mode paysage via :
- `app.json` : `"orientation": "landscape"`
- `expo-screen-orientation` plugin

## 🎮 Utilisation

1. **Lancement** : Logo Limon+ → Lecture auto première chaîne
2. **Afficher contrôles** : Appuyer sur OK ou toucher l'écran
3. **Zapper** : Flèches haut/bas pour changer de chaîne
4. **Menu** : Flèches gauche/droite pour naviguer
5. **Auto-cache** : Interface disparaît après 5 secondes

## 📋 Composants détaillés

### Player.js
- Lecteur vidéo `react-native-video`
- Mode plein écran permanent
- Pas de contrôles natifs
- Buffer optimisé pour streaming IPTV

### ControlsOverlay.js
- Interface complète avec animations
- Gestion timer auto-cache (5 secondes)
- Affichage rapide zapping (3 secondes)
- Intégration EPG temps réel

### EPGBar.js
- Programme en cours avec progression
- Programme suivant
- Mise à jour temps réel chaque seconde
- Style verre avec bordures vertes

### ChannelList.js
- Liste verticale des chaînes
- Logos + noms + catégories
- Système de favoris
- Chaîne active en surbrillance

### MenuTabs.js
- Menu horizontal 4 onglets
- Contenu dynamique par onglet
- Animations fluides
- Style Limon+ cohérent

## 🔍 Points clés du cahier des charges

✅ **Respecté** :
- Mode décodeur plein écran
- Interface overlay uniquement
- Zapping ultra rapide
- Design Limon+ (vert/noir/blanc)
- Comportement télécommande
- EPG temps réel
- Menu horizontal

✅ **Technologies** :
- React Native + Expo
- react-native-video (ExoPlayer)
- AsyncStorage pour favoris
- Animations fluides

## 🚨 Notes importantes

- **Test TV** : Utiliser une vraie TV ou émulateur TV
- **Télécommande** : Configurer les touches hardware
- **Streams** : Remplacer les URLs de démo par vos flux réels
- **Performance** : Optimisé pour streaming continu

## 📞 Support

Pour toute question sur l'intégration ou la personnalisation :

📧 **Contact** : support@limon.tv
🌐 **Documentation** : docs.limon.tv
💬 **Communauté** : community.limon.tv

---

*Développé avec ❤️ pour l'expérience TV ultime*
