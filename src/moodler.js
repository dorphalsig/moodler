/**
 * Created by paavum on 27.04.17.
 */
class moodler {

    constructor(hostDiv) {
        this.this._go = go.GraphObject.make;
        this._diagram = $(go.Diagram, hostDiv, {
            initialContentAlignment: go.Spot.Center, // center Diagram contents
            "undoManager.isEnabled": true // enable Ctrl-Z to undo and Ctrl-Y to redo
        });
    }

    /**
     * Creates a library of template shapes to be used in the diagrams. Namely the Entity shape and the different \\
     * components of the links
     * @private
     */
    _setupTemplates() {

        let template_entity = this._go(go.Node, new go.Binding("location", "location", go.Point.parse), go.Panel.Vertical,
            this._go(go.Panel, "Auto",
                {stretch: go.GraphObject.Fill},
                this._go(go.Shape, "Rectangle", {fill: "white"}),
                this._go(go.TextBlock, new go.Binding("text", "entityName"), {margin: 5})
            ),
            this._go(go.Panel, "Auto",
                {stretch: go.GraphObject.Fill},
                this._go(go.Shape, "Rectangle", {fill: "white"}),
                this._go(go.Panel, "Vertical", {margin: 4, defaultAlignment: go.Spot.Left},
                    new go.Binding("itemArray", "properties"),
                    {
                        itemTemplate: this._go(go.Panel, "Horizontal", {margin: 0.5},
                            this._go(go.TextBlock, new go.Binding("text", "propertyName")),
                            this._go(go.TextBlock, " : "),
                            this._go(go.TextBlock, new go.Binding("text", "propertyType")),
                            // end of itemTemplate
                        )
                    })
            )
        );

        let template_relationshipDiamond = this._go(go.Node, go.Panel.Auto, new go.Binding("location", "location"),
            this._go(go.Shape, "Diamond", {fill: "white", margin: 2, minSize: new go.Size(20, 20)}),
            this._go(go.TextBlock, {margin: 2}, new go.Binding("text", "relationshipName"))
        );

        let template_generalizationSpecializationCircle = this._go(go.Node, go.Panel.Auto, new go.Binding("location", "location"),
            this._go(go.Shape, "Circle", {fill: "white", margin: 2, minSize: new go.Size(20, 20)}),
            this._go(go.TextBlock, {margin: 2}, new go.Binding("text", "relationshipName"))
        );

        let template_relationshipLine = this._go(go.Link,
            {routing: go.Link.AvoidsNodes, curve: go.Link.JumpGap},
            this._go(go.Shape),
            this._go(go.TextBlock, new go.Binding("text", "role"), {
                segmentIndex: 0,
                segmentOffset: new go.Point(NaN, NaN)
            }),
            this._go(go.TextBlock, new go.Binding("text", "multiplicity"), {
                segmentIndex: -1,
                segmentOffset: new go.Point(NaN, NaN)
            }),
        );

        let template_specializationLine = this._go(go.Link,
            {routing: go.Link.AvoidsNodes, curve: go.Link.JumpGap},
            this._go(go.Shape),
            this._go(go.Shape, {
                toArrow: "ForwardSemiCircle",
                fill: null,
                scale: 2,
                segmentIndex: 1,
                segmentFraction: 0.5
            })
        );


        let template_totalGeneralizationLine = this._go(go.Link,
            {routing: go.Link.AvoidsNodes, curve: go.Link.JumpGap, reshapable: true},
            $(go.Shape, {
                stroke: "transparent", fill: "transparent", pathPattern: this._go(go.Shape,
                    {
                        geometryString: "M0 0 L1 0 M0 3 L1 3",
                        fill: "transparent",
                        stroke: "black",
                        strokeWidth: 1,
                        strokeCap: "square"
                    })
            }));

        let template_partialGeneralizationLine = this._go(go.Link,
            {routing: go.Link.AvoidsNodes, curve: go.Link.JumpGap, reshapable: true},
            $(go.Shape)
        );


        this._diagram.nodeTemplateMap.add("template_entity", template_entity);
        this._diagram.nodeTemplateMap.add("template_relationshipDiamond", template_relationshipDiamond);
        this._diagram.nodeTemplateMap.add("template_generalizationSpecializationCircle", template_generalizationSpecializationCircle);
        this._diagram.nodeTemplateMap.add("", this._diagram.nodeTemplate);

        this._diagram.linkTemplateMap.add("template_relationshipLine", template_relationshipLine);
        this._diagram.linkTemplateMap.add("template_specializationLine", template_specializationLine);
        this._diagram.linkTemplateMap.add("template_totalGeneralizationLine", template_totalGeneralizationLine);
        this._diagram.linkTemplateMap.add("template_partialGeneralizationLine", template_partialGeneralizationLine);
        this._diagram.linkTemplateMap.add("", this._diagram.linkTemplate);
    }

    /**
     * Adds an Entity to the diagram in the x,y coordinates specified. entityData contains its name and properties.
     * @param entity
     */
    addEntity(entity) {
        moodler.startTransaction("Add Entity" + entity.name);
        moodler.model.addNodeData({key: entity.name, entityName: entity.name, properties: entity.properties});
        moodler.commitTransaction("make new node");
    }

}




