/// <reference types="react" />
import { Types } from "gd-sprest";
import { IAttachmentFile, IBaseFieldInfo } from ".";
/**
 * Field Information
 */
export interface IItemFormField {
    /** The form control mode. */
    controlMode?: number | Types.SPTypes.ControlMode;
    /** The internal field name. */
    name: string;
    /** The on change event */
    onChange?: (value: any) => void;
    /** The on render method */
    onRender?: (fieldInfo: IBaseFieldInfo) => JSX.Element;
}
/**
 * Properties
 */
export interface IItemFormProps {
    /** The class name to apply to the item form element. */
    className?: string;
    /** The form control mode. */
    controlMode?: number | Types.SPTypes.ControlMode;
    /** The form fields to exclude from the form. */
    excludeFields?: Array<string>;
    /** The form fields. */
    fields?: Array<IItemFormField>;
    /** The existing item. */
    item?: any;
    /** The list display name. */
    listName: string;
    /** The attachment added event. */
    onAttachmentAdded?: (file: IAttachmentFile) => void;
    /** The click event for the attachment. */
    onAttachmentClick?: (file: IAttachmentFile, controlMode: Types.SPTypes.ControlMode) => void;
    /** The render event for the attachment. */
    onAttachmentRender?: (file: IAttachmentFile, controlMode: Types.SPTypes.ControlMode) => void;
    /** The on form render event. */
    onRender?: (controlMode: Types.SPTypes.ControlMode) => any;
    /** The on form render attachments event. */
    onRenderAttachments?: (files: Array<IAttachmentFile>, controlMode: Types.SPTypes.ControlMode) => any;
    /** The item query, used when refreshing the item after a save. */
    query?: Types.ODataQuery;
    /** Flag to display the attachments. */
    showAttachments?: boolean;
    /** The relative web url containing the list. */
    webUrl?: string;
}
/**
 * State
 */
export interface IItemFormState {
    /** The form fields. */
    fields?: Array<IItemFormField>;
    /** The existing item. */
    item?: any;
    /** The list. */
    list?: Types.IListResult;
    /** The refresh flag. */
    refreshFl?: boolean;
    /** The save flag. */
    saveFl?: boolean;
}
