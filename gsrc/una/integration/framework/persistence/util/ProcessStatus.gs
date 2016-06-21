package una.integration.framework.persistence.util

/**
 * Used to represent the status of inbound / outbound file process and the individual data record processing status.
 * Created By: vtadi on 5/18/2016
 */
enum ProcessStatus {
  UnProcessed,
  InProgress,
  Processed,
  Failed,
  Error,
  Duplicate,
  Hold
}