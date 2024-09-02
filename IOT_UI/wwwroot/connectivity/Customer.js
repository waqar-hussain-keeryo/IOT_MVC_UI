$(document).ready(function () {
    GetAllCustomers();
});

function GetAllCustomers() {
    var tableData = [];

    // Retrieve the JWT token from local storage or session storage
    var token = localStorage.getItem("JWTToken");

    if (!token) {
        warningAlert("User is not authenticated. Please log in again.");
        return;
    }

    var customerData = {
        PageNumber: 0,
        PageSize: 0
    };

    $.ajax({
        type: 'POST',
        url: 'https://localhost:7290/api/Customer/GetAllCustomers',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: false,
        data: JSON.stringify(customerData),
        headers: {
            'Authorization': 'Bearer ' + token
        },
        success: function (response) {
            successAlert(response.message);
            var edit = `<div class="dropdown">
                            <i class="bi bi-three-dots-vertical menu-button"></i>
                            <div class="dropdown-content">
                            <a href="#" data-bs-toggle="modal" data-bs-target="#updateCustomer" onclick="update(this)">Edit</a>
                            <a href="#" onclick="delete(this)">Delete</a>
                            <a href="#" data-bs-toggle="modal" data-bs-target="#addCustomerUsers">Add Customer Users</a>
                            <a href="#" data-bs-toggle="modal" data-bs-target="#addNotificationUsers">Add Notification Users</a>
                            </div>
                        </div>`;
            $.each(response.data, function (key, value) {
                tableData.push([value.name, value.phoneNumber, value.email, value.city, value.region, edit]);
            });
        },
        error: function (xhr, status, error) {
            console.error("GetAllCustomers error:", xhr.responseText);
            warningAlert("An error occurred while fetching customer data. Please try again.");
        }
    });

    $("#tbl_Customer").DataTable({
        data: tableData
    });
}
