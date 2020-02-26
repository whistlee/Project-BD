let ns = {};

ns.model = (function () {
    'use strict';

    let $event_pump = $('body');
    // Return the API
    return {
        'read': function () {
            let ajax_options = {
                type: 'GET',
                url: 'api/wagony-bazowe',
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
        create: function (nazwa, nr_startowy, nr_koncowy, dlugosc, wlasciciel, typ_wagonu) {
            let ajax_options = {
                type: 'POST',
                url: 'api/wagony-bazowe',
                accepts: 'application/json',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    "nazwa": nazwa,
                    "nr_startowy": nr_startowy,
                    "nr_koncowy": nr_koncowy,
                    "dlugosc": dlugosc,
                    "wlasciciel": wlasciciel,
                    "typ_wagonu": typ_wagonu
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
        update: function (wagon_bazowy) {
            let ajax_options = {
                type: 'PUT',
                url: 'api/wagony-bazowe/' + wagon_bazowy.nazwa,
                accepts: 'application/json',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify(wagon_bazowy)
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
                url: 'api/wagony-bazowe/' + nazwa,
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

ns.view = (function () {
    'use strict';

    let $nazwa = $('#nazwa'),
        $nr_startowy = $('#nr_startowy'),
        $nr_koncowy = $('#nr_koncowy'),
        $dlugosc = $('#dlugosc'),
        $wlasciciel = $('#wlasciciel'),
        $typ_wagonu = $('#typ_wagonu');

    return {
        reset: function () {
            $nazwa.val('').focus();
            $nr_startowy.val('');
            $nr_koncowy.val('');
            $wlasciciel.val('');
            $dlugosc.val('');
            $typ_wagonu.val('');
        },
        update_editor: function (nazwa, nr_startowy, nr_koncowy, dlugosc, wlasciciel, typ_wagonu) {
            $nazwa.val(nazwa).focus();
            $nr_startowy.val(nr_startowy);
            $nr_koncowy.val(nr_koncowy);
            $wlasciciel.val(wlasciciel);
            $dlugosc.val(dlugosc);
            $typ_wagonu.val(typ_wagonu);
        },
        build_table: function (wagony_bazowe) {
            let rows = ''

            // clear the table
            $('.flex-auto table > tbody').empty();

            // did we get a people array?
            if (wagony_bazowe) {
                for (let i = 0, l = wagony_bazowe.length; i < l; i++) {
                    rows += `<tr><td class="nazwa">${wagony_bazowe[i].nazwa}</td><td class="nr_startowy">${wagony_bazowe[i].nr_startowy}</td><td class="nr_koncowy">${wagony_bazowe[i].nr_koncowy}</td><td class="dlugosc">${wagony_bazowe[i].dlugosc}</td><td class="wlasciciel">${wagony_bazowe[i].wlasciciel}</td><td class="typ_wagonu">${wagony_bazowe[i].typ_wagonu}</td></tr>`;
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
        $nr_startowy = $('#nr_startowy'),
        $nr_koncowy = $('#nr_koncowy'),
        $dlugosc = $('#dlugosc'),
        $wlasciciel = $('#wlasciciel'),
        $typ_wagonu = $('#typ_wagonu');

    setTimeout(function () {
        model.read();
    }, 100)

    function validate(nazwa, nr_startowy, nr_koncowy, dlugosc, wlasciciel, typ_wagonu) {
        return nazwa !== "" && nr_startowy !== "" && nr_koncowy !== "" && dlugosc !== "" && wlasciciel !== "" && typ_wagonu !== "";
    }

    $('#create').click(function (e) {
        let nazwa = $nazwa.val(),
            nr_startowy = $nr_startowy.val(),
            nr_koncowy = $nr_koncowy.val(),
            dlugosc = $dlugosc.val(),
            wlasciciel = $wlasciciel.val(),
            typ_wagonu = $typ_wagonu.val();

            e.preventDefault();

        if (validate(nazwa, nr_startowy, nr_koncowy,dlugosc,wlasciciel,typ_wagonu)) {
            model.create(nazwa, nr_startowy, nr_koncowy,dlugosc,wlasciciel,typ_wagonu)
        } else {
            alert('Uzupelnij wszystkie dane');
        }
    });

    $('#update').click(function (e) {
        let nazwa = $nazwa.val(),
            nr_startowy = $nr_startowy.val(),
            nr_koncowy = $nr_koncowy.val(),
            dlugosc = $dlugosc.val(),
            wlasciciel = $wlasciciel.val(),
            typ_wagonu = $typ_wagonu.val();

        e.preventDefault();

        if (validate(nazwa, nr_startowy, nr_koncowy,dlugosc,wlasciciel,typ_wagonu)) {
            model.update(nazwa, nr_startowy, nr_koncowy,dlugosc,wlasciciel,typ_wagonu)
        } else {
            alert('Uzupelnij wszystkie dane');
        }
        e.preventDefault();
    });

    $('#delete').click(function (e) {
        let nazwa = $nazwa.val();

        e.preventDefault();

        if (validate(nazwa, 'placeholder', 'placeholder','placeholder','placeholder','placeholder')) {
            model.delete(nazwa)
        } else {
            alert('Problem with first or last name input');
        }
        e.preventDefault();
    });

    $('#reset').click(function () {
        view.reset();
    });

    $('table > tbody').on('dblclick', 'tr', function (e) {
        let $target = $(e.target),
            nazwa,
            nr_startowy,
            nr_koncowy,
            dlugosc,
            wlasciciel,
            typ_wagonu;

        nazwa = $target
            .parent()
            .find('td.nazwa')
            .text();

        nr_startowy = $target
            .parent()
            .find('td.nr_startowy')
            .text();

        nr_koncowy = $target
            .parent()
            .find('td.nr_koncowy')
            .text();

        dlugosc = $target
            .parent()
            .find('td.dlugosc')
            .text();

        wlasciciel = $target
            .parent()
            .find('td.wlasciciel')
            .text();

        typ_wagonu = $target
            .parent()
            .find('td.typ_wagonu')
            .text();


        view.update_editor(nazwa, nr_startowy, nr_koncowy,dlugosc,wlasciciel,typ_wagonu);
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

    $event_pump.on('model_error', function (e, xhr, textStatus, errorThrown) {
        let error_msg = textStatus + ': ' + errorThrown + ' - ' + xhr.responseJSON.detail;
        view.error(error_msg);
        console.log(error_msg);
    })
}(ns.model, ns.view));
