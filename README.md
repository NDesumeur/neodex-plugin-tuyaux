# Tuyaux

Un jeu de réflexion : les tuyaux du quartier ont été tournés dans tous les sens. Fais-les pivoter pour que l'eau parte du château d'eau, au centre, et arrive à toutes les maisons.

*English version: [README.en.md](README.en.md)*

## Commandes

- **Clic** sur un tuyau : un quart de tour dans le sens des aiguilles d'une montre.
- **Clic droit** : un quart de tour dans l'autre sens.
- Une fois le niveau gagné : un clic pour passer au suivant.

## Les règles

- L'eau part du château d'eau et suit les raccords qui se touchent des deux côtés. Les tuyaux remplis changent de couleur, et une maison s'allume quand l'eau l'atteint.
- Le niveau est gagné quand toutes les maisons ont de l'eau. Le haut du plateau indique le nombre de maisons alimentées et de coups joués.
- Le réseau n'a jamais de boucle : chaque maison n'a qu'un seul chemin vers le château d'eau, et chaque niveau a toujours une solution.

## Niveaux et étoiles

- La grille commence en 5 × 5 et gagne une case de côté tous les 3 niveaux, jusqu'à 8 × 8.
- Chaque niveau compte le nombre minimal de quarts de tour nécessaires. **3 étoiles** si tu fais aussi bien, **2** jusqu'à une fois et demie ce nombre, **1** au-delà.
- Les niveaux sont toujours les mêmes, pour pouvoir les refaire. L'option **Réseaux au hasard** donne un réseau nouveau à chaque partie.

## Records

Le niveau le plus loin atteint, le total d'étoiles et le nombre de niveaux finis s'affichent à côté du jeu.

## Données et synchronisation

Niveau atteint, étoiles et niveaux finis sont enregistrés par NeoDex, sauvegardés et synchronisés entre tes PC si la synchro est activée.

## Installer

Dans NeoDex : **NeoStore → À découvrir → Tuyaux → Installer**.

Développer un plugin : voir le [SDK NeoDex](https://github.com/NDesumeur/neodex-sdk).

## Plein écran et grandes grilles

- **Plein écran** : bouton « PLEIN ÉCRAN ».
- **La grille remplit le cadre** : le plateau prend toute la place, quelle que soit la taille de la grille et de la fenêtre.
- **Grilles plus grandes** : la grille grandit tous les trois niveaux, de 5 × 5 jusqu'à 10 × 10 (niveau 16) puis 12 × 12 (niveau 22). La taille du niveau en cours s'affiche dans le cadre des records.
