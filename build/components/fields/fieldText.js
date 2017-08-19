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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var gd_sprest_1 = require("gd-sprest");
var office_ui_fabric_react_1 = require("office-ui-fabric-react");
var common_1 = require("../../common");
/**
 * Text Field
 */
var FieldText = (function (_super) {
    __extends(FieldText, _super);
    function FieldText() {
        /**
         * Public Interface
         */
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * Events
         */
        // The field initialized event
        _this.onFieldInit = function (field, state) {
            // Ensure this is a lookup field
            if (field.FieldTypeKind != gd_sprest_1.SPTypes.FieldType.Note && field.FieldTypeKind != gd_sprest_1.SPTypes.FieldType.Text) {
                // Log
                console.warn("[gd-sprest] The field '" + field.InternalName + "' is not a text field.");
                return;
            }
            // Update the state
            state.fieldInfo.multiline = field.FieldTypeKind == gd_sprest_1.SPTypes.FieldType.Note;
            state.fieldInfo.rows = field.NumberOfLines;
        };
        return _this;
    }
    // Method to render the component
    FieldText.prototype.renderField = function () {
        var props = this.props.props || {};
        // Update the properties
        props.errorMessage = props.errorMessage ? props.errorMessage : this.state.fieldInfo.errorMessage;
        props.label = props.label || this.state.label;
        props.multiline = typeof (props.label) === "boolean" ? props.label : this.state.fieldInfo.multiline;
        props.onChanged = this.updateValue;
        props.required = typeof (props.required) === "boolean" ? props.required : this.state.fieldInfo.required;
        props.rows = props.rows ? props.rows : this.state.fieldInfo.rows;
        props.value = this.getFieldValue();
        props.errorMessage = this.state.showErrorMessage ? (props.value ? "" : props.errorMessage) : "";
        // Return the component
        return (React.createElement(office_ui_fabric_react_1.TextField, __assign({}, props, { ref: "text" })));
    };
    return FieldText;
}(common_1.BaseField));
exports.FieldText = FieldText;
//# sourceMappingURL=fieldText.js.map