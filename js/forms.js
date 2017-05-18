"use strict";

function addField() {
    var cloneable = $(this).closest(".cloneable");
    var clone = cloneable.clone(true);
    clone.find("input").val("");
    clone.find("select").val("");
    cloneable.after(clone);
    var removeBtn = clone.find(".remove");
    removeBtn.show();
    removeBtn.prop("disabled", false);
}

function removeField() {
    if ($(this).is(":visible")) {
        var cloneable = $(this).closest(".cloneable");
        cloneable.remove();
    }
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

function addEditRelationship() {
    var modal = $("#relationship-modal");
    modal.find("form")[0].reset();
    var id = modal.find("#relationshipId").val();
    var x = modal.find("#relationshipX").val();
    var y = modal.find("#relationshipY").val();

    var linkData = {
        name: modal.find("#relationshipName").val(),
        source: modal.find("#entity1").val(),
        sourceRole: modal.find("#role1").val(),
        sourceMultiplicity: modal.find("#cardinality1").val(),
        target: modal.find("#entity2").val(),
        targetRole: modal.find("#role2").val(),
        targetMultiplicity: modal.find("#cardinality2").val()
    };

    if (id !== "")
        moodler.deleteRelationship(id);

    moodler.addRelationship(linkData, x, y);
}

function showEntityModal(x, y, entityId) {

    var modal = $("#entity-modal");
    modal.find("form")[0].reset();
    modal.find("#entityX").val(x);
    modal.find("#entityY").val(y);

    if (typeof entityId !== "undefined") {
        var entity = moodler.getEntityData(id);
        modal.find("#entityName").val(entity.entityName);
        modal.find("#entityId").val(entityId);

        $.each(entity.properties, function (prop) {
            var propertyLine = modal.find(".cloneable:last-of-type");
            propertyLine.find("#attributeName").val(prop.propertyName);
            propertyLine.find("#attributeType").val(prop.propertyType);
            propertyLine.find(".add").click()
        });

        modal.find(".cloneable:last-of-type").find(".remove").click();
    }

    form.modal();

}

function showRelForm(x, y, relId) {

    var modal = $("#relationship-modal");
    modal.find("form")[0].reset();
    modal.find("#relationshipX").val(x);
    modal.find("#relationshipY").val(y);

    if (typeof relId !== "undefined") {
        var data = moodler.getRelationshipData(relId);
        modal.find("#relationshipId").val(relId);
        modal.find("#relationshipName").val(data.relationshipName);
        modal.find("#entity1").val(data.source);
        modal.find("#role1").val(data.sourceRole);
        modal.find("#cardinality1").val(data.sourceMultiplicity);
        modal.find("#entity2").val(data.target);
        modal.find("#role2").val(data.targetRole);
        modal.find("#cardinality2").val(data.targetMultiplicity);
    }
}


/**
 * Created by paavum on 17.05.17.
 */

/**
 * Created by paavum on 17.05.17.
 */
