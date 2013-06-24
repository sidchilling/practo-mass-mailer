// Generated by CoffeeScript 1.6.1
(function() {
  var ErrorMessageModel, ErrorMessageView, PaitentsTableModel, PaitentsTableView, SendEmailModalModel, SendEmailModalView, SuccessMessageView, append_error_view,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    _this = this;

  ErrorMessageModel = (function(_super) {

    __extends(ErrorMessageModel, _super);

    function ErrorMessageModel() {
      return ErrorMessageModel.__super__.constructor.apply(this, arguments);
    }

    return ErrorMessageModel;

  })(Backbone.Model);

  ErrorMessageView = (function(_super) {

    __extends(ErrorMessageView, _super);

    function ErrorMessageView() {
      var _this = this;
      this.render = function() {
        return ErrorMessageView.prototype.render.apply(_this, arguments);
      };
      this.initialize = function() {
        return ErrorMessageView.prototype.initialize.apply(_this, arguments);
      };
      return ErrorMessageView.__super__.constructor.apply(this, arguments);
    }

    ErrorMessageView.prototype.initialize = function() {
      this.template = $('#error_msg_template').template();
      this.render();
      return this;
    };

    ErrorMessageView.prototype.render = function() {
      $(this.el).html($.tmpl(this.template, this.model.toJSON()));
      return this;
    };

    return ErrorMessageView;

  })(Backbone.View);

  SuccessMessageView = (function(_super) {

    __extends(SuccessMessageView, _super);

    function SuccessMessageView() {
      var _this = this;
      this.render = function() {
        return SuccessMessageView.prototype.render.apply(_this, arguments);
      };
      this.initialize = function() {
        return SuccessMessageView.prototype.initialize.apply(_this, arguments);
      };
      return SuccessMessageView.__super__.constructor.apply(this, arguments);
    }

    SuccessMessageView.prototype.initialize = function() {
      this.template = $('#success_template').template();
      this.render();
      return this;
    };

    SuccessMessageView.prototype.render = function() {
      return $(this.el).html($.tmpl(this.template));
    };

    return SuccessMessageView;

  })(Backbone.View);

  SendEmailModalModel = (function(_super) {

    __extends(SendEmailModalModel, _super);

    function SendEmailModalModel() {
      return SendEmailModalModel.__super__.constructor.apply(this, arguments);
    }

    return SendEmailModalModel;

  })(Backbone.Model);

  SendEmailModalView = (function(_super) {

    __extends(SendEmailModalView, _super);

    function SendEmailModalView() {
      var _this = this;
      this.send_email_handler = function(ev) {
        return SendEmailModalView.prototype.send_email_handler.apply(_this, arguments);
      };
      this.events = function() {
        return SendEmailModalView.prototype.events.apply(_this, arguments);
      };
      this.render = function() {
        return SendEmailModalView.prototype.render.apply(_this, arguments);
      };
      this.initialize = function() {
        return SendEmailModalView.prototype.initialize.apply(_this, arguments);
      };
      return SendEmailModalView.__super__.constructor.apply(this, arguments);
    }

    SendEmailModalView.prototype.initialize = function() {
      this.template = $('#compose_email_template').template();
      this.render();
      return this;
    };

    SendEmailModalView.prototype.render = function() {
      return $(this.el).html($.tmpl(this.template));
    };

    SendEmailModalView.prototype.events = function() {
      return {
        'click #send_email': 'send_email_handler'
      };
    };

    SendEmailModalView.prototype.send_email_handler = function(ev) {
      var email, subject;
      $(ev.currentTarget).button('loading');
      email = $('#email_content').val();
      subject = $.trim($('#email_subject').val());
      if ($.trim(email).length <= 0) {
        alert('Please write some text in the email');
        $(ev.currentTarget).button('reset');
        return;
      }
      if (subject.length <= 0) {
        alert('Please enter an email subject');
        $(ev.currentTarget).button('reset');
        return;
      }
      return $.ajax({
        url: '/send_email',
        type: 'POST',
        dataType: 'json',
        context: this,
        data: {
          users: this.model.get('user_data'),
          email: email,
          subject: subject,
          num_users: this.model.get('user_data').length
        },
        success: function(resp) {
          var data, success_message_view;
          $(ev.currentTarget).button('reset');
          if (resp && resp.success) {
            return success_message_view = new SuccessMessageView({
              el: '#modal_messages'
            });
          } else {
            data = {
              heading: 'Unexpected Error',
              message: 'Oops! Something went wrong. Please try again later'
            };
            return append_error_view(data, '#modal_messages');
          }
        },
        failure: function() {
          var data;
          $(ev.currentTarget).button('reset');
          data = {
            heading: 'Server Error',
            message: 'Unexpected Error. Please try again later.'
          };
          return append_error_view(data, '#modal_messages');
        }
      });
    };

    return SendEmailModalView;

  })(Backbone.View);

  PaitentsTableModel = (function(_super) {

    __extends(PaitentsTableModel, _super);

    function PaitentsTableModel() {
      return PaitentsTableModel.__super__.constructor.apply(this, arguments);
    }

    return PaitentsTableModel;

  })(Backbone.Model);

  PaitentsTableView = (function(_super) {

    __extends(PaitentsTableView, _super);

    function PaitentsTableView() {
      var _this = this;
      this.send_email_handler = function(ev) {
        return PaitentsTableView.prototype.send_email_handler.apply(_this, arguments);
      };
      this.view_emails_handler = function(ev) {
        return PaitentsTableView.prototype.view_emails_handler.apply(_this, arguments);
      };
      this.events = function() {
        return PaitentsTableView.prototype.events.apply(_this, arguments);
      };
      this.render = function() {
        return PaitentsTableView.prototype.render.apply(_this, arguments);
      };
      this.initialize = function() {
        return PaitentsTableView.prototype.initialize.apply(_this, arguments);
      };
      return PaitentsTableView.__super__.constructor.apply(this, arguments);
    }

    PaitentsTableView.prototype.initialize = function() {
      this.template = $('#patients_table_template').template();
      this.render();
      return this;
    };

    PaitentsTableView.prototype.render = function() {
      $(this.el).html($.tmpl(this.template, this.model.toJSON()));
      return this;
    };

    PaitentsTableView.prototype.events = function() {
      return {
        'click #send_email_btn': 'send_email_handler',
        'click #view_emails': 'view_emails_handler'
      };
    };

    PaitentsTableView.prototype.view_emails_handler = function(ev) {
      return window.open('/view_emails');
    };

    PaitentsTableView.prototype.send_email_handler = function(ev) {
      var data, send_email_model, send_email_view, user_data, view_obj;
      view_obj = this;
      user_data = [];
      $('.email_select').each(function(input) {
        var d;
        if ($(this).is(':checked')) {
          d = {
            id: $(this).attr('data-id'),
            email: $(this).attr('data-email'),
            name: $(this).attr('data-name')
          };
          return user_data.push(d);
        }
      });
      if (user_data.length <= 0) {
        return alert('Please select at least one paitent to send email to');
      } else {
        data = {
          user_data: user_data
        };
        send_email_model = new SendEmailModalModel(data);
        send_email_view = new SendEmailModalView({
          model: send_email_model
        });
        $('#compose_email_modal_div').html('');
        $(send_email_view.el).appendTo('#compose_email_modal_div');
        return $('#compose_email_modal').modal();
      }
    };

    return PaitentsTableView;

  })(Backbone.View);

  append_error_view = function(data, el) {
    var error_message_model, error_message_view;
    error_message_model = new ErrorMessageModel(data);
    return error_message_view = new ErrorMessageView({
      model: error_message_model,
      el: el
    });
  };

  window.init = function() {
    $('#content').html('');
    return $.ajax({
      url: '/get_patients',
      type: 'POST',
      dataType: 'json',
      success: function(resp) {
        var data, paitents_table_model, paitents_table_view;
        if (resp && resp.success) {
          data = {
            patients: resp.patients
          };
          paitents_table_model = new PaitentsTableModel(data);
          return paitents_table_view = new PaitentsTableView({
            model: paitents_table_model,
            el: '#content'
          });
        } else {
          data = {
            heading: 'Unexpected Error',
            message: 'An unexpected error occurred while getting the patients list. Please try again later.'
          };
          return append_error_view(data, '#content');
        }
      },
      failure: function() {
        var data;
        data = {
          heading: 'Server Error',
          message: 'An error occurred while communicating with the server. Please try again later.'
        };
        return append_error_view(data, '#content');
      }
    });
  };

}).call(this);