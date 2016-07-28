package gwservices.pc.dm.batch

uses gw.xml.XmlElement
uses gwservices.pc.dm.gx.base.account.accountmodel.Account
uses gwservices.pc.dm.gx.base.policy.policyperiodmodel.PolicyPeriod
uses gwservices.pc.dm.gx.entitypopulators.MigrationEntityIDDTO

uses java.util.Map

/**
 * Data transfer record
 */
class MigrationRecord {
  /** Account XML */
  private var _account: Account as Account
  /** Application ID return from processing */
  private var _applicationId: String as ApplicationID
  /** Automatically delete missing entities */
  private var _autoDelete: boolean as AutoDelete = false
  /** Record ID */
  private var _id: long as ID
  /** Used to store modified records */
  private var _migrationEntityTransactionId: String as MigrationEntityTransactionID
  /** Migration entity IDS */
  private var _migrationIDs: Map<MigrationEntityIDDTO, List<MigrationEntityIDDTO>> as MigrationEntityIDs
  /** Migration payload type */
  private var _payloadType: MigrationPayloadType_Ext as PayloadType
  /** Policy XML */
  private var _policyPeriod: PolicyPeriod as PolicyPeriod
  /** Sequence number */
  private var _sequenceNumber: long as SequenceNumber
  /** Statistics for recon */
  private var _statistics: List<StatisticsRecord> as Statistics = {}
  /** XML element to be placed back into the staging table */
  private var _updatedXml: XmlElement as UpdatedXML
}