"use strict";

class Eintrag {
  // titel, betrag, typ, datum, timestamp, html

  constructor(titel, betrag, typ, datum) {
    this._titel = titel;
    this._betrag = betrag;
    this._typ = typ;
    this._datum = datum;
    this._timestamp = Date.now();
    this._html = this._htmlGenerieren();
  }

  titel() {
    return this._titel;
  }

  betrag() {
    return this._betrag;
  }

  typ() {
    return this._typ;
  }

  datum() {
    return this._datum;
  }

  timestamp() {
    return this._timestamp;
  }

  html() {
    return this._html;
  }

  _htmlGenerieren(eintrag) {
    let listenpunkt = document.createElement("li");
    this._typ === "einnahme"
      ? listenpunkt.setAttribute("class", "einnahme")
      : listenpunkt.setAttribute("class", "ausgabe");

    listenpunkt.setAttribute("data-timestamp", this._timestamp);

    // datum-span
    let datum = document.createElement("span");
    datum.setAttribute("class", "datum");
    datum.textContent = this._datum.toLocaleDateString("de-DE", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    listenpunkt.insertAdjacentElement("afterbegin", datum);

    // titel-span
    let titel = document.createElement("span");
    titel.setAttribute("class", "titel");
    titel.textContent = this._titel;
    datum.insertAdjacentElement("afterend", titel);

    // betrag-span
    let betrag = document.createElement("span");
    betrag.setAttribute("class", "betrag");
    // betrag.textContent = `${(eintrag.get("betrag") / 100).toFixed(2).replace(".", ",")}€`;
    betrag.textContent = `${(this._betrag / 100)
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

        haushaltsbuch.eintragEntfernen(timestamp);
      });
  }
}
