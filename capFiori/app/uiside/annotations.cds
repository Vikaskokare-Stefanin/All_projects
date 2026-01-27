using CatalogService as service from '../../srv/cat-service';
// using CatalogService as service1 from '../../srv/cat-service';

annotate service.Books with @(
    UI.CreateHidden              : false,
    UI.UpdateHidden              : false,
    UI.DeleteHidden              : false,
    UI.FieldGroup #GeneratedGroup: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Label: 'ID',
                Value: ID,
            },
            {
                $Type: 'UI.DataField',
                Label: 'title',
                Value: title,
            },
            {
                $Type: 'UI.DataField',
                Label: 'stock',
                Value: stock,
            },
            {
                $Type: 'UI.DataField',
                Label: 'price',
                Value: price,
            },
        ],
    },
    UI.Facets                    : [{
        $Type : 'UI.ReferenceFacet',
        ID    : 'GeneratedFacet1',
        Label : 'General Information',
        Target: '@UI.FieldGroup#GeneratedGroup',
    }, ],
    UI.LineItem                  : [
        {
            $Type: 'UI.DataField',
            Label: 'ID',
            Value: ID
        },
        {
            $Type: 'UI.DataField',
            Label: 'title',
            Value: title
        },
        {
            $Type: 'UI.DataField',
            Label: 'stock',
            Value: stock
        },
        {
            $Type: 'UI.DataField',
            Label: 'price',
            Value: price
        },
    ],

);

annotate service.Student with @(
    UI.CreateHidden              : false,
    UI.UpdateHidden              : false,
    UI.DeleteHidden              : false,
    UI.FieldGroup #GeneratedGroup: {
        $Type: 'UI.FieldGroupType',
        Data : [
            {
                $Type: 'UI.DataField',
                Label: 'ID',
                Value: ID,
            },
            {
                $Type: 'UI.DataField',
                Label: 'Name',
                Value: Name,
            },
            {
                $Type: 'UI.DataField',
                Label: 'Age',
                Value: Age,
            },
            {
                $Type: 'UI.DataField',
                Label: 'State',
                Value: State,
            },
        ],
    },
    UI.Facets                    : [{
        $Type : 'UI.ReferenceFacet',
        ID    : 'GeneratedFacet1',
        Label : 'General Information',
        Target: '@UI.FieldGroup#GeneratedGroup',
    }, ],
    UI.LineItem                  : [
        {
            $Type: 'UI.DataField',
            Label: 'ID',
            Value: ID
        },
        {
            $Type: 'UI.DataField',
            Label: 'First_Name',
            Value: Name
        },
        {
            $Type: 'UI.DataField',
            Label: 'Age',
            Value: Age
        },
        {
            $Type: 'UI.DataField',
            Label: 'State',
            Value: State
        },
    ],

);
