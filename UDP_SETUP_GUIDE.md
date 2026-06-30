# Guide d'Installation UDP Multicast - Limon+ TV Box

## 🎯 Objectif
Permettre à l'application Limon+ TV Box de recevoir les flux IPTV UDP Multicast depuis votre réseau local.

## 📋 Prérequis

### 🌐 Configuration Réseau
- **Routeur compatible multicast** : Support IGMP v2/v3
- **Réseau local** : Appareil sur le même réseau que les flux UDP
- **Adresse multicast** : Typiquement 224.0.0.0/239.255.255.255

### 📱 Configuration Android
- **Expo Dev Client** OU **Build standalone** (Expo Go ne supporte pas UDP)
- **Permissions réseau** : Configurées automatiquement
- **WiFi activé** : Requis pour le multicast

## 🛠️ Installation

### 1. Lancement du Serveur Proxy
L'application inclut un serveur proxy intégré qui convertit automatiquement:
```
UDP://@239.1.1.1:1234 → http://localhost:8000/stream.m3u8
```

### 2. Ajout d'une Chaîne UDP

#### Via l'Interface:
1. Allez dans **RÉGLAGE** 
2. Section **UDP Multicast**
3. Cliquez sur **"+ Ajouter une chaîne UDP"**
4. Entrez:
   - **Nom**: Ex: "France 24 UDP"
   - **URL**: `udp://@239.1.1.1:1234`
5. Testez puis ajoutez

#### Formats d'URL Supportés:
```
udp://@239.1.1.1:1234
udp://224.1.1.1:5000
udp://@235.1.1.1:6000
```

## 🔧 Configuration Avancée

### FFmpeg (Optionnel)
Pour un proxy externe plus performant:

```bash
# Installation FFmpeg
sudo apt install ffmpeg  # Linux
brew install ffmpeg     # macOS

# Conversion UDP vers HLS
ffmpeg -i udp://@239.1.1.1:1234 -c copy -f hls http://localhost:8000/stream.m3u8
```

### MulticastLock Android
Pour les builds natives, le MulticastLock est automatiquement géré:

```java
// Activé automatiquement dans le service
WifiManager.MulticastLock multicastLock = wifiManager.createMulticastLock("limonMulticastLock");
multicastLock.acquire();
```

## 📺 Utilisation

### Navigation des Chaînes UDP
- Les chaînes UDP apparaissent avec les chaînes HTTP
- Indicateur **[UDP]** dans la liste
- Zapping normal avec les flèches

### Test de Connectivité
1. **Test réseau**: `ping 239.1.1.1` (peut ne pas répondre)
2. **Test flux**: Utiliser VLC: `udp://@239.1.1.1:1234`
3. **Test application**: Bouton "Tester UDP" dans l'interface

## 🚨 Dépannage

### Problèmes Communs

#### ❌ "Le flux UDP n'est pas accessible"
**Causes possibles:**
- Mauvaise adresse multicast
- Routeur ne supporte pas le multicast
- WiFi désactivé

**Solutions:**
- Vérifier l'adresse avec votre fournisseur IPTV
- Activer IGMP sur le routeur
- Tester avec VLC d'abord

#### ❌ "Serveur proxy ne démarre pas"
**Causes possibles:**
- Port 8000 déjà utilisé
- Permissions manquantes

**Solutions:**
- Changer de port dans les paramètres
- Redémarrer l'application

#### ❌ "Chaîne ajoutée mais pas de vidéo"
**Causes possibles:**
- Flux UDP incompatible
- Proxy en cours de démarrage

**Solutions:**
- Attendre 2-3 secondes après l'ajout
- Tester avec une autre URL UDP

### Logs de Débogage
Activez les logs dans la console pour diagnostiquer:

```javascript
console.log('UDP Proxy Status:', UDPProxyService.isProxyRunning());
console.log('Active Streams:', UDPProxyService.getActiveStreams());
```

## 📊 Performance

### Recommandations
- **Réseau WiFi 5GHz** : Meilleure performance multicast
- **Proximité routeur** : Signal optimal
- **Une seule chaîne UDP** : Éviter la surcharge

### Limitations
- **Max 5 flux UDP** simultanés recommandés
- **Buffer 2-3 secondes** pour la stabilité
- **WiFi requis** : Pas de support 4G/5G

## 🔐 Sécurité

### Réseau Local Uniquement
- Les flux UDP fonctionnent uniquement sur le réseau local
- Pas d'accès depuis Internet
- Isolation naturelle du réseau

### Permissions
```xml
<!-- AndroidManifest.xml -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.CHANGE_WIFI_MULTICAST_STATE" />
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
```

## 📞 Support

### Pour obtenir de l'aide:
1. Vérifiez votre configuration réseau
2. Testez avec VLC d'abord
3. Consultez les logs de l'application
4. Contactez votre fournisseur IPTV pour les adresses multicast

---

**Note**: Cette fonctionnalité requiert un environnement de développement ou une build standalone. Expo Go ne supporte pas les flux UDP directs.
