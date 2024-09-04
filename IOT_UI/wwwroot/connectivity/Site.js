$(document).ready(function () {
    if (!$.fn.DataTable.isDataTable('#tbl_Site')) {
        initializeDataTable();
    }
});


var customerData = []; // Store all customer data globally
var siteData = null; // Store the site data for editing

function initializeDataTable() {
    $("#tbl_Site").DataTable({
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
                let sitesData = [];
                customerData.forEach(customer => {
                    if (customer.sites && customer.sites.length > 0) {
                        customer.sites.forEach(site => {
                            sitesData.push({
                                customerID: customer.customerID,
                                customerEmail: customer.customerEmail,
                                siteID: site.siteID,
                                siteName: site.siteName,
                                siteLocation: site.siteLocation,
                                latitude: site.latitude,
                                longitude: site.longitude,
                                actions: edit(site.siteID)
                            });
                        });
                    }
                });
                return sitesData;
            }
        },
        columns: [
            { data: 'customerID', title: "Customer ID", visible: false },
            { data: 'siteID', title: "Site ID", visible: false },
            { data: 'customerEmail', title: "Customer Email" },
            { data: 'siteName', title: "Site Name" },
            { data: 'siteLocation', title: "Location" },
            { data: 'latitude', title: "Latitude" },
            { data: 'longitude', title: "Longitude" },
            { data: 'actions', title: "Actions", orderable: false, searchable: false }
        ]
    });
}

var edit = (siteId) => `
    <div class="dropdown">
        <i class="bi bi-three-dots-vertical menu-button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false"></i>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#updateSite" onclick="editSite('${siteId}')">Edit</a></li>
            <li><a class="dropdown-item" href="#" onclick="deleteSite('${siteId}')">Delete</a></li>
            <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#addDevice" onclick="">Add Device</a></li>
            <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#addService" onclick="">Add Digital Service</a></li>
        </ul>
    </div>`;

function editSite(siteId) {
    // Find the site data by searching in allCustomerData
    siteData = null; // Reset siteData before searching
    customerData.forEach(customer => {
        const site = customer.sites.find(s => s.siteID === siteId);
        if (site) {
            siteData = {
                ...site,
                customerID: customer.customerID
            };
        }
    });

    if (siteData) {
        $('#updateSite #customerId').val(siteData.customerID);
        $('#updateSite #siteId').val(siteData.siteID);
        $('#updateSite #siteName').val(siteData.siteName);
        $('#updateSite #siteLocation').val(siteData.siteLocation);
        $('#updateSite #latitude').val(siteData.latitude);
        $('#updateSite #longitude').val(siteData.longitude);
        $('#updateSite').modal('show');
    } else {
        console.error("Site data not found for ID:", siteId);
    }
}

function updateSiteData() {
    if (!siteData) {
        console.error("No site data available for update.");
        return;
    }

    const siteId = $('#updateSite #siteId').val();
    const customerId = $('#updateSite #customerId').val();

    const updatedSiteData = {
        customerId: customerId,
        siteId: siteId,
        siteName: $('#updateSite #siteName').val(),
        siteLocation: $('#updateSite #siteLocation').val(),
        latitude: $('#updateSite #latitude').val(),
        longitude: $('#updateSite #longitude').val(),
    };

    $.ajax({
        type: 'PUT',
        url: `https://localhost:7290/api/Customer/UpdateSite`,
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(updatedSiteData),
        success: function () {
            successAlert('Site updated successfully.');
            $('#updateSite').modal('hide');
            $('#tbl_Site').DataTable().ajax.reload(null, false);
        },
        error: function (xhr, status, error) {
            console.error("Update error:", xhr.responseText);
            warningAlert("An error occurred while updating the site. Please try again.");
        }
    });
}

// Uncomment and use this function if needed for deleting sites
// function deleteSite(siteId) {
//     if (confirm('Are you sure you want to delete this site?')) {
//         $.ajax({
//             type: 'DELETE',
//             url: `https://localhost:7290/api/Customer/DeleteSite/${siteId}`,
//             contentType: 'application/json; charset=utf-8',
//             success: function () {
//                 successAlert('Site deleted successfully.');
//                 $('#tbl_Site').DataTable().ajax.reload(null, false);
//             },
//             error: function (xhr, status, error) {
//                 console.error("Delete error:", xhr.responseText);
//                 warningAlert("An error occurred while deleting the site. Please try again.");
//             }
//         });
//     }
// }
