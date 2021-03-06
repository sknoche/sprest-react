"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var gd_sprest_1 = require("gd-sprest");
var office_ui_fabric_react_1 = require("office-ui-fabric-react");
var __1 = require("..");
var _1 = require(".");
/**
 * Item Form
 */
var ItemForm = /** @class */ (function (_super) {
    __extends(ItemForm, _super);
    /**
     * Constructor
     */
    function ItemForm(props) {
        var _this = _super.call(this, props) || this;
        /**
         * Reference to the attachments field
         */
        _this._attachmentField = null;
        /**
         * Reference to the form fields
         */
        _this._formFields = {};
        /**
         * Method to load the list information
         */
        _this.loadformInfo = function () {
            var fields = null;
            var formFields = _this.props.fields;
            // Ensure the fields exist
            if (formFields) {
                fields = [];
                // Parse the fields
                for (var i = 0; i < formFields.length; i++) {
                    // Add the field
                    fields.push(formFields[i].name);
                }
            }
            // Create an instance of the list form
            gd_sprest_1.Helper.ListForm.create({
                cacheKey: _this.props.cacheKey,
                fields: fields,
                item: _this.props.item,
                itemId: _this.props.itemId,
                listName: _this.props.listName,
                webUrl: _this.props.webUrl
            }).then(function (formInfo) {
                // Update the state
                _this.setState({ formInfo: formInfo });
            });
        };
        /**
         * Method to refresh the item
         */
        _this.refreshItem = function () {
            // Reload the item
            gd_sprest_1.Helper.ListForm.refreshItem(_this.state.formInfo).then(function (formInfo) {
                // See if we are loading attachments
                if (_this.props.showAttachments) {
                    // Refresh the attachments field
                    _this._attachmentField.refresh().then(function () {
                        // Update the state
                        _this.setState({ formInfo: formInfo, refreshFl: false });
                    });
                }
                else {
                    // Update the state
                    _this.setState({ formInfo: formInfo, refreshFl: false });
                }
            });
        };
        /**
         * Method to render the attachments field
         */
        _this.renderAttachmentsField = function () {
            var item = _this.state.formInfo.item;
            // See if we are displaying attachments
            if (_this.props.showAttachments) {
                return (React.createElement("div", { className: "ms-Grid-row", key: "row_Attachments" },
                    React.createElement("div", { className: "ms-Grid-col-md12" },
                        React.createElement(__1.Fields.FieldAttachments, { className: _this.props.fieldClassName, controlMode: _this.ControlMode, files: item ? item.AttachmentFiles : null, key: "Attachments", itemId: item.Id, listName: _this.props.listName, onAttachmentsRender: _this.props.onFieldRender == null ? null : function (attachments) { return _this.props.onFieldRender({ listName: _this.props.listName, name: "Attachments" }, attachments); }, onFileAdded: _this.props.onAttachmentAdded, onFileClick: _this.props.onAttachmentClick == null ? null : function (file) { return _this.props.onAttachmentClick(file, _this.ControlMode); }, onFileRender: _this.props.onAttachmentRender == null ? null : function (file) { return _this.props.onAttachmentRender(file, _this.ControlMode); }, onRender: _this.props.onRenderAttachments == null ? null : function (files) { return _this.props.onRenderAttachments(files, _this.ControlMode); }, ref: function (field) { _this._attachmentField = field; }, webUrl: _this.props.webUrl }))));
            }
            // Render nothing
            return null;
        };
        /**
         * Method to render the fields
         */
        _this.renderFields = function () {
            var formFields = [];
            var item = _this.state.formInfo.item;
            // Parse the form fields
            for (var fieldName in _this.state.formInfo.fields) {
                var field = _this.state.formInfo.fields[fieldName];
                var readOnly = false;
                // See if we are excluding this field
                if (_this.props.excludeFields && _this.props.excludeFields.indexOf(fieldName) >= 0) {
                    continue;
                }
                // See if this is a read-only field
                if (_this.props.readOnlyFields && _this.props.readOnlyFields.indexOf(fieldName) >= 0) {
                    // Set the flag
                    readOnly = true;
                }
                // Find the field information
                var fieldInfo = null;
                var fields = _this.props.fields || [];
                for (var i = 0; i < fields.length; i++) {
                    // See if this is the field we are looking for
                    if (fields[i].name == fieldName) {
                        // Set the field information and break from the loop
                        fieldInfo = fields[i];
                        break;
                    }
                }
                // Set the default value
                var defaultValue = item ? item[field.InternalName] : null;
                if (item && defaultValue == null && (field.FieldTypeKind == gd_sprest_1.SPTypes.FieldType.Lookup || field.FieldTypeKind == gd_sprest_1.SPTypes.FieldType.User)) {
                    // Try to set it to the "Id" field value
                    defaultValue = item[field.InternalName + "Id"];
                }
                // Add the form field
                formFields.push(React.createElement("div", { className: "ms-Grid-row", key: "row_" + fieldName },
                    React.createElement("div", { className: "ms-Grid-col ms-md12" },
                        React.createElement(_1.Field, { className: _this.props.fieldClassName, controlMode: readOnly ? gd_sprest_1.SPTypes.ControlMode.Display : _this.ControlMode, defaultValue: defaultValue, field: field, listName: _this.props.listName, key: field.InternalName, name: field.InternalName, onChange: fieldInfo ? fieldInfo.onChange : null, onFieldRender: _this.props.onFieldRender, onRender: fieldInfo ? fieldInfo.onRender : null, queryTop: _this.props.queryTop, ref: function (field) { field ? _this._formFields[field.props.name] = field : null; }, webUrl: _this.props.webUrl }))));
            }
            // Return the form fields
            return formFields;
        };
        /**
         * Method to save the item attachments
         * @param itemId - The item id.
         */
        _this.saveAttachments = function () {
            // Return a promise
            return new Promise(function (resolve, reject) {
                // See if attachments exist
                if (_this._attachmentField) {
                    // Save the attachments
                    _this._attachmentField.save().then(function () {
                        // Resolve the promise
                        resolve();
                    });
                }
                else {
                    // Resolve the promise
                    resolve();
                }
            });
        };
        // Set the state
        _this.state = {
            fields: null,
            itemId: null,
            formInfo: null,
            refreshFl: false,
            saveFl: false,
            updateFl: false
        };
        return _this;
    }
    Object.defineProperty(ItemForm.prototype, "AttachmentsField", {
        /**
         * Attachments Field
         */
        get: function () { return this._attachmentField; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemForm.prototype, "ControlMode", {
        /**
         * Form Control Mode
         */
        get: function () {
            var controlMode = this.props.controlMode;
            // Default the value
            if (typeof (this.props.controlMode) !== "number") {
                controlMode = gd_sprest_1.SPTypes.ControlMode.Display;
            }
            // See if we are editing the form
            if (controlMode == gd_sprest_1.SPTypes.ControlMode.Edit) {
                // Ensure the item exists
                controlMode = this.state.formInfo.item && this.state.formInfo.item.Id > 0 ? gd_sprest_1.SPTypes.ControlMode.Edit : gd_sprest_1.SPTypes.ControlMode.New;
            }
            // Return the control mode
            return controlMode;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ItemForm.prototype, "FormInfo", {
        /**
         * Get the form information
         */
        get: function () { return this.state.formInfo; },
        enumerable: true,
        configurable: true
    });
    /**
     * Render the component
     */
    ItemForm.prototype.render = function () {
        var spinner = null;
        // See if the list has been loaded
        if (this.state.formInfo == null) {
            // Load the list information
            this.loadformInfo();
            // Return a spinner
            return (React.createElement(office_ui_fabric_react_1.Spinner, { label: "Loading the list information..." }));
        }
        // See if we are refreshing the item
        if (this.state.refreshFl) {
            // Refresh the item
            this.refreshItem();
            // Set the spinner
            spinner = (React.createElement(office_ui_fabric_react_1.Spinner, { label: "Refreshing the Item", size: office_ui_fabric_react_1.SpinnerSize.large }));
        }
        else if (this.state.saveFl) {
            // Set the spinner
            spinner = (React.createElement(office_ui_fabric_react_1.Spinner, { label: "Saving the item", size: office_ui_fabric_react_1.SpinnerSize.large }));
        }
        else if (this.state.updateFl) {
            // Set the spinner
            spinner = (React.createElement(office_ui_fabric_react_1.Spinner, { label: "Updating the Item", size: office_ui_fabric_react_1.SpinnerSize.large }));
        }
        // See if there is a custom renderer
        if (this.props.onRender) {
            // Render the custom event
            return (React.createElement("div", null,
                spinner,
                React.createElement("div", { hidden: spinner ? true : false }, this.props.onRender(this.ControlMode))));
        }
        // Render the fields
        return (React.createElement("div", { className: "ms-Grid " + (this.props.className || "") },
            !this.state.saveFl ? null :
                React.createElement(office_ui_fabric_react_1.Spinner, { label: "Saving the Item", size: office_ui_fabric_react_1.SpinnerSize.large }),
            React.createElement("div", { hidden: this.state.saveFl },
                this.renderAttachmentsField(),
                this.renderFields())));
    };
    /**
     * Methods
     */
    /**
     * Method to get the form values
     */
    ItemForm.prototype.getFormValues = function () {
        var formValues = {};
        // Parse the fields
        for (var fieldName in this._formFields) {
            var field = this._formFields[fieldName];
            var fieldInfo = field ? field.state.fieldInfo : null;
            var fieldValue = field.Value;
            // Ensure the field information exists
            if (fieldInfo == null) {
                continue;
            }
            // See if this is a lookup or user field
            if (fieldInfo.type == gd_sprest_1.SPTypes.FieldType.Lookup ||
                fieldInfo.type == gd_sprest_1.SPTypes.FieldType.User) {
                // Ensure the field name is the "Id" field
                fieldName += fieldName.lastIndexOf("Id") == fieldName.length - 2 ? "" : "Id";
            }
            // See if this is a multi-value taxonomy field
            if (fieldInfo.typeAsString == "TaxonomyFieldTypeMulti") {
                var valueField = field.getField().state.valueField;
                // Update the hidden form field
                fieldName = valueField.InternalName;
                fieldValue = fieldValue ? fieldValue.results.join(";#") : fieldValue;
            }
            // Update the form field value
            formValues[fieldName] = fieldValue;
        }
        // Return the form values
        return formValues;
    };
    /**
     * Method to refresh the item
     */
    ItemForm.prototype.refresh = function () {
        // Update the state
        this.setState({ refreshFl: true });
    };
    /**
     * Method to save the item form
     */
    ItemForm.prototype.save = function () {
        var _this = this;
        // Return a promise
        return new Promise(function (resolve, reject) {
            // Set the state
            _this.setState({ saveFl: true }, function () {
                // Save the item
                gd_sprest_1.Helper.ListForm.saveItem(_this.state.formInfo, _this.getFormValues())
                    .then(function (formInfo) {
                    // Save the attachments
                    _this.saveAttachments().then(function () {
                        // Refresh the item
                        gd_sprest_1.Helper.ListForm.refreshItem(formInfo).then(function (formInfo) {
                            // Update the state
                            _this.setState({ formInfo: formInfo, saveFl: false }, function () {
                                // Resolve the promise
                                resolve(formInfo.item);
                            });
                        });
                    });
                });
            });
        });
    };
    /**
     * Method to update the item.
     */
    ItemForm.prototype.updateItem = function (fieldValues) {
        var _this = this;
        // Return a promise
        return new Promise(function (resolve, reject) {
            // Set the state
            _this.setState({ updateFl: true }, function () {
                var formInfo = _this.state.formInfo;
                // Update the item
                gd_sprest_1.Helper.ListForm.saveItem(formInfo, fieldValues).then(function (formInfo) {
                    // Update the state
                    _this.setState({ formInfo: formInfo, updateFl: false }, function () {
                        // Resolve the promise
                        resolve(formInfo.item);
                    });
                });
            });
        });
    };
    return ItemForm;
}(React.Component));
exports.ItemForm = ItemForm;
