# This is the coffee file containing all the JS required

class ErrorMessageModel extends Backbone.Model

class ErrorMessageView extends Backbone.View
	initialize:() =>
		@template = $('#error_msg_template').template()
		@render()
		return @

	render:() =>
		$(@el).html $.tmpl(@template, @model.toJSON())
		return @

class SuccessMessageView extends Backbone.View
	initialize:() =>
		@template = $('#success_template').template()
		@render()
		return @

	render:() =>
		$(@el).html $.tmpl(@template)

class SendEmailModalModel extends Backbone.Model

class SendEmailModalView extends Backbone.View
	initialize:() =>
		@template = $('#compose_email_template').template()
		@render()
		return @

	render:() =>
		$(@el).html $.tmpl(@template)
	
	events: =>
		'click #send_email' : 'send_email_handler'
	
	send_email_handler: (ev) =>
		$(ev.currentTarget).button 'loading'
		email = $('#email_content').val()
		subject = $.trim($('#email_subject').val())
		if $.trim(email).length <= 0
			alert 'Please write some text in the email'
			$(ev.currentTarget).button 'reset'
			return
		if subject.length <= 0
			alert 'Please enter an email subject'
			$(ev.currentTarget).button 'reset'
			return
		$.ajax
			url : '/send_email'
			type : 'POST'
			dataType : 'json'
			context: @
			data :
				users : @model.get 'user_data'
				email : email
				subject : subject
				num_users : @model.get('user_data').length
			success : (resp) ->
				$(ev.currentTarget).button 'reset'
				if resp and resp.success
					# show the success view
					success_message_view = new SuccessMessageView el: '#modal_messages'
				else
					# show the error View
					data =
						heading : 'Unexpected Error'
						message : 'Oops! Something went wrong. Please try again later'
					append_error_view data, '#modal_messages'
			failure: () ->
				# show the error view
				$(ev.currentTarget).button 'reset'
				data =
					heading : 'Server Error'
					message : 'Unexpected Error. Please try again later.'
				append_error_view data, '#modal_messages'

class PaitentsTableModel extends Backbone.Model

class PaitentsTableView extends Backbone.View
	initialize:() =>
		@template = $('#patients_table_template').template()
		@render()
		return @

	render:() =>
		$(@el).html $.tmpl(@template, @model.toJSON())
		return @

	events:() =>
		'click #send_email_btn' : 'send_email_handler'
		'click #view_emails' : 'view_emails_handler'
	
	view_emails_handler:(ev) =>
		window.open '/view_emails'
	
	send_email_handler:(ev) =>
		# first check whether any user has been selected
		view_obj = @
		user_data = []
		$('.email_select').each (input) ->
			if $(this).is ':checked'
				d =
					id : $(this).attr 'data-id'
					email : $(this).attr 'data-email'
					name : $(this).attr 'data-name'
				user_data.push d
		if user_data.length <= 0
			alert 'Please select at least one paitent to send email to'
		else
			# now show the modal to compose the email
			data =
				user_data : user_data
			send_email_model = new SendEmailModalModel data
			send_email_view = new SendEmailModalView model: send_email_model
			$('#compose_email_modal_div').html ''
			$(send_email_view.el).appendTo '#compose_email_modal_div'
			$('#compose_email_modal').modal()

append_error_view = (data, el) ->
	# This function will append the error view in html
	error_message_model = new ErrorMessageModel data
	error_message_view = new ErrorMessageView model: error_message_model, el: el

window.init = () ->
	# This is the init function which will initialize the page
	$('#content').html ''
	$.ajax
		url : '/get_patients'
		type : 'POST'
		dataType : 'json'
		success : (resp) ->
			if resp and resp.success
				# now display the patients table view
				data =
					patients : resp.patients
				paitents_table_model = new PaitentsTableModel data
				paitents_table_view = new PaitentsTableView model: paitents_table_model, el: '#content'
			else
				# display the error view
				data =
					heading : 'Unexpected Error'
					message : 'An unexpected error occurred while getting the patients list. Please try again later.'
				append_error_view data, '#content'
		failure : () ->
			# display the error view
			data =
				heading : 'Server Error'
				message : 'An error occurred while communicating with the server. Please try again later.'
			append_error_view data, '#content'
