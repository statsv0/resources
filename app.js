function prevGroup(player) {
    const stats = player.stats;
    const currentStat = stats[stats.length - 1];
    const prevStat = stats[stats.length - 2];
    return prevStat && currentStat && prevStat.group - currentStat.group;
}

function getColorPrevGroup(player) {
    return prevGroup(player) >= 0 ? 'green' : 'red';
}

function prevPosition(player) {
    const value = 'round';
    const current = player.stats && player.stats.reduce(function(prev, curr) {
        return  prev[value] > curr[value] ? prev : curr;
    }, {})[value];
    
    const stats = (player && player.stats) || [];
    const currenGroup = stats.find((x, _) => x.round === current);
    const prevGroup = stats.find((x, _) => x.round === (current - 1));


    return currenGroup && prevGroup && (prevGroup.position - currenGroup.position);
}



function bestRanking(player, value) {
    const statss = [...player.stats];
    statss.pop();
    return statss.reduce(function(prev, curr) {
        return  prev[value] < curr[value] ? prev : curr;
    }, {})[value];
}

function bestRankingWeeks(player) {
    const num = bestRanking(player, 'position');
    const statss = [...player.stats];
    statss.pop();
    const filtered = statss.filter(x => x.position === num);
    return filtered.length;
}

function getAge(birth = '') {
        const dob = new Date(birth.split('/')[2], birth.split('/')[1], birth.split('/')[0])
        // Calculate the difference in milliseconds between the current date and the provided date of birth
        var diff_ms = Date.now() - dob.getTime();
        // Create a new Date object representing the difference in milliseconds and store it in the variable age_dt (age Date object)
        var age_dt = new Date(diff_ms); 
      
        // Calculate the absolute value of the difference in years between the age Date object and the year 1970 (UNIX epoch)
        return Math.abs(age_dt.getUTCFullYear() - 1970);
    
}

function getRankBorder(position) {
    if(position <= 10) {
        return 'top10';
    }

    if(position > 10 && position <= 20) {
        return 'top20';
    }

    if(position > 20 && position <= 50) {
        return 'top50';
    }

    if(position > 50 && position <= 100) {
        return '100';
    }
    return '';
}


function gT(player, type) {
    return player.stats.reduce(function(a, b){
        return a + b[type];
    }, 0);
}


function printRow(list, json, i) {
    const player = json[i];
    let li = document.createElement('tr');
    
    function sA(t, v) {
        li.setAttribute(t, v);
    }

    sA('scope', 'row');
    const position = i+1;

    (position <= 10) && sA('class', 'top10-row');  
    (position > 10 && position <= 20) && sA('class', 'top20-row');
    (position > 20 && position <= 50) && sA('class', 'top50-row');
    (position > 50 && position <= 100) && sA('class', 'top100-row');
    (position === 11) && sA('id', 'top20');
    (position === 21)&& sA('id', 'top50');
    (position === 51)&& sA('id', 'top100');
    

    const columns = [
        `<td class="rank ${getRankBorder(position)}">${position}</td>`,
        `<td class="name"><a href="javascript:void(0);">${player.clubName}</a></td>`,
        `<td class="col white rank-icon ${getColorPrevGroup(player)}"><span>${prevGroup(player) > 0 ? '+' : ''}${prevGroup(player) || '='}</span></td>`,
        `<td class="col grey-back">${bestRanking(player, 'position') || 'NM'}</td>`,
        `<td class="col">${bestRankingWeeks(player) || ''}</td>`,
        `<td class="col">${getAge(player.birth)}</td>`,
        `<td class="col grey-back">${player.stats.length}</td>`,
        `<td class="col">${gT(player, 'wins')}</td>`,
        `<td class="col">${gT(player, 'losses')}</td>`,
        `<td class="col">${gT(player, 'notPlayed')}</td>`,
        `<td class="col grey-back">${gT(player, 'w2s')}</td>`,
        `<td class="col">${gT(player, 'w3s')}</td>`,
        `<td class="col">${gT(player, 'l2s')}</td>`,
        `<td class="col">${gT(player, 'l3s')}</td>`,
        `<td class="col grey-back">${gT(player, 'tt')}</td>`,
        `<td class="col">${gT(player, 'tw')}</td>`,
        `<td class="col">${gT(player, 'tl')}</td>`,
    ];
    
    li.innerHTML = columns.join('');
    list.appendChild(li);
}

function mapper(data) {
    let list = document.getElementById('list');
    for (y = 0; y < data.length; ++y) {
        printRow(list, data, y);
    }
}

Promise.all([
    new Promise((resolve, reject) => {
        return fetch('https://raw.githubusercontent.com/statsv0/s/refs/heads/main/cetm.json')
            .then((response) => resolve(response.json()))
    }),
]).then((values) => { mapper(values[0]); });