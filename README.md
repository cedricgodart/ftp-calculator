# Calculateur FTP · FTP Calculator

Calculateur de FTP et de zones de puissance pour le spinning, l'indoor cycling et le vélo, à intégrer dans n'importe quel site. Français et anglais, sans dépendance, tout se calcule dans le navigateur.

*An embeddable FTP and power-zone calculator for spinning, indoor cycling and cycling. French and English, no dependencies, everything runs in the browser. [English below](#english).*

**En ligne :** [cedric.fm/spinning/ftp](https://cedric.fm/spinning/ftp/) · **Démo :** `index.html`

## Ce qu'il fait

Quatre onglets :

- **FTP connue** : les 7 zones de puissance (modèle de Coggan) en watts, en W/kg si le poids est renseigné, avec le ressenti de chaque zone en cours
- **Résultat d'un test** : la FTP à partir d'un test rampe (75 % de la meilleure minute), d'un test de 20 minutes (95 % de la moyenne) ou d'un effort d'une heure
- **Jamais testé** : une fourchette indicative selon le sexe, le poids et le nombre de séances par semaine
- **Zones cardiaques** : 5 zones à partir de la FC max mesurée, ou estimée avec la formule de Tanaka (208 moins 0,7 fois l'âge)

Aucune donnée n'est envoyée : pas de cookie, pas de requête, pas de stockage.

## Intégration

### N'importe quel site (HTML)

Copier `src/ftp-calculator.css` et `src/ftp-calculator.js`, puis :

```html
<link rel="stylesheet" href="ftp-calculator.css">

<div data-ftp-calculator data-lang="fr"></div>

<script src="ftp-calculator.js" defer></script>
```

- `data-lang` : `fr` ou `en`. Sans cet attribut, la langue de la page (`<html lang>`) puis celle du navigateur sont utilisées.
- `data-theme` : `light` ou `dark`. Sans cet attribut, le thème suit le réglage clair ou sombre de l'appareil.
- Plusieurs calculateurs peuvent cohabiter sur une même page.
- Pour un élément ajouté après le chargement : `FtpCalculator.mount(element)`.

### Astro et EmDash

Copier le dossier `src/` et `astro/FtpCalculator.astro` dans le projet (en ajustant les chemins d'import si besoin), puis :

```astro
---
import FtpCalculator from "../components/FtpCalculator.astro";
---
<FtpCalculator lang="fr" accent="#ff6b4a" />
```

### WordPress

Ajouter les deux fichiers au thème (ou via un bloc HTML personnalisé et une extension d'insertion de code), puis placer `<div data-ftp-calculator data-lang="fr"></div>` dans un bloc HTML.

## Personnalisation

Tous les styles sont cloisonnés sous `.ftp-calc` : ils ne touchent pas au reste du site. Les couleurs se règlent avec des variables CSS :

```css
.ftp-calc {
	--fc-accent: #ff6b4a;     /* onglet actif, boutons, focus */
	--fc-on-accent: #17191e;  /* texte sur l'accent */
	--fc-bg: #ffffff;         /* fond du calculateur */
	--fc-field: #f7f6f3;      /* champs et zone de résultat */
	--fc-text: #1d1d1b;
	--fc-muted: #6b6a65;
	--fc-border: #e3e1db;
	--fc-radius: 16px;
	--fc-font: inherit;
}
```

Les textes (dont le ressenti de chaque zone) se trouvent dans l'objet `I18N` en tête de `src/ftp-calculator.js`. Pour ajouter une langue, il suffit de dupliquer le bloc `en`.

## Méthodes et limites

| Calcul | Méthode |
|---|---|
| Zones de puissance | Coggan : Z1 ≤ 55 %, Z2 56 à 75 %, Z3 76 à 90 %, Z4 91 à 105 %, Z5 106 à 120 %, Z6 121 à 150 %, Z7 > 150 % de la FTP |
| Test rampe | FTP = 75 % de la meilleure minute |
| Test de 20 minutes | FTP = 95 % de la moyenne |
| FC max estimée | Tanaka : 208 moins 0,7 fois l'âge |
| Zones cardiaques | 50 à 60, 60 à 70, 70 à 80, 80 à 90 et 90 à 100 % de la FC max |

**À savoir :**

- Les fourchettes de l'onglet « Jamais testé » (objet `GUESS`) sont **indicatives**, ce ne sont pas des normes scientifiques. Elles servent de point de départ et gagnent à être ajustées à son public.
- Le test rampe a tendance à surestimer la FTP des profils explosifs, et le test de 20 minutes à pénaliser ceux qui gèrent mal leur effort.
- Les zones de puissance ne dépendent pas de l'âge : l'âge ne sert qu'à estimer la FC max.
- Ces calculs sont des repères d'entraînement, pas un avis médical.

## Transparence

Ce code a été écrit par Claude (Anthropic) sous la direction de Cédric Godart, prof de spinning certifié, qui a défini l'outil, validé les contenus et l'utilise en production sur [cedric.fm](https://cedric.fm/spinning/ftp/).

## Licence

MIT, voir [LICENSE](LICENSE). Un lien vers [cedric.fm/spinning/ftp](https://cedric.fm/spinning/ftp/) fait toujours plaisir, mais il n'est pas obligatoire.

---

## English

An embeddable FTP and power-zone calculator for spinning, indoor cycling and cycling, in French and English. No dependencies, no cookies, no network requests: everything is computed in the browser.

**Live:** [cedric.fm/spinning/ftp](https://cedric.fm/spinning/ftp/) (French) · **Demo:** `index.html` (FR/EN switch)

### Features

- **Known FTP**: 7 Coggan power zones in watts, and in W/kg when weight is entered, with a description of how each zone feels in class
- **Test result**: FTP from a ramp test (75% of best minute), a 20-minute test (95% of average) or a one-hour effort
- **Never tested**: an indicative range based on sex, weight and rides per week
- **Heart-rate zones**: 5 zones from a measured max HR, or one estimated with the Tanaka formula (208 minus 0.7 × age)

### Usage

```html
<link rel="stylesheet" href="ftp-calculator.css">
<div data-ftp-calculator data-lang="en"></div>
<script src="ftp-calculator.js" defer></script>
```

- `data-lang`: `fr` or `en` (falls back to `<html lang>`, then the browser language)
- `data-theme`: `light` or `dark` (defaults to the device setting)
- Several calculators can live on one page; call `FtpCalculator.mount(element)` for elements added later
- Astro/EmDash: use `astro/FtpCalculator.astro` (`<FtpCalculator lang="en" accent="#ff6b4a" />`)
- Theme it with the `--fc-*` CSS custom properties listed above; all styles are scoped under `.ftp-calc`
- Texts live in the `I18N` object at the top of `src/ftp-calculator.js`: duplicate the `en` block to add a language

### Caveats

The "Never tested" ranges (`GUESS` object) are indicative starting points, not scientific norms. Ramp tests tend to overestimate FTP for explosive riders. Power zones do not depend on age; age is only used to estimate max HR. Training guidance, not medical advice.

### Transparency

This code was written by Claude (Anthropic) under the direction of Cédric Godart, a certified spinning instructor who specified the tool, reviewed the content and runs it in production on [cedric.fm](https://cedric.fm/spinning/ftp/).

### License

MIT, see [LICENSE](LICENSE).
