var saveData = []
var selectedMeals

//************************************
// Description: trigger when click on edit, show edit modal and set text
// Input: mealName, count
// Ouput:
//************************************
onEdit = (mealName, count) => {
    selectedMeals = mealName
    $('#edit-modal').modal('show')
    $('#edit-modal #edit-input').val(mealName)
    $('#edit-modal #edit-count').text(`The count is ${count}`)
}

//************************************
// Description: trigger when click on delete, show delete modal and set text
// Input: mealName, count
// Ouput:
//************************************
onDelete = (mealName, count) => {
    selectedMeals = mealName
    $('#delete-modal').modal('show')
    $('#delete-modal #delete-meal-ask').text(`Are you want to delete "${mealName}" with the count is ${count}?`)
}

//************************************
// Description: empty the table and loop for append each table row 
// Input: data
// Ouput:
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
// Description: check if response has value, find index of mealsName on data, update that value and update table, hide modal
// Input: response, mealsName
// Ouput:
//************************************
updateData = (response, mealsName) => {
    if (response === null) {
        alert("Can't find this " + mealsName)
    } else {
        let objIndex = saveData.findIndex(meal => meal.mealsName === selectedMeals)
        saveData[objIndex].mealsName = mealsName
        saveData[objIndex].count = response.length
        updateTable(saveData)
        $('#edit-modal').modal('hide')
    }
}

//************************************
// Description: trigger when click update button, check if the input is blank then show alert
// if not, call ajax to API to get the new meals, call updateData function
// Input: 
// Ouput:
//************************************
$('#update-btn').on('click', () => {
    let mealsName = $('#edit-modal #edit-input').val().trim().capitalize()
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
                    updateData(response.meals, mealsName)
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
// Description: trigger when click delete button, filer data when its not contain selected meal, update table and hide modal 
// Input: 
// Ouput:
//************************************
$('#delete-btn').on('click', () => {
    try {
        saveData = saveData.filter(meal => {
            return meal.mealsName != selectedMeals
        })
        updateTable(saveData)
        $('#delete-modal').modal('hide')
    } catch (err) {
        console.log(err)
    }
})

//************************************
// Description: check if response has value, create an object and store in data, update table and hide modal
// Input: response, mealsName
// Ouput:
//************************************
addNewData = (response, mealsName) => {
    let mealsObj
    if (response === null) {
        alert("Can't find this " + mealsName)
    } else {
        mealsObj = new Object()
        mealsObj.mealsName = mealsName
        mealsObj.count = response.length
        saveData.push(mealsObj)

        updateTable(saveData)
        $('#add-new-modal').modal('hide')
    }
}

//************************************
// Description: trigger when click add-new button, check if the input is blank then show alert
// if not, call ajax to API to get the meals, count the response, save data, update table and hide modal when completed
// Input: 
// Ouput:
//************************************
$('#add-new-btn').on('click', async () => {
    let mealsName = $('#add-new-input').val().trim().capitalize()
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
                    addNewData(response.meals, mealsName)
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
// Input: 
// Ouput: 
//************************************
String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1)
}