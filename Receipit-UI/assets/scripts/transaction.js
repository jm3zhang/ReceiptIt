var authToken;
var user = $.ajax({
        url: "https://receipit-rest-api.herokuapp.com/auth/login",
        type: "POST",
        data: {password:"123",email:"test2@android.com"},
        dataType: "html"
        }).done(function(data){
            // console.log(user.responseText);
            data = JSON.parse(data);
            var user_id = data.userInfo.user_id;
            var authToken = data.authToken;
            document.getElementById("user-name").innerHTML = data.userInfo.first_name + " " + data.userInfo.last_name;
            document.getElementById("user-email").innerHTML = data.userInfo.email;
            var receipts = $.ajax({
                url: "https://receipit-rest-api.herokuapp.com/receipt?userId=" + user_id,
                type: "GET",
                headers: { 'Authorization': authToken },
                dataType: "html"
                }).done(function(data){
                    data = JSON.parse(data);
                    console.log(data.receipts[1].purchase_date);
                    
                    // make table
                    var transactionTableBody = document.getElementById("transaction-table-body");
                    var tableHtml = '';
                    var counter = 1;
                    for (var receipt of data.receipts){
                        console.log(receipt);
                        tableHtml = tableHtml + '<tr>' + 
                                                    '<td class="text-center text-muted">' + counter + '</td>' + 
                                                    '<td>' + 
                                                        '<div class="widget-content p-0">' + 
                                                            '<div class="widget-content-wrapper">' + 
                                                                '<div class="widget-content-left mr-3">' + 
                                                                    '<div class="widget-content-left">' + 
                                                                        '<img width="40" class="rounded-circle" src="http://logo.clearbit.com/' + receipt.merchant.toLowerCase().replace(/\s/g,'') + '.ca" alt="">' + 
                                                                    '</div>' + 
                                                                '</div>' + 
                                                                '<div id="store-name-id" class="widget-content-left flex2">' + 
                                                                    '<div class="widget-heading">' + receipt.merchant + '</div>' + 
                                                                    '<div class="widget-subheading opacity-7">' + receipt.postcode + '</div>' + 
                                                                '</div>' + 
                                                            '</div>' + 
                                                        '</div>' + 
                                                    '</td>' + 
                                                    '<td class="text-center">' + new Date(receipt.purchase_date) + '</td>' + 
                                                    '<td class="text-center">$ ' + receipt.total_amount+ '</td>' + 
                                                    '<td class="text-center">' + 
                                                        '<div class="badge badge-success">Completed</div>' + 
                                                    '</td>' + 
                                                    '<td class="text-center">' + 
                                                        '<button type="button" onclick="viewDetial(this.id)" id="transaction_table_id_' + receipt.receipt_id+ '" class="btn btn-primary btn-sm">Details</button>' + 
                                                    '</td>' + 
                                                '</tr>';
                        counter ++;
                    }

                    transactionTableBody.innerHTML = tableHtml;
        
                });
        });

// make table
// window.onload = function load(){
//     var transactionTableBody = document.getElementById("transaction-table-body");
//     var tableHtml = '';
//     var storeImage = ["walmart.png", "Costco.png", "target.png", "sobeys.png", "7-11.png"];
//     var storeName = ["Walmart", "Costco", "Target", "Sobeys", "Seven Eleven"];
//     var location = ["70 Bridgeport Rd E, Waterloo", "930 Erb St W, Waterloo", "7414 Niagara Falls Blvd, Niagara Falls, NY, US", "450 Columbia St W, Waterloo", "256 King St N, Waterloo"];
//     for (var i = 1; i <= 500; i++){
//         tableHtml = tableHtml + '<tr>' + 
//                                     '<td class="text-center text-muted">' + i + '</td>' + 
//                                     '<td>' + 
//                                         '<div class="widget-content p-0">' + 
//                                             '<div class="widget-content-wrapper">' + 
//                                                 '<div class="widget-content-left mr-3">' + 
//                                                     '<div class="widget-content-left">' + 
//                                                         '<img width="40" class="rounded-circle" src="assets/images/' + storeImage[i%5] + '" alt="">' + 
//                                                     '</div>' + 
//                                                 '</div>' + 
//                                                 '<div id="store-name-id" class="widget-content-left flex2">' + 
//                                                     '<div class="widget-heading">' + storeName[i%5] + '</div>' + 
//                                                     '<div class="widget-subheading opacity-7">' + location[i%5] + '</div>' + 
//                                                 '</div>' + 
//                                             '</div>' + 
//                                         '</div>' + 
//                                     '</td>' + 
//                                     '<td class="text-center">' + randomDate(new Date(2019, 0, 1), new Date()) + '</td>' + 
//                                     '<td class="text-center">$ ' + Math.floor((Math.random() * 100) + 10) + '</td>' + 
//                                     '<td class="text-center">' + 
//                                         '<div class="badge badge-success">Completed</div>' + 
//                                     '</td>' + 
//                                     '<td class="text-center">' + 
//                                         '<button type="button" onclick="viewDetial(this.id)" id="transaction_table_id_' + i + '" class="btn btn-primary btn-sm">Details</button>' + 
//                                     '</td>' + 
//                                 '</tr>';
//     }

//     transactionTableBody.innerHTML = tableHtml;
// }

// print
function printPage() {
    window.print();
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
    var $rows = $('#transaction-table-body tr');
    var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();
    
    $rows.show().filter(function() {
        var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
        return !~text.indexOf(val);
    }).hide();
});

// sort table by date
function convertDate(d) {
    return new Date(d); 
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

// // sort table by store
// function sortByStore() {
//     var tbody = document.querySelector("#transaction-table tbody");
//     // get trs as array for ease of use
//     var rows = [].slice.call(tbody.querySelectorAll("tr"));
    
//     rows.sort(function(left,right) {
//         var $left = $(left.cells[2]).children().eq(index);
//         var $right = $(right.cells[2]).children().eq(index);
//         return $left.text().localeCompare($right.text());
//     });
    
//     rows.forEach(function(v) {
//         tbody.appendChild(v); // note that .appendChild() *moves* elements
//     });
// }

function viewDetial(id) {
    var currentUrl = window.location.href;
    var url = currentUrl.substr(0, currentUrl.lastIndexOf("/")) + "/detail.html?id=" + id;
    document.location.href = url;
}





