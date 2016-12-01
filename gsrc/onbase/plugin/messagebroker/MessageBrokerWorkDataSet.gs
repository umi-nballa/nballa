package onbase.plugin.messagebroker

uses gw.api.integration.inbound.work.WorkContext
uses gw.api.integration.inbound.work.WorkData
uses gw.api.integration.inbound.work.WorkDataSet
uses onbase.api.services.datamodels.MessageBrokerMessage

uses java.util.ArrayList
uses java.util.ListIterator

/**
 * Hyland Build Version: 16.0.0.999
 */
class MessageBrokerWorkDataSet implements WorkDataSet, WorkContext {

  var _messages = new ArrayList<MessageBrokerMessage>()
  var _iterator : ListIterator<MessageBrokerMessage> = null

  function addMessages( messages: List<MessageBrokerMessage>){
    _messages.addAll(messages)
  }

  override function hasNext(): boolean {
    // Create the backing iterator if this is the first call
    if (_iterator == null) {
      _iterator = _messages.listIterator()
    }

    return _iterator.hasNext()
  }

  override property get Data(): WorkData {
    return _iterator.next()
  }

  override property get Context(): WorkContext {
    // Not currently using contexts, return the data set as a dummy value.
    return this
  }

  override function close() {
    // Nothing to close.
  }
}
