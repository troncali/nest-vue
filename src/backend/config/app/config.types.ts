/** Application configuration properties for intellisense */
export interface AppEnvVars {
	// Full property path is required for nested properties

	/** Environment in which the application is running. */
	"app.env": string;
	/** Port on which the application is listening. */
	"app.port": number;
	/** Global route prefix for the application. */
	"app.baseRoute": string;
	/** Name of the cookie in which encrypted session data is stored. */
	"app.sessionCookieName": string;
	/** Property on the session object where authenticated user data is stored. */
	"app.sessionUserProperty": string;
}
