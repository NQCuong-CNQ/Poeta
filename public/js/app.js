// try {
//     $.ajax({
//         url: '/get-meals',
//         type: "get",
//         contentType: "application/json",
//         dataType: "json",
//         success: function (data) {
//             alert(data)
//         },
//         error: (jqXHR, textStatus, errorThrown) => {
//             console.log(jqXHR, textStatus, errorThrown)
//         }
//     })
// } catch (err) {
//     console.log(err)
// }

try {
    $.ajax({
        url: 'https://www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata',
        type: "get",
        contentType: "application/json",
        dataType: "json",
        success: function (data) {
            alert(data)
        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.log(jqXHR, textStatus, errorThrown)
        }
    })
} catch (err) {
    console.log(err)
}

