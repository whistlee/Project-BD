class Model {
    async read() {
        let options = {
            method: "GET",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            }
        };
        // Call the REST endpoint and wait for data
        let response = await fetch("/api/firmy", options);
        let data = await response.json();
        return data;
    }

    async readOne(NIP) {
        let options = {
            method: "GET",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            }
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/firmy/${NIP}`, options);
        let data = await response.json();
        return data;
    }

    async create(firmy) {
        let options = {
            method: "POST",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            },
            body: JSON.stringify(firmy)
        };
        // Call the REST endpoint and wait for data
        let response = await fetch(`/api/firmy`, options);
        let data = await response.json();
        return data;
    }

    async update(firmy) {
        let options = {
            method: "PUT",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            },
            body: JSON.stringify(firmy)
        };
        let response = await fetch(`/api/firmy/${firmy.NIP}`, options);
        let data = await response.json();
        return data;
    }

    async delete(NIP) {
        let options = {
            method: "DELETE",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            }
        };
        let response = await fetch(`/api/firmy/${NIP}`, options);
        return response;
    }

    async firma_uzytkownika(NIP) {
        let options = {
            method: "PUT",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            }
        };
        let response = await fetch(`/api/firmy/firma-uzytkownika/${NIP}`, options);
        return response;
    }


    async firma_wagonow(NIP) {
        let options = {
            method: "PUT",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "accepts": "application/json"
            }
        };
        let response = await fetch(`/api/firmy/firma-wagonow/${NIP}`, options);
        return response;
    }
}


class View {
    constructor() {
        this.table = document.querySelector(".flex-auto table");
        this.error = document.querySelector(".error");
        this.nazwa = document.getElementById("nazwa");
        this.telefon = document.getElementById("telefon");
        this.NIP = document.getElementById("NIP");
        this.email = document.getElementById("email");
        this.adres = document.getElementById("adres");
        this.miasto = document.getElementById("miasto");
        this.kraj = document.getElementById("kraj");
        this.kod_pocztowy = document.getElementById("kod_pocztowy");
        this.createButton = document.getElementById("create");
        this.updateButton = document.getElementById("update");
        this.deleteButton = document.getElementById("delete");
        this.resetButton = document.getElementById("reset");
        this.user_company = document.getElementById("user_company");
    }

    reset() {
        this.nazwa.value = "";
        this.telefon.value = "";
        this.NIP.value = "";
        this.email.value = "";
        this.adres.value = "";
        this.miasto.value = "";
        this.kraj.value = "";
        this.kod_pocztowy.value = "";
        this.NIP.focus();
    }

    updateEditor(firmy) {
        this.nazwa.value = firmy.nazwa;
        this.telefon.value = firmy.telefon;
        this.NIP.value = firmy.NIP;
        this.email.value = firmy.email;
        this.adres.value = firmy.adres;
        this.miasto.value = firmy.miasto;
        this.kraj.value = firmy.kraj;
        this.kod_pocztowy.value = firmy.kod_pocztowy;
        this.NIP.focus();
    }

    buildTable(firmy) {
        let tbody,
            html = "";
        firmy.forEach((firmy) => {
            html += `
            <tr data-nazwa="${firmy.nazwa}" data-NIP="${firmy.NIP}" data-telefon="${firmy.telefon}" data-email="${firmy.email}" data-adres="${firmy.adres}" data-miasto="${firmy.miasto}" data-kraj="${firmy.kraj}" data-kod_pocztowy="${firmy.kod_pocztowy}">
                <td class="nazwa">${firmy.nazwa}</td>
                <td class="NIP">${firmy.NIP}</td>
                <td class="telefon">${firmy.telefon}</td>
                <td class="email">${firmy.email}</td>
                <td class="adres">${firmy.adres}</td>
                <td class="miasto">${firmy.miasto}</td>
                <td class="kraj">${firmy.kraj}</td>
                <td class="kod_pocztowy">${firmy.kod_pocztowy}</td>
            </tr>`;
        });
        if (this.table.tBodies.length !== 0) {
            this.table.removeChild(this.table.getElementsByTagName("tbody")[0]);
        }
        tbody = this.table.createTBody();
        tbody.innerHTML = html;
    }

    errorMessage(message) {
        this.error.innerHTML = message;
        this.error.classList.add("visible");
        this.error.classList.remove("hidden");
        setTimeout(() => {
            this.error.classList.add("hidden");
            this.error.classList.remove("visible");
        }, 2000);
    }
}


class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.initialize();
    }

    async initialize() {
        await this.initializeTable();
        this.initializeTableEvents();
        this.initializeCreateEvent();
        this.initializeUpdateEvent();
        this.initializeDeleteEvent();
        this.initializeResetEvent();
        this.initializeUserCompanyEvent();
        this.initializeWagonsCompanyEvent();
    }

    async initializeTable() {
        try {
            let urlFirmaId = +document.getElementById("url_firma_id").value,
                firmy = await this.model.read();

            this.view.buildTable(firmy);
            if (urlFirmaId) {
                let firmy = await this.model.readOne(urlFirmaId);
                this.view.updateEditor(firmy);
            } else {
                this.view.reset();

            }
            this.initializeTableEvents();
        } catch (err) {
            this.view.errorMessage(err);
        }
    }

    initializeTableEvents() {
        document.querySelector("table tbody").addEventListener("click", (evt) => {
            let target = evt.target.parentElement,
                nazwa = target.getAttribute("data-nazwa"),
                NIP = target.getAttribute("data-NIP"),
                telefon = target.getAttribute("data-telefon"),
                email = target.getAttribute("data-email"),
                adres = target.getAttribute("data-adres"),
                miasto = target.getAttribute("data-miasto"),
                kraj = target.getAttribute("data-kraj"),
                kod_pocztowy = target.getAttribute("data-kod_pocztowy");

            this.view.updateEditor({
                nazwa: nazwa,
                NIP: NIP,
                email: email,
                telefon: telefon,
                adres: adres,
                miasto: miasto,
                kraj: kraj,
                kod_pocztowy: kod_pocztowy
            });
        });
    }

    initializeCreateEvent() {
        document.getElementById("create").addEventListener("click", async (evt) => {
            let nazwa = document.getElementById("nazwa").value,
                telefon = document.getElementById("telefon").value,
                NIP = document.getElementById("NIP").value,
                email = document.getElementById("email").value,
                adres = document.getElementById("adres").value,
                miasto = document.getElementById("miasto").value,
                kraj = document.getElementById("kraj").value,
                kod_pocztowy = document.getElementById("kod_pocztowy").value;

            evt.preventDefault();
            try {
                await this.model.create({
                    nazwa: nazwa,
                    telefon: telefon,
                    NIP: NIP,
                    email: email,
                    adres: adres,
                    miasto: miasto,
                    kraj: kraj,
                    kod_pocztowy: kod_pocztowy
                });
                await this.initializeTable();
            } catch (err) {
                this.view.errorMessage(err);
            }
        });
    }

    initializeUpdateEvent() {
        document.getElementById("update").addEventListener("click", async (evt) => {
            let nazwa = +document.getElementById("nazwa").value,
                NIP = document.getElementById("NIP").value,
                telefon = document.getElementById("telefon").value,
                email = document.getElementById("email").value,
                adres = document.getElementById("adres").value,
                miasto = document.getElementById("miasto").value,
                kraj = document.getElementById("kraj").value,
                kod_pocztowy = document.getElementById("kod_pocztowy").value;


            evt.preventDefault();
            try {
                await this.model.update({
                    nazwa: nazwa,
                    NIP: NIP,
                    telefon: telefon,
                    email: email,
                    adres: adres,
                    miasto: miasto,
                    kraj: kraj,
                    kod_pocztowy: kod_pocztowy
                });
                await this.initializeTable();
            } catch (err) {
                this.view.errorMessage(err);
            }
        });
    }

    initializeDeleteEvent() {
        document.getElementById("delete").addEventListener("click", async (evt) => {
            let NIP = +document.getElementById("NIP").value;

            evt.preventDefault();
            try {
                await this.model.delete(NIP);
                await this.initializeTable();
            } catch (err) {
                this.view.errorMessage(err);
            }
        });
    }

    initializeUserCompanyEvent() {
        document.getElementById("user_company").addEventListener("click", async (evt) => {
            let NIP = +document.getElementById("NIP").value;

            evt.preventDefault();
            try {
                await this.model.firma_uzytkownika(NIP);
                await this.initializeTable();
            } catch (err) {
                this.view.errorMessage(err);
            }
        });
    }

    initializeWagonsCompanyEvent() {
        document.getElementById("wagon_company").addEventListener("click", async (evt) => {
            let NIP = +document.getElementById("NIP").value;

            evt.preventDefault();
            try {
                await this.model.firma_wagonow(NIP);
                await this.initializeTable();
            } catch (err) {
                this.view.errorMessage(err);
            }
        });
    }

    initializeResetEvent() {
        document.getElementById("reset").addEventListener("click", async (evt) => {
            evt.preventDefault();
            this.view.reset();
        });
    }
}

const model = new Model();
const view = new View();
const controller = new Controller(model, view);

export default {
    model,
    view,
    controller
};