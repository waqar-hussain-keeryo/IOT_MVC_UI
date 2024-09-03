$(document).ready(function () {
    initializeDataTable();
});

var productTypeData = null;

function initializeDataTable() {
    $("#tbl_ProductType").DataTable({
        ajax: {
            url: 'https://localhost:7290/api/ProductType/GetAllProductTypes',
            type: 'POST',
            contentType: 'application/json; charset=utf-8',
            data: function (d) {
                return JSON.stringify({
                    PageNumber: 1,
                    PageSize: 10
                });
            },
            dataSrc: function (response) {
                console.log(response.data);
                return $.map(response.data.productTypes, function (value, key) {
                    return {
                        productTypeID: value.productTypeID,
                        productTypeName: value.productTypeName,
                        minVal: value.minVal,
                        maxVal: value.maxVal,
                        uom: value.uom,
                        isActive: value.isActive,
                        actions: edit(value.productTypeID) // Corrected here
                    };
                });
            }
        },
        columns: [
            { data: 'productTypeID', title: "Product Type ID", visible: false },
            { data: 'productTypeName', title: "Product Type Name" },
            { data: 'minVal', title: "Minimum Value" },
            { data: 'maxVal', title: "Maximum Value" },
            { data: 'uom', title: "UOM" },
            { data: 'isActive', title: "Active" },
            { data: 'actions', title: "Actions", orderable: false, searchable: false }
        ]
    });
}

var edit = (productTypeID) => `
    <div class="dropdown">
        <i class="bi bi-three-dots-vertical menu-button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false"></i>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#updateProductType" onclick="update('${productTypeID}')">Edit</a></li>
            <li><a class="dropdown-item" href="#" onclick="deleteProductType('${productTypeID}')">Delete</a></li>
        </ul>
    </div>`;

function update(productTypeID) {
    $.ajax({
        type: 'GET',
        url: `https://localhost:7290/api/ProductType/GetProductTypeById/${productTypeID}`,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (response) {
            productTypeData = response.data;
            $('#updateProductType #productTypeID').val(response.data.productTypeID);
            $('#updateProductType #productTypeName').val(response.data.productTypeName);
            $('#updateProductType #minVal').val(response.data.minVal);
            $('#updateProductType #maxVal').val(response.data.maxVal);
            $('#updateProductType #uom').val(response.data.uom);
            $('#updateProductType #isActive').prop('checked', response.data.isActive);
            $('#updateProductType').modal('show');
        },
        error: function (xhr, status, error) {
            console.error("Update fetch error:", xhr.responseText);
            warningAlert("An error occurred while fetching product type data. Please try again.");
        }
    });
}

function updateProductTypes() {
    var productTypeID = $('#updateProductType #productTypeID').val();
    productTypeData.productTypeID = productTypeID;
    productTypeData.productTypeName = $('#updateProductType #productTypeName').val();
    productTypeData.minVal = $('#updateProductType #minVal').val();
    productTypeData.maxVal = $('#updateProductType #maxVal').val();
    productTypeData.maxVal = $('#updateProductType #uom').val();
    productTypeData.isActive = $('#updateProductType #isActive').is(':checked');

    $.ajax({
        type: 'PUT',
        url: 'https://localhost:7290/api/ProductType/UpdateProductType',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(productTypeData),
        success: function () {
            successAlert('Product Type updated successfully.');
            $('#updateProductType').modal('hide');
            $('#tbl_ProductType').DataTable().ajax.reload(null, false);
        },
        error: function (xhr, status, error) {
            console.error("Update error:", xhr.responseText);
            warningAlert("An error occurred while updating the product type. Please try again.");
        }
    });
}

function deleteProductType(productTypeID) {
    if (confirm('Are you sure you want to delete this product type?')) {
        $.ajax({
            type: 'DELETE',
            url: `https://localhost:7290/api/ProductType/DeleteProductType/${productTypeID}`,
            contentType: 'application/json; charset=utf-8',
            success: function () {
                successAlert('Product Type deleted successfully.');
                $('#tbl_ProductType').DataTable().ajax.reload(null, false);
            },
            error: function (xhr, status, error) {
                console.error("Delete error:", xhr.responseText);
                warningAlert("An error occurred while deleting the product type. Please try again.");
            }
        });
    }
}
