"use strict";

var $go = go.GraphObject.make;
var diagram;

var Moodler = {
    moodler_init: function (moodlerDiv) {
        diagram = $go(go.Diagram, moodlerDiv, {
            initialContentAlignment: go.Spot.Center, // center Diagram contents
            "undoManager.isEnabled": true // enable Ctrl-Z to undo and Ctrl-Y to redo
        });
        diagram.model = new go.GraphLinksModel();
        setupTemplates()
    },

    /**
     * Adds an Entity to the diagram in the x,y coordinates specified. entityData contains its name and properties.
     * @param entityData data of the entity to be modeled
     * @param x abscissa of the point where the entity is to be added to the diagram
     * @param y ordinate of the point where the entity is to be added to the diagram
     */
    addEntity: function (entityData, x, y) {
        if (diagram.model.findNodeDataForKey(entityData.name) !== null)
            throw new Error("An Entity with this name already exists");

        diagram.startTransaction("Add Entity " + entityData.name);
        diagram.model.addNodeData({
            key: entityData.name,
            location: new go.Point(x, y),
            entityName: entityData.name,
            properties: entityData.properties,
            category: "entity"
        });
        diagram.commitTransaction("Add Entity " + entityData.name);
    },


    /**
     * Adds a relationship between two entities
     * @param linkData data of the relationship
     * @param x abscissa of the point where the diamond is to be added to the diagram
     * @param y ordinate of the point where the diamond is to be added to the diagram
     */
    addRelationship: function (linkData, x, y) {

        var relName = "R_" + linkData.name;
        if (diagram.model.findNodeDataForKey(relName) !== null)
            throw new Error("An Relationship with this name already exists");

        diagram.startTransaction("Add Relationship " + relName);

        //Adding Diamond
        diagram.model.addNodeData({
            key: relName,
            location: new go.Point(x, y),
            relationshipName: linkData.name,
            category: "relationshipDiamond"
        });

        //Adding Source Link
        diagram.model.addLinkData({
            key: linkData.name + "_Source",
            from: linkData.source.data.entityName,
            to: relName,
            role: linkData.sourceRole,
            multiplicity: linkData.sourceMultiplicity,
            category: "relationshipLine"
        });

        //Adding Target Link
        diagram.model.addLinkData({
            key: linkData.name + "_Target",
            from: relName,
            to: linkData.target.data.entityName,
            role: linkData.targetRole,
            multiplicity: linkData.targetMultiplicity,
            category: "relationshipLine"
        });

        diagram.commitTransaction("Add Relationship " + relName);
    },

    addGeneralizationSpecialization: function (parentEntity, targetEntities) {

    }


};
