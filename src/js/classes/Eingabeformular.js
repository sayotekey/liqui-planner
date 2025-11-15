"use strict";

class Eingabeformular {
  constructor() {
    this._html = this._htmlGenerieren();
  }

  _formulardatenHolen(event) {
    // formulardaten-Objekt erstellen
    return {
      titel: event.target.elements.titel.value,
      betrag: event.target.elements.betrag.value,
      einnahme: event.target.elements.einnahme.checked,
      datum: event.target.elements.datum.valueAsDate,
    };
  }

  _formulardatenVerarbeiten(formulardaten) {
    return {
      titel: formulardaten.titel.trim(),
      typ: formulardaten.einnahme === false ? "ausgabe" : "einnahme",
      betrag: parseFloat(formulardaten.betrag) * 100,
      datum: formulardaten.datum,
    };
  }

  _formulardatenValidieren(formulardaten) {
    let fehler = [];
    if (formulardaten.titel === "") {
      fehler.push("Titel");
    }
    if (isNaN(formulardaten.betrag)) {
      fehler.push("Betrag");
    }
    if (formulardaten.datum === null) {
      fehler.push("Datum");
    }
    return fehler;
  }

  _datumAktualisieren() {
    let datumsInput = document.querySelector("#datum");
    if (datumsInput !== null) {
      datumsInput.valueAsDate = new Date();
    }
  }

  _absendenEventHinzufuegen(eingabeformular) {
    eingabeformular
      .querySelector("#eingabeformular")
      .addEventListener("submit", (event) => {
        event.preventDefault();

        // Formulardaten holen und Formulardaten verarbeiten
        // let abc = this.formulardatenHolen(event)
        // let formulardaten = this.formulardatenVerarbeiten(abc);
        let formulardaten = this._formulardatenVerarbeiten(
          this._formulardatenHolen(event)
        );
        // Formulardaten validieren
        let formularFehler = this._formulardatenValidieren(formulardaten);

        // wennn die Formulardaten valide sind
        if (formularFehler.length === 0) {
          // Eintrag zum Haushaltbuch hinzufügen
          haushaltsbuch.eintragHinzufuegen(formulardaten);

          // wenn bereits Fehlermeldung angezeigt wird
          let bestehendeFehlerbox = document.querySelector(".fehlerbox");
          if (bestehendeFehlerbox !== null) {
            bestehendeFehlerbox.remove();
          }
          // Formular zurücksetzen
          event.target.reset();
          // Datum auf heutigen Tag setzen
          this._datumAktualisieren();
        } else {
          let fehler = new Fehler(
            "Folgende Felder wurden nicht korrekt ausgefüllt:",
            formularFehler
          );
          fehler.anzeigen();
        }
      });
  }

  _htmlGenerieren() {
    let eingabeformular = document.createElement("section");
    eingabeformular.setAttribute("id", "eingabeformular-container");
    eingabeformular.innerHTML = `<form id="eingabeformular" action="#" method="get"></form>
      <div class="eingabeformular-zeile">
        <h1>Neue Einnahme / Ausgabe hinzufügen</h1>
      </div>
      <div class="eingabeformular-zeile">
        <div class="titel-typ-eingabe-gruppe">
          <label for="titel">Titel</label>
          <input
            type="text"
            id="titel"
            form="eingabeformular"
            name="titel"
            placeholder="z.B. Einkaufen"
            size="10"
            title="Titel des Eintrags" 

          />
          <input
            type="radio"
            id="einnahme"
            name="typ"
            value="einnahme"
            form="eingabeformular"
            title="Typ des Eintrags"
          />
          <label for="einnahme" title="Typ des Eintrags">Einnahme</label>
          <input
            type="radio"
            id="ausgabe"
            name="typ"
            value="ausgabe"
            form="eingabeformular"
            title="Typ des Eintrags"
            checked
           
          />
          <label for="ausgabe" title="Typ des Eintrags">Ausgabe</label>
        </div>
      </div>
      <div class="eingabeformular-zeile">
        <div class="betrag-datum-eingabe-gruppe">
          <label for="betrag">Betrag</label>
          <input
            type="number"
            id="betrag"
            name="betrag"
            form="eingabeformular"
            placeholder="z.B. 10,42"
            size="10"
            step="0.01"
            title="Betrag des Eintrags (max. zwei Nachkommastellen, kein €-Zeichen)" 

            />
          <label for="datum">Datum</label>
          <input
            type="date"
            id="datum"
            name="datum"
            form="eingabeformular"
            placeholder="jjjj-mm-tt"
            size="10"
            title="Datum des Eintrags (Format: jjjj-mm-tt)"

          />
        </div>
      </div>
      <div class="eingabeformular-zeile">
        <button class="standard" type="submit" form="eingabeformular">
          Hinzufügen
        </button>
      </div>`;

    this._absendenEventHinzufuegen(eingabeformular);

    return eingabeformular;
  }

  anzeigen() {
    let navigationsleiste = document.querySelector("body");
    if (navigationsleiste !== null) {
      navigationsleiste.insertAdjacentElement("afterbegin", this._html);
      // Datum auf heutigen Tag setzen
      this._datumAktualisieren();
    }
  }
}
