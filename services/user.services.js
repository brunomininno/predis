'use strict'

const models = require('models')

exports.createUser = async(userData, socialNetwork) => {
	let user = {
		email: userData.email,
		userSocialData: {},
		metadata: [
			{
				key: 'first_name',
				value: userData.first_name,
			},
			{
				key: 'last_name',
				value: userData.last_name,
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