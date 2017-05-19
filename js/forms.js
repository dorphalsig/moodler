"use strict";
window.formHandler= {
    init: function(){
        $(".add").click(formHandler.addField);
        $(".remove").click(formHandler.removeField);

        $("#menu").find("img").on("dragstart",function(event){
            event.dataTransfer.setData("id", event.target.id)
        });

        $("#moodler").on("dragover",function (event) {
            event.preventDefault();
        });

        $("#moodler").on("drop",function (ev) {
            formHandler.dropHandler(ev);
        });

    },
    addField: function () {
        var cloneable = $(this).closest(".cloneable");
        var clone = cloneable.clone(true);
        clone.find("input").val("");
        clone.find("select").val("");
        cloneable.after(clone);
        var removeBtn = clone.find(".remove");
        removeBtn.show();
        removeBtn.prop("disabled", false);
    },

    removeField: function () {
        if (window.$(this).is(":visible")) {
            var cloneable = $(this).closest(".cloneable");
            cloneable.remove();
        }
    },

    /**
     *  Handles the click of the "Erstellen" button in the Entity Modal Form
     */
    addEditEntity: function () {
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
    },

    addEditRelationship: function () {
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
    },

    showEntityModal: function (x, y, entityId) {

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

    },

    showRelForm: function (x, y, relId) {

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
    },

    /**
     * handles dropping of menu items into the main div
     * @param event
     */
    dropHandler: function (event) {
        var id = event.dataTransfer.getData("id");
        // Dragging onto a Diagram
        var can = event.target;
        var pixelratio = window.PIXELRATIO;

        // if the target is not the canvas, we may have trouble, so just quit:
        if (!(can instanceof HTMLCanvasElement)) return;

        var bbox = can.getBoundingClientRect();
        var bbw = Math.max(0.001, bbox.width);
        var bbh = Math.max(0.001, bbox.height);
        if (bbh === 0) bbh = 0.001;
        var mx = event.clientX - bbox.left * ((can.width / pixelratio) / bbw);
        var my = event.clientY - bbox.top * ((can.height / pixelratio) / bbh);

        switch (id) {
            case "entity":
                formHandler.showEntityModal(mx, my);
                break;
            case "relationship":
                formHandler.showRelForm(mx, my);
                break;

            case "inheritance":
                alert("Todo");
                break;
        }
    }
}

/**
 * Created by paavum on 17.05.17.
 */
