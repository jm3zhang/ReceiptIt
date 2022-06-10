
var recceipt_url;
var receiptId = 2392;

var authToken;
$.ajax({
    url: "https://receipit-rest-api.herokuapp.com/auth/login",
    type: "POST",
    data: {password:"123",email:"test2@android.com"},
    dataType: "html"
    }).done(function(data){
        data = JSON.parse(data);
        console.log(data);
        var user_id = data.userInfo.user_id;
        var authToken = data.authToken;
        document.getElementById("user-name").innerHTML = data.userInfo.first_name + " " + data.userInfo.last_name;
        document.getElementById("user-email").innerHTML = data.userInfo.email;
        $.ajax({
            url: "https://receipit-rest-api.herokuapp.com/receipt?userId=" + user_id,
            type: "GET",
            headers: { 'Authorization': authToken },
            dataType: "html"
            }).done(function(data){
                data = JSON.parse(data);

                var currentUrl = window.location.href;
                if(currentUrl.includes("=")){
                    var receipt = currentUrl.substr(currentUrl.lastIndexOf("=") + 1);
                    receiptId = receipt.substr(receipt.lastIndexOf("_") + 1);
                }

                $.ajax({
                    url: "https://receipit-rest-api.herokuapp.com/receipt/" + receiptId,
                    type: "GET",
                    headers: { 'Authorization': authToken },
                    dataType: "html"
                    }).done(function(data){
                        data = JSON.parse(data);
                        console.log(data);
                        recceipt_url = data.image_url;
                        var detailTableBody = document.getElementById("detail-table-body");
                        var tableHtml = '';
                        var counter = 1;
                        for (var product of data.products){
                            tableHtml = tableHtml + '<tr>' + 
                                                    '<td class="text-center text-muted">' + counter + '</td>' + 
                                                    '<td >' + product.name + '</td>' + 
                                                    '<td class="text-center">' + new Date(data.purchase_date) + '</td>' + 
                                                    '<td class="text-center">$ ' + product.price+ '</td>' + 
                                                    '<td class="text-center">' + product.currency_code+ '</td>' + 
                                                    '<td class="text-center">' + product.quantity+ '</td>' + 
                                                '</tr>';
                            counter ++;
                        }
                        detailTableBody.innerHTML = tableHtml;

                        document.getElementById("detail-receipt-image").src = data.image_url;

                    });
                    
        });
    });

// display all
function displayAll() {
    var currentUrl = window.location.href;
    var url = currentUrl.substr(0, currentUrl.lastIndexOf("/")) + "/transaction.html"
    document.location.href = url;
}

// print
function printPage() {
    window.print();
}

function printReceipt(url) {
    var W = window.open(url);
    // W.window.print();
}

function randomDate(start, end) {
    var d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

// search
$('#transaction-search-bar').keyup(function() {
    var $rows = $('#detail-table-body tr');
    var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();
    
    $rows.show().filter(function() {
        var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
        return !~text.indexOf(val);
    }).hide();
});

// sort table by date
function convertDate(d) {
    var p = d.split("-");
    return +(p[0]+p[1]+p[2]);
}
  
function sortByDate() {
    var tbody = document.querySelector("#transaction-table tbody");
    // get trs as array for ease of use
    var rows = [].slice.call(tbody.querySelectorAll("tr"));
    
    rows.sort(function(a,b) {
        return convertDate(a.cells[2].innerHTML) - convertDate(b.cells[2].innerHTML);
    });
    
    rows.forEach(function(v) {
        tbody.appendChild(v); // note that .appendChild() *moves* elements
    });
}

// sort table by Index
function sortByIndex() {
    var tbody = document.querySelector("#transaction-table tbody");
    // get trs as array for ease of use
    var rows = [].slice.call(tbody.querySelectorAll("tr"));
    
    rows.sort(function(a,b) {
        return a.cells[0].innerHTML - b.cells[0].innerHTML;
    });
    
    rows.forEach(function(v) {
        tbody.appendChild(v); // note that .appendChild() *moves* elements
    });
}

// sort table by Payment
function convertPayment(d) {
    return d.substring('$ '.length)
}

function sortByPayment() {
    var tbody = document.querySelector("#transaction-table tbody");
    // get trs as array for ease of use
    var rows = [].slice.call(tbody.querySelectorAll("tr"));
    
    rows.sort(function(a,b) {
        return convertPayment(a.cells[3].innerHTML) - convertPayment(b.cells[3].innerHTML);
    });
    
    rows.forEach(function(v) {
        tbody.appendChild(v); // note that .appendChild() *moves* elements
    });
}





