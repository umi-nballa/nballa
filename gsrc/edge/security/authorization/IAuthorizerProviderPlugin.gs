package edge.security.authorization

interface IAuthorizerProviderPlugin {
  function authorizerFor<T>(t:Type<T>):Authorizer<T>
}
