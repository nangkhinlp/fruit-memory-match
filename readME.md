# Fruit Memory Match

**Date:** 4/11/2026  
**Live Game:** [Play here](https://nangkhinlp.github.io/fruit-memory-match)  
**Source Code:** [GitHub Repo](https://github.com/nangkhinlp/fruit-memory-match)

---

## Game Objective

Flip cards two at a time to find matching fruit pairs. Match all 10 pairs
in as few errors as possible. Your best score is saved between sessions.

---

## Rules

1. Cards are shown face-up briefly at the start — memorize them!
2. Click any card to flip it over.
3. Click a second card to try and find its match.
4. Matched pairs stay face-up. Mismatches flip back over.
5. Win by matching all 10 pairs.

---

## Tech Used

- HTML5 (semantic landmarks)
- Bootstrap 5 (Navbar, Modal)
- CSS3 (custom properties, Grid/Flex, Google Fonts, animations)
- JavaScript ES Modules (`import` / `export`)
- Web Storage API (`localStorage`)

---

## Resources

- [Bootstrap 5 Docs](https://getbootstrap.com/docs/5.3/)
- [MDN ES Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [MDN localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [Google Fonts — Nunito](https://fonts.google.com/specimen/Nunito)
- [Constraint Validation API](https://developer.mozilla.org/en-US/docs/Web/API/Constraint_validation)
- [Nu HTML Validator](https://validator.w3.org/nu/)
- [WAVE Accessibility Checker](https://wave.webaim.org/)

---

## Code Explanation

### Shuffle algorithm

```js
function shuffleCards() {
    cardSet = cardList.concat(cardList);
    for (let i = 0; i < cardSet.length; i++) {
        const j = Math.floor(Math.random() * cardSet.length);

        let temp    = cardSet[i];
        cardSet[i]  = cardSet[j];
        cardSet[j]  = temp;
    }
}
```

doubles the list
loop through the list
get random index
and swap the cards 

---

## Validation

- [Nu Validator — Live Page](https://validator.w3.org/nu/?doc=https://YOUR-DEPLOYED-URL)
- [WAVE Checker — Live Page](https://wave.webaim.org/report#/https://YOUR-DEPLOYED-URL)

---

## Known Omissions

None.