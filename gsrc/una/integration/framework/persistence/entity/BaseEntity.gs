package una.integration.framework.persistence.entity

uses una.integration.framework.persistence.util.ProcessStatus
uses gw.api.util.DateUtil

uses java.lang.Integer
uses java.util.Date

/**
 * Base class for all the DTO objects associated with integration tables.
 * Created By: vtadi on 5/18/2016
 */
abstract class BaseEntity {
  var id: Integer             as ID
  var createTime: Date        as CreateTime
  var createUser: String      as CreateUser
  var updateTime: Date        as UpdateTime
  var updateUser: String      as UpdateUser
  var status: ProcessStatus   as Status

  /**
   * Initializing default and initial values.
   */
  construct(){
    createTime = DateUtil.currentDate()
    updateTime = createTime
    status = ProcessStatus.UnProcessed
  }

}