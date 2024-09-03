$(document).ready(function () {
    initializeDataTable();
});

var customerData = [];
var deviceData = null;

function initializeDataTable() {
    $("#tbl_Device").DataTable({
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
                let devicesData = [];
                customerData.forEach(customer => {
                    customer.sites.forEach(site => {
                        if (site.devices && site.devices.length > 0) {
                            site.devices.forEach(device => {
                                devicesData.push({
                                    customerID: customer.customerID,
                                    deviceID: device.deviceID,
                                    deviceName: device.deviceName,
                                    productType: device.productType,
                                    threSholdValue: device.threSholdValue,
                                    actions: edit(device.deviceID)
                                });
                            });
                        }
                    });
                });

                console.log(devicesData); // Log the data to check
                return devicesData;
            }
        },
        columns: [
            { data: 'customerID', title: "Customer ID", visible: false },
            { data: 'deviceID', title: "Device ID", visible: false },
            { data: 'deviceName', title: "Device Name" },
            { data: 'productType', title: "Product Type" },
            { data: 'threSholdValue', title: "Threshold Value" },
            { data: 'actions', title: "Actions", orderable: false, searchable: false }
        ]
    });
}

var edit = (deviceId) => `
    <div class="dropdown">
        <i class="bi bi-three-dots-vertical menu-button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false"></i>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#updateDevice" onclick="editDevice('${deviceId}')">Edit</a></li>
            <li><a class="dropdown-item" href="#" onclick="deleteDevice('${deviceId}')">Delete</a></li>
        </ul>
    </div>`;

function editDevice(deviceId) {
    // Find the device data by searching in all customer data
    deviceData = null; // Reset deviceData before searching
    customerData.forEach(customer => {
        customer.sites.forEach(site => {
            const device = site.devices.find(d => d.deviceID === deviceId);
            if (device) {
                deviceData = {
                    ...device,
                    customerID: customer.customerID, // Add customerID to deviceData
                    siteID: site.siteID // Add siteID to deviceData
                };
            }
        });
    });

    if (deviceData) {
        $('#updateDevice #customerId').val(deviceData.customerID);
        $('#updateDevice #siteId').val(deviceData.siteID);
        $('#updateDevice #deviceId').val(deviceData.deviceID);
        $('#updateDevice #deviceName').val(deviceData.deviceName);
        $('#updateDevice #productType').val(deviceData.productType);
        $('#updateDevice #threSholdValue').val(deviceData.threSholdValue);
        $('#updateDevice').modal('show');
    } else {
        console.error("Device data not found for ID:", deviceId);
    }
}

function updateDeviceData() {
    if (!deviceData) {
        console.error("No device data available for update.");
        return;
    }

    const deviceId = $('#updateDevice #deviceId').val();
    const customerId = $('#updateDevice #customerId').val();
    const siteId = $('#updateDevice #siteId').val();

    const updatedDeviceData = {
        customerId: customerId,
        siteId: siteId,
        deviceId: deviceId,
        deviceName: $('#updateDevice #deviceName').val(),
        productType: $('#updateDevice #productType').val(),
        threSholdValue: $('#updateDevice #threSholdValue').val()
    };

    $.ajax({
        type: 'PUT',
        url: `https://localhost:7290/api/Customer/UpdateDevice`,
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(updatedDeviceData),
        success: function () {
            successAlert('Device updated successfully.');
            $('#updateDevice').modal('hide');
            $('#tbl_Device').DataTable().ajax.reload(null, false);
        },
        error: function (xhr, status, error) {
            console.error("Update error:", xhr.responseText);
            warningAlert("An error occurred while updating the device. Please try again.");
        }
    });
}

function deleteDevice(deviceId) {
    if (confirm('Are you sure you want to delete this device?')) {
        $.ajax({
            type: 'DELETE',
            url: `https://localhost:7290/api/Customer/DeleteDevice/${deviceId}`,
            contentType: 'application/json; charset=utf-8',
            success: function () {
                successAlert('Device deleted successfully.');
                $('#tbl_Device').DataTable().ajax.reload(null, false);
            },
            error: function (xhr, status, error) {
                console.error("Delete error:", xhr.responseText);
                warningAlert("An error occurred while deleting the device. Please try again.");
            }
        });
    }
}
