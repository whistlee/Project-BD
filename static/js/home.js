/*
 * JavaScript file for the application to demonstrate
 * using the API
 */

// Create the namespace instance
let ns = {};

// Create the model instance
ns.model = (function () {
    'use strict';

    let $event_pump = $('body');

    // Return the API
    return {
        'read': function () {
            let ajax_options = {
                type: 'GET',
                url: 'api/scores',
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
        create: function (league, date, home_team, away_team, ht_score, at_score) {
            let ajax_options = {
                type: 'POST',
                url: 'api/scores',
                accepts: 'application/json',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    "league": league,
                    "date": date,
                    "home_team": home_team,
                    "away_team": away_team,
                    "ht_score": ht_score,
                    "at_score": at_score
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
        update: function (league, date, home_team, away_team, ht_score, at_score) {
            let ajax_options = {
                type: 'PUT',
                url: 'api/scores/' + date,
                accepts: 'application/json',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    "league": league,
                    "date": date,
                    "home_team": home_team,
                    "away_team": away_team,
                    "ht_score": ht_score,
                    "at_score": at_score
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
        'delete': function (date) {
            let ajax_options = {
                type: 'DELETE',
                url: 'api/scores/' + date,
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

// Create the view instance
ns.view = (function () {
    'use strict';

    let $league = $('#league'),
        $date = $('#date'),
        $home_team = $('#home_team'),
        $away_team = $('#away_team'),
        $ht_score = $('#ht_score'),
        $at_score = $('#at_score');

    // return the API
    return {
        reset: function () {
            $league.val('');
            $date.val('').focus();
            $home_team.val('');
            $away_team.val('');
            $ht_score.val('');
            $at_score.val('');

        },
        update_editor: function (league, date, home_team, away_team, ht_score, at_score) {
            $league.val(league);
            $date.val(date).focus();
            $home_team.val(home_team);
            $away_team.val(away_team);
            $ht_score.val(ht_score);
            $at_score.val(at_score);

        },
        build_table: function (scores) {
            let rows = ''

            // clear the table
            $('.scores table > tbody').empty();

            // did we get a people array?
            if (scores) {
                for (let i = 0, l = scores.length; i < l; i++) {
                    rows += `<tr><td class="league">${scores[i].league}</td><td class="date">${scores[i].date}</td><td class="home_team">${scores[i].home_team}</td><td class="away_team">${scores[i].away_team}</td><td class="ht_score">${scores[i].ht_score}</td><td class="at_score">${scores[i].at_score}</td></tr>`;
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

// Create the controller
ns.controller = (function (m, v) {
    'use strict';

    let model = m,
        view = v,
        $event_pump = $('body'),
        $league = $('#league'),
        $date = $('#date'),
        $home_team = $('#home_team'),
        $away_team = $('#away_team'),
        $ht_score = $('#ht_score'),
        $at_score = $('#at_score');

    // Get the data from the model after the controller is done initializing
    setTimeout(function () {
        model.read();
    }, 100)

    // Validate input
    function validate(league, date, home_team, away_team, ht_score, at_score) {
        return league !== "" && date !== "" && home_team !== "" && away_team !== "" && ht_score !== "" && at_score !== "";
    }

    // Create our event handlers
    $('#create').click(function (e) {
        let league = $league.val(),
            date = $date.val(),
            home_team = $home_team.val(),
            away_team = $away_team.val(),
            ht_score = $ht_score.val(),
            at_score = $at_score.val();

        e.preventDefault();

        if (validate(league, date, home_team, away_team, ht_score, at_score)) {
            model.create(league, date, home_team, away_team, ht_score, at_score)
        } else {
            alert('Problem with first or last name input');
        }
    });

    $('#update').click(function (e) {
        let league = $league.val(),
            date = $date.val(),
            home_team = $home_team.val(),
            away_team = $away_team.val(),
            ht_score = $ht_score.val(),
            at_score = $at_score.val();

        e.preventDefault();

        if (validate(league, date, home_team, away_team, ht_score, at_score)) {
            model.update(league, date, home_team, away_team, ht_score, at_score)
        } else {
            alert('Problem with first or last name input');
        }
        e.preventDefault();
    });

    $('#delete').click(function (e) {
        let date = $date.val();

        e.preventDefault();

        if (validate('placeholder', date, 'placeholder', 'placeholder', 'placeholder', 'placeholder')) {
            model.delete(date)
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
            league,
            date,
            home_team,
            away_team,
            ht_score,
            at_score;

        league = $target
            .parent()
            .find('td.league')
            .text();

        date = $target
            .parent()
            .find('td.date')
            .text();

        home_team = $target
            .parent()
            .find('td.home_team')
            .text();

        away_team = $target
            .parent()
            .find('td.away_team')
            .text();

        ht_score = $target
            .parent()
            .find('td.ht_score')
            .text();

        at_score = $target
            .parent()
            .find('td.at_score')
            .text();

        view.update_editor(league, date, home_team, away_team, ht_score, at_score);
    });

    // Handle the model events
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
