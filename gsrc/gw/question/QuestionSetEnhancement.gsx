package gw.question

enhancement QuestionSetEnhancement : gw.api.productmodel.QuestionSet {
  
  function isNameVisible() : boolean {
    var first2Char = gw.api.util.StringUtil.substring(this.Name, 0, 2)
    return first2Char <> "HO"
  }
}
