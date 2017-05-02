import * as go from "../gojs/go";
declare let $go: any;
declare let diagram: go.Diagram;
declare let setupTemplates: any;

declare namespace moodler {

    interface Property {
        propertyName: String;
        propertyType: String;
    }

    interface  EntityData {
        name: String;
        properties: Property[];
    }

    interface RelData {
        source: go.Node;
        target: go.Node;
        name: String;
        sourceRole: String;
        sourceMultiplicity: String;
        targetRole: String;
        targetMultiplicity: String;
    }

    interface GSData{
        parent: go.Node,
        children: go.Node[],
        isPartial: boolean,
        isDisjoint: boolean
    }

    function init(moodlerDiv?: String);

    /**
     * Adds an Entity to the diagram in the x,y coordinates specified. entityData contains its name and properties.
     * @param entityData data of the entity to be modeled, it is an object with the following properties:
     *
     * @param x abscissa of the point where the entity is to be added to the diagram
     * @param y ordinate of the point where the entity is to be added to the diagram
     */
    function addEntity(entityData: EntityData, x: number, y: number);

    /**
     * Adds a relationship between two entities
     * @param relData data of the relationship. It is an obejct with the following properties:
     *      source: go.Node <-- Node of the Source Entity
     *      target: go.Node <-- Node of the Target Entity
     *      name: String
     *      sourceRole: String
     *      sourceMultiplicity: String
     *      targetRole: String
     *      targetMultiplicity: String
     *
     * @param x abscissa of the point where the diamond is to be added to the diagram
     * @param y ordinate of the point where the diamond is to be added to the diagram
     */
    function addRelationship(relData: RelData, x: number, y: number);


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
    function addGeneralizationSpecialization(gsData: GSData, x: number, y: number);

}