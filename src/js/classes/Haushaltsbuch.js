"use strict";

class Haushaltsbuch {
  constructor() {
    this._eintraege = [];
    this._monatslistensammlung = new Monatslistensammlung();
    this._gesamtbilanz = new Gesamtbilanz();
  }

  // Fehler zukünftig abfangen, bevor sie ausgegeben werden
  // fehler: [],

  // eine Funktion, die alle Methoden aufruft
  eintragHinzufuegen(formulardaten) {
    let neuerEintrag = new Map();
    neuerEintrag.set("titel", formulardaten.titel);
    neuerEintrag.set("betrag", formulardaten.betrag);
    neuerEintrag.set("typ", formulardaten.typ);
    neuerEintrag.set("datum", formulardaten.datum);
    neuerEintrag.set("timestamp", Date.now());
    this._eintraege.push(neuerEintrag);

    // Methodenaufrufe anpassen
    this._eintraegeSortieren();
    this._eintraegeAnzeigen();
    this._gesamtbilanzErstellen();
    this._gesamtbilanzAnzeigen();
  }

  _eintragEntfernen(timestamp) {
    let startIndex;
    for (let i = 0; i < this._eintraege.length; i++) {
      if (this._eintraege[i].get("timestamp") === parseInt(timestamp)) {
        startIndex = i;
        break;
      }
    }
    this._eintraege.splice(startIndex, 1);

    this._eintraegeAnzeigen();
    this._gesamtbilanzErstellen();
    this._gesamtbilanzAnzeigen();
  }

  _eintraegeSortieren() {
    this._eintraege.sort((eintragA, eintragB) => {
      return eintragA.get("datum") > eintragB.get("datum")
        ? -1
        : eintragA.get("datum") < eintragB.get("datum")
        ? 1
        : 0;
    });
  }

  _htmlEintragGenerieren(eintrag) {
    let listenpunkt = document.createElement("li");
    eintrag.get("typ") === "einnahme"
      ? listenpunkt.setAttribute("class", "einnahme")
      : listenpunkt.setAttribute("class", "ausgabe");

    listenpunkt.setAttribute("data-timestamp", eintrag.get("timestamp"));

    // datum-span
    let datum = document.createElement("span");
    datum.setAttribute("class", "datum");
    datum.textContent = eintrag.get("datum").toLocaleDateString("de-DE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
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
    betrag.textContent = `${(eintrag.get("betrag") / 100)
      .toFixed(2)
      .replace(/\./, ",")}€`;
    titel.insertAdjacentElement("afterend", betrag);

    // button
    let button = document.createElement("button");
    button.setAttribute("class", "entfernen-button");
    betrag.insertAdjacentElement("afterend", button);

    let icon = document.createElement("i");
    icon.setAttribute("class", "fas fa-trash");
    button.insertAdjacentElement("afterbegin", icon);

    this._eintragEntfernenEventHinzufuegen(listenpunkt);

    return listenpunkt;
  }

  _eintragEntfernenEventHinzufuegen(listenpunkt) {
    listenpunkt
      .querySelector(".entfernen-button")
      .addEventListener("click", (e) => {
        let timestamp = e.target.parentElement.getAttribute("data-timestamp");
        // console.log(timestamp);

        this._eintragEntfernen(timestamp);
      });
  }

  _eintraegeAnzeigen() {
    // überprüfen, ob eine <ul> bereits vorhanden ist
    // ggf. <ul> entfernen
    // als ArrowFunction geschrieben

    document
      .querySelectorAll(".monatsliste ul")
      .forEach((eintragsliste) => eintragsliste.remove());
    // <ul> erstellen
    let eintragsliste = document.createElement("ul");
    // console.log("Eintragsliste", eintragsliste);

    // über eintraege [] itterieren
    // für jeden Eintrag einen HTML-Eintrag erstellen
    // HTML-Eintrag in <ul> einsetzen
    this._eintraege.forEach((eintrag) =>
      eintragsliste.insertAdjacentElement(
        "beforeend",
        this._htmlEintragGenerieren(eintrag)
      )
    );
    // <ul> in den article.monatsliste einsetzen
    const monatsliste = document.querySelector(".monatsliste");
    if (monatsliste) {
      monatsliste.insertAdjacentElement("afterbegin", eintragsliste);
    } else {
      console.error("Element '.monatsliste' not found.");
    }
  }

  // gesamtbilanz erstellen
  _gesamtbilanzErstellen() {
    let neuegesamtbilanz = new Map();
    neuegesamtbilanz.set("einnahmen", 0);
    neuegesamtbilanz.set("ausgaben", 0);
    neuegesamtbilanz.set("bilanz", 0);

    // als ArrowFunction geschrieben
    this._eintraege.forEach((eintrag) => {
      switch (eintrag.get("typ")) {
        case "einnahme":
          neuegesamtbilanz.set(
            "einnahmen",
            neuegesamtbilanz.get("einnahmen") + eintrag.get("betrag")
          );
          neuegesamtbilanz.set(
            "bilanz",
            neuegesamtbilanz.get("bilanz") + eintrag.get("betrag")
          );
          break;
        case "ausgabe":
          neuegesamtbilanz.set(
            "ausgaben",
            neuegesamtbilanz.get("ausgaben") + eintrag.get("betrag")
          );
          neuegesamtbilanz.set(
            "bilanz",
            neuegesamtbilanz.get("bilanz") - eintrag.get("betrag")
          );

          neuegesamtbilanz.ausgaben += eintrag.get("betrag");
          neuegesamtbilanz.bilanz -= eintrag.get("betrag");
          break;
        default:
          console.log(`Der Typ "${eintrag.get("typ")}" ist nicht bekannt.`);
          break;
      }
    });
    this.gesamtbilanz = neuegesamtbilanz;
  }

  // anhand der aktuellen gesamtbilanz die gesamtbilanz neu generieren
  _htmlgesamtbilanzGenerieren() {
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
    einnahmenBetrag.textContent = `${(this.gesamtbilanz.get("einnahmen") / 100)
      .toFixed(2)
      .replace(".", ",")}€`;
    einnahmenZeile.insertAdjacentElement("beforeend", einnahmenBetrag);
    gesamtbilanz.insertAdjacentElement("beforeend", einnahmenZeile);

    let ausgabenZeile = document.createElement("div");
    ausgabenZeile.setAttribute("class", "gesamtbilanz-zeile ausgaben");
    let ausgabenTitel = document.createElement("span");
    ausgabenTitel.textContent = "Ausgaben";
    ausgabenZeile.insertAdjacentElement("afterbegin", ausgabenTitel);
    let ausgabenBetrag = document.createElement("span");
    ausgabenBetrag.textContent = `${(this.gesamtbilanz.get("ausgaben") / 100)
      .toFixed(2)
      .replace(".", ",")}€`;
    ausgabenZeile.insertAdjacentElement("beforeend", ausgabenBetrag);
    gesamtbilanz.insertAdjacentElement("beforeend", ausgabenZeile);

    let bilanzZeile = document.createElement("div");
    bilanzZeile.setAttribute("class", "gesamtbilanz-zeile bilanz");
    let bilanzTitel = document.createElement("span");
    bilanzTitel.textContent = "Bilanz";
    bilanzZeile.insertAdjacentElement("afterbegin", bilanzTitel);
    let bilanzBetrag = document.createElement("span");

    this.gesamtbilanz.get("bilanz") >= 0
      ? bilanzBetrag.setAttribute("class", "positiv")
      : bilanzBetrag.setAttribute("class", "negativ");
    // jetzt als ternaerer Operator geschrieben
    // if (this.gesamtbilanz.get("bilanz") >= 0) {
    //     bilanzBetrag.setAttribute("class", "positiv");
    // } else if (this.gesamtbilanz.get("bilanz") < 0) {
    //     bilanzBetrag.setAttribute("class", "negativ");
    // }
    bilanzBetrag.textContent = `${(this.gesamtbilanz.get("bilanz") / 100)
      .toFixed(2)
      .replace(".", ",")}€`;
    bilanzZeile.insertAdjacentElement("beforeend", bilanzBetrag);
    gesamtbilanz.insertAdjacentElement("beforeend", bilanzZeile);

    return gesamtbilanz;
  }

  _gesamtbilanzAnzeigen() {
    // prüfen, ob bereits gesamtbilanz angezeigt wird ( als ArrowFunction geschrieben)
    document.querySelectorAll("#gesamtbilanz").forEach((gesamtbilanz) =>
      // ggf. gesamtbilanz entfernen
      gesamtbilanz.remove()
    );
    document
      .querySelector("body")
      .insertAdjacentElement("beforeend", this._htmlgesamtbilanzGenerieren());
  }
}
