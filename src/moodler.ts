import * as go from "../gojs/go";

class Property {
    propertyName: String;
    propertyType: String;
    constructor (name:String,type:String){
        this.propertyName  = name;
        this.propertyType = type;
    }
}

class EntityData {
    name: String;
    properties: Array<Property>;

    constructor (name:String, properties:Array<Property>){
        this.name = name;
        this.properties = properties;
    }
}

class LinKData{
    source: go.Node;
    target: go.Node;
    name: String;
    sourceRole: String;
    sourceMultiplicity: String;
    targetRole: String;
    targetMultiplicity: String;

    constructor (name:String, source: go.Node, sourceRole:String, sourceMultiplicity:String, target: go.Node, targetRole:String, targetMultiplicity:String){
        this.name = name;
        this.source = source;
        this.sourceRole=sourceRole;
        this.sourceMultiplicity=sourceMultiplicity;
        this.targetRole=targetRole;
        this.targetMultiplicity=targetMultiplicity;
        this.target = target;
    }
}

class Moodler {

    private go: any;
    private diagram: go.Diagram;


    constructor(moodlerDiv: HTMLDivElement) {
        this.go = go.GraphObject.make;
        this.diagram = this.go(go.Diagram, moodlerDiv, {
            initialContentAlignment: go.Spot.Center, // center Diagram contents
            "undoManager.isEnabled": true // enable Ctrl-Z to undo and Ctrl-Y to redo
        });
        this.diagram.model = new go.GraphLinksModel();
        this.setupTemplates()
    }

    /**
     * Creates a library of template shapes to be used in the diagrams. Namely the Entity shape and the different \\
     * components of the links
     * @private
     */
    private setupTemplates() {

        let template_entity = this.go(go.Node, new go.Binding("location", "location", go.Point.parse), go.Panel.Vertical,
            this.go(go.Panel, "Auto",
                {stretch: go.GraphObject.Fill},
                this.go(go.Shape, "Rectangle", {fill: "white"}),
                this.go(go.TextBlock, new go.Binding("text", "entityName"), {margin: 5})
            ),
            this.go(go.Panel, "Auto",
                {stretch: go.GraphObject.Fill},
                this.go(go.Shape, "Rectangle", {fill: "white"}),
                this.go(go.Panel, "Vertical", {margin: 4, defaultAlignment: go.Spot.Left},
                    new go.Binding("itemArray", "properties"),
                    {
                        itemTemplate: this.go(go.Panel, "Horizontal", {margin: 0.5},
                            this.go(go.TextBlock, new go.Binding("text", "propertyName")),
                            this.go(go.TextBlock, " : "),
                            this.go(go.TextBlock, new go.Binding("text", "propertyType")),
                            // end of itemTemplate
                        )
                    })
            )
        );

        let template_relationshipDiamond = this.go(go.Node, go.Panel.Auto, new go.Binding("location", "location"),
            this.go(go.Shape, "Diamond", {fill: "white", margin: 2, minSize: new go.Size(20, 20)}),
            this.go(go.TextBlock, {margin: 2}, new go.Binding("text", "relationshipName"))
        );

        let template_generalizationSpecializationCircle = this.go(go.Node, go.Panel.Auto, new go.Binding("location", "location"),
            this.go(go.Shape, "Circle", {fill: "white", margin: 2, minSize: new go.Size(20, 20)}),
            this.go(go.TextBlock, {margin: 2}, new go.Binding("text", "relationshipName"))
        );

        let template_relationshipLine = this.go(go.Link,
            {routing: go.Link.AvoidsNodes, curve: go.Link.JumpGap},
            this.go(go.Shape),
            this.go(go.TextBlock, new go.Binding("text", "role"), {
                segmentIndex: 0,
                segmentOffset: new go.Point(NaN, NaN)
            }),
            this.go(go.TextBlock, new go.Binding("text", "multiplicity"), {
                segmentIndex: -1,
                segmentOffset: new go.Point(NaN, NaN)
            }),
        );

        let template_specializationLine = this.go(go.Link,
            {routing: go.Link.AvoidsNodes, curve: go.Link.JumpGap, reshapable: true,canDelete: false},
            this.go(go.Shape),
            this.go(go.Shape, {
                toArrow: "ForwardSemiCircle",
                fill: null,
                scale: 2,
                segmentIndex: 1,
                segmentFraction: 0.5
            })
        );


        let template_totalGeneralizationLine = this.go(go.Link,
            {routing: go.Link.AvoidsNodes, curve: go.Link.JumpGap, reshapable: true},
            this.go(go.Shape, {
                stroke: "transparent", fill: "transparent",
                pathPattern: this.go(go.Shape,
                    {
                        geometryString: "M0 0 L1 0 M0 3 L1 3",
                        fill: "transparent",
                        stroke: "black",
                        strokeWidth: 1,
                        strokeCap: "square"
                    })
            }));

        let template_partialGeneralizationLine = this.go(go.Link,
            {routing: go.Link.AvoidsNodes, curve: go.Link.JumpGap, reshapable: true},
            this.go(go.Shape)
        );


        this.diagram.nodeTemplateMap.add("entity", template_entity);
        this.diagram.nodeTemplateMap.add("relationshipDiamond", template_relationshipDiamond);
        this.diagram.nodeTemplateMap.add("generalizationSpecializationCircle", template_generalizationSpecializationCircle);
        this.diagram.nodeTemplateMap.add("", this.diagram.nodeTemplate);

        this.diagram.linkTemplateMap.add("relationshipLine", template_relationshipLine);
        this.diagram.linkTemplateMap.add("specializationLine", template_specializationLine);
        this.diagram.linkTemplateMap.add("totalGeneralizationLine", template_totalGeneralizationLine);
        this.diagram.linkTemplateMap.add("partialGeneralizationLine", template_partialGeneralizationLine);
        this.diagram.linkTemplateMap.add("", this.diagram.linkTemplate);
    }

    /**
     * Adds an Entity to the diagram in the x,y coordinates specified. entityData contains its name and properties.
     * @param entityData data of the entity to be modeled
     * @param x abscissa of the point where the entity is to be added to the diagram
     * @param y ordinate of the point where the entity is to be added to the diagram
     */
    addEntity(entityData: EntityData, x: number, y: number) {
        if (this.diagram.model.findNodeDataForKey(entityData.name) != null)
            throw new Error("An Entity with this name already exists");

        this.go.startTransaction(`Add Entity ${entityData.name}`);
        this.diagram.model.addNodeData({
            key: entityData.name,
            location: `${x} ${y}`,
            entityName: entityData.name,
            properties: entityData.properties,
            category: "entity"
        });
        this.go.commitTransaction(`Add Entity ${entityData.name}`);
    }



    /**
     * Adds a relationship between two entities
     * @param linkData data of the relationship
     * @param x abscissa of the point where the diamond is to be added to the diagram
     * @param y ordinate of the point where the diamond is to be added to the diagram
     */
    addRelationship(linkData: LinKData, x: number, y: number) {

        if (this.diagram.model.findNodeDataForKey(`R_${linkData.name}`) != null)
            throw new Error("An Relationship with this name already exists");

        this.go.startTransaction(`Add Relationship R_${linkData.name}`);

        //Adding Diamond
        this.diagram.model.addNodeData({
            key: `R_${linkData.name}`,
            location: `${x} ${y}`,
            relationshipName: linkData.name,
            category: "relationshipDiamond"
        });

        //Adding Source Link
        this.diagram.model.addLinkData({
            key: `${linkData.name}_Source`,
            from: linkData.source.data.entityName,
            to: `R_${linkData.name}`,
            role: linkData.sourceRole,
            multiplicity: linkData.sourceMultiplicity
        });

        //Adding Target Link
        this.diagram.model.addLinkData({
            key: `${linkData.name}_Target`,
            from: `R_${linkData.name}`,
            to: linkData.target.data.entityName,
            role: linkData.targetRole,
            multiplicity: linkData.targetMultiplicity
        });

        this.go.commitTransaction(`Add Relationship ${linkData.name}`);
    }

    addGeneralizationSpecialization(parentEntity: go.Node, targetEntities: Array<go.Node>){

    }
}