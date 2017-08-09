"use strict";

window.moodler = {

    _go: "",
    _diagram: "",


    /**
     * Init function, recieves an optional DIV Object
     * @param moodlerDiv
     */
    init: function (moodlerDiv) {
        if (typeof moodlerDiv === "undefined") {
            moodlerDiv = "moodlerDIV";
        }
        go.licenseKey = "54fe4ee3b01c28c702d95d76423d6cbc5cf07f21de8349a00a5042a3b95c6e172099bc2a01d68dc986ea5efa4e2dc8d8dc96397d914a0c3aee38d7d843eb81fdb53174b2440e128ca75420c691ae2ca2f87f23fb91e076a68f28d8f4b9a8c0985dbbf28741ca08b87b7d55370677ab19e2f98b7afd509e1a3f659db5eaeffa19fc6c25d49ff6478bee5977c1bbf2a3";
        this._go = go.GraphObject.make;
        this._diagram = this._go(go.Diagram, moodlerDiv, {
            //initialContentAlignment: go.Spot.Center, // center Diagram contents
            padding: new go.Margin(75, 5, 5, 5),
            "undoManager.isEnabled": true, // enable Ctrl-Z to undo and Ctrl-Y to redo
            model: new go.GraphLinksModel()
        });
        window.PIXELRATIO = this._diagram.computePixelRatio();
        setupTemplates(this._go, this._diagram);
    },

    /**
     * Adds an Entity to the diagram in the x,y coordinates specified.
     * @entityData contains its name and properties.
     * @param x abscissa of the point where the entity is to be added to the diagram
     * @param y ordinate of the point where the entity is to be added to the diagram
     */
    addEntity: function (entityData, x, y) {

        this._diagram.startTransaction("Add Entity " + entityData.name);
        this._diagram.model.addNodeData({
            key: entityData.entityName,
            entityName: entityData.entityName,
            location: new go.Point(parseFloat(x), parseFloat(y)),
            properties: entityData.properties,
            category: "entity"
        });
        this._diagram.commitTransaction("Add Entity " + name);
    },

    /**
     * Retrieves a list of all Entities in the current model
     * @filters array of ids to be excluded from the list, if the array is empty or filter is not set, no filtering will be done
     */
    getEntityList: function (filters) {
        return this._diagram.model.nodeDataArray.filter(function (nodeData) {
            var retVal = nodeData.category === "entity";
            if (typeof  filters !== "undefined" && Array.isArray(filters))
                retVal = retVal && (filters.indexOf(nodeData.key) === -1);
            return retVal;
        })
    },


    /**
     * Retrieves the data of a specified entity
     * @param id
     * @return Entity
     */
    getEntityData: function (id) {
        return this._diagram.model.findNodeDataForKey(id);
    },

    deleteEntity: function (id) {
        this._deleteNode(id);
    },

    _deleteNode: function (id) {
        this._diagram.startTransaction("Remove node " + id);
        this._diagram.removeNodeData(this._diagram.model.findNodeDataForKey(id));
        this._diagram.commitTransaction("Remove node " + id);
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
        if (this._diagram.model.findNodeDataForKey(relName) !== null)
            throw new Error("An Relationship with this name already exists");

        this._diagram.startTransaction("Add Relationship " + relName);

        //Adding Diamond
        this._diagram.model.addNodeData({
            key: relName,
            location: new go.Point(parseFloat(x), parseFloat(y)),
            relationshipName: linkData.name,
            category: "relationshipDiamond"
        });

        //Adding Source Link
        this._diagram.model.addLinkData({
            from: linkData.source,
            to: relName,
            role: linkData.sourceRole,
            multiplicity: linkData.sourceMultiplicity,
            category: "relationshipLine"
        });

        //Adding Target Link
        this._diagram.model.addLinkData({
            from: linkData.target,
            to: relName,
            role: linkData.targetRole,
            multiplicity: linkData.targetMultiplicity,
            category: "relationshipLine"
        });

        this._diagram.commitTransaction("Add Relationship " + relName);
    },

    getRelationshipData: function (id) {
        var node = this._diagram.findNodeForKey(id);
        var data = node.data;
        var links = node.findLinksConnected();
        for (var i = 0; i < 2; i++) {
            var link = links[i].data;
            if (i === 0) {
                data.source = link.from;
                data.sourceMultiplicity = link.multiplicity;
                data.sourceRole = link.role;
            }
            else {
                data.target = link.from;
                data.targetMultiplicity = link.multiplicity;
                data.targetRole = link.role;
            }
        }
        return data;
    },

    deleteRelationship: function (id) {
        this._deleteNode(id);
    },

    /**
     * Adds a Gen-Spec Relatonship between two or more entities
     * @param gsData data of the GS Relationship. it is an Object with the following properties
     *              parent: <-- id of the parent Entity
     *              children:  <--Array of child Entity node ids
     *              isPartial: boolean,
     *              isDisjoint: boolean
     *
     * @param x abscissa of the point where the circle is to be added to the diagram
     * @param y ordinate of the point where the circle is to be added to the diagram
     */
    addGeneralizationSpecialization: function (gsData, x, y) {

        var relName = "GS_" + gsData.parent;

        if (this._diagram.model.findNodeDataForKey(relName) !== null)
            throw new Error("A Gen/Spec for the parent already exists.");

        this._diagram.startTransaction("Add Gen/Spec " + relName);

        //adding Circle
        this._diagram.model.addNodeData({
            key: relName,
            location: new go.Point(parseFloat(x), parseFloat(y)),
            exclusiveness: gsData.isDisjoint ? "d" : "o",
            category: "generalizationSpecializationCircle"
        });

        //adding gneralization line
        this._diagram.model.addLinkData({
            from: gsData.parent,
            to: relName,
            category: gsData.isPartial ? "partialGeneralizationLine" : "totalGeneralizationLine"
        });

        // add target lines
        for (var i = 0; i < gsData.children.length; i++) {
            var child = gsData.children[i];
            this._diagram.model.addLinkData({
                from: child,
                to: relName,
                category: "specializationLine"
            });

        }
        this._diagram.commitTransaction("Add Gen/Spec " + relName);
    },

    getGeneralizationSpecializationData: function (id) {
        var node = this._diagram.findNodeForKey(id);
        var data = node.data;
        var links = node.findLinksConnected();
        var subTypes = [];

        for (var i = 0; i < links.length; i++) {
            var linkData = links[i].data;
            if (linkData.category === "specializationLine")
                subTypes.push(linkData);
            else
                data.parent = linkData;
        }

        return data;
    },

    deleteGeneralizationSpecialization: function (id) {
        this._deleteNode(id);
    },

    toJSON: function () {
        var json = this._diagram.model.toJSON();
        return json;
    },

    fromJSON: function (jsonData) {
        this._diagram.model = go.Model.fromJson(jsonData);
    },

    toPNG: function () {
        var png = this._diagram.makeImageData({
            scale: 1
        });

        return png.substr(22);
    }
}
;
//# sourceURL=moodler.js