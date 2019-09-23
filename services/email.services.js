'use strict'

const sendgrid = require('sendgrid').mail
const fromEmail = new sendgrid.Email(__config.sendgrid.fromEmail, 'Predis')

exports.sendConfirmationEmail = (user, confirmationLink, callback) => {
	let mail = new sendgrid.Mail()
	let currentDate = new Date()
	let year = currentDate.getUTCFullYear()

	mail.setFrom(fromEmail)
	mail.setTemplateId(__config.sendgrid.templates.confirmationEmail)

	let personalization = new sendgrid.Personalization()

	let toEmail = new sendgrid.Email(user.email)
	personalization.addTo(toEmail)

	let substitutionLink = new sendgrid.Substitution("%link%", confirmationLink)
	personalization.addSubstitution(substitutionLink)

	let substitutionName = new sendgrid.Substitution("%name%", user.name)
	personalization.addSubstitution(substitutionName)

	let substitutionEmail = new sendgrid.Substitution("%email%", user.email)
	personalization.addSubstitution(substitutionEmail)

	let substitutionYear = new sendgrid.Substitution("%year%", year.toString())
	personalization.addSubstitution(substitutionYear)

	mail.addPersonalization(personalization)

	// Send email service
	sendEmailRequest(mail, (err, response) => {
		if (err) {
			__logger.error('emailServices->sendConfirmationEmail: Error sending email to ' + user.email, err)
			return callback(err, null)
		}
		return callback(null, response)
	})
}

exports.sendWelcomeEmail = (user, link, callback) => {
	let mail = new sendgrid.Mail()
	let currentDate = new Date()
	let year = currentDate.getUTCFullYear()

	mail.setFrom(fromEmail)
	mail.setTemplateId(__config.sendgrid.templates.welcomeEmail)

	let personalization = new sendgrid.Personalization()

	let toEmail = new sendgrid.Email(user.email)
	personalization.addTo(toEmail)

	let substitutionLink = new sendgrid.Substitution("%link%", link)
	personalization.addSubstitution(substitutionLink)

	let substitutionName = new sendgrid.Substitution("%name%", user.name)
	personalization.addSubstitution(substitutionName)

	let substitutionEmail = new sendgrid.Substitution("%email%", user.email)
	personalization.addSubstitution(substitutionEmail)

	let substitutionYear = new sendgrid.Substitution("%year%", year.toString())
	personalization.addSubstitution(substitutionYear)

	mail.addPersonalization(personalization)

	// Send email service
	sendEmailRequest(mail, (err, response) => {
		if (err) {
			__logger.error('emailServices->sendWelcomeEmail: Error sending email to ' + user.email, err)
			return callback(err, null)
		}
		return callback(null, response)
	})
}

exports.sendForgotPassword = (user, link, callback) => {
	let mail = new sendgrid.Mail()
	let currentDate = new Date()
	let year = currentDate.getUTCFullYear()

	mail.setFrom(fromEmail)
	mail.setTemplateId(__config.sendgrid.templates.forgoPassword)

	let personalization = new sendgrid.Personalization()

	let toEmail = new sendgrid.Email(user.email)
	personalization.addTo(toEmail)

	let substitutionLink = new sendgrid.Substitution("%link%", link)
	personalization.addSubstitution(substitutionLink)

	let substitutionEmail = new sendgrid.Substitution("%email%", user.email)
	personalization.addSubstitution(substitutionEmail)

	let substitutionName = new sendgrid.Substitution("%name%", user.name)
	personalization.addSubstitution(substitutionName)

	let substitutionYear = new sendgrid.Substitution("%year%", year.toString())
	personalization.addSubstitution(substitutionYear)

	mail.addPersonalization(personalization)

	// Send email service
	sendEmailRequest(mail, (err, response) => {
		if (err) {
			__logger.error('emailServices->sendForgotPassword: Error sending email to ' + email, err)
			return callback(err, null)
		}
		return callback(null, response)
	})
}

exports.sendNotificationEmail = (user, notification, url, callback) => {
	let mail = new sendgrid.Mail()
	let currentDate = new Date()
	let year = currentDate.getUTCFullYear()

	mail.setFrom(fromEmail)
	mail.setTemplateId(__config.sendgrid.templates.notification)

	let personalization = new sendgrid.Personalization()

	let toEmail = new sendgrid.Email(user.email)
	personalization.addTo(toEmail)

	let substitutionUrl = new sendgrid.Substitution("%url%", url)
	personalization.addSubstitution(substitutionUrl)

	let substitutionTitle = new sendgrid.Substitution("%title%", notification.title)
	personalization.addSubstitution(substitutionTitle)

	let substitutionMessage = new sendgrid.Substitution("%message%", notification.message)
	personalization.addSubstitution(substitutionMessage)

	let substitutionEmail = new sendgrid.Substitution("%email%", user.email)
	personalization.addSubstitution(substitutionEmail)

	mail.addPersonalization(personalization)

	// Send email service
	sendEmailRequest(mail, (err, response) => {
		if (err) {
			__logger.error('emailServices->sendNotificationEmail: Error sending email to ' + email, err)
			return callback(err, null)
		}
		return callback(null, response)
	})
}

let sendEmailRequest = (mail, callback) => {
	let sg = require('sendgrid')(__config.sendgrid.apiKey)
	let request = sg.emptyRequest({
		method: 'POST',
		path: '/v3/mail/send',
		body: mail.toJSON()
	})

	sg.API(request, function (err, response) {
		if (err) {
			__logger.error('emailService->sendEmailRequest: Error response received', err)
			__logger.error('emailService->sendEmailRequest: Error response status ' + JSON.stringify(response.statusCode))
			__logger.error('emailService->sendEmailRequest: Error response body' + JSON.stringify(response.body))
			__logger.error('emailService->sendEmailRequest: Error response headers' + JSON.stringify(response.headers))
			return callback(err, null)
		}

		__logger.info('emailService->sendEmailRequest: response status ' + JSON.stringify(response.statusCode))
		__logger.info('emailService->sendEmailRequest: response body' + JSON.stringify(response.body))
		__logger.info('emailService->sendEmailRequest: response headers' + JSON.stringify(response.headers))

		return callback(null, response)
	})
}