package una.integration.framework.persistence.dao

uses una.integration.framework.file.IFileDataMapping
uses una.logging.UnaLoggerCategory
uses una.integration.framework.persistence.entity.BaseEntity
uses una.integration.framework.persistence.util.CustomBeanPropertyRowMapper
uses una.integration.framework.persistence.util.CustomBeanPropertySqlParameterSource
uses una.integration.framework.persistence.util.ProcessStatus
uses una.integration.framework.util.DIContextHelper
uses gw.lang.reflect.gs.IGosuClass
uses org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
uses org.springframework.jdbc.support.GeneratedKeyHolder

uses javax.sql.DataSource
uses java.lang.StringBuffer
uses java.util.ArrayList
uses java.util.Date
uses java.util.HashMap

/**
 * Base DAO class for CRUD operations into integration database tables.
 * Created By: vtadi on 5/18/2016
 */
class IntegrationBaseDAO {
  final static var _logger = UnaLoggerCategory.UNA_INTEGRATION

  var jdbcTemplate: NamedParameterJdbcTemplate
  var entityClass: IGosuClass
  var tableName: String

  var insertQueryColumnsString: String
  var insertQueryValuesString: String
  var updateQueryValuesString: String

  /**
   * Construct to initialize data based on the given file data mapping.
   */
  construct(fileIntegrationMapping: IFileDataMapping){
    entityClass = fileIntegrationMapping.DataClass
    tableName = fileIntegrationMapping.DataTableName
    initialize()
    _logger.debug("A new instance of IntegrationBaseDAO is created")
  }

  /**
   * Construct to initialize data based on the given DTO class.
   */
  construct(entyClass: IGosuClass) {
    entityClass = entyClass
    tableName = entyClass.RelativeName
    initialize()
    _logger.debug("A new instance of IntegrationBaseDAO is created")
  }

  /**
   * Initializes the data source and jdbcTemplate objects.
   * Also, initializes the query strings.
   */
  private function initialize() {
    var dataSource = DIContextHelper.getBean("dataSource") as DataSource
    jdbcTemplate = new(dataSource)
    insertQueryColumnsString = createNonIDFieldString()
    insertQueryValuesString = createNonIDFieldWithValueString()
    updateQueryValuesString = createUpdateFieldWithValueString()
  }

  /**
   *
   */
  private function createNonIDFieldString() : String {
    var sb : StringBuffer = new("")
    retrieveFieldListExceptID().each( \ elt -> sb.append(elt+", "))
    var len = sb.toString().length()
    if(len > 0){
      return sb.substring(0, len-2)+ " "
    }
    return sb.toString()
  }

  /**
   *
   */
  private function createNonIDFieldWithValueString() : String {
    var sb : StringBuffer = new ("")
    retrieveFieldListExceptID().each( \ elt -> sb.append(":"+elt+ ", "))
    var len = sb.toString().length()
    if(len > 0){
      return sb.substring(0, len-2)+ " "
    }
    return sb.toString()
  }

  /**
   *
   */
  private function createUpdateFieldWithValueString(): String {
    var sb : StringBuffer = new ("")
    retrieveFieldListExceptID().each( \ elt -> sb.append(elt+ " = :"+elt+ ", "))
    var len = sb.toString().length()
    if(len > 0){
      return sb.substring(0, len-2)+ " "
    }
    return sb.toString()
  }

  /**
   *
   */
  private function retrieveFieldListExceptID() : List<String>{
    var methods =
        entityClass.TypeInfo.Methods.where( \ elt -> {
          return elt.Parameters.Count == 0
              and elt.DisplayName.startsWith("@")
              and elt.DisplayName != "@IntrinsicType" and elt.DisplayName != "@itype"
        })
    var fields = methods*.DisplayName
    var fieldsWithOutAt = new ArrayList<String>()
    fields.each( \ elt -> fieldsWithOutAt.add(elt.substring(1)))
    return fieldsWithOutAt.where( \ elt -> elt != "ID")
  }

  /**
   *
   */
  protected function select(whereClause: String, valueMap: HashMap<String, Object>) : List< BaseEntity >{
    var selectQuery = "SELECT * FROM ${tableName} ${whereClause!=null?("WHERE "+whereClause):""}"
    var mapList = jdbcTemplate.query(selectQuery, valueMap, new CustomBeanPropertyRowMapper(entityClass.BackingClass))
    return mapList.whereTypeIs(BaseEntity)
  }

  /**
   *
   */
  protected function update(bEntity: BaseEntity, whereClause: String) : int{
    var updateQuery = "UPDATE ${tableName} SET ${updateQueryValuesString} WHERE ${whereClause?:"ID= :ID"}"
    var fieldValues = new CustomBeanPropertySqlParameterSource(bEntity)
    return jdbcTemplate.update(updateQuery, fieldValues)
  }

  /**
   *
   */
  protected function delete(bEntity: BaseEntity, whereClause: String): int{
    var deleteQuery = "DELETE ${tableName} WHERE ${whereClause?:"ID= :ID"}"
    var fieldValues = new CustomBeanPropertySqlParameterSource(bEntity)
    return jdbcTemplate.update(deleteQuery, fieldValues)
  }

  /**
   * Inserts the given entity data into the integration table.
   */
  function insert(bEntity : BaseEntity) : int{
    var insertQuery = "INSERT INTO ${tableName} (${insertQueryColumnsString}) values (${insertQueryValuesString})"
    var fieldValues = new CustomBeanPropertySqlParameterSource(bEntity)
    var keyHolder = new GeneratedKeyHolder()
    _logger.debug("Inserting into the entity {}", bEntity.IntrinsicType.RelativeName)
    jdbcTemplate.update(insertQuery, fieldValues, keyHolder)
    return keyHolder.getKey().intValue()
  }

  /**
   *
   */
  function selectByStatusList(statusList: List<ProcessStatus>): List< BaseEntity > {
    var whereClause = "STATUS in ('${statusList*.Name.join("','")}') order by ID"
    return select(whereClause, null)
  }

  /**
   * Selects the data for the given date range.
   */
  function selectByDateRange(startTime: DateTime, endTime: DateTime, statusList: List<ProcessStatus> = null): List< BaseEntity > {
    var whereClause = "UPDATETIME between :STARTDATE and :ENDDATE"
    var valueMap = new HashMap<String, Object>()
    valueMap.put("STARTDATE", startTime)
    valueMap.put("ENDDATE", endTime)
    if (statusList != null) {
      whereClause = "${whereClause} and STATUS in (:STATUSLIST) order by ID"
      valueMap.put("STATUSLIST", statusList*.Name)
    }
    return select(whereClause, valueMap)
  }

  /**
   * Selects all the rows from the integration table.
   */
  function selectAll(): List< BaseEntity > {
    return select(null, null)
  }

  /**
   * Updates the given data row in the integration table.
   */
  function update(bEntity: BaseEntity): int {
    _logger.debug("Updating the entity {}", bEntity.IntrinsicType.RelativeName)
    return update(bEntity, null)
  }

  /**
   * Deletes the given data row from the integration table.
   */
  function delete(bEntity: BaseEntity): int {
    _logger.debug("Deleting the entity {}", bEntity.IntrinsicType.RelativeName)
    return delete(bEntity, null)
  }

  /**
   * Deletes all the rows from the database table.
   */
  function deleteAll() {
    var deleteQuery = "DELETE ${tableName}"
    jdbcTemplate.update(deleteQuery, {})
  }

}