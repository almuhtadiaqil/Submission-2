var dbPromised = idb.open("gilaBola", 1, function(upgradeDb) {
    if(!upgradeDb.objectStoreNames.contains("teams")){
        upgradeDb.createObjectStore("teams", {
            keyPath:"id"
        });
    }
});


function saveTeams(team) {
    dbPromised
    .then(db => {
        var tx = db.transaction("teams", "readwrite");
        var store = tx.objectStore("teams");
        console.log(team);
        store.put(team);
        return tx.complete;
    })
    .then(()=>{
        M.toast({
            html:'Berhasil di simpan'
        })
    })
}

function getAll() {
    return new Promise(function(resolve, reject){
        dbPromised
        .then(db => {
            var tx = db.transaction("teams", "readonly");
            var store = tx.objectStore("teams");
            return store.getAll();
        })
        .then(teams => {
            resolve(teams);
        })
    })
}

function deleteFavorite(idteam) {
    dbPromised.then(function(db){
        var tx = db.transaction('teams', 'readwrite');
        var store = tx.objectStore('teams');
        store.delete(idteam);
        return tx.complete;
    })
    .then(function(){
        M.toast({
            html: 'Berhasil menghapus '
        })
        location.reload();
    })
}