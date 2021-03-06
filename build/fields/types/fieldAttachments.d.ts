/// <reference types="react" />
import { Types } from "gd-sprest";
/**
 * Attachment File
 */
export interface IAttachmentFile {
    data?: any;
    ext: string;
    name: string;
    url?: string;
}
/**
 * Attachments Field Properties
 */
export interface IFieldAttachmentsProps {
    /** The class name. */
    className?: string;
    /** The field control mode. */
    controlMode?: number;
    /** The item id. */
    itemId?: number;
    /** The list name. */
    listName: string;
    /** The existing attachment files. */
    files?: any | Types.SP.IAttachmentFiles;
    /** The attachments render event. */
    onAttachmentsRender?: (attachments: JSX.Element) => any;
    /** The attachment file added event. */
    onFileAdded?: (file: IAttachmentFile) => any;
    /** The click event for the file link. */
    onFileClick?: (file: IAttachmentFile) => void;
    /** The attachment file render event. */
    onFileRender?: (file: IAttachmentFile) => any;
    /** The on form render event. */
    onRender?: (files: Array<IAttachmentFile>) => any;
    /** The relative web url containing the list. */
    webUrl?: string;
}
/**
 * Attachments Field State
 */
export interface IFieldAttachmentsState {
    /** Error Message */
    errorMessage?: string;
    /** The attachment files */
    files: {
        Delete: Array<IAttachmentFile>;
        New: Array<IAttachmentFile>;
        Existing: Array<IAttachmentFile>;
    };
    /** The list information */
    listInfo: Types.Helper.IListFormResult;
    /** Loading Flag */
    loadingFl?: boolean;
}
/**
 * Attachments Field
 */
export interface IFieldAttachment {
    /**
     * Refreshes the item attachments.
     */
    refresh: () => PromiseLike<void>;
    /**
     * Saves the item attachments.
    */
    save: () => PromiseLike<void>;
    /**
     * Displays the file upload dialog.
     */
    showFileDialog: () => void;
}
