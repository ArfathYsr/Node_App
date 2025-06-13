const AUTH_MODULE = {
  ProfileRepository: Symbol.for('ProfileRepository'),
  AuthService: Symbol.for('AuthService'),
  PublicAuthService: Symbol.for('PublicAuthService'),
  AuthController: Symbol.for('AuthController'),
  PublicAuthController: Symbol.for('PublicAuthController'),
};

export default AUTH_MODULE;
