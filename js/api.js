const base_url = "https://api.football-data.org/v2/";
const api_key = "a5dc07eb545540e1ace41ab8e3392712";
const league_id = "2001";
const id = "CL";
const Standings = `${base_url}competitions/${league_id}/standings`;
const tim = `${base_url}teams/`

var fetchApi = url => {
  return fetch(url, {
    headers: {
      "X-Auth-Token": api_key
    }
  });
};

// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    // Method reject() akan membuat blok catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
    return Promise.resolve(response);
  }
}
// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
  return response.json();
}
// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
  // Parameter error berasal dari Promise.reject()
  console.log("Error : " + error);
}

function showStandings(data) {
  var klasemenHTML ="";

  data.standings.forEach(stages => {
    const grup = `<h5><b>${stages.group}</b></h5>`;
    const tipe = `<h6>${stages.type}</h6>`;

    const table_open = `<table border ="1">`;
    const thead_open = ` <thead><tr>`;

    //kolom thead
    const club = `<th colspan="2">Club</th>`;
    const mp = `<th>MP</th>`;
    const w = `<th>W</th>`;
    const d = `<th>D</th>`;
    const l = `<th>L</th>`;
    const pts = `<th>Pts</th>`;
    const gf = `<th>GF</th>`;
    const ga = `<th>GA</th>`;
    const gd = `<th>GD</th>`;
    
    const thead_close = `</tr></thead>`;
    const tbody_open = `<tbody>`;
    
    const header = grup + tipe;
    const table = table_open + thead_open + club + mp +w + d + l + pts + gf + ga + gd + thead_close + tbody_open;

    klasemenHTML += header + `<br>` + table ;

    const tbody_close = `</tbody>`;
    const table_close = `</table>`;

    stages.table.forEach(standing => {  
      const tr_open = `<tr>`;

      //kolom tbody
      const position = `<td>${standing.position}</td>`;
      const logo = `<td><img src="${standing.team.crestUrl}" width="20px">`;
      const nama_tim = `<a href="./matches.html?id=${standing.team.id}">
      <b>${standing.team.name.substr(0, 3).toUpperCase()}</b></td>
      </a>`;
      const club = logo +`<br>`+ nama_tim;
      const played = `<td>${standing.playedGames}</td>`;
      const Win = `<td>${standing.won}</td>`;
      const Draw = `<td>${standing.draw}</td>`;
      const Lost = `<td>${standing.lost}</td>`;
      const Points = `<td>${standing.points}</td>`;
      const gF = `<td>${standing.goalsFor}</td>`;
      const gA = `<td>${standing.goalsAgainst}</td>`;
      const gD = `<td>${standing.goalDifference}</td>`;

      const tr_close = `</tr>`;

      const td = position + club + played + Win +
      Draw + Lost + Points +gF + gA + gD;
      klasemenHTML += tr_open + td + tr_close;
    });
    klasemenHTML+= tbody_close + table_close;
  });
    // sisipkan komponen ke dalam elemen table dengan id#champion
    if (document.getElementById("champion")) {
      document.getElementById("champion").innerHTML = klasemenHTML;
    }
}
function getStandings(){
  if("caches" in window) {
    caches.match(Standings).then(response => {
      if (response) {
        response.json().then(data => {
          showStandings(data);
        })
      }
    })
  }

  fetchApi(Standings)
  .then(status)
  .then(json)
  .then(data => {
    console.log(data);
    showStandings(data);
  })
  .catch(error);
}

function showTim(data) {
  var logoTimHTML =`
  <img src="${data.crestUrl}" width="60"> &nbsp;&nbsp;&nbsp;&nbsp;
  <h4><b>${data.shortName}</b></h4>
  `;
  var overviewTimHTML = `
  <p class="center-align">
    <b>${data.name}</b>
    <br>
    <small>Address : ${data.address}</small>
    <br>
    <small>Phone : ${data.phone}</small>
  </p>
  <p class="center-align">
    <a href="${data.website}" class="waves-effect waves-light btn" target ="_blank"><i
    class="material-icons right">public</i>Website</a>
    </p>
  `;

  var playersTimHTML = "";
  data.squad.forEach(data => {
    if(data.role === "PLAYER") {
      playersTimHTML +=`
      <tr>
        <td>
          <span class="nama">${data.name}</span><br>
          <span class="from">From:</span> <span class="nationality">${data.nationality}</span>
        </td>
        <td><span class="position">${data.position}</span></td>
        </tr>
      `;
    }
  })
  //sisipkan komponen logo ke dalam elemen logo-tim
  document.getElementById("logo-tim").innerHTML = logoTimHTML;
  //sisipkan komponen overview ke dalam elemen overview
  document.getElementById("overview").innerHTML = overviewTimHTML;
  //sisipkan komponen players ke dalam elemen kartu-player
  document.getElementById("card-player").innerHTML = playersTimHTML;
}

function getTim(){
  return new Promise((resolve, reject) => {
    //ambil nilai query parameter (?id=)
    var urlParams = new URLSearchParams(window.location.search);
    var idParams = urlParams.get("id");

    if("caches" in window){
      caches.match(tim + idParams).then(response => {
        if(response) {
          response.json().then(data =>{
            showTim(data);
            resolve(data);
          });
        }
      });
    }

    fetchApi(tim + idParams)
    .then(status)
    .then(json)
    .then(data => {
      showTim(data);
      resolve(data);
    });
  });
}

function showMatch(data) {
  var matchHTML = `<p class="center-align"><b>Upcoming Match</b></p>`;
  data.matches.forEach(match => {
    matchHTML += `
      <div class="card-panel valign-wrapper">
        <div class = "col s7">
          <p>${match.homeTeam.name}</p>
          <p>${match.awayTeam.name}</p>
        </div>
        <div class = "col s4 offset-s4">
          <p>${convertDate(new Date(match.utcDate))}</p>
        </div>
      </div>
    `;
  });
  //

  document.getElementById("matches").innerHTML =matchHTML;

}

function getMatch(){

    // Ambil nilai query parameter (?id=)
    var urlParams = new URLSearchParams(window.location.search);
    var idParams = urlParams.get("id");

    if ("caches" in window) {
    caches
    .match(tim + idParams + "/matches")
    .then(response=> {
      if(response){
        response.json().then(data => {
          showMatch(data);
        });
      }
    });
  }

  fetchApi(tim + idParams + "/matches")
  .then(status)
  .then(json)
  .then(data => {
    showMatch(data);
  });

}

function getSavedTeams() {
  getAll().then(teams => {
    console.log(teams);
    //Menyusun komponen card secara dinamis
    var teamsHTML = "";
    if(teams.length == 0)
    teamsHTML += `<div class= "container">belum ada tim yang disimpan</div>`;
    teams.forEach(team => {
      teamsHTML +=`
      <div class="col s6 m6">
        <div class="card center-align">
          <div class="card-image">
            <img src="${team.crestUrl}" style="padding: 15px; height: 200px;">
          </div>
          <div class="card-content">
            <h5>${team.name}</h5>
          </div>
          <div class="card-action">
            <a onclick="deleteOnClick(${team.id})">Hapus</a>
          </div>
        </div>
      </div>`;
    });
    //Sisipkan komponen card ke dalam elemen dengan id#teams
    document.getElementById("teams").innerHTML = teamsHTML;
  });
}

var deleteOnClick = idteam => {
  var confir = confirm("Hapus dari team Favorite ?");
  if (confir == true){
    deleteFavorite(idteam);
  }
}