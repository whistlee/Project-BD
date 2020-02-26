let ns = {};

ns.model = (function () {
    'use strict';

    let $event_pump = $('body');
    // Return the API
    return {
        'read': function () {
            let ajax_options = {
                type: 'GET',
                url: 'api/firmy',
                accepts: 'application/json',
                dataType: 'json'
            };
            $.ajax(ajax_options)
                .done(function (data) {
                    $event_pump.trigger('model_read_success', data);
                })
                .fail(function (xhr, textStatus, errorThrown) {
                    $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
                })
        },
        create: function (nazwa, telefon, NIP, email, adres, miasto,kraj,kod_pocztowy) {
            let ajax_options = {
                type: 'POST',
                url: 'api/firmy',
                accepts: 'application/json',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    "nazwa": nazwa,
                    "telefon": telefon,
                    "NIP": NIP,
                    "email": email,
                    "adres": adres,
                    "miasto": miasto,
                    "kraj": kraj,
                    "kod_pocztowy": kod_pocztowy
                })
            };
            $.ajax(ajax_options)
                .done(function (data) {
                    $event_pump.trigger('model_create_success', [data]);
                })
                .fail(function (xhr, textStatus, errorThrown) {
                    $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
                })
        },
        update: function (firmy) {
            let ajax_options = {
                type: 'PUT',
                url: 'api/firmy/' + firmy.NIP,
                accepts: 'application/json',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify(firmy)
            };
            $.ajax(ajax_options)
                .done(function (data) {
                    $event_pump.trigger('model_update_success', [data]);
                })
                .fail(function (xhr, textStatus, errorThrown) {
                    $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
                })
        },
        'delete': function (NIP) {
            let ajax_options = {
                type: 'DELETE',
                url: 'api/firmy/' + NIP,
                accepts: 'application/json',
                contentType: 'plain/text'
            };
            $.ajax(ajax_options)
                .done(function (data) {
                    $event_pump.trigger('model_delete_success', [data]);
                })
                .fail(function (xhr, textStatus, errorThrown) {
                    $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
                })
        },
        'firma_uzytkownika': function (NIP) {
            let ajax_options = {
                type: 'PUT',
                url: '/api/firmy/firma-uzytkownika/' + NIP,
                accepts: 'application/json',
                contentType: 'plain/text'
            };
            $.ajax(ajax_options)
                .done(function (data) {
                    $event_pump.trigger('model_firma_uzytkownika_success', [data]);
                })
                .fail(function (xhr, textStatus, errorThrown) {
                    $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
                })
        },
        'firma_wagonu': function (NIP) {
            let ajax_options = {
                type: 'PUT',
                url: '/api/firmy/firma-wagonow/' + NIP,
                accepts: 'application/json',
                contentType: 'plain/text'
            };
            $.ajax(ajax_options)
                .done(function (data) {
                    $event_pump.trigger('model_firma_wagonu_success', [data]);
                })
                .fail(function (xhr, textStatus, errorThrown) {
                    $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
                })
        }
    };

}());

ns.view = (function () {
    'use strict';

    let $nazwa = $('#nazwa'),
        $telefon = $('#telefon'),
        $NIP = $('#NIP'),
        $email = $('#email'),
        $adres = $('#adres'),
        $miasto = $('#miasto'),
        $kraj= $('#kraj'),
        $kod_pocztowy = $('#kod_pocztowy');

    return {
        reset: function () {
            $nazwa.val('').focus();
            $telefon.val('');
            $NIP.val('');
            $email.val('');
            $adres.val('');
            $miasto.val('');
            $kraj.val('');
            $kod_pocztowy.val('');
        },
        update_editor: function (nazwa, telefon, NIP, email, adres, miasto,kraj,kod_pocztowy) {
            $nazwa.val(nazwa).focus();
            $telefon.val(telefon);
            $NIP.val(NIP);
            $email.val(email);
            $adres.val(adres);
            $miasto.val(miasto);
            $kraj.val(kraj);
            $kod_pocztowy.val(kod_pocztowy);
        },
        build_table: function (firmy) {
            let rows = ''

            // clear the table
            $('.flex-auto table > tbody').empty();

            // did we get a people array?
            if (firmy) {
                for (let i = 0, l = firmy.length; i < l; i++) {
                    rows += `
                    <tr>
                        <td class="nazwa">${firmy[i].nazwa}</td>
                        <td class="NIP">${firmy[i].NIP}</td>
                        <td class="telefon">${firmy[i].telefon}</td>
                        <td class="email">${firmy[i].email}</td>
                        <td class="adres">${firmy[i].adres}</td>
                        <td class="miasto">${firmy[i].miasto}</td>
                        <td class="kraj">${firmy[i].kraj}</td>
                        <td class="kod_pocztowy">${firmy[i].kod_pocztowy}</td>
                    </tr>
                    `;
                }
                $('table > tbody').append(rows);
            }
        },
        error: function (error_msg) {
            $('.error')
                .text(error_msg)
                .css('visibility', 'visible');
            setTimeout(function () {
                $('.error').css('visibility', 'hidden');
            }, 3000)
        }
    };
}());

ns.controller = (function (m, v) {
    'use strict';

    let model = m,
        view = v,
        $event_pump = $('body'),
        $nazwa = $('#nazwa'),
        $telefon = $('#telefon'),
        $NIP = $('#NIP'),
        $email = $('#email'),
        $adres = $('#adres'),
        $miasto = $('#miasto'),
        $kraj= $('#kraj'),
        $kod_pocztowy = $('#kod_pocztowy');

    setTimeout(function () {
        model.read();
    }, 100)

    function validate(nazwa, telefon, NIP, email, adres, miasto,kraj,kod_pocztowy) {
        return nazwa !== "" && telefon !== "" && NIP !== "" && email !== "" && adres !== "" && miasto !== "" && kraj !== "" && kod_pocztowy !== "";
    }

    $('#create').click(function (e) {
        let nazwa = $nazwa.val(),
            NIP = $NIP.val(),
            telefon = $telefon.val(),
            email = $email.val(),
            adres = $adres.val(),
            miasto = $miasto.val(),
            kraj = $kraj.val(),
            kod_pocztowy = $kod_pocztowy.val();

            e.preventDefault();

        if (validate(nazwa, telefon, NIP, email, adres, miasto,kraj,kod_pocztowy)) {
            model.create(nazwa, telefon, NIP, email, adres, miasto,kraj,kod_pocztowy)
        } else {
            alert('Uzupelnij wszystkie dane');
        }
    });

    $('#update').click(function (e) {
        let nazwa = $nazwa.val(),
            NIP = $NIP.val(),
            telefon = $telefon.val(),
            email = $email.val(),
            adres = $adres.val(),
            miasto = $miasto.val(),
            kraj = $kraj.val(),
            kod_pocztowy = $kod_pocztowy.val();

        e.preventDefault();

        if (validate(nazwa, telefon, NIP, email, adres, miasto,kraj,kod_pocztowy)) {
            model.update(nazwa, telefon, NIP, email, adres, miasto,kraj,kod_pocztowy)
        } else {
            alert('Uzupelnij wszystkie dane');
        }
        e.preventDefault();
    });

    $('#delete').click(function (e) {
        let NIP = $NIP.val();

        e.preventDefault();

        if (validate('placeholder', 'placeholder', NIP,'placeholder','placeholder','placeholder','placeholder','placeholder')) {
            model.delete(NIP)
        } else {
            alert('Uzupelnij wszystkie dane');
        }
        e.preventDefault();
    });
    $('#user_company').click(function (e) {
        let NIP = $NIP.val();

        e.preventDefault();

        if (validate('placeholder', 'placeholder', NIP,'placeholder','placeholder','placeholder','placeholder','placeholder')) {
            model.firma_uzytkownika(NIP)
        } else {
            alert('Uzupelnij wszystkie dane');
        }
        e.preventDefault();
    });
    $('#wagon_company').click(function (e) {
        let NIP = $NIP.val();

        e.preventDefault();

        if (validate('placeholder', 'placeholder', NIP,'placeholder','placeholder','placeholder','placeholder','placeholder')) {
            model.firma_wagonu(NIP)
        } else {
            alert('Uzupelnij wszystkie dane');
        }
        e.preventDefault();
    });

    $('#reset').click(function () {
        view.reset();
    });

    $('table > tbody').on('dblclick', 'tr', function (e) {
        let $target = $(e.target),
            nazwa,
            NIP,
            telefon,
            email,
            adres,
            miasto,
            kraj,
            kod_pocztowy;

        nazwa = $target
            .parent()
            .find('td.nazwa')
            .text();

        NIP = $target
            .parent()
            .find('td.NIP')
            .text();

        telefon = $target
            .parent()
            .find('td.telefon')
            .text();

        email = $target
            .parent()
            .find('td.email')
            .text();

        adres = $target
            .parent()
            .find('td.adres')
            .text();

        miasto = $target
            .parent()
            .find('td.miasto')
            .text();

        kraj = $target
            .parent()
            .find('td.kraj')
            .text();

        kod_pocztowy = $target
            .parent()
            .find('td.kod_pocztowy')
            .text();


        view.update_editor(nazwa, telefon, NIP, email, adres, miasto,kraj,kod_pocztowy);
    });

    $event_pump.on('model_read_success', function (e, data) {
        view.build_table(data);
        view.reset();
    });

    $event_pump.on('model_firma_uzytkownika_success', function (e, data) {
        view.reset();
    });

    $event_pump.on('model_firma_wagonu_success', function (e, data) {
        view.reset();
    });

    $event_pump.on('model_create_success', function (e, data) {
        model.read();
        view.reset();
    });

    $event_pump.on('model_update_success', function (e, data) {
        model.read();
        view.reset();
    });

    $event_pump.on('model_delete_success', function (e, data) {
        model.read();
        view.reset();
    });

    $event_pump.on('model_error', function (e, xhr, textStatus, errorThrown) {
        let error_msg = textStatus + ': ' + errorThrown + ' - ' + xhr.responseJSON.detail;
        view.error(error_msg);
        console.log(error_msg);
    })
}(ns.model, ns.view));
