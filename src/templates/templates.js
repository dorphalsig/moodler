"use strict";

function setupTemplates() {

    var template_entity = $go(go.Node, go.Panel.Vertical, new go.Binding("position", "loc"),
        $go(go.Panel, "Auto", {stretch: go.GraphObject.Fill},
            $go(go.Shape, "Rectangle", {fill: "white"}),
            $go(go.TextBlock, new go.Binding("text", "entityName"), {margin: 5})
        ),
        $go(go.Panel, "Auto", {stretch: go.GraphObject.Fill},
            $go(go.Shape, "Rectangle", {fill: "white"}),
            $go(go.Panel, "Vertical", {margin: 4, defaultAlignment: go.Spot.Left},
                new go.Binding("itemArray", "properties"), {
                    itemTemplate: $go(go.Panel, "Horizontal", {margin: 0.5},
                        $go(go.TextBlock, new go.Binding("text", "propertyName")),
                        $go(go.TextBlock, " : "),
                        $go(go.TextBlock, new go.Binding("text", "propertyType")))
                }
            )
        )
    );


    var template_relationshipDiamond = $go(go.Node, go.Panel.Auto, new go.Binding("location", "loc"),
        $go(go.Shape, "Diamond", {fill: "white", margin: 2, minSize: new go.Size(20, 20)}),
        $go(go.TextBlock, {margin: 2, font: "10px sans-serif"}, new go.Binding("text", "relationshipName"))
    );

    var template_generalizationSpecializationCircle = $go(go.Node, go.Panel.Auto, new go.Binding("location", "loc"),
        $go(go.Shape, "Circle", {fill: "white", margin: 2, minSize: new go.Size(20, 20)}),
        $go(go.TextBlock, {margin: 2, font: "10px sans-serif"}, new go.Binding("text", "relationshipName"))
    );

    var template_relationshipLine = $go(go.Link, {
            routing: go.Link.AvoidsNodes,
            curve: go.Link.JumpGap,
            reshapable: true,
            deletable: false
        },

        $go(go.Shape), $go(go.TextBlock, new go.Binding("text", "role"), {
                segmentIndex: 0,
                segmentOffset: new go.Point(NaN, NaN),
                font: "10px sans-serif"
            }
        ),
        $go(go.TextBlock, new go.Binding("text", "multiplicity"), {
                segmentIndex: -1,
                segmentOffset: new go.Point(NaN, NaN),
                font: "10px sans-serif"
            }
        )
    );


    var template_specializationLine = $go(go.Link, {
            routing: go.Link.AvoidsNodes,
            curve: go.Link.JumpGap,
            reshapable: true,
            deletable: false
        },
        $go(go.Shape),
        $go(go.Shape, {
            toArrow: "ForwardSemiCircle",
            fill: null,
            scale: 2,
            segmentIndex: 1,
            segmentFraction: 0.5
        })
    );

    var template_totalGeneralizationLine = $go(go.Link, {
            routing: go.Link.AvoidsNodes,
            curve: go.Link.JumpGap,
            reshapable: true,
            deletable: false
        },
        $go(go.Shape, {
            stroke: "transparent",
            fill: "transparent",
            pathPattern: $go(go.Shape, {
                geometryString: "M0 0 L1 0 M0 3 L1 3",
                fill: "transparent",
                stroke: "black",
                strokeWidth: 1,
                strokeCap: "square"
            })
        })
    );

    var template_partialGeneralizationLine = $go(go.Link, {
        routing: go.Link.AvoidsNodes,
        curve: go.Link.JumpGap,
        reshapable: true,
        deletable: false
    }, $go(go.Shape));

    diagram.nodeTemplateMap.add("entity", template_entity);
    diagram.nodeTemplateMap.add("relationshipDiamond", template_relationshipDiamond);
    diagram.nodeTemplateMap.add("generalizationSpecializationCircle", template_generalizationSpecializationCircle);
    diagram.nodeTemplateMap.add("", diagram.nodeTemplate);
    diagram.linkTemplateMap.add("relationshipLine", template_relationshipLine);
    diagram.linkTemplateMap.add("specializationLine", template_specializationLine);
    diagram.linkTemplateMap.add("totalGeneralizationLine", template_totalGeneralizationLine);
    diagram.linkTemplateMap.add("partialGeneralizationLine", template_partialGeneralizationLine);
    diagram.linkTemplateMap.add("", diagram.linkTemplate);
}