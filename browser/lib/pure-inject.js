/*jshint strict:true, browser:true, es5:true, onevar:true, laxcomma:true, laxbreak:true*/
(function () {
  "use strict";
  var $ = require('ender')
    , pure = require('./pure').$p
    , messageTemplate
    , codeTemplate
    , protocolTabTemplate
    , protocolWindowTemplate
    , listenerTabTemplate
    , listenerWindowTemplate
    ;

  function compileTemplates() {
    var directive = {}
      ;

    directive.a = 'display';
    ['', 'a', 'span'].forEach(function (type) {
      directive[type+'@data-protocol'] = 'protocol';
      directive[type+'@listener-port'] = 'portNum';
    });

    protocolTabTemplate = pure('.js-protocol-tab-template').compile(directive);
    listenerTabTemplate = pure('.js-listener-tab-template').compile(directive);

    delete directive.a;
    ['div', 'input', 'li'].forEach(function (type) {
      directive[type+'@data-protocol'] = 'protocol';
      directive[type+'@listener-port'] = 'portNum';
    });
    protocolWindowTemplate = pure('.js-protocol-window-template').compile(directive);
    listenerWindowTemplate = pure('.js-listener-window-template').compile(directive);

    messageTemplate = pure('.js-message-template').compile({
      'div': 'time',
      'span': 'body',
      '@class': 'cssClass'
    });
    codeTemplate = pure('.js-code-template').compile({
      'div': 'time',
      'span': 'code',
      'code': 'xml'
    });
  }

  function injectProtocolTab(protocol) {
    var opts = {}
      , newElement
      ;

    opts.protocol = protocol;
    opts.display  = protocol.toUpperCase();

    newElement = protocolTabTemplate(opts);
    newElement = $(newElement).removeClass('js-protocol-tab-template');
    $('.js-protocol-tab-bar').append(newElement);

    opts.portNum = 'default';
    newElement = protocolWindowTemplate(opts);
    newElement = $(newElement).removeClass('js-protocol-window-template');
    $('.container').append(newElement);
  }

  function injectListenerTab(protocol, portNum) {
    var opts = {}
      , newElement
      ;

    opts.protocol = protocol;
    opts.portNum  = portNum;
    opts.display  = portNum;

    newElement = listenerTabTemplate(opts);
    newElement = $(newElement).removeClass('js-listener-tab-template');
    $('.js-listener-tab-bar[data-protocol='+protocol+']').append(newElement);
    $('.js-listener-tab-bar[data-protocol='+protocol+']').removeClass('css-hidden');

    newElement = listenerWindowTemplate(opts);
    newElement = $(newElement).removeClass('js-listener-window-template');
    $('.js-listener-container[data-protocol='+protocol+']').append(newElement);
  }

  function injectMessage(options, data) {
    var selector
      ;

    if (!options.hasOwnProperty('protocol')) {
      console.error('received code injection request without protocol');
      return;
    }
    if (!options.hasOwnProperty('port')) {
      console.error('received code injection request without port');
      return;
    }
    data = data || options;

    selector  = '[data-protocol="' + options.protocol + '"]';
    selector += '[listener-port="' + options.port + '"]';
    data.time = new Date().toString();
    $('.js-listener-stream' + selector).append(messageTemplate(data));
  }

  function injectCode(options, data) {
    var selector
      ;

    if (!options.hasOwnProperty('protocol')) {
      console.error('received code injection request without protocol');
      return;
    }
    if (!options.hasOwnProperty('port')) {
      console.error('received code injection request without port');
      return;
    }

    selector  = '[data-protocol="' + options.protocol + '"]';
    selector  = '[listener-port="' + options.port + '"]';
    data.time = new Date().toString();
    $('.js-listener-stream' + selector).append(codeTemplate(data));
  }

  module.exports.compileTemplates = compileTemplates;
  module.exports.injectProtocolTab = injectProtocolTab;
  module.exports.injectCode = injectCode;
  module.exports.injectMessage = injectMessage;
  module.exports.injectListenerTab = injectListenerTab;
}());
