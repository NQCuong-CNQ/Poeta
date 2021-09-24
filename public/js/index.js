var saveData = []
var selectedMeals

//************************************
// Description: trigger when click on edit, show edit modal and set text
// Parameter: mealName, count
//************************************
onEdit = (mealName, count) => {
    $('#edit-modal').modal('show')
    selectedMeals = mealName
    $('#edit-modal #edit-input').val(mealName)
    $('#edit-modal #edit-count').text(`The count is ${count}`)
}

//************************************
// Description: trigger when click on delete, show delete modal and set text
// Parameter: mealName, count
//************************************
onDelete = (mealName, count) => {
    $('#delete-modal').modal('show')
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
            <td>${data[i].mealsName}</td>
            <td>${data[i].count}</td>
            <td><div class="edit-container"><a onclick="onEdit('${data[i].mealsName}',${data[i].count})">Edit</a><span>|</span><a onclick="onDelete('${data[i].mealsName}',${data[i].count})">Delete</a></div></td>
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
    let mealsName = $('#edit-modal #edit-input').val().trim()
    if (mealsName == "") {
        alert('The input field can not be blank!')
    } else {
        try {
            $.ajax({
                url: `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(mealsName)}`,
                type: "get",
                crossDomain: true,
                dataType: "json",
                success: function (response) {
                    if (response.meals === null) {
                        alert("Can't find this " + mealsName)
                    } else {
                        let objIndex = saveData.findIndex(meal => meal.mealsName === selectedMeals)
                        saveData[objIndex].mealsName = mealsName
                        saveData[objIndex].count = response.meals.length
                        updateTable(saveData)
                        $('#edit-modal').modal('hide')
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
        let mealsName = $('#delete-modal #delete-meal-name').text().trim()
        saveData = saveData.filter(meal => {
            return meal.mealsName != mealsName
        })
        updateTable(saveData)
        $('#delete-modal').modal('hide')
    } catch (err) {
        console.log(err)
    }
})


//************************************
// Description: trigger when click add-new button, check if the input is blank then show alert
// if not, call ajax to server to add the meals, update table and hide modal when completed
// Parameter: 
//************************************
$('#add-new-btn').on('click', async () => {
    let mealsName = $('#add-new-input').val().trim().capitalize()
    let mealsObj
    if (mealsName == "") {
        alert('The input field can not be blank!')
    }
    else if (saveData.find(name => name.mealsName === mealsName)) {
        alert(`"${mealsName}" is already in the table!`)
    }
    else {
        try {
            $.ajax({
                url: `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(mealsName)}`,
                type: "get",
                crossDomain: true,
                dataType: "json",
                success: function (response) {
                    if (response.meals === null) {
                        alert("Can't find this " + mealsName)
                    } else {

                        mealsObj = new Object()
                        mealsObj.mealsName = mealsName
                        mealsObj.count = response.meals.length
                        saveData.push(mealsObj)

                        updateTable(saveData)
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
// Description: A prototype for capitalize text
// Parameter: 
//************************************
String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}