/** GraphQL configuration properties for intellisense. */
interface GqlOptionTypes {
	/** Path where automatically generated schema will be created. */
	"gql.autoSchemaFile": string;
	/** Whether to sort schema lexicographically. */
	"gql.sortSchema": boolean;
	/** Route at which GraphQL will be accessed */
	"gql.path": string;
}

export { GqlOptionTypes };
