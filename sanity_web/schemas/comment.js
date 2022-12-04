export default {
    name: 'comment',
    title: 'Comment',
    type: 'document',
    fields: [
        {
            name: 'avatar',
            title: 'Avatar',
            type: 'image',
            options: {
                hotspot: true,
            }
        },
        {
            name: 'name',
            title: 'Name',
            type: 'string'
        },
        {
            name: 'comment',
            title: 'Comment',
            type: 'string'
        },
        {
            name: 'datetime',
            title: 'Datetime',
            type: 'string'
        }
    ]
}