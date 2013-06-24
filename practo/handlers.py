# This is the handlers file which will have all the controller handlers

import os
import logging
import json
import jinja2
import webapp2
from models import models

JINJA_ENVIRONMENT = jinja2.Environment(
        loader = jinja2.FileSystemLoader(os.path.dirname(__file__)),
        extensions = ['jinja2.ext.autoescape']
        )

class MainPage(webapp2.RequestHandler):
    # This handler will render the base page
    def get(self):
        template = JINJA_ENVIRONMENT.get_template('html/index.html')
	self.response.write(template.render())

class ViewEmailsSent(webapp2.RequestHandler):
    # This handler will render a page showing the emails that has been sent
    def get(self):
        emails = models.Email.all()
        emails_sent = []
        for email in emails:
            emails_sent.append({
                'subject' : email.subject,
                'email' : email.email,
                'users' : json.loads(email.users)
                })
        template = JINJA_ENVIRONMENT.get_template('html/emails_sent.html')
        template_values = {
                'emails' : emails_sent
                }
        logging.info('emails: %s' %(template_values.get('emails')))
        self.response.write(template.render(template_values))

class SendEmail(webapp2.RequestHandler):
    # This handler will send the email
    def post(self):
	try:
	    num_users = int(self.request.get('num_users'))
	    users = []
	    for i in range(0, num_users):
		u = {
			'id' : self.request.get("users[%s][id]" %(i)),
			'email' : self.request.get("users[%s][email]" %(i)),
			'name' : self.request.get("users[%s][name]" %(i))
		    }
		users.append(u)
	    # send the email - this is async
	    from google.appengine.api import mail
	    message = mail.EmailMessage(sender = 'Siddharth Saha <sidchilling@gmail.com>', 
		    subject = self.request.get('subject'))
	    to_string = ''
	    for user in users:
		to_string = to_string + "%s <%s>," %(user['name'], user['email'])
	    to_string = to_string[:-1] # remove the last comma
	    message.bcc = to_string
	    message.body = self.request.get('email')
	    message.send()
            # save email in the database
            email_model = models.Email(subject = self.request.get('subject'),
                    email = self.request.get('email'),
                    users = json.dumps(users))
            email_model.put()
	    response = {
		    'success' : True
		    }
	except Exception as e:
	    logging.exception('exception: %s' %(e))
	    response = {
		    'error' : True
		    }
	self.response.headers['Content-Type'] = 'application/json'
	self.response.write(json.dumps(response));

class GetPatients(webapp2.RequestHandler):
    # This handler will return the JSON of the patients
    def post(self):
        # This is a test implemetation which was used while testing
        '''
        patients = []
        patients.append({
            'mobile' : '8698789798',
            'email' : 'sidchilling@gmail.com',
            'dob' : '01-01-1988',
            'id' : '1',
            'name' : 'Siddharth Saha'
            })
        patients.append({
            'mobile' : '8765467923',
            'email' : 'siddharth@shopsocially.com',
            'dob' : '09-12-1988',
            'id' : '2',
            'name' : 'Sid Saha'
            })
        patients.append({
            'mobile' : '3498236481',
            'email' : '',
            'dob' : '24-06-1987',
            'id' : '3',
            'name' : 'Anon User'
            })
        '''
        from google.appengine.api import urlfetch
        url = 'https://patients.apiary.io/patients'
        result = urlfetch.fetch(url)
        if result.status_code == 200:
            content = json.loads(result.content)
            response = {
                    'success' : True,
                    'patients' : content.get('items', [])
                    }
        else:
            response = {
                    'error' : True
                    }
        self.response.headers['Content-Type'] = 'application/json'
        self.response.write(json.dumps(response))

