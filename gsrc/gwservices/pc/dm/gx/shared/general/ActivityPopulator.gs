package gwservices.pc.dm.gx.shared.general

uses gw.pl.persistence.core.Bundle
uses gw.xml.XmlElement
uses gwservices.pc.dm.batch.DataMigrationNonFatalException
uses gwservices.pc.dm.batch.DataMigrationNonFatalException.CODE
uses gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator
uses gwservices.pc.dm.gx.shared.general.activitymodel.Activity

public class ActivityPopulator extends BaseEntityPopulator<entity.Activity, KeyableBean> {
  override function create(model: XmlElement, parent: KeyableBean, bundle: Bundle): entity.Activity {
    var ap = getActivityPattern(model)
    if (parent typeis Account) {
      return ap.createAccountActivity(bundle, ap, parent, null, null, null, null, null, null, null)
    } else if (parent typeis Policy) {
      return ap.createPolicyActivity(bundle, parent, null, null, null, null, null, null, null)
    } else if (parent typeis Note) {
      var activity: entity.Activity
      if (parent.Policy != null) {
        activity = ap.createPolicyActivity(bundle, parent.Policy, null, null, null, null, null, null, null)
      } else if (parent.Account != null) {
        activity = ap.createAccountActivity(bundle, ap, parent.Account, null, null, null, null, null, null, null)
      } else {
        var msg = "unknown note type, should include either policy or account"
        throw new DataMigrationNonFatalException(CODE.UNSUPPORTED_PARENT, msg)
      }
      parent.Activity = activity
      return activity
    } else {
      throw new DataMigrationNonFatalException(CODE.UNSUPPORTED_PARENT, typeof(parent) as String)
    }
  }

  override function addToParent(parent: KeyableBean, child: entity.Activity, name: String, childModel: XmlElement) {
    // this should already be done
  }

  override function finish(model: XmlElement, parent: KeyableBean, child: entity.Activity) {
    // if no group is assigned, use the assigned user default
    var defaultAssignmentGroup = child.AssignedUser.DefaultAssignmentGroup
    if (child.AssignedGroup == null and defaultAssignmentGroup != null) {
      child.AssignedGroup = defaultAssignmentGroup
    }
  }

  /**
   * Convenience. Find the activity pattern
   */
  private function getActivityPattern(model: XmlElement): ActivityPattern {
    var activityPattern = findElement(Activity#ActivityPattern, model)
    var patternCode = findElement(ActivityPattern#Code, activityPattern).SimpleValue.GosuValue as String
    if (patternCode == null) {
      var msg = "missing activity pattern"
      throw new DataMigrationNonFatalException(CODE.MISSING_ACTIVITY_PATTERN, msg)
    }
    var activityPatternList = ActivityPattern.finder.findActivityPatternsByCode(patternCode)
    if (not activityPatternList.HasElements) {
      var msg = "invalid activity pattern"
      throw new DataMigrationNonFatalException(CODE.INVALID_ACTIVITY_PATTERN, msg)
    }
    // TODO will there always just be one pattern?
    return activityPatternList.FirstResult
  }
}
