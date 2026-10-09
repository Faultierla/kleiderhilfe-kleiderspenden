document.addEventListener("DOMContentLoaded", () => {

    initRegistration();
    initConfirmation();

});

/* =========================================================
   GESCHÄFTSSTELLE
========================================================= */

const GESCHAEFTSSTELLE = {

    name: "KleiderHilfe e. V.",
    strasse: "Musterstraße 12",
    plz: "66111",
    ort: "Musterstadt"

};

/* =========================================================
   REGISTRIERUNG
========================================================= */

function initRegistration() {

    const form =
        document.getElementById("spendenForm");

    /*
     * Falls wir uns nicht auf der
     * Registrierungsseite befinden,
     * wird die Funktion beendet.
     */

    if (!form) {

        return;

    }

    /* -----------------------------------------------------
       ELEMENTE AUS DEM HTML AUSLESEN
    ----------------------------------------------------- */

    const addressSection =
        document.getElementById("abholadresseBereich");

    const radios =
        document.querySelectorAll(
            'input[name="uebergabeart"]'
        );

    const strasse =
        document.getElementById("strasse");

    const plz =
        document.getElementById("plz");

    const ort =
        document.getElementById("ort");

    const email =
        document.getElementById("email");

    const clothing =
        document.getElementById("kleidung");

    const crisis =
        document.getElementById("krisengebiet");

    const pickupFields = [

        strasse,
        plz,
        ort,
        email

    ];

    /* =====================================================
       PRÜFEN, OB ABHOLUNG GEWÄHLT WURDE
    ===================================================== */

    function isPickup() {

        const selected =
            document.querySelector(
                'input[name="uebergabeart"]:checked'
            );

        return selected?.value === "Abholung";

    }

    /* =====================================================
       FEHLERMELDUNGEN ZURÜCKSETZEN
    ===================================================== */

    function clearErrors() {

        document
            .querySelectorAll(".error-message")
            .forEach((element) => {

                element.textContent = "";

            });

        document
            .querySelectorAll("input, select")
            .forEach((field) => {

                field.classList.remove(
                    "is-invalid"
                );

            });

    }

    /* =====================================================
       FEHLER AUSGEBEN
    ===================================================== */

    function setError(
        field,
        errorId,
        message
    ) {

        if (field) {

            field.classList.add(
                "is-invalid"
            );

        }

        const errorElement =
            document.getElementById(
                errorId
            );

        if (errorElement) {

            errorElement.textContent =
                message;

        }

        return false;

    }

    /* =====================================================
       ABHOLBEREICH EIN- / AUSBLENDEN
    ===================================================== */

    function updatePickupMode() {

        const pickup =
            isPickup();

        /*
         * Abholbereich anzeigen bzw. verstecken
         */

        addressSection.hidden =
            !pickup;

        /*
         * Bei einer Abholung werden
         * die Adressfelder zu Pflichtfeldern.
         */

        pickupFields.forEach(
            (field) => {

                field.required =
                    pickup;

            }
        );

        /*
         * Wenn Geschäftsstelle ausgewählt wurde,
         * werden die Abholfelder geleert.
         */

        if (!pickup) {

            pickupFields.forEach(
                (field) => {

                    field.value = "";

                    field.classList.remove(
                        "is-invalid"
                    );

                }
            );

            [
                "strasseFehler",
                "plzFehler",
                "ortFehler",
                "emailFehler"
            ]
            .forEach((id) => {

                const errorElement =
                    document.getElementById(
                        id
                    );

                if (errorElement) {

                    errorElement.textContent =
                        "";

                }

            });

        }

        const handoverError =
            document.getElementById(
                "uebergabeFehler"
            );

        if (handoverError) {

            handoverError.textContent =
                "";

        }

    }

    /* =====================================================
       RADIO BUTTONS
    ===================================================== */

    radios.forEach((radio) => {

        radio.addEventListener(
            "change",
            updatePickupMode
        );

    });

    /*
     * Initialen Zustand setzen.
     */

    updatePickupMode();

    /* =====================================================
       FORMULAR ABSENDEN
    ===================================================== */

    form.addEventListener(
        "submit",
        (event) => {

            /*
             * Normales Absenden verhindern,
             * damit JavaScript die Daten prüfen kann.
             */

            event.preventDefault();

            clearErrors();

            let valid = true;

            /* -------------------------------------------------
               ÜBERGABEART
            ------------------------------------------------- */

            const selectedHandover =
                document.querySelector(
                    'input[name="uebergabeart"]:checked'
                );

            if (!selectedHandover) {

                const error =
                    document.getElementById(
                        "uebergabeFehler"
                    );

                if (error) {

                    error.textContent =
                        "Bitte wähle eine Übergabeart aus.";

                }

                valid = false;

            }

            /* -------------------------------------------------
               KLEIDUNG
            ------------------------------------------------- */

            if (!clothing.value) {

                valid =
                    setError(
                        clothing,
                        "kleidungFehler",
                        "Bitte wähle die Art der Kleidung aus."
                    ) && valid;

            }

            /* -------------------------------------------------
               KRISENGEBIET
            ------------------------------------------------- */

            if (!crisis.value) {

                valid =
                    setError(
                        crisis,
                        "krisenFehler",
                        "Bitte wähle ein Krisengebiet aus."
                    ) && valid;

            }

            /* =================================================
               ZUSÄTZLICHE PRÜFUNGEN BEI ABHOLUNG
            ================================================= */

            if (isPickup()) {

                const trimmedStreet =
                    strasse.value.trim();

                const trimmedPlz =
                    plz.value.trim();

                const trimmedOrt =
                    ort.value.trim();

                const trimmedEmail =
                    email.value.trim();

                /* ---------------------------------------------
                   STRASSE UND HAUSNUMMER
                --------------------------------------------- */

                if (!trimmedStreet) {

                    valid =
                        setError(
                            strasse,
                            "strasseFehler",
                            "Bitte gib Straße und Hausnummer an."
                        ) && valid;

                }

                /* ---------------------------------------------
                   POSTLEITZAHL
                --------------------------------------------- */

                if (!/^\d{5}$/.test(trimmedPlz)) {

                    valid =
                        setError(
                            plz,
                            "plzFehler",
                            "Bitte gib eine fünfstellige Postleitzahl ein."
                        ) && valid;

                }

                else if (

                    trimmedPlz.substring(0, 2) !==
                    GESCHAEFTSSTELLE.plz.substring(0, 2)

                ) {

                    valid =
                        setError(
                            plz,
                            "plzFehler",
                            `Eine Abholung ist nur möglich, wenn die ersten bei-den Stellen der PLZ mit ${GESCHAEFTSSTELLE.plz.substring(0, 2)} übereinstimmen.`
                        ) && valid;

                }

                /* ---------------------------------------------
                   ORT
                --------------------------------------------- */

                if (!trimmedOrt) {

                    valid =
                        setError(
                            ort,
                            "ortFehler",
                            "Bitte gib den Ort an."
                        ) && valid;

                }

                /* ---------------------------------------------
                   E-MAIL
                --------------------------------------------- */

                if (
                    !trimmedEmail ||
                    !email.checkValidity()
                ) {

                    valid =
                        setError(
                            email,
                            "emailFehler",
                            "Bitte gib eine gültige E-Mail-Adresse ein."
                        ) && valid;

                }

            }

            /* =================================================
               ABBRUCH BEI FEHLERN
            ================================================= */

            if (!valid) {

                return;

            }

            /* =================================================
               DATUM UND UHRZEIT
            ================================================= */

            const now =
                new Date();

            const pickup =
                isPickup();

            /* =================================================
               ORT / ABHOLADRESSE
            ================================================= */

            const pickupAddress =
                pickup

                    ? `${strasse.value.trim()}, ${plz.value.trim()} ${ort.value.trim()}`

                    : `${GESCHAEFTSSTELLE.strasse}, ${GESCHAEFTSSTELLE.plz} ${GESCHAEFTSSTELLE.ort}`;

            /* =================================================
               REGISTRIERUNGSDATEN
            ================================================= */

            const daten = {

                uebergabeart:
                    selectedHandover.value,

                kleidung:
                    clothing.value,

                krisengebiet:
                    crisis.value,

                datum:
                    now.toLocaleDateString(
                        "de-DE"
                    ),

                uhrzeit:
                    now.toLocaleTimeString(
                        "de-DE",
                        {
                            hour: "2-digit",
                            minute: "2-digit"
                        }
                    ),

                ort:
                    pickup
                        ? ort.value.trim()
                        : "Geschäftsstelle",

                abholadresse:
                    pickup
                        ? pickupAddress
                        : "",

                email:
                    pickup
                        ? email.value.trim()
                        : ""

            };

            /* =================================================
               DATEN IM SESSION STORAGE SPEICHERN
            ================================================= */

            try {

                sessionStorage.setItem(
                    "spendenDaten",
                    JSON.stringify(daten)
                );

                /*
                 * Nach erfolgreicher Registrierung
                 * zur Bestätigungsseite wechseln.
                 */

                window.location.href =
                    "bestaetigung.html";

            }

            catch (error) {

                const formError =
                    document.getElementById(
                        "uebergabeFehler"
                    );

                if (formError) {

                    formError.textContent =
                        "Die Daten konnten im Browser nicht gespeichert werden. Bitte versuche es erneut.";

                }

                console.error(
                    "Fehler beim Speichern:",
                    error
                );

            }

        }
    );

}

/* =========================================================
   BESTÄTIGUNGSSEITE
========================================================= */

function initConfirmation() {

    const confirmationCard =
        document.querySelector(
            ".confirmation-card"
        );

    /*
     * Nur auf der Bestätigungsseite ausführen.
     */

    if (!confirmationCard) {

        return;

    }

    /* =====================================================
       DATEN AUS SESSION STORAGE LADEN
    ===================================================== */

    const gespeicherteDaten =
        sessionStorage.getItem(
            "spendenDaten"
        );

    /*
     * Falls keine Daten existieren,
     * wird zurück zur Registrierung geleitet.
     */

    if (!gespeicherteDaten) {

        window.location.href =
            "registrierung.html";

        return;

    }

    let daten;

    /* =====================================================
       JSON DATEN AUSLESEN
    ===================================================== */

    try {

        daten =
            JSON.parse(
                gespeicherteDaten
            );

    }

    catch (error) {

        sessionStorage.removeItem(
            "spendenDaten"
        );

        window.location.href =
            "registrierung.html";

        return;

    }

    /* =====================================================
       DATEN AUF DER BESTÄTIGUNGSSEITE ANZEIGEN
    ===================================================== */

    document.getElementById(
        "bestaetigungUebergabe"
    ).textContent =
        daten.uebergabeart || "-";

    document.getElementById(
        "bestaetigungKleidung"
    ).textContent =
        daten.kleidung || "-";

    document.getElementById(
        "bestaetigungKrise"
    ).textContent =
        daten.krisengebiet || "-";

    document.getElementById(
        "bestaetigungDatum"
    ).textContent =
        daten.datum || "-";

    document.getElementById(
        "bestaetigungUhrzeit"
    ).textContent =
        daten.uhrzeit || "-";

    document.getElementById(
        "bestaetigungOrt"
    ).textContent =
        daten.ort || "-";

    /* =====================================================
       HINWEISE ERMITTELN
    ===================================================== */

    const geschaeftsstellenHinweis =
        document.getElementById(
            "geschaeftsstellenHinweis"
        );

    const abholHinweis =
        document.getElementById(
            "abholHinweis"
        );

    /* =====================================================
       GESCHÄFTSSTELLE
    ===================================================== */

    if (
        daten.uebergabeart ===
        "Geschäftsstelle"
    ) {

        geschaeftsstellenHinweis.hidden =
            false;

    }

    /* =====================================================
       ABHOLUNG
    ===================================================== */

    if (
        daten.uebergabeart ===
        "Abholung"
    ) {

        abholHinweis.hidden =
            false;

        document.getElementById(
            "bestaetigungEmail"
        ).textContent =
            daten.email || "-";

        document.getElementById(
            "bestaetigungAbholadresse"
        ).textContent =
            daten.abholadresse || "-";

    }

}
