let db;

const req = indexedDB.open('budget_tracker', 1);

req.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore('new_transaction', { autoIncrement: true });
};
req.onsuccess = function(event) {
    db = event.target.result;
    console.log(db)
};
req.onerror = function(event) {
    console.log(event.target.errorCode);
};


function saveItem(item) {
    const transac = db.transac(['new_transaction'], 'readwrite');
    const  store = transac.objectStore('new_transaction');
    store.add(item);
}

function sendTransaction() {
    const transac = db.transac(['new_transaction'], 'readwrite');
    const store = transac.objectStore('new_transaction');
    const getAll = store.getAll();
    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
            fetch('/api/transaction', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
                .then(res => res.json())
                .then(serverRes => {
                    const transac = db.transac(['new_transaction'], 'readwrite');
                    const store = transac.objectStore('new_transaction');
                    store.clear();
                    alert('All transactions submitted');
                })
        }
    }
}

window.addEventListener('online', sendTransaction);