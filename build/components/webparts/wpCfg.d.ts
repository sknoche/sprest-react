/// <reference types="react" />
import * as React from "react";
import { IWebPartCfg, IWebPartCfgProps, IWebPartCfgState } from "../../definitions";
/**
 * Web Part Configuration
 */
export declare abstract class WebPartConfigurationPanel<Props extends IWebPartCfgProps = IWebPartCfgProps, State extends IWebPartCfgState = IWebPartCfgState> extends React.Component<Props, State> {
    /**
     * Constructor
     */
    constructor(props: Props);
    /**
     * Global Variables
     */
    private _errorMessage;
    private _panel;
    /**
     * Required Methods
     */
    abstract onRenderContents: (cfg: IWebPartCfg) => JSX.Element;
    /**
     * Events
     */
    onRenderFooter: () => JSX.Element;
    onRenderHeader: () => JSX.Element;
    render(): JSX.Element;
    /**
     * Methods
     */
    protected saveConfiguration: (wpCfg: any) => void;
    private show;
    private updateWebPartContentElements;
    private updateConfigurationInElement;
}
