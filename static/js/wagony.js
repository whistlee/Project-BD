let ns = {};

ns.model = (function () {
    'use strict';

    let $event_pump = $('body');
    return {
        'read': function () {
            let ajax_options = {
                type: 'GET',
                url: 'api/wagony',
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
        create: function (nazwa, numer_wagonu, numer) {
            let ajax_options = {
                type: 'POST',
                url: 'api/wagony',
                accepts: 'application/json',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    "nazwa": nazwa,
                    "numer_wagonu": numer_wagonu,
                    "numer": numer
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
        update: function (nazwa, numer_wagonu, numer) {
            let ajax_options = {
                type: 'PUT',
                url: 'api/wagony/' + numer_wagonu,
                accepts: 'application/json',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    "nazwa": nazwa,
                    "numer_wagonu": numer_wagonu,
                    "numer": numer
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
        'delete': function (numer_wagonu) {
            let ajax_options = {
                type: 'DELETE',
                url: 'api/wagony/' + numer_wagonu,
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
        'opusc_tor': function (numer_wagonu) {
            let ajax_options = {
                type: 'DELETE',
                url: 'api/wagony/opusc-tor/' + numer_wagonu,
                accepts: 'application/json',
                contentType: 'plain/text'
            };
            $.ajax(ajax_options)
                .done(function (data) {
                    $event_pump.trigger('model_left_track_success', [data]);
                })
                .fail(function (xhr, textStatus, errorThrown) {
                    $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
                })
        },
    };

}());

ns.view = (function () {
    'use strict';

    let $nazwa = $('#nazwa'),
        $numer_wagonu = $('#numer_wagonu'),
        $numer = $('#numer');

    return {
        reset: function () {
            $nazwa.val('');
            $numer_wagonu.val('').focus();
            $numer.val('');

        },
        update_editor: function (nazwa, numer_wagonu, numer) {
            $nazwa.val(nazwa);
            $numer_wagonu.val(numer_wagonu).focus();
            $numer.val(numer);
        },
        build_table: function (wagony) {
            let rows = ''

            $('.flex-auto table > tbody').empty();

            if (wagony) {
                for (let i = 0, l = wagony.length; i < l; i++) {
                    rows += `<tr><td class="nazwa">${wagony[i].nazwa}</td><td class="numer">${wagony[i].numer}</td><td class="numer_wagonu">${wagony[i].numer_wagonu}</td><td class="czas_wjazdu">${wagony[i].czas_wjazdu}</td><td class="dlugosc">${wagony[i].dlugosc}</td></tr>`;
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
        $numer_wagonu = $('#numer_wagonu'),
        $numer = $('#numer');

    setTimeout(function () {
        model.read();
    }, 100)

    function validate(nazwa, numer_wagonu, numer) {
        return nazwa !== "" && numer_wagonu !== "" && numer !== "" && numer_wagonu.length === 7;
    }

    $('#create').click(function (e) {
        let nazwa = $nazwa.val(),
            numer_wagonu = $numer_wagonu.val(),
            numer = $numer.val();

        e.preventDefault();

        if (validate(nazwa, numer_wagonu, numer)) {
            model.create(nazwa, numer_wagonu, numer)
        } else {
            alert('Zle wprowadzone dane, pola nie moga byc puste a numer_wagonu powinien miec 7 cyfr');
        }
    });

    $('#update').click(function (e) {
        let nazwa = $nazwa.val(),
            numer_wagonu = $numer_wagonu.val(),
            numer = $numer.val();

        e.preventDefault();

        if (validate(nazwa, numer_wagonu, numer)) {
            model.update(nazwa, numer_wagonu, numer)
        } else {
            alert('Zle wprowadzone dane, pola nie moga byc puste a numer_wagonu powinien miec 7 cyfr');
        }
        e.preventDefault();
    });

    $('#delete').click(function (e) {
        let numer_wagonu = $numer_wagonu.val();

        e.preventDefault();

        if (validate('placeholder', numer_wagonu, 'placeholder')) {
            model.delete(numer_wagonu)
        } else {
            alert('Zle wprowadzone dane, pola nie moga byc puste a numer_wagonu powinien miec 7 cyfr');
        }
        e.preventDefault();
    });

    $('#opusc_tor').click(function (e) {
        let numer_wagonu = $numer_wagonu.val();

        e.preventDefault();

        if (validate('placeholder', numer_wagonu, 'placeholder')) {
            model.opusc_tor(numer_wagonu)
        } else {
            alert('Zle wprowadzone dane, pola nie moga byc puste a numer_wagonu powinien miec 7 cyfr');
        }
        e.preventDefault();
    });

    $('#reset').click(function () {
        view.reset();
    })

    $('table > tbody').on('dblclick', 'tr', function (e) {
        let $target = $(e.target),
            nazwa,
            numer_wagonu,
            numer;

        nazwa = $target
            .parent()
            .find('td.nazwa')
            .text();

        numer_wagonu = $target
            .parent()
            .find('td.numer_wagonu')
            .text();

        numer = $target
            .parent()
            .find('td.numer')
            .text();

        view.update_editor(nazwa, numer_wagonu, numer);
    });

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

    $event_pump.on('model_left_track_success', function (e, data) {
        model.read();
        view.reset();
    });

    $event_pump.on('model_error', function (e, xhr, textStatus, errorThrown) {
        let error_msg = textStatus + ': ' + errorThrown + ' - ' + xhr.responseJSON.detail;
        view.error(error_msg);
        console.log(error_msg);
    })
}(ns.model, ns.view));
