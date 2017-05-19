"use strict";

window.moodler = {

    /**
     * Init function, recieves an optional DIV Object
     * @param moodlerDiv
     */
    init: function (moodlerDiv) {
        if (typeof moodlerDiv === "undefined") {
            moodlerDiv = "moodlerDIV";
        }
        go.licenseKey = "54fe4ee3b01c28c702d95d76423d6cbc5cf07f21de8349a00a5042a3b95c6e172099bc2a01d68dc986ea5efa4e2dc8d8dc96397d914a0c3aee38d7d843eb81fdb53174b2440e128ca75420c691ae2ca2f87f23fb91e076a68f28d8f4b9a8c0985dbbf28741ca08b87b7d55370677ab19e2f98b7afd509e1a3f659db5eaeffa19fc6c25d49ff6478bee5977c1bbf2a3";
        var $go = go.GraphObject.make;
        var diagram = $go(go.Diagram, moodlerDiv, {
            //initialContentAlignment: go.Spot.Center, // center Diagram contents
            padding: new go.Margin(75, 5, 5, 5),
            "undoManager.isEnabled": true // enable Ctrl-Z to undo and Ctrl-Y to redo
        });
        diagram.model = new go.GraphLinksModel();
        window.PIXELRATIO = diagram.computePixelRatio();
        setupTemplates($go,diagram);
    },

    /**
     * Adds an Entity to the diagram in the x,y coordinates specified.
     * @entityData contains its name and properties.
     * @param x abscissa of the point where the entity is to be added to the diagram
     * @param y ordinate of the point where the entity is to be added to the diagram
     */
    addEntity: function (entityData, x, y) {
        var name = "E-" + Math.round(Math.random() * 100);
        diagram.startTransaction("Add Entity " + name);
        diagram.model.addNodeData({
            key: name,
            location: new go.Point(x, y),
            category: "entity"
        });
        diagram.commitTransaction("Add Entity " + name);
        moodler.editEntity(name, entityData);
    },

    /**
     * Retrieves a list of all Entities in the current model
     */
    getEntityList: function () {
        diagram.model.nodeDataArray.filter(function (nodeData) {
            return nodeData.category === "entity"
        })
    },


    /**
     * Retrieves the data of a specified entity
     * @param id
     * @return Entity
     */
    getEntityData: function(id){
      return diagram.model.findNodeDataForKey(id);
    },

    editEntity: function (id, entityData) {
        var node = diagram.model.findNodeDataForKey(id);

        if (node === null)
            throw new Error("Canot edit non-existent node " + id);

        if (diagram.model.findNodeDataForKey(entityData.name) !== null)
            throw new Error("An Entity with this name already exists");

        var initialNodeName = node.key;
        diagram.startTransaction("Editing node " + initialNodeName);
        diagram.model.setKeyForNodeData(node, entityData.name);
        diagram.model.setDataProperty(node, "entityName", entityData.name);
        diagram.model.setDataProperty(node, "properties", entityData.properties);
        diagram.commitTransaction("Editing node " + initialNodeName);
    },

    /**
     * Adds a relationship between two entities
     *
     * @param linkData data of the relationship. It is an obejct with the following properties:
     *      source: String <-- Id of the Source Entity
     *      target: String <-- Id of the Target Entity
     *      name: String
     *      sourceRole: String
     *      sourceMultiplicity: String
     *      targetRole: String
     *      targetMultiplicity: String
     *
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
            from: linkData.source,
            to: relName,
            role: linkData.sourceRole,
            multiplicity: linkData.sourceMultiplicity,
            category: "relationshipLine"
        });

        //Adding Target Link
        diagram.model.addLinkData({
            from: linkData.target,
            to: relName,
            role: linkData.targetRole,
            multiplicity: linkData.targetMultiplicity,
            category: "relationshipLine"
        });

        diagram.commitTransaction("Add Relationship " + relName);
    },

    getRelationshipData: function(id){
        var node = diagram.findNodeForKey(id);
        var data = node.data;
        var links = node.findLinksConnected();
        for(var i=0;i<2;i++){
            var link = links[i].data;
            if(i === 0){
                data.source = link.from;
                data.sourceMultiplicity = link.multiplicity;
                data.sourceRole = link.role;
            }
            else{
                data.target = link.from;
                data.targetMultiplicity = link.multiplicity;
                data.targetRole = link.role;
            }
        }
        return data;
    },

    deleteRelationship: function(id){
        diagram.removeNodeData(diagram.model.findNodeDataForKey(id));
    },

    /**
     * Adds a Gen-Spec Relatonship between two or more entities
     * @param gsData data of the GS Relationship. it is an Object with the following properties
     *              parent: go.Node <-- Node of the parent Entity
     *              children: go.Node[], <--Array of child Entity nodes
     *              isPartial: boolean,
     *              isDisjoint: boolean
     *
     * @param x abscissa of the point where the circle is to be added to the diagram
     * @param y ordinate of the point where the circle is to be added to the diagram
     */
    addGeneralizationSpecialization: function (gsData, x, y) {

        var relName = "GS_" + gsData.parent.data.name;
        if (diagram.model.findNodeDataForKey(relName) !== null)
            throw new Error("A Gen/Spec for the parent already exists.");

        diagram.startTransaction("Add Gen/Spec " + relName);

        //adding Circle
        diagram.model.addNodeData({
            key: relName,
            location: new go.Point(x, y),
            exclusiveness: gsData.isDisjoint ? "d" : "o",
            category: "generalizationSpecializationCircle"
        });

        //adding gneralization line
        diagram.model.addLinkData({
            key: relName + "_Gen",
            from: gsData.parent.data.entityName,
            to: relName,
            category: gsData.isPartial ? "partialGeneralizationLine" : "totalGeneralizationLine"
        });

        // add target lines
        for (var i = 0; i < gsData.children.length; i++) {
            var child = gsData.children[i];
            diagram.model.addLinkData({
                key: relName + "_Spe+" + child.data.entityName,
                from: child.data.entityName,
                to: relName,
                category: "specializationLine"
            });

        }
        diagram.commitTransaction("Add Gen/Spec " + relName);
    }


};
//#sourceURL=js/moodler/moodler.js