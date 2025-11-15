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
    let neuerEintrag = new Eintrag(
      formulardaten.titel,
      formulardaten.betrag,
      formulardaten.typ,
      formulardaten.datum
    );

    // let neuerEintrag = new Map();
    // neuerEintrag.set("titel", formulardaten.titel);
    // neuerEintrag.set("betrag", formulardaten.betrag);
    // neuerEintrag.set("typ", formulardaten.typ);
    // neuerEintrag.set("datum", formulardaten.datum);
    // neuerEintrag.set("timestamp", Date.now());
    this._eintraege.push(neuerEintrag);
    console.log(this);

    // Methodenaufrufe anpassen
    this._eintraegeSortieren();
    this._eintraegeAnzeigen();
    this._gesamtbilanzErstellen();
    this._gesamtbilanzAnzeigen();
  }

  eintragEntfernen(timestamp) {
    let startIndex;
    for (let i = 0; i < this._eintraege.length; i++) {
      if (this._eintraege[i].timestamp() === parseInt(timestamp)) {
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
      return eintragA.datum() > eintragB.datum()
        ? -1
        : eintragA.datum() < eintragB.datum()
        ? 1
        : 0;
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
      eintragsliste.insertAdjacentElement("beforeend", eintrag.html())
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
      switch (eintrag.typ()) {
        case "einnahme":
          neuegesamtbilanz.set(
            "einnahmen",
            neuegesamtbilanz.get("einnahmen") + eintrag.betrag()
          );
          neuegesamtbilanz.set(
            "bilanz",
            neuegesamtbilanz.get("bilanz") + eintrag.betrag()
          );
          break;
        case "ausgabe":
          neuegesamtbilanz.set(
            "ausgaben",
            neuegesamtbilanz.get("ausgaben") + eintrag.betrag()
          );
          neuegesamtbilanz.set(
            "bilanz",
            neuegesamtbilanz.get("bilanz") - eintrag.betrag()
          );

          neuegesamtbilanz.ausgaben += eintrag.betrag();
          neuegesamtbilanz.bilanz -= eintrag.betrag();
          break;
        default:
          console.log(`Der Typ "${eintrag.typ()}" ist nicht bekannt.`);
          break;
      }
    });
    this.gesamtbilanz = neuegesamtbilanz;
  }

  // anhand der aktuellen gesamtbilanz die gesamtbilanz neu generieren
  _htmlGesamtbilanzGenerieren() {
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
      .insertAdjacentElement("beforeend", this._htmlGesamtbilanzGenerieren());
  }
}
