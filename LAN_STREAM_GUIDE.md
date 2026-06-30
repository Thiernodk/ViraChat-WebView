# Guide de Configuration des Flux LAN pour LimonTVBox

## 📡 Configuration des Flux LAN (m3u8)

### 🎯 Objectif
Permettre à LimonTVBox de lire les flux locaux/LAN comme `http://192.168.172.253:8080/hls/test.m3u8`

## 🔧 Configuration Automatique

### ✅ Détection des Flux LAN
L'application détecte automatiquement les flux LAN :
- **URL contenant `192.168`** : Flux local
- **URL contenant `localhost`** : Flux local

### ⚙️ Optimisations LAN

#### **Buffer optimisé**
```javascript
// Flux LAN : Buffer plus petit pour réactivité
minBufferMs: 3000ms (vs 5000ms internet)
maxBufferMs: 10000ms (vs 15000ms internet)
bufferForPlaybackMs: 1500ms (vs 2000ms internet)
```

#### **Tentatives de rechargement**
- **Flux LAN** : 3 tentatives avec 2 secondes d'attente
- **Flux Internet** : 2 tentatives avec 1 seconde d'attente

#### **Logging amélioré**
- Détection du type de flux (LAN/Internet)
- Messages d'erreur spécifiques aux flux LAN
- Conseils de dépannage intégrés

## 📋 Prérequis pour les Flux LAN

### 🖥️ Serveur de Streaming
Assurez-vous que votre serveur de streaming est :
- ✅ **En cours d'exécution** : Service démarré
- ✅ **Accessible** : `http://192.168.X.X:PORT`
- ✅ **Format compatible** : HLS (.m3u8)
- ✅ **Réseau** : Sur le même réseau que l'appareil

### 📱 Configuration Réseau
- ✅ **Même réseau** : Appareil et serveur sur le même WiFi/réseau
- ✅ **Port ouvert** : Port du serveur accessible
- ✅ **Firewall** : Autorise le trafic sur le port

## 🐛 Dépannage des Flux LAN

### ❌ Erreurs Communes

#### **1. "Unable to connect to server"**
**Cause** : Serveur inaccessible
**Solution** :
- Vérifiez que le serveur est en cours d'exécution
- Testez l'URL dans un navigateur
- Vérifiez l'adresse IP et le port

#### **2. "404 Not Found"**
**Cause** : URL incorrecte
**Solution** :
- Vérifiez le chemin du fichier m3u8
- Testez : `http://192.168.X.X:PORT/fichier.m3u8`
- Vérifiez la casse des noms de fichiers

#### **3. "Timeout"**
**Cause** : Réseau lent ou serveur surchargé
**Solution** :
- Augmenter le timeout dans la configuration
- Vérifier la bande passante du réseau
- Optimiser le serveur de streaming

#### **4. "CORS Error"**
**Cause** : Politique CORS du serveur
**Solution** :
- Configurer CORS sur le serveur
- Autoriser les requêtes depuis mobile
- Utiliser des headers appropriés

### 🔍 Tests de Connexion

#### **Test 1 : Navigateur**
```bash
# Test dans un navigateur sur le même réseau
http://192.168.172.253:8080/hls/test.m3u8
```

#### **Test 2 : VLC**
```bash
# Ouvrir dans VLC (Menu > Ouvrir flux réseau)
http://192.168.172.253:8080/hls/test.m3u8
```

#### **Test 3 : cURL**
```bash
# Test de connexion
curl -I http://192.168.172.253:8080/hls/test.m3u8
```

## 📊 Configuration Exemple

### ✅ channel_old.json
```json
{
  "channels": [
    {
      "id": 1,
      "name": "Limon+ TV",
      "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/TF1_logo_2013.svg/512px-TF1_logo_2013.svg.png",
      "url": "http://192.168.172.253:8080/hls/test.m3u8",
      "group": "LAN TV",
      "description": "Chaîne locale",
      "language": "fr",
      "country": "CF",
      "category": "general",
      "isHD": true,
      "isFHD": true,
      "is4K": false
    }
  ]
}
```

### 🖥️ Serveur de Streaming Exemple

#### **FFmpeg HLS**
```bash
ffmpeg -re -i input.mp4 -c:v libx264 -c:a aac -f hls -hls_time 10 -hls_list_size 6 -hls_segment_filename segment%d.ts test.m3u8
```

#### **Node.js avec express**
```javascript
const express = require('express');
const app = express();

app.use(express.static('public'));
app.listen(8080, '192.168.172.253', () => {
  console.log('Serveur démarré sur http://192.168.172.253:8080');
});
```

## 📱 Utilisation dans LimonTVBox

### 🎯 Étapes
1. **Configurer** : Ajoutez vos flux LAN dans `channel_old.json`
2. **Démarrer** : Lancez votre serveur de streaming
3. **Tester** : Vérifiez l'URL dans un navigateur
4. **Lancer** : Démarrez LimonTVBox
5. **Sélectionner** : Cliquez sur LISTE et choisissez votre chaîne

### 🔍 Logs de Débogage
L'application affiche dans la console :
- `=== CHARGEMENT DU FLUX DÉMARRÉ ===`
- `Type de flux (LAN?): true/false`
- `=== ERREUR FLUX LAN DÉTECTÉE ===` (si erreur)

## 🚀 Performance

### ⚡ Optimisations LAN
- **Buffer réduit** : Démarrage plus rapide
- **Retry intelligent** : 3 tentatives avec délai
- **Logging détaillé** : Aide au dépannage
- **Détection automatique** : Configuration adaptative

### 📈 Recommandations
- **Qualité** : 1080p max pour flux LAN
- **Bitrate** : 4-6 Mbps pour bonne qualité
- **Segmentation** : 10 secondes par segment HLS
- **Réseau** : WiFi 5GHz recommandé

---

**LimonTVBox - Support complet des flux LAN optimisé !**
