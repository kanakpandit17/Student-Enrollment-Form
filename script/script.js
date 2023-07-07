/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */


var jpdbBaseURL = 'http://api.login2explore.com:5577';
var jpdbIRL = '/api/irl';
var jpbdIML = '/api/iml';
var studentDatabaseName = 'SCHOOL-DB';
var studentRelationName = 'STUDENT-TABLE';
var connectionToken = '90933026|-31949323563908511|90949851';

$('#rollNo').focus();



//Function for return alter HTML code according to status of response
function alertHandlerHTML(status, message) {
    // 1--> Success , 0--> Warning
    
    if (status === 1) {
        return `<div class="alert  alert-primary d-flex align-items-center alert-dismissible " role="alert">
 
                <div>
                  <strong>Success!</strong> ${message}
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
              </div>`;
    } else {
        return `<div class="alert  alert-warning d-flex align-items-center alert-dismissible" role="alert">
        
        <div>
          <strong>Warning!</strong> ${message}
        </div>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`;
    }

}

////Function for append alter message into alter div
function alertHandler(status, message) {
    var alterHTML = alertHandlerHTML(status, message);
    let alertDiv = document.createElement('div');
    alertDiv.innerHTML = alterHTML;
    $('#disposalAlertContainer').append(alertDiv);
}

// Function for save record number into localstorage
function saveRecNoToLocalStorage(jsonObject) {
    var lvData = JSON.parse(jsonObject.data);
    localStorage.setItem('recordNo', lvData.rec_no);
}

// Function for disable all element on page except roll number input feild
function disableAllFeildExceptRollno() {
    $('#fullName').prop('disabled', true);
    $('#class').prop('disabled', true);
    $('#birthDate').prop('disabled', true);
    $('#inputAddress').prop('disabled', true);
    $('#enrollmentDate').prop('disabled', true);
    $('#resetBtn').prop('disabled', true);
    $('#saveBtn').prop('disabled', true);
    $('#updateBtn').prop('disabled', true);
}


//Function for reset form data and disable all other feild except roll number
function resetForm() {
    $('#rollNo').val("");
    $('#fullName').val("");
    $('#class').val("");
    $('#birthDate').val("");
    $('#inputAddress').val("");
    $('#enrollmentDate').val("");

    $('#rollNo').prop('disabled', false);
    disableAllFeildExceptRollno();
    $('#rollNo').focus();


}

//Function for fill data if student already is present in database
function fillData(jsonObject) {
    if (jsonObject === "") {
        $('#fullName').val("");
        $('#class').val("");
        $('#birthDate').val("");
        $('#inputAddress').val("");
        $('#enrollmentDate').val("");
    } else {
        // student record number saved to localstorage
        saveRecNoToLocalStorage(jsonObject);
        
        // parse json object into JSON
        var data = JSON.parse(jsonObject.data).record;
        
        $('#fullName').val(data.name);
        $('#class').val(data.className);
        $('#birthDate').val(data.birthDate);
        $('#inputAddress').val(data.address);
        $('#enrollmentDate').val(data.enrollmentData);
    }
}


//Function to check validity of Enrollment Number
function validateEnrollmentDate() {
    var inputBirthDate = $('#birthDate').val();
    var inputEnrollmentDate = $('#enrollmentDate').val();
    inputBirthDate = new Date(inputBirthDate);
    inputEnrollmentDate = new Date(inputEnrollmentDate);
    
    //Enrollment date should be greater than Birth date
    return inputBirthDate.getTime() < inputEnrollmentDate.getTime();

}

//Function to check validity of user input data
function validateFormData() {
    var rollNo, name, className, birthDate, address, enrollmentData;
    rollNo = $('#rollNo').val();
    name = $('#fullName').val();
    className = $('#class').val();
    birthDate = $('#birthDate').val();
    address = $('#inputAddress').val();
    enrollmentData = $('#enrollmentDate').val();

    if (rollNo === '') {
        alertHandler(0, 'Roll NO Missing');
        $('#rollNo').focus();
        return "";
    }

    if (rollNo <= 0) {
        alertHandler(0, 'Invalid Roll-No');
        $('#rollNo').focus();
        return "";
    }

    if (className === '') {
        alertHandler(0, 'Class Name is Missing');
        $('#class').focus();
        return "";
    }
    if (className <= 0 && className > 12) {
        alertHandler(0, 'Invalid Class Name');
        $('#class').focus();
        return "";
    }
    if (birthDate === '') {
        alertHandler(0, 'Birth Date Is Missing');
        $('#birthDate').focus();
        return "";
    }
    if (address === '') {
        alertHandler(0, 'Address Is Missing');
        $('#address').focus();
        return "";
    }
    if (enrollmentData === '') {
        alertHandler(0, 'Enrollment Data Is Missing');
        $('#enrollmentDate').focus();
        return "";
    }

    if (!validateEnrollmentDate()) {
        alertHandler(0, 'Invalid Enrollment Date(i.e Enrollment Date should be greater than Birth Date)');
        $('#enrollmentData').focus();
        return "";
    }

    // if data is valid then create a JSON object otherwise return empty string( which denote that data is not valid )
    var jsonStrObj = {
        id: rollNo,
        name: name,
        className: className,
        birthDate: birthDate,
        address: address,
        enrollmentData: enrollmentData
    };
    
    //Convert JSON object into string 
    return JSON.stringify(jsonStrObj);
}


//Function to return stringified JSON object whcih contain roll number of student
function getStudentRollnoAsJsonObj() {
    var rollNO = $('#rollNo').val();
    var jsonStr = {
        id: rollNO
    };
    return JSON.stringify(jsonStr);
}


// Function to query details of existing student
function getStudentData() {

     
    if ($('#rollNo').val() === "") { // if roll number is not given then disable all feild
        disableAllFeildExceptRollno();
    } else if ($('#rollNo').val() < 1) { // if roll number is not valid (i.e roll-no <1)
        disableAllFeildExceptRollno();
        alertHandler(0, 'Invalid Roll-No');
        $('#rollNo').focus();
    } else { // if roll number is valid
        var studentRollnoJsonObj = getStudentRollnoAsJsonObj(); 
        
        // create GET Request object
        var getRequest = createGET_BY_KEYRequest(connectionToken, studentDatabaseName, studentRelationName, studentRollnoJsonObj);
        
        jQuery.ajaxSetup({async: false});
        // make GET request
        var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
        jQuery.ajaxSetup({async: true});
        
        // Enable all feild
        $('#rollNo').prop('disabled', false);
        $('#fullName').prop('disabled', false);
        $('#class').prop('disabled', false);
        $('#birthDate').prop('disabled', false);
        $('#inputAddress').prop('disabled', false);
        $('#enrollmentDate').prop('disabled', false);

        
        if (resJsonObj.status === 400) { // if student is not exist already with same roll number then enable save and reset btn
            $('#resetBtn').prop('disabled', false);
            $('#saveBtn').prop('disabled', false);
            $('#updateBtn').prop('disabled', true);
            fillData("");
            $('#name').focus();
        } else if (resJsonObj.status === 200) {// if student is exist already with same roll number then enable update and reset btn
            $('#rollNO').prop('disabled', true);
            fillData(resJsonObj);
            $('#resetBtn').prop('disabled', false);
            $('#updateBtn').prop('disabled', false);
            $('#saveBtn').prop('disabled', true);
            $('#name').focus();
        }
    }



}

//Function to make PUT request to save data into database
function saveData() {
    var jsonStrObj = validateFormData();
    
    // If form data is not valid
    if (jsonStrObj === '')
        return '';

    // create PUT Request object
    var putRequest = createPUTRequest(connectionToken, jsonStrObj, studentDatabaseName, studentRelationName);
    jQuery.ajaxSetup({async: false});
    
    //Make PUT Request for saving data into database
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpbdIML);
    jQuery.ajaxSetup({async: true});
    
    if (resJsonObj.status === 400) {// If data is not saved
        alertHandler(0, 'Data Is Not Saved ( Message: ' + resJsonObj.message + " )");
    } else if (resJsonObj.status === 200) {// If data is successfully saved
        alertHandler(1, 'Data Saved successfully');
    }
    //After saving to databse resent from data 
    resetForm();
    
    $('#empid').focus();
}



//Function used to make UPDATE Request
function changeData() {
    $('#changeBtn').prop('disabled', true);
    var jsonChg = validateFormData(); // Before making UPDATE Request validate form data
    
    // Create UPDATE Request object
    var updateRequest = createUPDATERecordRequest(connectionToken, jsonChg, studentDatabaseName, studentRelationName, localStorage.getItem("recordNo"));
    jQuery.ajaxSetup({async: false});
    
    //Make UPDATE Request
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpbdIML);
    jQuery.ajaxSetup({async: true});
    
    if (resJsonObj.status === 400) {// If data is not saved
        alertHandler(0, 'Data Is Not Update ( Message: ' + resJsonObj.message + " )");
    } else if (resJsonObj.status === 200) {// If data is successfully saved
        alertHandler(1, 'Data Update successfully');
    }
    
    //After updating to databse resent from data
    resetForm();
    $('#empid').focus();
}


