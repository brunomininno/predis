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
			},
			{
				key: 'profile_pic',
				value: userData.picture
			},
			{
				key: 'phone',
				value: ''
			},
			{
				key: 'birth_date',
				value: ''
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

exports.getProfileImage = async(userId = null) => {
	let sqlQuery = "SELECT " +
		"	ph.meta_value, " +
		"	um.user_id " +
		"FROM " +
		"	wp_usermeta um " +
		"INNER JOIN wp_postmeta ph ON ph.post_id = um.meta_value " +
		"	AND um.meta_key = 'wp_metronet_image_id' " +
		"	AND ph.meta_key = '_wp_attached_file' "

	if (userId) {
		sqlQuery += "WHERE um.user_id = " + userId
	}

	let result = await models.sequelize.query(sqlQuery, { type: models.sequelize.QueryTypes.SELECT })

	return Promise.resolve(result)
}