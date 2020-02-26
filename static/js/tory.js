let ns = {};

ns.model = (function () {
    'use strict';

    let $event_pump = $('body');
    return {
        'read': function () {
            let ajax_options = {
                type: 'GET',
                url: 'api/tory',
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
        create: function (nazwa, dlugosc, numer) {
            let ajax_options = {
                type: 'POST',
                url: 'api/tory',
                accepts: 'application/json',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    "nazwa": nazwa,
                    "dlugosc": dlugosc,
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
        update: function (nazwa, dlugosc, numer) {
            let ajax_options = {
                type: 'PUT',
                url: 'api/tory/' + numer,
                accepts: 'application/json',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    "nazwa": nazwa,
                    "dlugosc": dlugosc,
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
        'delete': function (numer) {
            let ajax_options = {
                type: 'DELETE',
                url: 'api/tory/' + numer,
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
        $dlugosc = $('#dlugosc'),
        $numer = $('#numer');

    // return the API
    return {
        reset: function () {
            $nazwa.val('');
            $dlugosc.val('').focus();
            $numer.val('');

        },
        update_editor: function (nazwa, dlugosc, numer) {
            $nazwa.val(nazwa);
            $dlugosc.val(dlugosc).focus();
            $numer.val(numer);
        },
        build_table: function (tory) {
            let rows = '',
                temp,temp1,temp2,
                zajetosToru,wolny;
            let element = document.querySelector(".tory");

            // did we get a array?
            if (tory) {
                for (let i = 0, l = tory.length; i < l; i++) {
                    temp = Number(tory[i].zajetosc);
                    temp1 = Number(tory[i].dlugosc);
                    temp2 = temp1 - temp;
                    zajetosToru = (temp / temp1) * 100;
                    wolny = 100 - zajetosToru;
                    wolny = wolny + "%";
                    zajetosToru = zajetosToru + "%";
                    console.log(zajetosToru);
                    rows += `${tory[i].nazwa} tor ${tory[i].numer}
                              <div class="progress position-relative">
                                <div class="bar bar-success" style="width: ${zajetosToru}">${temp}</div>
                                <div class="bar bar-danger" style="width: ${wolny}">${temp2}</div>
                              </div>`;
                }
                element.innerHTML = rows;
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
        $dlugosc = $('#dlugosc'),
        $numer = $('#numer');

    setTimeout(function () {
        model.read();
    }, 100)

    function validate(nazwa, dlugosc, numer) {
        return nazwa !== "" && dlugosc !== "" && numer !== "";
    }

    $('#create').click(function (e) {
        let nazwa = $nazwa.val(),
            dlugosc = $dlugosc.val(),
            numer = $numer.val();

        e.preventDefault();

        if (validate(nazwa, dlugosc, numer)) {
            model.create(nazwa, dlugosc, numer)
        } else {
            alert('Problem with first or last name input');
        }
    });

    $('#update').click(function (e) {
        let nazwa = $nazwa.val(),
            dlugosc = $dlugosc.val(),
            numer = $numer.val();

        e.preventDefault();

        if (validate(nazwa, dlugosc, numer)) {
            model.update(nazwa, dlugosc, numer)
        } else {
            alert('Problem with first or last name input');
        }
        e.preventDefault();
    });

    $('#delete').click(function (e) {
        let numer = $numer.val();

        e.preventDefault();

        if (validate('placeholder', 'placeholder', numer)) {
            model.delete(numer)
        } else {
            alert('Problem z podanymi danymi');
        }
        e.preventDefault();
    });

    $('#reset').click(function () {
        view.reset();
    })

    $('table > tbody').on('dblclick', 'tr', function (e) {
        let $target = $(e.target),
            nazwa,
            dlugosc,
            numer;

        nazwa = $target
            .parent()
            .find('td.nazwa')
            .text();

        dlugosc = $target
            .parent()
            .find('td.dlugosc')
            .text();

        numer = $target
            .parent()
            .find('td.numer')
            .text();

        view.update_editor(nazwa, dlugosc, numer);
    });

    $event_pump.on('model_read_success', function (e, data) {
        view.build_table(data);
        view.reset();
    });

    $event_pump.on('model_create_success', function (e, data) {
        model.read();
    });

    $event_pump.on('model_update_success', function (e, data) {
        model.read();
    });

    $event_pump.on('model_delete_success', function (e, data) {
        model.read();
    });

    $event_pump.on('model_error', function (e, xhr, textStatus, errorThrown) {
        let error_msg = textStatus + ': ' + errorThrown + ' - ' + xhr.responseJSON.detail;
        view.error(error_msg);
        console.log(error_msg);
    })
}(ns.model, ns.view));