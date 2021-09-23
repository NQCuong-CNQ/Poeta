//************************************
// Description: trigger when click on edit, show edit modal and set text
// Parameter: mealName, count
//************************************
onEdit = (mealName, count) => {
    $('#edit-modal').modal('show')
    $('#edit-modal #edit-input').val(mealName)
    $('#edit-modal #old-meal').text(mealName)
    $('#edit-modal #edit-count').text(`The count is ${count}`)
}

//************************************
// Description: trigger when click on delete, show delete modal and set text
// Parameter: mealName, count
//************************************
onDelete = (mealName, count) => {
    $('#delete-modal').modal('show')
    $('#delete-modal #delete-meal-name').text(mealName)
    $('#delete-modal #delete-meal-ask').text(`Are you want to delete "${mealName}" with the count is ${count}?`)

}

//************************************
// Description: empty the table and loop for append each table row 
// Parameter: data
//************************************
updateTable = data => {
    $('#meals-table-body').empty()
    for (let i = 0; i < data.length; i++) {
        $('#meals-table-body').append(`
        <tr>
            <th scope="row">${i + 1}</th>
            <td>${data[i].mealName}</td>
            <td>${data[i].count}</td>
            <td><div class="edit-container"><a onclick="onEdit('${data[i].mealName}',${data[i].count})">Edit</a><span>|</span><a onclick="onDelete('${data[i].mealName}',${data[i].count})">Delete</a></div></td>
        </tr>
        `)
    }
}

//************************************
// Description: trigger when click update button, check if the input is blank then show alert
// if not, call ajax to server to update the meals, update table and hide modal when completed
// Parameter: 
//************************************
$('#update-btn').on('click', () => {
    let newInput = $('#edit-modal #edit-input').val().trim()
    if (newInput == "") {
        alert('The field can not be blank!')
    } else {
        try {
            $.ajax({
                url: '/update-meals' + '?' + $.param({ mealName: newInput, oldMeal: $('#edit-modal #old-meal').text() }),
                type: "post",
                contentType: "application/json",
                dataType: "json",

                success: function (data) {
                    if (data.status == 0) {
                        alert("Can't find this " + newInput)
                    } else {
                        updateTable(data.data)
                        $('#add-new-modal').modal('hide')
                    }
                },
                error: (jqXHR, textStatus, errorThrown) => {
                    console.log(jqXHR, textStatus, errorThrown)
                }
            })
        } catch (err) {
            console.log(err)
        }
    }
})

//************************************
// Description: trigger when click delete button, check if the input is blank then show alert
// if not, call ajax to server to delete the meals, update table and hide modal when completed
// Parameter: 
//************************************
$('#delete-btn').on('click', () => {
    try {
        $.ajax({
            url: '/delete-meals' + '?' + $.param({ "mealName": $('#delete-modal #delete-meal-name').text() }),
            type: "delete",
            contentType: "application/json",
            dataType: "json",
            success: function (data) {
                updateTable(data.data)
                $('#delete-modal').modal('hide')
            },
            error: (jqXHR, textStatus, errorThrown) => {
                console.log(jqXHR, textStatus, errorThrown)
            }
        })
    } catch (err) {
        console.log(err)
    }
})

//************************************
// Description: run on load js, call ajax to server to get all meals, update table when completed 
// Parameter: 
//************************************
try {
    $.ajax({
        url: '/get-meals',
        type: "get",
        contentType: "application/json",
        dataType: "json",
        success: function (data) {
            updateTable(data.data)
            $('#upadte-modal').modal('hide')
        },
        error: (jqXHR, textStatus, errorThrown) => {
            console.log(jqXHR, textStatus, errorThrown)
        }
    })
} catch (err) {
    console.log(err)
}

//************************************
// Description: trigger when click add-new button, check if the input is blank then show alert
// if not, call ajax to server to add the meals, update table and hide modal when completed
// Parameter: 
//************************************
$('#add-new-btn').on('click', () => {
    let newInput = $('#add-new-input').val().trim()
    if (newInput == "") {
        alert('The field can not be blank!')
    } else {
        try {
            $.ajax({
                url: '/add-meals',
                type: "get",
                contentType: "application/json",
                dataType: "json",
                data: {
                    mealName: newInput,
                },
                success: function (data) {
                    if (data.status == 0) {
                        alert("Can't find this " + newInput)
                    } else {
                        updateTable(data.data)
                        $('#add-new-modal').modal('hide')
                    }

                },
                error: (jqXHR, textStatus, errorThrown) => {
                    console.log(jqXHR, textStatus, errorThrown)
                }
            })
        } catch (err) {
            console.log(err)
        }
    }
})

