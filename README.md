# Kaesekaestchen

## Was ist Käsekästchen? 

Käsekästchen ist ein Strategiespiel mit einfachen Regeln, das ursprünglich mit Kariertempapier und Stift gespielt wird. Besonders beliebt ist es bei Schülerinnen und Schüler.
Die Regeln beim Spiel mit Stift und Kariertempapier lauten: 
- Es wird ein Spielfeld aufs karierte Papier gezeichnet. Größe und Form können dabei beliebig gewählt werden, nur das Spielfeldrand muss steht auf den Linen des KArierten Papier liegen.
- Danach wählt jeder Spieler einen Farbstift seiner Wahl  und es wird entschieden wer anfangen darf.
- Der Spieler der am Zug ist darf nun eine Seitenkante eines Quadrats des kariten Papiers in seiner Farbe nachzeichen.
    - sind dadurch alle Kanten des Quadrates nachgezeichnet, darf der Spieler das Quadrat in seiner Farbe färebn und ist nochmal am Zug
    - ansonsten ist der nächste Spieler an der Reihe
- Das ganze geht solang bis alle Quadrate auf dem Spielfeld mit farben der Spieler gefärbt sind.
- Es gewinnt der Spieler mit den meisten quadraten mit seiner Farbe


## Vereinfacherungen für das digitale Käsekästchen

- Das Spielfeld ist immer gleich Groß
- Das Spiel wurde auf 2 Spielerbegrenzt
- Spieler 1 ist immer rot und Spieler 2 immer Blau


## Anforderungen
- Node.js
- npm oder yarn
- Git
- Texteditor oder IDE

## Schritt-für-Schritt-Anleitung

1. Lade das Projekt von GitHub herunter:
    `git clone https://github.com/theSchmiddi/Kaesekaestchen.git`

2. Öffne ein Terminal und navigiere in den Projektordner.
3. Navigiere in den Server-Ordner mit: `cd server`
4. Führe `npm i` aus, um die Abhängigkeiten des Servers zu installieren.
5. Starte den Server mit `npm start` oder `yarn start`.
6. Öffne die Datei `client/src/config.js` in einem Texteditor.
7. Ändere `yourIP` auf die IP-Adresse des Rechners, auf dem der Server läuft.
8. Öffne ein weiteres Terminal und navigiere in den `Kaesekaestchen/client`-Ordner.
9. Starte den Client mit `npm start` oder `yarn start`.
10. Öffne auf Geräten, die sich im selben Netzwerk wie der Server befinden, einen Browser und rufe die Anwendung unter `http://+yourIP+:3000` auf. Beispiel: `http://192.168.0.100:3000`.

Bitte beachte, dass die IP-Adresse des Servers je nach Netzwerkkonfiguration unterschiedlich sein kann. Stelle sicher, dass du die richtige IP-Adresse verwendest.


## Anmerkung

Ich habe die Zeit unterschätzt die allein für die Entwicklung der Graphischen Oberfläche von Kaesekaestchen drauf gind, weswegen ich die geschätzen 13 eher 20+ wurden.