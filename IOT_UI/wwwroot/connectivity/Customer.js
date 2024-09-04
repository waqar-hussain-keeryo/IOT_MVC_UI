$(document).ready(function () {
    initializeDataTable();
    // Load user data on modal show
    $('#addCustomerUsers').on('shown.bs.modal', function () {
        loadUsers();
    });
});

var customerData = null;

// Function to initialize the DataTable
function initializeDataTable() {
    $("#tbl_Customer").DataTable({
        ajax: {
            url: 'https://localhost:7290/api/Customer/GetAllCustomers',
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            data: function (d) {
                return JSON.stringify({
                    PageNumber: 1,
                    PageSize: 10
                });
            },
            dataSrc: function (response) {
                return $.map(response.data.customers, function (value, key) {
                    return {
                        customerID: value.customerID,
                        customerName: value.customerName,
                        customerPhone: value.customerPhone,
                        customerEmail: value.customerEmail,
                        customerCity: value.customerCity,
                        customerRegion: value.customerRegion,
                        customerStatus: value.isActive ? "Yes" : "No",
                        actions: edit(value.customerID)
                    };
                });
            }
        },
        columns: [
            { data: 'customerID', title: "Customer ID", visible: false },
            { data: 'customerName', title: "Name" },
            { data: 'customerPhone', title: "Phone" },
            { data: 'customerEmail', title: "Email" },
            { data: 'customerCity', title: "City" },
            { data: 'customerRegion', title: "Region" },
            { data: 'customerStatus', title: "Active" },
            { data: 'actions', title: "Actions", orderable: false, searchable: false }
        ]
    });
}

// Function to handle the edit actions
var edit = (customerId) => `
    <div class="dropdown">
        <i class="bi bi-three-dots-vertical menu-button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false"></i>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#updateCustomer" onclick="update('${customerId}')">Edit</a></li>
            <li><a class="dropdown-item" href="#" onclick="deleteCustomer('${customerId}')">Delete</a></li>
            <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#addCustomerUsers" onclick="setupAddCustomerUsers('${customerId}')">Add Customer User</a></li>
        </ul>
    </div>`;

// Function to setup the Add Customer Users modal
function setupAddCustomerUsers(customerId) {
    $('#addCustomerId').val(customerId);
    // Load users when the modal is shown
    loadUsers();
}

// Function to load users into the dropdown
function loadUsers() {
    $.ajax({
        type: 'GET',
        url: 'https://localhost:7290/api/User/GetAllUsers', // Adjust URL to your API endpoint
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            var userSelect = $('#userSelect');
            userSelect.empty(); // Clear existing options
            $.each(response.data.users, function (i, user) {
                userSelect.append(new Option(user.userName, user.userId)); // Adjust properties as needed
            });
        },
        error: function (xhr, status, error) {
            console.error("Load users error:", xhr.responseText);
            warningAlert("An error occurred while loading users. Please try again.");
        }
    });
}

// Function to save selected users to the customer
function saveCustomerUsers() {
    var customerId = $('#addCustomerId').val();
    var selectedUsers = Array.from(document.getElementById('userSelect').selectedOptions)
        .map(option => option.value) // Collect user IDs
        .join(', ');

    console.log(`Customer ID: ${customerId}`);
    console.log(`Selected Users: ${selectedUsers}`);

    // Send the selected users to the server
    $.ajax({
        type: 'POST',
        url: `https://localhost:7290/api/Customer/AddCustomerUsers/${customerId}`,
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({ userIds: selectedUsers }), // Adjust data structure if needed
        success: function () {
            successAlert('Customer users added successfully.');
            $('#addCustomerUsers').modal('hide');
            $('#tbl_Customer').DataTable().ajax.reload(null, false);
        },
        error: function (xhr, status, error) {
            console.error("Add user error:", xhr.responseText);
            warningAlert("An error occurred while adding users. Please try again.");
        }
    });
}

// Function to handle update operation
function update(customerId) {
    $.ajax({
        type: 'GET',
        url: `https://localhost:7290/api/Customer/GetCustomerById/${customerId}`,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (response) {
            customerData = response.data;
            $('#updateCustomer #customerId').val(response.data.customerID);
            $('#updateCustomer #customerName').val(response.data.customerName);
            $('#updateCustomer #customerPhone').val(response.data.customerPhone);
            $('#updateCustomer #customerEmail').val(response.data.customerEmail);
            $('#updateCustomer #customerCity').val(response.data.customerCity);
            $('#updateCustomer #customerRegion').val(response.data.customerRegion);
            $('#updateCustomer').modal('show');
        },
        error: function (xhr, status, error) {
            console.error("Update fetch error:", xhr.responseText);
            warningAlert("An error occurred while fetching customer data. Please try again.");
        }
    });
}

// Function to update customer data
function updateCustomers() {
    var customerId = $('#updateCustomer #customerId').val();
    customerData.customerID = customerId;
    customerData.customerName = $('#updateCustomer #customerName').val();
    customerData.customerPhone = $('#updateCustomer #customerPhone').val();
    customerData.customerEmail = $('#updateCustomer #customerEmail').val();
    customerData.customerCity = $('#updateCustomer #customerCity').val();
    customerData.customerRegion = $('#updateCustomer #customerRegion').val();

    console.log(customerData);

    $.ajax({
        type: 'PUT',
        url: 'https://localhost:7290/api/Customer/UpdateCustomer',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(customerData),
        success: function () {
            successAlert('Customer updated successfully.');
            $('#updateCustomer').modal('hide');
            $('#tbl_Customer').DataTable().ajax.reload(null, false);
        },
        error: function (xhr, status, error) {
            console.error("Update error:", xhr.responseText);
            warningAlert("An error occurred while updating the customer. Please try again.");
        }
    });
}

// Function to delete a customer
function deleteCustomer(customerId) {
    if (confirm('Are you sure you want to delete this customer?')) {
        $.ajax({
            type: 'DELETE',
            url: `https://localhost:7290/api/Customer/DeleteCustomer/${customerId}`,
            contentType: 'application/json; charset=utf-8',
            success: function () {
                successAlert('Customer deleted successfully.');
                $('#tbl_Customer').DataTable().ajax.reload(null, false);
            },
            error: function (xhr, status, error) {
                console.error("Delete error:", xhr.responseText);
                warningAlert("An error occurred while deleting the customer. Please try again.");
            }
        });
    }
}
