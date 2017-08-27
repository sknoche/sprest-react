import * as React from "react";
import { Promise } from "es6-promise";
import { ContextInfo, SPTypes, Site, Types, Web } from "gd-sprest";
import { Dropdown, IDropdownOption, IDropdownProps, Spinner } from "office-ui-fabric-react";
import { IFieldManagedMetadata, IFieldManagedMetadataProps, IFieldManagedMetadataState, IManagedMetadataFieldInfo, IManagedMetadataTermInfo } from "../../definitions";
import { BaseField } from ".";
declare var SP;

/**
 * Managed Metadata Field
 */
export class FieldManagedMetadata extends BaseField<IFieldManagedMetadataProps, IFieldManagedMetadataState> implements IFieldManagedMetadata {
    /**
     * Public Interface
     */

    // Render the field
    renderField() {
        // Ensure the options exist
        if (this.state.options == null) {
            // Render a loading indicator
            return (
                <Spinner label="Loading the managed metadata data..." />
            );
        }

        // See if a custom render method exists
        if (this.props.onRender) {
            return this.props.onRender(this.state.fieldInfo);
        }

        // See if this is the display mode
        if (this.state.controlMode == SPTypes.ControlMode.Display) {
            // See if a value exists
            if (this.props.defaultValue) {
                // See if this field allows multiple values
                if (this.state.fieldInfo.allowMultipleValues) {
                    let values = [];

                    // Parse the results
                    for (let i = 0; i < this.props.defaultValue.results.length; i++) {
                        let result = this.props.defaultValue.results[i];

                        // Add the value
                        values.push(result);
                    }

                    // Render the field value
                    return (
                        <div className={this.props.className}>{values.join(", ")}</div>
                    );
                }

                // Render the field value
                return (
                    <div className={this.props.className}>{this.props.defaultValue}</div>
                );
            }

            // Render nothing
            return (
                <div className={this.props.className}></div>
            );
        }

        // Update the properties
        let props: IDropdownProps = this.props.props || {};
        props.className = this.props.className;
        props.errorMessage = props.errorMessage ? props.errorMessage : this.state.fieldInfo.errorMessage;
        props.errorMessage = this.state.showErrorMessage ? (props.selectedKey ? "" : props.errorMessage) : "";
        props.label = props.label ? props.label : this.state.label;
        props.multiSelect = this.state.fieldInfo.allowMultipleValues;
        props.onChanged = this.onChanged;
        props.options = this.state.options;
        props.required = props.required || this.state.fieldInfo.required;

        // See if this is a multi-choice
        if (props.multiSelect) {
            // Set the selected keys
            props.defaultSelectedKeys = this.state.value.results;
        } else {
            // Set the selected key
            props.defaultSelectedKey = this.state.value ? this.state.value.TermGuid : null;
        }

        // Return the component
        return (
            <Dropdown {...props} />
        );
    }

    /**
     * Events
     */

    // The change event for the dropdown list
    protected onChanged = (option: IDropdownOption, idx: number) => {
        // Call the change event
        this.props.onChange ? this.props.onChange(option) : null;

        // See if this is a multi-choice field
        if (this.state.fieldInfo.allowMultipleValues) {
            let fieldValue = this.state.value;

            // Append the option if it was selected
            if (option.isSelected || option.selected) {
                fieldValue.results.push(option.key);
            } else {
                // Parse the results
                for (let i = 0; i < fieldValue.results.length; i++) {
                    if (fieldValue.results[i] == option.key) {
                        // Remove the selected option
                        fieldValue.results.splice(i, 1);
                        break;
                    }
                }
            }

            // Add the metadata
            fieldValue ? fieldValue.__metadata = { type: "SP.Taxonomy.TaxonomyFieldValue" } : null;

            // Update the field value
            this.updateValue(fieldValue);
        } else {
            // Update the field value
            this.updateValue(option.selected ? {
                __metadata: { type: "SP.Taxonomy.TaxonomyFieldValue" },
                Label: option.data,
                TermGuid: option.key,
                WssId: -1
            } : null);
        }
    }

    // The field initialized event
    onFieldInit = (field: any, state: IFieldManagedMetadataState) => {
        let mmsField = field as Types.IFieldManagedMetadata;

        // Ensure this is a lookup field
        if (mmsField.TypeAsString != state.fieldInfo.typeAsString) {
            // Log
            console.warn("[gd-sprest] The field '" + field.InternalName + "' is not a lookup field.");
            return;
        }

        // Update the field information
        state.fieldInfo.allowMultipleValues = mmsField.AllowMultipleValues;
        state.fieldInfo.termSetId = mmsField.TermSetId;
        state.fieldInfo.termStoreId = mmsField.SspId;

        // Load the value field
        this.loadTerms(state.fieldInfo).then(fieldInfo => {
            let value = null;

            // See if this is a multi-lookup field and a value exists
            if (fieldInfo.allowMultipleValues) {
                let results = [];

                // Parse the values
                let values = this.props.defaultValue ? this.props.defaultValue.results : [];
                for (let i = 0; i < values.length; i++) {
                }

                // Set the default value
                value = { results };
            } else {
                // Set the default value
                value = this.props.defaultValue ? this.props.defaultValue : null;
            }

            // Add the metadata
            value ? value.__metadata = { type: "SP.Taxonomy.TaxonomyFieldValue" } : null;

            // Update the state
            this.setState({
                fieldInfo,
                options: this.toOptions(fieldInfo.terms),
                value
            });
        });
    }

    /**
     * Methods
     */

    // Method to load the terms
    private loadTerms = (fieldInfo: IManagedMetadataFieldInfo): PromiseLike<IManagedMetadataFieldInfo> => {
        // Return a promise
        return new Promise((resolve, reject) => {
            // Ensure the taxonomy script is loaded
            SP.SOD.registerSod("sp.taxonomy.js", SP.Utilities.Utility.getLayoutsPageUrl("sp.taxonomy.js"));
            SP.SOD.executeFunc("sp.taxonomy.js", "SP.Taxonomy.TaxonomySession", () => {
                // Load the terms
                let context = SP.ClientContext.get_current();
                let session = SP.Taxonomy.TaxonomySession.getTaxonomySession(context);
                let termStore = session.get_termStores().getById(fieldInfo.termStoreId);
                let termSet = termStore.getTermSet(fieldInfo.termSetId);
                let terms = termSet.getAllTerms();
                context.load(terms);

                // Execute the request
                context.executeQueryAsync(
                    // Success
                    () => {
                        // Clear the terms
                        fieldInfo.terms = [];

                        // Parse the terms
                        let enumerator = terms.getEnumerator();
                        while (enumerator.moveNext()) {
                            let term = enumerator.get_current();

                            // Add the term information
                            fieldInfo.terms.push({
                                id: term.get_id().toString(),
                                name: term.get_name(),
                                path: term.get_pathOfTerm().replace(/;/g, "/")
                            });
                        }

                        // Sort the terms
                        fieldInfo.terms.sort((a, b) => {
                            if (a.path < b.path) { return -1; }
                            if (a.path > b.path) { return 1; }
                            return 0;
                        });

                        // Resolve the request
                        resolve(fieldInfo);
                    },
                    // Error
                    () => {
                        // Log
                        console.log("[gd-sprest] Error getting the term set terms.");
                    }
                );
            });
        });
    }

    // Method to convert the field value to options
    private toOptions = (terms: Array<IManagedMetadataTermInfo> = []) => {
        let options: Array<IDropdownOption> = [];

        // See if this is not a required multi-lookup field
        if (!this.state.fieldInfo.required && !this.state.fieldInfo.allowMultipleValues) {
            // Add a blank option
            options.push({
                key: null,
                text: ""
            });
        }

        // Parse the terms
        for (let i = 0; i < terms.length; i++) {
            let item = terms[i];

            // Add the option
            options.push({
                data: item.name,
                key: item.id,
                text: item.path
            });
        }

        // Return the options
        return options;
    }
}