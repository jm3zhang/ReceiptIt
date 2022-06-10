var authToken;
var budget = 6584.33;

$.ajax({
        url: "https://receipit-rest-api.herokuapp.com/auth/login",
        type: "POST",
        data: {password:"123",email:"test2@android.com"},
        dataType: "html"
        }).done(function(data){
            data = JSON.parse(data);
            var user_id = data.userInfo.user_id;
            var authToken = data.authToken;
            document.getElementById("user-name").innerHTML = data.userInfo.first_name + " " + data.userInfo.last_name;
            document.getElementById("user-email").innerHTML = data.userInfo.email;
            
            var date = new Date();


            console.log("sheile");
            $.when(
                $.ajax({
                    url: "https://receipit-rest-api.herokuapp.com/receipt",
                    type: "GET",
                    data: {
                        "userId": user_id,
                        "startDate": new Date(date.getFullYear(), date.getMonth(), 1),
                        "endDate": date},
                    headers: { 'Authorization': authToken },
                    dataType: "json"
                    }), 
                $.ajax({
                    url: "https://receipit-rest-api.herokuapp.com/receipt",
                    type: "GET",
                    data: {
                        "userId": user_id,
                        "startDate": new Date(date.getFullYear(), date.getMonth() - 1, 1),
                        "endDate": new Date(date.getFullYear(), date.getMonth(), 0)},
                    headers: { 'Authorization': authToken },
                    dataType: "json"
                    }), 
                $.ajax({
                    url: "https://receipit-rest-api.herokuapp.com/receipt",
                    type: "GET",
                    data: {
                        "userId": user_id,
                        "startDate": new Date(date.getFullYear(), date.getMonth() - 2, 1),
                        "endDate": new Date(date.getFullYear(), date.getMonth() - 1, 0)},
                    headers: { 'Authorization': authToken },
                    dataType: "json"
                    }), 
                $.ajax({
                    url: "https://receipit-rest-api.herokuapp.com/receipt",
                    type: "GET",
                    data: {
                        "userId": user_id,
                        "startDate": new Date(date.getFullYear(), date.getMonth() - 3, 1),
                        "endDate": new Date(date.getFullYear(), date.getMonth() - 2, 0)},
                    headers: { 'Authorization': authToken },
                    dataType: "json"
                    }),
                $.ajax({
                    url: "https://receipit-rest-api.herokuapp.com/receipt",
                    type: "GET",
                    data: {
                        "userId": user_id,
                        "startDate": new Date(date.getFullYear(), date.getMonth() - 4, 1),
                        "endDate": new Date(date.getFullYear(), date.getMonth() - 3, 0)},
                    headers: { 'Authorization': authToken },
                    dataType: "json"
                    }),
                $.ajax({
                    url: "https://receipit-rest-api.herokuapp.com/receipt",
                    type: "GET",
                    data: {
                        "userId": user_id,
                        "startDate": new Date(date.getFullYear(), date.getMonth() - 5, 1),
                        "endDate": new Date(date.getFullYear(), date.getMonth() - 4, 0)},
                    headers: { 'Authorization': authToken },
                    dataType: "json"
                    }))
            .then(function(a1, a2, a3, a4, a5, a6){
                console.log("cainima");
                console.log(a1);
                console.log(a2);
                console.log(a3);
                console.log(a4);
                console.log(a5);
                console.log(a6);
            });
            





























            $.ajax({
                url: "https://receipit-rest-api.herokuapp.com/receipt",
                type: "GET",
                data: {
                    "userId": user_id,
                    "startDate": new Date(date.getFullYear(), date.getMonth(), 1),
                    "endDate": date},
                headers: { 'Authorization': authToken },
                dataType: "json"
                }).done(function(data){
                    
                    data = JSON.parse(data);
                    // console.log(data);

                    var totalExpense = 0;
                    var numTrans = 0;
                    var lastTotalExpense = 0;
                    var lastNumTrans = 0;
                    var lastAvg = 0;
                    console.log(data.receipts);
                    if(data.receipts != undefined){
                        for(var receipt of data.receipts){
                            totalExpense += parseFloat(receipt.total_amount);
                            numTrans ++;
                        }
                    }
                    

                    document.getElementById("totalExpr").innerHTML = "$ " + totalExpense;
                    document.getElementById("totalTrans").innerHTML = numTrans;
                    document.getElementById("avgExpr").innerHTML = "$ " + (totalExpense/numTrans).toFixed(2);;

                    $.ajax({
                        url: "https://receipit-rest-api.herokuapp.com/receipt",
                        type: "GET",
                        data: {
                            "userId": user_id,
                            "startDate": new Date(date.getFullYear(), date.getMonth() - 1, 1),
                            "endDate": new Date(date.getFullYear(), date.getMonth() - 1, 0)},
                        headers: { 'Authorization': authToken },
                        dataType: "html"
                        }).done(function(data){
                            lastTotalExpense = 0;
                            lastNumTrans = 0;
                            lastAvg = 0;
                            if(data.receipts != undefined){
                                for(var receipt of data.receipts){
                                    lastTotalExpense += parseFloat(receipt.total_amount);
                                    lastNumTrans ++;
                                }
                            }
                            if((totalExpense/lastTotalExpense) == Infinity){
                                lastNumTrans = 1;
                            }
                            if((numTrans/lastNumTrans) == Infinity){
                                lastNumTrans = 100;
                            }
                            // console.log((totalExpense/numTrans));
                            // console.log((lastTotalExpense/lastNumTrans));
                            if(((totalExpense/numTrans)/(lastTotalExpense/lastNumTrans)) == Infinity){
                                lastAvg = 100;
                            }
                        });

                });


            $.ajax({
                url: "https://receipit-rest-api.herokuapp.com/receipt?userId=" + user_id,
                type: "GET",
                headers: { 'Authorization': authToken },
                dataType: "html"
                }).done(function(data){
                    data = JSON.parse(data);
                    
                    // make table
                    var recentTransactionTableBody = document.getElementById("recent-transaction-table-body");
                    var tableHtml = '';
                    var counter = 1;
                    for (var receipt of data.receipts){
                        if (counter == 6){
                            break;
                        }
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

                    recentTransactionTableBody.innerHTML = tableHtml;


        
                });
        });


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


// bar
var ctxExpenditureReport = $('#expenditureReport');
ctxExpenditureReport.height(200);    
var expenditureReportChart = new Chart(ctxExpenditureReport, {
    type: 'bar',
    data: {
        labels: ["October", "November", "December", "January", "February", "March"],
        datasets: [
            {
				label: "Groceries",
				fillColor: "blue",
                data: [77, 41, 39, 51, 13, 43],
                backgroundColor: [
                    "#581845",
                    "#581845",
                    "#581845",
                    "#581845",
                    "#581845",
                    "#581845"
                ]
			},
			{
				label: "Foods",
				fillColor: "red",
                data: [42, 44, 26, 63, 44, 57],
                backgroundColor: [
                    "#900C3F",
                    "#900C3F",
                    "#900C3F",
                    "#900C3F",
                    "#900C3F",
                    "#900C3F"
                ]
			},
			{
				label: "Clothes",
				fillColor: "green",
                data: [49, 61, 97, 35, 64, 98],
                backgroundColor: [
                    "#C70039",
                    "#C70039",
                    "#C70039",
                    "#C70039",
                    "#C70039",
                    "#C70039"
                ]
			},
			{
				label: "Entertainments",
				fillColor: "green",
                data: [19, 86, 99, 5, 67, 37],
                backgroundColor: [
                    "#FF5733",
                    "#FF5733",
                    "#FF5733",
                    "#FF5733",
                    "#FF5733",
                    "#FF5733"
                ]
			},
			{
				label: "Others",
				fillColor: "green",
                data: [42, 73, 32, 92, 18, 33],
                backgroundColor: [
                    "#FFC30F",
                    "#FFC30F",
                    "#FFC30F",
                    "#FFC30F",
                    "#FFC30F",
                    "#FFC30F"
                ]
			}
        ]
    },
    maintainAspectRatio: false,
    options: {
        tooltips: {
            callbacks: {
                label: function(tooltipItem, data) {
                    var label = data.datasets[tooltipItem.datasetIndex].label || '';

                    if (label) {
                        label += ': $';
                    }
                    label += Math.round(tooltipItem.yLabel * 100) / 100;
                    return label;
                }
            }
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
});

            // "#581845",
            // "#900C3F",
            // "#C70039",
            // "#FF5733",
            // "#FFC30F",
            // "#FF5733"

// pie 
var ctxExpensesDistrubution = $('#expensesDistrubution');
var expensesDistrubutionChart = new Chart(ctxExpensesDistrubution, {
    type: 'doughnut',
    data: {
        datasets: [{
            data: [
                1200,
                1112,
                533,
                202,
                105,
            ],
            backgroundColor: [
                "#581845",
                "#900C3F",
                "#C70039",
                "#FF5733",
                "#FFC30F",
            ]
        }],
        labels: [
            "Groceries",
            "Foods",
            "Clothes",
            "Entertainments",
            "Others"
        ]
    },
    options: {
        responsive: true,
        legend: {
            position: 'top',
        },
        animation: {
            animateScale: true,
            animateRotate: true
        },
        tooltips: {
            callbacks: {
                label: function(tooltipItem, data) {
                    var dataset = data.datasets[tooltipItem.datasetIndex];
                    var value = dataset.data[tooltipItem.index];
                    var total = dataset.data.reduce(function(previousValue, currentValue, currentIndex, array) {
                        return previousValue + currentValue;
                    });
                    var currentValue = dataset.data[tooltipItem.index];
                    var percentage = Math.floor(((currentValue/total) * 100)+0.5);
                    return " $" + value + " (" + percentage + "%)";
                },
                title: function(tooltipItem, data) {
                    return data.labels[tooltipItem[0].index];
                }
            }
        } 
    }
});

var ctxExpensesTrends = $('#expensesTrends'); 
var expensesTrendsChart = new Chart(ctxExpensesTrends, {
    type: 'line',
    data: {
        labels: [ "March", "April", "May", "June"],
        datasets: [
            {
                label: "Groceries",
                backgroundColor: "#581845",
                borderColor: "#581845",
                data: [34, 77, 41, 39],
				fill: !1
			},
			{   
                label: "Foods",
                backgroundColor: "#900C3F",
                borderColor: "#900C3F",
                data: [74, 42, 44, 26],
				fill: !1
			},
			{   
                label: "Clothes",
                backgroundColor: "#C70039",
                borderColor: "#C70039",
                data: [68, 49, 61, 97],
				fill: !1
			},
			{   
                label: "Entertainments",
                backgroundColor: "#FF5733",
                borderColor: "#FF5733",
                data: [92, 19, 86, 99],
				fill: !1
			},
			{   
                label: "Others",
                backgroundColor: "#FFC30F",
                borderColor: "#FFC30F",
                data: [17, 42, 73, 32],
				fill: !1
			}
        ]
    },
    maintainAspectRatio: false,
    options: {
        responsive: !0,
        maintainAspectRatio: !1,
        title: {
            display: !1,
            text: "Chart.js Line Chart"
        },
        legend: {
            display: !1
        },
        layout: {
            padding: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 0
            }
        },
        tooltips: {
            callbacks: {
                label: function(tooltipItem, data) {
                    var label = data.datasets[tooltipItem.datasetIndex].label || '';

                    if (label) {
                        label += ': $';
                    }
                    label += Math.round(tooltipItem.yLabel * 100) / 100;
                    return label;
                }
            },
            mode: "index",
            intersect: !1
        },
        hover: {
            mode: "nearest",
            intersect: !0
        },
        pointBackgroundColor: "#fff",
        pointBorderColor: window.chartColors.blue,
        pointBorderWidth: "2",
        scales: {
            xAxes: [{
                display: !1,
                scaleLabel: {
                    display: !0,
                    labelString: "Month"
                }
            }],
            yAxes: [{
                display: !1,
                scaleLabel: {
                    display: !0,
                    labelString: "Value"
                }
            }]
        }
    }
});

//print
function printPage() {
    window.print();
}

// // make table
// window.onload = function load(){
//     var transactionTableBody = document.getElementById("recent-transaction-table-body");
//     var tableHtml = '';
//     var storeImage = ["walmart.png", "Costco.png", "target.png", "sobeys.png", "7-11.png"];
//     var storeName = ["Walmart", "Costco", "Target", "Sobeys", "Seven Eleven"];
//     var location = ["70 Bridgeport Rd E, Waterloo", "930 Erb St W, Waterloo", "7414 Niagara Falls Blvd, Niagara Falls, NY, US", "450 Columbia St W, Waterloo", "256 King St N, Waterloo"];
//     for (var i = 1; i <= 5; i++){
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

// gen date
function randomDate(start, end) {
    var d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

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

// view detail
function viewDetial(id) {
    var currentUrl = window.location.href;
    var url = currentUrl.substr(0, currentUrl.lastIndexOf("/")) + "/detail.html?id=" + id;
    document.location.href = url;
}

// search
$('#transaction-search-bar').keyup(function() {
    var $rows = $('#recent-transaction-table-body tr');
    var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();
    
    $rows.show().filter(function() {
        var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
        return !~text.indexOf(val);
    }).hide();
});

