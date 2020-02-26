// Tworzymy przestrzeń nazw
let ns = {};

// Tworzymy model instancji
ns.model = (function () {
    'use strict';

    let $event_pump = $('body');
    // Zwracamy API
    return {
        'read': function () {
            let ajax_options = {
                type: 'GET',
                url: 'api/bocznica',
                accepts: 'application/json',
                dataType: 'json'
            };
            $.ajax(ajax_options)
                .done(function (data) {
                    $event_pump.trigger('model_read_success', [data]);
                })
                .fail(function (xhr, textStatus, errorThrown) {
                    $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
                })
        },
        create: function (nazwa) {
            let ajax_options = {
                type: 'POST',
                url: 'api/bocznica',
                accepts: 'application/json',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    "nazwa": nazwa
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
        update: function (nazwa) {
            let ajax_options = {
                type: 'PUT',
                url: 'api/bocznica/' + nazwa,
                accepts: 'application/json',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    "nazwa": nazwa
                })
            };
            $.ajax(ajax_options)
                .done(function (data) {
                    $event_pump.trigger('model_update_success', [data]);
                })
                .fail(function (xhr, textStatus, errorThrown) {
                    $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
                })
        },
        'delete': function (nazwa) {
            let ajax_options = {
                type: 'DELETE',
                url: 'api/bocznica/' + nazwa,
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
        }
    };

}());

// Tworzymy instancje widoku
ns.view = (function () {
    'use strict';

    let $nazwa = $('#nazwa');
    // return the API
    return {
        reset: function () {
            $nazwa.val('').focus();

        },
        update_editor: function (nazwa) {
            $nazwa.val(nazwa).focus();
        },
        build_table: function (bocznica) {
            let rows = ''

            // clear the table
            $('.flex-auto table > tbody').empty();

            // did we get a people array?
            if (bocznica) {
                for (let i = 0, l = bocznica.length; i < l; i++) {
                    rows += `<tr><td class="nazwa">${bocznica[i].nazwa}</td></tr>`;
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

// Tworzymy kontroler
ns.controller = (function (m, v) {
    'use strict';

    let model = m,
        view = v,
        $event_pump = $('body'),
        $nazwa = $('#nazwa');

    // Pobieramy dane z widoku po tym jak kontroler skonczy inicjalizacje
    setTimeout(function () {
        model.read();
    }, 100)

    // Walidacja danych
    function validate(nazwa) {
        return nazwa !== "";
    }

    // Obsluga zdarzen
    $('#create').click(function (e) {
        let nazwa = $nazwa.val();

        e.preventDefault();

        if (validate(nazwa)) {
            model.create(nazwa)
        } else {
            alert('Problem with first or last name input');
        }
    });

    $('#update').click(function (e) {
        let nazwa = $nazwa.val();

        e.preventDefault();

        if (validate(nazwa)) {
            model.update(nazwa)
        } else {
            alert('Problem with first or last name input');
        }
        e.preventDefault();
    });

    $('#delete').click(function (e) {
        let nazwa = $nazwa.val();

        e.preventDefault();

        if (validate(nazwa)) {
            model.delete(nazwa)
        } else {
            alert('Problem with first or last name input');
        }
        e.preventDefault();
    });

    $('#reset').click(function () {
        view.reset();
    })

    $('table > tbody').on('dblclick', 'tr', function (e) {
        let $target = $(e.target),
            nazwa;

        nazwa = $target
            .parent()
            .find('td.nazwa')
            .text();
        view.update_editor(nazwa);
    });

    // Obsluga zdarzen modelu
    $event_pump.on('model_read_success', function (e, data) {
        view.build_table(data);
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