// La fase regular usa jornadas BO1. Los horarios confirmados se guardan en
// game.startsAt en ISO 8601 con zona, por ejemplo 2026-11-23T20:00:00+01:00.
const roundNumber = (game) => Number(game.week.match(/\d+/)[0]);
const hasTeam = (game, team) => game.a === team || game.b === team;
const slug = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
const matchId = (game) => `partido-j${roundNumber(game)}-${slug(game.a)}-${slug(game.b)}`;
const matchesById = new Map(games.filter((game) => !game.forfeitedBy).map((game) => [matchId(game), game]));
const rounds = [...new Set(games.map(roundNumber))].sort((a, b) => a - b);
const pending = games.filter((game) => !game.winner);
const currentRound = pending.length ? Math.min(...pending.map(roundNumber)) : rounds.at(-1);
const latestResultRound = decidedGames.length ? Math.max(...decidedGames.map(roundNumber)) : null;
const inRound = (number) => games.filter((game) => roundNumber(game) === number);
const currentTeams = [...document.querySelectorAll('.team-panel')].map((card) => card.dataset.team);
const formattedTime = new Intl.DateTimeFormat('es-ES', {
  timeZone:'Europe/Madrid', weekday:'short', day:'numeric', month:'short', hour:'2-digit', minute:'2-digit'
});

function confirmedTime(game) {
  if (!game.startsAt || !/(?:Z|[+-]\d\d:\d\d)$/i.test(game.startsAt)) return null;
  const time = new Date(game.startsAt);
  return Number.isFinite(time.getTime()) ? time : null;
}

function renderSchedule(game) {
  const start = confirmedTime(game);
  if (!start) return '<span class="match-time">Horario por confirmar</span>';
  const stamp = (date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const summary = `LLN · ${game.a} vs. ${game.b}`.replace(/([\\,;])/g, '\\$1');
  const calendar = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//La Liga del Norte//Partidos//ES',
    'BEGIN:VEVENT', `UID:2026-27-${matchId(game)}@liga-del-norte`, `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`, `SUMMARY:${summary}`, 'END:VEVENT', 'END:VCALENDAR', ''
  ].join('\r\n');
  return `<time class="match-time" datetime="${game.startsAt}">${formattedTime.format(start)} (Madrid)</time>
    <a class="calendar-download" download="${matchId(game)}.ics" href="data:text/calendar;charset=utf-8,${encodeURIComponent(calendar)}">Añadir al calendario</a>`;
}

// Los empates múltiples quedan a decisión de administración. Nunca se asigna
// una plaza por orden alfabético cuando el enfrentamiento directo no la decide.
function rankTeams(results) {
  const rows = currentTeams.map((team) => {
    const played = results.filter((game) => hasTeam(game, team));
    const wins = played.filter((game) => game.winner === team).length;
    return {team, played:played.length, wins, losses:played.length - wins, points:wins * 3};
  });
  const ranking = [];
  const pointTotals = [...new Set(rows.map((row) => row.points))].sort((a, b) => b - a);
  for (const points of pointTotals) {
    const group = rows.filter((row) => row.points === points);
    let shared = group.length > 1;
    if (group.length === 2) {
      const [left, right] = group;
      const direct = results.filter((game) => hasTeam(game, left.team) && hasTeam(game, right.team));
      const lead = direct.filter((game) => game.winner === left.team).length * 2 - direct.length;
      if (lead < 0) group.reverse();
      shared = lead === 0;
    }
    const first = ranking.length + 1;
    for (const row of group) {
      ranking.push({...row, position:shared ? first : ranking.length + 1, tied:shared ? group.length : 1});
    }
  }
  return ranking;
}

const standings = rankTeams(decidedGames);
const semifinalPreview = !pending.length && standings.slice(0, 3).every((row) => row.tied === 1)
  ? document.getElementById(`partido-semifinal-${slug(standings[1].team)}-${slug(standings[2].team)}`)
  : null;

function matchNotes(fixture) {
  // En el cierre de la fase solo quedan como máximo cuatro combinaciones.
  if (pending.length > 2 || currentTeams.length !== 4) {
    return `La fase regular reparte tres puntos por victoria. El primer clasificado pasa directamente a la gran final.`;
  }
  let outcomes = [[]];
  for (const game of [fixture, ...pending.filter((other) => other !== fixture)]) {
    outcomes = outcomes.flatMap((results) => [game.a, game.b].map((winner) => [...results, {...game, winner}]));
  }
  const scenarios = outcomes.map((results) => ({results, table:rankTeams([...decidedGames, ...results])}));
  const first = scenarios[0].table[0].team;
  const notes = [];
  if (hasTeam(fixture, first) && scenarios.every(({table}) => table[0].team === first && table[0].tied === 1)) {
    const levelOnPoints = scenarios.map(({table}) => table).find(([leader, runnerUp]) => leader.points === runnerUp.points);
    const rival = levelOnPoints?.[1].team;
    const direct = decidedGames.filter((game) => hasTeam(game, first) && hasTeam(game, rival));
    const reason = direct.length === 2 && direct.every((game) => game.winner === first)
      ? ` gracias al 2–0 ante ${rival}` : '';
    notes.push(`<strong>${first}</strong> ya tiene plaza en la gran final${reason}.`);
  }
  const decider = scenarios.find(({table}) => table[2].position === 3 && table[2].tied === 2 &&
    table.slice(2).some(({team}) => hasTeam(fixture, team)));
  if (decider) {
    const {results, table} = decider;
    const teams = table.slice(2).map((row) => row.team);
    const phrases = results.map((game) => {
      const team = teams.find((name) => hasTeam(game, name)) || game.winner;
      return {team, text:`${team} ${game.winner === team ? 'gana' : 'pierde'}`};
    });
    const prefix = phrases.length ? `Si ${phrases.map((phrase) => phrase.text).join(' y ')}, ` : '';
    const contenders = teams.every((team) => phrases.some((phrase) => phrase.team === team)) ? 'ambos' : teams.join(' y ');
    notes.push(`${prefix}${contenders} jugarán un <strong>BO1 por la última plaza de playoffs</strong>.`);
  } else if (hasTeam(fixture, scenarios[0].table[2].team) && scenarios.every(({table}) => table[2].team === scenarios[0].table[2].team && table[2].tied === 1)) {
    notes.push(`<strong>${scenarios[0].table[2].team}</strong> tiene asegurada la tercera plaza.`);
  }
  return notes.join(' ') || 'Los tres primeros pasan a playoffs. En caso de empate múltiple, administración decide las plazas.';
}

function renderStandings() {
  const completeRounds = rounds.filter((number) => inRound(number).every((game) => game.winner)).length;
  const forfeits = decidedGames.length - playedGames.length;
  const forfeitCount = forfeits ? ` · ${forfeits} por incomparecencia` : '';
  document.querySelector('#standings-status').textContent = `Temporada 2026/27 · ${completeRounds} jornadas completas · ${playedGames.length} partidos disputados${forfeitCount}`;
  document.querySelector('#standings-table').insertAdjacentHTML('beforeend', standings.map((row) => `
    <div role="row"><b role="cell">${row.position}${row.tied > 1 ? '=' : ''}</b>
    <span role="cell"><img src="${logo(row.team)}" alt="">${row.team}</span><span role="cell">${row.played}</span>
    <span role="cell">${row.wins}</span><span role="cell">${row.losses}</span><strong role="cell">${row.points}</strong></div>`).join(''));
  document.querySelector('#playoffs-bracket').innerHTML = renderPlayoffBracket();
}

function renderPlayoffBracket() {
  const seed = (index) => {
    const row = standings[index];
    const names = standings.filter((entry) => entry.position === row.position).map((entry) => entry.team);
    const label = row.tied === 1 ? row.team : `Desempate · ${names.join(' / ')}`;
    return `<span><img src="${row.tied === 1 ? logo(row.team) : 'assets/wolf.png'}" alt="">${index + 1}.º ${label}</span>`;
  };
  return `
    <div><p>Semifinal${pending.length ? ' · Si terminase hoy' : ''}</p>${seed(1)}${seed(2)}
      ${semifinalPreview ? `<a class="text-action" href="#${semifinalPreview.id}">Previa de la semifinal →</a>` : ''}</div><i aria-hidden="true">→</i>
    <div><p>Gran final</p>${seed(0)}<span><img src="assets/wolf.png" alt="">Ganador de la semifinal</span></div>`;
}

function renderTopMatchup() {
  const playerSide = (name, displayName) => {
    const team = playerStats.get(name).team;
    return `<div class="top-player">
      <img class="top-crest" src="${logo(team)}" alt="">
      <span class="top-team">${team}</span><strong class="top-name">${displayName}</strong>
      ${renderRankBadge(soloQueueRanks[name], 'Rango SoloQ')}
      <small class="top-peak">Peak · ${formatRank(soloQueuePeakRanks[name])}</small>
    </div>`;
  };
  return `<div class="top-matchup">${playerSide('CANICHEMANIA63', 'Caniche')}
    <b class="top-versus" aria-hidden="true">VS</b>${playerSide('Panker', 'Panker')}</div>`;
}

function renderVersus(game) {
  const team = (name) => `<span class="duel-team${game.winner && game.winner !== name ? ' fixture-loser' : ''}"><img src="${logo(name)}" alt=""><strong>${name}</strong></span>`;
  const score = game.winner ? (game.winner === game.a ? '1–0' : '0–1') : 'VS';
  return `<div class="duel">${team(game.a)}<b>${score}</b>${team(game.b)}</div>`;
}

function twitchLink(game) {
  return game.twitch ? `<a class="twitch-link" href="${game.twitch}" target="_blank" rel="noopener">Ver en Twitch <span aria-hidden="true">↗</span></a>` : '';
}

function resultDetail(game) {
  if (game.forfeitedBy) return `Incomparecencia de ${game.forfeitedBy}`;
  return game.duration ? `${game.duration} min` : '';
}

function resultText(game) {
  return [`Victoria de ${game.winner}`, resultDetail(game)].filter(Boolean).join(' · ');
}

function fixtureCard(game, id = '') {
  const action = game.winner ? (game.lineups ? 'Ver alineaciones' : 'Ver ficha') : 'Ver previa';
  const detail = resultDetail(game);
  const meta = game.winner
    ? `<span class="match-result">Victoria de <strong>${game.winner}</strong></span>${detail ? `<span class="match-time">${detail}</span>` : ''}`
    : renderSchedule(game);
  return `<article class="fixture-card"${id ? ` id="${id}"` : ''}>
    ${game.forfeitedBy ? renderVersus(game) : `<a class="duel-link" href="#${matchId(game)}" aria-label="${action} de ${game.a} contra ${game.b}">${renderVersus(game)}</a>`}
    <div class="fixture-meta">${meta}</div>
    ${game.forfeitedBy ? '' : `<div class="fixture-actions"><a class="text-action" href="#${matchId(game)}">${action} <span aria-hidden="true">→</span></a>${twitchLink(game)}</div>`}
  </article>`;
}

function renderRoundLead() {
  const fixtures = document.querySelector('#upcoming-fixtures');
  if (semifinalPreview) {
    const finalist = standings[0].team;
    fixtures.innerHTML = `<a class="semifinal-feature" href="#${semifinalPreview.id}">
      <div class="semifinal-banner">Semifinal</div>
      ${renderVersus({a:standings[1].team, b:standings[2].team})}
      <div class="semifinal-action">Ver la previa de la semifinal <b aria-hidden="true">→</b></div>
    </a>
    <div class="finalist-strip"><img src="${logo(finalist)}" alt=""><div><strong>Gran final</strong>
      <p>${finalist} vs. ganador de la semifinal</p></div></div>`;
    return;
  }
  if (!pending.length) {
    fixtures.innerHTML = `<div class="bracket">${renderPlayoffBracket()}</div>`;
    return;
  }
  const round = inRound(currentRound);
  const upcoming = round.filter((game) => !game.winner).sort((a, b) =>
    (confirmedTime(a)?.getTime() ?? Infinity) - (confirmedTime(b)?.getTime() ?? Infinity));
  document.querySelector('#round-title').textContent = `Jornada ${currentRound}`;
  document.querySelector('.round-lead .season-label').textContent = 'Temporada 2026/27 · Fase regular';
  document.querySelector('.round-dates').textContent = round[0].date.replace(/(\d) ([a-záéíóúñ]+)$/i, '$1 de $2');
  fixtures.innerHTML = upcoming.map((game) => fixtureCard(game)).join('');
}

function renderLatestResults() {
  const results = decidedGames.filter((game) => roundNumber(game) === latestResultRound);
  document.querySelector('#hero-results-round').textContent = latestResultRound ? `Jornada ${latestResultRound}` : 'Fase regular';
  document.querySelector('#hero-results').innerHTML = results.length ? results.map((game) => {
    if (game.forfeitedBy) return `<div>${renderVersus(game)}<small>${resultDetail(game)}</small></div>`;
    return `<a class="duel-link" href="#${matchId(game)}" aria-label="Ver ficha de ${game.a} contra ${game.b}. ${resultText(game)}.">
      ${renderVersus(game)}</a>`;
  }).join('') : '<p>Aún no hay resultados.</p>';
}

function renderCalendar() {
  const previous = rounds.filter((number) => number !== currentRound && inRound(number).every((game) => game.winner)).reverse();
  const remaining = rounds.filter((number) => number !== currentRound && !previous.includes(number));
  const order = [currentRound, ...previous.slice(0, 1), ...remaining, ...previous.slice(1)];
  const latestResult = decidedGames.find((game) => roundNumber(game) === latestResultRound);
  document.querySelector('#matches-grid').innerHTML = order.map((number) => {
    const round = inRound(number);
    return `<details class="calendar-round"${number === currentRound || number === previous[0] ? ' open' : ''}>
      <summary><h3>Jornada ${number}</h3><span>${round[0].date}</span></summary>
      <div class="calendar-games">${round.map((game) => fixtureCard(game, game === latestResult ? 'ultimos-resultados' : '')).join('')}</div></details>`;
  }).join('');
}

function renderForm(team, earlier) {
  const recent = earlier.filter((game) => hasTeam(game, team)).slice(-3);
  const form = recent.map((game) => {
    const won = game.winner === team;
    const opponent = game.a === team ? game.b : game.a;
    return `<li><span class="form-result${won ? ' won' : ''}">${won ? 'Victoria' : 'Derrota'}</span> vs. ${opponent}</li>`;
  }).join('');
  return `<section><h4><img src="${logo(team)}" alt="">${team}</h4>${recent.length
    ? `<ol>${form}</ol>` : '<p>Debut en la fase regular.</p>'}</section>`;
}

function renderLineups(game) {
  if (game.forfeitedBy) return '';
  if (!game.lineups) return '<p>Las alineaciones están pendientes de publicación.</p>';
  return `<div class="match-lineups">${[game.a, game.b].map((team) => {
    const lineup = game.lineups[team] || [];
    const total = lineupTotals(lineup);
    const players = lineup.map((player) => {
      const level = player.level ? ` · Nivel ${player.level}` : '';
      return `<li><span><strong>${player.name}</strong><small>${player.champion || 'Campeón pendiente'}${level}</small></span><b>${player.kda}</b></li>`;
    }).join('');
    return `<section><h4>${team}</h4><p class="lineup-total">K / D / A · ${total.kills} / ${total.deaths} / ${total.assists}</p>
      <ul>${players}</ul></section>`;
  }).join('')}</div>`;
}

const matchDialog = document.querySelector('#match-dialog');
const copyStatus = document.querySelector('#copy-status');
const matchUrl = document.querySelector('#match-url');
function renderMatch(game) {
  const number = roundNumber(game);
  const earlier = decidedGames.filter((other) => roundNumber(other) < number).sort((a, b) => roundNumber(a) - roundNumber(b));
  const headToHead = earlier.filter((other) => hasTeam(other, game.a) && hasTeam(other, game.b)).at(-1);
  const matchSection = game.winner
    ? `<section class="match-section"><h3>Alineaciones y KDA</h3>${renderLineups(game)}</section>`
    : `<section class="match-section"><h3>Qué se juega</h3><p>${matchNotes(game)}</p></section>`;
  document.querySelector('#match-content').innerHTML = `
    <p class="season-label">${game.winner ? 'Ficha' : 'Previa'} · Jornada ${number} · ${game.date}</p>
    <h2 id="match-title">${game.a} <small>vs.</small> ${game.b}</h2>
    <div class="dialog-schedule">${game.winner ? `<strong>${resultText(game)}</strong> ${twitchLink(game)}` : renderSchedule(game)}</div>
    ${matchSection}
    <section class="match-section"><h3>Cómo llegan</h3><p>Últimos resultados antes de la jornada ${number}, del más antiguo al más reciente.</p>
      <div class="team-form">${renderForm(game.a, earlier)}${renderForm(game.b, earlier)}</div></section>
    <section class="match-section"><h3>Último enfrentamiento directo</h3>
      ${headToHead ? `<p>Jornada ${roundNumber(headToHead)} · ${resultText(headToHead)}</p>${renderLineups(headToHead)}`
        : '<p>Primer cruce entre los dos equipos esta temporada.</p>'}</section>`;
}

function syncMatchDialog() {
  const id = location.hash.slice(1);
  const game = matchesById.get(id);
  if (semifinalPreview && id === semifinalPreview.id) {
    const preview = semifinalPreview.content.cloneNode(true);
    preview.querySelector('.semifinal-matchup').innerHTML = renderTopMatchup();
    document.querySelector('#match-content').replaceChildren(preview);
  } else if (game) {
    renderMatch(game);
  } else {
    if (matchDialog.open) matchDialog.close();
    return;
  }
  matchUrl.hidden = true;
  copyStatus.textContent = '';
  if (!matchDialog.open) matchDialog.showModal();
  matchDialog.scrollTop = 0;
}

document.addEventListener('click', (event) => {
  const link = event.target.closest('a[href^="#partido-"]');
  if (!link || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  history.pushState({matchOpenedHere:true}, '', link.hash);
  syncMatchDialog();
});
window.addEventListener('hashchange', syncMatchDialog);
function dismissMatch() {
  if (history.state?.matchOpenedHere) {
    history.back();
  } else {
    const fromSemifinal = semifinalPreview && location.hash === `#${semifinalPreview.id}`;
    const section = fromSemifinal ? '#novedades' : '#calendario';
    history.replaceState(null, '', section);
    matchDialog.close();
    document.querySelector(section).scrollIntoView();
    const returnTo = fromSemifinal ? `#upcoming-fixtures a[href="#${semifinalPreview.id}"]` : '.calendar-round summary';
    document.querySelector(returnTo)?.focus({preventScroll:true});
  }
}
matchDialog.querySelector('.dialog-close').addEventListener('click', dismissMatch);
matchDialog.addEventListener('cancel', (event) => {
  event.preventDefault();
  dismissMatch();
});
matchDialog.addEventListener('click', (event) => {
  if (event.target !== matchDialog) return;
  const rect = matchDialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dismissMatch();
});
document.querySelector('#copy-match').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(location.href);
    copyStatus.textContent = 'Enlace copiado.';
  } catch {
    matchUrl.value = location.href;
    matchUrl.hidden = false;
    matchUrl.select();
    copyStatus.textContent = 'Selecciona y copia el enlace.';
  }
});

renderStandings();
renderRoundLead();
renderLatestResults();
renderCalendar();
syncMatchDialog();
