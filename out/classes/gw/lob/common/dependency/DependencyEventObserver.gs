package gw.lob.common.dependency

/**
 * Created with IntelliJ IDEA.
 * User: drosu
 * Date: 2/4/14
 * Time: 3:22 PM
 * To change this template use File | Settings | File Templates.
 */
interface DependencyEventObserver {
  function onUpdate(entity : KeyableBean)
}