"use strict";
// Unterschied String und Number
// console.log(206456);
// console.log("206456");


// gesamtbilanz
// neues Objekt anlegen:
const haushaltsbuch = {

    gesamtbilanz: new Map(),

    // gesamtbilanz: { (--> jetzt im Objekt als MAP zu finden)
    //     einnahmen: 0,
    //     ausgaben: 0,
    //     bilanz: 0
    // },

    // (Codeumbau --> bessere optische Strukturierung) (--> jetzt im Objekt zu finden als "gesamtbilanz")
    // let bilanz_einnahme = 0,
    //     bilanz_ausgabe = 0,
    //     bilanz = 0;
    // let bilanz = 206456 -5236; 

    // Eingabedaten vom Nutzer holen ->
    // Anmerkung: ein prompt liefert immer einen String zurück!!

    // Einträge zukünftig speichern können
    eintraege: [],

    // Fehler zukünftig abfangen, bevor sie ausgegeben werden
    fehler: [],

    // einen Eintrag hinzufügen

    eintragErfassen() {
        let neuerEintrag = new Map();
        neuerEintrag.set("titel", this.titelVerarbeiten(prompt("Wie heißt dein Eintrag?", "Gehalt")));
        neuerEintrag.set("typ", this.typVerarbeiten(prompt("Ist das eine Einnahme oder Ausgabe?")));
        neuerEintrag.set("betrag", this.betragVerarbeiten(prompt("Betrag (in Euro, ohne €-Zeichen)?")));
        neuerEintrag.set("datum", this.datumVerarbeiten(prompt("Datum (jjjj-mm-tt):").trim()));
        neuerEintrag.set("timeStamp", Date.now());
        if (this.fehler.length === 0) {
            this.eintraege.push(neuerEintrag);
        } else {
            console.log("Folgende Fehler wurden gefunden:");

            this.fehler.forEach(fehler => console.log(fehler));

            // jetzt als Arrow-Function geschrieben
            // this.fehler.forEach(function (fehler) {
            //     console.log(fehler); 
            // });
        }
    },

    titelValidieren(titel) {
        if (titel != "") {
            return true;
        } else {
            return false;
        }
    },

    titelVerarbeiten(titel) {
        titel = titel.trim();
        // Bsp.: "22,35" -> "23.35" -> 23.35 -> 2335
        //Prüfen auf korrektes Betragsformat
        if (this.titelValidieren(titel)) {
            return titel;
        } else {
            //console.log("Keinen Titel angegeben.");
            this.fehler.push("Keinen Titel angegeben."); // abfangen von Fehlern
        }
    },

    typValidieren(typ) {
        if (typ.match(/^(?:einnahme|ausgabe)$/i) != null) {
            return true;
        } else {
            return false;
        }
    },

    typVerarbeiten(typ) {
        typ = typ.trim().toLowerCase();
        //Prüfen auf korrekten Typ
        if (this.typValidieren(typ)) {
            return typ;
        } else {
            //console.log(`Ungültiger Eintrags-Typ: ${typ}. Bitte erneut eingeben!`);
            this.fehler.push(`Ungültiger Eintrags-Typ: ${typ}. Bitte erneut eingeben!`);  // abfangen von Fehlern
        }
    },

    betragValidieren(betrag) {
        if (betrag.match(/^\d+(?:(?:,|\.)\d\d?)?$/) != null) {
            return true;
        } else {
            return false;
        }
    },

    betragVerarbeiten(betrag) {
        betrag = betrag.trim();
        // Bsp.: "22,35" -> "23.35" -> 23.35 -> 2335
        //Prüfen auf korrektes Betragsformat
        if (this.betragValidieren(betrag)) {
            return parseFloat(betrag.replace(",", ".")) * 100;
        } else {
            // console.log(`Ungültiger Betrag: ${betrag} €. Bitte erneut eingeben!`);
            this.fehler.push(`Ungültiger Betrag: ${betrag} €. Bitte erneut eingeben!`);  // abfangen von Fehlern
        }
    },

    datumValidieren(datum) {
        if (datum.match(/^\d{4}-\d{2}-\d{2}$/) !== null) {
            return true;
        } else {
            return false;
        }
    },

    datumVerarbeiten(datum) {
        datum = datum.trim();
        // Bsp.: "22,35" -> "23.35" -> 23.35 -> 2335
        //Prüfen auf korrektes Datumsformat
        if (this.datumValidieren(datum)) {
            return new Date(`${datum} 00:00:00`);
        } else {
            // console.log(`Ungültiges Datumsformat: "${datum}". Bitte erneut eingeben!`);
            this.fehler.push(`Ungültiges Datumsformat: "${datum}". Bitte erneut eingeben!`);  // abfangen von Fehlern
        }
    },

    // eintragErfassen() { ( --> jetzt zu finden im Objekt als "eintragErfassen(), als MAP")
    //     this.eintraege.push({
    //         titel: prompt("Wie heißt dein Eintrag?", "Gehalt"),
    //         typ: prompt("Ist das eine Einnahme oder Ausgabe?"),
    //         betrag: parseInt(prompt("Betrag (in Cent)?")),
    //         datum: prompt("Datum? (jjjj-mm-tt)")
    //     });
    // },


    eintraegeSortieren() { // Anpassung von .datum zu --> get("datum" + als Arrow Function geschrieben)
        this.eintraege.sort((eintragA, eintragB) => {
            if (eintragA.get("datum") > eintragB.get("datum")) {
                return -1;
            } else if (eintragA.get("datum") < eintragB.get("datum")) {
                return 1;
            } else {
                return 0;
            }
        });
    },


    // eintragErfassen() { (--> jetzt im Objekt zu finden als "eintragErfassen() mit "push()")
    //     this.neuer_eintrag.titel = prompt("Wie heißt dein Eintrag?", "Gehalt");
    //     this.neuer_eintrag.typ = prompt("Ist das eine Einnahme oder Ausgabe?");
    //     this.neuer_eintrag.betrag = parseInt(prompt("Betrag (in Cent)?"));
    //     this.neuer_eintrag.datum = prompt("Datum? (jjjj-mm-tt)");
    // },

    // Umbau mit Funktionen (--> jetzt im Objekt zu finden als "eintragErfassen()")
    // const eintragErfassen = function () {
    //     titel = prompt("Wie heißt dein Eintrag?", "Gehalt");
    //     typ = prompt("Ist das eine Einnahme oder Ausgabe?");
    //     betrag = parseInt(prompt("Betrag (in Cent)?"));
    //     datum = prompt("Datum? (jjjj-mm-tt)");
    // };

    // eintragErfassen();

    // neuer_eintrag: { (--> jetzt im Objekt zu finden als "eintragErfassen()" anonyme Funktion erstellen + mit prompt() )
    //     titel: null,  // immer wenn man etwas mit "nichts" leer definieren will, ist "null" eine gute Option, 
    //     typ: null,    // man könnte genauso gut einen leeren String verwenden
    //     betrag: null,
    //     datum: null
    // },

    // Umbau mit Funktionen(-- > jetzt im Objekt als Objekt zu finden als "neuer_eintrag") 
    //     zusammenfassende Schreibweise zur Deklaration von Variablen
    // let titel,
    //     typ,
    //     betrag,
    //     datum;

    htmlEintragGenerieren(eintrag) {

        let listenpunkt = document.createElement("li");
        if (eintrag.get("typ") === "einnahme") {
            listenpunkt.setAttribute("class", "einnahme");
        } else if (eintrag.get("typ") === "ausgabe") {
            listenpunkt.setAttribute("class", "ausgabe");
        }
        listenpunkt.setAttribute("data-timestamp", eintrag.get("timestamp"));

        // datum-span
        let datum = document.createElement("span");
        datum.setAttribute("class", "datum");
        datum.textContent = eintrag.get("datum").toLocaleDateString("de-DE", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        });
        listenpunkt.insertAdjacentElement("afterbegin", datum);

        // titel-span
        let titel = document.createElement("span");
        titel.setAttribute("class", "titel");
        titel.textContent = eintrag.get("titel");
        datum.insertAdjacentElement("afterend", titel);

        // betrag-span
        let betrag = document.createElement("span");
        betrag.setAttribute("class", "betrag");
        betrag.textContent = `${(eintrag.get("betrag") / 100).toFixed(2).replace(".", ",")}€`;
        titel.insertAdjacentElement("afterend", betrag);

        // button
        let button = document.createElement("button");
        button.setAttribute("class", "entfernen-button");
        betrag.insertAdjacentElement("afterend", button);

        let icon = document.createElement("i");
        icon.setAttribute("class", "fas fa-trash");
        button.insertAdjacentElement("afterbegin", icon);

        return listenpunkt;
    },

    eintraegeAnzeigen() {
        // überprüfen, ob eine <ul> bereits vorhanden ist
        // ggf. <ul> entfernen
        // als ArrowFunction geschrieben

        document.querySelectorAll(".monatsliste ul").forEach(eintragsliste => eintragsliste.remove());
        // <ul> erstellen
        let eintragsliste = document.createElement("ul");
        // über eintraege [] itterieren
        // für jeden Eintrag einen HTML-Eintrag erstellen
        // HTML-Eintrag in <ul> einsetzen


        this.eintraege.forEach((eintrag) => {
            eintragsliste.insertAdjacentElement("beforeend", this.htmlEintragGenerieren(eintrag));
        });

        // For-of-Schleife wird mit Hilfe der Arrow-Function umgeschrieben (-->ersetzt)
        // for (let eintrag of this.eintraege) {
        //     eintragsliste.insertAdjacentElement("beforeend", this.htmlEintragGenerieren(eintrag));
        //     }
        // <ul> in den article.monatsliste einsetzen
        document.querySelector(".monatsliste").insertAdjacentElement("afterbegin", eintragsliste);
    },

    // Einträge anzeigen lassen  (--> wird durch HTML-Ausgabe ersetzt )
    // eintraegeAusgeben() {
    //     console.clear(); // Konsole leeren um doppelte Einträge zu vermeiden
    //     this.eintraege.forEach(function (eintrag) {
    //         console.log(`Titel: ${eintrag.get("titel")}\n`
    //             + `Titeltyp: ${eintrag.get("typ")}\n`
    //             + `Betrag: ${(eintrag.get("betrag") / 100).toFixed(2)} €\n`
    //             + `Datum: ${eintrag.get("datum").toLocaleDateString("de-DE", {
    //                 year: "numeric",
    //                 month: "2-digit",
    //                 day: "2-digit"
    //             })}\n`
    //             + `Zeitstempel: ${eintrag.get("timeStamp")}`
    //         );
    //     });
    // },

    //     eintragAusgeben() { (--> jetzt im Objekt zu finden als "eintraegeAusgeben()" mit "forEach")
    //         console.log(`Titel: ${this.neuer_eintrag.titel}
    // Titeltyp: ${this.neuer_eintrag.typ}
    // Betrag: ${this.neuer_eintrag.betrag} ct
    // Datum: ${this.neuer_eintrag.datum}`
    //         )
    //     },

    // just for help as comment
    //     <ul >
    //     <li class="ausgabe" data-timestamp="1843796313958">
    //     <span class="datum">03.02.2020</span>
    //     <span class="titel">Miete</span>
    //     <span class="betrag">545,00 €</span>
    //     <button class="entfernen-button">
    //       <i class="fas fa-trash"></i>
    //     </button>
    //   </li>
    //   <li class="einnahme" data-timestamp="1843796313954">
    //     <span class="datum">01.02.2020</span>
    //     <span class="titel">Gehalt</span>
    //     <span class="betrag">2064,37 €</span>
    //     <button class="entfernen-button">
    //       <i class="fas fa-trash"></i>
    //     </button>
    //   </li>
    // </ul >

    // gesamtbilanz erstellen

    gesamtbilanzErstellen() {
        let neuegesamtbilanz = new Map();
        neuegesamtbilanz.set("einnahmen", 0);
        neuegesamtbilanz.set("ausgaben", 0);
        neuegesamtbilanz.set("bilanz", 0);

        // als ArrowFunction geschrieben
        this.eintraege.forEach(eintrag => {
            switch (eintrag.get("typ")) {
                case "einnahme":
                    neuegesamtbilanz.set("einnahmen", neuegesamtbilanz.get("einnahmen") + eintrag.get("betrag"));
                    neuegesamtbilanz.set("bilanz", neuegesamtbilanz.get("bilanz") + eintrag.get("betrag"));
                    break;
                case "ausgabe":
                    neuegesamtbilanz.set("ausgaben", neuegesamtbilanz.get("ausgaben") + eintrag.get("betrag"));
                    neuegesamtbilanz.set("bilanz", neuegesamtbilanz.get("bilanz") - eintrag.get("betrag"));

                    neuegesamtbilanz.ausgaben += eintrag.get("betrag");
                    neuegesamtbilanz.bilanz -= eintrag.get("betrag");
                    break;
                default:
                    console.log(`Der Typ "${eintrag.get("typ")}" ist nicht bekannt.`);
                    break;
            }
        });
        this.gesamtbilanz = neuegesamtbilanz;

    },

    // gesamtbilanzErstellen() {
    //     let neuegesamtbilanz = {
    //         einnahmen: 0,
    //         ausgaben: 0,
    //         bilanz: 0
    //     };
    //     this.eintraege.forEach(function (eintrag) {
    //         switch (eintrag.typ) {
    //             case "Einnahme":
    //                 neuegesamtbilanz.einnahmen += eintrag.betrag;
    //                 neuegesamtbilanz.bilanz += eintrag.betrag;
    //                 break;
    //             case "Ausgabe":
    //                 neuegesamtbilanz.ausgaben += eintrag.betrag;
    //                 neuegesamtbilanz.bilanz -= eintrag.betrag;
    //                 break;
    //             default:
    //                 console.log(`Der Typ "${eintrag.typ}" ist nicht bekannt.`);
    //                 break;
    //         }
    //     });
    //     this.gesamtbilanz = neuegesamtbilanz;

    // },

    // eintragMitgesamtbilanzVerrechnen() { (--> jetzt im Objekt zu finden als "gesamtbilanzErstellen()" mit "forEach()")
    //     switch (this.neuer_eintrag.typ) {
    //         case "Einnahme":
    //             this.gesamtbilanz.bilanz_einnahmen += this.neuer_eintrag.betrag;
    //             this.gesamtbilanz.bilanz += this.neuer_eintrag.betrag;
    //             break;
    //         case "Ausgabe":
    //             this.gesamtbilanz.bilanz_ausgaben += this.neuer_eintrag.betrag;
    //             this.gesamtbilanz.bilanz -= this.neuer_eintrag.betrag;
    //             break;
    //         default:
    //             console.log(`Der Typ "${this.neuer_eintrag.typ}" ist nicht bekannt.`);
    //             break;
    //     }
    // },

    // eintragMitgesamtbilanzVerrechnen() { (--> jetzt im Objekt zu finden als  Switch - Statement: "eintragMitgesamtbilanzVerrechnen()")
    //     if (this.neuer_eintrag.typ === "Einnahme") {
    //         this.gesamtbilanz.bilanz_einnahmen += this.neuer_eintrag.betrag;
    //         this.gesamtbilanz.bilanz += this.neuer_eintrag.betrag;
    //     } else if (this.neuer_eintrag.typ === "Ausgabe") {
    //         this.gesamtbilanz.bilanz_ausgaben += this.neuer_eintrag.betrag;
    //         this.gesamtbilanz.bilanz -= this.neuer_eintrag.betrag;
    //     } else {
    //         console.log(`Der Typ "${this.neuer_eintrag.typ}" ist nicht bekannt.`);
    //     }
    // },

    // wird durch HTML - Ausgabe ersetzt
    // gesamtbilanzAusgeben() {
    //     console.log(`Einnahmen: ${(this.gesamtbilanz.get("einnahmen") / 100).toFixed(2)} €\n`
    //         + `Ausgaben: ${(this.gesamtbilanz.get("ausgaben") / 100).toFixed(2)} €\n`
    //         + `Bilanz: ${(this.gesamtbilanz.get("bilanz") / 100).toFixed(2)} €\n`
    //         + `Bilanz ist positiv: ${(this.gesamtbilanz.get("bilanz") / 100) >= 0}`
    //     );
    // },

    //     <aside id="gesamtbilanz">
    //     <h1>gesamtbilanz</h1>
    //     <div class="gesamtbilanz-zeile einnahmen">
    //       <span>Einnahmen:</span><span>0,00€</span>
    //     </div>
    //     <div class="gesamtbilanz-zeile ausgaben">
    //       <span>Ausgaben:</span><span>0,00€</span>
    //     </div>
    //     <div class="gesamtbilanz-zeile bilanz">
    //       <span>Bilanz:</span><span class="positiv">0,00€</span>
    //     </div>
    //   </aside>

    // anhand der aktuellen gesamtbilanz die gesamtbilanz neu generieren
    htmlgesamtbilanzGenerieren() {
        let gesamtbilanz = document.createElement("aside");
        gesamtbilanz.setAttribute("id", "gesamtbilanz");

        let ueberschrift = document.createElement("h1");
        ueberschrift.textContent = "gesamtbilanz";
        gesamtbilanz.insertAdjacentElement("afterbegin", ueberschrift);

        let einnahmenZeile = document.createElement("div");
        einnahmenZeile.setAttribute("class", "gesamtbilanz-zeile einnahmen");
        let einnahmenTitel = document.createElement("span");
        einnahmenTitel.textContent = "Einnahmen";
        einnahmenZeile.insertAdjacentElement("afterbegin", einnahmenTitel);
        let einnahmenBetrag = document.createElement("span");
        einnahmenBetrag.textContent = `${(this.gesamtbilanz.get("einnahmen") / 100).toFixed(2).replace(".", ",")}€`;
        einnahmenZeile.insertAdjacentElement("beforeend", einnahmenBetrag);
        gesamtbilanz.insertAdjacentElement("beforeend", einnahmenZeile);

        let ausgabenZeile = document.createElement("div");
        ausgabenZeile.setAttribute("class", "gesamtbilanz-zeile ausgaben");
        let ausgabenTitel = document.createElement("span");
        ausgabenTitel.textContent = "Ausgaben";
        ausgabenZeile.insertAdjacentElement("afterbegin", ausgabenTitel);
        let ausgabenBetrag = document.createElement("span");
        ausgabenBetrag.textContent = `${(this.gesamtbilanz.get("ausgaben") / 100).toFixed(2).replace(".", ",")}€`;
        ausgabenZeile.insertAdjacentElement("beforeend", ausgabenBetrag);
        gesamtbilanz.insertAdjacentElement("beforeend", ausgabenZeile);

        let bilanzZeile = document.createElement("div");
        bilanzZeile.setAttribute("class", "gesamtbilanz-zeile bilanz");
        let bilanzTitel = document.createElement("span");
        bilanzTitel.textContent = "Bilanz";
        bilanzZeile.insertAdjacentElement("afterbegin", bilanzTitel);
        let bilanzBetrag = document.createElement("span");
        if (this.gesamtbilanz.get("bilanz") >= 0) {
            bilanzBetrag.setAttribute("class", "positiv");
        } else if (this.gesamtbilanz.get("bilanz") < 0) {
            bilanzBetrag.setAttribute("class", "negativ");
        }
        bilanzBetrag.textContent = `${(this.gesamtbilanz.get("bilanz") / 100).toFixed(2).replace(".", ",")}€`;
        bilanzZeile.insertAdjacentElement("beforeend", bilanzBetrag);
        gesamtbilanz.insertAdjacentElement("beforeend", bilanzZeile);

        return gesamtbilanz;
    },

    gesamtbilanzAnzeigen() {
        // prüfen, ob bereits gesamtbilanz angezeigt wird ( als ArrowFunction geschrieben)
        document.querySelectorAll("#gesamtbilanz").forEach(gesamtbilanz =>
            // ggf. gesamtbilanz entfernen
            gesamtbilanz.remove()
        );
        document.querySelector("body").insertAdjacentElement("beforeend", this.htmlgesamtbilanzGenerieren());

        // neue gesamtbilanz anzeigen (htmlgesamtbilanzGenerieren())
    },
    // eine Funktion die alle Methoden aufruft
    eintragHinzufuegen() {
        let weiterer_eintrag = true;
        while (weiterer_eintrag) {
            this.eintragErfassen();
            if (this.fehler.length === 0) {
                // Methodenaufrufe anpassen
                this.eintraegeSortieren();
                this.eintraegeAnzeigen();
                this.gesamtbilanzErstellen();
                this.gesamtbilanzAnzeigen();
            } else {
                this.fehler = [];
            }

            weiterer_eintrag = confirm("Weiteren Eintrag hinzufügen?");
            //confirm (=bestätige : "Weiteren Eintrag hinzufügen?")
        }
    }
};

//     eintragHinzufuegen() {
//         this.eintragErfassen();
//         this.eintraegeAusgeben();
//         this.gesamtbilanzErstellen();
//         this.gesamtbilanzAusgeben();
//     }
// };
// Haushaltsbuch zur Korrektur auslesen ( --> jetzt als while loop mit confirm zur Abfrage von unbekannt vielen Einträgen)

haushaltsbuch.eintragHinzufuegen();
console.log(haushaltsbuch);



// -----------------------> Datensätze: (First Steps) <---------------------------------------

// Datensatz 1
// -->Codeblock ist durch Funktion ersetzt
// let titel_1 = prompt("Wie heißt dein Eintrag?", "Gehalt");
// let titeltyp_1 = prompt("Ist das eine Einnahme oder Ausgabe?");
// let betrag_1 = parseInt(prompt("Betrag (in Cent)?"));
// //Beispiel 2064,56 -> 206456
// let datum_1 = prompt("Datum? (jjjj-mm-tt)");

// console.log(`Titel: ${titel_1}
//     Titeltyp: ${titeltyp_1}
//     Betrag: ${betrag_1} ct
//     Datum: ${datum_1}`
// );

// Code an neue Variablen angepasst
// console.log(`Titel: ${titel}
//     Titeltyp: ${typ}
//     Betrag: ${betrag} ct
//     Datum: ${datum}`
// );

// Umbau mit Funktionen (--> jetzt im Objekt zu finden als "eintragAusgeben()")
// const eintragAusgeben = function (titel, typ, betrag, datum) {
//     console.log(`Titel: ${titel}
// Titeltyp: ${typ}
// Betrag: ${betrag} ct
// Datum: ${datum}`
//     );
// };

// eintragAusgeben(titel, typ, betrag, datum);

// -->Codeblock ist durch Funktion ersetzt
// if (titeltyp_1 === "Einnahme") {
//     bilanz_einnahme += betrag_1;
//     bilanz += betrag_1;
// } else if (titeltyp_1 === "Ausgabe") {
//     bilanz_ausgabe += betrag_1;
//     bilanz = bilanz - betrag_1;
// } else {
//     console.log(`Der Typ "${titeltyp_1}" ist nicht bekannt.`);
// }

// Umbau mit Funktion (--> jetzt im Objekt zu finden als "eintragMitgesamtbilanzVerrechnen()")
// const eintragMitgesamtbilanzVerrechnen = function (typ, betrag) {
//     if (typ === "Einnahme") {
//         bilanz_einnahmen += betrag;
//         bilanz += betrag;
//     } else if (typ === "Ausgabe") {
//         bilanz_ausgaben += betrag;
//         bilanz = bilanz - betrag;
//     } else {
//         console.log(`Der Typ "${typ}" ist nicht bekannt.`);
//     }
// };

// eintragMitgesamtbilanzVerrechnen(typ, betrag);

// Datensatz 2
// -->Codeblock ist durch Funktion ersetzt
// let titel_2 = prompt("Wie heißt dein Eintrag?", "Einkauf");
// let titeltyp_2 = prompt("Ist das eine Einnahme oder Ausgabe?");
// let betrag_2 = parseInt(prompt("Betrag (in Cent)?"));
// let datum_2 = prompt("Datum? (jjjj-mm-tt");

// console.log(`Titel: ${titel_2}
//     Titeltyp: ${titeltyp_2}
//     Betrag: ${betrag_2} ct
//     Datum: ${datum_2}`
// );

// if (titeltyp_2 === "Einnahme") {
//     bilanz_einnahme += betrag_2;
//     bilanz += betrag_2;
// } else if (titeltyp_2 === "Ausgabe") {
//     bilanz_ausgabe += betrag_2;
//     bilanz = bilanz - betrag_2;
// } else {
//     console.log(`Der Typ "${titeltyp_2}" ist nicht bekannt.`);
// }

// gesamtbilanz ausgeben

// -->Codeblock ist durch Funktion ersetzt
// let positiv = bilanz >= 0; //true
// console.log(`Einnahmen: ${bilanz_einnahme} ct
//     Ausgaben: ${bilanz_ausgabe} ct
//     Bilanz: ${bilanz} ct
//     Bilanz ist positiv: ${positiv}`);

// Umbau mit Funktion (--> jetzt im Objekt zu finden als "gesamtbilanzAusgeben()")
// const gesamtbilanzAusgeben = function (bilanz_einnahmen, bilanz_ausgaben, bilanz) {
//     console.log(`Einnahmen: ${bilanz_einnahmen} ct
// Ausgaben: ${bilanz_ausgaben} ct
// Bilanz: ${bilanz} ct
// Bilanz ist positiv: ${bilanz >= 0}`);
// };

// gesamtbilanzAusgeben(bilanz_einnahmen, bilanz_ausgaben, bilanz);


// alle Funktionen mit einer Funktion aufrufen  (--> jetzt im Objekt zu finden als "eintragHinzufuegen()")
// const eintragHinzufuegen = function () {
//     eintragErfassen();
//     eintragAusgeben(titel, typ, betrag, datum);
//     eintragMitgesamtbilanzVerrechnen(typ, betrag);
//     gesamtbilanzAusgeben(bilanz_einnahmen, bilanz_ausgaben, bilanz);
// };

// eintragHinzufuegen();
// eintragHinzufuegen();
// eintragHinzufuegen();