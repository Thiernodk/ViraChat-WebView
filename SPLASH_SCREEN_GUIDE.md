# Guide d'Installation du Splash Screen

## 📱 Configuration du Splash Screen

Le splash screen est maintenant configuré pour LimonTVBox et s'affichera pendant 3 secondes au démarrage de l'application.

## 🖼️ Installation de l'Image

1. **Remplacer le fichier** :
   - Remplacez `assets/splash.png` par votre image
   - Format recommandé : PNG
   - Dimensions optimales : 1280x720 (HD) ou 1920x1080 (Full HD)

2. **Compatibilité** :
   - ✅ Android (téléphones et tablettes)
   - ✅ Android TV
   - ✅ Paysage uniquement (orientation fixe)

## ⚙️ Configuration Technique

### App.js
```javascript
// État de gestion du splash
const [showSplash, setShowSplash] = useState(true);

// Gestion de la fin du splash
const handleSplashFinish = () => {
  setShowSplash(false);
};

// Affichage conditionnel
{showSplash ? (
  <SplashScreen onFinish={handleSplashFinish} />
) : (
  <SimpleInterface />
)}
```

### SplashScreen.js
```javascript
// Durée d'affichage : 3 secondes
setTimeout(() => {
  onFinish();
}, 3000);

// Style adaptatif
width: width * 0.8,  // 80% de la largeur
height: height * 0.6, // 60% de la hauteur
```

### app.json
```json
"splash": {
  "image": "./assets/splash.png",
  "resizeMode": "contain",
  "backgroundColor": "#000000"
}
```

## 🎯 Personnalisation

### Durée d'affichage
Modifiez la durée dans `SplashScreen.js` :
```javascript
// Changer 3000 (3 secondes) par la valeur souhaitée
setTimeout(() => {
  onFinish();
}, 5000); // 5 secondes
```

### Style de l'image
Modifiez les dimensions dans `SplashScreen.js` :
```javascript
splashImage: {
  width: width * 0.8,  // Ajuster le pourcentage
  height: height * 0.6, // Ajuster le pourcentage
  maxWidth: 400,  // Largeur maximale
  maxHeight: 600, // Hauteur maximale
}
```

## 🚀 Déploiement

Après avoir ajouté votre image :

1. **Rebuild l'application** :
   ```bash
   npx expo start --clear
   ```

2. **Test sur Android** :
   - Lancement de l'application
   - Splash screen pendant 3 secondes
   - Transition vers l'interface principale

3. **Test sur Android TV** :
   - Même comportement
   - Adaptation au format TV

## ✅ Vérification

- [ ] L'image s'affiche correctement
- [ ] Pas de déformation (resizeMode: "contain")
- [ ] Fond noir cohérent
- [ ] Durée de 3 secondes respectée
- [ ] Transition fluide vers l'application

## 📝 Notes

- Le splash screen utilise le même style que l'application (fond noir)
- L'image est centrée et adaptative
- Compatible avec toutes les tailles d'écran
- Optimisé pour Android et Android TV

---

**LimonTVBox - Splash Screen prêt à l'emploi !**
