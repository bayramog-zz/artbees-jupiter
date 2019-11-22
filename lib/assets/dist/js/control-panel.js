'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function ($, jupiterx) {
  var SectionHome = function () {
    function SectionHome() {
      _classCallCheck(this, SectionHome);

      this.events();
    }

    _createClass(SectionHome, [{
      key: 'events',
      value: function events() {
        var popoverEvent = function popoverEvent() {
          $('[data-toggle="tooltip"]').tooltip();

          $('[data-toggle="popover"]').click(function (event) {
            event.preventDefault();
          });

          $('[data-toggle="popover"]').popover({
            trigger: 'focus',
            container: '.jupiterx.jupiterx-cp-wrap',
            html: true
          });
        };

        // Setup wizard notice.
        $('.jupiterx-setup-wizard-hide-notice').on('click', function (event) {
          event.preventDefault();
          $(this).attr('disabled', 'disabled');

          $.ajax({
            type: 'POST',
            url: _wpUtilSettings.ajax.url,
            data: {
              action: 'jupiterx_setup_wizard_hide_notice'
            },
            beforeSend: function beforeSend() {
              $('.jupiterx-setup-wizard-message').fadeOut(400);
            }
          });
        });

        // Switch license registration type.
        $(document).off().on('click', '#jupiterx-api-key-switch', function (event) {
          event.preventDefault();
          var $this = $(this);
          var modal = $('#jupiterx-modal');

          if ('api' === $this.data('activation-mode')) {
            modal.find('.jupiterx-purchase-code-mode-element').addClass('d-block').removeClass('d-none');
            modal.find('.jupiterx-api-mode-element').addClass('d-none').removeClass('d-block d-flex');
            modal.find('#jupiterx-cp-gdpr-option-wrapper, #jupiterx-cp-mailing-list-option-wrapper').addClass('d-flex').removeClass('d-none');
            $this.data('activation-mode', 'purchase-code');
            $this.text(jupiterx_cp_textdomain.license_manager_add_api);
            popoverEvent();
          } else {
            modal.find('.jupiterx-api-mode-element').addClass('d-block').removeClass('d-none');
            modal.find('.jupiterx-purchase-code-mode-element').addClass('d-none').removeClass('d-block d-flex');
            $this.data('activation-mode', 'api');
            $this.text(jupiterx_cp_textdomain.license_manager_insert_purchase_code);
            popoverEvent();
          }
        });

        // License registration.
        $('#js__regiser-api-key-btn').on('click', function (event) {
          var _jupiterx_modal;

          event.preventDefault();

          jupiterx_modal((_jupiterx_modal = {
            title: jupiterx_cp_textdomain.registering_theme,
            type: '',
            cancelButtonText: jupiterx_cp_textdomain.discard,
            showCancelButton: true,
            showConfirmButton: true,
            showCloseButton: true,
            confirmButtonText: jupiterx_cp_textdomain.submit
          }, _defineProperty(_jupiterx_modal, 'cancelButtonText', jupiterx_cp_textdomain.cancel), _defineProperty(_jupiterx_modal, 'closeOnConfirm', false), _defineProperty(_jupiterx_modal, 'text', $(wp.template('jupiterx-cp-registration')())), _defineProperty(_jupiterx_modal, 'onConfirm', function onConfirm() {
            if ('api' === $('#jupiterx-api-key-switch').data('activation-mode')) {
              var $api_key = $('#jupiterx-cp-register-api-input').val();

              if ($api_key.length === 0) {
                return false;
              }

              var data = {
                action: 'jupiterx_cp_register_revoke_api_action',
                method: 'register',
                api_key: $api_key,
                security: $('#security').val()
              };

              jupiterx_modal({
                type: '',
                title: jupiterx_cp_textdomain.license_manager_registration_title,
                text: jupiterx_cp_textdomain.wait_for_api_key_registered,
                cancelButtonText: jupiterx_cp_textdomain.discard,
                showCancelButton: false,
                showConfirmButton: false,
                showCloseButton: false,
                showLearnmoreButton: false,
                showProgress: true,
                indefiniteProgress: true,
                progress: '100%'
              });

              $.post(_wpUtilSettings.ajax.url, data, function (res) {
                res = JSON.parse(res);

                if (res.status === true) {
                  var _data = res.data || {};

                  if (_data.status) {
                    jupiterx_modal({
                      title: jupiterx_cp_textdomain.thanks_registering,
                      text: res.message,
                      type: 'success',
                      showCancelButton: false,
                      showConfirmButton: true,
                      showCloseButton: false,
                      showLearnmoreButton: false,
                      showProgress: false,
                      indefiniteProgress: true,
                      closeOnOutsideClick: false,
                      closeOnConfirm: false,
                      onConfirm: function onConfirm() {
                        window.location.reload();
                      }
                    });

                    $('.jupiterx-wrap').removeClass('jupiterx-call-to-register-product');
                    $('.get-api-key-form').addClass('d-none');
                    $('.remove-api-key-form').removeClass('d-none');

                    // jupiterx_reinit_events();
                  } else {
                    jupiterx_modal({
                      title: jupiterx_cp_textdomain.registeration_unsuccessful,
                      text: res.message,
                      type: 'error',
                      showCancelButton: false,
                      showConfirmButton: true,
                      showCloseButton: false,
                      showLearnmoreButton: false,
                      showProgress: false,
                      onConfirm: function onConfirm() {
                        $('#jupiterx-cp-register-api-input').val('');
                      }
                    });
                  }
                } else {
                  jupiterx_modal({
                    title: jupiterx_cp_textdomain.registeration_unsuccessful,
                    text: res.message,
                    type: 'error',
                    showCancelButton: false,
                    showConfirmButton: true,
                    showCloseButton: false,
                    showLearnmoreButton: false,
                    showProgress: false,
                    onConfirm: function onConfirm() {
                      $('#jupiterx-cp-register-api-input').val('');
                    }
                  });
                }
              });
            } else {
              var purchase_code = $('#jupiterx-cp-register-purchase-code-input').val();
              var email = $('#jupiterx-cp-register-email').val();

              if (purchase_code.length === 0 || email.length === 0) {
                return false;
              }

              if (!$('#jupiterx-cp-register-gdpr').prop('checked')) {
                $('#jupiterx-cp-register-gdpr').addClass('is-invalid');
                return false;
              }

              $('#jupiterx-cp-register-gdpr').removeClass('is-invalid');

              var _data2 = {
                action: 'jupiterx_register_license',
                purchase_code: purchase_code,
                nonce: $('#license-manager-nonce').val(),
                email: $('#jupiterx-cp-register-email').val(),
                accept_mail_list: $('#jupiterx-cp-register-mailing-list').prop('checked') ? 'on' : 'off'
              };

              jupiterx_modal({
                type: '',
                title: jupiterx_cp_textdomain.license_manager_registration_title,
                text: jupiterx_cp_textdomain.wait_for_api_key_registered,
                cancelButtonText: jupiterx_cp_textdomain.discard,
                showCancelButton: false,
                showConfirmButton: false,
                showCloseButton: false,
                showLearnmoreButton: false,
                showProgress: true,
                indefiniteProgress: true,
                progress: '100%'
              });

              $.post(_wpUtilSettings.ajax.url, _data2, function (res) {
                if ('valid_api' === res.data.code) {
                  // For supporters.
                  console.log('Validating API key ...');

                  var data = {
                    action: 'jupiterx_cp_register_revoke_api_action',
                    method: 'register',
                    api_key: purchase_code,
                    security: $('#security').val()
                  };

                  $.post(_wpUtilSettings.ajax.url, data, function (res) {
                    res = JSON.parse(res);

                    if (res.status === true) {
                      var _data3 = res.data || {};

                      if (_data3.status) {
                        jupiterx_modal({
                          title: jupiterx_cp_textdomain.thanks_registering,
                          text: res.message,
                          type: 'success',
                          showCancelButton: false,
                          showConfirmButton: true,
                          showCloseButton: false,
                          showLearnmoreButton: false,
                          showProgress: false,
                          indefiniteProgress: true,
                          closeOnOutsideClick: false,
                          closeOnConfirm: false,
                          onConfirm: function onConfirm() {
                            window.location.reload();
                          }
                        });

                        $('.jupiterx-wrap').removeClass('jupiterx-call-to-register-product');
                        $('.get-api-key-form').addClass('d-none');
                        $('.remove-api-key-form').removeClass('d-none');

                        // jupiterx_reinit_events();
                      } else {
                        jupiterx_modal({
                          title: jupiterx_cp_textdomain.registeration_unsuccessful,
                          text: res.message,
                          type: 'error',
                          showCancelButton: false,
                          showConfirmButton: true,
                          showCloseButton: false,
                          showLearnmoreButton: false,
                          showProgress: false,
                          onConfirm: function onConfirm() {
                            $('#jupiterx-cp-register-api-input').val('');
                          }
                        });
                      }
                    } else {
                      jupiterx_modal({
                        title: jupiterx_cp_textdomain.registeration_unsuccessful,
                        text: res.message,
                        type: 'error',
                        showCancelButton: false,
                        showConfirmButton: true,
                        showCloseButton: false,
                        showLearnmoreButton: false,
                        showProgress: false,
                        onConfirm: function onConfirm() {
                          $('#jupiterx-cp-register-api-input').val('');
                        }
                      });
                    }
                  });
                } else if (res.success === true) {
                  var _data4 = res.data || {};

                  if (_data4.status) {
                    jupiterx_modal({
                      title: jupiterx_cp_textdomain.thanks_registering,
                      text: _data4.message,
                      type: 'success',
                      showCancelButton: false,
                      showConfirmButton: true,
                      showCloseButton: false,
                      showLearnmoreButton: false,
                      showProgress: false,
                      indefiniteProgress: true,
                      closeOnOutsideClick: false,
                      closeOnConfirm: false,
                      onConfirm: function onConfirm() {
                        window.location.reload();
                      }
                    });

                    $('.jupiterx-wrap').removeClass('jupiterx-call-to-register-product');
                    $('.get-api-key-form').addClass('d-none');
                    $('.remove-api-key-form').removeClass('d-none');

                    // jupiterx_reinit_events();
                  } else {
                    jupiterx_modal({
                      title: jupiterx_cp_textdomain.registeration_unsuccessful,
                      text: res.message,
                      type: 'error',
                      showCancelButton: false,
                      showConfirmButton: true,
                      showCloseButton: false,
                      showLearnmoreButton: false,
                      showProgress: false,
                      onConfirm: function onConfirm() {
                        $('#jupiterx-cp-register-api-input').val('');
                        window.location.reload();
                      }
                    });
                  }
                } else {
                  jupiterx_modal({
                    title: jupiterx_cp_textdomain.registeration_unsuccessful,
                    text: res.data.message,
                    type: 'error',
                    showCancelButton: false,
                    showConfirmButton: true,
                    showCloseButton: false,
                    showLearnmoreButton: false,
                    showProgress: false,
                    onConfirm: function onConfirm() {
                      $('#jupiterx-cp-register-api-input').val('');
                    }
                  });
                }
              });
            }
          }), _jupiterx_modal));

          popoverEvent();
        });

        // License revoke.
        $('#js__revoke-api-key-btn').on('click', function (event) {
          event.preventDefault();
          var revokingMode = $(this).data('revoking-mode') || 'api';

          jupiterx_modal({
            title: jupiterx_cp_textdomain.revoke_API_key,
            text: jupiterx_cp_textdomain.you_are_about_to_remove_API_key,
            type: 'warning',
            showCancelButton: true,
            showConfirmButton: true,
            showLearnmoreButton: false,
            confirmButtonText: jupiterx_cp_textdomain.ok,
            cancelButtonText: jupiterx_cp_textdomain.cancel,
            closeOnConfirm: false,
            onConfirm: function onConfirm() {
              if ('api' === revokingMode) {
                var data = {
                  action: 'jupiterx_cp_register_revoke_api_action',
                  method: 'revoke',
                  security: $('#security').val()
                };

                $.post(_wpUtilSettings.ajax.url, data, function (res) {
                  res = JSON.parse(res);

                  if (res.status === true) {
                    window.location.reload();
                  }
                });
              } else {
                var data = {
                  action: 'jupiterx_revoke_license',
                  nonce: $('#license-manager-nonce').val()
                };

                jupiterx_modal({
                  type: '',
                  title: jupiterx_cp_textdomain.license_manager_revoking_title,
                  text: jupiterx_cp_textdomain.wait_for_api_key_revoke,
                  cancelButtonText: jupiterx_cp_textdomain.discard,
                  showCancelButton: false,
                  showConfirmButton: false,
                  showCloseButton: false,
                  showLearnmoreButton: false,
                  showProgress: true,
                  indefiniteProgress: true,
                  progress: '100%'
                });

                $.post(_wpUtilSettings.ajax.url, data, function (res) {
                  if (res.success === true) {
                    window.location.reload();
                  } else {
                    jupiterx_modal({
                      title: jupiterx_cp_textdomain.license_manager_revoking_error,
                      text: res.data.message,
                      type: 'error',
                      showCancelButton: false,
                      showConfirmButton: true,
                      showCloseButton: false,
                      showLearnmoreButton: false,
                      showProgress: false,
                      onConfirm: function onConfirm() {
                        window.location.reload();
                      }
                    });
                  }
                });
              }
            }
          });
        });
      }
    }]);

    return SectionHome;
  }();

  var SectionTemplates = function () {
    function SectionTemplates() {
      _classCallCheck(this, SectionTemplates);

      this.init();
      this.events();
    }

    _createClass(SectionTemplates, [{
      key: 'init',
      value: function init() {
        if (jupiterx.templates) {
          jupiterx.templates.init({
            customImport: true
          });
        }

        this.templateInstalled();
      }
    }, {
      key: 'events',
      value: function events() {
        var self = this;

        $(document).on('click', '#js__cp_template_uninstall', function (event) {
          event.preventDefault();
          var $this = $(this);

          jupiterx_modal({
            title: jupiterx_cp_textdomain.important_notice,
            text: jupiterx_cp_textdomain.uninstalling_template_will_remove_all_your_contents_and_settings,
            type: 'warning',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: jupiterx_cp_textdomain.yes_uninstall + $this.data('title'),
            showCloseButton: false,
            showLearnmoreButton: false,
            onConfirm: function onConfirm() {
              self.uninstallTemplate();
            }
          });
        });

        $(document).on('click', '#js__restore-template-btn', function (event) {
          event.preventDefault();
          self.restoreBackup();
        });

        $(window).on('template-installed', function (event, template) {
          if (!template.partial) {
            self.templateInstalled(template.title, template.id);
            self.restoreButton();
          }
        });
      }
    }, {
      key: 'uninstallTemplate',
      value: function uninstallTemplate() {
        jupiterx_modal({
          title: jupiterx_cp_textdomain.uninstalling_Template,
          text: jupiterx_cp_textdomain.please_wait_for_few_moments,
          type: '',
          showCancelButton: false,
          showConfirmButton: false,
          showCloseButton: false,
          showLearnmoreButton: false,
          showProgress: true,
          progress: '100%'
        });

        // requestsPending = 1;
        $.post(_wpUtilSettings.ajax.url, {
          action: 'abb_uninstall_template'
        }).done(function () {
          $('#js__installed-template-wrap').hide();

          jupiterx_modal({
            title: jupiterx_cp_textdomain.hooray,
            text: jupiterx_cp_textdomain.template_uninstalled,
            type: 'success',
            showCancelButton: false,
            showConfirmButton: true,
            showCloseButton: false,
            showLearnmoreButton: false
          });

          jupiterxTemplates.template = null;
          // requestsPending = false;
        }).fail(function (data) {
          console.log('Failed msg : ', data);
          // requestsPending = false;
        });
      }
    }, {
      key: 'templateInstalled',
      value: function templateInstalled(slug, id) {
        var self = this;
        var template = $('#js__installed-template');

        if (!template.length) {
          return;
        }

        if (!slug) {
          slug = template.data('installed-template');
        }

        if (!id) {
          id = template.data('installed-template-id');
        }

        if (slug <= 0 && id <= 0) {
          return;
        }

        var data = {
          action: 'abb_template_lazy_load',
          from: 0,
          count: 1,
          template_id: id,
          template_name: slug
        };

        $.post(_wpUtilSettings.ajax.url, data, function (res) {
          if (res.status === true && res.data.templates.length > 0) {
            $.each(res.data.templates, function (key, val) {
              $('#js__installed-template-wrap').show();
              template.attr('data-installed-template-id', val.id).attr('data-installed-template', val.slug).empty().append(self.templateUI(val));
            });
          }
        });
      }
    }, {
      key: 'templateUI',
      value: function templateUI(data) {
        return '\n        <div class="jupiterx-cp-template-item">\n          <div class="jupiterx-cp-template-item-inner jupiterx-card">\n            <figure class="jupiterx-cp-template-item-fig">\n              <img src="' + data.img_url + '" alt="' + data.name + '">\n            </figure>\n            <div class="jupiterx-cp-template-item-meta jupiterx-card-body">\n              <h4 class="jupiterx-cp-template-item-name text-truncate" title="' + data.name.replace(' Jupiterx', '') + '">' + data.name.replace(' Jupiterx', '') + '</h4>\n              <div class="jupiterx-cp-template-item-buttons ' + (data.psd_file ? ' has-psd' : '') + '">\n                <a id="js__cp_template_uninstall" class="btn btn-outline-danger mr-2 jupiterx-cp-template-item-btn" href="#" data-title="' + data.name.replace(' Jupiterx', '') + '" data-name="' + data.name + '" data-slug="' + data.slug + '" data-id="' + data.id + '">' + jupiterx_cp_textdomain.remove + '</a>\n                <a class="btn btn-outline-secondary mr-2 jupiterx-cp-template-item-btn" href="https://jupiterx.artbees.net/' + data.slug.replace('-jupiterx', '') + '" target="_blank">' + jupiterx_cp_textdomain.preview + '</a>\n              </div>\n            </div>\n          </div>\n        </div>\n      ';
      }
    }, {
      key: 'restoreButton',
      value: function restoreButton() {
        var data = {
          action: 'abb_is_restore_db'
        };

        $.ajax({
          type: 'POST',
          url: _wpUtilSettings.ajax.url,
          data: data,
          dataType: 'json',
          success: function success(res) {
            var data = res.data;
            var backups = [];
            var latestBackup = null;
            var createdDate = '';

            if (data.hasOwnProperty('list_of_backups')) {
              backups = data.list_of_backups;

              if (backups === null) {
                console.log('List Of Backups is NULL!');
              } else if (backups.length === 0) {
                console.log('List Of Backups is EMPTY!');
              } else {
                latestBackup = data.latest_backup_file;
                createdDate = latestBackup.created_date;
                $('#js__backup-date').text(createdDate);
                $('#js__restore-template-wrap').addClass('is-active');
                console.log('Restore Buttons Created Successfully!');
              }
            } else {
              console.log('No backup files found!');
            }
          },
          error: function error(req, status, _error) {
            console.log('Fail: ', req);
          }
        });
      }
    }, {
      key: 'restoreBackup',
      value: function restoreBackup() {
        $.ajax({
          type: 'POST',
          url: _wpUtilSettings.ajax.url,
          data: {
            action: 'abb_is_restore_db'
          },
          dataType: 'json',
          success: function success(res) {
            var createdDate = res.data.latest_backup_file.created_date;

            jupiterx_modal({
              title: jupiterx_cp_textdomain.restore_settings,
              text: '<p>' + jupiterx_cp_textdomain.you_are_trying_to_restore_your_theme_settings_to_this_date + '<strong class=\'jupiterx-tooltip-restore--created-date\'>' + createdDate + '</strong>. ' + jupiterx_cp_textdomain.are_you_sure + '</p>',
              type: 'warning',
              showCancelButton: true,
              showConfirmButton: true,
              confirmButtonText: jupiterx_cp_textdomain.restore,
              showCloseButton: false,
              showLearnmoreButton: false,
              onConfirm: function onConfirm() {
                jupiterx_modal({
                  title: jupiterx_cp_textdomain.restoring_database,
                  text: jupiterx_cp_textdomain.please_wait_for_few_moments,
                  type: '',
                  showCancelButton: false,
                  showConfirmButton: false,
                  showCloseButton: false,
                  showLearnmoreButton: false,
                  progress: '100%',
                  showProgress: true,
                  indefiniteProgress: true
                });

                $.ajax({
                  type: "POST",
                  url: _wpUtilSettings.ajax.url,
                  data: {
                    action: 'abb_restore_latest_db'
                  },
                  dataType: "json",
                  success: function success(res) {
                    if (res.status) {
                      jupiterx_modal({
                        title: res.message,
                        text: jupiterx_cp_textdomain.restore_ok,
                        type: 'success',
                        showCancelButton: false,
                        showConfirmButton: true,
                        showCloseButton: false,
                        showLearnmoreButton: false,
                        showProgress: false,
                        indefiniteProgress: true,
                        confirmButtonText: jupiterx_cp_textdomain.reload_page,
                        onConfirm: function onConfirm() {
                          location.reload();
                        }
                      });
                    } else {
                      jupiterx_modal({
                        title: jupiterx_cp_textdomain.something_went_wrong,
                        text: res.message,
                        type: 'error',
                        showCancelButton: false,
                        showConfirmButton: true,
                        showLearnmoreButton: false
                      });
                    }
                  },

                  error: function error(req, status, _error2) {
                    console.log('Fail: ', req);
                  }
                });
              }
            });
          },
          error: function error(req, status, _error3) {
            console.log('Fail: ', req);
          }
        });
      }
    }]);

    return SectionTemplates;
  }();

  var SectionSettings = function () {
    function SectionSettings() {
      _classCallCheck(this, SectionSettings);

      this.events();
    }

    _createClass(SectionSettings, [{
      key: 'events',
      value: function events() {
        var self = this;

        $('.jupiterx-cp-settings-flush').on('click', function () {
          self.send('flush');
        });

        $('.jupiterx-cp-settings-form').on('submit', function (event) {
          event.preventDefault();
          var form = $(this);
          var fields = {};

          $.map(form.serializeArray(), function (v) {
            var name = v.name;
            var value = v.value;

            if (v.name.endsWith('[]')) {
              name = name.replace('[]', '');
              value = fields[name] || [];

              if (v.value) {
                value.push(v.value);
              }
            }

            fields[name] = value;
          });

          self.send('save', fields);
        });

        $('.jupiterx-image-uploader').each(function (i, node) {
          var element = $(node);
          var input = element.find('input');
          var del = element.find('.remove-button');
          var frame = wp.media({
            multiple: false,
            title: jupiterx_cp_textdomain.select_zip_file,
            button: {
              text: jupiterx_cp_textdomain.select
            }
          });

          frame.on('select', function () {
            var attachment = frame.state().get('selection').first().toJSON();
            input.val(attachment.url);
            element.addClass('has-image');
          });

          element.on('click', 'input, .upload-button', function () {
            event.preventDefault();
            if (frame) {
              frame.open();
              return;
            }

            frame.open();
          });

          del.on('click', function (event) {
            event.preventDefault();
            input.val('');
            element.removeClass('has-image');
          });
        });

        $('[data-for]').each(function (i, node) {
          var element = $(node);
          var input = $('input[type=checkbox][name=' + element.data('for') + ']');

          input.on('change', function () {
            element.toggleClass('hidden', !input.is(':checked'));
          });
        });
      }
    }, {
      key: 'send',
      value: function send(type) {
        var fields = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        var feedback = $('.jupiterx-cp-settings-' + type + '-feedback');
        var originalText = feedback.text();
        var revertFeedback = function revertFeedback() {
          setTimeout(function () {
            feedback.addClass('d-none text-muted').text(originalText);
          }, 3000);
        };

        // Show feedback.
        feedback.removeClass('d-none');

        wp.ajax.send('jupiterx_cp_settings', {
          data: {
            nonce: jupiterxControlPanel.nonce,
            type: type,
            fields: fields
          },
          success: function success(res) {
            feedback.removeClass('text-muted').addClass('text-success').text(res);
            revertFeedback();
          },
          error: function error(res) {
            feedback.removeClass('text-muted').addClass('text-danger').text(res);
            revertFeedback();
          }
        });
      }
    }]);

    return SectionSettings;
  }();

  var SectionSystemStatus = function () {
    function SectionSystemStatus() {
      _classCallCheck(this, SectionSystemStatus);

      this.events();
    }

    _createClass(SectionSystemStatus, [{
      key: 'events',
      value: function events() {
        var self = this;

        $('#jupiterx-mods-cleanup').on('click', function (event) {
          event.preventDefault();
          var $this = $(this);
          var data = {
            action: 'jupiterx_cp_cleanup_mods',
            nonce: $this.attr('data-nonce')
          };

          $this.replaceWith('\n          <span class="status-state">\n            <span class="jupiterx-cleanup-spinner spinner is-active"></span>\n          </span>\n        ');

          self.cleanupThemeMods(data);
        });

        $('.jupiterx-button--get-system-report').click(function () {
          var report = '';

          $('#jupiterx-cp-system-status thead, #jupiterx-cp-system-status tbody').each(function () {
            var $this = $(this);

            if ($this.is('thead')) {
              var label = $this.find('th:eq(0)').data('export-label') || $this.text();
              report = report + "\n### " + $.trim(label) + " ###\n\n";
            } else {
              $('tr', $this).each(function () {
                var $this = $(this);
                var label = $this.find('td:eq(0)').data('export-label') || $this.find('td:eq(0)').text();
                var name = $.trim(label).replace(/(<([^>]+)>)/ig, '');

                var value = $.trim($this.find('td:eq(2)').text().replace(/(\r\n\t|\n|\r|\t)/gm, ''));
                var valArr = value.split(', ');

                if (valArr.length > 1) {
                  var tempLine = '';

                  $.each(valArr, function (key, line) {
                    tempLine = tempLine + line + '\n';
                  });

                  value = tempLine;
                }

                report = report + '' + name + ': ' + value + "\n";
              });
            }
          });

          try {
            $('#jupiterx-textarea--get-system-report').slideDown();
            $('#jupiterx-textarea--get-system-report textarea').val(report).focus().select();
            return false;
          } catch (e) {
            console.log(e);
          }

          return false;
        });

        $('[data-jupiterx-ajax]').each(function () {
          var $this = $(this);
          var type = $this.data('jupiterxAjax');
          var feedbackIcon = $this.find('.status-state');
          var feedbackText = $this.find('.status-text');

          wp.ajax.send('jupiterx_cp_system_status', {
            data: {
              nonce: jupiterxControlPanel.nonce,
              type: type
            },
            success: function success() {
              feedbackIcon.html('<span class="status-invisible">True</span><span class="status-state status-true"></span>');
            },
            error: function error(res) {
              feedbackIcon.html('<span class="status-invisible">False</span><span class="status-state status-false"></span>');
              feedbackText.html(res);
            }
          });
        });
      }
    }, {
      key: 'cleanupThemeMods',
      value: function cleanupThemeMods(data) {
        var self = this;

        $.post(_wpUtilSettings.ajax.url, data, function (res) {
          if (res.success) {
            self.cleanupThemeMods(data);
          } else {
            $('.jupiterx-cleanup-spinner').replaceWith('\n            <span class="status-state">\n              <span class="status-invisible">True</span>\n              <span class="status-state status-true"></span>\n            </span>\n          ');
          }
        });
      }
    }]);

    return SectionSystemStatus;
  }();

  var SectionUpdates = function () {
    function SectionUpdates() {
      _classCallCheck(this, SectionUpdates);

      this.events();
    }

    _createClass(SectionUpdates, [{
      key: 'events',
      value: function events() {
        var self = this;

        $(document).on('click', '.js__cp_change_theme_version', this.updateTheme);
        $(document).on('click', '.release-download', this.releaseDownload);
      }
    }, {
      key: 'releaseDownload',
      value: function releaseDownload(event) {
        event.preventDefault();
        event.stopPropagation();

        var $this = $(this);
        var status = $this.attr('status') || 'active';

        if (status === 'active') {
          var releaseId = $this.data('release-id');
          var releasePackage = $this.data('release-package');
          var nonce = $this.data('nonce');

          $this.attr('status', 'deactive');

          setTimeout(function () {
            $this.attr('status', 'active');
          }, 9000);

          jQuery.ajax({
            url: _wpUtilSettings.ajax.url,
            type: 'POST',
            data: {
              security: nonce,
              release_id: releaseId,
              release_package: releasePackage,
              action: 'jupiterx_get_theme_release_package_url'
            },
            success: function success(res) {
              if (res.success) {
                top.location.href = res.data;
              }
            },
            error: function error(res) {
              console.log(res);
              alert('An error occurred.');
            }
          });
        }
      }
    }, {
      key: 'updateTheme',
      value: function updateTheme(event) {
        event.preventDefault();

        var $this = $(this);
        var releaseId = $this.data('release-id');
        var releaseVersion = $this.data('release-version');
        var nonce = $this.data('nonce');
        var feedback = $this.siblings('.jupiterx-cp-update-feedback');

        jupiterx_modal({
          title: jupiterx_cp_textdomain.please_note,
          text: jupiterx_cp_textdomain.any_customisation_you_have_made_to_theme_files_will_be_lost,
          type: 'warning',
          showCancelButton: true,
          showConfirmButton: true,
          confirmButtonText: jupiterx_cp_textdomain.agree,
          cancelButtonText: jupiterx_cp_textdomain.discard,
          learnmoreTarget: '_blank',
          learnmoreLabel: 'Read More',
          learnmoreButton: 'https://intercom.help/artbees?q=Update+jupiter+x',
          showCloseButton: true,
          showLearnmoreButton: true,
          onConfirm: function onConfirm() {
            var errors = [{
              text: jupiterx_cp_textdomain.apikey_domain_match_error,
              helpLink: '<a href="https://themes.artbees.net/docs/updating-jupiter-x-theme-automatically/" target="_blank">' + jupiterx_cp_textdomain.learn_more + '</a>'
            }];

            var errorHelpLink = function errorHelpLink(text) {
              var error = _.findWhere(errors, { text: text });
              return error ? error.helpLink : '';
            };

            feedback.removeClass('d-none');
            $this.addClass('disabled loading');

            wp.ajax.send('jupiterx_modify_auto_update', {
              data: {
                security: nonce,
                release_id: releaseId,
                release_version: releaseVersion
              },
              success: function success() {
                wp.updates.ajax('update-theme', {
                  slug: 'jupiterx-lite',
                  success: function success() {
                    feedback.removeClass('text-muted').addClass('text-success').text(jupiterx_cp_textdomain.theme_update_success);
                    $this.removeClass('disabled loading');
                    window.location.reload();
                  },
                  error: function error() {
                    feedback.removeClass('text-muted').addClass('text-danger').text(jupiterx_cp_textdomain.theme_update_failed);
                    $this.removeClass('disabled loading');
                  }
                });
              },
              error: function error(res) {
                $this.removeClass('disabled loading');
                feedback.removeClass('text-muted').addClass('text-danger').html(res + ' ' + errorHelpLink(res));
              }
            });
          }
        });
      }
    }]);

    return SectionUpdates;
  }();

  var SectionImageSizes = function () {
    function SectionImageSizes() {
      _classCallCheck(this, SectionImageSizes);

      this.events();
    }

    _createClass(SectionImageSizes, [{
      key: 'events',
      value: function events() {
        var self = this;

        $('.js__cp-clist-add-item').on('click', function (event) {
          event.preventDefault();
          self.add();
        });

        $('.js__cp-clist-edit-item').on('click', function (event) {
          event.preventDefault();
          self.edit($(this));
        });

        $('.js__cp-clist-remove-item').on('click', function (event) {
          event.preventDefault();
          self.remove($(this));
        });
      }
    }, {
      key: 'add',
      value: function add() {
        var self = this;
        var html = '';
        html += '<div class="jupiterx-modal-header">';
        html += '<span class="jupiterx-modal-icon"></span>';
        html += '<h3 class="jupiterx-modal-title">' + jupiterx_cp_textdomain.add_image_size + '</h3>';
        html += '</div>';
        html += '<div class="jupiterx-modal-desc">';
        html += '<div class="form-group mb-3">';
        html += '<label><strong>' + jupiterx_cp_textdomain.image_size_name + '</strong></label>';
        html += '<input class="jupiterx-form-control" name="size_n" type="text" required />';
        html += '</div>';
        html += '<div class="form-row">';
        html += '<div class="form-group col-md-6">';
        html += '<label><strong>' + jupiterx_cp_textdomain.image_size_width + '</strong></label>';
        html += '<input class="jupiterx-form-control" min="100" name="size_w" step="1" type="number" required />';
        html += '</div>';
        html += '<div class="form-group col-md-6">';
        html += '<label><strong>' + jupiterx_cp_textdomain.image_size_height + '</strong></label>';
        html += '<input class="jupiterx-form-control" min="100" name="size_h" id="size_h" step="1" type="number" required />';
        html += '</div>';
        html += '</div>';
        html += '<div class="custom-control custom-checkbox form-group mb-3">';
        html += '<input type="checkbox" class="custom-control-input" id="size_c" name="size_c" checked="checked">';
        html += '<label class="custom-control-label" for="size_c"><strong>' + jupiterx_cp_textdomain.image_size_crop + '</strong></label>';
        html += '</div>';
        html += '</div>';

        var modal = jupiterx_modal({
          modalCustomClass: 'js__add-new-image-size',
          type: 'warning',
          html: $(html),
          showCloseButton: true,
          showConfirmButton: true,
          showCancelButton: true,
          closeOnOutsideClick: true,
          closeOnConfirm: false,
          confirmButtonText: jupiterx_cp_textdomain.save,
          cancelButtonText: jupiterx_cp_textdomain.discard,
          onConfirm: function onConfirm() {
            self.apply(false, modal);
          }
        });
      }
    }, {
      key: 'edit',
      value: function edit(element) {
        var self = this;
        var $this = element;
        var $this_size_item = $this.closest('.js__cp-image-size-item');
        var $this_box = $this.closest('.jupiterx-card-body');
        var $size_name = $this_box.find('[name=size_n]').val();
        var $size_width = $this_box.find('[name=size_w]').val();
        var $size_height = $this_box.find('[name=size_h]').val();
        var $size_crop = $this_box.find('[name=size_c]').val();
        $size_crop = $size_crop === 'on' ? 'checked="checked"' : false;

        var custom_html = '';
        custom_html += '<div class="jupiterx-modal-header">';
        custom_html += '<span class="jupiterx-modal-icon"></span>';
        custom_html += '<h3 class="jupiterx-modal-title">' + jupiterx_cp_textdomain.edit_image_size + '</h3>';
        custom_html += '</div>';
        custom_html += '<div class="jupiterx-modal-desc">';
        custom_html += '<div class="form-group mb-3">';
        custom_html += '<label><strong>' + jupiterx_cp_textdomain.image_size_name + '</strong></label>';
        custom_html += '<input class="jupiterx-form-control" name="size_n" type="text" value="' + $size_name + '" required />';
        custom_html += '</div>';
        custom_html += '<div class="form-row">';
        custom_html += '<div class="form-group col-md-6">';
        custom_html += '<label><strong>' + jupiterx_cp_textdomain.image_size_width + '</strong></label>';
        custom_html += '<input class="jupiterx-form-control" min="100" name="size_w" step="1" type="number"  value="' + $size_width + '" required />';
        custom_html += '</div>';
        custom_html += '<div class="form-group col-md-6">';
        custom_html += '<label><strong>' + jupiterx_cp_textdomain.image_size_height + '</strong></label>';
        custom_html += '<input class="jupiterx-form-control" min="100" name="size_h" id="size_h" step="1" type="number"  value="' + $size_height + '" required />';
        custom_html += '</div>';
        custom_html += '</div>';
        custom_html += '<div class="custom-control custom-checkbox form-group mb-3">';
        custom_html += '<input type="checkbox" class="custom-control-input" id="size_c" name="size_c" ' + $size_crop + '>';
        custom_html += '<label class="custom-control-label" for="size_c"><strong>' + jupiterx_cp_textdomain.image_size_crop + '</strong></label>';
        custom_html += '</div>';
        custom_html += '</div>';

        var modal = jupiterx_modal({
          modalCustomClass: 'js__add-new-image-size',
          type: 'warning',
          html: $(custom_html),
          showCloseButton: true,
          showConfirmButton: true,
          showCancelButton: true,
          closeOnOutsideClick: true,
          closeOnConfirm: false,
          confirmButtonText: jupiterx_cp_textdomain.save,
          cancelButtonText: jupiterx_cp_textdomain.discard,
          onConfirm: function onConfirm() {
            self.apply($this_size_item, modal);
          }
        });
      }
    }, {
      key: 'remove',
      value: function remove(element) {
        var self = this;
        var $this = element;

        jupiterx_modal({
          title: jupiterx_cp_textdomain.remove_image_size,
          text: jupiterx_cp_textdomain.are_you_sure_remove_image_size,
          type: 'warning',
          showCancelButton: true,
          showConfirmButton: true,
          showCloseButton: false,
          showLearnmoreButton: false,
          onConfirm: function onConfirm() {
            var $list_item = $this.closest('.jupiterx-img-size-item');
            $list_item.remove();
            self.save();
          }
        });
      }
    }, {
      key: 'apply',
      value: function apply(addSize, modal) {
        var self = this;
        var custom_html = '';
        var $modal = $('.js__add-new-image-size');
        var $size_name = $modal.find('[name=size_n]');
        var $size_width = $modal.find('[name=size_w]');
        var $size_height = $modal.find('[name=size_h]');
        var $size_name_val = $modal.find('[name=size_n]').val();
        var $size_width_val = $modal.find('[name=size_w]').val();
        var $size_height_val = $modal.find('[name=size_h]').val();
        var $size_crop = $modal.find('[name=size_c]:checked').val();

        $size_crop = $size_crop == 'on' ? 'on' : 'off';
        var crop_class = $size_crop == 'on' ? 'status-true' : 'status-false';

        if ($size_name_val == '') {
          $size_name.addClass('is-invalid');
          return;
        } else {
          $size_name.removeClass('is-invalid');
        }

        if ($size_width_val == '') {
          $size_width.addClass('is-invalid');
          return;
        } else {
          $size_width.removeClass('is-invalid');
        }

        if ($size_height_val == '') {
          $size_height.addClass('is-invalid');
          return;
        } else {
          $size_height.removeClass('is-invalid');
        }

        custom_html += '<div class="jupiterx-img-size-item js__cp-image-size-item">';
        custom_html += '<div class="jupiterx-img-size-item-inner jupiterx-card">';
        custom_html += '<div class="jupiterx-card-body fetch-input-data">';
        custom_html += '<div class="js__size-name mb-3"><strong>' + jupiterx_cp_textdomain.size_name + ':</strong> ' + $size_name_val + '</div>';
        custom_html += '<div class="js__size-dimension mb-3"><strong>' + jupiterx_cp_textdomain.image_size + ':</strong> ' + $size_width_val + 'px ' + $size_height_val + 'px</div>';
        custom_html += '<div class="js__size-crop mb-3"><strong>' + jupiterx_cp_textdomain.crop + ':</strong><span class="status-state ' + crop_class + '"></span></div>';
        custom_html += '<button type="button" class="btn btn-outline-success js__cp-clist-edit-item mr-1">' + jupiterx_cp_textdomain.edit + '</button>';
        custom_html += '<button type="button" class="btn btn-outline-danger js__cp-clist-remove-item">' + jupiterx_cp_textdomain.remove + '</button>';
        custom_html += '<input name="size_n" type="hidden" value="' + $size_name_val + '" />';
        custom_html += '<input name="size_w" type="hidden" value="' + $size_width_val + '" />';
        custom_html += '<input name="size_h" type="hidden" value="' + $size_height_val + '" />';
        custom_html += '<input name="size_c" type="hidden" value="' + $size_crop + '" />';
        custom_html += '</div>';
        custom_html += '</div>';

        if (addSize.length > 0) {
          addSize.after(custom_html);
          addSize.remove();
        } else {
          $('.js__jupiterx-img-size-list').append(custom_html);
        }

        modal.close();
        self.events();
        self.save();
      }
    }, {
      key: 'save',
      value: function save() {
        var $container = $('.js__jupiterx-img-size-list');
        var serialized = [];

        $container.find('.js__cp-image-size-item').each(function () {
          serialized.push($(this).find('.fetch-input-data input').serialize());
        });

        var savingImageSizes = jupiterx_modal({
          title: jupiterx_cp_textdomain.saving_image_size,
          text: jupiterx_cp_textdomain.wait_for_image_size_update,
          type: '',
          showCancelButton: false,
          showConfirmButton: false,
          showCloseButton: false,
          showLearnmoreButton: false,
          progress: '100%',
          showProgress: true,
          indefiniteProgress: true
        });

        jQuery.ajax({
          url: _wpUtilSettings.ajax.url,
          type: 'POST',
          data: {
            action: 'jupiterx_save_image_sizes',
            options: serialized,
            security: $('#security').val()
          },
          success: function success(res) {
            savingImageSizes.close();

            if (res != 1) {
              jupiterx_modal({
                title: jupiterx_cp_textdomain.something_went_wrong,
                text: jupiterx_cp_textdomain.image_sizes_could_not_be_stored,
                type: 'error',
                showCancelButton: false,
                showConfirmButton: true,
                showCloseButton: false,
                showLearnmoreButton: false
              });
            }
          },
          error: function error(res) {
            console.log(res);

            jupiterx_modal({
              type: 'error',
              title: jupiterx_cp_textdomain.error,
              text: res + ' ' + jupiterx_cp_textdomain.issue_persists,
              showCancelButton: false,
              showConfirmButton: true,
              showCloseButton: false,
              showLearnmoreButton: false,
              showProgress: false,
              closeOnConfirm: false,
              confirmButtonText: jupiterx_cp_textdomain.try_again,
              closeOnOutsideClick: false,
              onConfirm: function onConfirm() {
                window.location.reload();
              }
            });
          }
        });
      }
    }]);

    return SectionImageSizes;
  }();

  var SectionExportImport = function () {
    function SectionExportImport() {
      _classCallCheck(this, SectionExportImport);

      this.steps = [];
      this.modal = '';
      this.cancel = '';
      this.data = {};
      this.attachmentId = '';
      this.events();
    }

    _createClass(SectionExportImport, [{
      key: 'events',
      value: function events() {
        var self = this;

        $('.jupiterx-cp-export-form').on('submit', function (event) {
          event.preventDefault();
          self.export($(this));
        });

        $('.jupiterx-cp-import-btn').on('click', function (event) {
          event.preventDefault();
          self.import();
        });

        $('.jupiterx-cp-import-upload-btn').on('click', function (event) {
          event.preventDefault();
          self.upload(event);
        });
      }
    }, {
      key: 'export',
      value: function _export(element) {
        var self = this;
        self.steps = [];
        self.modal = '';
        self.cancel = '';

        var options = element.serializeArray();
        self.data.filename = options[0].value;

        // Remove filename from options.
        options = _.reject(options, function (option) {
          return option.name == 'filename';
        });

        // Convert options to a flat array.
        if (!self._mapOptions(options)) {
          return;
        }

        // Open the modal.
        self.modal = jupiterx_modal({
          type: false,
          title: jupiterx_cp_textdomain.exporting + ' <span class="cp-export-step">' + self.steps[1] + '</span>...',
          text: jupiterx_cp_textdomain.export_waiting,
          showCancelButton: true,
          showConfirmButton: false,
          showCloseButton: false,
          showLearnmoreButton: false,
          showProgress: true,
          progress: '100%',
          indefiniteProgress: true,
          cancelButtonText: jupiterx_cp_textdomain.discard,
          closeOnConfirm: false,
          closeOnOutsideClick: false,
          onCancel: function onCancel() {
            self.steps = [];
            self.cancel = true;
            self.send('Export', 'Discard');
            self.modal.close();
          }
        });

        // Init the first step.
        self.send('Export', _.first(self.steps));
      }
    }, {
      key: 'import',
      value: function _import() {
        var self = this;
        self.steps = [];
        self.modal = '';
        self.cancel = '';

        var attachmentId = $('.jupiterx-cp-import-wrap .jupiterx-form-control').data('id');

        // Return false if no package is selected.
        if ('undefined' === typeof attachmentId) {
          return false;
        }

        self.attachmentId = attachmentId;

        self.modal = jupiterx_modal({
          type: false,
          title: 'Import',
          text: '\n          ' + jupiterx_cp_textdomain.import_select_options + '\n          <form class="jupiterx-cp-import-form">\n            <label>\n              <input type="checkbox" name="check" value="Content" checked>\n              ' + jupiterx_cp_textdomain.site_content + '\n            </label>\n            <label>\n              <input type="checkbox" name="check" value="Widgets" checked>\n              ' + jupiterx_cp_textdomain.widgets + '\n            </label>\n            <label>\n              <input type="checkbox" name="check" value="Settings" checked>\n              ' + jupiterx_cp_textdomain.settings + '\n            </label>\n          </form>\n        ',
          showCancelButton: false,
          showConfirmButton: true,
          showCloseButton: true,
          showLearnmoreButton: false,
          showProgress: false,
          closeOnConfirm: false,
          confirmButtonText: jupiterx_cp_textdomain.import,
          onConfirm: function onConfirm() {
            var options = $('.jupiterx-cp-import-form').serializeArray();

            // Convert options to a flat array.
            if (!self._mapOptions(options)) {
              return;
            }

            jupiterx_modal({
              type: false,
              title: jupiterx_cp_textdomain.importing + ' <span class="cp-export-step">' + self.steps[1] + '</span>...',
              text: jupiterx_cp_textdomain.import_waiting,
              showCancelButton: true,
              showConfirmButton: false,
              showCloseButton: false,
              showLearnmoreButton: false,
              progress: '100%',
              showProgress: true,
              indefiniteProgress: true,
              cancelButtonText: jupiterx_cp_textdomain.discard,
              closeOnOutsideClick: false,
              closeOnConfirm: false,
              onCancel: function onCancel() {
                self.steps = [];
                self.cancel = true;
                self.send('Import', 'Discard');
                self.modal.close();
              }
            });

            // Init the first step.
            self.send('Import', _.first(self.steps));
          }
        });
      }
    }, {
      key: 'upload',
      value: function upload(event) {
        var frame = void 0;
        var $input = $(event.target).parents('.jupiterx-upload-wrap').find('input');

        if (frame) {
          frame.open();
          return;
        }

        frame = wp.media({
          multiple: false, // Set to true to allow multiple files to be selected
          title: jupiterx_cp_textdomain.select_zip_file,
          button: {
            text: jupiterx_cp_textdomain.select
          }
        });

        // When an image is selected in the media frame...
        frame.on('select', function () {
          var attachment = frame.state().get('selection').first().toJSON();
          $input.attr('data-id', attachment.id);
          $input.val(attachment.url);
        });

        frame.open();
      }
    }, {
      key: 'send',
      value: function send(type, step) {
        var self = this;

        wp.ajax.send('jupiterx_cp_export_import', {
          data: {
            nonce: jupiterxControlPanel.nonce,
            type: type,
            step: step,
            attachment_id: self.attachmentId,
            data: self.data
          },
          success: function success(res) {
            self.steps = _.without(self.steps, res.step);
            var firstStep = _.first(self.steps);

            // Open the download modal.
            if (!self.steps.length) {
              if (true === self.cancel) {
                return;
              }

              var confirmButtonText = 'Export' === type ? jupiterx_cp_textdomain.download : jupiterx_cp_textdomain.close;

              jupiterx_modal({
                type: 'success',
                title: type + ' ' + jupiterx_cp_textdomain.done,
                text: type + ' ' + jupiterx_cp_textdomain.successfully_finished,
                showCancelButton: false,
                showConfirmButton: true,
                showCloseButton: false,
                showLearnmoreButton: false,
                showProgress: false,
                closeOnConfirm: false,
                confirmButtonText: confirmButtonText,
                onConfirm: function onConfirm() {
                  if ('Export' === type) {
                    window.location.href = res.download_url;
                  }
                  self.modal.close();
                }
              });

              return;
            }

            // Update title in modal except Start one.
            if (res.step !== 'Start') {
              $('.cp-export-step').text(res.step);
            }

            // Init the next step.
            self.send(type, firstStep);
          },
          error: function error(res) {
            console.log(res);

            jupiterx_modal({
              type: 'error',
              title: jupiterx_cp_textdomain.error,
              text: res + ' ' + jupiterx_cp_textdomain.issue_persists,
              showCancelButton: false,
              showConfirmButton: true,
              showCloseButton: false,
              showLearnmoreButton: false,
              showProgress: false,
              closeOnConfirm: false,
              confirmButtonText: jupiterx_cp_textdomain.try_again,
              onConfirm: function onConfirm() {
                window.location.reload();
                self.modal.close();
              }
            });
          }
        });
      }
    }, {
      key: '_mapOptions',
      value: function _mapOptions(options) {
        var self = this;

        // Convert options to a flat array.
        _.map(options, function (option) {
          return self.steps.push(option.value);
        });

        // Return false if no option is selected.
        if (!self.steps.length) {
          return false;
        }

        self.steps.unshift('Start');
        self.steps.push('End');
        return true;
      }
    }]);

    return SectionExportImport;
  }();

  var SectionPlugins = function () {
    function SectionPlugins() {
      _classCallCheck(this, SectionPlugins);

      this.pluginList = [];
      this.init();
    }

    _createClass(SectionPlugins, [{
      key: 'init',
      value: function init() {
        var self = this;

        // Get plugins list.
        self.getPluginsList();

        $(document).on('click', '.abb_plugin_activate', function (event) {
          event.preventDefault();
          self.activateInit($(this));
        });

        $(document).on('click', '.abb_plugin_install', function (event) {
          event.preventDefault();
          self.installInit($(this));
        });

        $(document).on('click', '.abb_plugin_deactivate', function (event) {
          event.preventDefault();
          self.deactivateInit($(this));
        });

        $(document).on('click', '.abb_plugin_delete', function (event) {
          event.preventDefault();
          self.deleteInit($(this));
        });

        $(document).on('click', '.abb_plugin_update', function (event) {
          event.preventDefault();
          self.updateInit($(this));
        });

        $(document).on('click', '.jupiterx-cp-plugins-filter > .btn', function (event) {
          event.preventDefault();
          self.filtersInit($(this));
        });
      }
    }, {
      key: 'getPluginsList',
      value: function getPluginsList() {
        var self = this;
        var data = {
          action: 'abb_get_plugins'
        };

        $.post(_wpUtilSettings.ajax.url, data, function (res) {
          $('#js__jupiterx-plugins').html('');
          self.pluginList = res;

          if (res.hasOwnProperty('limit')) {
            $('#js__jupiterx-plugins').attr('data-plugins-limit', res.limit);
          }

          $.each(res.plugins, function (key, val) {
            $('#js__jupiterx-plugins').append(self.getPluginsTemplate(val));
          });

          $('.jupiterx-cp-plugins-filter > .btn').prop('disabled', '');

          if ('undefined' !== typeof localStorage) {
            var activeFilter = localStorage.getItem('activeFilter');
            $('.jupiterx-cp-plugins-filter > .btn[data-filter=' + activeFilter + ']').trigger('click');
          }
        });
      }
    }, {
      key: 'getPluginsTemplate',
      value: function getPluginsTemplate(plugin) {
        var self = this;
        var buttons = self.getPluginActionBtns(plugin);
        var dataFilter = plugin.active === true ? 'active' : 'inactive';
        var dataUpdate = plugin.update_needed === true && plugin.installed ? 'yes' : 'no';
        var cloudClass = plugin.installed ? '' : 'jupiterx-icon-cloud';

        return '\n        <div class="jupiterx-cp-plugin-item" data-filter="' + dataFilter + '" data-update="' + dataUpdate + '">\n          <div class="jupiterx-cp-plugin-item-inner jupiterx-card">\n            ' + (plugin.pro ? '<img class="jupiterx-pro-badge" src="' + jupiterxControlPanel.proBadgeUrl + '" />' : '') + '\n            <div class="jupiterx-card-body">\n              <figure class="jupiterx-cp-plugin-item-thumb ' + cloudClass + '">\n                <img src="' + plugin.img_url + '">\n              </figure>\n              <div class="jupiterx-cp-plugin-meta-wrapper">\n                <span class="jupiterx-cp-plugin-item-version">\n                  v<span class="item-version-tag">' + plugin.version + '</span>\n                </span>\n              </div>\n              <div class="jupiterx-cp-plugin-item-meta">\n                <div class="jupiterx-cp-plugin-item-name">' + plugin.name + '</div>\n                <div class="jupiterx-cp-plugin-item-desc">\n                  ' + plugin.desc + '\n                  ' + (plugin.more_link ? '<a href="' + plugin.more_link + '" target="_blank">Learn More</a>' : '') + '\n                </div>\n              </div>\n              ' + buttons + '\n            </div>\n          </div>\n        </div>\n      ';
      }
    }, {
      key: 'getPluginActionBtns',
      value: function getPluginActionBtns(plugin) {
        var self = this;
        var isMultisite = document.body.classList.contains('multisite');

        if (!plugin.installed) {
          if (plugin.pro) {
            return self.getProBtn();
          }

          var classes = plugin.install_disabled ? 'disabled' : '';
          return self.getInstallBtn(plugin.slug, plugin.name, plugin.url, classes);
        }

        if (plugin.network_active) {
          return self.getNetworkActiveLabel();
        }

        var btns = '';

        if (plugin.active === true) {
          btns += self.getDeactivateBtn(plugin.slug, plugin.name, plugin.basename);
        } else {
          btns += self.getActivateBtn(plugin.slug, plugin.name, plugin.url);

          if (!isMultisite) {
            btns += self.getDeleteBtn(plugin.slug, plugin.name, plugin.basename);
          }
        }

        if (plugin.update_needed === true && !isMultisite) {
          btns += self.getUpdateBtn(plugin.slug, plugin.name, plugin.basename);
        }

        return btns;
      }
    }, {
      key: 'getProBtn',
      value: function getProBtn() {
        return '\n        <a class="btn btn-sm jupiterx-btn-upgrade-pro jupiterx-icon-pro" href="' + jupiterx_cp_textdomain.upgrade_url + '" target="_blank">\n          ' + jupiterx_cp_textdomain.upgrade + '\n        </a>\n      ';
      }
    }, {
      key: 'getNetworkActiveLabel',
      value: function getNetworkActiveLabel() {
        return '\n        <span class="btn btn-sm network-active" href="#">\n          ' + jupiterx_cp_textdomain.network_active + '\n        </span>\n      ';
      }
    }, {
      key: 'getInstallBtn',
      value: function getInstallBtn(pluginSlug, pluginName, actionURL, classes) {
        return '\n        <a class="btn btn-sm btn-outline-success jupiterx-icon-plus-circle-solid abb_plugin_install ' + classes + '" data-slug="' + pluginSlug + '" href="' + actionURL + '" data-name="' + pluginName + '">\n          ' + jupiterx_cp_textdomain.add + '\n        </a>\n      ';
      }
    }, {
      key: 'getUpdateBtn',
      value: function getUpdateBtn(slug, name, basename) {
        return '\n        <a class="btn btn-sm btn-outline-primary abb_plugin_update" data-basename="' + basename + '" data-slug="' + slug + '" href="#" data-name="' + name + '">\n          ' + jupiterx_cp_textdomain.update + '\n        </a>\n      ';
      }
    }, {
      key: 'getDeleteBtn',
      value: function getDeleteBtn(slug, name, basename) {
        return '\n        <a class="btn btn-sm btn-outline-danger jupiterx-icon-times-circle abb_plugin_delete" data-basename="' + basename + '" data-slug="' + slug + '" href="#" data-name="' + name + '">\n          ' + jupiterx_cp_textdomain.delete + '\n        </a>\n      ';
      }
    }, {
      key: 'getActivateBtn',
      value: function getActivateBtn(pluginSlug, pluginName, actionURL) {
        var self = this;
        var limit = self.getActivationLimit(pluginSlug);

        return '\n        <a class="btn btn-sm btn-primary abb_plugin_activate" data-slug="' + pluginSlug + '" href="' + actionURL + '" data-name="' + pluginName + '" data-limit="' + limit + '">\n          ' + jupiterx_cp_textdomain.activate + '\n        </a>\n      ';
      }
    }, {
      key: 'getDeactivateBtn',
      value: function getDeactivateBtn(slug, name, basename) {
        return '\n        <a class="btn btn-sm btn-danger abb_plugin_deactivate" data-basename="' + basename + '" data-slug="' + slug + '" href="#" data-name="' + name + '">\n          ' + jupiterx_cp_textdomain.deactivate + '\n        </a>\n      ';
      }
    }, {
      key: 'getActivationLimit',
      value: function getActivationLimit(slug) {
        var limits = $('#js__jupiterx-plugins').data('plugins-limit').split(',');

        if (limits.indexOf('num') > -1) {
          return true;
        }

        if (['layerslider', 'masterslider', 'revslider'].indexOf(slug) > -1 && limits.indexOf('sliders') > -1) {
          return true;
        }

        if (['jet-blog', 'jet-elements', 'jet-engine', 'jet-menu', 'jet-popup', 'jet-smart-filters', 'jet-tabs', 'jet-tricks', 'jet-woo-builder'].indexOf(slug) > -1 && limits.indexOf('jet-plugins') > -1) {
          return true;
        }

        return false;
      }
    }, {
      key: 'installInit',
      value: function installInit(element) {
        var self = this;
        var $this = element;
        var pluginName = $this.data('name');
        var pluginSlug = $this.data('slug');
        var actionURL = $this.attr('href');

        jupiterx_modal({
          title: jupiterx_cp_textdomain.install_plugin,
          text: self.language(jupiterx_cp_textdomain.you_are_about_to_install, [pluginName]),
          type: 'warning',
          showCancelButton: true,
          showConfirmButton: true,
          confirmButtonText: jupiterx_cp_textdomain.continue,
          showCloseButton: false,
          showLearnmoreButton: false,
          showProgress: false,
          closeOnOutsideClick: false,
          onConfirm: function onConfirm() {
            self.installStart(pluginSlug, pluginName, actionURL);
          }
        });
      }
    }, {
      key: 'installStart',
      value: function installStart(pluginSlug, pluginName, actionURL) {
        var self = this;

        jupiterx_modal({
          title: jupiterx_cp_textdomain.installing_plugin,
          text: jupiterx_cp_textdomain.wait_for_plugin_install,
          type: '',
          showCancelButton: false,
          showConfirmButton: false,
          showCloseButton: false,
          showLearnmoreButton: false,
          progress: '100%',
          showProgress: true,
          indefiniteProgress: true,
          closeOnOutsideClick: false
        });

        $.get({
          url: actionURL,
          success: function success(res) {
            if ($(res).find('p:contains(Plugin installed successfully.)').length || $(res).find('p:contains(Successfully installed the plugin)').length) {
              jupiterx_modal({
                title: jupiterx_cp_textdomain.plugin_is_successfully_installed,
                text: self.language(jupiterx_cp_textdomain.plugin_installed_successfully_message, [pluginName]),
                type: 'success',
                showCancelButton: false,
                showConfirmButton: true,
                showCloseButton: false,
                showLearnmoreButton: false,
                showProgress: false,
                onConfirm: function onConfirm() {
                  location.reload();
                }
              });
            } else {
              jupiterx_modal({
                title: jupiterx_cp_textdomain.something_went_wrong,
                text: jupiterx_cp_textdomain.something_wierd_happened_please_try_again,
                type: 'error',
                showCancelButton: false,
                showConfirmButton: true,
                showLearnmoreButton: false,
                onConfirm: function onConfirm() {
                  location.reload();
                }
              });
            }
          },
          error: function error(XMLHttpRequest, textStatus, errorThrown) {
            self.request_error_handling(XMLHttpRequest, textStatus, errorThrown);
          }
        });
      }
    }, {
      key: 'activateInit',
      value: function activateInit(element) {
        var self = this;
        var $this = element;
        var pluginSlug = $this.data('slug');
        var pluginName = $this.data('name');
        var actionURL = $this.attr('href');

        jupiterx_modal({
          title: jupiterx_cp_textdomain.activating_notice,
          text: self.language(jupiterx_cp_textdomain.are_you_sure_you_want_to_activate, [$this.data('name')]),
          type: 'warning',
          showCancelButton: true,
          showConfirmButton: true,
          confirmButtonText: jupiterx_cp_textdomain.continue,
          showCloseButton: false,
          showLearnmoreButton: false,
          showProgress: false,
          closeOnOutsideClick: false,
          onConfirm: function onConfirm() {
            if ($this.data('limit') === true) {
              jupiterx_modal({
                title: jupiterx_cp_textdomain.plugin_limit_warning,
                text: jupiterx_cp_textdomain.plugin_limit_warning_message + '<a href="https://help.artbees.net/maintenance/why-should-i-keep-my-active-plugins-at-minimum" target="_blank" class="jupiterx-modal-learn-more jupiterx-icon-question-circle" title="' + jupiterx_cp_textdomain.learn_more + '">' + jupiterx_cp_textdomain.learn_more + '</a>',
                type: 'warning',
                showCancelButton: true,
                showConfirmButton: true,
                confirmButtonText: jupiterx_cp_textdomain.continue,
                showCloseButton: false,
                showLearnmoreButton: false,
                showProgress: false,
                closeOnOutsideClick: false,
                onConfirm: function onConfirm() {
                  self.activateStart(pluginSlug, pluginName, actionURL);
                }
              });
            } else {
              self.activateStart(pluginSlug, pluginName, actionURL);
            }
          }
        });
      }
    }, {
      key: 'activateStart',
      value: function activateStart(pluginSlug, pluginName, actionURL) {
        var self = this;
        var $btn = $('.abb_plugin_activate[data-slug="' + pluginSlug + '"]');

        jupiterx_modal({
          title: jupiterx_cp_textdomain.activating_plugin,
          text: jupiterx_cp_textdomain.wait_for_plugin_activation,
          type: '',
          showCancelButton: false,
          showConfirmButton: false,
          showCloseButton: false,
          showLearnmoreButton: false,
          progress: '100%',
          showProgress: true,
          indefiniteProgress: true,
          closeOnOutsideClick: false
        });

        $.get({
          url: actionURL,
          success: function success(res) {
            if ($(res).find('#message.updated').length) {
              $btn.closest('.jupiterx-cp-plugin-item').attr('data-filter', 'active');
              $btn.siblings('.abb_plugin_delete').remove();
              $btn.replaceWith(self.getDeactivateBtn(pluginSlug, pluginName, actionURL));

              jupiterx_modal({
                title: jupiterx_cp_textdomain.all_done,
                text: self.language(jupiterx_cp_textdomain.item_is_successfully_activated, [pluginName]),
                type: 'success',
                showCancelButton: false,
                showConfirmButton: true,
                showCloseButton: false,
                showLearnmoreButton: false,
                showProgress: false,
                indefiniteProgress: true,
                closeOnOutsideClick: false,
                onConfirm: function onConfirm() {
                  location.reload();
                }
              });
            } else {
              jupiterx_modal({
                title: jupiterx_cp_textdomain.something_went_wrong,
                text: jupiterx_cp_textdomain.something_wierd_happened_please_try_again,
                type: 'error',
                showCancelButton: false,
                showConfirmButton: true,
                showLearnmoreButton: false,
                onConfirm: function onConfirm() {
                  location.reload();
                }
              });
            }
          },
          error: function error(XMLHttpRequest, textStatus, errorThrown) {
            self.request_error_handling(XMLHttpRequest, textStatus, errorThrown);
          }
        });
      }
    }, {
      key: 'deactivateInit',
      value: function deactivateInit(element) {
        var self = this;
        var $this = element;

        jupiterx_modal({
          title: jupiterx_cp_textdomain.important_notice,
          text: self.language(jupiterx_cp_textdomain.are_you_sure_you_want_to_deactivate, [$this.data('name')]),
          type: 'warning',
          showCancelButton: true,
          showConfirmButton: true,
          confirmButtonText: jupiterx_cp_textdomain.continue,
          showCloseButton: false,
          showLearnmoreButton: false,
          showProgress: false,
          closeOnOutsideClick: false,
          onConfirm: function onConfirm() {
            self.deactivateStart($this.data('slug'));
          }
        });
      }
    }, {
      key: 'deactivateStart',
      value: function deactivateStart(pluginSlug) {
        var self = this;
        var $btn = $('.abb_plugin_deactivate[data-slug="' + pluginSlug + '"]');
        var data = {
          action: 'abb_deactivate_plugin',
          slug: pluginSlug
        };

        jupiterx_modal({
          title: jupiterx_cp_textdomain.deactivating_plugin,
          text: jupiterx_cp_textdomain.wait_for_plugin_deactivation,
          type: '',
          showCancelButton: false,
          showConfirmButton: false,
          showCloseButton: false,
          showLearnmoreButton: false,
          progress: '100%',
          showProgress: true,
          indefiniteProgress: true
        });

        $.post({
          url: _wpUtilSettings.ajax.url,
          data: data,
          success: function success(res) {
            if (res.success) {
              $btn.closest('.jupiterx-cp-plugin-item').attr('data-filter', 'inactive');

              jupiterx_modal({
                title: jupiterx_cp_textdomain.deactivating_notice,
                text: self.language(jupiterx_cp_textdomain.plugin_deactivate_successfully, []),
                type: 'success',
                showCancelButton: false,
                showConfirmButton: true,
                showCloseButton: false,
                showLearnmoreButton: false,
                showProgress: false,
                indefiniteProgress: false,
                closeOnOutsideClick: false,
                onConfirm: function onConfirm() {
                  location.reload();
                }
              });
            } else {
              jupiterx_modal({
                title: jupiterx_cp_textdomain.something_went_wrong,
                text: jupiterx_cp_textdomain.something_wierd_happened_please_try_again,
                type: 'error',
                showCancelButton: false,
                showConfirmButton: true,
                showLearnmoreButton: false,
                onConfirm: function onConfirm() {
                  location.reload();
                }
              });
            }
          },
          error: function error(XMLHttpRequest, textStatus, errorThrown) {
            self.request_error_handling(XMLHttpRequest, textStatus, errorThrown);
          }
        });
      }
    }, {
      key: 'deleteInit',
      value: function deleteInit(element) {
        var self = this;
        var $this = element;

        jupiterx_modal({
          title: jupiterx_cp_textdomain.delete_plugin,
          text: self.language(jupiterx_cp_textdomain.you_are_about_to_delete, [$this.data('name')]),
          type: 'warning',
          showCancelButton: true,
          showConfirmButton: true,
          confirmButtonText: jupiterx_cp_textdomain.continue,
          showCloseButton: false,
          showLearnmoreButton: false,
          showProgress: false,
          closeOnOutsideClick: false,
          onConfirm: function onConfirm() {
            self.deleteStart($this.data('slug'));
          }
        });
      }
    }, {
      key: 'deleteStart',
      value: function deleteStart(pluginSlug) {
        var self = this;
        var $btn = $('.abb_plugin_delete[data-slug="' + pluginSlug + '"]');
        var pluginName = $btn.data('name');

        jupiterx_modal({
          title: jupiterx_cp_textdomain.delete_plugin,
          text: jupiterx_cp_textdomain.wait_for_plugin_delete,
          type: '',
          showCancelButton: false,
          showConfirmButton: false,
          showCloseButton: false,
          showLearnmoreButton: false,
          progress: '100%',
          showProgress: true,
          indefiniteProgress: true
        });

        wp.updates.ajax('delete-plugin', {
          plugin: $btn.data('basename'),
          slug: pluginSlug,
          success: function success() {
            jupiterx_modal({
              title: jupiterx_cp_textdomain.plugin_is_successfully_deleted,
              text: self.language(jupiterx_cp_textdomain.plugin_deleted_successfully_message, [pluginName]),
              type: 'success',
              showCancelButton: false,
              showConfirmButton: true,
              showCloseButton: false,
              showLearnmoreButton: false,
              showProgress: false,
              closeOnOutsideClick: false,
              onConfirm: function onConfirm() {
                location.reload();
              }
            });
          },
          error: function error(res) {
            jupiterx_modal({
              title: jupiterx_cp_textdomain.something_went_wrong,
              text: res.errorMessage,
              type: 'error',
              showCancelButton: false,
              showConfirmButton: true,
              showLearnmoreButton: false,
              onConfirm: function onConfirm() {
                location.reload();
              }
            });
          }
        });
      }
    }, {
      key: 'updateInit',
      value: function updateInit(element) {
        var self = this;
        var $this = element;
        var pluginName = $this.data('name');
        var pluginSlug = $this.data('slug');

        jupiterx_modal({
          title: jupiterx_cp_textdomain.update_plugin_checker_title,
          text: self.language(jupiterx_cp_textdomain.update_plugin_checker_progress, [pluginName]),
          type: 'warning',
          showCancelButton: true,
          showCloseButton: false,
          showLearnmoreButton: false,
          showProgress: true,
          showConfirmButton: true,
          confirmButtonText: jupiterx_cp_textdomain.continue,
          progress: '100%',
          onConfirm: function onConfirm() {
            jupiterx_modal({
              title: jupiterx_cp_textdomain.update_plugin,
              text: self.language(jupiterx_cp_textdomain.you_are_about_to_update, [pluginName]),
              type: 'warning',
              showCancelButton: true,
              showConfirmButton: true,
              confirmButtonText: jupiterx_cp_textdomain.continue,
              showCloseButton: false,
              showLearnmoreButton: false,
              showProgress: false,
              closeOnOutsideClick: false,
              onConfirm: function onConfirm() {
                self.updateStart($this.data('slug'));
              }
            });
          }
        });

        jupiterx_modal.disableConfirmBtn();

        self.updateChecker(pluginSlug);
      }
    }, {
      key: 'updateStart',
      value: function updateStart(pluginSlug) {
        var self = this;
        var pluginData = _.findWhere(self.pluginList.plugins, { slug: pluginSlug });
        var $btn = $('.abb_plugin_update[data-slug="' + pluginSlug + '"]');

        jupiterx_modal({
          title: jupiterx_cp_textdomain.updating_plugin,
          text: jupiterx_cp_textdomain.wait_for_plugin_update,
          type: '',
          showCancelButton: false,
          showConfirmButton: false,
          showCloseButton: false,
          showLearnmoreButton: false,
          progress: '100%',
          showProgress: true,
          indefiniteProgress: true
        });

        $.ajax({
          type: 'GET',
          url: _.unescape(pluginData.update_url),
          success: function success() {
            jupiterx_modal({
              title: jupiterx_cp_textdomain.plugin_is_successfully_updated,
              text: self.language(jupiterx_cp_textdomain.plugin_updated_recent_version, [$btn.data('name')]),
              type: 'success',
              showCancelButton: false,
              showConfirmButton: true,
              showCloseButton: false,
              showLearnmoreButton: false,
              showProgress: false,
              closeOnOutsideClick: false,
              onConfirm: function onConfirm() {
                location.reload();
              }
            });

            $btn.closest('.jupiterx-cp-plugin-item').attr('data-update', 'no');
            $btn.remove();
          },
          error: function error(res) {
            jupiterx_modal({
              title: jupiterx_cp_textdomain.something_went_wrong,
              text: _.last(res.debug),
              type: 'error',
              showCancelButton: false,
              showConfirmButton: true,
              showLearnmoreButton: false
            });
          }
        });
      }
    }, {
      key: 'updateChecker',
      value: function updateChecker(pluginSlug) {
        var self = this;
        var pluginData = _.findWhere(self.pluginList.plugins, { slug: pluginSlug });

        var conflictTemplate = function conflictTemplate(ths, conflicts) {
          var html = '<table class="jupiterx_update_plugin_conflicts_table">';
          html += '<thead>';
          html += '<tr>';
          html += _.map(ths, function (th) {
            return '<th><p>' + th + '</p></th>';
          }).join('');
          html += '</tr>';
          html += '</thead>';
          html += '<tbody>';
          html += _.map(conflicts, function (conflict) {
            return '<tr>' + '<td><p>' + conflict.name + '</p></td>' + '<td><p>' + conflict.min_version + '</p></td>' + '</tr>';
          }).join('');
          html += '</tbody>';
          html += '</table>';
          return html;
        };

        $.ajax({
          type: 'POST',
          url: _wpUtilSettings.ajax.url,
          data: {
            action: 'abb_update_plugin_checker',
            plugin: pluginData
          },
          success: function success() {
            jupiterx_modal.enableConfirmBtn();
            jupiterx_modal.hideProgressBar();
            jupiterx_modal.update({ desc: jupiterx_cp_textdomain.update_plugin_checker_no_conflict });
          },
          error: function error(res) {
            jupiterx_modal.enableConfirmBtn();
            jupiterx_modal.hideProgressBar();

            var html = jupiterx_cp_textdomain.update_plugin_checker_warning;

            if (res.plugins && res.plugins.length > 0) {
              html += conflictTemplate([jupiterx_cp_textdomain.plugins, jupiterx_cp_textdomain.upgrade_to_version], res.plugins);
            }

            if (res.themes && res.themes.length > 0) {
              html += conflictTemplate([jupiterx_cp_textdomain.themes, jupiterx_cp_textdomain.upgrade_to_version], res.themes);
            }

            jupiterx_modal.update({ desc: html });
          }
        });
      }
    }, {
      key: 'filtersInit',
      value: function filtersInit(element) {
        var $this = element;
        var actionFilter = $this.data('filter');

        if ('undefined' !== typeof localStorage) {
          localStorage.setItem('activeFilter', actionFilter);
        }

        $('.jupiterx-cp-plugins-filter .btn').removeClass('btn-secondary').addClass('btn-outline-secondary');
        $this.removeClass('btn-outline-secondary').addClass('btn-secondary');

        if ('all' === actionFilter) {
          $('.jupiterx-cp-plugin-item').show();
          return;
        }

        if ('update' === actionFilter) {
          $('.jupiterx-cp-plugin-item').show();
          $('.jupiterx-cp-plugin-item').not('[data-update=yes]').hide();
          return;
        }

        $('.jupiterx-cp-plugin-item').show();
        $('.jupiterx-cp-plugin-item').not('[data-filter=' + actionFilter + ']').hide();
      }
    }, {
      key: 'request_error_handling',
      value: function request_error_handling(XMLHttpRequest) {
        console.log(XMLHttpRequest);

        if (XMLHttpRequest.readyState === 4) {
          // HTTP error (can be checked by XMLHttpRequest.status and XMLHttpRequest.statusText)
          jupiterx_modal({
            title: jupiterx_cp_textdomain.something_went_wrong,
            text: XMLHttpRequest.status,
            type: 'error',
            showCancelButton: false,
            showConfirmButton: true,
            showLearnmoreButton: false
          });
        } else if (XMLHttpRequest.readyState === 0) {
          // Network error (i.e. connection refused, access denied due to CORS, etc.)
          jupiterx_modal({
            title: jupiterx_cp_textdomain.something_went_wrong,
            text: jupiterx_cp_textdomain.error_in_network_please_check_your_connection_and_try_again,
            type: 'error',
            showCancelButton: false,
            showConfirmButton: true,
            showLearnmoreButton: false
          });
        } else {
          jupiterx_modal({
            title: jupiterx_cp_textdomain.something_went_wrong,
            text: jupiterx_cp_textdomain.something_wierd_happened_please_try_again,
            type: 'error',
            showCancelButton: false,
            showConfirmButton: true,
            showLearnmoreButton: false
          });
        }
      }
    }, {
      key: 'language',
      value: function language(string, params) {
        if (typeof string === 'undefined' || string === '') {
          return;
        }

        var array_len = params.length;

        if (array_len < 1) {
          return string;
        }

        var indicator_len = (string.match(/{param}/g) || []).length;

        if (array_len === indicator_len) {
          $.each(params, function (key, val) {
            string = string.replace('{param}', val);
          });
          return string;
        }

        // Array len and indicator lengh is not same;
        console.log('Array len and indicator lengh is not same, Contact support with ID : (3-6H1T4I) .');
        return string;
      }
    }]);

    return SectionPlugins;
  }();

  var ControlPanel = function () {
    function ControlPanel(_ref) {
      var node = _ref.node;

      _classCallCheck(this, ControlPanel);

      this.element = $(node);
      this.sidebar = this.element.find('.jupiterx-cp-sidebar');
      this.panes = this.element.find('.jupiterx-cp-panes');
      this.sections = {
        home: SectionHome,
        settings: SectionSettings,
        'install-templates': SectionTemplates,
        'system-status': SectionSystemStatus,
        'update-theme': SectionUpdates,
        'image-sizes': SectionImageSizes,
        'export-import': SectionExportImport,
        'install-plugins': SectionPlugins
      };
      this.init();
      this.events();
    }

    _createClass(ControlPanel, [{
      key: 'init',
      value: function init() {
        var hash = window.location.hash;
        var slug = hash.substring(1, hash.length);
        var _jupiterxControlPanel = jupiterxControlPanel,
            initialSection = _jupiterxControlPanel.initialSection;


        if (hash && slug && slug !== initialSection) {
          this.goTo(slug);
        } else if (initialSection) {
          this.sectionEvents(initialSection);
          this.commonEvents();
        }
      }
    }, {
      key: 'events',
      value: function events() {
        var self = this;
        var element = self.element;


        element.on('click', '.jupiterx-cp-sidebar-link', function (event) {
          event.preventDefault();

          var $this = $(this);
          var hash = $this.attr('href');
          var slug = hash.substring(1, hash.length);

          window.location.hash = hash;
          self.goTo(slug);
        });
      }
    }, {
      key: 'goTo',
      value: function goTo(slug) {
        var self = this;
        var sidebar = self.sidebar,
            panes = self.panes;

        panes.addClass('loading-pane');

        $.ajax({
          type: 'POST',
          url: _wpUtilSettings.ajax.url,
          data: {
            action: 'jupiterx_cp_load_pane_action',
            slug: slug
          },
          success: function success(res) {
            panes.empty();
            panes.append(res.data);
            panes.removeClass('loading-pane');

            sidebar.find('.jupiterx-is-active').removeClass('jupiterx-is-active');
            sidebar.find('[href=#' + slug + ']').parent().addClass('jupiterx-is-active');
            self.sectionEvents(slug);
            self.commonEvents();
          }
        });
      }
    }, {
      key: 'sectionEvents',
      value: function sectionEvents(slug) {
        var sections = this.sections;


        if (sections[slug]) {
          new sections[slug]();
        }
      }
    }, {
      key: 'commonEvents',
      value: function commonEvents() {
        var self = this;

        $('.jupiterx-cpanel-link').on('click', function (event) {
          event.preventDefault();

          var $this = $(this);
          var hash = $this.attr('href');
          var slug = hash.substring(1, hash.length);

          window.location.hash = hash;
          self.goTo(slug);
        });

        $('.jupiterx-pro-badge').tooltip({
          title: jupiterx_cp_textdomain.pro_badge_tooltip_title,
          trigger: 'hover',
          container: '.jupiterx-wrap',
          template: '\n          <div class="tooltip jupiterx-pro-badge-tooltip" role="tooltip">\n            <div class="arrow"></div>\n            <div class="tooltip-inner"></div>\n          </div>\n        '
        });

        $('[data-toggle="popover"]').click(function (event) {
          event.preventDefault();
        });

        $('[data-toggle="popover"]').popover({
          trigger: 'hover',
          container: '.jupiterx.jupiterx-cp-wrap'
        });

        $('[data-toggle="tooltip"]').tooltip();
      }
    }]);

    return ControlPanel;
  }();

  $('.jupiterx-cp-wrap').each(function (i, node) {
    new ControlPanel({
      node: node
    });
  });
})(jQuery, jupiterx);