export default {
    name: 'user',
    title: 'User',
    type: 'document',
    fields: [
        {
            name: 'userName',
            title: 'UserName',
            type: 'string',
        },
        {
            name: 'password',
            title: 'Password',
            type: 'string',
        },
        {
            name: 'fullName',
            title: 'FullName',
            type: 'string',
        },
        {
            name: 'avatar',
            title: 'Avatar',
            type: 'image',
            options: {
                hotspot: true,
            }
        },
        {
            name: 'avatarURL',
            title: 'AvatarURL',
            type: 'string',
        },
        {
            name: 'address',
            title: 'Address',
            type: 'string',
        },
        {
            name: 'phoneNumber',
            title: 'PhoneNumber',
            type: 'string',
        },
        {
            name: 'createdDate',
            title: 'CreatedDate',
            type: 'string',
        },
    ]
}