"use strict";
window.formHandler = {

    init: function () {
        $(".add").click(formHandler.addField);
        $(".remove").click(formHandler.removeField);

        $("#menu").find("img").on("dragstart", function (event) {
            formHandler.dragStartHandler(event)
        });

        $("#moodler").on("dragover", function (event) {
            event.preventDefault();
        })
            .on("drop", function (ev) {
                ev.preventDefault();
                formHandler.dropHandler(ev);
            });

        $("#entity-modal").find(".btn.btn-primary").click(function () {
            formHandler.addEditEntity();
        });

        $("#relationship-modal").find(".btn.btn-primary").click(function () {
            formHandler.addEditRelationship();
        });

        $("#inheritance-modal").find(".btn.btn-primary").click(function () {
            formHandler.addEditGeneralizationSpecialization();
        });


        $("#save").click(formHandler.save);
        $("#export").click(formHandler.saveImage);
        $("#load").click(formHandler.loadFile);
        $("#loadFile").change(formHandler.load);

        formHandler.setupDropdowns();

    },

    addField: function () {
        var cloneable = $(this).closest(".cloneable");
        var clone = cloneable.clone(true);
        clone.find("input").val("");
        clone.find("select").val("");
        cloneable.after(clone);
        var removeBtn = clone.find(".remove");
        removeBtn.removeClass("hidden");

    },

    removeField: function () {
        if (!$(this).hasClass("hidden")) {
            var cloneable = $(this).closest(".cloneable");
            cloneable.remove();
        }
    },

    /**
     *  Handles the click of the "Erstellen" button in the Entity Modal Form
     */
    addEditEntity: function () {
        var modal = $("#entity-modal");
        if (!modal.find("form")[0].checkValidity())
            return;

        var id = $("#entityId").val();
        var x = $("#entityX").val();
        var y = $("#entityY").val();


        var attributes = [];

        modal.find(".cloneable").each(function () {
            attributes.push({
                propertyName: $(this).find("#attributeName").val(),
                propertyType: $(this).find("#attributeType").val()
            });
        });

        var data = {
            entityName: modal.find("#entityName").val(),
            properties: attributes
        };

        if (id !== "")
            moodler.deleteEntity(id);

        moodler.addEntity(data, x, y);
        modal.modal('hide');
    },

    addEditRelationship: function () {
        var modal = $("#relationship-modal");
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
        modal.modal('hide');
    },

    addEditGeneralizationSpecialization: function () {
        var modal = $("#inheritance-modal");
        var id = $("#inheritanceId").val();
        var x = $("#inheritanceX").val();
        var y = $("#inheritanceY").val();

        var data = {
            parent: $("#parent")[0].selectize.getValue(),
            children: $("#children")[0].selectize.getValue(),
            isPartial: $("#isPartial").val(),
            isDisjoint: $("#isDisjoint").val()
        };

        if (id !== "")
            moodler.deleteGeneralizationSpecialization(id);

        moodler.addGeneralizationSpecialization(data, x, y);
        modal.modal('hide');
    },

    showEntityModal: function (x, y, entityId) {

        var modal = $("#entity-modal");
        modal.find("form")[0].reset();
        modal.find(".remove").click();

        modal.find("#entityX").val(x);
        modal.find("#entityY").val(y);

        if (typeof entityId !== "undefined") {
            var entity = moodler.getEntityData(entityId);
            modal.find("#entityName").val(entity.entityName);
            modal.find("#entityId").val(entityId);

            for (var i = 0; i < entity.properties.length; i++) {
                var prop = entity.properties[i];
                var propertyLine = modal.find(".cloneable:last-of-type");
                propertyLine.find("#attributeName").val(prop.propertyName);
                propertyLine.find("#attributeType").val(prop.propertyType);
                propertyLine.find(".add").click()

            }

            modal.find(".cloneable:last-of-type").find(".remove").click();
        }

        modal.modal();

    },

    showRelForm: function (x, y, relId) {
        var modal = $("#relationship-modal");
        modal.find("form")[0].reset();
        $("#relationshipX").val(x);
        $("#relationshipY").val(y);

        var options = [];
        var entities = moodler.getEntityList();


        if (typeof relId !== "undefined") {
            var data = moodler.getRelationshipData(relId);
            $("#relationshipId").val(relId);
            $("#relationshipName").val(data.relationshipName);
            $("#entity1").val(data.source);
            $("#role1").val(data.sourceRole);
            $("#cardinality1").val(data.sourceMultiplicity);
            $("#entity2").val(data.target);
            $("#role2").val(data.targetRole);
            $("#cardinality2").val(data.targetMultiplicity);
        }
        modal.modal();
    },

    showInheritanceForm: function (x, y, id) {
        var modal = $("#inheritance-modal");
        modal.find("form")[0].reset();
        $("#inheritanceX").val(x);
        $("#inheritanceY").val(y);

        if (typeof id !== "undefined") {
            var data = moodler.getGeneralizationSpecializationData(id);
            $("#inheritanceId").val(id);
            $("#parent").val(data.parent);
            $("#children").val(data.children);

            if (data.isPartial)
                $("#isPartial").prop("checked", true);

            if (data.isDisjoint)
                $("#isDisjoint").prop("checked", true);

        }
        modal.modal()
    },

    save: function () {
        alert("Die Datei wird Herunterladen. Bitte stellen Sie sicher, dass der Download in Ihnen Browser ist erlaubt.");
        var json = moodler.toJSON();
        var date = new Date();
        var fileName = date.getDate() + "." + date.getMonth() + "_" + date.getHours() + "." + date.getMinutes() + " - Moodler.json";
        var blob = new Blob([json], {type: "text/plain;charset=utf-8"});
        saveAs(blob, fileName);


    },

    saveImage: function () {
        var fileType = "png";
        var anchor = $("#export");
        //return this.__download(anchor, data, fileType);
        var  filename = "FMMLxStudio - "+new Date().toISOString()+"."+fileType;
        anchor.prop("href", data);
        anchor.prop("download", filename);
    },

    load: function () {
        var field = $("#loadFile");
        if (field.val() !== "") {
            var file = field[0].files[0];
            var reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function (event) {
                moodler.fromJSON(event.target.result);
            };
            field.val("");
        }
    }
    ,

    loadFile: function () {
        $("#loadFile").click();
    }
    ,

    dragStartHandler: function (event) {
        event.originalEvent.dataTransfer.setData("shape", event.target.id)
    }
    ,

    /**
     * handles dropping of menu items into the main div
     * @param event
     */
    dropHandler: function (event) {
        var shape = event.originalEvent.dataTransfer.getData("shape");
        // Dragging onto a Diagram
        var can = event.originalEvent.target;
        var pixelratio = window.PIXELRATIO;

        // if the target is not the canvas, we may have trouble, so just quit:
        if (!(can instanceof HTMLCanvasElement)) return;

        var bbox = can.getBoundingClientRect();
        var bbw = Math.max(0.001, bbox.width);
        var bbh = Math.max(0.001, bbox.height);
        if (bbh === 0) bbh = 0.001;
        var mx = event.clientX - bbox.left * ((can.width / pixelratio) / bbw);
        var my = event.clientY - bbox.top * ((can.height / pixelratio) / bbh);

        switch (shape) {
            case "entity":
                formHandler.showEntityModal(mx, my);
                break;
            case "relationship":
                formHandler.showRelForm(mx, my);
                break;

            case "inheritance":
                formHandler.showInheritanceForm(mx, my);
                break;
        }
    }
    ,

    setupDropdowns: function () {

        var singleValue = {
            valueField: 'key',
            labelField: 'entityName',
            searchField: 'entityName',
            create: false,
            load: function (query, callback) {
                var filtered = moodler.getEntityList(query);
                callback(filtered);
            }
        };

        var multiValue = singleValue;
        multiValue.plugins = ['remove_button'];


        $("#entity1").selectize(singleValue);

        $("#entity2").selectize(singleValue);

        $("#parent").selectize(singleValue);

        $("#children").selectize(multiValue);

    }

};
//# sourceURL=forms.js

/**
 * Created by paavum on 17.05.17.
 */
