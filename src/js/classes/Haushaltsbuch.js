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
    this._gesamtbilanz.aktualisieren(this._eintraege);
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
    this._gesamtbilanz.aktualisieren(this._eintraege);
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
}
