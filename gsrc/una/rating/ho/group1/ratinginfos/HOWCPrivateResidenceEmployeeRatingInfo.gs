package una.rating.ho.group1.ratinginfos

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 9/21/16
 * Rating info for WC Private Residence Employee Coverage
 */
class HOWCPrivateResidenceEmployeeRatingInfo {
  var _coveredOccasionalEmployeesCount: int as CoveredOccasionalEmployeesCount = 0
  var _coveredFullTimeInsideEmployeesCount: int as CoveredFullTimeInsideEmployeesCount = 0
  var _coveredFullTimeOutsideEmployeesCount: int as CoveredFullTimeOutsideEmployeesCount = 0
  var _hasFullTimeEmployees: boolean as HasFullTimeEmployees
  var _hasOccasionalEmployees: boolean as HasOccasionalEmployees
  var _isDPPolicy : boolean as IsDPPolicy
  construct(lineCov: HOLI_WC_PrivateResidenceEmployee_HOE_Ext) {
    _coveredOccasionalEmployeesCount = lineCov.HOLI_WC_OccasionalEmployees_HOETerm?.Value?.intValue()
    _coveredFullTimeInsideEmployeesCount = lineCov.HOLI_WC_FulltimeEmployees_HOETerm?.Value?.intValue()
    _coveredFullTimeOutsideEmployeesCount = lineCov.HOLI_NumFTOutSideCovEmp_HOETerm?.Value?.intValue()

    if (_coveredOccasionalEmployeesCount > 0)
      _hasOccasionalEmployees = true
    if (_coveredFullTimeInsideEmployeesCount > 0 or _coveredFullTimeOutsideEmployeesCount > 0)
      _hasFullTimeEmployees = true
    _isDPPolicy = typekey.HOPolicyType_HOE.TF_FIRETYPES.TypeKeys.contains(lineCov.HOLine.HOPolicyType)
  }
}