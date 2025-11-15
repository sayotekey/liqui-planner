"use strict";

// gesamtbilanz
// neues Objekt anlegen:
const haushaltsbuch = {

    gesamtbilanz: new Map(),

    // Eingabedaten vom Nutzer holen ->
    // Anmerkung: ein prompt liefert immer einen String zurück!!

    // Einträge zukünftig speichern können
    eintraege: [],

    // Fehler zukünftig abfangen, bevor sie ausgegeben werden
    fehler: [],

    // eine Funktion, die alle Methoden aufruft
    eintragHinzufuegen(formulardaten) {

        let neuerEintrag = new Map();
        neuerEintrag.set("titel", formulardaten.titel);
        neuerEintrag.set("betrag", formulardaten.betrag);
        neuerEintrag.set("typ", formulardaten.typ);
        neuerEintrag.set("datum", formulardaten.datum);
        neuerEintrag.set("timestamp", Date.now());
        this.eintraege.push(neuerEintrag);

        // Methodenaufrufe anpassen
        this.eintraegeSortieren();
        this.eintraegeAnzeigen();
        this.gesamtbilanzErstellen();
        this.gesamtbilanzAnzeigen();
    },

    eintragEntfernen(timestamp) {
        let startIndex;
        for (let i = 0; i < this.eintraege.length; i++) {
            if (this.eintraege[i].get("timestamp") === parseInt(timestamp)) {
                console.log(this.eintraege[i].get("timestamp"));

                startIndex = i;
                break;
            }
        }
        this.eintraege.splice(startIndex, 1);

        this.eintraegeAnzeigen();
        this.gesamtbilanzErstellen();
        this.gesamtbilanzAnzeigen();
    },

    eintraegeSortieren() { // Anpassung von .datum zu --> get("datum" + als Arrow Function geschrieben)
        this.eintraege.sort((eintragA, eintragB) => {

            return eintragA.get("datum") > eintragB.get("datum") ? -1 : eintragA.get("datum") < eintragB.get("datum") ? 1 : 0;

            // jetzt in ternaeren Operator umgewandelt => unter eintreageSortieren()
            // if (eintragA.get("datum") > eintragB.get("datum")) {
            //     return -1;
            // } else if (eintragA.get("datum") < eintragB.get("datum")) {
            //     return 1;
            // } else {
            //     return 0;
            // }
        });
    },

    htmlEintragGenerieren(eintrag) {
        let listenpunkt = document.createElement("li");
        eintrag.get("typ") === "einnahme" ? listenpunkt.setAttribute("class", "einnahme") : listenpunkt.setAttribute("class", "ausgabe");

        // jetzt als ternaerer Operator in htmlEintragGenerieren()
        // let listenpunkt = document.createElement("li");
        // if (eintrag.get("typ") === "einnahme") {
        //     listenpunkt.setAttribute("class", "einnahme");
        // } else if (eintrag.get("typ") === "ausgabe") {
        //     listenpunkt.setAttribute("class", "ausgabe");
        // }
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
        // betrag.textContent = `${(eintrag.get("betrag") / 100).toFixed(2).replace(".", ",")}€`;
        betrag.textContent = `${(eintrag.get("betrag") / 100).toFixed(2).replace(/\./, ",")}€`;
        titel.insertAdjacentElement("afterend", betrag);

        // button
        let button = document.createElement("button");
        button.setAttribute("class", "entfernen-button");
        betrag.insertAdjacentElement("afterend", button);

        let icon = document.createElement("i");
        icon.setAttribute("class", "fas fa-trash");
        button.insertAdjacentElement("afterbegin", icon);

        this.eintragEntfernenEventHinzufuegen(listenpunkt);

        return listenpunkt;
    },

    eintragEntfernenEventHinzufuegen(listenpunkt) {
        listenpunkt.querySelector(".entfernen-button").addEventListener("click", e => {
            let timestamp = e.target.parentElement.getAttribute("data-timestamp");
            // console.log(timestamp);

            this.eintragEntfernen(timestamp);
        });
    },

    eintraegeAnzeigen() {
        // überprüfen, ob eine <ul> bereits vorhanden ist
        // ggf. <ul> entfernen
        // als ArrowFunction geschrieben

        document.querySelectorAll(".monatsliste ul").forEach(eintragsliste => eintragsliste.remove());
        // <ul> erstellen
        let eintragsliste = document.createElement("ul");
        // console.log("Eintragsliste", eintragsliste);

        // über eintraege [] itterieren
        // für jeden Eintrag einen HTML-Eintrag erstellen
        // HTML-Eintrag in <ul> einsetzen
        this.eintraege.forEach(eintrag => eintragsliste.insertAdjacentElement("beforeend", this.htmlEintragGenerieren(eintrag))
        );
        // <ul> in den article.monatsliste einsetzen
        const monatsliste = document.querySelector(".monatsliste");
        if (monatsliste) {
            monatsliste.insertAdjacentElement("afterbegin", eintragsliste);
        } else {
            console.error("Element '.monatsliste' not found.");
        }
    },

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

        this.gesamtbilanz.get("bilanz") >= 0 ? bilanzBetrag.setAttribute("class", "positiv") : bilanzBetrag.setAttribute("class", "negativ");
        // jetzt als ternaerer Operator geschrieben
        // if (this.gesamtbilanz.get("bilanz") >= 0) {
        //     bilanzBetrag.setAttribute("class", "positiv");
        // } else if (this.gesamtbilanz.get("bilanz") < 0) {
        //     bilanzBetrag.setAttribute("class", "negativ");
        // }
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
    },

}

    // // eine Funktion die alle Methoden aufruft --> Umbau zu--> eintragHinzufuegen
    // eintragHinzufuegen() {
    //     let weiterer_eintrag = true;
    //     while (weiterer_eintrag) {
    //         this.eintragErfassen();
    //         if (this.fehler.length === 0) {
    //             // Methodenaufrufe anpassen
    //             this.eintraegeSortieren();
    //             this.eintraegeAnzeigen();
    //             this.gesamtbilanzErstellen();
    //             this.gesamtbilanzAnzeigen();
    //         } else {
    //             this.fehler = [];
    //         }

    //         weiterer_eintrag = confirm("Weiteren Eintrag hinzufügen?");
    //         //confirm (=bestätige : "Weiteren Eintrag hinzufügen?")
    //     }
    // }
    ;