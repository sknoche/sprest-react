# sprest-react
SharePoint field components using the Office Fabric-UI React Framework.

This project is referenced from this [blog post](http://dattabase.com/sharepoint-react-components/).

# Field Components
### Override Properties
Each component has a "props" property which is the base properties of the Office Fabric React component. For example the text field below can be overriden by doing the following:
```
<FieldText
    defaultValue={item.Title}
    listName={listName}
    name="Title"
    ref="Title"
    props={{
        // Text field properties go here
        // Reference the ITextFieldProps from the Office Fabric React framework
    }}
/>
```
Below is a list of fields and their properties
**Boolean**
onChange: (value: boolean) => void
props: ICheckboxProps

**Choice**
onChange: (Array<IDropdownOption>) => void
props: IDropdownProps

**Date/Time**
dtProps: IDatePickerProps
onChange: (value: Date) => void
timeProps: IDropdownProps

**Lookup**
getAllItemsFl: boolean
onChange: (value: IDropdownOption | Array<string | number>) => void
props: IDropdownProps

**Number**
onChange: (value: number) => void
props: ITextFieldProps
type: FieldNumberTypes

**Text**
onChange: (value:string) => void
props: ITextFieldProps

**Url**
descProps: ITextFieldProps
onChange: (value:Types.ComplexTypes.FieldUrlValue) => void
urlProps: ITextFieldProps

**User**
lblProps: ILabelProps
onChange: (value:Array<number>) => void
pickerProps: IPeoplePickerProps