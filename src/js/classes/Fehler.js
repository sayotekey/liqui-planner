"use strict";

class Fehler {
  constructor(fehlertext, formularFehler) {
    this._fehlertext = fehlertext;
    this._formularFehler = formularFehler;
    this._html = this._htmlGenerieren();
  }
  _htmlGenerieren() {
    let fehlerbox = document.createElement("div");
    fehlerbox.setAttribute("class", "fehlerbox");
    let fehlerText = document.createElement("span");
    fehlerText.textContent = this._fehlertext;
    fehlerbox.insertAdjacentElement("afterbegin", fehlerText);

    let fehlerListe = document.createElement("ul");
    this._formularFehler.forEach((fehler) => {
      let fehlerListenpunkt = document.createElement("li");
      fehlerListenpunkt.textContent = fehler;
      fehlerListe.insertAdjacentElement("beforeend", fehlerListenpunkt);
    });
    fehlerbox.insertAdjacentElement("beforeend", fehlerListe);
    return fehlerbox;
  }

  _entfernen() {
    let bestehendeFehlerbox = document.querySelector(".fehlerbox");
    if (bestehendeFehlerbox !== null) {
      bestehendeFehlerbox.remove();
    }
  }

  anzeigen() {
    this._entfernen();
    let eingabeformularContainer = document.querySelector(
      "#eingabeformular-container"
    );
    if (eingabeformularContainer !== null) {
      eingabeformularContainer.insertAdjacentElement("afterbegin", this._html);
    }
  }
}
