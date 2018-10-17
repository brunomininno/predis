'use strict'

const models = require('models')

exports.createUser = async(userData, socialNetwork) => {
	let user = {
		email: userData.email,
		userSocialData: {},
		metadata: [
			{
				key: userData.first_name,
				value: 'first_name'
			},
			{
				key: userData.last_name,
				value: 'last_name'
			},
			{
				key: 'wp_capabilities',
				value: 'a:1:{s:8:"customer";b:1;}'
			}
		]
	}
	
	if (socialNetwork == 'fb') {
		user.userSocialData.fbId = userData.id
	} else if (socialNetwork == 'google') {
		user.userSocialData.googleId = userData.id
	}

	let createdUser = await models.user.create(user,
		{
			include: [
				{
					model: models.userMetadata,
					as: 'metadata'
				},
				{
					model: models.userSocialData,
					as: 'userSocialData'
				}
			]
		}
	)
	
	return Promise.resolve(createdUser)
}