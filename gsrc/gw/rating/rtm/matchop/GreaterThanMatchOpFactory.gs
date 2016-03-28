package gw.rating.rtm.matchop

uses gw.rating.rtm.validation.MatchOpValidator
uses gw.rating.rtm.validation.NoOpValidator

@ReadOnly
class GreaterThanMatchOpFactory extends MatchOperationFactory<StatelessGreaterThanMatch> {

  override function createStatelessMatchOperator(matchOp: entity.RateTableMatchOp): gw.rating.rtm.matchop.StatelessGreaterThanMatch {
    return new StatelessGreaterThanMatch(matchOp)
  }

  override function createValidator() : MatchOpValidator {
    return NoOpValidator.Instance
  }
}
