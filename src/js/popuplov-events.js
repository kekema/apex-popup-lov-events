window.lib4x = window.lib4x || {};
window.lib4x.axt = window.lib4x.axt || {};
window.lib4x.axt.popupLov = window.lib4x.axt.popupLov || {};

/*
 * LIB4X - Popup LOV Events
 * Supports Popup LOV Open and Close events as can be used in Dynamic Actions.
 * The events can be used for both 'Modal Dialog' and 'Inline Popup'.
 * The open event typically can be used for things like:
 * - setting P0 items which are used in a Shared Component LOV query
 * - setting specific dialog options, eg setting the dialog height to 85% of the browser inner height
 * The close event will enable to check if the dialog was cancelled.
 * The open/close event object will have references to the model and the grid- or listview.
 */
lib4x.axt.popupLov.events = (function($)
{
    let popupLovModule = (function() {
        function getItemIdFromDialogId(dialogId)
        {
            let itemId = null;
            if (dialogId && dialogId.startsWith('PopupLov_') && dialogId.endsWith('_dlg'))
            {
                // example id: PopupLov_22_P22_DESTINATION_dlg
                // get part after second underscore and remove '_dlg'
                let index = dialogId.indexOf('_', dialogId.indexOf('_') + 1);
                if (index != -1)
                {
                    itemId = dialogId.substr(index + 1).replace('_dlg','');
                }
            }
            return itemId;
        }

        // popup lov dialog/popup events       
        $(function() {
            // use getTopApex() as lov popups from modal dialog pages are instantiated in top window document
            let topApex = apex.util.getTopApex();
            let pageNr = $("#pFlowStepId").val(); 
            let dialogSelector = '[id^="PopupLov_' + pageNr + '_"].a-PopupLOV-dialog';
            topApex.jQuery(topApex.gPageContext$).on('dialogopen dialogclose popupopen popupclose', dialogSelector, function(jQueryEvent, data) { 
                let itemId = getItemIdFromDialogId(jQueryEvent.target.id);
                if (itemId)
                {
                    let apexItem$ = $('#' + itemId);
                    let eventName = jQueryEvent.type;
                    let eventObj = {};
                    eventObj.jQueryEvent = jQueryEvent;
                    eventObj.itemId = itemId;
                    eventObj.eventName = eventName;
                    // include reference to the model behind the LOV grid/list
                    let modelName = apexItem$.data('popupLovModelName');
                    if (modelName)
                    {
                        let model = apex.model.get(modelName);
                        if (model)
                        {
                            eventObj.model = model;
                            apex.model.release(modelName);
                        }
                    }   
                    // include reference to the grid- or listview
                    let popupLovResults$ = $(jQueryEvent.target).find('.a-PopupLOV-results');
                    if (popupLovResults$.data('apexGrid'))
                    {
                        eventObj.display = 'grid';
                        eventObj.gridView$ = popupLovResults$;
                        // eventObj.gridView$.grid('<method>')
                    }
                    else if (popupLovResults$.data('apexTableModelView'))
                    {
                        eventObj.display = 'list';
                        eventObj.listView$ = popupLovResults$;
                        // eventObj.listView$.tableModelView('<method>')
                        // getIconList available after the popup is fully created
                        // eventObj.listView$.tableModelView('getIconList')                        
                    }
                    // for convenience, also include the view instance
                    let viewInstance = popupLovResults$.data('apexTableModelView') || 
                                       popupLovResults$.data('apexGrid');
                    if (viewInstance)
                    {
                        eventObj.viewInstance = viewInstance;
                    }
                    if (eventName == 'dialogopen' || eventName == 'popupopen')
                    {
                        // developer can set any dialog options as per https://api.jqueryui.com/dialog/
                        eventObj.dialogOptions = null;   
                        apex.event.trigger(apexItem$, 'lib4x_popuplov_open', eventObj);                                 
                        if (eventObj.dialogOptions)
                        {
                            if (eventName.includes('dialog'))
                            {
                                topApex.jQuery(jQueryEvent.target).dialog('option', eventObj.dialogOptions);
                            }
                            else if (eventName.includes('popup'))
                            {
                                topApex.jQuery(jQueryEvent.target).popup('option', eventObj.dialogOptions);
                            }
                        }                     
                    }
                    else if (eventName == 'dialogclose' || eventName == 'popupclose')
                    {
                        eventObj.cancelled = jQueryEvent.which ? true : false;
                        if (eventObj.viewInstance?.getSelectedValues)
                        {
                            eventObj.selectedValues = eventObj.viewInstance.getSelectedValues();
                        }
                        if (eventObj.viewInstance?.getSelectedRecords)
                        {
                            eventObj.selectedRecords = eventObj.viewInstance.getSelectedRecords();
                        }
                        apex.event.trigger(apexItem$, 'lib4x_popuplov_close', eventObj); 
                    }
                }                             
            });
        });
    })(); 

    let init = function()
    {
        // any future init logic
    }

    return{
        init: init
    }

})(apex.jQuery);  

