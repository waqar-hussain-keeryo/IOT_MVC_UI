$(document).ready(function () {
    initializeDataTable();
});

var customerData = null;

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
                        actions: edit(value.customerID)
                    };
                });
            }
        },
        columns: [
            { data: 'customerID', title: "Customer ID", visible: false },
            { data: 'customerName', title: "Customer Name" },
            { data: 'customerPhone', title: "Phone" },
            { data: 'customerEmail', title: "Email" },
            { data: 'customerCity', title: "City" },
            { data: 'customerRegion', title: "Region" },
            { data: 'actions', title: "Actions", orderable: false, searchable: false }
        ]
    });
}

var edit = (customerId) => `
    <div class="dropdown">
        <i class="bi bi-three-dots-vertical menu-button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false"></i>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#updateCustomer" onclick="update('${customerId}')">Edit</a></li>
            <li><a class="dropdown-item" href="#" onclick="deleteCustomer('${customerId}')">Delete</a></li>
        </ul>
    </div>`;

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


function updateCustomers() {
    var customerId = $('#updateCustomer #customerId').val();
    customerData.customerID = customerId;
    customerData.customerName = $('#updateCustomer #customerName').val();
    customerData.customerPhone = $('#updateCustomer #customerPhone').val();
    customerData.customerEmail = $('#updateCustomer #customerEmail').val();
    customerData.customerCity = $('#updateCustomer #customerCity').val();
    customerData.customerRegion = $('#updateCustomer #customerRegion').val();

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