export default {
    name: 'category',
    title: 'Category',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Name',
            type: 'string'
        },
        {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'name',
                maxLenght: 60
            }
        },
        {
            name: 'isSelected',
            title: 'IsSelected',
            type: 'boolean'
        },
    ]
}