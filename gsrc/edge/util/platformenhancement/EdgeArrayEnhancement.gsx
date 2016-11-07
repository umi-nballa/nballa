package edge.util.platformenhancement

enhancement EdgeArrayEnhancement<T> : T[] {
  function mapWithIndex<R>(mapper(item : T, idx : int) : R) : R[] {
    final var res = new R[this.length]
    for (var elt in this index i) {
      res[i] = mapper(elt, i)
    }
    return res
  }
}
