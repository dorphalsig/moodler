import * as go from "./gojs/go";
declare let $go : any;
declare let diagram : go.Diagram;
declare let setupTemplates : any;

declare namespace moodler{

    interface Property {
        propertyName: String;
        propertyType: String;
    }

    interface  EntityData {
        name: String;
        properties: Array<Property>;
    }

    interface LinKData{
        source: go.Node;
        target: go.Node;
        name: String;
        sourceRole: String;
        sourceMultiplicity: String;
        targetRole: String;
        targetMultiplicity: String;
    }

    function moodler_init(moodlerDiv: HTMLDivElement);

    /**
     * Adds an Entity to the diagram in the x,y coordinates specified. entityData contains its name and properties.
     * @param entityData data of the entity to be modeled
     * @param x abscissa of the point where the entity is to be added to the diagram
     * @param y ordinate of the point where the entity is to be added to the diagram
     */
    function addEntity(entityData: EntityData, x: number, y: number);

    /**
     * Adds a relationship between two entities
     * @param linkData data of the relationship
     * @param x abscissa of the point where the diamond is to be added to the diagram
     * @param y ordinate of the point where the diamond is to be added to the diagram
     */
    function addRelationship(linkData: LinKData, x: number, y: number);

    function addGeneralizationSpecialization(parentEntity: go.Node, targetEntities: Array<go.Node>);

}