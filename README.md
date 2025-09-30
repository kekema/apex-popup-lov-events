# apex-popup-lov-events
Supports Popup LOV Open and Close events as can be used in Dynamic Actions.

See [this blog post](https://karelekema.hashnode.dev/oracle-apex-popup-lov-events-plugin) for a feature description.

To make the events available to a page, create a DA on Page Load and select the 'LIB4x - Popup LOV Events' action.

<img width="30%" height="30%" alt="image" src="https://github.com/user-attachments/assets/e1e37ace-9afb-4a65-87e8-3ae6460529f7" />

No further configurations are required.

Subsequently, you can create a DA for a Popup LOV item, selecting the 'Open' or 'Close' event:

<img width="25%" height="25%" alt="image" src="https://github.com/user-attachments/assets/42277262-6b6c-46ae-9cf2-b14dc10a0466" />

<img width="50%" height="50%" alt="image" src="https://github.com/user-attachments/assets/79a7a677-5086-412a-ac24-575d79b74346" />

When using a JavaScript action, the event object will be in this.data:

<img width="988" height="193" alt="image" src="https://github.com/user-attachments/assets/8a389e71-6e65-4116-9dbe-2693e2fc49db" />

The dialogOptions property can be used to set any (additional) [jQuery dialog options](https://api.jqueryui.com/dialog/).
Examples:

```
this.data.dialogOptions = {
    height: window.top.innerHeight * 0.75
};
```
```
this.data.dialogOptions = {
    position: {my: 'center', at: 'center', of: window}
};
```
For advanced scenario's, the event object also gives you references to the model, grid view (or list view), etc.

The 'Close' event gives you the next event object in this.data:

<img width="999" height="208" alt="image" src="https://github.com/user-attachments/assets/7d6772d9-3cb6-4cc5-a797-1a4669778762" />

<h3>Version History</h3>
v1.0.0 build on APEX 24.2
