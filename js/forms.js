"use strict";

function addField(event) {
    var cloneable = $(event.target.closest(".cloneable"));
    var clone = cloneable.clone(true);
    clone.find("input").val("");
    clone.find("select").val("");
    cloneable.after(clone);
    clone.find(".remove").show();
}

function removeField(event) {
    var cloneable = $(event.target.closest(".cloneable"));
    cloneable.remove();
}

/**
 *  Handles the click of the "Erstellen" button in the Entity Modal Form
 */
function addEditEntity() {
    var form = $("#entity-form");
    var attributes = [];

    form.find(".cloneable").each(function () {
        attributes.push({
            propertyName: $(this).find("#attributeName"),
            propertyType: $(this).find("#attributeType")
        });
    });

    var entityData = {
        entityName: form.find("#entityName").val(),
        properties: attributes
    };

    if (id === "") {
        moodler.addEntity(entityData, form.find("#entityX"), form.find("#entityY"));
    }
    else
        moodler.editEntity(id, entityData);
}

function showEntityModal(x, y, entityId) {

    if (typeof entityId === "undefined") {
        var entity = moodler.getEntityData(id);
        var modal = $("#entity-modal");

        form.find("#entityName").val(entity.entityName);

        $.each(entity.properties,function(prop){
            var propertyLine =modal.find(".cloneable:last-of-type");
            propertyLine.find("#attributeName").val(prop.propertyName);
            propertyLine.find("#attributeType").val(prop.propertyType);
            propertyLine.find(".add").click()
        });
        modal.find(".cloneable:last-of-type").remove();
        modal.modal();
    }
}

/**
 * Created by paavum on 17.05.17.
 */

/**
 * Created by paavum on 17.05.17.
 */
