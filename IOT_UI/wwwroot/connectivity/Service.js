$(document).ready(function () {
    initializeDataTable();
});

var customerData = [];
var digitalServiceData = null;

function initializeDataTable() {
    $("#tbl_Service").DataTable({
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
                customerData = response.data.customers;
                let servicesData = [];
                customerData.forEach(customer => {
                    if (customer.digitalServices && customer.digitalServices.length > 0) {
                        customer.digitalServices.forEach(service => {
                            servicesData.push({
                                customerID: customer.customerID,
                                digitalServiceID: service.digitalServiceID,
                                serviceStartDate: formatDateToMMDDYYYY(service.serviceStartDate),
                                serviceEndDate: formatDateToMMDDYYYY(service.serviceEndDate),
                                isActive: service.isActive,
                                actions: edit(service.digitalServiceID)
                            });
                        });
                    }
                });
                return servicesData;
            }
        },
        columns: [
            { data: 'customerID', title: "Customer ID", visible: false },
            { data: 'digitalServiceID', title: "Digital Service ID", visible: false },
            { data: 'serviceStartDate', title: "Start Date" },
            { data: 'serviceEndDate', title: "End Date" },
            { data: 'isActive', title: "Active" },
            { data: 'actions', title: "Actions", orderable: false, searchable: false }
        ]
    });
}

var edit = (digitalServiceId) => `
    <div class="dropdown">
        <i class="bi bi-three-dots-vertical menu-button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false"></i>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#updateService" onclick="editService('${digitalServiceId}')">Edit</a></li>
            <li><a class="dropdown-item" href="#" onclick="deleteService('${digitalServiceId}')">Delete</a></li>
        </ul>
    </div>`;

function editService(digitalServiceId) {
    digitalServiceData = null;
    customerData.forEach(customer => {
        const service = customer.digitalServices.find(s => s.digitalServiceID === digitalServiceId);
        if (service) {
            digitalServiceData = {
                ...service,
                customerID: customer.customerID
            };
        }
    });

    if (digitalServiceData) {
        $('#updateService #customerId').val(digitalServiceData.customerID);
        $('#updateService #digitalServiceId').val(digitalServiceData.digitalServiceID);
        $('#updateService #serviceStartDate').val(convertUTCDateToLocalDate(digitalServiceData.serviceStartDate));
        $('#updateService #serviceEndDate').val(convertUTCDateToLocalDate(digitalServiceData.serviceEndDate));
        $('#updateService #isActive').prop('checked', digitalServiceData.isActive);
        $('#updateService').modal('show');
    } else {
        console.error("Digital service data not found for ID:", digitalServiceId);
    }
}


function updateServiceData() {
    if (!digitalServiceData) {
        console.error("No digital service data available for update.");
        return;
    }

    const digitalServiceId = $('#updateService #digitalServiceId').val();
    const customerId = $('#updateService #customerId').val();

    const updatedServiceData = {
        customerId: customerId,
        digitalServiceId: digitalServiceId,
        serviceStartDate: convertLocalDateToUTC($('#updateService #serviceStartDate').val()), // Convert to UTC
        serviceEndDate: convertLocalDateToUTC($('#updateService #serviceEndDate').val()),     // Convert to UTC
        isActive: $('#updateService #isActive').prop('checked')
    };

    $.ajax({
        type: 'PUT',
        url: `https://localhost:7290/api/Customer/UpdateDigitalService`,
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(updatedServiceData),
        success: function () {
            successAlert('Digital service updated successfully.');
            $('#updateService').modal('hide');
            $('#tbl_Service').DataTable().ajax.reload(null, false);
        },
        error: function (xhr, status, error) {
            console.error("Update error:", xhr.responseText);
            warningAlert("An error occurred while updating the digital service. Please try again.");
        }
    });
}


function deleteService(digitalServiceId) {
    if (confirm('Are you sure you want to delete this digital service?')) {
        $.ajax({
            type: 'DELETE',
            url: `https://localhost:7290/api/Customer/DeleteDigitalService/${digitalServiceId}`,
            contentType: 'application/json; charset=utf-8',
            success: function () {
                successAlert('Digital service deleted successfully.');
                $('#tbl_Service').DataTable().ajax.reload(null, false);
            },
            error: function (xhr, status, error) {
                console.error("Delete error:", xhr.responseText);
                warningAlert("An error occurred while deleting the digital service. Please try again.");
            }
        });
    }
}

function formatDateToMMDDYYYY(dateString) {
    const date = new Date(dateString);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
}

function convertLocalDateToUTC(dateString) {
    const date = new Date(dateString);
    const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    return utcDate.toISOString();
}

function convertUTCDateToLocalDate(dateString) {
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset() * 60000; // Offset in milliseconds
    const localDate = new Date(date.getTime() - offset);
    return localDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
}
