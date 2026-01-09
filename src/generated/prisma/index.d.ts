
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model PrivacySettings
 * 
 */
export type PrivacySettings = $Result.DefaultSelection<Prisma.$PrivacySettingsPayload>
/**
 * Model Friendship
 * 
 */
export type Friendship = $Result.DefaultSelection<Prisma.$FriendshipPayload>
/**
 * Model StoryChapter
 * 
 */
export type StoryChapter = $Result.DefaultSelection<Prisma.$StoryChapterPayload>
/**
 * Model UserStoryProgress
 * 
 */
export type UserStoryProgress = $Result.DefaultSelection<Prisma.$UserStoryProgressPayload>
/**
 * Model LegendSaga
 * 
 */
export type LegendSaga = $Result.DefaultSelection<Prisma.$LegendSagaPayload>
/**
 * Model LegendSubchapter
 * 
 */
export type LegendSubchapter = $Result.DefaultSelection<Prisma.$LegendSubchapterPayload>
/**
 * Model UserLegendProgress
 * 
 */
export type UserLegendProgress = $Result.DefaultSelection<Prisma.$UserLegendProgressPayload>
/**
 * Model Milestone
 * 
 */
export type Milestone = $Result.DefaultSelection<Prisma.$MilestonePayload>
/**
 * Model UserMilestoneProgress
 * 
 */
export type UserMilestoneProgress = $Result.DefaultSelection<Prisma.$UserMilestoneProgressPayload>
/**
 * Model UserCatclawProgress
 * 
 */
export type UserCatclawProgress = $Result.DefaultSelection<Prisma.$UserCatclawProgressPayload>
/**
 * Model MeowMedal
 * 
 */
export type MeowMedal = $Result.DefaultSelection<Prisma.$MeowMedalPayload>
/**
 * Model UserMeowMedal
 * 
 */
export type UserMeowMedal = $Result.DefaultSelection<Prisma.$UserMeowMedalPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Visibility: {
  PUBLIC: 'PUBLIC',
  FRIENDS: 'FRIENDS',
  PRIVATE: 'PRIVATE'
};

export type Visibility = (typeof Visibility)[keyof typeof Visibility]


export const FriendshipStatus: {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  BLOCKED: 'BLOCKED'
};

export type FriendshipStatus = (typeof FriendshipStatus)[keyof typeof FriendshipStatus]


export const TreasureStatus: {
  NONE: 'NONE',
  PARTIAL: 'PARTIAL',
  ALL: 'ALL'
};

export type TreasureStatus = (typeof TreasureStatus)[keyof typeof TreasureStatus]


export const ZombieStatus: {
  NONE: 'NONE',
  PARTIAL: 'PARTIAL',
  ALL: 'ALL'
};

export type ZombieStatus = (typeof ZombieStatus)[keyof typeof ZombieStatus]


export const LegendProgressStatus: {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED'
};

export type LegendProgressStatus = (typeof LegendProgressStatus)[keyof typeof LegendProgressStatus]


export const MilestoneCategory: {
  CRAZED: 'CRAZED',
  MANIC: 'MANIC',
  ADVENT: 'ADVENT',
  CATCLAW: 'CATCLAW',
  OTHER: 'OTHER'
};

export type MilestoneCategory = (typeof MilestoneCategory)[keyof typeof MilestoneCategory]

}

export type Visibility = $Enums.Visibility

export const Visibility: typeof $Enums.Visibility

export type FriendshipStatus = $Enums.FriendshipStatus

export const FriendshipStatus: typeof $Enums.FriendshipStatus

export type TreasureStatus = $Enums.TreasureStatus

export const TreasureStatus: typeof $Enums.TreasureStatus

export type ZombieStatus = $Enums.ZombieStatus

export const ZombieStatus: typeof $Enums.ZombieStatus

export type LegendProgressStatus = $Enums.LegendProgressStatus

export const LegendProgressStatus: typeof $Enums.LegendProgressStatus

export type MilestoneCategory = $Enums.MilestoneCategory

export const MilestoneCategory: typeof $Enums.MilestoneCategory

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.privacySettings`: Exposes CRUD operations for the **PrivacySettings** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PrivacySettings
    * const privacySettings = await prisma.privacySettings.findMany()
    * ```
    */
  get privacySettings(): Prisma.PrivacySettingsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.friendship`: Exposes CRUD operations for the **Friendship** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Friendships
    * const friendships = await prisma.friendship.findMany()
    * ```
    */
  get friendship(): Prisma.FriendshipDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.storyChapter`: Exposes CRUD operations for the **StoryChapter** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more StoryChapters
    * const storyChapters = await prisma.storyChapter.findMany()
    * ```
    */
  get storyChapter(): Prisma.StoryChapterDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userStoryProgress`: Exposes CRUD operations for the **UserStoryProgress** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserStoryProgresses
    * const userStoryProgresses = await prisma.userStoryProgress.findMany()
    * ```
    */
  get userStoryProgress(): Prisma.UserStoryProgressDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.legendSaga`: Exposes CRUD operations for the **LegendSaga** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LegendSagas
    * const legendSagas = await prisma.legendSaga.findMany()
    * ```
    */
  get legendSaga(): Prisma.LegendSagaDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.legendSubchapter`: Exposes CRUD operations for the **LegendSubchapter** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LegendSubchapters
    * const legendSubchapters = await prisma.legendSubchapter.findMany()
    * ```
    */
  get legendSubchapter(): Prisma.LegendSubchapterDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userLegendProgress`: Exposes CRUD operations for the **UserLegendProgress** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserLegendProgresses
    * const userLegendProgresses = await prisma.userLegendProgress.findMany()
    * ```
    */
  get userLegendProgress(): Prisma.UserLegendProgressDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.milestone`: Exposes CRUD operations for the **Milestone** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Milestones
    * const milestones = await prisma.milestone.findMany()
    * ```
    */
  get milestone(): Prisma.MilestoneDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userMilestoneProgress`: Exposes CRUD operations for the **UserMilestoneProgress** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserMilestoneProgresses
    * const userMilestoneProgresses = await prisma.userMilestoneProgress.findMany()
    * ```
    */
  get userMilestoneProgress(): Prisma.UserMilestoneProgressDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userCatclawProgress`: Exposes CRUD operations for the **UserCatclawProgress** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserCatclawProgresses
    * const userCatclawProgresses = await prisma.userCatclawProgress.findMany()
    * ```
    */
  get userCatclawProgress(): Prisma.UserCatclawProgressDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.meowMedal`: Exposes CRUD operations for the **MeowMedal** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MeowMedals
    * const meowMedals = await prisma.meowMedal.findMany()
    * ```
    */
  get meowMedal(): Prisma.MeowMedalDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userMeowMedal`: Exposes CRUD operations for the **UserMeowMedal** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserMeowMedals
    * const userMeowMedals = await prisma.userMeowMedal.findMany()
    * ```
    */
  get userMeowMedal(): Prisma.UserMeowMedalDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.2.0
   * Query Engine version: 0c8ef2ce45c83248ab3df073180d5eda9e8be7a3
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    PrivacySettings: 'PrivacySettings',
    Friendship: 'Friendship',
    StoryChapter: 'StoryChapter',
    UserStoryProgress: 'UserStoryProgress',
    LegendSaga: 'LegendSaga',
    LegendSubchapter: 'LegendSubchapter',
    UserLegendProgress: 'UserLegendProgress',
    Milestone: 'Milestone',
    UserMilestoneProgress: 'UserMilestoneProgress',
    UserCatclawProgress: 'UserCatclawProgress',
    MeowMedal: 'MeowMedal',
    UserMeowMedal: 'UserMeowMedal'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "privacySettings" | "friendship" | "storyChapter" | "userStoryProgress" | "legendSaga" | "legendSubchapter" | "userLegendProgress" | "milestone" | "userMilestoneProgress" | "userCatclawProgress" | "meowMedal" | "userMeowMedal"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      PrivacySettings: {
        payload: Prisma.$PrivacySettingsPayload<ExtArgs>
        fields: Prisma.PrivacySettingsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PrivacySettingsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrivacySettingsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PrivacySettingsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrivacySettingsPayload>
          }
          findFirst: {
            args: Prisma.PrivacySettingsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrivacySettingsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PrivacySettingsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrivacySettingsPayload>
          }
          findMany: {
            args: Prisma.PrivacySettingsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrivacySettingsPayload>[]
          }
          create: {
            args: Prisma.PrivacySettingsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrivacySettingsPayload>
          }
          createMany: {
            args: Prisma.PrivacySettingsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PrivacySettingsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrivacySettingsPayload>[]
          }
          delete: {
            args: Prisma.PrivacySettingsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrivacySettingsPayload>
          }
          update: {
            args: Prisma.PrivacySettingsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrivacySettingsPayload>
          }
          deleteMany: {
            args: Prisma.PrivacySettingsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PrivacySettingsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PrivacySettingsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrivacySettingsPayload>[]
          }
          upsert: {
            args: Prisma.PrivacySettingsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PrivacySettingsPayload>
          }
          aggregate: {
            args: Prisma.PrivacySettingsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePrivacySettings>
          }
          groupBy: {
            args: Prisma.PrivacySettingsGroupByArgs<ExtArgs>
            result: $Utils.Optional<PrivacySettingsGroupByOutputType>[]
          }
          count: {
            args: Prisma.PrivacySettingsCountArgs<ExtArgs>
            result: $Utils.Optional<PrivacySettingsCountAggregateOutputType> | number
          }
        }
      }
      Friendship: {
        payload: Prisma.$FriendshipPayload<ExtArgs>
        fields: Prisma.FriendshipFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FriendshipFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendshipPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FriendshipFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendshipPayload>
          }
          findFirst: {
            args: Prisma.FriendshipFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendshipPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FriendshipFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendshipPayload>
          }
          findMany: {
            args: Prisma.FriendshipFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendshipPayload>[]
          }
          create: {
            args: Prisma.FriendshipCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendshipPayload>
          }
          createMany: {
            args: Prisma.FriendshipCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FriendshipCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendshipPayload>[]
          }
          delete: {
            args: Prisma.FriendshipDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendshipPayload>
          }
          update: {
            args: Prisma.FriendshipUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendshipPayload>
          }
          deleteMany: {
            args: Prisma.FriendshipDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FriendshipUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FriendshipUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendshipPayload>[]
          }
          upsert: {
            args: Prisma.FriendshipUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FriendshipPayload>
          }
          aggregate: {
            args: Prisma.FriendshipAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFriendship>
          }
          groupBy: {
            args: Prisma.FriendshipGroupByArgs<ExtArgs>
            result: $Utils.Optional<FriendshipGroupByOutputType>[]
          }
          count: {
            args: Prisma.FriendshipCountArgs<ExtArgs>
            result: $Utils.Optional<FriendshipCountAggregateOutputType> | number
          }
        }
      }
      StoryChapter: {
        payload: Prisma.$StoryChapterPayload<ExtArgs>
        fields: Prisma.StoryChapterFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StoryChapterFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoryChapterPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StoryChapterFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoryChapterPayload>
          }
          findFirst: {
            args: Prisma.StoryChapterFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoryChapterPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StoryChapterFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoryChapterPayload>
          }
          findMany: {
            args: Prisma.StoryChapterFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoryChapterPayload>[]
          }
          create: {
            args: Prisma.StoryChapterCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoryChapterPayload>
          }
          createMany: {
            args: Prisma.StoryChapterCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StoryChapterCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoryChapterPayload>[]
          }
          delete: {
            args: Prisma.StoryChapterDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoryChapterPayload>
          }
          update: {
            args: Prisma.StoryChapterUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoryChapterPayload>
          }
          deleteMany: {
            args: Prisma.StoryChapterDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StoryChapterUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.StoryChapterUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoryChapterPayload>[]
          }
          upsert: {
            args: Prisma.StoryChapterUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StoryChapterPayload>
          }
          aggregate: {
            args: Prisma.StoryChapterAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStoryChapter>
          }
          groupBy: {
            args: Prisma.StoryChapterGroupByArgs<ExtArgs>
            result: $Utils.Optional<StoryChapterGroupByOutputType>[]
          }
          count: {
            args: Prisma.StoryChapterCountArgs<ExtArgs>
            result: $Utils.Optional<StoryChapterCountAggregateOutputType> | number
          }
        }
      }
      UserStoryProgress: {
        payload: Prisma.$UserStoryProgressPayload<ExtArgs>
        fields: Prisma.UserStoryProgressFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserStoryProgressFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserStoryProgressPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserStoryProgressFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserStoryProgressPayload>
          }
          findFirst: {
            args: Prisma.UserStoryProgressFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserStoryProgressPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserStoryProgressFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserStoryProgressPayload>
          }
          findMany: {
            args: Prisma.UserStoryProgressFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserStoryProgressPayload>[]
          }
          create: {
            args: Prisma.UserStoryProgressCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserStoryProgressPayload>
          }
          createMany: {
            args: Prisma.UserStoryProgressCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserStoryProgressCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserStoryProgressPayload>[]
          }
          delete: {
            args: Prisma.UserStoryProgressDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserStoryProgressPayload>
          }
          update: {
            args: Prisma.UserStoryProgressUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserStoryProgressPayload>
          }
          deleteMany: {
            args: Prisma.UserStoryProgressDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserStoryProgressUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserStoryProgressUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserStoryProgressPayload>[]
          }
          upsert: {
            args: Prisma.UserStoryProgressUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserStoryProgressPayload>
          }
          aggregate: {
            args: Prisma.UserStoryProgressAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserStoryProgress>
          }
          groupBy: {
            args: Prisma.UserStoryProgressGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserStoryProgressGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserStoryProgressCountArgs<ExtArgs>
            result: $Utils.Optional<UserStoryProgressCountAggregateOutputType> | number
          }
        }
      }
      LegendSaga: {
        payload: Prisma.$LegendSagaPayload<ExtArgs>
        fields: Prisma.LegendSagaFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LegendSagaFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LegendSagaPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LegendSagaFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LegendSagaPayload>
          }
          findFirst: {
            args: Prisma.LegendSagaFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LegendSagaPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LegendSagaFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LegendSagaPayload>
          }
          findMany: {
            args: Prisma.LegendSagaFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LegendSagaPayload>[]
          }
          create: {
            args: Prisma.LegendSagaCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LegendSagaPayload>
          }
          createMany: {
            args: Prisma.LegendSagaCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LegendSagaCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LegendSagaPayload>[]
          }
          delete: {
            args: Prisma.LegendSagaDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LegendSagaPayload>
          }
          update: {
            args: Prisma.LegendSagaUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LegendSagaPayload>
          }
          deleteMany: {
            args: Prisma.LegendSagaDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LegendSagaUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LegendSagaUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LegendSagaPayload>[]
          }
          upsert: {
            args: Prisma.LegendSagaUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LegendSagaPayload>
          }
          aggregate: {
            args: Prisma.LegendSagaAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLegendSaga>
          }
          groupBy: {
            args: Prisma.LegendSagaGroupByArgs<ExtArgs>
            result: $Utils.Optional<LegendSagaGroupByOutputType>[]
          }
          count: {
            args: Prisma.LegendSagaCountArgs<ExtArgs>
            result: $Utils.Optional<LegendSagaCountAggregateOutputType> | number
          }
        }
      }
      LegendSubchapter: {
        payload: Prisma.$LegendSubchapterPayload<ExtArgs>
        fields: Prisma.LegendSubchapterFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LegendSubchapterFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LegendSubchapterPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LegendSubchapterFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LegendSubchapterPayload>
          }
          findFirst: {
            args: Prisma.LegendSubchapterFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LegendSubchapterPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LegendSubchapterFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LegendSubchapterPayload>
          }
          findMany: {
            args: Prisma.LegendSubchapterFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LegendSubchapterPayload>[]
          }
          create: {
            args: Prisma.LegendSubchapterCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LegendSubchapterPayload>
          }
          createMany: {
            args: Prisma.LegendSubchapterCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LegendSubchapterCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LegendSubchapterPayload>[]
          }
          delete: {
            args: Prisma.LegendSubchapterDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LegendSubchapterPayload>
          }
          update: {
            args: Prisma.LegendSubchapterUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LegendSubchapterPayload>
          }
          deleteMany: {
            args: Prisma.LegendSubchapterDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LegendSubchapterUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LegendSubchapterUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LegendSubchapterPayload>[]
          }
          upsert: {
            args: Prisma.LegendSubchapterUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LegendSubchapterPayload>
          }
          aggregate: {
            args: Prisma.LegendSubchapterAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLegendSubchapter>
          }
          groupBy: {
            args: Prisma.LegendSubchapterGroupByArgs<ExtArgs>
            result: $Utils.Optional<LegendSubchapterGroupByOutputType>[]
          }
          count: {
            args: Prisma.LegendSubchapterCountArgs<ExtArgs>
            result: $Utils.Optional<LegendSubchapterCountAggregateOutputType> | number
          }
        }
      }
      UserLegendProgress: {
        payload: Prisma.$UserLegendProgressPayload<ExtArgs>
        fields: Prisma.UserLegendProgressFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserLegendProgressFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLegendProgressPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserLegendProgressFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLegendProgressPayload>
          }
          findFirst: {
            args: Prisma.UserLegendProgressFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLegendProgressPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserLegendProgressFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLegendProgressPayload>
          }
          findMany: {
            args: Prisma.UserLegendProgressFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLegendProgressPayload>[]
          }
          create: {
            args: Prisma.UserLegendProgressCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLegendProgressPayload>
          }
          createMany: {
            args: Prisma.UserLegendProgressCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserLegendProgressCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLegendProgressPayload>[]
          }
          delete: {
            args: Prisma.UserLegendProgressDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLegendProgressPayload>
          }
          update: {
            args: Prisma.UserLegendProgressUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLegendProgressPayload>
          }
          deleteMany: {
            args: Prisma.UserLegendProgressDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserLegendProgressUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserLegendProgressUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLegendProgressPayload>[]
          }
          upsert: {
            args: Prisma.UserLegendProgressUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserLegendProgressPayload>
          }
          aggregate: {
            args: Prisma.UserLegendProgressAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserLegendProgress>
          }
          groupBy: {
            args: Prisma.UserLegendProgressGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserLegendProgressGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserLegendProgressCountArgs<ExtArgs>
            result: $Utils.Optional<UserLegendProgressCountAggregateOutputType> | number
          }
        }
      }
      Milestone: {
        payload: Prisma.$MilestonePayload<ExtArgs>
        fields: Prisma.MilestoneFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MilestoneFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MilestonePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MilestoneFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MilestonePayload>
          }
          findFirst: {
            args: Prisma.MilestoneFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MilestonePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MilestoneFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MilestonePayload>
          }
          findMany: {
            args: Prisma.MilestoneFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MilestonePayload>[]
          }
          create: {
            args: Prisma.MilestoneCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MilestonePayload>
          }
          createMany: {
            args: Prisma.MilestoneCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MilestoneCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MilestonePayload>[]
          }
          delete: {
            args: Prisma.MilestoneDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MilestonePayload>
          }
          update: {
            args: Prisma.MilestoneUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MilestonePayload>
          }
          deleteMany: {
            args: Prisma.MilestoneDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MilestoneUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MilestoneUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MilestonePayload>[]
          }
          upsert: {
            args: Prisma.MilestoneUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MilestonePayload>
          }
          aggregate: {
            args: Prisma.MilestoneAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMilestone>
          }
          groupBy: {
            args: Prisma.MilestoneGroupByArgs<ExtArgs>
            result: $Utils.Optional<MilestoneGroupByOutputType>[]
          }
          count: {
            args: Prisma.MilestoneCountArgs<ExtArgs>
            result: $Utils.Optional<MilestoneCountAggregateOutputType> | number
          }
        }
      }
      UserMilestoneProgress: {
        payload: Prisma.$UserMilestoneProgressPayload<ExtArgs>
        fields: Prisma.UserMilestoneProgressFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserMilestoneProgressFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserMilestoneProgressPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserMilestoneProgressFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserMilestoneProgressPayload>
          }
          findFirst: {
            args: Prisma.UserMilestoneProgressFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserMilestoneProgressPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserMilestoneProgressFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserMilestoneProgressPayload>
          }
          findMany: {
            args: Prisma.UserMilestoneProgressFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserMilestoneProgressPayload>[]
          }
          create: {
            args: Prisma.UserMilestoneProgressCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserMilestoneProgressPayload>
          }
          createMany: {
            args: Prisma.UserMilestoneProgressCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserMilestoneProgressCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserMilestoneProgressPayload>[]
          }
          delete: {
            args: Prisma.UserMilestoneProgressDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserMilestoneProgressPayload>
          }
          update: {
            args: Prisma.UserMilestoneProgressUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserMilestoneProgressPayload>
          }
          deleteMany: {
            args: Prisma.UserMilestoneProgressDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserMilestoneProgressUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserMilestoneProgressUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserMilestoneProgressPayload>[]
          }
          upsert: {
            args: Prisma.UserMilestoneProgressUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserMilestoneProgressPayload>
          }
          aggregate: {
            args: Prisma.UserMilestoneProgressAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserMilestoneProgress>
          }
          groupBy: {
            args: Prisma.UserMilestoneProgressGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserMilestoneProgressGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserMilestoneProgressCountArgs<ExtArgs>
            result: $Utils.Optional<UserMilestoneProgressCountAggregateOutputType> | number
          }
        }
      }
      UserCatclawProgress: {
        payload: Prisma.$UserCatclawProgressPayload<ExtArgs>
        fields: Prisma.UserCatclawProgressFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserCatclawProgressFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserCatclawProgressPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserCatclawProgressFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserCatclawProgressPayload>
          }
          findFirst: {
            args: Prisma.UserCatclawProgressFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserCatclawProgressPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserCatclawProgressFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserCatclawProgressPayload>
          }
          findMany: {
            args: Prisma.UserCatclawProgressFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserCatclawProgressPayload>[]
          }
          create: {
            args: Prisma.UserCatclawProgressCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserCatclawProgressPayload>
          }
          createMany: {
            args: Prisma.UserCatclawProgressCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCatclawProgressCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserCatclawProgressPayload>[]
          }
          delete: {
            args: Prisma.UserCatclawProgressDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserCatclawProgressPayload>
          }
          update: {
            args: Prisma.UserCatclawProgressUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserCatclawProgressPayload>
          }
          deleteMany: {
            args: Prisma.UserCatclawProgressDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserCatclawProgressUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserCatclawProgressUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserCatclawProgressPayload>[]
          }
          upsert: {
            args: Prisma.UserCatclawProgressUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserCatclawProgressPayload>
          }
          aggregate: {
            args: Prisma.UserCatclawProgressAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserCatclawProgress>
          }
          groupBy: {
            args: Prisma.UserCatclawProgressGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserCatclawProgressGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCatclawProgressCountArgs<ExtArgs>
            result: $Utils.Optional<UserCatclawProgressCountAggregateOutputType> | number
          }
        }
      }
      MeowMedal: {
        payload: Prisma.$MeowMedalPayload<ExtArgs>
        fields: Prisma.MeowMedalFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MeowMedalFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeowMedalPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MeowMedalFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeowMedalPayload>
          }
          findFirst: {
            args: Prisma.MeowMedalFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeowMedalPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MeowMedalFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeowMedalPayload>
          }
          findMany: {
            args: Prisma.MeowMedalFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeowMedalPayload>[]
          }
          create: {
            args: Prisma.MeowMedalCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeowMedalPayload>
          }
          createMany: {
            args: Prisma.MeowMedalCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MeowMedalCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeowMedalPayload>[]
          }
          delete: {
            args: Prisma.MeowMedalDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeowMedalPayload>
          }
          update: {
            args: Prisma.MeowMedalUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeowMedalPayload>
          }
          deleteMany: {
            args: Prisma.MeowMedalDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MeowMedalUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MeowMedalUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeowMedalPayload>[]
          }
          upsert: {
            args: Prisma.MeowMedalUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MeowMedalPayload>
          }
          aggregate: {
            args: Prisma.MeowMedalAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMeowMedal>
          }
          groupBy: {
            args: Prisma.MeowMedalGroupByArgs<ExtArgs>
            result: $Utils.Optional<MeowMedalGroupByOutputType>[]
          }
          count: {
            args: Prisma.MeowMedalCountArgs<ExtArgs>
            result: $Utils.Optional<MeowMedalCountAggregateOutputType> | number
          }
        }
      }
      UserMeowMedal: {
        payload: Prisma.$UserMeowMedalPayload<ExtArgs>
        fields: Prisma.UserMeowMedalFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserMeowMedalFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserMeowMedalPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserMeowMedalFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserMeowMedalPayload>
          }
          findFirst: {
            args: Prisma.UserMeowMedalFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserMeowMedalPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserMeowMedalFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserMeowMedalPayload>
          }
          findMany: {
            args: Prisma.UserMeowMedalFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserMeowMedalPayload>[]
          }
          create: {
            args: Prisma.UserMeowMedalCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserMeowMedalPayload>
          }
          createMany: {
            args: Prisma.UserMeowMedalCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserMeowMedalCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserMeowMedalPayload>[]
          }
          delete: {
            args: Prisma.UserMeowMedalDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserMeowMedalPayload>
          }
          update: {
            args: Prisma.UserMeowMedalUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserMeowMedalPayload>
          }
          deleteMany: {
            args: Prisma.UserMeowMedalDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserMeowMedalUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserMeowMedalUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserMeowMedalPayload>[]
          }
          upsert: {
            args: Prisma.UserMeowMedalUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserMeowMedalPayload>
          }
          aggregate: {
            args: Prisma.UserMeowMedalAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserMeowMedal>
          }
          groupBy: {
            args: Prisma.UserMeowMedalGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserMeowMedalGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserMeowMedalCountArgs<ExtArgs>
            result: $Utils.Optional<UserMeowMedalCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    privacySettings?: PrivacySettingsOmit
    friendship?: FriendshipOmit
    storyChapter?: StoryChapterOmit
    userStoryProgress?: UserStoryProgressOmit
    legendSaga?: LegendSagaOmit
    legendSubchapter?: LegendSubchapterOmit
    userLegendProgress?: UserLegendProgressOmit
    milestone?: MilestoneOmit
    userMilestoneProgress?: UserMilestoneProgressOmit
    userCatclawProgress?: UserCatclawProgressOmit
    meowMedal?: MeowMedalOmit
    userMeowMedal?: UserMeowMedalOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    sentFriendRequests: number
    receivedFriendRequests: number
    storyProgress: number
    legendProgress: number
    milestoneProgress: number
    meowMedalProgress: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sentFriendRequests?: boolean | UserCountOutputTypeCountSentFriendRequestsArgs
    receivedFriendRequests?: boolean | UserCountOutputTypeCountReceivedFriendRequestsArgs
    storyProgress?: boolean | UserCountOutputTypeCountStoryProgressArgs
    legendProgress?: boolean | UserCountOutputTypeCountLegendProgressArgs
    milestoneProgress?: boolean | UserCountOutputTypeCountMilestoneProgressArgs
    meowMedalProgress?: boolean | UserCountOutputTypeCountMeowMedalProgressArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSentFriendRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FriendshipWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountReceivedFriendRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FriendshipWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountStoryProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserStoryProgressWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountLegendProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserLegendProgressWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountMilestoneProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserMilestoneProgressWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountMeowMedalProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserMeowMedalWhereInput
  }


  /**
   * Count Type StoryChapterCountOutputType
   */

  export type StoryChapterCountOutputType = {
    progress: number
  }

  export type StoryChapterCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    progress?: boolean | StoryChapterCountOutputTypeCountProgressArgs
  }

  // Custom InputTypes
  /**
   * StoryChapterCountOutputType without action
   */
  export type StoryChapterCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoryChapterCountOutputType
     */
    select?: StoryChapterCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * StoryChapterCountOutputType without action
   */
  export type StoryChapterCountOutputTypeCountProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserStoryProgressWhereInput
  }


  /**
   * Count Type LegendSagaCountOutputType
   */

  export type LegendSagaCountOutputType = {
    subchapters: number
  }

  export type LegendSagaCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    subchapters?: boolean | LegendSagaCountOutputTypeCountSubchaptersArgs
  }

  // Custom InputTypes
  /**
   * LegendSagaCountOutputType without action
   */
  export type LegendSagaCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LegendSagaCountOutputType
     */
    select?: LegendSagaCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * LegendSagaCountOutputType without action
   */
  export type LegendSagaCountOutputTypeCountSubchaptersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LegendSubchapterWhereInput
  }


  /**
   * Count Type LegendSubchapterCountOutputType
   */

  export type LegendSubchapterCountOutputType = {
    progress: number
  }

  export type LegendSubchapterCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    progress?: boolean | LegendSubchapterCountOutputTypeCountProgressArgs
  }

  // Custom InputTypes
  /**
   * LegendSubchapterCountOutputType without action
   */
  export type LegendSubchapterCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LegendSubchapterCountOutputType
     */
    select?: LegendSubchapterCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * LegendSubchapterCountOutputType without action
   */
  export type LegendSubchapterCountOutputTypeCountProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserLegendProgressWhereInput
  }


  /**
   * Count Type MilestoneCountOutputType
   */

  export type MilestoneCountOutputType = {
    progress: number
  }

  export type MilestoneCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    progress?: boolean | MilestoneCountOutputTypeCountProgressArgs
  }

  // Custom InputTypes
  /**
   * MilestoneCountOutputType without action
   */
  export type MilestoneCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MilestoneCountOutputType
     */
    select?: MilestoneCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MilestoneCountOutputType without action
   */
  export type MilestoneCountOutputTypeCountProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserMilestoneProgressWhereInput
  }


  /**
   * Count Type MeowMedalCountOutputType
   */

  export type MeowMedalCountOutputType = {
    earnedBy: number
  }

  export type MeowMedalCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    earnedBy?: boolean | MeowMedalCountOutputTypeCountEarnedByArgs
  }

  // Custom InputTypes
  /**
   * MeowMedalCountOutputType without action
   */
  export type MeowMedalCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeowMedalCountOutputType
     */
    select?: MeowMedalCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MeowMedalCountOutputType without action
   */
  export type MeowMedalCountOutputTypeCountEarnedByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserMeowMedalWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    username: string | null
    email: string | null
    passwordHash: string | null
    displayName: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    username: string | null
    email: string | null
    passwordHash: string | null
    displayName: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    username: number
    email: number
    passwordHash: number
    displayName: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    username?: true
    email?: true
    passwordHash?: true
    displayName?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    username?: true
    email?: true
    passwordHash?: true
    displayName?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    username?: true
    email?: true
    passwordHash?: true
    displayName?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    username: string
    email: string | null
    passwordHash: string
    displayName: string | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    email?: boolean
    passwordHash?: boolean
    displayName?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    privacy?: boolean | User$privacyArgs<ExtArgs>
    sentFriendRequests?: boolean | User$sentFriendRequestsArgs<ExtArgs>
    receivedFriendRequests?: boolean | User$receivedFriendRequestsArgs<ExtArgs>
    storyProgress?: boolean | User$storyProgressArgs<ExtArgs>
    legendProgress?: boolean | User$legendProgressArgs<ExtArgs>
    milestoneProgress?: boolean | User$milestoneProgressArgs<ExtArgs>
    catclawProgress?: boolean | User$catclawProgressArgs<ExtArgs>
    meowMedalProgress?: boolean | User$meowMedalProgressArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    email?: boolean
    passwordHash?: boolean
    displayName?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    email?: boolean
    passwordHash?: boolean
    displayName?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    username?: boolean
    email?: boolean
    passwordHash?: boolean
    displayName?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "username" | "email" | "passwordHash" | "displayName" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    privacy?: boolean | User$privacyArgs<ExtArgs>
    sentFriendRequests?: boolean | User$sentFriendRequestsArgs<ExtArgs>
    receivedFriendRequests?: boolean | User$receivedFriendRequestsArgs<ExtArgs>
    storyProgress?: boolean | User$storyProgressArgs<ExtArgs>
    legendProgress?: boolean | User$legendProgressArgs<ExtArgs>
    milestoneProgress?: boolean | User$milestoneProgressArgs<ExtArgs>
    catclawProgress?: boolean | User$catclawProgressArgs<ExtArgs>
    meowMedalProgress?: boolean | User$meowMedalProgressArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      privacy: Prisma.$PrivacySettingsPayload<ExtArgs> | null
      sentFriendRequests: Prisma.$FriendshipPayload<ExtArgs>[]
      receivedFriendRequests: Prisma.$FriendshipPayload<ExtArgs>[]
      storyProgress: Prisma.$UserStoryProgressPayload<ExtArgs>[]
      legendProgress: Prisma.$UserLegendProgressPayload<ExtArgs>[]
      milestoneProgress: Prisma.$UserMilestoneProgressPayload<ExtArgs>[]
      catclawProgress: Prisma.$UserCatclawProgressPayload<ExtArgs> | null
      meowMedalProgress: Prisma.$UserMeowMedalPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      username: string
      email: string | null
      passwordHash: string
      displayName: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    privacy<T extends User$privacyArgs<ExtArgs> = {}>(args?: Subset<T, User$privacyArgs<ExtArgs>>): Prisma__PrivacySettingsClient<$Result.GetResult<Prisma.$PrivacySettingsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    sentFriendRequests<T extends User$sentFriendRequestsArgs<ExtArgs> = {}>(args?: Subset<T, User$sentFriendRequestsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    receivedFriendRequests<T extends User$receivedFriendRequestsArgs<ExtArgs> = {}>(args?: Subset<T, User$receivedFriendRequestsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    storyProgress<T extends User$storyProgressArgs<ExtArgs> = {}>(args?: Subset<T, User$storyProgressArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserStoryProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    legendProgress<T extends User$legendProgressArgs<ExtArgs> = {}>(args?: Subset<T, User$legendProgressArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserLegendProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    milestoneProgress<T extends User$milestoneProgressArgs<ExtArgs> = {}>(args?: Subset<T, User$milestoneProgressArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserMilestoneProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    catclawProgress<T extends User$catclawProgressArgs<ExtArgs> = {}>(args?: Subset<T, User$catclawProgressArgs<ExtArgs>>): Prisma__UserCatclawProgressClient<$Result.GetResult<Prisma.$UserCatclawProgressPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    meowMedalProgress<T extends User$meowMedalProgressArgs<ExtArgs> = {}>(args?: Subset<T, User$meowMedalProgressArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserMeowMedalPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly username: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly displayName: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.privacy
   */
  export type User$privacyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrivacySettings
     */
    select?: PrivacySettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PrivacySettings
     */
    omit?: PrivacySettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrivacySettingsInclude<ExtArgs> | null
    where?: PrivacySettingsWhereInput
  }

  /**
   * User.sentFriendRequests
   */
  export type User$sentFriendRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipInclude<ExtArgs> | null
    where?: FriendshipWhereInput
    orderBy?: FriendshipOrderByWithRelationInput | FriendshipOrderByWithRelationInput[]
    cursor?: FriendshipWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FriendshipScalarFieldEnum | FriendshipScalarFieldEnum[]
  }

  /**
   * User.receivedFriendRequests
   */
  export type User$receivedFriendRequestsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipInclude<ExtArgs> | null
    where?: FriendshipWhereInput
    orderBy?: FriendshipOrderByWithRelationInput | FriendshipOrderByWithRelationInput[]
    cursor?: FriendshipWhereUniqueInput
    take?: number
    skip?: number
    distinct?: FriendshipScalarFieldEnum | FriendshipScalarFieldEnum[]
  }

  /**
   * User.storyProgress
   */
  export type User$storyProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStoryProgress
     */
    select?: UserStoryProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStoryProgress
     */
    omit?: UserStoryProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStoryProgressInclude<ExtArgs> | null
    where?: UserStoryProgressWhereInput
    orderBy?: UserStoryProgressOrderByWithRelationInput | UserStoryProgressOrderByWithRelationInput[]
    cursor?: UserStoryProgressWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserStoryProgressScalarFieldEnum | UserStoryProgressScalarFieldEnum[]
  }

  /**
   * User.legendProgress
   */
  export type User$legendProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLegendProgress
     */
    select?: UserLegendProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserLegendProgress
     */
    omit?: UserLegendProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserLegendProgressInclude<ExtArgs> | null
    where?: UserLegendProgressWhereInput
    orderBy?: UserLegendProgressOrderByWithRelationInput | UserLegendProgressOrderByWithRelationInput[]
    cursor?: UserLegendProgressWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserLegendProgressScalarFieldEnum | UserLegendProgressScalarFieldEnum[]
  }

  /**
   * User.milestoneProgress
   */
  export type User$milestoneProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserMilestoneProgress
     */
    select?: UserMilestoneProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserMilestoneProgress
     */
    omit?: UserMilestoneProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserMilestoneProgressInclude<ExtArgs> | null
    where?: UserMilestoneProgressWhereInput
    orderBy?: UserMilestoneProgressOrderByWithRelationInput | UserMilestoneProgressOrderByWithRelationInput[]
    cursor?: UserMilestoneProgressWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserMilestoneProgressScalarFieldEnum | UserMilestoneProgressScalarFieldEnum[]
  }

  /**
   * User.catclawProgress
   */
  export type User$catclawProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCatclawProgress
     */
    select?: UserCatclawProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCatclawProgress
     */
    omit?: UserCatclawProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserCatclawProgressInclude<ExtArgs> | null
    where?: UserCatclawProgressWhereInput
  }

  /**
   * User.meowMedalProgress
   */
  export type User$meowMedalProgressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserMeowMedal
     */
    select?: UserMeowMedalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserMeowMedal
     */
    omit?: UserMeowMedalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserMeowMedalInclude<ExtArgs> | null
    where?: UserMeowMedalWhereInput
    orderBy?: UserMeowMedalOrderByWithRelationInput | UserMeowMedalOrderByWithRelationInput[]
    cursor?: UserMeowMedalWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserMeowMedalScalarFieldEnum | UserMeowMedalScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model PrivacySettings
   */

  export type AggregatePrivacySettings = {
    _count: PrivacySettingsCountAggregateOutputType | null
    _min: PrivacySettingsMinAggregateOutputType | null
    _max: PrivacySettingsMaxAggregateOutputType | null
  }

  export type PrivacySettingsMinAggregateOutputType = {
    userId: string | null
    profileVisibility: $Enums.Visibility | null
    progressVisibility: $Enums.Visibility | null
  }

  export type PrivacySettingsMaxAggregateOutputType = {
    userId: string | null
    profileVisibility: $Enums.Visibility | null
    progressVisibility: $Enums.Visibility | null
  }

  export type PrivacySettingsCountAggregateOutputType = {
    userId: number
    profileVisibility: number
    progressVisibility: number
    _all: number
  }


  export type PrivacySettingsMinAggregateInputType = {
    userId?: true
    profileVisibility?: true
    progressVisibility?: true
  }

  export type PrivacySettingsMaxAggregateInputType = {
    userId?: true
    profileVisibility?: true
    progressVisibility?: true
  }

  export type PrivacySettingsCountAggregateInputType = {
    userId?: true
    profileVisibility?: true
    progressVisibility?: true
    _all?: true
  }

  export type PrivacySettingsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PrivacySettings to aggregate.
     */
    where?: PrivacySettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PrivacySettings to fetch.
     */
    orderBy?: PrivacySettingsOrderByWithRelationInput | PrivacySettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PrivacySettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PrivacySettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PrivacySettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PrivacySettings
    **/
    _count?: true | PrivacySettingsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PrivacySettingsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PrivacySettingsMaxAggregateInputType
  }

  export type GetPrivacySettingsAggregateType<T extends PrivacySettingsAggregateArgs> = {
        [P in keyof T & keyof AggregatePrivacySettings]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePrivacySettings[P]>
      : GetScalarType<T[P], AggregatePrivacySettings[P]>
  }




  export type PrivacySettingsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PrivacySettingsWhereInput
    orderBy?: PrivacySettingsOrderByWithAggregationInput | PrivacySettingsOrderByWithAggregationInput[]
    by: PrivacySettingsScalarFieldEnum[] | PrivacySettingsScalarFieldEnum
    having?: PrivacySettingsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PrivacySettingsCountAggregateInputType | true
    _min?: PrivacySettingsMinAggregateInputType
    _max?: PrivacySettingsMaxAggregateInputType
  }

  export type PrivacySettingsGroupByOutputType = {
    userId: string
    profileVisibility: $Enums.Visibility
    progressVisibility: $Enums.Visibility
    _count: PrivacySettingsCountAggregateOutputType | null
    _min: PrivacySettingsMinAggregateOutputType | null
    _max: PrivacySettingsMaxAggregateOutputType | null
  }

  type GetPrivacySettingsGroupByPayload<T extends PrivacySettingsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PrivacySettingsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PrivacySettingsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PrivacySettingsGroupByOutputType[P]>
            : GetScalarType<T[P], PrivacySettingsGroupByOutputType[P]>
        }
      >
    >


  export type PrivacySettingsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    profileVisibility?: boolean
    progressVisibility?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["privacySettings"]>

  export type PrivacySettingsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    profileVisibility?: boolean
    progressVisibility?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["privacySettings"]>

  export type PrivacySettingsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    userId?: boolean
    profileVisibility?: boolean
    progressVisibility?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["privacySettings"]>

  export type PrivacySettingsSelectScalar = {
    userId?: boolean
    profileVisibility?: boolean
    progressVisibility?: boolean
  }

  export type PrivacySettingsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"userId" | "profileVisibility" | "progressVisibility", ExtArgs["result"]["privacySettings"]>
  export type PrivacySettingsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PrivacySettingsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PrivacySettingsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $PrivacySettingsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PrivacySettings"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      userId: string
      profileVisibility: $Enums.Visibility
      progressVisibility: $Enums.Visibility
    }, ExtArgs["result"]["privacySettings"]>
    composites: {}
  }

  type PrivacySettingsGetPayload<S extends boolean | null | undefined | PrivacySettingsDefaultArgs> = $Result.GetResult<Prisma.$PrivacySettingsPayload, S>

  type PrivacySettingsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PrivacySettingsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PrivacySettingsCountAggregateInputType | true
    }

  export interface PrivacySettingsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PrivacySettings'], meta: { name: 'PrivacySettings' } }
    /**
     * Find zero or one PrivacySettings that matches the filter.
     * @param {PrivacySettingsFindUniqueArgs} args - Arguments to find a PrivacySettings
     * @example
     * // Get one PrivacySettings
     * const privacySettings = await prisma.privacySettings.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PrivacySettingsFindUniqueArgs>(args: SelectSubset<T, PrivacySettingsFindUniqueArgs<ExtArgs>>): Prisma__PrivacySettingsClient<$Result.GetResult<Prisma.$PrivacySettingsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PrivacySettings that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PrivacySettingsFindUniqueOrThrowArgs} args - Arguments to find a PrivacySettings
     * @example
     * // Get one PrivacySettings
     * const privacySettings = await prisma.privacySettings.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PrivacySettingsFindUniqueOrThrowArgs>(args: SelectSubset<T, PrivacySettingsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PrivacySettingsClient<$Result.GetResult<Prisma.$PrivacySettingsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PrivacySettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrivacySettingsFindFirstArgs} args - Arguments to find a PrivacySettings
     * @example
     * // Get one PrivacySettings
     * const privacySettings = await prisma.privacySettings.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PrivacySettingsFindFirstArgs>(args?: SelectSubset<T, PrivacySettingsFindFirstArgs<ExtArgs>>): Prisma__PrivacySettingsClient<$Result.GetResult<Prisma.$PrivacySettingsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PrivacySettings that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrivacySettingsFindFirstOrThrowArgs} args - Arguments to find a PrivacySettings
     * @example
     * // Get one PrivacySettings
     * const privacySettings = await prisma.privacySettings.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PrivacySettingsFindFirstOrThrowArgs>(args?: SelectSubset<T, PrivacySettingsFindFirstOrThrowArgs<ExtArgs>>): Prisma__PrivacySettingsClient<$Result.GetResult<Prisma.$PrivacySettingsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PrivacySettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrivacySettingsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PrivacySettings
     * const privacySettings = await prisma.privacySettings.findMany()
     * 
     * // Get first 10 PrivacySettings
     * const privacySettings = await prisma.privacySettings.findMany({ take: 10 })
     * 
     * // Only select the `userId`
     * const privacySettingsWithUserIdOnly = await prisma.privacySettings.findMany({ select: { userId: true } })
     * 
     */
    findMany<T extends PrivacySettingsFindManyArgs>(args?: SelectSubset<T, PrivacySettingsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PrivacySettingsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PrivacySettings.
     * @param {PrivacySettingsCreateArgs} args - Arguments to create a PrivacySettings.
     * @example
     * // Create one PrivacySettings
     * const PrivacySettings = await prisma.privacySettings.create({
     *   data: {
     *     // ... data to create a PrivacySettings
     *   }
     * })
     * 
     */
    create<T extends PrivacySettingsCreateArgs>(args: SelectSubset<T, PrivacySettingsCreateArgs<ExtArgs>>): Prisma__PrivacySettingsClient<$Result.GetResult<Prisma.$PrivacySettingsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PrivacySettings.
     * @param {PrivacySettingsCreateManyArgs} args - Arguments to create many PrivacySettings.
     * @example
     * // Create many PrivacySettings
     * const privacySettings = await prisma.privacySettings.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PrivacySettingsCreateManyArgs>(args?: SelectSubset<T, PrivacySettingsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PrivacySettings and returns the data saved in the database.
     * @param {PrivacySettingsCreateManyAndReturnArgs} args - Arguments to create many PrivacySettings.
     * @example
     * // Create many PrivacySettings
     * const privacySettings = await prisma.privacySettings.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PrivacySettings and only return the `userId`
     * const privacySettingsWithUserIdOnly = await prisma.privacySettings.createManyAndReturn({
     *   select: { userId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PrivacySettingsCreateManyAndReturnArgs>(args?: SelectSubset<T, PrivacySettingsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PrivacySettingsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PrivacySettings.
     * @param {PrivacySettingsDeleteArgs} args - Arguments to delete one PrivacySettings.
     * @example
     * // Delete one PrivacySettings
     * const PrivacySettings = await prisma.privacySettings.delete({
     *   where: {
     *     // ... filter to delete one PrivacySettings
     *   }
     * })
     * 
     */
    delete<T extends PrivacySettingsDeleteArgs>(args: SelectSubset<T, PrivacySettingsDeleteArgs<ExtArgs>>): Prisma__PrivacySettingsClient<$Result.GetResult<Prisma.$PrivacySettingsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PrivacySettings.
     * @param {PrivacySettingsUpdateArgs} args - Arguments to update one PrivacySettings.
     * @example
     * // Update one PrivacySettings
     * const privacySettings = await prisma.privacySettings.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PrivacySettingsUpdateArgs>(args: SelectSubset<T, PrivacySettingsUpdateArgs<ExtArgs>>): Prisma__PrivacySettingsClient<$Result.GetResult<Prisma.$PrivacySettingsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PrivacySettings.
     * @param {PrivacySettingsDeleteManyArgs} args - Arguments to filter PrivacySettings to delete.
     * @example
     * // Delete a few PrivacySettings
     * const { count } = await prisma.privacySettings.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PrivacySettingsDeleteManyArgs>(args?: SelectSubset<T, PrivacySettingsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PrivacySettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrivacySettingsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PrivacySettings
     * const privacySettings = await prisma.privacySettings.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PrivacySettingsUpdateManyArgs>(args: SelectSubset<T, PrivacySettingsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PrivacySettings and returns the data updated in the database.
     * @param {PrivacySettingsUpdateManyAndReturnArgs} args - Arguments to update many PrivacySettings.
     * @example
     * // Update many PrivacySettings
     * const privacySettings = await prisma.privacySettings.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PrivacySettings and only return the `userId`
     * const privacySettingsWithUserIdOnly = await prisma.privacySettings.updateManyAndReturn({
     *   select: { userId: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PrivacySettingsUpdateManyAndReturnArgs>(args: SelectSubset<T, PrivacySettingsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PrivacySettingsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PrivacySettings.
     * @param {PrivacySettingsUpsertArgs} args - Arguments to update or create a PrivacySettings.
     * @example
     * // Update or create a PrivacySettings
     * const privacySettings = await prisma.privacySettings.upsert({
     *   create: {
     *     // ... data to create a PrivacySettings
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PrivacySettings we want to update
     *   }
     * })
     */
    upsert<T extends PrivacySettingsUpsertArgs>(args: SelectSubset<T, PrivacySettingsUpsertArgs<ExtArgs>>): Prisma__PrivacySettingsClient<$Result.GetResult<Prisma.$PrivacySettingsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PrivacySettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrivacySettingsCountArgs} args - Arguments to filter PrivacySettings to count.
     * @example
     * // Count the number of PrivacySettings
     * const count = await prisma.privacySettings.count({
     *   where: {
     *     // ... the filter for the PrivacySettings we want to count
     *   }
     * })
    **/
    count<T extends PrivacySettingsCountArgs>(
      args?: Subset<T, PrivacySettingsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PrivacySettingsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PrivacySettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrivacySettingsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PrivacySettingsAggregateArgs>(args: Subset<T, PrivacySettingsAggregateArgs>): Prisma.PrismaPromise<GetPrivacySettingsAggregateType<T>>

    /**
     * Group by PrivacySettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PrivacySettingsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PrivacySettingsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PrivacySettingsGroupByArgs['orderBy'] }
        : { orderBy?: PrivacySettingsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PrivacySettingsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPrivacySettingsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PrivacySettings model
   */
  readonly fields: PrivacySettingsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PrivacySettings.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PrivacySettingsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PrivacySettings model
   */
  interface PrivacySettingsFieldRefs {
    readonly userId: FieldRef<"PrivacySettings", 'String'>
    readonly profileVisibility: FieldRef<"PrivacySettings", 'Visibility'>
    readonly progressVisibility: FieldRef<"PrivacySettings", 'Visibility'>
  }
    

  // Custom InputTypes
  /**
   * PrivacySettings findUnique
   */
  export type PrivacySettingsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrivacySettings
     */
    select?: PrivacySettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PrivacySettings
     */
    omit?: PrivacySettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrivacySettingsInclude<ExtArgs> | null
    /**
     * Filter, which PrivacySettings to fetch.
     */
    where: PrivacySettingsWhereUniqueInput
  }

  /**
   * PrivacySettings findUniqueOrThrow
   */
  export type PrivacySettingsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrivacySettings
     */
    select?: PrivacySettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PrivacySettings
     */
    omit?: PrivacySettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrivacySettingsInclude<ExtArgs> | null
    /**
     * Filter, which PrivacySettings to fetch.
     */
    where: PrivacySettingsWhereUniqueInput
  }

  /**
   * PrivacySettings findFirst
   */
  export type PrivacySettingsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrivacySettings
     */
    select?: PrivacySettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PrivacySettings
     */
    omit?: PrivacySettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrivacySettingsInclude<ExtArgs> | null
    /**
     * Filter, which PrivacySettings to fetch.
     */
    where?: PrivacySettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PrivacySettings to fetch.
     */
    orderBy?: PrivacySettingsOrderByWithRelationInput | PrivacySettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PrivacySettings.
     */
    cursor?: PrivacySettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PrivacySettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PrivacySettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PrivacySettings.
     */
    distinct?: PrivacySettingsScalarFieldEnum | PrivacySettingsScalarFieldEnum[]
  }

  /**
   * PrivacySettings findFirstOrThrow
   */
  export type PrivacySettingsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrivacySettings
     */
    select?: PrivacySettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PrivacySettings
     */
    omit?: PrivacySettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrivacySettingsInclude<ExtArgs> | null
    /**
     * Filter, which PrivacySettings to fetch.
     */
    where?: PrivacySettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PrivacySettings to fetch.
     */
    orderBy?: PrivacySettingsOrderByWithRelationInput | PrivacySettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PrivacySettings.
     */
    cursor?: PrivacySettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PrivacySettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PrivacySettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PrivacySettings.
     */
    distinct?: PrivacySettingsScalarFieldEnum | PrivacySettingsScalarFieldEnum[]
  }

  /**
   * PrivacySettings findMany
   */
  export type PrivacySettingsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrivacySettings
     */
    select?: PrivacySettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PrivacySettings
     */
    omit?: PrivacySettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrivacySettingsInclude<ExtArgs> | null
    /**
     * Filter, which PrivacySettings to fetch.
     */
    where?: PrivacySettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PrivacySettings to fetch.
     */
    orderBy?: PrivacySettingsOrderByWithRelationInput | PrivacySettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PrivacySettings.
     */
    cursor?: PrivacySettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PrivacySettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PrivacySettings.
     */
    skip?: number
    distinct?: PrivacySettingsScalarFieldEnum | PrivacySettingsScalarFieldEnum[]
  }

  /**
   * PrivacySettings create
   */
  export type PrivacySettingsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrivacySettings
     */
    select?: PrivacySettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PrivacySettings
     */
    omit?: PrivacySettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrivacySettingsInclude<ExtArgs> | null
    /**
     * The data needed to create a PrivacySettings.
     */
    data: XOR<PrivacySettingsCreateInput, PrivacySettingsUncheckedCreateInput>
  }

  /**
   * PrivacySettings createMany
   */
  export type PrivacySettingsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PrivacySettings.
     */
    data: PrivacySettingsCreateManyInput | PrivacySettingsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PrivacySettings createManyAndReturn
   */
  export type PrivacySettingsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrivacySettings
     */
    select?: PrivacySettingsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PrivacySettings
     */
    omit?: PrivacySettingsOmit<ExtArgs> | null
    /**
     * The data used to create many PrivacySettings.
     */
    data: PrivacySettingsCreateManyInput | PrivacySettingsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrivacySettingsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PrivacySettings update
   */
  export type PrivacySettingsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrivacySettings
     */
    select?: PrivacySettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PrivacySettings
     */
    omit?: PrivacySettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrivacySettingsInclude<ExtArgs> | null
    /**
     * The data needed to update a PrivacySettings.
     */
    data: XOR<PrivacySettingsUpdateInput, PrivacySettingsUncheckedUpdateInput>
    /**
     * Choose, which PrivacySettings to update.
     */
    where: PrivacySettingsWhereUniqueInput
  }

  /**
   * PrivacySettings updateMany
   */
  export type PrivacySettingsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PrivacySettings.
     */
    data: XOR<PrivacySettingsUpdateManyMutationInput, PrivacySettingsUncheckedUpdateManyInput>
    /**
     * Filter which PrivacySettings to update
     */
    where?: PrivacySettingsWhereInput
    /**
     * Limit how many PrivacySettings to update.
     */
    limit?: number
  }

  /**
   * PrivacySettings updateManyAndReturn
   */
  export type PrivacySettingsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrivacySettings
     */
    select?: PrivacySettingsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PrivacySettings
     */
    omit?: PrivacySettingsOmit<ExtArgs> | null
    /**
     * The data used to update PrivacySettings.
     */
    data: XOR<PrivacySettingsUpdateManyMutationInput, PrivacySettingsUncheckedUpdateManyInput>
    /**
     * Filter which PrivacySettings to update
     */
    where?: PrivacySettingsWhereInput
    /**
     * Limit how many PrivacySettings to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrivacySettingsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PrivacySettings upsert
   */
  export type PrivacySettingsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrivacySettings
     */
    select?: PrivacySettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PrivacySettings
     */
    omit?: PrivacySettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrivacySettingsInclude<ExtArgs> | null
    /**
     * The filter to search for the PrivacySettings to update in case it exists.
     */
    where: PrivacySettingsWhereUniqueInput
    /**
     * In case the PrivacySettings found by the `where` argument doesn't exist, create a new PrivacySettings with this data.
     */
    create: XOR<PrivacySettingsCreateInput, PrivacySettingsUncheckedCreateInput>
    /**
     * In case the PrivacySettings was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PrivacySettingsUpdateInput, PrivacySettingsUncheckedUpdateInput>
  }

  /**
   * PrivacySettings delete
   */
  export type PrivacySettingsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrivacySettings
     */
    select?: PrivacySettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PrivacySettings
     */
    omit?: PrivacySettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrivacySettingsInclude<ExtArgs> | null
    /**
     * Filter which PrivacySettings to delete.
     */
    where: PrivacySettingsWhereUniqueInput
  }

  /**
   * PrivacySettings deleteMany
   */
  export type PrivacySettingsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PrivacySettings to delete
     */
    where?: PrivacySettingsWhereInput
    /**
     * Limit how many PrivacySettings to delete.
     */
    limit?: number
  }

  /**
   * PrivacySettings without action
   */
  export type PrivacySettingsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PrivacySettings
     */
    select?: PrivacySettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PrivacySettings
     */
    omit?: PrivacySettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PrivacySettingsInclude<ExtArgs> | null
  }


  /**
   * Model Friendship
   */

  export type AggregateFriendship = {
    _count: FriendshipCountAggregateOutputType | null
    _min: FriendshipMinAggregateOutputType | null
    _max: FriendshipMaxAggregateOutputType | null
  }

  export type FriendshipMinAggregateOutputType = {
    id: string | null
    requesterId: string | null
    addresseeId: string | null
    status: $Enums.FriendshipStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FriendshipMaxAggregateOutputType = {
    id: string | null
    requesterId: string | null
    addresseeId: string | null
    status: $Enums.FriendshipStatus | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type FriendshipCountAggregateOutputType = {
    id: number
    requesterId: number
    addresseeId: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type FriendshipMinAggregateInputType = {
    id?: true
    requesterId?: true
    addresseeId?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FriendshipMaxAggregateInputType = {
    id?: true
    requesterId?: true
    addresseeId?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type FriendshipCountAggregateInputType = {
    id?: true
    requesterId?: true
    addresseeId?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type FriendshipAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Friendship to aggregate.
     */
    where?: FriendshipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Friendships to fetch.
     */
    orderBy?: FriendshipOrderByWithRelationInput | FriendshipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FriendshipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Friendships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Friendships.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Friendships
    **/
    _count?: true | FriendshipCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FriendshipMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FriendshipMaxAggregateInputType
  }

  export type GetFriendshipAggregateType<T extends FriendshipAggregateArgs> = {
        [P in keyof T & keyof AggregateFriendship]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFriendship[P]>
      : GetScalarType<T[P], AggregateFriendship[P]>
  }




  export type FriendshipGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FriendshipWhereInput
    orderBy?: FriendshipOrderByWithAggregationInput | FriendshipOrderByWithAggregationInput[]
    by: FriendshipScalarFieldEnum[] | FriendshipScalarFieldEnum
    having?: FriendshipScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FriendshipCountAggregateInputType | true
    _min?: FriendshipMinAggregateInputType
    _max?: FriendshipMaxAggregateInputType
  }

  export type FriendshipGroupByOutputType = {
    id: string
    requesterId: string
    addresseeId: string
    status: $Enums.FriendshipStatus
    createdAt: Date
    updatedAt: Date
    _count: FriendshipCountAggregateOutputType | null
    _min: FriendshipMinAggregateOutputType | null
    _max: FriendshipMaxAggregateOutputType | null
  }

  type GetFriendshipGroupByPayload<T extends FriendshipGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FriendshipGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FriendshipGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FriendshipGroupByOutputType[P]>
            : GetScalarType<T[P], FriendshipGroupByOutputType[P]>
        }
      >
    >


  export type FriendshipSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requesterId?: boolean
    addresseeId?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    requester?: boolean | UserDefaultArgs<ExtArgs>
    addressee?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["friendship"]>

  export type FriendshipSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requesterId?: boolean
    addresseeId?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    requester?: boolean | UserDefaultArgs<ExtArgs>
    addressee?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["friendship"]>

  export type FriendshipSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    requesterId?: boolean
    addresseeId?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    requester?: boolean | UserDefaultArgs<ExtArgs>
    addressee?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["friendship"]>

  export type FriendshipSelectScalar = {
    id?: boolean
    requesterId?: boolean
    addresseeId?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type FriendshipOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "requesterId" | "addresseeId" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["friendship"]>
  export type FriendshipInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    requester?: boolean | UserDefaultArgs<ExtArgs>
    addressee?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type FriendshipIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    requester?: boolean | UserDefaultArgs<ExtArgs>
    addressee?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type FriendshipIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    requester?: boolean | UserDefaultArgs<ExtArgs>
    addressee?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $FriendshipPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Friendship"
    objects: {
      requester: Prisma.$UserPayload<ExtArgs>
      addressee: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      requesterId: string
      addresseeId: string
      status: $Enums.FriendshipStatus
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["friendship"]>
    composites: {}
  }

  type FriendshipGetPayload<S extends boolean | null | undefined | FriendshipDefaultArgs> = $Result.GetResult<Prisma.$FriendshipPayload, S>

  type FriendshipCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FriendshipFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FriendshipCountAggregateInputType | true
    }

  export interface FriendshipDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Friendship'], meta: { name: 'Friendship' } }
    /**
     * Find zero or one Friendship that matches the filter.
     * @param {FriendshipFindUniqueArgs} args - Arguments to find a Friendship
     * @example
     * // Get one Friendship
     * const friendship = await prisma.friendship.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FriendshipFindUniqueArgs>(args: SelectSubset<T, FriendshipFindUniqueArgs<ExtArgs>>): Prisma__FriendshipClient<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Friendship that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FriendshipFindUniqueOrThrowArgs} args - Arguments to find a Friendship
     * @example
     * // Get one Friendship
     * const friendship = await prisma.friendship.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FriendshipFindUniqueOrThrowArgs>(args: SelectSubset<T, FriendshipFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FriendshipClient<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Friendship that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FriendshipFindFirstArgs} args - Arguments to find a Friendship
     * @example
     * // Get one Friendship
     * const friendship = await prisma.friendship.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FriendshipFindFirstArgs>(args?: SelectSubset<T, FriendshipFindFirstArgs<ExtArgs>>): Prisma__FriendshipClient<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Friendship that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FriendshipFindFirstOrThrowArgs} args - Arguments to find a Friendship
     * @example
     * // Get one Friendship
     * const friendship = await prisma.friendship.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FriendshipFindFirstOrThrowArgs>(args?: SelectSubset<T, FriendshipFindFirstOrThrowArgs<ExtArgs>>): Prisma__FriendshipClient<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Friendships that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FriendshipFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Friendships
     * const friendships = await prisma.friendship.findMany()
     * 
     * // Get first 10 Friendships
     * const friendships = await prisma.friendship.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const friendshipWithIdOnly = await prisma.friendship.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FriendshipFindManyArgs>(args?: SelectSubset<T, FriendshipFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Friendship.
     * @param {FriendshipCreateArgs} args - Arguments to create a Friendship.
     * @example
     * // Create one Friendship
     * const Friendship = await prisma.friendship.create({
     *   data: {
     *     // ... data to create a Friendship
     *   }
     * })
     * 
     */
    create<T extends FriendshipCreateArgs>(args: SelectSubset<T, FriendshipCreateArgs<ExtArgs>>): Prisma__FriendshipClient<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Friendships.
     * @param {FriendshipCreateManyArgs} args - Arguments to create many Friendships.
     * @example
     * // Create many Friendships
     * const friendship = await prisma.friendship.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FriendshipCreateManyArgs>(args?: SelectSubset<T, FriendshipCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Friendships and returns the data saved in the database.
     * @param {FriendshipCreateManyAndReturnArgs} args - Arguments to create many Friendships.
     * @example
     * // Create many Friendships
     * const friendship = await prisma.friendship.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Friendships and only return the `id`
     * const friendshipWithIdOnly = await prisma.friendship.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FriendshipCreateManyAndReturnArgs>(args?: SelectSubset<T, FriendshipCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Friendship.
     * @param {FriendshipDeleteArgs} args - Arguments to delete one Friendship.
     * @example
     * // Delete one Friendship
     * const Friendship = await prisma.friendship.delete({
     *   where: {
     *     // ... filter to delete one Friendship
     *   }
     * })
     * 
     */
    delete<T extends FriendshipDeleteArgs>(args: SelectSubset<T, FriendshipDeleteArgs<ExtArgs>>): Prisma__FriendshipClient<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Friendship.
     * @param {FriendshipUpdateArgs} args - Arguments to update one Friendship.
     * @example
     * // Update one Friendship
     * const friendship = await prisma.friendship.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FriendshipUpdateArgs>(args: SelectSubset<T, FriendshipUpdateArgs<ExtArgs>>): Prisma__FriendshipClient<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Friendships.
     * @param {FriendshipDeleteManyArgs} args - Arguments to filter Friendships to delete.
     * @example
     * // Delete a few Friendships
     * const { count } = await prisma.friendship.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FriendshipDeleteManyArgs>(args?: SelectSubset<T, FriendshipDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Friendships.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FriendshipUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Friendships
     * const friendship = await prisma.friendship.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FriendshipUpdateManyArgs>(args: SelectSubset<T, FriendshipUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Friendships and returns the data updated in the database.
     * @param {FriendshipUpdateManyAndReturnArgs} args - Arguments to update many Friendships.
     * @example
     * // Update many Friendships
     * const friendship = await prisma.friendship.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Friendships and only return the `id`
     * const friendshipWithIdOnly = await prisma.friendship.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FriendshipUpdateManyAndReturnArgs>(args: SelectSubset<T, FriendshipUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Friendship.
     * @param {FriendshipUpsertArgs} args - Arguments to update or create a Friendship.
     * @example
     * // Update or create a Friendship
     * const friendship = await prisma.friendship.upsert({
     *   create: {
     *     // ... data to create a Friendship
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Friendship we want to update
     *   }
     * })
     */
    upsert<T extends FriendshipUpsertArgs>(args: SelectSubset<T, FriendshipUpsertArgs<ExtArgs>>): Prisma__FriendshipClient<$Result.GetResult<Prisma.$FriendshipPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Friendships.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FriendshipCountArgs} args - Arguments to filter Friendships to count.
     * @example
     * // Count the number of Friendships
     * const count = await prisma.friendship.count({
     *   where: {
     *     // ... the filter for the Friendships we want to count
     *   }
     * })
    **/
    count<T extends FriendshipCountArgs>(
      args?: Subset<T, FriendshipCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FriendshipCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Friendship.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FriendshipAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FriendshipAggregateArgs>(args: Subset<T, FriendshipAggregateArgs>): Prisma.PrismaPromise<GetFriendshipAggregateType<T>>

    /**
     * Group by Friendship.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FriendshipGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FriendshipGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FriendshipGroupByArgs['orderBy'] }
        : { orderBy?: FriendshipGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FriendshipGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFriendshipGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Friendship model
   */
  readonly fields: FriendshipFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Friendship.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FriendshipClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    requester<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    addressee<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Friendship model
   */
  interface FriendshipFieldRefs {
    readonly id: FieldRef<"Friendship", 'String'>
    readonly requesterId: FieldRef<"Friendship", 'String'>
    readonly addresseeId: FieldRef<"Friendship", 'String'>
    readonly status: FieldRef<"Friendship", 'FriendshipStatus'>
    readonly createdAt: FieldRef<"Friendship", 'DateTime'>
    readonly updatedAt: FieldRef<"Friendship", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Friendship findUnique
   */
  export type FriendshipFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipInclude<ExtArgs> | null
    /**
     * Filter, which Friendship to fetch.
     */
    where: FriendshipWhereUniqueInput
  }

  /**
   * Friendship findUniqueOrThrow
   */
  export type FriendshipFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipInclude<ExtArgs> | null
    /**
     * Filter, which Friendship to fetch.
     */
    where: FriendshipWhereUniqueInput
  }

  /**
   * Friendship findFirst
   */
  export type FriendshipFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipInclude<ExtArgs> | null
    /**
     * Filter, which Friendship to fetch.
     */
    where?: FriendshipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Friendships to fetch.
     */
    orderBy?: FriendshipOrderByWithRelationInput | FriendshipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Friendships.
     */
    cursor?: FriendshipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Friendships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Friendships.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Friendships.
     */
    distinct?: FriendshipScalarFieldEnum | FriendshipScalarFieldEnum[]
  }

  /**
   * Friendship findFirstOrThrow
   */
  export type FriendshipFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipInclude<ExtArgs> | null
    /**
     * Filter, which Friendship to fetch.
     */
    where?: FriendshipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Friendships to fetch.
     */
    orderBy?: FriendshipOrderByWithRelationInput | FriendshipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Friendships.
     */
    cursor?: FriendshipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Friendships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Friendships.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Friendships.
     */
    distinct?: FriendshipScalarFieldEnum | FriendshipScalarFieldEnum[]
  }

  /**
   * Friendship findMany
   */
  export type FriendshipFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipInclude<ExtArgs> | null
    /**
     * Filter, which Friendships to fetch.
     */
    where?: FriendshipWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Friendships to fetch.
     */
    orderBy?: FriendshipOrderByWithRelationInput | FriendshipOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Friendships.
     */
    cursor?: FriendshipWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Friendships from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Friendships.
     */
    skip?: number
    distinct?: FriendshipScalarFieldEnum | FriendshipScalarFieldEnum[]
  }

  /**
   * Friendship create
   */
  export type FriendshipCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipInclude<ExtArgs> | null
    /**
     * The data needed to create a Friendship.
     */
    data: XOR<FriendshipCreateInput, FriendshipUncheckedCreateInput>
  }

  /**
   * Friendship createMany
   */
  export type FriendshipCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Friendships.
     */
    data: FriendshipCreateManyInput | FriendshipCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Friendship createManyAndReturn
   */
  export type FriendshipCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * The data used to create many Friendships.
     */
    data: FriendshipCreateManyInput | FriendshipCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Friendship update
   */
  export type FriendshipUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipInclude<ExtArgs> | null
    /**
     * The data needed to update a Friendship.
     */
    data: XOR<FriendshipUpdateInput, FriendshipUncheckedUpdateInput>
    /**
     * Choose, which Friendship to update.
     */
    where: FriendshipWhereUniqueInput
  }

  /**
   * Friendship updateMany
   */
  export type FriendshipUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Friendships.
     */
    data: XOR<FriendshipUpdateManyMutationInput, FriendshipUncheckedUpdateManyInput>
    /**
     * Filter which Friendships to update
     */
    where?: FriendshipWhereInput
    /**
     * Limit how many Friendships to update.
     */
    limit?: number
  }

  /**
   * Friendship updateManyAndReturn
   */
  export type FriendshipUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * The data used to update Friendships.
     */
    data: XOR<FriendshipUpdateManyMutationInput, FriendshipUncheckedUpdateManyInput>
    /**
     * Filter which Friendships to update
     */
    where?: FriendshipWhereInput
    /**
     * Limit how many Friendships to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Friendship upsert
   */
  export type FriendshipUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipInclude<ExtArgs> | null
    /**
     * The filter to search for the Friendship to update in case it exists.
     */
    where: FriendshipWhereUniqueInput
    /**
     * In case the Friendship found by the `where` argument doesn't exist, create a new Friendship with this data.
     */
    create: XOR<FriendshipCreateInput, FriendshipUncheckedCreateInput>
    /**
     * In case the Friendship was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FriendshipUpdateInput, FriendshipUncheckedUpdateInput>
  }

  /**
   * Friendship delete
   */
  export type FriendshipDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipInclude<ExtArgs> | null
    /**
     * Filter which Friendship to delete.
     */
    where: FriendshipWhereUniqueInput
  }

  /**
   * Friendship deleteMany
   */
  export type FriendshipDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Friendships to delete
     */
    where?: FriendshipWhereInput
    /**
     * Limit how many Friendships to delete.
     */
    limit?: number
  }

  /**
   * Friendship without action
   */
  export type FriendshipDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Friendship
     */
    select?: FriendshipSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Friendship
     */
    omit?: FriendshipOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FriendshipInclude<ExtArgs> | null
  }


  /**
   * Model StoryChapter
   */

  export type AggregateStoryChapter = {
    _count: StoryChapterCountAggregateOutputType | null
    _avg: StoryChapterAvgAggregateOutputType | null
    _sum: StoryChapterSumAggregateOutputType | null
    _min: StoryChapterMinAggregateOutputType | null
    _max: StoryChapterMaxAggregateOutputType | null
  }

  export type StoryChapterAvgAggregateOutputType = {
    chapterNumber: number | null
    sortOrder: number | null
  }

  export type StoryChapterSumAggregateOutputType = {
    chapterNumber: number | null
    sortOrder: number | null
  }

  export type StoryChapterMinAggregateOutputType = {
    id: string | null
    arc: string | null
    chapterNumber: number | null
    displayName: string | null
    sortOrder: number | null
  }

  export type StoryChapterMaxAggregateOutputType = {
    id: string | null
    arc: string | null
    chapterNumber: number | null
    displayName: string | null
    sortOrder: number | null
  }

  export type StoryChapterCountAggregateOutputType = {
    id: number
    arc: number
    chapterNumber: number
    displayName: number
    sortOrder: number
    _all: number
  }


  export type StoryChapterAvgAggregateInputType = {
    chapterNumber?: true
    sortOrder?: true
  }

  export type StoryChapterSumAggregateInputType = {
    chapterNumber?: true
    sortOrder?: true
  }

  export type StoryChapterMinAggregateInputType = {
    id?: true
    arc?: true
    chapterNumber?: true
    displayName?: true
    sortOrder?: true
  }

  export type StoryChapterMaxAggregateInputType = {
    id?: true
    arc?: true
    chapterNumber?: true
    displayName?: true
    sortOrder?: true
  }

  export type StoryChapterCountAggregateInputType = {
    id?: true
    arc?: true
    chapterNumber?: true
    displayName?: true
    sortOrder?: true
    _all?: true
  }

  export type StoryChapterAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StoryChapter to aggregate.
     */
    where?: StoryChapterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StoryChapters to fetch.
     */
    orderBy?: StoryChapterOrderByWithRelationInput | StoryChapterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StoryChapterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StoryChapters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StoryChapters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned StoryChapters
    **/
    _count?: true | StoryChapterCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: StoryChapterAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: StoryChapterSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StoryChapterMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StoryChapterMaxAggregateInputType
  }

  export type GetStoryChapterAggregateType<T extends StoryChapterAggregateArgs> = {
        [P in keyof T & keyof AggregateStoryChapter]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStoryChapter[P]>
      : GetScalarType<T[P], AggregateStoryChapter[P]>
  }




  export type StoryChapterGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StoryChapterWhereInput
    orderBy?: StoryChapterOrderByWithAggregationInput | StoryChapterOrderByWithAggregationInput[]
    by: StoryChapterScalarFieldEnum[] | StoryChapterScalarFieldEnum
    having?: StoryChapterScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StoryChapterCountAggregateInputType | true
    _avg?: StoryChapterAvgAggregateInputType
    _sum?: StoryChapterSumAggregateInputType
    _min?: StoryChapterMinAggregateInputType
    _max?: StoryChapterMaxAggregateInputType
  }

  export type StoryChapterGroupByOutputType = {
    id: string
    arc: string
    chapterNumber: number
    displayName: string
    sortOrder: number
    _count: StoryChapterCountAggregateOutputType | null
    _avg: StoryChapterAvgAggregateOutputType | null
    _sum: StoryChapterSumAggregateOutputType | null
    _min: StoryChapterMinAggregateOutputType | null
    _max: StoryChapterMaxAggregateOutputType | null
  }

  type GetStoryChapterGroupByPayload<T extends StoryChapterGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StoryChapterGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StoryChapterGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StoryChapterGroupByOutputType[P]>
            : GetScalarType<T[P], StoryChapterGroupByOutputType[P]>
        }
      >
    >


  export type StoryChapterSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    arc?: boolean
    chapterNumber?: boolean
    displayName?: boolean
    sortOrder?: boolean
    progress?: boolean | StoryChapter$progressArgs<ExtArgs>
    _count?: boolean | StoryChapterCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["storyChapter"]>

  export type StoryChapterSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    arc?: boolean
    chapterNumber?: boolean
    displayName?: boolean
    sortOrder?: boolean
  }, ExtArgs["result"]["storyChapter"]>

  export type StoryChapterSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    arc?: boolean
    chapterNumber?: boolean
    displayName?: boolean
    sortOrder?: boolean
  }, ExtArgs["result"]["storyChapter"]>

  export type StoryChapterSelectScalar = {
    id?: boolean
    arc?: boolean
    chapterNumber?: boolean
    displayName?: boolean
    sortOrder?: boolean
  }

  export type StoryChapterOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "arc" | "chapterNumber" | "displayName" | "sortOrder", ExtArgs["result"]["storyChapter"]>
  export type StoryChapterInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    progress?: boolean | StoryChapter$progressArgs<ExtArgs>
    _count?: boolean | StoryChapterCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type StoryChapterIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type StoryChapterIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $StoryChapterPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "StoryChapter"
    objects: {
      progress: Prisma.$UserStoryProgressPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      arc: string
      chapterNumber: number
      displayName: string
      sortOrder: number
    }, ExtArgs["result"]["storyChapter"]>
    composites: {}
  }

  type StoryChapterGetPayload<S extends boolean | null | undefined | StoryChapterDefaultArgs> = $Result.GetResult<Prisma.$StoryChapterPayload, S>

  type StoryChapterCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<StoryChapterFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: StoryChapterCountAggregateInputType | true
    }

  export interface StoryChapterDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['StoryChapter'], meta: { name: 'StoryChapter' } }
    /**
     * Find zero or one StoryChapter that matches the filter.
     * @param {StoryChapterFindUniqueArgs} args - Arguments to find a StoryChapter
     * @example
     * // Get one StoryChapter
     * const storyChapter = await prisma.storyChapter.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StoryChapterFindUniqueArgs>(args: SelectSubset<T, StoryChapterFindUniqueArgs<ExtArgs>>): Prisma__StoryChapterClient<$Result.GetResult<Prisma.$StoryChapterPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one StoryChapter that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {StoryChapterFindUniqueOrThrowArgs} args - Arguments to find a StoryChapter
     * @example
     * // Get one StoryChapter
     * const storyChapter = await prisma.storyChapter.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StoryChapterFindUniqueOrThrowArgs>(args: SelectSubset<T, StoryChapterFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StoryChapterClient<$Result.GetResult<Prisma.$StoryChapterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StoryChapter that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoryChapterFindFirstArgs} args - Arguments to find a StoryChapter
     * @example
     * // Get one StoryChapter
     * const storyChapter = await prisma.storyChapter.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StoryChapterFindFirstArgs>(args?: SelectSubset<T, StoryChapterFindFirstArgs<ExtArgs>>): Prisma__StoryChapterClient<$Result.GetResult<Prisma.$StoryChapterPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first StoryChapter that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoryChapterFindFirstOrThrowArgs} args - Arguments to find a StoryChapter
     * @example
     * // Get one StoryChapter
     * const storyChapter = await prisma.storyChapter.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StoryChapterFindFirstOrThrowArgs>(args?: SelectSubset<T, StoryChapterFindFirstOrThrowArgs<ExtArgs>>): Prisma__StoryChapterClient<$Result.GetResult<Prisma.$StoryChapterPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more StoryChapters that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoryChapterFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all StoryChapters
     * const storyChapters = await prisma.storyChapter.findMany()
     * 
     * // Get first 10 StoryChapters
     * const storyChapters = await prisma.storyChapter.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const storyChapterWithIdOnly = await prisma.storyChapter.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StoryChapterFindManyArgs>(args?: SelectSubset<T, StoryChapterFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StoryChapterPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a StoryChapter.
     * @param {StoryChapterCreateArgs} args - Arguments to create a StoryChapter.
     * @example
     * // Create one StoryChapter
     * const StoryChapter = await prisma.storyChapter.create({
     *   data: {
     *     // ... data to create a StoryChapter
     *   }
     * })
     * 
     */
    create<T extends StoryChapterCreateArgs>(args: SelectSubset<T, StoryChapterCreateArgs<ExtArgs>>): Prisma__StoryChapterClient<$Result.GetResult<Prisma.$StoryChapterPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many StoryChapters.
     * @param {StoryChapterCreateManyArgs} args - Arguments to create many StoryChapters.
     * @example
     * // Create many StoryChapters
     * const storyChapter = await prisma.storyChapter.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StoryChapterCreateManyArgs>(args?: SelectSubset<T, StoryChapterCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many StoryChapters and returns the data saved in the database.
     * @param {StoryChapterCreateManyAndReturnArgs} args - Arguments to create many StoryChapters.
     * @example
     * // Create many StoryChapters
     * const storyChapter = await prisma.storyChapter.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many StoryChapters and only return the `id`
     * const storyChapterWithIdOnly = await prisma.storyChapter.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StoryChapterCreateManyAndReturnArgs>(args?: SelectSubset<T, StoryChapterCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StoryChapterPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a StoryChapter.
     * @param {StoryChapterDeleteArgs} args - Arguments to delete one StoryChapter.
     * @example
     * // Delete one StoryChapter
     * const StoryChapter = await prisma.storyChapter.delete({
     *   where: {
     *     // ... filter to delete one StoryChapter
     *   }
     * })
     * 
     */
    delete<T extends StoryChapterDeleteArgs>(args: SelectSubset<T, StoryChapterDeleteArgs<ExtArgs>>): Prisma__StoryChapterClient<$Result.GetResult<Prisma.$StoryChapterPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one StoryChapter.
     * @param {StoryChapterUpdateArgs} args - Arguments to update one StoryChapter.
     * @example
     * // Update one StoryChapter
     * const storyChapter = await prisma.storyChapter.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StoryChapterUpdateArgs>(args: SelectSubset<T, StoryChapterUpdateArgs<ExtArgs>>): Prisma__StoryChapterClient<$Result.GetResult<Prisma.$StoryChapterPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more StoryChapters.
     * @param {StoryChapterDeleteManyArgs} args - Arguments to filter StoryChapters to delete.
     * @example
     * // Delete a few StoryChapters
     * const { count } = await prisma.storyChapter.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StoryChapterDeleteManyArgs>(args?: SelectSubset<T, StoryChapterDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StoryChapters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoryChapterUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many StoryChapters
     * const storyChapter = await prisma.storyChapter.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StoryChapterUpdateManyArgs>(args: SelectSubset<T, StoryChapterUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more StoryChapters and returns the data updated in the database.
     * @param {StoryChapterUpdateManyAndReturnArgs} args - Arguments to update many StoryChapters.
     * @example
     * // Update many StoryChapters
     * const storyChapter = await prisma.storyChapter.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more StoryChapters and only return the `id`
     * const storyChapterWithIdOnly = await prisma.storyChapter.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends StoryChapterUpdateManyAndReturnArgs>(args: SelectSubset<T, StoryChapterUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StoryChapterPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one StoryChapter.
     * @param {StoryChapterUpsertArgs} args - Arguments to update or create a StoryChapter.
     * @example
     * // Update or create a StoryChapter
     * const storyChapter = await prisma.storyChapter.upsert({
     *   create: {
     *     // ... data to create a StoryChapter
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the StoryChapter we want to update
     *   }
     * })
     */
    upsert<T extends StoryChapterUpsertArgs>(args: SelectSubset<T, StoryChapterUpsertArgs<ExtArgs>>): Prisma__StoryChapterClient<$Result.GetResult<Prisma.$StoryChapterPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of StoryChapters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoryChapterCountArgs} args - Arguments to filter StoryChapters to count.
     * @example
     * // Count the number of StoryChapters
     * const count = await prisma.storyChapter.count({
     *   where: {
     *     // ... the filter for the StoryChapters we want to count
     *   }
     * })
    **/
    count<T extends StoryChapterCountArgs>(
      args?: Subset<T, StoryChapterCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StoryChapterCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a StoryChapter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoryChapterAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends StoryChapterAggregateArgs>(args: Subset<T, StoryChapterAggregateArgs>): Prisma.PrismaPromise<GetStoryChapterAggregateType<T>>

    /**
     * Group by StoryChapter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StoryChapterGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends StoryChapterGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StoryChapterGroupByArgs['orderBy'] }
        : { orderBy?: StoryChapterGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, StoryChapterGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStoryChapterGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the StoryChapter model
   */
  readonly fields: StoryChapterFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for StoryChapter.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StoryChapterClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    progress<T extends StoryChapter$progressArgs<ExtArgs> = {}>(args?: Subset<T, StoryChapter$progressArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserStoryProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the StoryChapter model
   */
  interface StoryChapterFieldRefs {
    readonly id: FieldRef<"StoryChapter", 'String'>
    readonly arc: FieldRef<"StoryChapter", 'String'>
    readonly chapterNumber: FieldRef<"StoryChapter", 'Int'>
    readonly displayName: FieldRef<"StoryChapter", 'String'>
    readonly sortOrder: FieldRef<"StoryChapter", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * StoryChapter findUnique
   */
  export type StoryChapterFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoryChapter
     */
    select?: StoryChapterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StoryChapter
     */
    omit?: StoryChapterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoryChapterInclude<ExtArgs> | null
    /**
     * Filter, which StoryChapter to fetch.
     */
    where: StoryChapterWhereUniqueInput
  }

  /**
   * StoryChapter findUniqueOrThrow
   */
  export type StoryChapterFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoryChapter
     */
    select?: StoryChapterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StoryChapter
     */
    omit?: StoryChapterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoryChapterInclude<ExtArgs> | null
    /**
     * Filter, which StoryChapter to fetch.
     */
    where: StoryChapterWhereUniqueInput
  }

  /**
   * StoryChapter findFirst
   */
  export type StoryChapterFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoryChapter
     */
    select?: StoryChapterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StoryChapter
     */
    omit?: StoryChapterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoryChapterInclude<ExtArgs> | null
    /**
     * Filter, which StoryChapter to fetch.
     */
    where?: StoryChapterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StoryChapters to fetch.
     */
    orderBy?: StoryChapterOrderByWithRelationInput | StoryChapterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StoryChapters.
     */
    cursor?: StoryChapterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StoryChapters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StoryChapters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StoryChapters.
     */
    distinct?: StoryChapterScalarFieldEnum | StoryChapterScalarFieldEnum[]
  }

  /**
   * StoryChapter findFirstOrThrow
   */
  export type StoryChapterFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoryChapter
     */
    select?: StoryChapterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StoryChapter
     */
    omit?: StoryChapterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoryChapterInclude<ExtArgs> | null
    /**
     * Filter, which StoryChapter to fetch.
     */
    where?: StoryChapterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StoryChapters to fetch.
     */
    orderBy?: StoryChapterOrderByWithRelationInput | StoryChapterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for StoryChapters.
     */
    cursor?: StoryChapterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StoryChapters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StoryChapters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of StoryChapters.
     */
    distinct?: StoryChapterScalarFieldEnum | StoryChapterScalarFieldEnum[]
  }

  /**
   * StoryChapter findMany
   */
  export type StoryChapterFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoryChapter
     */
    select?: StoryChapterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StoryChapter
     */
    omit?: StoryChapterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoryChapterInclude<ExtArgs> | null
    /**
     * Filter, which StoryChapters to fetch.
     */
    where?: StoryChapterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of StoryChapters to fetch.
     */
    orderBy?: StoryChapterOrderByWithRelationInput | StoryChapterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing StoryChapters.
     */
    cursor?: StoryChapterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` StoryChapters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` StoryChapters.
     */
    skip?: number
    distinct?: StoryChapterScalarFieldEnum | StoryChapterScalarFieldEnum[]
  }

  /**
   * StoryChapter create
   */
  export type StoryChapterCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoryChapter
     */
    select?: StoryChapterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StoryChapter
     */
    omit?: StoryChapterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoryChapterInclude<ExtArgs> | null
    /**
     * The data needed to create a StoryChapter.
     */
    data: XOR<StoryChapterCreateInput, StoryChapterUncheckedCreateInput>
  }

  /**
   * StoryChapter createMany
   */
  export type StoryChapterCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many StoryChapters.
     */
    data: StoryChapterCreateManyInput | StoryChapterCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * StoryChapter createManyAndReturn
   */
  export type StoryChapterCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoryChapter
     */
    select?: StoryChapterSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StoryChapter
     */
    omit?: StoryChapterOmit<ExtArgs> | null
    /**
     * The data used to create many StoryChapters.
     */
    data: StoryChapterCreateManyInput | StoryChapterCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * StoryChapter update
   */
  export type StoryChapterUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoryChapter
     */
    select?: StoryChapterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StoryChapter
     */
    omit?: StoryChapterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoryChapterInclude<ExtArgs> | null
    /**
     * The data needed to update a StoryChapter.
     */
    data: XOR<StoryChapterUpdateInput, StoryChapterUncheckedUpdateInput>
    /**
     * Choose, which StoryChapter to update.
     */
    where: StoryChapterWhereUniqueInput
  }

  /**
   * StoryChapter updateMany
   */
  export type StoryChapterUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update StoryChapters.
     */
    data: XOR<StoryChapterUpdateManyMutationInput, StoryChapterUncheckedUpdateManyInput>
    /**
     * Filter which StoryChapters to update
     */
    where?: StoryChapterWhereInput
    /**
     * Limit how many StoryChapters to update.
     */
    limit?: number
  }

  /**
   * StoryChapter updateManyAndReturn
   */
  export type StoryChapterUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoryChapter
     */
    select?: StoryChapterSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the StoryChapter
     */
    omit?: StoryChapterOmit<ExtArgs> | null
    /**
     * The data used to update StoryChapters.
     */
    data: XOR<StoryChapterUpdateManyMutationInput, StoryChapterUncheckedUpdateManyInput>
    /**
     * Filter which StoryChapters to update
     */
    where?: StoryChapterWhereInput
    /**
     * Limit how many StoryChapters to update.
     */
    limit?: number
  }

  /**
   * StoryChapter upsert
   */
  export type StoryChapterUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoryChapter
     */
    select?: StoryChapterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StoryChapter
     */
    omit?: StoryChapterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoryChapterInclude<ExtArgs> | null
    /**
     * The filter to search for the StoryChapter to update in case it exists.
     */
    where: StoryChapterWhereUniqueInput
    /**
     * In case the StoryChapter found by the `where` argument doesn't exist, create a new StoryChapter with this data.
     */
    create: XOR<StoryChapterCreateInput, StoryChapterUncheckedCreateInput>
    /**
     * In case the StoryChapter was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StoryChapterUpdateInput, StoryChapterUncheckedUpdateInput>
  }

  /**
   * StoryChapter delete
   */
  export type StoryChapterDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoryChapter
     */
    select?: StoryChapterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StoryChapter
     */
    omit?: StoryChapterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoryChapterInclude<ExtArgs> | null
    /**
     * Filter which StoryChapter to delete.
     */
    where: StoryChapterWhereUniqueInput
  }

  /**
   * StoryChapter deleteMany
   */
  export type StoryChapterDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which StoryChapters to delete
     */
    where?: StoryChapterWhereInput
    /**
     * Limit how many StoryChapters to delete.
     */
    limit?: number
  }

  /**
   * StoryChapter.progress
   */
  export type StoryChapter$progressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStoryProgress
     */
    select?: UserStoryProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStoryProgress
     */
    omit?: UserStoryProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStoryProgressInclude<ExtArgs> | null
    where?: UserStoryProgressWhereInput
    orderBy?: UserStoryProgressOrderByWithRelationInput | UserStoryProgressOrderByWithRelationInput[]
    cursor?: UserStoryProgressWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserStoryProgressScalarFieldEnum | UserStoryProgressScalarFieldEnum[]
  }

  /**
   * StoryChapter without action
   */
  export type StoryChapterDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StoryChapter
     */
    select?: StoryChapterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the StoryChapter
     */
    omit?: StoryChapterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StoryChapterInclude<ExtArgs> | null
  }


  /**
   * Model UserStoryProgress
   */

  export type AggregateUserStoryProgress = {
    _count: UserStoryProgressCountAggregateOutputType | null
    _min: UserStoryProgressMinAggregateOutputType | null
    _max: UserStoryProgressMaxAggregateOutputType | null
  }

  export type UserStoryProgressMinAggregateOutputType = {
    id: string | null
    userId: string | null
    storyChapterId: string | null
    cleared: boolean | null
    treasures: $Enums.TreasureStatus | null
    zombies: $Enums.ZombieStatus | null
    updatedAt: Date | null
  }

  export type UserStoryProgressMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    storyChapterId: string | null
    cleared: boolean | null
    treasures: $Enums.TreasureStatus | null
    zombies: $Enums.ZombieStatus | null
    updatedAt: Date | null
  }

  export type UserStoryProgressCountAggregateOutputType = {
    id: number
    userId: number
    storyChapterId: number
    cleared: number
    treasures: number
    zombies: number
    updatedAt: number
    _all: number
  }


  export type UserStoryProgressMinAggregateInputType = {
    id?: true
    userId?: true
    storyChapterId?: true
    cleared?: true
    treasures?: true
    zombies?: true
    updatedAt?: true
  }

  export type UserStoryProgressMaxAggregateInputType = {
    id?: true
    userId?: true
    storyChapterId?: true
    cleared?: true
    treasures?: true
    zombies?: true
    updatedAt?: true
  }

  export type UserStoryProgressCountAggregateInputType = {
    id?: true
    userId?: true
    storyChapterId?: true
    cleared?: true
    treasures?: true
    zombies?: true
    updatedAt?: true
    _all?: true
  }

  export type UserStoryProgressAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserStoryProgress to aggregate.
     */
    where?: UserStoryProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserStoryProgresses to fetch.
     */
    orderBy?: UserStoryProgressOrderByWithRelationInput | UserStoryProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserStoryProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserStoryProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserStoryProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserStoryProgresses
    **/
    _count?: true | UserStoryProgressCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserStoryProgressMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserStoryProgressMaxAggregateInputType
  }

  export type GetUserStoryProgressAggregateType<T extends UserStoryProgressAggregateArgs> = {
        [P in keyof T & keyof AggregateUserStoryProgress]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserStoryProgress[P]>
      : GetScalarType<T[P], AggregateUserStoryProgress[P]>
  }




  export type UserStoryProgressGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserStoryProgressWhereInput
    orderBy?: UserStoryProgressOrderByWithAggregationInput | UserStoryProgressOrderByWithAggregationInput[]
    by: UserStoryProgressScalarFieldEnum[] | UserStoryProgressScalarFieldEnum
    having?: UserStoryProgressScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserStoryProgressCountAggregateInputType | true
    _min?: UserStoryProgressMinAggregateInputType
    _max?: UserStoryProgressMaxAggregateInputType
  }

  export type UserStoryProgressGroupByOutputType = {
    id: string
    userId: string
    storyChapterId: string
    cleared: boolean
    treasures: $Enums.TreasureStatus
    zombies: $Enums.ZombieStatus
    updatedAt: Date
    _count: UserStoryProgressCountAggregateOutputType | null
    _min: UserStoryProgressMinAggregateOutputType | null
    _max: UserStoryProgressMaxAggregateOutputType | null
  }

  type GetUserStoryProgressGroupByPayload<T extends UserStoryProgressGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserStoryProgressGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserStoryProgressGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserStoryProgressGroupByOutputType[P]>
            : GetScalarType<T[P], UserStoryProgressGroupByOutputType[P]>
        }
      >
    >


  export type UserStoryProgressSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    storyChapterId?: boolean
    cleared?: boolean
    treasures?: boolean
    zombies?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    chapter?: boolean | StoryChapterDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userStoryProgress"]>

  export type UserStoryProgressSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    storyChapterId?: boolean
    cleared?: boolean
    treasures?: boolean
    zombies?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    chapter?: boolean | StoryChapterDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userStoryProgress"]>

  export type UserStoryProgressSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    storyChapterId?: boolean
    cleared?: boolean
    treasures?: boolean
    zombies?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    chapter?: boolean | StoryChapterDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userStoryProgress"]>

  export type UserStoryProgressSelectScalar = {
    id?: boolean
    userId?: boolean
    storyChapterId?: boolean
    cleared?: boolean
    treasures?: boolean
    zombies?: boolean
    updatedAt?: boolean
  }

  export type UserStoryProgressOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "storyChapterId" | "cleared" | "treasures" | "zombies" | "updatedAt", ExtArgs["result"]["userStoryProgress"]>
  export type UserStoryProgressInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    chapter?: boolean | StoryChapterDefaultArgs<ExtArgs>
  }
  export type UserStoryProgressIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    chapter?: boolean | StoryChapterDefaultArgs<ExtArgs>
  }
  export type UserStoryProgressIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    chapter?: boolean | StoryChapterDefaultArgs<ExtArgs>
  }

  export type $UserStoryProgressPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserStoryProgress"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      chapter: Prisma.$StoryChapterPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      storyChapterId: string
      cleared: boolean
      treasures: $Enums.TreasureStatus
      zombies: $Enums.ZombieStatus
      updatedAt: Date
    }, ExtArgs["result"]["userStoryProgress"]>
    composites: {}
  }

  type UserStoryProgressGetPayload<S extends boolean | null | undefined | UserStoryProgressDefaultArgs> = $Result.GetResult<Prisma.$UserStoryProgressPayload, S>

  type UserStoryProgressCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserStoryProgressFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserStoryProgressCountAggregateInputType | true
    }

  export interface UserStoryProgressDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserStoryProgress'], meta: { name: 'UserStoryProgress' } }
    /**
     * Find zero or one UserStoryProgress that matches the filter.
     * @param {UserStoryProgressFindUniqueArgs} args - Arguments to find a UserStoryProgress
     * @example
     * // Get one UserStoryProgress
     * const userStoryProgress = await prisma.userStoryProgress.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserStoryProgressFindUniqueArgs>(args: SelectSubset<T, UserStoryProgressFindUniqueArgs<ExtArgs>>): Prisma__UserStoryProgressClient<$Result.GetResult<Prisma.$UserStoryProgressPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserStoryProgress that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserStoryProgressFindUniqueOrThrowArgs} args - Arguments to find a UserStoryProgress
     * @example
     * // Get one UserStoryProgress
     * const userStoryProgress = await prisma.userStoryProgress.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserStoryProgressFindUniqueOrThrowArgs>(args: SelectSubset<T, UserStoryProgressFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserStoryProgressClient<$Result.GetResult<Prisma.$UserStoryProgressPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserStoryProgress that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserStoryProgressFindFirstArgs} args - Arguments to find a UserStoryProgress
     * @example
     * // Get one UserStoryProgress
     * const userStoryProgress = await prisma.userStoryProgress.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserStoryProgressFindFirstArgs>(args?: SelectSubset<T, UserStoryProgressFindFirstArgs<ExtArgs>>): Prisma__UserStoryProgressClient<$Result.GetResult<Prisma.$UserStoryProgressPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserStoryProgress that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserStoryProgressFindFirstOrThrowArgs} args - Arguments to find a UserStoryProgress
     * @example
     * // Get one UserStoryProgress
     * const userStoryProgress = await prisma.userStoryProgress.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserStoryProgressFindFirstOrThrowArgs>(args?: SelectSubset<T, UserStoryProgressFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserStoryProgressClient<$Result.GetResult<Prisma.$UserStoryProgressPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserStoryProgresses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserStoryProgressFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserStoryProgresses
     * const userStoryProgresses = await prisma.userStoryProgress.findMany()
     * 
     * // Get first 10 UserStoryProgresses
     * const userStoryProgresses = await prisma.userStoryProgress.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userStoryProgressWithIdOnly = await prisma.userStoryProgress.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserStoryProgressFindManyArgs>(args?: SelectSubset<T, UserStoryProgressFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserStoryProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserStoryProgress.
     * @param {UserStoryProgressCreateArgs} args - Arguments to create a UserStoryProgress.
     * @example
     * // Create one UserStoryProgress
     * const UserStoryProgress = await prisma.userStoryProgress.create({
     *   data: {
     *     // ... data to create a UserStoryProgress
     *   }
     * })
     * 
     */
    create<T extends UserStoryProgressCreateArgs>(args: SelectSubset<T, UserStoryProgressCreateArgs<ExtArgs>>): Prisma__UserStoryProgressClient<$Result.GetResult<Prisma.$UserStoryProgressPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserStoryProgresses.
     * @param {UserStoryProgressCreateManyArgs} args - Arguments to create many UserStoryProgresses.
     * @example
     * // Create many UserStoryProgresses
     * const userStoryProgress = await prisma.userStoryProgress.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserStoryProgressCreateManyArgs>(args?: SelectSubset<T, UserStoryProgressCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserStoryProgresses and returns the data saved in the database.
     * @param {UserStoryProgressCreateManyAndReturnArgs} args - Arguments to create many UserStoryProgresses.
     * @example
     * // Create many UserStoryProgresses
     * const userStoryProgress = await prisma.userStoryProgress.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserStoryProgresses and only return the `id`
     * const userStoryProgressWithIdOnly = await prisma.userStoryProgress.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserStoryProgressCreateManyAndReturnArgs>(args?: SelectSubset<T, UserStoryProgressCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserStoryProgressPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserStoryProgress.
     * @param {UserStoryProgressDeleteArgs} args - Arguments to delete one UserStoryProgress.
     * @example
     * // Delete one UserStoryProgress
     * const UserStoryProgress = await prisma.userStoryProgress.delete({
     *   where: {
     *     // ... filter to delete one UserStoryProgress
     *   }
     * })
     * 
     */
    delete<T extends UserStoryProgressDeleteArgs>(args: SelectSubset<T, UserStoryProgressDeleteArgs<ExtArgs>>): Prisma__UserStoryProgressClient<$Result.GetResult<Prisma.$UserStoryProgressPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserStoryProgress.
     * @param {UserStoryProgressUpdateArgs} args - Arguments to update one UserStoryProgress.
     * @example
     * // Update one UserStoryProgress
     * const userStoryProgress = await prisma.userStoryProgress.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserStoryProgressUpdateArgs>(args: SelectSubset<T, UserStoryProgressUpdateArgs<ExtArgs>>): Prisma__UserStoryProgressClient<$Result.GetResult<Prisma.$UserStoryProgressPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserStoryProgresses.
     * @param {UserStoryProgressDeleteManyArgs} args - Arguments to filter UserStoryProgresses to delete.
     * @example
     * // Delete a few UserStoryProgresses
     * const { count } = await prisma.userStoryProgress.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserStoryProgressDeleteManyArgs>(args?: SelectSubset<T, UserStoryProgressDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserStoryProgresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserStoryProgressUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserStoryProgresses
     * const userStoryProgress = await prisma.userStoryProgress.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserStoryProgressUpdateManyArgs>(args: SelectSubset<T, UserStoryProgressUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserStoryProgresses and returns the data updated in the database.
     * @param {UserStoryProgressUpdateManyAndReturnArgs} args - Arguments to update many UserStoryProgresses.
     * @example
     * // Update many UserStoryProgresses
     * const userStoryProgress = await prisma.userStoryProgress.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserStoryProgresses and only return the `id`
     * const userStoryProgressWithIdOnly = await prisma.userStoryProgress.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserStoryProgressUpdateManyAndReturnArgs>(args: SelectSubset<T, UserStoryProgressUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserStoryProgressPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserStoryProgress.
     * @param {UserStoryProgressUpsertArgs} args - Arguments to update or create a UserStoryProgress.
     * @example
     * // Update or create a UserStoryProgress
     * const userStoryProgress = await prisma.userStoryProgress.upsert({
     *   create: {
     *     // ... data to create a UserStoryProgress
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserStoryProgress we want to update
     *   }
     * })
     */
    upsert<T extends UserStoryProgressUpsertArgs>(args: SelectSubset<T, UserStoryProgressUpsertArgs<ExtArgs>>): Prisma__UserStoryProgressClient<$Result.GetResult<Prisma.$UserStoryProgressPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserStoryProgresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserStoryProgressCountArgs} args - Arguments to filter UserStoryProgresses to count.
     * @example
     * // Count the number of UserStoryProgresses
     * const count = await prisma.userStoryProgress.count({
     *   where: {
     *     // ... the filter for the UserStoryProgresses we want to count
     *   }
     * })
    **/
    count<T extends UserStoryProgressCountArgs>(
      args?: Subset<T, UserStoryProgressCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserStoryProgressCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserStoryProgress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserStoryProgressAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserStoryProgressAggregateArgs>(args: Subset<T, UserStoryProgressAggregateArgs>): Prisma.PrismaPromise<GetUserStoryProgressAggregateType<T>>

    /**
     * Group by UserStoryProgress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserStoryProgressGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserStoryProgressGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserStoryProgressGroupByArgs['orderBy'] }
        : { orderBy?: UserStoryProgressGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserStoryProgressGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserStoryProgressGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserStoryProgress model
   */
  readonly fields: UserStoryProgressFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserStoryProgress.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserStoryProgressClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    chapter<T extends StoryChapterDefaultArgs<ExtArgs> = {}>(args?: Subset<T, StoryChapterDefaultArgs<ExtArgs>>): Prisma__StoryChapterClient<$Result.GetResult<Prisma.$StoryChapterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserStoryProgress model
   */
  interface UserStoryProgressFieldRefs {
    readonly id: FieldRef<"UserStoryProgress", 'String'>
    readonly userId: FieldRef<"UserStoryProgress", 'String'>
    readonly storyChapterId: FieldRef<"UserStoryProgress", 'String'>
    readonly cleared: FieldRef<"UserStoryProgress", 'Boolean'>
    readonly treasures: FieldRef<"UserStoryProgress", 'TreasureStatus'>
    readonly zombies: FieldRef<"UserStoryProgress", 'ZombieStatus'>
    readonly updatedAt: FieldRef<"UserStoryProgress", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserStoryProgress findUnique
   */
  export type UserStoryProgressFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStoryProgress
     */
    select?: UserStoryProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStoryProgress
     */
    omit?: UserStoryProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStoryProgressInclude<ExtArgs> | null
    /**
     * Filter, which UserStoryProgress to fetch.
     */
    where: UserStoryProgressWhereUniqueInput
  }

  /**
   * UserStoryProgress findUniqueOrThrow
   */
  export type UserStoryProgressFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStoryProgress
     */
    select?: UserStoryProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStoryProgress
     */
    omit?: UserStoryProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStoryProgressInclude<ExtArgs> | null
    /**
     * Filter, which UserStoryProgress to fetch.
     */
    where: UserStoryProgressWhereUniqueInput
  }

  /**
   * UserStoryProgress findFirst
   */
  export type UserStoryProgressFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStoryProgress
     */
    select?: UserStoryProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStoryProgress
     */
    omit?: UserStoryProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStoryProgressInclude<ExtArgs> | null
    /**
     * Filter, which UserStoryProgress to fetch.
     */
    where?: UserStoryProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserStoryProgresses to fetch.
     */
    orderBy?: UserStoryProgressOrderByWithRelationInput | UserStoryProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserStoryProgresses.
     */
    cursor?: UserStoryProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserStoryProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserStoryProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserStoryProgresses.
     */
    distinct?: UserStoryProgressScalarFieldEnum | UserStoryProgressScalarFieldEnum[]
  }

  /**
   * UserStoryProgress findFirstOrThrow
   */
  export type UserStoryProgressFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStoryProgress
     */
    select?: UserStoryProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStoryProgress
     */
    omit?: UserStoryProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStoryProgressInclude<ExtArgs> | null
    /**
     * Filter, which UserStoryProgress to fetch.
     */
    where?: UserStoryProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserStoryProgresses to fetch.
     */
    orderBy?: UserStoryProgressOrderByWithRelationInput | UserStoryProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserStoryProgresses.
     */
    cursor?: UserStoryProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserStoryProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserStoryProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserStoryProgresses.
     */
    distinct?: UserStoryProgressScalarFieldEnum | UserStoryProgressScalarFieldEnum[]
  }

  /**
   * UserStoryProgress findMany
   */
  export type UserStoryProgressFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStoryProgress
     */
    select?: UserStoryProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStoryProgress
     */
    omit?: UserStoryProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStoryProgressInclude<ExtArgs> | null
    /**
     * Filter, which UserStoryProgresses to fetch.
     */
    where?: UserStoryProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserStoryProgresses to fetch.
     */
    orderBy?: UserStoryProgressOrderByWithRelationInput | UserStoryProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserStoryProgresses.
     */
    cursor?: UserStoryProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserStoryProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserStoryProgresses.
     */
    skip?: number
    distinct?: UserStoryProgressScalarFieldEnum | UserStoryProgressScalarFieldEnum[]
  }

  /**
   * UserStoryProgress create
   */
  export type UserStoryProgressCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStoryProgress
     */
    select?: UserStoryProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStoryProgress
     */
    omit?: UserStoryProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStoryProgressInclude<ExtArgs> | null
    /**
     * The data needed to create a UserStoryProgress.
     */
    data: XOR<UserStoryProgressCreateInput, UserStoryProgressUncheckedCreateInput>
  }

  /**
   * UserStoryProgress createMany
   */
  export type UserStoryProgressCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserStoryProgresses.
     */
    data: UserStoryProgressCreateManyInput | UserStoryProgressCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserStoryProgress createManyAndReturn
   */
  export type UserStoryProgressCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStoryProgress
     */
    select?: UserStoryProgressSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserStoryProgress
     */
    omit?: UserStoryProgressOmit<ExtArgs> | null
    /**
     * The data used to create many UserStoryProgresses.
     */
    data: UserStoryProgressCreateManyInput | UserStoryProgressCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStoryProgressIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserStoryProgress update
   */
  export type UserStoryProgressUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStoryProgress
     */
    select?: UserStoryProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStoryProgress
     */
    omit?: UserStoryProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStoryProgressInclude<ExtArgs> | null
    /**
     * The data needed to update a UserStoryProgress.
     */
    data: XOR<UserStoryProgressUpdateInput, UserStoryProgressUncheckedUpdateInput>
    /**
     * Choose, which UserStoryProgress to update.
     */
    where: UserStoryProgressWhereUniqueInput
  }

  /**
   * UserStoryProgress updateMany
   */
  export type UserStoryProgressUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserStoryProgresses.
     */
    data: XOR<UserStoryProgressUpdateManyMutationInput, UserStoryProgressUncheckedUpdateManyInput>
    /**
     * Filter which UserStoryProgresses to update
     */
    where?: UserStoryProgressWhereInput
    /**
     * Limit how many UserStoryProgresses to update.
     */
    limit?: number
  }

  /**
   * UserStoryProgress updateManyAndReturn
   */
  export type UserStoryProgressUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStoryProgress
     */
    select?: UserStoryProgressSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserStoryProgress
     */
    omit?: UserStoryProgressOmit<ExtArgs> | null
    /**
     * The data used to update UserStoryProgresses.
     */
    data: XOR<UserStoryProgressUpdateManyMutationInput, UserStoryProgressUncheckedUpdateManyInput>
    /**
     * Filter which UserStoryProgresses to update
     */
    where?: UserStoryProgressWhereInput
    /**
     * Limit how many UserStoryProgresses to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStoryProgressIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserStoryProgress upsert
   */
  export type UserStoryProgressUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStoryProgress
     */
    select?: UserStoryProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStoryProgress
     */
    omit?: UserStoryProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStoryProgressInclude<ExtArgs> | null
    /**
     * The filter to search for the UserStoryProgress to update in case it exists.
     */
    where: UserStoryProgressWhereUniqueInput
    /**
     * In case the UserStoryProgress found by the `where` argument doesn't exist, create a new UserStoryProgress with this data.
     */
    create: XOR<UserStoryProgressCreateInput, UserStoryProgressUncheckedCreateInput>
    /**
     * In case the UserStoryProgress was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserStoryProgressUpdateInput, UserStoryProgressUncheckedUpdateInput>
  }

  /**
   * UserStoryProgress delete
   */
  export type UserStoryProgressDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStoryProgress
     */
    select?: UserStoryProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStoryProgress
     */
    omit?: UserStoryProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStoryProgressInclude<ExtArgs> | null
    /**
     * Filter which UserStoryProgress to delete.
     */
    where: UserStoryProgressWhereUniqueInput
  }

  /**
   * UserStoryProgress deleteMany
   */
  export type UserStoryProgressDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserStoryProgresses to delete
     */
    where?: UserStoryProgressWhereInput
    /**
     * Limit how many UserStoryProgresses to delete.
     */
    limit?: number
  }

  /**
   * UserStoryProgress without action
   */
  export type UserStoryProgressDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserStoryProgress
     */
    select?: UserStoryProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserStoryProgress
     */
    omit?: UserStoryProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserStoryProgressInclude<ExtArgs> | null
  }


  /**
   * Model LegendSaga
   */

  export type AggregateLegendSaga = {
    _count: LegendSagaCountAggregateOutputType | null
    _avg: LegendSagaAvgAggregateOutputType | null
    _sum: LegendSagaSumAggregateOutputType | null
    _min: LegendSagaMinAggregateOutputType | null
    _max: LegendSagaMaxAggregateOutputType | null
  }

  export type LegendSagaAvgAggregateOutputType = {
    sortOrder: number | null
  }

  export type LegendSagaSumAggregateOutputType = {
    sortOrder: number | null
  }

  export type LegendSagaMinAggregateOutputType = {
    id: string | null
    displayName: string | null
    sortOrder: number | null
  }

  export type LegendSagaMaxAggregateOutputType = {
    id: string | null
    displayName: string | null
    sortOrder: number | null
  }

  export type LegendSagaCountAggregateOutputType = {
    id: number
    displayName: number
    sortOrder: number
    _all: number
  }


  export type LegendSagaAvgAggregateInputType = {
    sortOrder?: true
  }

  export type LegendSagaSumAggregateInputType = {
    sortOrder?: true
  }

  export type LegendSagaMinAggregateInputType = {
    id?: true
    displayName?: true
    sortOrder?: true
  }

  export type LegendSagaMaxAggregateInputType = {
    id?: true
    displayName?: true
    sortOrder?: true
  }

  export type LegendSagaCountAggregateInputType = {
    id?: true
    displayName?: true
    sortOrder?: true
    _all?: true
  }

  export type LegendSagaAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LegendSaga to aggregate.
     */
    where?: LegendSagaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LegendSagas to fetch.
     */
    orderBy?: LegendSagaOrderByWithRelationInput | LegendSagaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LegendSagaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LegendSagas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LegendSagas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LegendSagas
    **/
    _count?: true | LegendSagaCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LegendSagaAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LegendSagaSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LegendSagaMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LegendSagaMaxAggregateInputType
  }

  export type GetLegendSagaAggregateType<T extends LegendSagaAggregateArgs> = {
        [P in keyof T & keyof AggregateLegendSaga]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLegendSaga[P]>
      : GetScalarType<T[P], AggregateLegendSaga[P]>
  }




  export type LegendSagaGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LegendSagaWhereInput
    orderBy?: LegendSagaOrderByWithAggregationInput | LegendSagaOrderByWithAggregationInput[]
    by: LegendSagaScalarFieldEnum[] | LegendSagaScalarFieldEnum
    having?: LegendSagaScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LegendSagaCountAggregateInputType | true
    _avg?: LegendSagaAvgAggregateInputType
    _sum?: LegendSagaSumAggregateInputType
    _min?: LegendSagaMinAggregateInputType
    _max?: LegendSagaMaxAggregateInputType
  }

  export type LegendSagaGroupByOutputType = {
    id: string
    displayName: string
    sortOrder: number
    _count: LegendSagaCountAggregateOutputType | null
    _avg: LegendSagaAvgAggregateOutputType | null
    _sum: LegendSagaSumAggregateOutputType | null
    _min: LegendSagaMinAggregateOutputType | null
    _max: LegendSagaMaxAggregateOutputType | null
  }

  type GetLegendSagaGroupByPayload<T extends LegendSagaGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LegendSagaGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LegendSagaGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LegendSagaGroupByOutputType[P]>
            : GetScalarType<T[P], LegendSagaGroupByOutputType[P]>
        }
      >
    >


  export type LegendSagaSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    displayName?: boolean
    sortOrder?: boolean
    subchapters?: boolean | LegendSaga$subchaptersArgs<ExtArgs>
    _count?: boolean | LegendSagaCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["legendSaga"]>

  export type LegendSagaSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    displayName?: boolean
    sortOrder?: boolean
  }, ExtArgs["result"]["legendSaga"]>

  export type LegendSagaSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    displayName?: boolean
    sortOrder?: boolean
  }, ExtArgs["result"]["legendSaga"]>

  export type LegendSagaSelectScalar = {
    id?: boolean
    displayName?: boolean
    sortOrder?: boolean
  }

  export type LegendSagaOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "displayName" | "sortOrder", ExtArgs["result"]["legendSaga"]>
  export type LegendSagaInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    subchapters?: boolean | LegendSaga$subchaptersArgs<ExtArgs>
    _count?: boolean | LegendSagaCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type LegendSagaIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type LegendSagaIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $LegendSagaPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LegendSaga"
    objects: {
      subchapters: Prisma.$LegendSubchapterPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      displayName: string
      sortOrder: number
    }, ExtArgs["result"]["legendSaga"]>
    composites: {}
  }

  type LegendSagaGetPayload<S extends boolean | null | undefined | LegendSagaDefaultArgs> = $Result.GetResult<Prisma.$LegendSagaPayload, S>

  type LegendSagaCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LegendSagaFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LegendSagaCountAggregateInputType | true
    }

  export interface LegendSagaDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LegendSaga'], meta: { name: 'LegendSaga' } }
    /**
     * Find zero or one LegendSaga that matches the filter.
     * @param {LegendSagaFindUniqueArgs} args - Arguments to find a LegendSaga
     * @example
     * // Get one LegendSaga
     * const legendSaga = await prisma.legendSaga.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LegendSagaFindUniqueArgs>(args: SelectSubset<T, LegendSagaFindUniqueArgs<ExtArgs>>): Prisma__LegendSagaClient<$Result.GetResult<Prisma.$LegendSagaPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LegendSaga that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LegendSagaFindUniqueOrThrowArgs} args - Arguments to find a LegendSaga
     * @example
     * // Get one LegendSaga
     * const legendSaga = await prisma.legendSaga.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LegendSagaFindUniqueOrThrowArgs>(args: SelectSubset<T, LegendSagaFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LegendSagaClient<$Result.GetResult<Prisma.$LegendSagaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LegendSaga that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LegendSagaFindFirstArgs} args - Arguments to find a LegendSaga
     * @example
     * // Get one LegendSaga
     * const legendSaga = await prisma.legendSaga.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LegendSagaFindFirstArgs>(args?: SelectSubset<T, LegendSagaFindFirstArgs<ExtArgs>>): Prisma__LegendSagaClient<$Result.GetResult<Prisma.$LegendSagaPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LegendSaga that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LegendSagaFindFirstOrThrowArgs} args - Arguments to find a LegendSaga
     * @example
     * // Get one LegendSaga
     * const legendSaga = await prisma.legendSaga.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LegendSagaFindFirstOrThrowArgs>(args?: SelectSubset<T, LegendSagaFindFirstOrThrowArgs<ExtArgs>>): Prisma__LegendSagaClient<$Result.GetResult<Prisma.$LegendSagaPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LegendSagas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LegendSagaFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LegendSagas
     * const legendSagas = await prisma.legendSaga.findMany()
     * 
     * // Get first 10 LegendSagas
     * const legendSagas = await prisma.legendSaga.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const legendSagaWithIdOnly = await prisma.legendSaga.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LegendSagaFindManyArgs>(args?: SelectSubset<T, LegendSagaFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LegendSagaPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LegendSaga.
     * @param {LegendSagaCreateArgs} args - Arguments to create a LegendSaga.
     * @example
     * // Create one LegendSaga
     * const LegendSaga = await prisma.legendSaga.create({
     *   data: {
     *     // ... data to create a LegendSaga
     *   }
     * })
     * 
     */
    create<T extends LegendSagaCreateArgs>(args: SelectSubset<T, LegendSagaCreateArgs<ExtArgs>>): Prisma__LegendSagaClient<$Result.GetResult<Prisma.$LegendSagaPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LegendSagas.
     * @param {LegendSagaCreateManyArgs} args - Arguments to create many LegendSagas.
     * @example
     * // Create many LegendSagas
     * const legendSaga = await prisma.legendSaga.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LegendSagaCreateManyArgs>(args?: SelectSubset<T, LegendSagaCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LegendSagas and returns the data saved in the database.
     * @param {LegendSagaCreateManyAndReturnArgs} args - Arguments to create many LegendSagas.
     * @example
     * // Create many LegendSagas
     * const legendSaga = await prisma.legendSaga.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LegendSagas and only return the `id`
     * const legendSagaWithIdOnly = await prisma.legendSaga.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LegendSagaCreateManyAndReturnArgs>(args?: SelectSubset<T, LegendSagaCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LegendSagaPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LegendSaga.
     * @param {LegendSagaDeleteArgs} args - Arguments to delete one LegendSaga.
     * @example
     * // Delete one LegendSaga
     * const LegendSaga = await prisma.legendSaga.delete({
     *   where: {
     *     // ... filter to delete one LegendSaga
     *   }
     * })
     * 
     */
    delete<T extends LegendSagaDeleteArgs>(args: SelectSubset<T, LegendSagaDeleteArgs<ExtArgs>>): Prisma__LegendSagaClient<$Result.GetResult<Prisma.$LegendSagaPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LegendSaga.
     * @param {LegendSagaUpdateArgs} args - Arguments to update one LegendSaga.
     * @example
     * // Update one LegendSaga
     * const legendSaga = await prisma.legendSaga.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LegendSagaUpdateArgs>(args: SelectSubset<T, LegendSagaUpdateArgs<ExtArgs>>): Prisma__LegendSagaClient<$Result.GetResult<Prisma.$LegendSagaPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LegendSagas.
     * @param {LegendSagaDeleteManyArgs} args - Arguments to filter LegendSagas to delete.
     * @example
     * // Delete a few LegendSagas
     * const { count } = await prisma.legendSaga.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LegendSagaDeleteManyArgs>(args?: SelectSubset<T, LegendSagaDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LegendSagas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LegendSagaUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LegendSagas
     * const legendSaga = await prisma.legendSaga.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LegendSagaUpdateManyArgs>(args: SelectSubset<T, LegendSagaUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LegendSagas and returns the data updated in the database.
     * @param {LegendSagaUpdateManyAndReturnArgs} args - Arguments to update many LegendSagas.
     * @example
     * // Update many LegendSagas
     * const legendSaga = await prisma.legendSaga.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LegendSagas and only return the `id`
     * const legendSagaWithIdOnly = await prisma.legendSaga.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LegendSagaUpdateManyAndReturnArgs>(args: SelectSubset<T, LegendSagaUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LegendSagaPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LegendSaga.
     * @param {LegendSagaUpsertArgs} args - Arguments to update or create a LegendSaga.
     * @example
     * // Update or create a LegendSaga
     * const legendSaga = await prisma.legendSaga.upsert({
     *   create: {
     *     // ... data to create a LegendSaga
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LegendSaga we want to update
     *   }
     * })
     */
    upsert<T extends LegendSagaUpsertArgs>(args: SelectSubset<T, LegendSagaUpsertArgs<ExtArgs>>): Prisma__LegendSagaClient<$Result.GetResult<Prisma.$LegendSagaPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LegendSagas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LegendSagaCountArgs} args - Arguments to filter LegendSagas to count.
     * @example
     * // Count the number of LegendSagas
     * const count = await prisma.legendSaga.count({
     *   where: {
     *     // ... the filter for the LegendSagas we want to count
     *   }
     * })
    **/
    count<T extends LegendSagaCountArgs>(
      args?: Subset<T, LegendSagaCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LegendSagaCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LegendSaga.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LegendSagaAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LegendSagaAggregateArgs>(args: Subset<T, LegendSagaAggregateArgs>): Prisma.PrismaPromise<GetLegendSagaAggregateType<T>>

    /**
     * Group by LegendSaga.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LegendSagaGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LegendSagaGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LegendSagaGroupByArgs['orderBy'] }
        : { orderBy?: LegendSagaGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LegendSagaGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLegendSagaGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LegendSaga model
   */
  readonly fields: LegendSagaFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LegendSaga.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LegendSagaClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    subchapters<T extends LegendSaga$subchaptersArgs<ExtArgs> = {}>(args?: Subset<T, LegendSaga$subchaptersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LegendSubchapterPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LegendSaga model
   */
  interface LegendSagaFieldRefs {
    readonly id: FieldRef<"LegendSaga", 'String'>
    readonly displayName: FieldRef<"LegendSaga", 'String'>
    readonly sortOrder: FieldRef<"LegendSaga", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * LegendSaga findUnique
   */
  export type LegendSagaFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LegendSaga
     */
    select?: LegendSagaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LegendSaga
     */
    omit?: LegendSagaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LegendSagaInclude<ExtArgs> | null
    /**
     * Filter, which LegendSaga to fetch.
     */
    where: LegendSagaWhereUniqueInput
  }

  /**
   * LegendSaga findUniqueOrThrow
   */
  export type LegendSagaFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LegendSaga
     */
    select?: LegendSagaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LegendSaga
     */
    omit?: LegendSagaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LegendSagaInclude<ExtArgs> | null
    /**
     * Filter, which LegendSaga to fetch.
     */
    where: LegendSagaWhereUniqueInput
  }

  /**
   * LegendSaga findFirst
   */
  export type LegendSagaFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LegendSaga
     */
    select?: LegendSagaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LegendSaga
     */
    omit?: LegendSagaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LegendSagaInclude<ExtArgs> | null
    /**
     * Filter, which LegendSaga to fetch.
     */
    where?: LegendSagaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LegendSagas to fetch.
     */
    orderBy?: LegendSagaOrderByWithRelationInput | LegendSagaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LegendSagas.
     */
    cursor?: LegendSagaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LegendSagas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LegendSagas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LegendSagas.
     */
    distinct?: LegendSagaScalarFieldEnum | LegendSagaScalarFieldEnum[]
  }

  /**
   * LegendSaga findFirstOrThrow
   */
  export type LegendSagaFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LegendSaga
     */
    select?: LegendSagaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LegendSaga
     */
    omit?: LegendSagaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LegendSagaInclude<ExtArgs> | null
    /**
     * Filter, which LegendSaga to fetch.
     */
    where?: LegendSagaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LegendSagas to fetch.
     */
    orderBy?: LegendSagaOrderByWithRelationInput | LegendSagaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LegendSagas.
     */
    cursor?: LegendSagaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LegendSagas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LegendSagas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LegendSagas.
     */
    distinct?: LegendSagaScalarFieldEnum | LegendSagaScalarFieldEnum[]
  }

  /**
   * LegendSaga findMany
   */
  export type LegendSagaFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LegendSaga
     */
    select?: LegendSagaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LegendSaga
     */
    omit?: LegendSagaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LegendSagaInclude<ExtArgs> | null
    /**
     * Filter, which LegendSagas to fetch.
     */
    where?: LegendSagaWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LegendSagas to fetch.
     */
    orderBy?: LegendSagaOrderByWithRelationInput | LegendSagaOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LegendSagas.
     */
    cursor?: LegendSagaWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LegendSagas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LegendSagas.
     */
    skip?: number
    distinct?: LegendSagaScalarFieldEnum | LegendSagaScalarFieldEnum[]
  }

  /**
   * LegendSaga create
   */
  export type LegendSagaCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LegendSaga
     */
    select?: LegendSagaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LegendSaga
     */
    omit?: LegendSagaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LegendSagaInclude<ExtArgs> | null
    /**
     * The data needed to create a LegendSaga.
     */
    data: XOR<LegendSagaCreateInput, LegendSagaUncheckedCreateInput>
  }

  /**
   * LegendSaga createMany
   */
  export type LegendSagaCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LegendSagas.
     */
    data: LegendSagaCreateManyInput | LegendSagaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LegendSaga createManyAndReturn
   */
  export type LegendSagaCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LegendSaga
     */
    select?: LegendSagaSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LegendSaga
     */
    omit?: LegendSagaOmit<ExtArgs> | null
    /**
     * The data used to create many LegendSagas.
     */
    data: LegendSagaCreateManyInput | LegendSagaCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LegendSaga update
   */
  export type LegendSagaUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LegendSaga
     */
    select?: LegendSagaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LegendSaga
     */
    omit?: LegendSagaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LegendSagaInclude<ExtArgs> | null
    /**
     * The data needed to update a LegendSaga.
     */
    data: XOR<LegendSagaUpdateInput, LegendSagaUncheckedUpdateInput>
    /**
     * Choose, which LegendSaga to update.
     */
    where: LegendSagaWhereUniqueInput
  }

  /**
   * LegendSaga updateMany
   */
  export type LegendSagaUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LegendSagas.
     */
    data: XOR<LegendSagaUpdateManyMutationInput, LegendSagaUncheckedUpdateManyInput>
    /**
     * Filter which LegendSagas to update
     */
    where?: LegendSagaWhereInput
    /**
     * Limit how many LegendSagas to update.
     */
    limit?: number
  }

  /**
   * LegendSaga updateManyAndReturn
   */
  export type LegendSagaUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LegendSaga
     */
    select?: LegendSagaSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LegendSaga
     */
    omit?: LegendSagaOmit<ExtArgs> | null
    /**
     * The data used to update LegendSagas.
     */
    data: XOR<LegendSagaUpdateManyMutationInput, LegendSagaUncheckedUpdateManyInput>
    /**
     * Filter which LegendSagas to update
     */
    where?: LegendSagaWhereInput
    /**
     * Limit how many LegendSagas to update.
     */
    limit?: number
  }

  /**
   * LegendSaga upsert
   */
  export type LegendSagaUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LegendSaga
     */
    select?: LegendSagaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LegendSaga
     */
    omit?: LegendSagaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LegendSagaInclude<ExtArgs> | null
    /**
     * The filter to search for the LegendSaga to update in case it exists.
     */
    where: LegendSagaWhereUniqueInput
    /**
     * In case the LegendSaga found by the `where` argument doesn't exist, create a new LegendSaga with this data.
     */
    create: XOR<LegendSagaCreateInput, LegendSagaUncheckedCreateInput>
    /**
     * In case the LegendSaga was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LegendSagaUpdateInput, LegendSagaUncheckedUpdateInput>
  }

  /**
   * LegendSaga delete
   */
  export type LegendSagaDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LegendSaga
     */
    select?: LegendSagaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LegendSaga
     */
    omit?: LegendSagaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LegendSagaInclude<ExtArgs> | null
    /**
     * Filter which LegendSaga to delete.
     */
    where: LegendSagaWhereUniqueInput
  }

  /**
   * LegendSaga deleteMany
   */
  export type LegendSagaDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LegendSagas to delete
     */
    where?: LegendSagaWhereInput
    /**
     * Limit how many LegendSagas to delete.
     */
    limit?: number
  }

  /**
   * LegendSaga.subchapters
   */
  export type LegendSaga$subchaptersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LegendSubchapter
     */
    select?: LegendSubchapterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LegendSubchapter
     */
    omit?: LegendSubchapterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LegendSubchapterInclude<ExtArgs> | null
    where?: LegendSubchapterWhereInput
    orderBy?: LegendSubchapterOrderByWithRelationInput | LegendSubchapterOrderByWithRelationInput[]
    cursor?: LegendSubchapterWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LegendSubchapterScalarFieldEnum | LegendSubchapterScalarFieldEnum[]
  }

  /**
   * LegendSaga without action
   */
  export type LegendSagaDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LegendSaga
     */
    select?: LegendSagaSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LegendSaga
     */
    omit?: LegendSagaOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LegendSagaInclude<ExtArgs> | null
  }


  /**
   * Model LegendSubchapter
   */

  export type AggregateLegendSubchapter = {
    _count: LegendSubchapterCountAggregateOutputType | null
    _avg: LegendSubchapterAvgAggregateOutputType | null
    _sum: LegendSubchapterSumAggregateOutputType | null
    _min: LegendSubchapterMinAggregateOutputType | null
    _max: LegendSubchapterMaxAggregateOutputType | null
  }

  export type LegendSubchapterAvgAggregateOutputType = {
    sortOrder: number | null
  }

  export type LegendSubchapterSumAggregateOutputType = {
    sortOrder: number | null
  }

  export type LegendSubchapterMinAggregateOutputType = {
    id: string | null
    sagaId: string | null
    displayName: string | null
    sortOrder: number | null
  }

  export type LegendSubchapterMaxAggregateOutputType = {
    id: string | null
    sagaId: string | null
    displayName: string | null
    sortOrder: number | null
  }

  export type LegendSubchapterCountAggregateOutputType = {
    id: number
    sagaId: number
    displayName: number
    sortOrder: number
    _all: number
  }


  export type LegendSubchapterAvgAggregateInputType = {
    sortOrder?: true
  }

  export type LegendSubchapterSumAggregateInputType = {
    sortOrder?: true
  }

  export type LegendSubchapterMinAggregateInputType = {
    id?: true
    sagaId?: true
    displayName?: true
    sortOrder?: true
  }

  export type LegendSubchapterMaxAggregateInputType = {
    id?: true
    sagaId?: true
    displayName?: true
    sortOrder?: true
  }

  export type LegendSubchapterCountAggregateInputType = {
    id?: true
    sagaId?: true
    displayName?: true
    sortOrder?: true
    _all?: true
  }

  export type LegendSubchapterAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LegendSubchapter to aggregate.
     */
    where?: LegendSubchapterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LegendSubchapters to fetch.
     */
    orderBy?: LegendSubchapterOrderByWithRelationInput | LegendSubchapterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LegendSubchapterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LegendSubchapters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LegendSubchapters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LegendSubchapters
    **/
    _count?: true | LegendSubchapterCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LegendSubchapterAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LegendSubchapterSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LegendSubchapterMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LegendSubchapterMaxAggregateInputType
  }

  export type GetLegendSubchapterAggregateType<T extends LegendSubchapterAggregateArgs> = {
        [P in keyof T & keyof AggregateLegendSubchapter]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLegendSubchapter[P]>
      : GetScalarType<T[P], AggregateLegendSubchapter[P]>
  }




  export type LegendSubchapterGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LegendSubchapterWhereInput
    orderBy?: LegendSubchapterOrderByWithAggregationInput | LegendSubchapterOrderByWithAggregationInput[]
    by: LegendSubchapterScalarFieldEnum[] | LegendSubchapterScalarFieldEnum
    having?: LegendSubchapterScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LegendSubchapterCountAggregateInputType | true
    _avg?: LegendSubchapterAvgAggregateInputType
    _sum?: LegendSubchapterSumAggregateInputType
    _min?: LegendSubchapterMinAggregateInputType
    _max?: LegendSubchapterMaxAggregateInputType
  }

  export type LegendSubchapterGroupByOutputType = {
    id: string
    sagaId: string
    displayName: string
    sortOrder: number
    _count: LegendSubchapterCountAggregateOutputType | null
    _avg: LegendSubchapterAvgAggregateOutputType | null
    _sum: LegendSubchapterSumAggregateOutputType | null
    _min: LegendSubchapterMinAggregateOutputType | null
    _max: LegendSubchapterMaxAggregateOutputType | null
  }

  type GetLegendSubchapterGroupByPayload<T extends LegendSubchapterGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LegendSubchapterGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LegendSubchapterGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LegendSubchapterGroupByOutputType[P]>
            : GetScalarType<T[P], LegendSubchapterGroupByOutputType[P]>
        }
      >
    >


  export type LegendSubchapterSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sagaId?: boolean
    displayName?: boolean
    sortOrder?: boolean
    saga?: boolean | LegendSagaDefaultArgs<ExtArgs>
    progress?: boolean | LegendSubchapter$progressArgs<ExtArgs>
    _count?: boolean | LegendSubchapterCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["legendSubchapter"]>

  export type LegendSubchapterSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sagaId?: boolean
    displayName?: boolean
    sortOrder?: boolean
    saga?: boolean | LegendSagaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["legendSubchapter"]>

  export type LegendSubchapterSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sagaId?: boolean
    displayName?: boolean
    sortOrder?: boolean
    saga?: boolean | LegendSagaDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["legendSubchapter"]>

  export type LegendSubchapterSelectScalar = {
    id?: boolean
    sagaId?: boolean
    displayName?: boolean
    sortOrder?: boolean
  }

  export type LegendSubchapterOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "sagaId" | "displayName" | "sortOrder", ExtArgs["result"]["legendSubchapter"]>
  export type LegendSubchapterInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    saga?: boolean | LegendSagaDefaultArgs<ExtArgs>
    progress?: boolean | LegendSubchapter$progressArgs<ExtArgs>
    _count?: boolean | LegendSubchapterCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type LegendSubchapterIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    saga?: boolean | LegendSagaDefaultArgs<ExtArgs>
  }
  export type LegendSubchapterIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    saga?: boolean | LegendSagaDefaultArgs<ExtArgs>
  }

  export type $LegendSubchapterPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LegendSubchapter"
    objects: {
      saga: Prisma.$LegendSagaPayload<ExtArgs>
      progress: Prisma.$UserLegendProgressPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sagaId: string
      displayName: string
      sortOrder: number
    }, ExtArgs["result"]["legendSubchapter"]>
    composites: {}
  }

  type LegendSubchapterGetPayload<S extends boolean | null | undefined | LegendSubchapterDefaultArgs> = $Result.GetResult<Prisma.$LegendSubchapterPayload, S>

  type LegendSubchapterCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LegendSubchapterFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LegendSubchapterCountAggregateInputType | true
    }

  export interface LegendSubchapterDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LegendSubchapter'], meta: { name: 'LegendSubchapter' } }
    /**
     * Find zero or one LegendSubchapter that matches the filter.
     * @param {LegendSubchapterFindUniqueArgs} args - Arguments to find a LegendSubchapter
     * @example
     * // Get one LegendSubchapter
     * const legendSubchapter = await prisma.legendSubchapter.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LegendSubchapterFindUniqueArgs>(args: SelectSubset<T, LegendSubchapterFindUniqueArgs<ExtArgs>>): Prisma__LegendSubchapterClient<$Result.GetResult<Prisma.$LegendSubchapterPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LegendSubchapter that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LegendSubchapterFindUniqueOrThrowArgs} args - Arguments to find a LegendSubchapter
     * @example
     * // Get one LegendSubchapter
     * const legendSubchapter = await prisma.legendSubchapter.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LegendSubchapterFindUniqueOrThrowArgs>(args: SelectSubset<T, LegendSubchapterFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LegendSubchapterClient<$Result.GetResult<Prisma.$LegendSubchapterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LegendSubchapter that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LegendSubchapterFindFirstArgs} args - Arguments to find a LegendSubchapter
     * @example
     * // Get one LegendSubchapter
     * const legendSubchapter = await prisma.legendSubchapter.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LegendSubchapterFindFirstArgs>(args?: SelectSubset<T, LegendSubchapterFindFirstArgs<ExtArgs>>): Prisma__LegendSubchapterClient<$Result.GetResult<Prisma.$LegendSubchapterPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LegendSubchapter that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LegendSubchapterFindFirstOrThrowArgs} args - Arguments to find a LegendSubchapter
     * @example
     * // Get one LegendSubchapter
     * const legendSubchapter = await prisma.legendSubchapter.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LegendSubchapterFindFirstOrThrowArgs>(args?: SelectSubset<T, LegendSubchapterFindFirstOrThrowArgs<ExtArgs>>): Prisma__LegendSubchapterClient<$Result.GetResult<Prisma.$LegendSubchapterPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LegendSubchapters that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LegendSubchapterFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LegendSubchapters
     * const legendSubchapters = await prisma.legendSubchapter.findMany()
     * 
     * // Get first 10 LegendSubchapters
     * const legendSubchapters = await prisma.legendSubchapter.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const legendSubchapterWithIdOnly = await prisma.legendSubchapter.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LegendSubchapterFindManyArgs>(args?: SelectSubset<T, LegendSubchapterFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LegendSubchapterPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LegendSubchapter.
     * @param {LegendSubchapterCreateArgs} args - Arguments to create a LegendSubchapter.
     * @example
     * // Create one LegendSubchapter
     * const LegendSubchapter = await prisma.legendSubchapter.create({
     *   data: {
     *     // ... data to create a LegendSubchapter
     *   }
     * })
     * 
     */
    create<T extends LegendSubchapterCreateArgs>(args: SelectSubset<T, LegendSubchapterCreateArgs<ExtArgs>>): Prisma__LegendSubchapterClient<$Result.GetResult<Prisma.$LegendSubchapterPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LegendSubchapters.
     * @param {LegendSubchapterCreateManyArgs} args - Arguments to create many LegendSubchapters.
     * @example
     * // Create many LegendSubchapters
     * const legendSubchapter = await prisma.legendSubchapter.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LegendSubchapterCreateManyArgs>(args?: SelectSubset<T, LegendSubchapterCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LegendSubchapters and returns the data saved in the database.
     * @param {LegendSubchapterCreateManyAndReturnArgs} args - Arguments to create many LegendSubchapters.
     * @example
     * // Create many LegendSubchapters
     * const legendSubchapter = await prisma.legendSubchapter.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LegendSubchapters and only return the `id`
     * const legendSubchapterWithIdOnly = await prisma.legendSubchapter.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LegendSubchapterCreateManyAndReturnArgs>(args?: SelectSubset<T, LegendSubchapterCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LegendSubchapterPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LegendSubchapter.
     * @param {LegendSubchapterDeleteArgs} args - Arguments to delete one LegendSubchapter.
     * @example
     * // Delete one LegendSubchapter
     * const LegendSubchapter = await prisma.legendSubchapter.delete({
     *   where: {
     *     // ... filter to delete one LegendSubchapter
     *   }
     * })
     * 
     */
    delete<T extends LegendSubchapterDeleteArgs>(args: SelectSubset<T, LegendSubchapterDeleteArgs<ExtArgs>>): Prisma__LegendSubchapterClient<$Result.GetResult<Prisma.$LegendSubchapterPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LegendSubchapter.
     * @param {LegendSubchapterUpdateArgs} args - Arguments to update one LegendSubchapter.
     * @example
     * // Update one LegendSubchapter
     * const legendSubchapter = await prisma.legendSubchapter.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LegendSubchapterUpdateArgs>(args: SelectSubset<T, LegendSubchapterUpdateArgs<ExtArgs>>): Prisma__LegendSubchapterClient<$Result.GetResult<Prisma.$LegendSubchapterPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LegendSubchapters.
     * @param {LegendSubchapterDeleteManyArgs} args - Arguments to filter LegendSubchapters to delete.
     * @example
     * // Delete a few LegendSubchapters
     * const { count } = await prisma.legendSubchapter.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LegendSubchapterDeleteManyArgs>(args?: SelectSubset<T, LegendSubchapterDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LegendSubchapters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LegendSubchapterUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LegendSubchapters
     * const legendSubchapter = await prisma.legendSubchapter.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LegendSubchapterUpdateManyArgs>(args: SelectSubset<T, LegendSubchapterUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LegendSubchapters and returns the data updated in the database.
     * @param {LegendSubchapterUpdateManyAndReturnArgs} args - Arguments to update many LegendSubchapters.
     * @example
     * // Update many LegendSubchapters
     * const legendSubchapter = await prisma.legendSubchapter.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LegendSubchapters and only return the `id`
     * const legendSubchapterWithIdOnly = await prisma.legendSubchapter.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LegendSubchapterUpdateManyAndReturnArgs>(args: SelectSubset<T, LegendSubchapterUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LegendSubchapterPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LegendSubchapter.
     * @param {LegendSubchapterUpsertArgs} args - Arguments to update or create a LegendSubchapter.
     * @example
     * // Update or create a LegendSubchapter
     * const legendSubchapter = await prisma.legendSubchapter.upsert({
     *   create: {
     *     // ... data to create a LegendSubchapter
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LegendSubchapter we want to update
     *   }
     * })
     */
    upsert<T extends LegendSubchapterUpsertArgs>(args: SelectSubset<T, LegendSubchapterUpsertArgs<ExtArgs>>): Prisma__LegendSubchapterClient<$Result.GetResult<Prisma.$LegendSubchapterPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LegendSubchapters.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LegendSubchapterCountArgs} args - Arguments to filter LegendSubchapters to count.
     * @example
     * // Count the number of LegendSubchapters
     * const count = await prisma.legendSubchapter.count({
     *   where: {
     *     // ... the filter for the LegendSubchapters we want to count
     *   }
     * })
    **/
    count<T extends LegendSubchapterCountArgs>(
      args?: Subset<T, LegendSubchapterCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LegendSubchapterCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LegendSubchapter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LegendSubchapterAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LegendSubchapterAggregateArgs>(args: Subset<T, LegendSubchapterAggregateArgs>): Prisma.PrismaPromise<GetLegendSubchapterAggregateType<T>>

    /**
     * Group by LegendSubchapter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LegendSubchapterGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LegendSubchapterGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LegendSubchapterGroupByArgs['orderBy'] }
        : { orderBy?: LegendSubchapterGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LegendSubchapterGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLegendSubchapterGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LegendSubchapter model
   */
  readonly fields: LegendSubchapterFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LegendSubchapter.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LegendSubchapterClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    saga<T extends LegendSagaDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LegendSagaDefaultArgs<ExtArgs>>): Prisma__LegendSagaClient<$Result.GetResult<Prisma.$LegendSagaPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    progress<T extends LegendSubchapter$progressArgs<ExtArgs> = {}>(args?: Subset<T, LegendSubchapter$progressArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserLegendProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LegendSubchapter model
   */
  interface LegendSubchapterFieldRefs {
    readonly id: FieldRef<"LegendSubchapter", 'String'>
    readonly sagaId: FieldRef<"LegendSubchapter", 'String'>
    readonly displayName: FieldRef<"LegendSubchapter", 'String'>
    readonly sortOrder: FieldRef<"LegendSubchapter", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * LegendSubchapter findUnique
   */
  export type LegendSubchapterFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LegendSubchapter
     */
    select?: LegendSubchapterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LegendSubchapter
     */
    omit?: LegendSubchapterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LegendSubchapterInclude<ExtArgs> | null
    /**
     * Filter, which LegendSubchapter to fetch.
     */
    where: LegendSubchapterWhereUniqueInput
  }

  /**
   * LegendSubchapter findUniqueOrThrow
   */
  export type LegendSubchapterFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LegendSubchapter
     */
    select?: LegendSubchapterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LegendSubchapter
     */
    omit?: LegendSubchapterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LegendSubchapterInclude<ExtArgs> | null
    /**
     * Filter, which LegendSubchapter to fetch.
     */
    where: LegendSubchapterWhereUniqueInput
  }

  /**
   * LegendSubchapter findFirst
   */
  export type LegendSubchapterFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LegendSubchapter
     */
    select?: LegendSubchapterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LegendSubchapter
     */
    omit?: LegendSubchapterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LegendSubchapterInclude<ExtArgs> | null
    /**
     * Filter, which LegendSubchapter to fetch.
     */
    where?: LegendSubchapterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LegendSubchapters to fetch.
     */
    orderBy?: LegendSubchapterOrderByWithRelationInput | LegendSubchapterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LegendSubchapters.
     */
    cursor?: LegendSubchapterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LegendSubchapters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LegendSubchapters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LegendSubchapters.
     */
    distinct?: LegendSubchapterScalarFieldEnum | LegendSubchapterScalarFieldEnum[]
  }

  /**
   * LegendSubchapter findFirstOrThrow
   */
  export type LegendSubchapterFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LegendSubchapter
     */
    select?: LegendSubchapterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LegendSubchapter
     */
    omit?: LegendSubchapterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LegendSubchapterInclude<ExtArgs> | null
    /**
     * Filter, which LegendSubchapter to fetch.
     */
    where?: LegendSubchapterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LegendSubchapters to fetch.
     */
    orderBy?: LegendSubchapterOrderByWithRelationInput | LegendSubchapterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LegendSubchapters.
     */
    cursor?: LegendSubchapterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LegendSubchapters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LegendSubchapters.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LegendSubchapters.
     */
    distinct?: LegendSubchapterScalarFieldEnum | LegendSubchapterScalarFieldEnum[]
  }

  /**
   * LegendSubchapter findMany
   */
  export type LegendSubchapterFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LegendSubchapter
     */
    select?: LegendSubchapterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LegendSubchapter
     */
    omit?: LegendSubchapterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LegendSubchapterInclude<ExtArgs> | null
    /**
     * Filter, which LegendSubchapters to fetch.
     */
    where?: LegendSubchapterWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LegendSubchapters to fetch.
     */
    orderBy?: LegendSubchapterOrderByWithRelationInput | LegendSubchapterOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LegendSubchapters.
     */
    cursor?: LegendSubchapterWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LegendSubchapters from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LegendSubchapters.
     */
    skip?: number
    distinct?: LegendSubchapterScalarFieldEnum | LegendSubchapterScalarFieldEnum[]
  }

  /**
   * LegendSubchapter create
   */
  export type LegendSubchapterCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LegendSubchapter
     */
    select?: LegendSubchapterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LegendSubchapter
     */
    omit?: LegendSubchapterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LegendSubchapterInclude<ExtArgs> | null
    /**
     * The data needed to create a LegendSubchapter.
     */
    data: XOR<LegendSubchapterCreateInput, LegendSubchapterUncheckedCreateInput>
  }

  /**
   * LegendSubchapter createMany
   */
  export type LegendSubchapterCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LegendSubchapters.
     */
    data: LegendSubchapterCreateManyInput | LegendSubchapterCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LegendSubchapter createManyAndReturn
   */
  export type LegendSubchapterCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LegendSubchapter
     */
    select?: LegendSubchapterSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LegendSubchapter
     */
    omit?: LegendSubchapterOmit<ExtArgs> | null
    /**
     * The data used to create many LegendSubchapters.
     */
    data: LegendSubchapterCreateManyInput | LegendSubchapterCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LegendSubchapterIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * LegendSubchapter update
   */
  export type LegendSubchapterUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LegendSubchapter
     */
    select?: LegendSubchapterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LegendSubchapter
     */
    omit?: LegendSubchapterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LegendSubchapterInclude<ExtArgs> | null
    /**
     * The data needed to update a LegendSubchapter.
     */
    data: XOR<LegendSubchapterUpdateInput, LegendSubchapterUncheckedUpdateInput>
    /**
     * Choose, which LegendSubchapter to update.
     */
    where: LegendSubchapterWhereUniqueInput
  }

  /**
   * LegendSubchapter updateMany
   */
  export type LegendSubchapterUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LegendSubchapters.
     */
    data: XOR<LegendSubchapterUpdateManyMutationInput, LegendSubchapterUncheckedUpdateManyInput>
    /**
     * Filter which LegendSubchapters to update
     */
    where?: LegendSubchapterWhereInput
    /**
     * Limit how many LegendSubchapters to update.
     */
    limit?: number
  }

  /**
   * LegendSubchapter updateManyAndReturn
   */
  export type LegendSubchapterUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LegendSubchapter
     */
    select?: LegendSubchapterSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LegendSubchapter
     */
    omit?: LegendSubchapterOmit<ExtArgs> | null
    /**
     * The data used to update LegendSubchapters.
     */
    data: XOR<LegendSubchapterUpdateManyMutationInput, LegendSubchapterUncheckedUpdateManyInput>
    /**
     * Filter which LegendSubchapters to update
     */
    where?: LegendSubchapterWhereInput
    /**
     * Limit how many LegendSubchapters to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LegendSubchapterIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * LegendSubchapter upsert
   */
  export type LegendSubchapterUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LegendSubchapter
     */
    select?: LegendSubchapterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LegendSubchapter
     */
    omit?: LegendSubchapterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LegendSubchapterInclude<ExtArgs> | null
    /**
     * The filter to search for the LegendSubchapter to update in case it exists.
     */
    where: LegendSubchapterWhereUniqueInput
    /**
     * In case the LegendSubchapter found by the `where` argument doesn't exist, create a new LegendSubchapter with this data.
     */
    create: XOR<LegendSubchapterCreateInput, LegendSubchapterUncheckedCreateInput>
    /**
     * In case the LegendSubchapter was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LegendSubchapterUpdateInput, LegendSubchapterUncheckedUpdateInput>
  }

  /**
   * LegendSubchapter delete
   */
  export type LegendSubchapterDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LegendSubchapter
     */
    select?: LegendSubchapterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LegendSubchapter
     */
    omit?: LegendSubchapterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LegendSubchapterInclude<ExtArgs> | null
    /**
     * Filter which LegendSubchapter to delete.
     */
    where: LegendSubchapterWhereUniqueInput
  }

  /**
   * LegendSubchapter deleteMany
   */
  export type LegendSubchapterDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LegendSubchapters to delete
     */
    where?: LegendSubchapterWhereInput
    /**
     * Limit how many LegendSubchapters to delete.
     */
    limit?: number
  }

  /**
   * LegendSubchapter.progress
   */
  export type LegendSubchapter$progressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLegendProgress
     */
    select?: UserLegendProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserLegendProgress
     */
    omit?: UserLegendProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserLegendProgressInclude<ExtArgs> | null
    where?: UserLegendProgressWhereInput
    orderBy?: UserLegendProgressOrderByWithRelationInput | UserLegendProgressOrderByWithRelationInput[]
    cursor?: UserLegendProgressWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserLegendProgressScalarFieldEnum | UserLegendProgressScalarFieldEnum[]
  }

  /**
   * LegendSubchapter without action
   */
  export type LegendSubchapterDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LegendSubchapter
     */
    select?: LegendSubchapterSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LegendSubchapter
     */
    omit?: LegendSubchapterOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LegendSubchapterInclude<ExtArgs> | null
  }


  /**
   * Model UserLegendProgress
   */

  export type AggregateUserLegendProgress = {
    _count: UserLegendProgressCountAggregateOutputType | null
    _avg: UserLegendProgressAvgAggregateOutputType | null
    _sum: UserLegendProgressSumAggregateOutputType | null
    _min: UserLegendProgressMinAggregateOutputType | null
    _max: UserLegendProgressMaxAggregateOutputType | null
  }

  export type UserLegendProgressAvgAggregateOutputType = {
    crownMax: number | null
  }

  export type UserLegendProgressSumAggregateOutputType = {
    crownMax: number | null
  }

  export type UserLegendProgressMinAggregateOutputType = {
    id: string | null
    userId: string | null
    subchapterId: string | null
    status: $Enums.LegendProgressStatus | null
    crownMax: number | null
    notes: string | null
    updatedAt: Date | null
  }

  export type UserLegendProgressMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    subchapterId: string | null
    status: $Enums.LegendProgressStatus | null
    crownMax: number | null
    notes: string | null
    updatedAt: Date | null
  }

  export type UserLegendProgressCountAggregateOutputType = {
    id: number
    userId: number
    subchapterId: number
    status: number
    crownMax: number
    notes: number
    updatedAt: number
    _all: number
  }


  export type UserLegendProgressAvgAggregateInputType = {
    crownMax?: true
  }

  export type UserLegendProgressSumAggregateInputType = {
    crownMax?: true
  }

  export type UserLegendProgressMinAggregateInputType = {
    id?: true
    userId?: true
    subchapterId?: true
    status?: true
    crownMax?: true
    notes?: true
    updatedAt?: true
  }

  export type UserLegendProgressMaxAggregateInputType = {
    id?: true
    userId?: true
    subchapterId?: true
    status?: true
    crownMax?: true
    notes?: true
    updatedAt?: true
  }

  export type UserLegendProgressCountAggregateInputType = {
    id?: true
    userId?: true
    subchapterId?: true
    status?: true
    crownMax?: true
    notes?: true
    updatedAt?: true
    _all?: true
  }

  export type UserLegendProgressAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserLegendProgress to aggregate.
     */
    where?: UserLegendProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserLegendProgresses to fetch.
     */
    orderBy?: UserLegendProgressOrderByWithRelationInput | UserLegendProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserLegendProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserLegendProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserLegendProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserLegendProgresses
    **/
    _count?: true | UserLegendProgressCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserLegendProgressAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserLegendProgressSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserLegendProgressMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserLegendProgressMaxAggregateInputType
  }

  export type GetUserLegendProgressAggregateType<T extends UserLegendProgressAggregateArgs> = {
        [P in keyof T & keyof AggregateUserLegendProgress]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserLegendProgress[P]>
      : GetScalarType<T[P], AggregateUserLegendProgress[P]>
  }




  export type UserLegendProgressGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserLegendProgressWhereInput
    orderBy?: UserLegendProgressOrderByWithAggregationInput | UserLegendProgressOrderByWithAggregationInput[]
    by: UserLegendProgressScalarFieldEnum[] | UserLegendProgressScalarFieldEnum
    having?: UserLegendProgressScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserLegendProgressCountAggregateInputType | true
    _avg?: UserLegendProgressAvgAggregateInputType
    _sum?: UserLegendProgressSumAggregateInputType
    _min?: UserLegendProgressMinAggregateInputType
    _max?: UserLegendProgressMaxAggregateInputType
  }

  export type UserLegendProgressGroupByOutputType = {
    id: string
    userId: string
    subchapterId: string
    status: $Enums.LegendProgressStatus
    crownMax: number | null
    notes: string | null
    updatedAt: Date
    _count: UserLegendProgressCountAggregateOutputType | null
    _avg: UserLegendProgressAvgAggregateOutputType | null
    _sum: UserLegendProgressSumAggregateOutputType | null
    _min: UserLegendProgressMinAggregateOutputType | null
    _max: UserLegendProgressMaxAggregateOutputType | null
  }

  type GetUserLegendProgressGroupByPayload<T extends UserLegendProgressGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserLegendProgressGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserLegendProgressGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserLegendProgressGroupByOutputType[P]>
            : GetScalarType<T[P], UserLegendProgressGroupByOutputType[P]>
        }
      >
    >


  export type UserLegendProgressSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    subchapterId?: boolean
    status?: boolean
    crownMax?: boolean
    notes?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    subchapter?: boolean | LegendSubchapterDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userLegendProgress"]>

  export type UserLegendProgressSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    subchapterId?: boolean
    status?: boolean
    crownMax?: boolean
    notes?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    subchapter?: boolean | LegendSubchapterDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userLegendProgress"]>

  export type UserLegendProgressSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    subchapterId?: boolean
    status?: boolean
    crownMax?: boolean
    notes?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    subchapter?: boolean | LegendSubchapterDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userLegendProgress"]>

  export type UserLegendProgressSelectScalar = {
    id?: boolean
    userId?: boolean
    subchapterId?: boolean
    status?: boolean
    crownMax?: boolean
    notes?: boolean
    updatedAt?: boolean
  }

  export type UserLegendProgressOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "subchapterId" | "status" | "crownMax" | "notes" | "updatedAt", ExtArgs["result"]["userLegendProgress"]>
  export type UserLegendProgressInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    subchapter?: boolean | LegendSubchapterDefaultArgs<ExtArgs>
  }
  export type UserLegendProgressIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    subchapter?: boolean | LegendSubchapterDefaultArgs<ExtArgs>
  }
  export type UserLegendProgressIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    subchapter?: boolean | LegendSubchapterDefaultArgs<ExtArgs>
  }

  export type $UserLegendProgressPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserLegendProgress"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      subchapter: Prisma.$LegendSubchapterPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      subchapterId: string
      status: $Enums.LegendProgressStatus
      crownMax: number | null
      notes: string | null
      updatedAt: Date
    }, ExtArgs["result"]["userLegendProgress"]>
    composites: {}
  }

  type UserLegendProgressGetPayload<S extends boolean | null | undefined | UserLegendProgressDefaultArgs> = $Result.GetResult<Prisma.$UserLegendProgressPayload, S>

  type UserLegendProgressCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserLegendProgressFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserLegendProgressCountAggregateInputType | true
    }

  export interface UserLegendProgressDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserLegendProgress'], meta: { name: 'UserLegendProgress' } }
    /**
     * Find zero or one UserLegendProgress that matches the filter.
     * @param {UserLegendProgressFindUniqueArgs} args - Arguments to find a UserLegendProgress
     * @example
     * // Get one UserLegendProgress
     * const userLegendProgress = await prisma.userLegendProgress.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserLegendProgressFindUniqueArgs>(args: SelectSubset<T, UserLegendProgressFindUniqueArgs<ExtArgs>>): Prisma__UserLegendProgressClient<$Result.GetResult<Prisma.$UserLegendProgressPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserLegendProgress that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserLegendProgressFindUniqueOrThrowArgs} args - Arguments to find a UserLegendProgress
     * @example
     * // Get one UserLegendProgress
     * const userLegendProgress = await prisma.userLegendProgress.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserLegendProgressFindUniqueOrThrowArgs>(args: SelectSubset<T, UserLegendProgressFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserLegendProgressClient<$Result.GetResult<Prisma.$UserLegendProgressPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserLegendProgress that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserLegendProgressFindFirstArgs} args - Arguments to find a UserLegendProgress
     * @example
     * // Get one UserLegendProgress
     * const userLegendProgress = await prisma.userLegendProgress.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserLegendProgressFindFirstArgs>(args?: SelectSubset<T, UserLegendProgressFindFirstArgs<ExtArgs>>): Prisma__UserLegendProgressClient<$Result.GetResult<Prisma.$UserLegendProgressPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserLegendProgress that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserLegendProgressFindFirstOrThrowArgs} args - Arguments to find a UserLegendProgress
     * @example
     * // Get one UserLegendProgress
     * const userLegendProgress = await prisma.userLegendProgress.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserLegendProgressFindFirstOrThrowArgs>(args?: SelectSubset<T, UserLegendProgressFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserLegendProgressClient<$Result.GetResult<Prisma.$UserLegendProgressPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserLegendProgresses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserLegendProgressFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserLegendProgresses
     * const userLegendProgresses = await prisma.userLegendProgress.findMany()
     * 
     * // Get first 10 UserLegendProgresses
     * const userLegendProgresses = await prisma.userLegendProgress.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userLegendProgressWithIdOnly = await prisma.userLegendProgress.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserLegendProgressFindManyArgs>(args?: SelectSubset<T, UserLegendProgressFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserLegendProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserLegendProgress.
     * @param {UserLegendProgressCreateArgs} args - Arguments to create a UserLegendProgress.
     * @example
     * // Create one UserLegendProgress
     * const UserLegendProgress = await prisma.userLegendProgress.create({
     *   data: {
     *     // ... data to create a UserLegendProgress
     *   }
     * })
     * 
     */
    create<T extends UserLegendProgressCreateArgs>(args: SelectSubset<T, UserLegendProgressCreateArgs<ExtArgs>>): Prisma__UserLegendProgressClient<$Result.GetResult<Prisma.$UserLegendProgressPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserLegendProgresses.
     * @param {UserLegendProgressCreateManyArgs} args - Arguments to create many UserLegendProgresses.
     * @example
     * // Create many UserLegendProgresses
     * const userLegendProgress = await prisma.userLegendProgress.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserLegendProgressCreateManyArgs>(args?: SelectSubset<T, UserLegendProgressCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserLegendProgresses and returns the data saved in the database.
     * @param {UserLegendProgressCreateManyAndReturnArgs} args - Arguments to create many UserLegendProgresses.
     * @example
     * // Create many UserLegendProgresses
     * const userLegendProgress = await prisma.userLegendProgress.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserLegendProgresses and only return the `id`
     * const userLegendProgressWithIdOnly = await prisma.userLegendProgress.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserLegendProgressCreateManyAndReturnArgs>(args?: SelectSubset<T, UserLegendProgressCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserLegendProgressPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserLegendProgress.
     * @param {UserLegendProgressDeleteArgs} args - Arguments to delete one UserLegendProgress.
     * @example
     * // Delete one UserLegendProgress
     * const UserLegendProgress = await prisma.userLegendProgress.delete({
     *   where: {
     *     // ... filter to delete one UserLegendProgress
     *   }
     * })
     * 
     */
    delete<T extends UserLegendProgressDeleteArgs>(args: SelectSubset<T, UserLegendProgressDeleteArgs<ExtArgs>>): Prisma__UserLegendProgressClient<$Result.GetResult<Prisma.$UserLegendProgressPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserLegendProgress.
     * @param {UserLegendProgressUpdateArgs} args - Arguments to update one UserLegendProgress.
     * @example
     * // Update one UserLegendProgress
     * const userLegendProgress = await prisma.userLegendProgress.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserLegendProgressUpdateArgs>(args: SelectSubset<T, UserLegendProgressUpdateArgs<ExtArgs>>): Prisma__UserLegendProgressClient<$Result.GetResult<Prisma.$UserLegendProgressPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserLegendProgresses.
     * @param {UserLegendProgressDeleteManyArgs} args - Arguments to filter UserLegendProgresses to delete.
     * @example
     * // Delete a few UserLegendProgresses
     * const { count } = await prisma.userLegendProgress.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserLegendProgressDeleteManyArgs>(args?: SelectSubset<T, UserLegendProgressDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserLegendProgresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserLegendProgressUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserLegendProgresses
     * const userLegendProgress = await prisma.userLegendProgress.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserLegendProgressUpdateManyArgs>(args: SelectSubset<T, UserLegendProgressUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserLegendProgresses and returns the data updated in the database.
     * @param {UserLegendProgressUpdateManyAndReturnArgs} args - Arguments to update many UserLegendProgresses.
     * @example
     * // Update many UserLegendProgresses
     * const userLegendProgress = await prisma.userLegendProgress.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserLegendProgresses and only return the `id`
     * const userLegendProgressWithIdOnly = await prisma.userLegendProgress.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserLegendProgressUpdateManyAndReturnArgs>(args: SelectSubset<T, UserLegendProgressUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserLegendProgressPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserLegendProgress.
     * @param {UserLegendProgressUpsertArgs} args - Arguments to update or create a UserLegendProgress.
     * @example
     * // Update or create a UserLegendProgress
     * const userLegendProgress = await prisma.userLegendProgress.upsert({
     *   create: {
     *     // ... data to create a UserLegendProgress
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserLegendProgress we want to update
     *   }
     * })
     */
    upsert<T extends UserLegendProgressUpsertArgs>(args: SelectSubset<T, UserLegendProgressUpsertArgs<ExtArgs>>): Prisma__UserLegendProgressClient<$Result.GetResult<Prisma.$UserLegendProgressPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserLegendProgresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserLegendProgressCountArgs} args - Arguments to filter UserLegendProgresses to count.
     * @example
     * // Count the number of UserLegendProgresses
     * const count = await prisma.userLegendProgress.count({
     *   where: {
     *     // ... the filter for the UserLegendProgresses we want to count
     *   }
     * })
    **/
    count<T extends UserLegendProgressCountArgs>(
      args?: Subset<T, UserLegendProgressCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserLegendProgressCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserLegendProgress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserLegendProgressAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserLegendProgressAggregateArgs>(args: Subset<T, UserLegendProgressAggregateArgs>): Prisma.PrismaPromise<GetUserLegendProgressAggregateType<T>>

    /**
     * Group by UserLegendProgress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserLegendProgressGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserLegendProgressGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserLegendProgressGroupByArgs['orderBy'] }
        : { orderBy?: UserLegendProgressGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserLegendProgressGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserLegendProgressGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserLegendProgress model
   */
  readonly fields: UserLegendProgressFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserLegendProgress.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserLegendProgressClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    subchapter<T extends LegendSubchapterDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LegendSubchapterDefaultArgs<ExtArgs>>): Prisma__LegendSubchapterClient<$Result.GetResult<Prisma.$LegendSubchapterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserLegendProgress model
   */
  interface UserLegendProgressFieldRefs {
    readonly id: FieldRef<"UserLegendProgress", 'String'>
    readonly userId: FieldRef<"UserLegendProgress", 'String'>
    readonly subchapterId: FieldRef<"UserLegendProgress", 'String'>
    readonly status: FieldRef<"UserLegendProgress", 'LegendProgressStatus'>
    readonly crownMax: FieldRef<"UserLegendProgress", 'Int'>
    readonly notes: FieldRef<"UserLegendProgress", 'String'>
    readonly updatedAt: FieldRef<"UserLegendProgress", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserLegendProgress findUnique
   */
  export type UserLegendProgressFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLegendProgress
     */
    select?: UserLegendProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserLegendProgress
     */
    omit?: UserLegendProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserLegendProgressInclude<ExtArgs> | null
    /**
     * Filter, which UserLegendProgress to fetch.
     */
    where: UserLegendProgressWhereUniqueInput
  }

  /**
   * UserLegendProgress findUniqueOrThrow
   */
  export type UserLegendProgressFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLegendProgress
     */
    select?: UserLegendProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserLegendProgress
     */
    omit?: UserLegendProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserLegendProgressInclude<ExtArgs> | null
    /**
     * Filter, which UserLegendProgress to fetch.
     */
    where: UserLegendProgressWhereUniqueInput
  }

  /**
   * UserLegendProgress findFirst
   */
  export type UserLegendProgressFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLegendProgress
     */
    select?: UserLegendProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserLegendProgress
     */
    omit?: UserLegendProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserLegendProgressInclude<ExtArgs> | null
    /**
     * Filter, which UserLegendProgress to fetch.
     */
    where?: UserLegendProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserLegendProgresses to fetch.
     */
    orderBy?: UserLegendProgressOrderByWithRelationInput | UserLegendProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserLegendProgresses.
     */
    cursor?: UserLegendProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserLegendProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserLegendProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserLegendProgresses.
     */
    distinct?: UserLegendProgressScalarFieldEnum | UserLegendProgressScalarFieldEnum[]
  }

  /**
   * UserLegendProgress findFirstOrThrow
   */
  export type UserLegendProgressFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLegendProgress
     */
    select?: UserLegendProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserLegendProgress
     */
    omit?: UserLegendProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserLegendProgressInclude<ExtArgs> | null
    /**
     * Filter, which UserLegendProgress to fetch.
     */
    where?: UserLegendProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserLegendProgresses to fetch.
     */
    orderBy?: UserLegendProgressOrderByWithRelationInput | UserLegendProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserLegendProgresses.
     */
    cursor?: UserLegendProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserLegendProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserLegendProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserLegendProgresses.
     */
    distinct?: UserLegendProgressScalarFieldEnum | UserLegendProgressScalarFieldEnum[]
  }

  /**
   * UserLegendProgress findMany
   */
  export type UserLegendProgressFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLegendProgress
     */
    select?: UserLegendProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserLegendProgress
     */
    omit?: UserLegendProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserLegendProgressInclude<ExtArgs> | null
    /**
     * Filter, which UserLegendProgresses to fetch.
     */
    where?: UserLegendProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserLegendProgresses to fetch.
     */
    orderBy?: UserLegendProgressOrderByWithRelationInput | UserLegendProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserLegendProgresses.
     */
    cursor?: UserLegendProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserLegendProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserLegendProgresses.
     */
    skip?: number
    distinct?: UserLegendProgressScalarFieldEnum | UserLegendProgressScalarFieldEnum[]
  }

  /**
   * UserLegendProgress create
   */
  export type UserLegendProgressCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLegendProgress
     */
    select?: UserLegendProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserLegendProgress
     */
    omit?: UserLegendProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserLegendProgressInclude<ExtArgs> | null
    /**
     * The data needed to create a UserLegendProgress.
     */
    data: XOR<UserLegendProgressCreateInput, UserLegendProgressUncheckedCreateInput>
  }

  /**
   * UserLegendProgress createMany
   */
  export type UserLegendProgressCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserLegendProgresses.
     */
    data: UserLegendProgressCreateManyInput | UserLegendProgressCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserLegendProgress createManyAndReturn
   */
  export type UserLegendProgressCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLegendProgress
     */
    select?: UserLegendProgressSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserLegendProgress
     */
    omit?: UserLegendProgressOmit<ExtArgs> | null
    /**
     * The data used to create many UserLegendProgresses.
     */
    data: UserLegendProgressCreateManyInput | UserLegendProgressCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserLegendProgressIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserLegendProgress update
   */
  export type UserLegendProgressUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLegendProgress
     */
    select?: UserLegendProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserLegendProgress
     */
    omit?: UserLegendProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserLegendProgressInclude<ExtArgs> | null
    /**
     * The data needed to update a UserLegendProgress.
     */
    data: XOR<UserLegendProgressUpdateInput, UserLegendProgressUncheckedUpdateInput>
    /**
     * Choose, which UserLegendProgress to update.
     */
    where: UserLegendProgressWhereUniqueInput
  }

  /**
   * UserLegendProgress updateMany
   */
  export type UserLegendProgressUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserLegendProgresses.
     */
    data: XOR<UserLegendProgressUpdateManyMutationInput, UserLegendProgressUncheckedUpdateManyInput>
    /**
     * Filter which UserLegendProgresses to update
     */
    where?: UserLegendProgressWhereInput
    /**
     * Limit how many UserLegendProgresses to update.
     */
    limit?: number
  }

  /**
   * UserLegendProgress updateManyAndReturn
   */
  export type UserLegendProgressUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLegendProgress
     */
    select?: UserLegendProgressSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserLegendProgress
     */
    omit?: UserLegendProgressOmit<ExtArgs> | null
    /**
     * The data used to update UserLegendProgresses.
     */
    data: XOR<UserLegendProgressUpdateManyMutationInput, UserLegendProgressUncheckedUpdateManyInput>
    /**
     * Filter which UserLegendProgresses to update
     */
    where?: UserLegendProgressWhereInput
    /**
     * Limit how many UserLegendProgresses to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserLegendProgressIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserLegendProgress upsert
   */
  export type UserLegendProgressUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLegendProgress
     */
    select?: UserLegendProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserLegendProgress
     */
    omit?: UserLegendProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserLegendProgressInclude<ExtArgs> | null
    /**
     * The filter to search for the UserLegendProgress to update in case it exists.
     */
    where: UserLegendProgressWhereUniqueInput
    /**
     * In case the UserLegendProgress found by the `where` argument doesn't exist, create a new UserLegendProgress with this data.
     */
    create: XOR<UserLegendProgressCreateInput, UserLegendProgressUncheckedCreateInput>
    /**
     * In case the UserLegendProgress was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserLegendProgressUpdateInput, UserLegendProgressUncheckedUpdateInput>
  }

  /**
   * UserLegendProgress delete
   */
  export type UserLegendProgressDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLegendProgress
     */
    select?: UserLegendProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserLegendProgress
     */
    omit?: UserLegendProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserLegendProgressInclude<ExtArgs> | null
    /**
     * Filter which UserLegendProgress to delete.
     */
    where: UserLegendProgressWhereUniqueInput
  }

  /**
   * UserLegendProgress deleteMany
   */
  export type UserLegendProgressDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserLegendProgresses to delete
     */
    where?: UserLegendProgressWhereInput
    /**
     * Limit how many UserLegendProgresses to delete.
     */
    limit?: number
  }

  /**
   * UserLegendProgress without action
   */
  export type UserLegendProgressDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserLegendProgress
     */
    select?: UserLegendProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserLegendProgress
     */
    omit?: UserLegendProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserLegendProgressInclude<ExtArgs> | null
  }


  /**
   * Model Milestone
   */

  export type AggregateMilestone = {
    _count: MilestoneCountAggregateOutputType | null
    _avg: MilestoneAvgAggregateOutputType | null
    _sum: MilestoneSumAggregateOutputType | null
    _min: MilestoneMinAggregateOutputType | null
    _max: MilestoneMaxAggregateOutputType | null
  }

  export type MilestoneAvgAggregateOutputType = {
    sortOrder: number | null
  }

  export type MilestoneSumAggregateOutputType = {
    sortOrder: number | null
  }

  export type MilestoneMinAggregateOutputType = {
    id: string | null
    category: $Enums.MilestoneCategory | null
    displayName: string | null
    sortOrder: number | null
  }

  export type MilestoneMaxAggregateOutputType = {
    id: string | null
    category: $Enums.MilestoneCategory | null
    displayName: string | null
    sortOrder: number | null
  }

  export type MilestoneCountAggregateOutputType = {
    id: number
    category: number
    displayName: number
    sortOrder: number
    _all: number
  }


  export type MilestoneAvgAggregateInputType = {
    sortOrder?: true
  }

  export type MilestoneSumAggregateInputType = {
    sortOrder?: true
  }

  export type MilestoneMinAggregateInputType = {
    id?: true
    category?: true
    displayName?: true
    sortOrder?: true
  }

  export type MilestoneMaxAggregateInputType = {
    id?: true
    category?: true
    displayName?: true
    sortOrder?: true
  }

  export type MilestoneCountAggregateInputType = {
    id?: true
    category?: true
    displayName?: true
    sortOrder?: true
    _all?: true
  }

  export type MilestoneAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Milestone to aggregate.
     */
    where?: MilestoneWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Milestones to fetch.
     */
    orderBy?: MilestoneOrderByWithRelationInput | MilestoneOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MilestoneWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Milestones from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Milestones.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Milestones
    **/
    _count?: true | MilestoneCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MilestoneAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MilestoneSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MilestoneMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MilestoneMaxAggregateInputType
  }

  export type GetMilestoneAggregateType<T extends MilestoneAggregateArgs> = {
        [P in keyof T & keyof AggregateMilestone]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMilestone[P]>
      : GetScalarType<T[P], AggregateMilestone[P]>
  }




  export type MilestoneGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MilestoneWhereInput
    orderBy?: MilestoneOrderByWithAggregationInput | MilestoneOrderByWithAggregationInput[]
    by: MilestoneScalarFieldEnum[] | MilestoneScalarFieldEnum
    having?: MilestoneScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MilestoneCountAggregateInputType | true
    _avg?: MilestoneAvgAggregateInputType
    _sum?: MilestoneSumAggregateInputType
    _min?: MilestoneMinAggregateInputType
    _max?: MilestoneMaxAggregateInputType
  }

  export type MilestoneGroupByOutputType = {
    id: string
    category: $Enums.MilestoneCategory
    displayName: string
    sortOrder: number
    _count: MilestoneCountAggregateOutputType | null
    _avg: MilestoneAvgAggregateOutputType | null
    _sum: MilestoneSumAggregateOutputType | null
    _min: MilestoneMinAggregateOutputType | null
    _max: MilestoneMaxAggregateOutputType | null
  }

  type GetMilestoneGroupByPayload<T extends MilestoneGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MilestoneGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MilestoneGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MilestoneGroupByOutputType[P]>
            : GetScalarType<T[P], MilestoneGroupByOutputType[P]>
        }
      >
    >


  export type MilestoneSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    category?: boolean
    displayName?: boolean
    sortOrder?: boolean
    progress?: boolean | Milestone$progressArgs<ExtArgs>
    _count?: boolean | MilestoneCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["milestone"]>

  export type MilestoneSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    category?: boolean
    displayName?: boolean
    sortOrder?: boolean
  }, ExtArgs["result"]["milestone"]>

  export type MilestoneSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    category?: boolean
    displayName?: boolean
    sortOrder?: boolean
  }, ExtArgs["result"]["milestone"]>

  export type MilestoneSelectScalar = {
    id?: boolean
    category?: boolean
    displayName?: boolean
    sortOrder?: boolean
  }

  export type MilestoneOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "category" | "displayName" | "sortOrder", ExtArgs["result"]["milestone"]>
  export type MilestoneInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    progress?: boolean | Milestone$progressArgs<ExtArgs>
    _count?: boolean | MilestoneCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type MilestoneIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type MilestoneIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $MilestonePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Milestone"
    objects: {
      progress: Prisma.$UserMilestoneProgressPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      category: $Enums.MilestoneCategory
      displayName: string
      sortOrder: number
    }, ExtArgs["result"]["milestone"]>
    composites: {}
  }

  type MilestoneGetPayload<S extends boolean | null | undefined | MilestoneDefaultArgs> = $Result.GetResult<Prisma.$MilestonePayload, S>

  type MilestoneCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MilestoneFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MilestoneCountAggregateInputType | true
    }

  export interface MilestoneDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Milestone'], meta: { name: 'Milestone' } }
    /**
     * Find zero or one Milestone that matches the filter.
     * @param {MilestoneFindUniqueArgs} args - Arguments to find a Milestone
     * @example
     * // Get one Milestone
     * const milestone = await prisma.milestone.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MilestoneFindUniqueArgs>(args: SelectSubset<T, MilestoneFindUniqueArgs<ExtArgs>>): Prisma__MilestoneClient<$Result.GetResult<Prisma.$MilestonePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Milestone that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MilestoneFindUniqueOrThrowArgs} args - Arguments to find a Milestone
     * @example
     * // Get one Milestone
     * const milestone = await prisma.milestone.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MilestoneFindUniqueOrThrowArgs>(args: SelectSubset<T, MilestoneFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MilestoneClient<$Result.GetResult<Prisma.$MilestonePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Milestone that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MilestoneFindFirstArgs} args - Arguments to find a Milestone
     * @example
     * // Get one Milestone
     * const milestone = await prisma.milestone.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MilestoneFindFirstArgs>(args?: SelectSubset<T, MilestoneFindFirstArgs<ExtArgs>>): Prisma__MilestoneClient<$Result.GetResult<Prisma.$MilestonePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Milestone that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MilestoneFindFirstOrThrowArgs} args - Arguments to find a Milestone
     * @example
     * // Get one Milestone
     * const milestone = await prisma.milestone.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MilestoneFindFirstOrThrowArgs>(args?: SelectSubset<T, MilestoneFindFirstOrThrowArgs<ExtArgs>>): Prisma__MilestoneClient<$Result.GetResult<Prisma.$MilestonePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Milestones that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MilestoneFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Milestones
     * const milestones = await prisma.milestone.findMany()
     * 
     * // Get first 10 Milestones
     * const milestones = await prisma.milestone.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const milestoneWithIdOnly = await prisma.milestone.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MilestoneFindManyArgs>(args?: SelectSubset<T, MilestoneFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MilestonePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Milestone.
     * @param {MilestoneCreateArgs} args - Arguments to create a Milestone.
     * @example
     * // Create one Milestone
     * const Milestone = await prisma.milestone.create({
     *   data: {
     *     // ... data to create a Milestone
     *   }
     * })
     * 
     */
    create<T extends MilestoneCreateArgs>(args: SelectSubset<T, MilestoneCreateArgs<ExtArgs>>): Prisma__MilestoneClient<$Result.GetResult<Prisma.$MilestonePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Milestones.
     * @param {MilestoneCreateManyArgs} args - Arguments to create many Milestones.
     * @example
     * // Create many Milestones
     * const milestone = await prisma.milestone.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MilestoneCreateManyArgs>(args?: SelectSubset<T, MilestoneCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Milestones and returns the data saved in the database.
     * @param {MilestoneCreateManyAndReturnArgs} args - Arguments to create many Milestones.
     * @example
     * // Create many Milestones
     * const milestone = await prisma.milestone.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Milestones and only return the `id`
     * const milestoneWithIdOnly = await prisma.milestone.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MilestoneCreateManyAndReturnArgs>(args?: SelectSubset<T, MilestoneCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MilestonePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Milestone.
     * @param {MilestoneDeleteArgs} args - Arguments to delete one Milestone.
     * @example
     * // Delete one Milestone
     * const Milestone = await prisma.milestone.delete({
     *   where: {
     *     // ... filter to delete one Milestone
     *   }
     * })
     * 
     */
    delete<T extends MilestoneDeleteArgs>(args: SelectSubset<T, MilestoneDeleteArgs<ExtArgs>>): Prisma__MilestoneClient<$Result.GetResult<Prisma.$MilestonePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Milestone.
     * @param {MilestoneUpdateArgs} args - Arguments to update one Milestone.
     * @example
     * // Update one Milestone
     * const milestone = await prisma.milestone.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MilestoneUpdateArgs>(args: SelectSubset<T, MilestoneUpdateArgs<ExtArgs>>): Prisma__MilestoneClient<$Result.GetResult<Prisma.$MilestonePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Milestones.
     * @param {MilestoneDeleteManyArgs} args - Arguments to filter Milestones to delete.
     * @example
     * // Delete a few Milestones
     * const { count } = await prisma.milestone.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MilestoneDeleteManyArgs>(args?: SelectSubset<T, MilestoneDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Milestones.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MilestoneUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Milestones
     * const milestone = await prisma.milestone.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MilestoneUpdateManyArgs>(args: SelectSubset<T, MilestoneUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Milestones and returns the data updated in the database.
     * @param {MilestoneUpdateManyAndReturnArgs} args - Arguments to update many Milestones.
     * @example
     * // Update many Milestones
     * const milestone = await prisma.milestone.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Milestones and only return the `id`
     * const milestoneWithIdOnly = await prisma.milestone.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MilestoneUpdateManyAndReturnArgs>(args: SelectSubset<T, MilestoneUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MilestonePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Milestone.
     * @param {MilestoneUpsertArgs} args - Arguments to update or create a Milestone.
     * @example
     * // Update or create a Milestone
     * const milestone = await prisma.milestone.upsert({
     *   create: {
     *     // ... data to create a Milestone
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Milestone we want to update
     *   }
     * })
     */
    upsert<T extends MilestoneUpsertArgs>(args: SelectSubset<T, MilestoneUpsertArgs<ExtArgs>>): Prisma__MilestoneClient<$Result.GetResult<Prisma.$MilestonePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Milestones.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MilestoneCountArgs} args - Arguments to filter Milestones to count.
     * @example
     * // Count the number of Milestones
     * const count = await prisma.milestone.count({
     *   where: {
     *     // ... the filter for the Milestones we want to count
     *   }
     * })
    **/
    count<T extends MilestoneCountArgs>(
      args?: Subset<T, MilestoneCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MilestoneCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Milestone.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MilestoneAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MilestoneAggregateArgs>(args: Subset<T, MilestoneAggregateArgs>): Prisma.PrismaPromise<GetMilestoneAggregateType<T>>

    /**
     * Group by Milestone.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MilestoneGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MilestoneGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MilestoneGroupByArgs['orderBy'] }
        : { orderBy?: MilestoneGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MilestoneGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMilestoneGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Milestone model
   */
  readonly fields: MilestoneFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Milestone.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MilestoneClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    progress<T extends Milestone$progressArgs<ExtArgs> = {}>(args?: Subset<T, Milestone$progressArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserMilestoneProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Milestone model
   */
  interface MilestoneFieldRefs {
    readonly id: FieldRef<"Milestone", 'String'>
    readonly category: FieldRef<"Milestone", 'MilestoneCategory'>
    readonly displayName: FieldRef<"Milestone", 'String'>
    readonly sortOrder: FieldRef<"Milestone", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Milestone findUnique
   */
  export type MilestoneFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Milestone
     */
    select?: MilestoneSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Milestone
     */
    omit?: MilestoneOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MilestoneInclude<ExtArgs> | null
    /**
     * Filter, which Milestone to fetch.
     */
    where: MilestoneWhereUniqueInput
  }

  /**
   * Milestone findUniqueOrThrow
   */
  export type MilestoneFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Milestone
     */
    select?: MilestoneSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Milestone
     */
    omit?: MilestoneOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MilestoneInclude<ExtArgs> | null
    /**
     * Filter, which Milestone to fetch.
     */
    where: MilestoneWhereUniqueInput
  }

  /**
   * Milestone findFirst
   */
  export type MilestoneFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Milestone
     */
    select?: MilestoneSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Milestone
     */
    omit?: MilestoneOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MilestoneInclude<ExtArgs> | null
    /**
     * Filter, which Milestone to fetch.
     */
    where?: MilestoneWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Milestones to fetch.
     */
    orderBy?: MilestoneOrderByWithRelationInput | MilestoneOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Milestones.
     */
    cursor?: MilestoneWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Milestones from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Milestones.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Milestones.
     */
    distinct?: MilestoneScalarFieldEnum | MilestoneScalarFieldEnum[]
  }

  /**
   * Milestone findFirstOrThrow
   */
  export type MilestoneFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Milestone
     */
    select?: MilestoneSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Milestone
     */
    omit?: MilestoneOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MilestoneInclude<ExtArgs> | null
    /**
     * Filter, which Milestone to fetch.
     */
    where?: MilestoneWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Milestones to fetch.
     */
    orderBy?: MilestoneOrderByWithRelationInput | MilestoneOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Milestones.
     */
    cursor?: MilestoneWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Milestones from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Milestones.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Milestones.
     */
    distinct?: MilestoneScalarFieldEnum | MilestoneScalarFieldEnum[]
  }

  /**
   * Milestone findMany
   */
  export type MilestoneFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Milestone
     */
    select?: MilestoneSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Milestone
     */
    omit?: MilestoneOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MilestoneInclude<ExtArgs> | null
    /**
     * Filter, which Milestones to fetch.
     */
    where?: MilestoneWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Milestones to fetch.
     */
    orderBy?: MilestoneOrderByWithRelationInput | MilestoneOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Milestones.
     */
    cursor?: MilestoneWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Milestones from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Milestones.
     */
    skip?: number
    distinct?: MilestoneScalarFieldEnum | MilestoneScalarFieldEnum[]
  }

  /**
   * Milestone create
   */
  export type MilestoneCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Milestone
     */
    select?: MilestoneSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Milestone
     */
    omit?: MilestoneOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MilestoneInclude<ExtArgs> | null
    /**
     * The data needed to create a Milestone.
     */
    data: XOR<MilestoneCreateInput, MilestoneUncheckedCreateInput>
  }

  /**
   * Milestone createMany
   */
  export type MilestoneCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Milestones.
     */
    data: MilestoneCreateManyInput | MilestoneCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Milestone createManyAndReturn
   */
  export type MilestoneCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Milestone
     */
    select?: MilestoneSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Milestone
     */
    omit?: MilestoneOmit<ExtArgs> | null
    /**
     * The data used to create many Milestones.
     */
    data: MilestoneCreateManyInput | MilestoneCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Milestone update
   */
  export type MilestoneUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Milestone
     */
    select?: MilestoneSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Milestone
     */
    omit?: MilestoneOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MilestoneInclude<ExtArgs> | null
    /**
     * The data needed to update a Milestone.
     */
    data: XOR<MilestoneUpdateInput, MilestoneUncheckedUpdateInput>
    /**
     * Choose, which Milestone to update.
     */
    where: MilestoneWhereUniqueInput
  }

  /**
   * Milestone updateMany
   */
  export type MilestoneUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Milestones.
     */
    data: XOR<MilestoneUpdateManyMutationInput, MilestoneUncheckedUpdateManyInput>
    /**
     * Filter which Milestones to update
     */
    where?: MilestoneWhereInput
    /**
     * Limit how many Milestones to update.
     */
    limit?: number
  }

  /**
   * Milestone updateManyAndReturn
   */
  export type MilestoneUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Milestone
     */
    select?: MilestoneSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Milestone
     */
    omit?: MilestoneOmit<ExtArgs> | null
    /**
     * The data used to update Milestones.
     */
    data: XOR<MilestoneUpdateManyMutationInput, MilestoneUncheckedUpdateManyInput>
    /**
     * Filter which Milestones to update
     */
    where?: MilestoneWhereInput
    /**
     * Limit how many Milestones to update.
     */
    limit?: number
  }

  /**
   * Milestone upsert
   */
  export type MilestoneUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Milestone
     */
    select?: MilestoneSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Milestone
     */
    omit?: MilestoneOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MilestoneInclude<ExtArgs> | null
    /**
     * The filter to search for the Milestone to update in case it exists.
     */
    where: MilestoneWhereUniqueInput
    /**
     * In case the Milestone found by the `where` argument doesn't exist, create a new Milestone with this data.
     */
    create: XOR<MilestoneCreateInput, MilestoneUncheckedCreateInput>
    /**
     * In case the Milestone was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MilestoneUpdateInput, MilestoneUncheckedUpdateInput>
  }

  /**
   * Milestone delete
   */
  export type MilestoneDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Milestone
     */
    select?: MilestoneSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Milestone
     */
    omit?: MilestoneOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MilestoneInclude<ExtArgs> | null
    /**
     * Filter which Milestone to delete.
     */
    where: MilestoneWhereUniqueInput
  }

  /**
   * Milestone deleteMany
   */
  export type MilestoneDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Milestones to delete
     */
    where?: MilestoneWhereInput
    /**
     * Limit how many Milestones to delete.
     */
    limit?: number
  }

  /**
   * Milestone.progress
   */
  export type Milestone$progressArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserMilestoneProgress
     */
    select?: UserMilestoneProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserMilestoneProgress
     */
    omit?: UserMilestoneProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserMilestoneProgressInclude<ExtArgs> | null
    where?: UserMilestoneProgressWhereInput
    orderBy?: UserMilestoneProgressOrderByWithRelationInput | UserMilestoneProgressOrderByWithRelationInput[]
    cursor?: UserMilestoneProgressWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserMilestoneProgressScalarFieldEnum | UserMilestoneProgressScalarFieldEnum[]
  }

  /**
   * Milestone without action
   */
  export type MilestoneDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Milestone
     */
    select?: MilestoneSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Milestone
     */
    omit?: MilestoneOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MilestoneInclude<ExtArgs> | null
  }


  /**
   * Model UserMilestoneProgress
   */

  export type AggregateUserMilestoneProgress = {
    _count: UserMilestoneProgressCountAggregateOutputType | null
    _min: UserMilestoneProgressMinAggregateOutputType | null
    _max: UserMilestoneProgressMaxAggregateOutputType | null
  }

  export type UserMilestoneProgressMinAggregateOutputType = {
    id: string | null
    userId: string | null
    milestoneId: string | null
    cleared: boolean | null
    notes: string | null
    updatedAt: Date | null
  }

  export type UserMilestoneProgressMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    milestoneId: string | null
    cleared: boolean | null
    notes: string | null
    updatedAt: Date | null
  }

  export type UserMilestoneProgressCountAggregateOutputType = {
    id: number
    userId: number
    milestoneId: number
    cleared: number
    notes: number
    updatedAt: number
    _all: number
  }


  export type UserMilestoneProgressMinAggregateInputType = {
    id?: true
    userId?: true
    milestoneId?: true
    cleared?: true
    notes?: true
    updatedAt?: true
  }

  export type UserMilestoneProgressMaxAggregateInputType = {
    id?: true
    userId?: true
    milestoneId?: true
    cleared?: true
    notes?: true
    updatedAt?: true
  }

  export type UserMilestoneProgressCountAggregateInputType = {
    id?: true
    userId?: true
    milestoneId?: true
    cleared?: true
    notes?: true
    updatedAt?: true
    _all?: true
  }

  export type UserMilestoneProgressAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserMilestoneProgress to aggregate.
     */
    where?: UserMilestoneProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserMilestoneProgresses to fetch.
     */
    orderBy?: UserMilestoneProgressOrderByWithRelationInput | UserMilestoneProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserMilestoneProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserMilestoneProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserMilestoneProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserMilestoneProgresses
    **/
    _count?: true | UserMilestoneProgressCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMilestoneProgressMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMilestoneProgressMaxAggregateInputType
  }

  export type GetUserMilestoneProgressAggregateType<T extends UserMilestoneProgressAggregateArgs> = {
        [P in keyof T & keyof AggregateUserMilestoneProgress]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserMilestoneProgress[P]>
      : GetScalarType<T[P], AggregateUserMilestoneProgress[P]>
  }




  export type UserMilestoneProgressGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserMilestoneProgressWhereInput
    orderBy?: UserMilestoneProgressOrderByWithAggregationInput | UserMilestoneProgressOrderByWithAggregationInput[]
    by: UserMilestoneProgressScalarFieldEnum[] | UserMilestoneProgressScalarFieldEnum
    having?: UserMilestoneProgressScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserMilestoneProgressCountAggregateInputType | true
    _min?: UserMilestoneProgressMinAggregateInputType
    _max?: UserMilestoneProgressMaxAggregateInputType
  }

  export type UserMilestoneProgressGroupByOutputType = {
    id: string
    userId: string
    milestoneId: string
    cleared: boolean
    notes: string | null
    updatedAt: Date
    _count: UserMilestoneProgressCountAggregateOutputType | null
    _min: UserMilestoneProgressMinAggregateOutputType | null
    _max: UserMilestoneProgressMaxAggregateOutputType | null
  }

  type GetUserMilestoneProgressGroupByPayload<T extends UserMilestoneProgressGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserMilestoneProgressGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserMilestoneProgressGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserMilestoneProgressGroupByOutputType[P]>
            : GetScalarType<T[P], UserMilestoneProgressGroupByOutputType[P]>
        }
      >
    >


  export type UserMilestoneProgressSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    milestoneId?: boolean
    cleared?: boolean
    notes?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    milestone?: boolean | MilestoneDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userMilestoneProgress"]>

  export type UserMilestoneProgressSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    milestoneId?: boolean
    cleared?: boolean
    notes?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    milestone?: boolean | MilestoneDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userMilestoneProgress"]>

  export type UserMilestoneProgressSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    milestoneId?: boolean
    cleared?: boolean
    notes?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    milestone?: boolean | MilestoneDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userMilestoneProgress"]>

  export type UserMilestoneProgressSelectScalar = {
    id?: boolean
    userId?: boolean
    milestoneId?: boolean
    cleared?: boolean
    notes?: boolean
    updatedAt?: boolean
  }

  export type UserMilestoneProgressOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "milestoneId" | "cleared" | "notes" | "updatedAt", ExtArgs["result"]["userMilestoneProgress"]>
  export type UserMilestoneProgressInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    milestone?: boolean | MilestoneDefaultArgs<ExtArgs>
  }
  export type UserMilestoneProgressIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    milestone?: boolean | MilestoneDefaultArgs<ExtArgs>
  }
  export type UserMilestoneProgressIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    milestone?: boolean | MilestoneDefaultArgs<ExtArgs>
  }

  export type $UserMilestoneProgressPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserMilestoneProgress"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      milestone: Prisma.$MilestonePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      milestoneId: string
      cleared: boolean
      notes: string | null
      updatedAt: Date
    }, ExtArgs["result"]["userMilestoneProgress"]>
    composites: {}
  }

  type UserMilestoneProgressGetPayload<S extends boolean | null | undefined | UserMilestoneProgressDefaultArgs> = $Result.GetResult<Prisma.$UserMilestoneProgressPayload, S>

  type UserMilestoneProgressCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserMilestoneProgressFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserMilestoneProgressCountAggregateInputType | true
    }

  export interface UserMilestoneProgressDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserMilestoneProgress'], meta: { name: 'UserMilestoneProgress' } }
    /**
     * Find zero or one UserMilestoneProgress that matches the filter.
     * @param {UserMilestoneProgressFindUniqueArgs} args - Arguments to find a UserMilestoneProgress
     * @example
     * // Get one UserMilestoneProgress
     * const userMilestoneProgress = await prisma.userMilestoneProgress.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserMilestoneProgressFindUniqueArgs>(args: SelectSubset<T, UserMilestoneProgressFindUniqueArgs<ExtArgs>>): Prisma__UserMilestoneProgressClient<$Result.GetResult<Prisma.$UserMilestoneProgressPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserMilestoneProgress that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserMilestoneProgressFindUniqueOrThrowArgs} args - Arguments to find a UserMilestoneProgress
     * @example
     * // Get one UserMilestoneProgress
     * const userMilestoneProgress = await prisma.userMilestoneProgress.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserMilestoneProgressFindUniqueOrThrowArgs>(args: SelectSubset<T, UserMilestoneProgressFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserMilestoneProgressClient<$Result.GetResult<Prisma.$UserMilestoneProgressPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserMilestoneProgress that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserMilestoneProgressFindFirstArgs} args - Arguments to find a UserMilestoneProgress
     * @example
     * // Get one UserMilestoneProgress
     * const userMilestoneProgress = await prisma.userMilestoneProgress.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserMilestoneProgressFindFirstArgs>(args?: SelectSubset<T, UserMilestoneProgressFindFirstArgs<ExtArgs>>): Prisma__UserMilestoneProgressClient<$Result.GetResult<Prisma.$UserMilestoneProgressPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserMilestoneProgress that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserMilestoneProgressFindFirstOrThrowArgs} args - Arguments to find a UserMilestoneProgress
     * @example
     * // Get one UserMilestoneProgress
     * const userMilestoneProgress = await prisma.userMilestoneProgress.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserMilestoneProgressFindFirstOrThrowArgs>(args?: SelectSubset<T, UserMilestoneProgressFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserMilestoneProgressClient<$Result.GetResult<Prisma.$UserMilestoneProgressPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserMilestoneProgresses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserMilestoneProgressFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserMilestoneProgresses
     * const userMilestoneProgresses = await prisma.userMilestoneProgress.findMany()
     * 
     * // Get first 10 UserMilestoneProgresses
     * const userMilestoneProgresses = await prisma.userMilestoneProgress.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userMilestoneProgressWithIdOnly = await prisma.userMilestoneProgress.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserMilestoneProgressFindManyArgs>(args?: SelectSubset<T, UserMilestoneProgressFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserMilestoneProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserMilestoneProgress.
     * @param {UserMilestoneProgressCreateArgs} args - Arguments to create a UserMilestoneProgress.
     * @example
     * // Create one UserMilestoneProgress
     * const UserMilestoneProgress = await prisma.userMilestoneProgress.create({
     *   data: {
     *     // ... data to create a UserMilestoneProgress
     *   }
     * })
     * 
     */
    create<T extends UserMilestoneProgressCreateArgs>(args: SelectSubset<T, UserMilestoneProgressCreateArgs<ExtArgs>>): Prisma__UserMilestoneProgressClient<$Result.GetResult<Prisma.$UserMilestoneProgressPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserMilestoneProgresses.
     * @param {UserMilestoneProgressCreateManyArgs} args - Arguments to create many UserMilestoneProgresses.
     * @example
     * // Create many UserMilestoneProgresses
     * const userMilestoneProgress = await prisma.userMilestoneProgress.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserMilestoneProgressCreateManyArgs>(args?: SelectSubset<T, UserMilestoneProgressCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserMilestoneProgresses and returns the data saved in the database.
     * @param {UserMilestoneProgressCreateManyAndReturnArgs} args - Arguments to create many UserMilestoneProgresses.
     * @example
     * // Create many UserMilestoneProgresses
     * const userMilestoneProgress = await prisma.userMilestoneProgress.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserMilestoneProgresses and only return the `id`
     * const userMilestoneProgressWithIdOnly = await prisma.userMilestoneProgress.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserMilestoneProgressCreateManyAndReturnArgs>(args?: SelectSubset<T, UserMilestoneProgressCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserMilestoneProgressPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserMilestoneProgress.
     * @param {UserMilestoneProgressDeleteArgs} args - Arguments to delete one UserMilestoneProgress.
     * @example
     * // Delete one UserMilestoneProgress
     * const UserMilestoneProgress = await prisma.userMilestoneProgress.delete({
     *   where: {
     *     // ... filter to delete one UserMilestoneProgress
     *   }
     * })
     * 
     */
    delete<T extends UserMilestoneProgressDeleteArgs>(args: SelectSubset<T, UserMilestoneProgressDeleteArgs<ExtArgs>>): Prisma__UserMilestoneProgressClient<$Result.GetResult<Prisma.$UserMilestoneProgressPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserMilestoneProgress.
     * @param {UserMilestoneProgressUpdateArgs} args - Arguments to update one UserMilestoneProgress.
     * @example
     * // Update one UserMilestoneProgress
     * const userMilestoneProgress = await prisma.userMilestoneProgress.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserMilestoneProgressUpdateArgs>(args: SelectSubset<T, UserMilestoneProgressUpdateArgs<ExtArgs>>): Prisma__UserMilestoneProgressClient<$Result.GetResult<Prisma.$UserMilestoneProgressPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserMilestoneProgresses.
     * @param {UserMilestoneProgressDeleteManyArgs} args - Arguments to filter UserMilestoneProgresses to delete.
     * @example
     * // Delete a few UserMilestoneProgresses
     * const { count } = await prisma.userMilestoneProgress.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserMilestoneProgressDeleteManyArgs>(args?: SelectSubset<T, UserMilestoneProgressDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserMilestoneProgresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserMilestoneProgressUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserMilestoneProgresses
     * const userMilestoneProgress = await prisma.userMilestoneProgress.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserMilestoneProgressUpdateManyArgs>(args: SelectSubset<T, UserMilestoneProgressUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserMilestoneProgresses and returns the data updated in the database.
     * @param {UserMilestoneProgressUpdateManyAndReturnArgs} args - Arguments to update many UserMilestoneProgresses.
     * @example
     * // Update many UserMilestoneProgresses
     * const userMilestoneProgress = await prisma.userMilestoneProgress.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserMilestoneProgresses and only return the `id`
     * const userMilestoneProgressWithIdOnly = await prisma.userMilestoneProgress.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserMilestoneProgressUpdateManyAndReturnArgs>(args: SelectSubset<T, UserMilestoneProgressUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserMilestoneProgressPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserMilestoneProgress.
     * @param {UserMilestoneProgressUpsertArgs} args - Arguments to update or create a UserMilestoneProgress.
     * @example
     * // Update or create a UserMilestoneProgress
     * const userMilestoneProgress = await prisma.userMilestoneProgress.upsert({
     *   create: {
     *     // ... data to create a UserMilestoneProgress
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserMilestoneProgress we want to update
     *   }
     * })
     */
    upsert<T extends UserMilestoneProgressUpsertArgs>(args: SelectSubset<T, UserMilestoneProgressUpsertArgs<ExtArgs>>): Prisma__UserMilestoneProgressClient<$Result.GetResult<Prisma.$UserMilestoneProgressPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserMilestoneProgresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserMilestoneProgressCountArgs} args - Arguments to filter UserMilestoneProgresses to count.
     * @example
     * // Count the number of UserMilestoneProgresses
     * const count = await prisma.userMilestoneProgress.count({
     *   where: {
     *     // ... the filter for the UserMilestoneProgresses we want to count
     *   }
     * })
    **/
    count<T extends UserMilestoneProgressCountArgs>(
      args?: Subset<T, UserMilestoneProgressCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserMilestoneProgressCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserMilestoneProgress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserMilestoneProgressAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserMilestoneProgressAggregateArgs>(args: Subset<T, UserMilestoneProgressAggregateArgs>): Prisma.PrismaPromise<GetUserMilestoneProgressAggregateType<T>>

    /**
     * Group by UserMilestoneProgress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserMilestoneProgressGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserMilestoneProgressGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserMilestoneProgressGroupByArgs['orderBy'] }
        : { orderBy?: UserMilestoneProgressGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserMilestoneProgressGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserMilestoneProgressGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserMilestoneProgress model
   */
  readonly fields: UserMilestoneProgressFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserMilestoneProgress.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserMilestoneProgressClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    milestone<T extends MilestoneDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MilestoneDefaultArgs<ExtArgs>>): Prisma__MilestoneClient<$Result.GetResult<Prisma.$MilestonePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserMilestoneProgress model
   */
  interface UserMilestoneProgressFieldRefs {
    readonly id: FieldRef<"UserMilestoneProgress", 'String'>
    readonly userId: FieldRef<"UserMilestoneProgress", 'String'>
    readonly milestoneId: FieldRef<"UserMilestoneProgress", 'String'>
    readonly cleared: FieldRef<"UserMilestoneProgress", 'Boolean'>
    readonly notes: FieldRef<"UserMilestoneProgress", 'String'>
    readonly updatedAt: FieldRef<"UserMilestoneProgress", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserMilestoneProgress findUnique
   */
  export type UserMilestoneProgressFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserMilestoneProgress
     */
    select?: UserMilestoneProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserMilestoneProgress
     */
    omit?: UserMilestoneProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserMilestoneProgressInclude<ExtArgs> | null
    /**
     * Filter, which UserMilestoneProgress to fetch.
     */
    where: UserMilestoneProgressWhereUniqueInput
  }

  /**
   * UserMilestoneProgress findUniqueOrThrow
   */
  export type UserMilestoneProgressFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserMilestoneProgress
     */
    select?: UserMilestoneProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserMilestoneProgress
     */
    omit?: UserMilestoneProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserMilestoneProgressInclude<ExtArgs> | null
    /**
     * Filter, which UserMilestoneProgress to fetch.
     */
    where: UserMilestoneProgressWhereUniqueInput
  }

  /**
   * UserMilestoneProgress findFirst
   */
  export type UserMilestoneProgressFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserMilestoneProgress
     */
    select?: UserMilestoneProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserMilestoneProgress
     */
    omit?: UserMilestoneProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserMilestoneProgressInclude<ExtArgs> | null
    /**
     * Filter, which UserMilestoneProgress to fetch.
     */
    where?: UserMilestoneProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserMilestoneProgresses to fetch.
     */
    orderBy?: UserMilestoneProgressOrderByWithRelationInput | UserMilestoneProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserMilestoneProgresses.
     */
    cursor?: UserMilestoneProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserMilestoneProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserMilestoneProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserMilestoneProgresses.
     */
    distinct?: UserMilestoneProgressScalarFieldEnum | UserMilestoneProgressScalarFieldEnum[]
  }

  /**
   * UserMilestoneProgress findFirstOrThrow
   */
  export type UserMilestoneProgressFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserMilestoneProgress
     */
    select?: UserMilestoneProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserMilestoneProgress
     */
    omit?: UserMilestoneProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserMilestoneProgressInclude<ExtArgs> | null
    /**
     * Filter, which UserMilestoneProgress to fetch.
     */
    where?: UserMilestoneProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserMilestoneProgresses to fetch.
     */
    orderBy?: UserMilestoneProgressOrderByWithRelationInput | UserMilestoneProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserMilestoneProgresses.
     */
    cursor?: UserMilestoneProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserMilestoneProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserMilestoneProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserMilestoneProgresses.
     */
    distinct?: UserMilestoneProgressScalarFieldEnum | UserMilestoneProgressScalarFieldEnum[]
  }

  /**
   * UserMilestoneProgress findMany
   */
  export type UserMilestoneProgressFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserMilestoneProgress
     */
    select?: UserMilestoneProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserMilestoneProgress
     */
    omit?: UserMilestoneProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserMilestoneProgressInclude<ExtArgs> | null
    /**
     * Filter, which UserMilestoneProgresses to fetch.
     */
    where?: UserMilestoneProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserMilestoneProgresses to fetch.
     */
    orderBy?: UserMilestoneProgressOrderByWithRelationInput | UserMilestoneProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserMilestoneProgresses.
     */
    cursor?: UserMilestoneProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserMilestoneProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserMilestoneProgresses.
     */
    skip?: number
    distinct?: UserMilestoneProgressScalarFieldEnum | UserMilestoneProgressScalarFieldEnum[]
  }

  /**
   * UserMilestoneProgress create
   */
  export type UserMilestoneProgressCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserMilestoneProgress
     */
    select?: UserMilestoneProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserMilestoneProgress
     */
    omit?: UserMilestoneProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserMilestoneProgressInclude<ExtArgs> | null
    /**
     * The data needed to create a UserMilestoneProgress.
     */
    data: XOR<UserMilestoneProgressCreateInput, UserMilestoneProgressUncheckedCreateInput>
  }

  /**
   * UserMilestoneProgress createMany
   */
  export type UserMilestoneProgressCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserMilestoneProgresses.
     */
    data: UserMilestoneProgressCreateManyInput | UserMilestoneProgressCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserMilestoneProgress createManyAndReturn
   */
  export type UserMilestoneProgressCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserMilestoneProgress
     */
    select?: UserMilestoneProgressSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserMilestoneProgress
     */
    omit?: UserMilestoneProgressOmit<ExtArgs> | null
    /**
     * The data used to create many UserMilestoneProgresses.
     */
    data: UserMilestoneProgressCreateManyInput | UserMilestoneProgressCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserMilestoneProgressIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserMilestoneProgress update
   */
  export type UserMilestoneProgressUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserMilestoneProgress
     */
    select?: UserMilestoneProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserMilestoneProgress
     */
    omit?: UserMilestoneProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserMilestoneProgressInclude<ExtArgs> | null
    /**
     * The data needed to update a UserMilestoneProgress.
     */
    data: XOR<UserMilestoneProgressUpdateInput, UserMilestoneProgressUncheckedUpdateInput>
    /**
     * Choose, which UserMilestoneProgress to update.
     */
    where: UserMilestoneProgressWhereUniqueInput
  }

  /**
   * UserMilestoneProgress updateMany
   */
  export type UserMilestoneProgressUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserMilestoneProgresses.
     */
    data: XOR<UserMilestoneProgressUpdateManyMutationInput, UserMilestoneProgressUncheckedUpdateManyInput>
    /**
     * Filter which UserMilestoneProgresses to update
     */
    where?: UserMilestoneProgressWhereInput
    /**
     * Limit how many UserMilestoneProgresses to update.
     */
    limit?: number
  }

  /**
   * UserMilestoneProgress updateManyAndReturn
   */
  export type UserMilestoneProgressUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserMilestoneProgress
     */
    select?: UserMilestoneProgressSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserMilestoneProgress
     */
    omit?: UserMilestoneProgressOmit<ExtArgs> | null
    /**
     * The data used to update UserMilestoneProgresses.
     */
    data: XOR<UserMilestoneProgressUpdateManyMutationInput, UserMilestoneProgressUncheckedUpdateManyInput>
    /**
     * Filter which UserMilestoneProgresses to update
     */
    where?: UserMilestoneProgressWhereInput
    /**
     * Limit how many UserMilestoneProgresses to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserMilestoneProgressIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserMilestoneProgress upsert
   */
  export type UserMilestoneProgressUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserMilestoneProgress
     */
    select?: UserMilestoneProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserMilestoneProgress
     */
    omit?: UserMilestoneProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserMilestoneProgressInclude<ExtArgs> | null
    /**
     * The filter to search for the UserMilestoneProgress to update in case it exists.
     */
    where: UserMilestoneProgressWhereUniqueInput
    /**
     * In case the UserMilestoneProgress found by the `where` argument doesn't exist, create a new UserMilestoneProgress with this data.
     */
    create: XOR<UserMilestoneProgressCreateInput, UserMilestoneProgressUncheckedCreateInput>
    /**
     * In case the UserMilestoneProgress was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserMilestoneProgressUpdateInput, UserMilestoneProgressUncheckedUpdateInput>
  }

  /**
   * UserMilestoneProgress delete
   */
  export type UserMilestoneProgressDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserMilestoneProgress
     */
    select?: UserMilestoneProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserMilestoneProgress
     */
    omit?: UserMilestoneProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserMilestoneProgressInclude<ExtArgs> | null
    /**
     * Filter which UserMilestoneProgress to delete.
     */
    where: UserMilestoneProgressWhereUniqueInput
  }

  /**
   * UserMilestoneProgress deleteMany
   */
  export type UserMilestoneProgressDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserMilestoneProgresses to delete
     */
    where?: UserMilestoneProgressWhereInput
    /**
     * Limit how many UserMilestoneProgresses to delete.
     */
    limit?: number
  }

  /**
   * UserMilestoneProgress without action
   */
  export type UserMilestoneProgressDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserMilestoneProgress
     */
    select?: UserMilestoneProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserMilestoneProgress
     */
    omit?: UserMilestoneProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserMilestoneProgressInclude<ExtArgs> | null
  }


  /**
   * Model UserCatclawProgress
   */

  export type AggregateUserCatclawProgress = {
    _count: UserCatclawProgressCountAggregateOutputType | null
    _min: UserCatclawProgressMinAggregateOutputType | null
    _max: UserCatclawProgressMaxAggregateOutputType | null
  }

  export type UserCatclawProgressMinAggregateOutputType = {
    id: string | null
    userId: string | null
    currentRank: string | null
    bestRank: string | null
    notes: string | null
    updatedAt: Date | null
  }

  export type UserCatclawProgressMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    currentRank: string | null
    bestRank: string | null
    notes: string | null
    updatedAt: Date | null
  }

  export type UserCatclawProgressCountAggregateOutputType = {
    id: number
    userId: number
    currentRank: number
    bestRank: number
    notes: number
    updatedAt: number
    _all: number
  }


  export type UserCatclawProgressMinAggregateInputType = {
    id?: true
    userId?: true
    currentRank?: true
    bestRank?: true
    notes?: true
    updatedAt?: true
  }

  export type UserCatclawProgressMaxAggregateInputType = {
    id?: true
    userId?: true
    currentRank?: true
    bestRank?: true
    notes?: true
    updatedAt?: true
  }

  export type UserCatclawProgressCountAggregateInputType = {
    id?: true
    userId?: true
    currentRank?: true
    bestRank?: true
    notes?: true
    updatedAt?: true
    _all?: true
  }

  export type UserCatclawProgressAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserCatclawProgress to aggregate.
     */
    where?: UserCatclawProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserCatclawProgresses to fetch.
     */
    orderBy?: UserCatclawProgressOrderByWithRelationInput | UserCatclawProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserCatclawProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserCatclawProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserCatclawProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserCatclawProgresses
    **/
    _count?: true | UserCatclawProgressCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserCatclawProgressMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserCatclawProgressMaxAggregateInputType
  }

  export type GetUserCatclawProgressAggregateType<T extends UserCatclawProgressAggregateArgs> = {
        [P in keyof T & keyof AggregateUserCatclawProgress]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserCatclawProgress[P]>
      : GetScalarType<T[P], AggregateUserCatclawProgress[P]>
  }




  export type UserCatclawProgressGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserCatclawProgressWhereInput
    orderBy?: UserCatclawProgressOrderByWithAggregationInput | UserCatclawProgressOrderByWithAggregationInput[]
    by: UserCatclawProgressScalarFieldEnum[] | UserCatclawProgressScalarFieldEnum
    having?: UserCatclawProgressScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCatclawProgressCountAggregateInputType | true
    _min?: UserCatclawProgressMinAggregateInputType
    _max?: UserCatclawProgressMaxAggregateInputType
  }

  export type UserCatclawProgressGroupByOutputType = {
    id: string
    userId: string
    currentRank: string | null
    bestRank: string | null
    notes: string | null
    updatedAt: Date
    _count: UserCatclawProgressCountAggregateOutputType | null
    _min: UserCatclawProgressMinAggregateOutputType | null
    _max: UserCatclawProgressMaxAggregateOutputType | null
  }

  type GetUserCatclawProgressGroupByPayload<T extends UserCatclawProgressGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserCatclawProgressGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserCatclawProgressGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserCatclawProgressGroupByOutputType[P]>
            : GetScalarType<T[P], UserCatclawProgressGroupByOutputType[P]>
        }
      >
    >


  export type UserCatclawProgressSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    currentRank?: boolean
    bestRank?: boolean
    notes?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userCatclawProgress"]>

  export type UserCatclawProgressSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    currentRank?: boolean
    bestRank?: boolean
    notes?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userCatclawProgress"]>

  export type UserCatclawProgressSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    currentRank?: boolean
    bestRank?: boolean
    notes?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userCatclawProgress"]>

  export type UserCatclawProgressSelectScalar = {
    id?: boolean
    userId?: boolean
    currentRank?: boolean
    bestRank?: boolean
    notes?: boolean
    updatedAt?: boolean
  }

  export type UserCatclawProgressOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "currentRank" | "bestRank" | "notes" | "updatedAt", ExtArgs["result"]["userCatclawProgress"]>
  export type UserCatclawProgressInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type UserCatclawProgressIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type UserCatclawProgressIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $UserCatclawProgressPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserCatclawProgress"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      currentRank: string | null
      bestRank: string | null
      notes: string | null
      updatedAt: Date
    }, ExtArgs["result"]["userCatclawProgress"]>
    composites: {}
  }

  type UserCatclawProgressGetPayload<S extends boolean | null | undefined | UserCatclawProgressDefaultArgs> = $Result.GetResult<Prisma.$UserCatclawProgressPayload, S>

  type UserCatclawProgressCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserCatclawProgressFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCatclawProgressCountAggregateInputType | true
    }

  export interface UserCatclawProgressDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserCatclawProgress'], meta: { name: 'UserCatclawProgress' } }
    /**
     * Find zero or one UserCatclawProgress that matches the filter.
     * @param {UserCatclawProgressFindUniqueArgs} args - Arguments to find a UserCatclawProgress
     * @example
     * // Get one UserCatclawProgress
     * const userCatclawProgress = await prisma.userCatclawProgress.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserCatclawProgressFindUniqueArgs>(args: SelectSubset<T, UserCatclawProgressFindUniqueArgs<ExtArgs>>): Prisma__UserCatclawProgressClient<$Result.GetResult<Prisma.$UserCatclawProgressPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserCatclawProgress that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserCatclawProgressFindUniqueOrThrowArgs} args - Arguments to find a UserCatclawProgress
     * @example
     * // Get one UserCatclawProgress
     * const userCatclawProgress = await prisma.userCatclawProgress.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserCatclawProgressFindUniqueOrThrowArgs>(args: SelectSubset<T, UserCatclawProgressFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserCatclawProgressClient<$Result.GetResult<Prisma.$UserCatclawProgressPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserCatclawProgress that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCatclawProgressFindFirstArgs} args - Arguments to find a UserCatclawProgress
     * @example
     * // Get one UserCatclawProgress
     * const userCatclawProgress = await prisma.userCatclawProgress.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserCatclawProgressFindFirstArgs>(args?: SelectSubset<T, UserCatclawProgressFindFirstArgs<ExtArgs>>): Prisma__UserCatclawProgressClient<$Result.GetResult<Prisma.$UserCatclawProgressPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserCatclawProgress that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCatclawProgressFindFirstOrThrowArgs} args - Arguments to find a UserCatclawProgress
     * @example
     * // Get one UserCatclawProgress
     * const userCatclawProgress = await prisma.userCatclawProgress.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserCatclawProgressFindFirstOrThrowArgs>(args?: SelectSubset<T, UserCatclawProgressFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserCatclawProgressClient<$Result.GetResult<Prisma.$UserCatclawProgressPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserCatclawProgresses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCatclawProgressFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserCatclawProgresses
     * const userCatclawProgresses = await prisma.userCatclawProgress.findMany()
     * 
     * // Get first 10 UserCatclawProgresses
     * const userCatclawProgresses = await prisma.userCatclawProgress.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userCatclawProgressWithIdOnly = await prisma.userCatclawProgress.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserCatclawProgressFindManyArgs>(args?: SelectSubset<T, UserCatclawProgressFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserCatclawProgressPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserCatclawProgress.
     * @param {UserCatclawProgressCreateArgs} args - Arguments to create a UserCatclawProgress.
     * @example
     * // Create one UserCatclawProgress
     * const UserCatclawProgress = await prisma.userCatclawProgress.create({
     *   data: {
     *     // ... data to create a UserCatclawProgress
     *   }
     * })
     * 
     */
    create<T extends UserCatclawProgressCreateArgs>(args: SelectSubset<T, UserCatclawProgressCreateArgs<ExtArgs>>): Prisma__UserCatclawProgressClient<$Result.GetResult<Prisma.$UserCatclawProgressPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserCatclawProgresses.
     * @param {UserCatclawProgressCreateManyArgs} args - Arguments to create many UserCatclawProgresses.
     * @example
     * // Create many UserCatclawProgresses
     * const userCatclawProgress = await prisma.userCatclawProgress.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCatclawProgressCreateManyArgs>(args?: SelectSubset<T, UserCatclawProgressCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserCatclawProgresses and returns the data saved in the database.
     * @param {UserCatclawProgressCreateManyAndReturnArgs} args - Arguments to create many UserCatclawProgresses.
     * @example
     * // Create many UserCatclawProgresses
     * const userCatclawProgress = await prisma.userCatclawProgress.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserCatclawProgresses and only return the `id`
     * const userCatclawProgressWithIdOnly = await prisma.userCatclawProgress.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCatclawProgressCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCatclawProgressCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserCatclawProgressPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserCatclawProgress.
     * @param {UserCatclawProgressDeleteArgs} args - Arguments to delete one UserCatclawProgress.
     * @example
     * // Delete one UserCatclawProgress
     * const UserCatclawProgress = await prisma.userCatclawProgress.delete({
     *   where: {
     *     // ... filter to delete one UserCatclawProgress
     *   }
     * })
     * 
     */
    delete<T extends UserCatclawProgressDeleteArgs>(args: SelectSubset<T, UserCatclawProgressDeleteArgs<ExtArgs>>): Prisma__UserCatclawProgressClient<$Result.GetResult<Prisma.$UserCatclawProgressPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserCatclawProgress.
     * @param {UserCatclawProgressUpdateArgs} args - Arguments to update one UserCatclawProgress.
     * @example
     * // Update one UserCatclawProgress
     * const userCatclawProgress = await prisma.userCatclawProgress.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserCatclawProgressUpdateArgs>(args: SelectSubset<T, UserCatclawProgressUpdateArgs<ExtArgs>>): Prisma__UserCatclawProgressClient<$Result.GetResult<Prisma.$UserCatclawProgressPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserCatclawProgresses.
     * @param {UserCatclawProgressDeleteManyArgs} args - Arguments to filter UserCatclawProgresses to delete.
     * @example
     * // Delete a few UserCatclawProgresses
     * const { count } = await prisma.userCatclawProgress.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserCatclawProgressDeleteManyArgs>(args?: SelectSubset<T, UserCatclawProgressDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserCatclawProgresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCatclawProgressUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserCatclawProgresses
     * const userCatclawProgress = await prisma.userCatclawProgress.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserCatclawProgressUpdateManyArgs>(args: SelectSubset<T, UserCatclawProgressUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserCatclawProgresses and returns the data updated in the database.
     * @param {UserCatclawProgressUpdateManyAndReturnArgs} args - Arguments to update many UserCatclawProgresses.
     * @example
     * // Update many UserCatclawProgresses
     * const userCatclawProgress = await prisma.userCatclawProgress.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserCatclawProgresses and only return the `id`
     * const userCatclawProgressWithIdOnly = await prisma.userCatclawProgress.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserCatclawProgressUpdateManyAndReturnArgs>(args: SelectSubset<T, UserCatclawProgressUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserCatclawProgressPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserCatclawProgress.
     * @param {UserCatclawProgressUpsertArgs} args - Arguments to update or create a UserCatclawProgress.
     * @example
     * // Update or create a UserCatclawProgress
     * const userCatclawProgress = await prisma.userCatclawProgress.upsert({
     *   create: {
     *     // ... data to create a UserCatclawProgress
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserCatclawProgress we want to update
     *   }
     * })
     */
    upsert<T extends UserCatclawProgressUpsertArgs>(args: SelectSubset<T, UserCatclawProgressUpsertArgs<ExtArgs>>): Prisma__UserCatclawProgressClient<$Result.GetResult<Prisma.$UserCatclawProgressPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserCatclawProgresses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCatclawProgressCountArgs} args - Arguments to filter UserCatclawProgresses to count.
     * @example
     * // Count the number of UserCatclawProgresses
     * const count = await prisma.userCatclawProgress.count({
     *   where: {
     *     // ... the filter for the UserCatclawProgresses we want to count
     *   }
     * })
    **/
    count<T extends UserCatclawProgressCountArgs>(
      args?: Subset<T, UserCatclawProgressCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCatclawProgressCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserCatclawProgress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCatclawProgressAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserCatclawProgressAggregateArgs>(args: Subset<T, UserCatclawProgressAggregateArgs>): Prisma.PrismaPromise<GetUserCatclawProgressAggregateType<T>>

    /**
     * Group by UserCatclawProgress.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCatclawProgressGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserCatclawProgressGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserCatclawProgressGroupByArgs['orderBy'] }
        : { orderBy?: UserCatclawProgressGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserCatclawProgressGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserCatclawProgressGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserCatclawProgress model
   */
  readonly fields: UserCatclawProgressFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserCatclawProgress.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserCatclawProgressClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserCatclawProgress model
   */
  interface UserCatclawProgressFieldRefs {
    readonly id: FieldRef<"UserCatclawProgress", 'String'>
    readonly userId: FieldRef<"UserCatclawProgress", 'String'>
    readonly currentRank: FieldRef<"UserCatclawProgress", 'String'>
    readonly bestRank: FieldRef<"UserCatclawProgress", 'String'>
    readonly notes: FieldRef<"UserCatclawProgress", 'String'>
    readonly updatedAt: FieldRef<"UserCatclawProgress", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserCatclawProgress findUnique
   */
  export type UserCatclawProgressFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCatclawProgress
     */
    select?: UserCatclawProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCatclawProgress
     */
    omit?: UserCatclawProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserCatclawProgressInclude<ExtArgs> | null
    /**
     * Filter, which UserCatclawProgress to fetch.
     */
    where: UserCatclawProgressWhereUniqueInput
  }

  /**
   * UserCatclawProgress findUniqueOrThrow
   */
  export type UserCatclawProgressFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCatclawProgress
     */
    select?: UserCatclawProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCatclawProgress
     */
    omit?: UserCatclawProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserCatclawProgressInclude<ExtArgs> | null
    /**
     * Filter, which UserCatclawProgress to fetch.
     */
    where: UserCatclawProgressWhereUniqueInput
  }

  /**
   * UserCatclawProgress findFirst
   */
  export type UserCatclawProgressFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCatclawProgress
     */
    select?: UserCatclawProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCatclawProgress
     */
    omit?: UserCatclawProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserCatclawProgressInclude<ExtArgs> | null
    /**
     * Filter, which UserCatclawProgress to fetch.
     */
    where?: UserCatclawProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserCatclawProgresses to fetch.
     */
    orderBy?: UserCatclawProgressOrderByWithRelationInput | UserCatclawProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserCatclawProgresses.
     */
    cursor?: UserCatclawProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserCatclawProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserCatclawProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserCatclawProgresses.
     */
    distinct?: UserCatclawProgressScalarFieldEnum | UserCatclawProgressScalarFieldEnum[]
  }

  /**
   * UserCatclawProgress findFirstOrThrow
   */
  export type UserCatclawProgressFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCatclawProgress
     */
    select?: UserCatclawProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCatclawProgress
     */
    omit?: UserCatclawProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserCatclawProgressInclude<ExtArgs> | null
    /**
     * Filter, which UserCatclawProgress to fetch.
     */
    where?: UserCatclawProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserCatclawProgresses to fetch.
     */
    orderBy?: UserCatclawProgressOrderByWithRelationInput | UserCatclawProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserCatclawProgresses.
     */
    cursor?: UserCatclawProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserCatclawProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserCatclawProgresses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserCatclawProgresses.
     */
    distinct?: UserCatclawProgressScalarFieldEnum | UserCatclawProgressScalarFieldEnum[]
  }

  /**
   * UserCatclawProgress findMany
   */
  export type UserCatclawProgressFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCatclawProgress
     */
    select?: UserCatclawProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCatclawProgress
     */
    omit?: UserCatclawProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserCatclawProgressInclude<ExtArgs> | null
    /**
     * Filter, which UserCatclawProgresses to fetch.
     */
    where?: UserCatclawProgressWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserCatclawProgresses to fetch.
     */
    orderBy?: UserCatclawProgressOrderByWithRelationInput | UserCatclawProgressOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserCatclawProgresses.
     */
    cursor?: UserCatclawProgressWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserCatclawProgresses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserCatclawProgresses.
     */
    skip?: number
    distinct?: UserCatclawProgressScalarFieldEnum | UserCatclawProgressScalarFieldEnum[]
  }

  /**
   * UserCatclawProgress create
   */
  export type UserCatclawProgressCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCatclawProgress
     */
    select?: UserCatclawProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCatclawProgress
     */
    omit?: UserCatclawProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserCatclawProgressInclude<ExtArgs> | null
    /**
     * The data needed to create a UserCatclawProgress.
     */
    data: XOR<UserCatclawProgressCreateInput, UserCatclawProgressUncheckedCreateInput>
  }

  /**
   * UserCatclawProgress createMany
   */
  export type UserCatclawProgressCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserCatclawProgresses.
     */
    data: UserCatclawProgressCreateManyInput | UserCatclawProgressCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserCatclawProgress createManyAndReturn
   */
  export type UserCatclawProgressCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCatclawProgress
     */
    select?: UserCatclawProgressSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserCatclawProgress
     */
    omit?: UserCatclawProgressOmit<ExtArgs> | null
    /**
     * The data used to create many UserCatclawProgresses.
     */
    data: UserCatclawProgressCreateManyInput | UserCatclawProgressCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserCatclawProgressIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserCatclawProgress update
   */
  export type UserCatclawProgressUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCatclawProgress
     */
    select?: UserCatclawProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCatclawProgress
     */
    omit?: UserCatclawProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserCatclawProgressInclude<ExtArgs> | null
    /**
     * The data needed to update a UserCatclawProgress.
     */
    data: XOR<UserCatclawProgressUpdateInput, UserCatclawProgressUncheckedUpdateInput>
    /**
     * Choose, which UserCatclawProgress to update.
     */
    where: UserCatclawProgressWhereUniqueInput
  }

  /**
   * UserCatclawProgress updateMany
   */
  export type UserCatclawProgressUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserCatclawProgresses.
     */
    data: XOR<UserCatclawProgressUpdateManyMutationInput, UserCatclawProgressUncheckedUpdateManyInput>
    /**
     * Filter which UserCatclawProgresses to update
     */
    where?: UserCatclawProgressWhereInput
    /**
     * Limit how many UserCatclawProgresses to update.
     */
    limit?: number
  }

  /**
   * UserCatclawProgress updateManyAndReturn
   */
  export type UserCatclawProgressUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCatclawProgress
     */
    select?: UserCatclawProgressSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserCatclawProgress
     */
    omit?: UserCatclawProgressOmit<ExtArgs> | null
    /**
     * The data used to update UserCatclawProgresses.
     */
    data: XOR<UserCatclawProgressUpdateManyMutationInput, UserCatclawProgressUncheckedUpdateManyInput>
    /**
     * Filter which UserCatclawProgresses to update
     */
    where?: UserCatclawProgressWhereInput
    /**
     * Limit how many UserCatclawProgresses to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserCatclawProgressIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserCatclawProgress upsert
   */
  export type UserCatclawProgressUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCatclawProgress
     */
    select?: UserCatclawProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCatclawProgress
     */
    omit?: UserCatclawProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserCatclawProgressInclude<ExtArgs> | null
    /**
     * The filter to search for the UserCatclawProgress to update in case it exists.
     */
    where: UserCatclawProgressWhereUniqueInput
    /**
     * In case the UserCatclawProgress found by the `where` argument doesn't exist, create a new UserCatclawProgress with this data.
     */
    create: XOR<UserCatclawProgressCreateInput, UserCatclawProgressUncheckedCreateInput>
    /**
     * In case the UserCatclawProgress was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserCatclawProgressUpdateInput, UserCatclawProgressUncheckedUpdateInput>
  }

  /**
   * UserCatclawProgress delete
   */
  export type UserCatclawProgressDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCatclawProgress
     */
    select?: UserCatclawProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCatclawProgress
     */
    omit?: UserCatclawProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserCatclawProgressInclude<ExtArgs> | null
    /**
     * Filter which UserCatclawProgress to delete.
     */
    where: UserCatclawProgressWhereUniqueInput
  }

  /**
   * UserCatclawProgress deleteMany
   */
  export type UserCatclawProgressDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserCatclawProgresses to delete
     */
    where?: UserCatclawProgressWhereInput
    /**
     * Limit how many UserCatclawProgresses to delete.
     */
    limit?: number
  }

  /**
   * UserCatclawProgress without action
   */
  export type UserCatclawProgressDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCatclawProgress
     */
    select?: UserCatclawProgressSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCatclawProgress
     */
    omit?: UserCatclawProgressOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserCatclawProgressInclude<ExtArgs> | null
  }


  /**
   * Model MeowMedal
   */

  export type AggregateMeowMedal = {
    _count: MeowMedalCountAggregateOutputType | null
    _avg: MeowMedalAvgAggregateOutputType | null
    _sum: MeowMedalSumAggregateOutputType | null
    _min: MeowMedalMinAggregateOutputType | null
    _max: MeowMedalMaxAggregateOutputType | null
  }

  export type MeowMedalAvgAggregateOutputType = {
    sortOrder: number | null
  }

  export type MeowMedalSumAggregateOutputType = {
    sortOrder: number | null
  }

  export type MeowMedalMinAggregateOutputType = {
    id: string | null
    name: string | null
    requirementText: string | null
    description: string | null
    category: string | null
    sortOrder: number | null
    sourceUrl: string | null
    imageFile: string | null
    autoKey: string | null
    updatedAt: Date | null
  }

  export type MeowMedalMaxAggregateOutputType = {
    id: string | null
    name: string | null
    requirementText: string | null
    description: string | null
    category: string | null
    sortOrder: number | null
    sourceUrl: string | null
    imageFile: string | null
    autoKey: string | null
    updatedAt: Date | null
  }

  export type MeowMedalCountAggregateOutputType = {
    id: number
    name: number
    requirementText: number
    description: number
    category: number
    sortOrder: number
    sourceUrl: number
    imageFile: number
    autoKey: number
    updatedAt: number
    _all: number
  }


  export type MeowMedalAvgAggregateInputType = {
    sortOrder?: true
  }

  export type MeowMedalSumAggregateInputType = {
    sortOrder?: true
  }

  export type MeowMedalMinAggregateInputType = {
    id?: true
    name?: true
    requirementText?: true
    description?: true
    category?: true
    sortOrder?: true
    sourceUrl?: true
    imageFile?: true
    autoKey?: true
    updatedAt?: true
  }

  export type MeowMedalMaxAggregateInputType = {
    id?: true
    name?: true
    requirementText?: true
    description?: true
    category?: true
    sortOrder?: true
    sourceUrl?: true
    imageFile?: true
    autoKey?: true
    updatedAt?: true
  }

  export type MeowMedalCountAggregateInputType = {
    id?: true
    name?: true
    requirementText?: true
    description?: true
    category?: true
    sortOrder?: true
    sourceUrl?: true
    imageFile?: true
    autoKey?: true
    updatedAt?: true
    _all?: true
  }

  export type MeowMedalAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MeowMedal to aggregate.
     */
    where?: MeowMedalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MeowMedals to fetch.
     */
    orderBy?: MeowMedalOrderByWithRelationInput | MeowMedalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MeowMedalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MeowMedals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MeowMedals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MeowMedals
    **/
    _count?: true | MeowMedalCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MeowMedalAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MeowMedalSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MeowMedalMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MeowMedalMaxAggregateInputType
  }

  export type GetMeowMedalAggregateType<T extends MeowMedalAggregateArgs> = {
        [P in keyof T & keyof AggregateMeowMedal]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMeowMedal[P]>
      : GetScalarType<T[P], AggregateMeowMedal[P]>
  }




  export type MeowMedalGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MeowMedalWhereInput
    orderBy?: MeowMedalOrderByWithAggregationInput | MeowMedalOrderByWithAggregationInput[]
    by: MeowMedalScalarFieldEnum[] | MeowMedalScalarFieldEnum
    having?: MeowMedalScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MeowMedalCountAggregateInputType | true
    _avg?: MeowMedalAvgAggregateInputType
    _sum?: MeowMedalSumAggregateInputType
    _min?: MeowMedalMinAggregateInputType
    _max?: MeowMedalMaxAggregateInputType
  }

  export type MeowMedalGroupByOutputType = {
    id: string
    name: string
    requirementText: string | null
    description: string | null
    category: string | null
    sortOrder: number | null
    sourceUrl: string | null
    imageFile: string | null
    autoKey: string | null
    updatedAt: Date
    _count: MeowMedalCountAggregateOutputType | null
    _avg: MeowMedalAvgAggregateOutputType | null
    _sum: MeowMedalSumAggregateOutputType | null
    _min: MeowMedalMinAggregateOutputType | null
    _max: MeowMedalMaxAggregateOutputType | null
  }

  type GetMeowMedalGroupByPayload<T extends MeowMedalGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MeowMedalGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MeowMedalGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MeowMedalGroupByOutputType[P]>
            : GetScalarType<T[P], MeowMedalGroupByOutputType[P]>
        }
      >
    >


  export type MeowMedalSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    requirementText?: boolean
    description?: boolean
    category?: boolean
    sortOrder?: boolean
    sourceUrl?: boolean
    imageFile?: boolean
    autoKey?: boolean
    updatedAt?: boolean
    earnedBy?: boolean | MeowMedal$earnedByArgs<ExtArgs>
    _count?: boolean | MeowMedalCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["meowMedal"]>

  export type MeowMedalSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    requirementText?: boolean
    description?: boolean
    category?: boolean
    sortOrder?: boolean
    sourceUrl?: boolean
    imageFile?: boolean
    autoKey?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["meowMedal"]>

  export type MeowMedalSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    requirementText?: boolean
    description?: boolean
    category?: boolean
    sortOrder?: boolean
    sourceUrl?: boolean
    imageFile?: boolean
    autoKey?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["meowMedal"]>

  export type MeowMedalSelectScalar = {
    id?: boolean
    name?: boolean
    requirementText?: boolean
    description?: boolean
    category?: boolean
    sortOrder?: boolean
    sourceUrl?: boolean
    imageFile?: boolean
    autoKey?: boolean
    updatedAt?: boolean
  }

  export type MeowMedalOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "requirementText" | "description" | "category" | "sortOrder" | "sourceUrl" | "imageFile" | "autoKey" | "updatedAt", ExtArgs["result"]["meowMedal"]>
  export type MeowMedalInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    earnedBy?: boolean | MeowMedal$earnedByArgs<ExtArgs>
    _count?: boolean | MeowMedalCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type MeowMedalIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type MeowMedalIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $MeowMedalPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MeowMedal"
    objects: {
      earnedBy: Prisma.$UserMeowMedalPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      requirementText: string | null
      description: string | null
      category: string | null
      sortOrder: number | null
      sourceUrl: string | null
      imageFile: string | null
      autoKey: string | null
      updatedAt: Date
    }, ExtArgs["result"]["meowMedal"]>
    composites: {}
  }

  type MeowMedalGetPayload<S extends boolean | null | undefined | MeowMedalDefaultArgs> = $Result.GetResult<Prisma.$MeowMedalPayload, S>

  type MeowMedalCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MeowMedalFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MeowMedalCountAggregateInputType | true
    }

  export interface MeowMedalDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MeowMedal'], meta: { name: 'MeowMedal' } }
    /**
     * Find zero or one MeowMedal that matches the filter.
     * @param {MeowMedalFindUniqueArgs} args - Arguments to find a MeowMedal
     * @example
     * // Get one MeowMedal
     * const meowMedal = await prisma.meowMedal.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MeowMedalFindUniqueArgs>(args: SelectSubset<T, MeowMedalFindUniqueArgs<ExtArgs>>): Prisma__MeowMedalClient<$Result.GetResult<Prisma.$MeowMedalPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MeowMedal that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MeowMedalFindUniqueOrThrowArgs} args - Arguments to find a MeowMedal
     * @example
     * // Get one MeowMedal
     * const meowMedal = await prisma.meowMedal.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MeowMedalFindUniqueOrThrowArgs>(args: SelectSubset<T, MeowMedalFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MeowMedalClient<$Result.GetResult<Prisma.$MeowMedalPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MeowMedal that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeowMedalFindFirstArgs} args - Arguments to find a MeowMedal
     * @example
     * // Get one MeowMedal
     * const meowMedal = await prisma.meowMedal.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MeowMedalFindFirstArgs>(args?: SelectSubset<T, MeowMedalFindFirstArgs<ExtArgs>>): Prisma__MeowMedalClient<$Result.GetResult<Prisma.$MeowMedalPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MeowMedal that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeowMedalFindFirstOrThrowArgs} args - Arguments to find a MeowMedal
     * @example
     * // Get one MeowMedal
     * const meowMedal = await prisma.meowMedal.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MeowMedalFindFirstOrThrowArgs>(args?: SelectSubset<T, MeowMedalFindFirstOrThrowArgs<ExtArgs>>): Prisma__MeowMedalClient<$Result.GetResult<Prisma.$MeowMedalPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MeowMedals that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeowMedalFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MeowMedals
     * const meowMedals = await prisma.meowMedal.findMany()
     * 
     * // Get first 10 MeowMedals
     * const meowMedals = await prisma.meowMedal.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const meowMedalWithIdOnly = await prisma.meowMedal.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MeowMedalFindManyArgs>(args?: SelectSubset<T, MeowMedalFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MeowMedalPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MeowMedal.
     * @param {MeowMedalCreateArgs} args - Arguments to create a MeowMedal.
     * @example
     * // Create one MeowMedal
     * const MeowMedal = await prisma.meowMedal.create({
     *   data: {
     *     // ... data to create a MeowMedal
     *   }
     * })
     * 
     */
    create<T extends MeowMedalCreateArgs>(args: SelectSubset<T, MeowMedalCreateArgs<ExtArgs>>): Prisma__MeowMedalClient<$Result.GetResult<Prisma.$MeowMedalPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MeowMedals.
     * @param {MeowMedalCreateManyArgs} args - Arguments to create many MeowMedals.
     * @example
     * // Create many MeowMedals
     * const meowMedal = await prisma.meowMedal.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MeowMedalCreateManyArgs>(args?: SelectSubset<T, MeowMedalCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MeowMedals and returns the data saved in the database.
     * @param {MeowMedalCreateManyAndReturnArgs} args - Arguments to create many MeowMedals.
     * @example
     * // Create many MeowMedals
     * const meowMedal = await prisma.meowMedal.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MeowMedals and only return the `id`
     * const meowMedalWithIdOnly = await prisma.meowMedal.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MeowMedalCreateManyAndReturnArgs>(args?: SelectSubset<T, MeowMedalCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MeowMedalPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MeowMedal.
     * @param {MeowMedalDeleteArgs} args - Arguments to delete one MeowMedal.
     * @example
     * // Delete one MeowMedal
     * const MeowMedal = await prisma.meowMedal.delete({
     *   where: {
     *     // ... filter to delete one MeowMedal
     *   }
     * })
     * 
     */
    delete<T extends MeowMedalDeleteArgs>(args: SelectSubset<T, MeowMedalDeleteArgs<ExtArgs>>): Prisma__MeowMedalClient<$Result.GetResult<Prisma.$MeowMedalPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MeowMedal.
     * @param {MeowMedalUpdateArgs} args - Arguments to update one MeowMedal.
     * @example
     * // Update one MeowMedal
     * const meowMedal = await prisma.meowMedal.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MeowMedalUpdateArgs>(args: SelectSubset<T, MeowMedalUpdateArgs<ExtArgs>>): Prisma__MeowMedalClient<$Result.GetResult<Prisma.$MeowMedalPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MeowMedals.
     * @param {MeowMedalDeleteManyArgs} args - Arguments to filter MeowMedals to delete.
     * @example
     * // Delete a few MeowMedals
     * const { count } = await prisma.meowMedal.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MeowMedalDeleteManyArgs>(args?: SelectSubset<T, MeowMedalDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MeowMedals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeowMedalUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MeowMedals
     * const meowMedal = await prisma.meowMedal.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MeowMedalUpdateManyArgs>(args: SelectSubset<T, MeowMedalUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MeowMedals and returns the data updated in the database.
     * @param {MeowMedalUpdateManyAndReturnArgs} args - Arguments to update many MeowMedals.
     * @example
     * // Update many MeowMedals
     * const meowMedal = await prisma.meowMedal.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MeowMedals and only return the `id`
     * const meowMedalWithIdOnly = await prisma.meowMedal.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MeowMedalUpdateManyAndReturnArgs>(args: SelectSubset<T, MeowMedalUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MeowMedalPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MeowMedal.
     * @param {MeowMedalUpsertArgs} args - Arguments to update or create a MeowMedal.
     * @example
     * // Update or create a MeowMedal
     * const meowMedal = await prisma.meowMedal.upsert({
     *   create: {
     *     // ... data to create a MeowMedal
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MeowMedal we want to update
     *   }
     * })
     */
    upsert<T extends MeowMedalUpsertArgs>(args: SelectSubset<T, MeowMedalUpsertArgs<ExtArgs>>): Prisma__MeowMedalClient<$Result.GetResult<Prisma.$MeowMedalPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MeowMedals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeowMedalCountArgs} args - Arguments to filter MeowMedals to count.
     * @example
     * // Count the number of MeowMedals
     * const count = await prisma.meowMedal.count({
     *   where: {
     *     // ... the filter for the MeowMedals we want to count
     *   }
     * })
    **/
    count<T extends MeowMedalCountArgs>(
      args?: Subset<T, MeowMedalCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MeowMedalCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MeowMedal.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeowMedalAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MeowMedalAggregateArgs>(args: Subset<T, MeowMedalAggregateArgs>): Prisma.PrismaPromise<GetMeowMedalAggregateType<T>>

    /**
     * Group by MeowMedal.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MeowMedalGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MeowMedalGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MeowMedalGroupByArgs['orderBy'] }
        : { orderBy?: MeowMedalGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MeowMedalGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMeowMedalGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MeowMedal model
   */
  readonly fields: MeowMedalFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MeowMedal.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MeowMedalClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    earnedBy<T extends MeowMedal$earnedByArgs<ExtArgs> = {}>(args?: Subset<T, MeowMedal$earnedByArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserMeowMedalPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MeowMedal model
   */
  interface MeowMedalFieldRefs {
    readonly id: FieldRef<"MeowMedal", 'String'>
    readonly name: FieldRef<"MeowMedal", 'String'>
    readonly requirementText: FieldRef<"MeowMedal", 'String'>
    readonly description: FieldRef<"MeowMedal", 'String'>
    readonly category: FieldRef<"MeowMedal", 'String'>
    readonly sortOrder: FieldRef<"MeowMedal", 'Int'>
    readonly sourceUrl: FieldRef<"MeowMedal", 'String'>
    readonly imageFile: FieldRef<"MeowMedal", 'String'>
    readonly autoKey: FieldRef<"MeowMedal", 'String'>
    readonly updatedAt: FieldRef<"MeowMedal", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MeowMedal findUnique
   */
  export type MeowMedalFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeowMedal
     */
    select?: MeowMedalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeowMedal
     */
    omit?: MeowMedalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeowMedalInclude<ExtArgs> | null
    /**
     * Filter, which MeowMedal to fetch.
     */
    where: MeowMedalWhereUniqueInput
  }

  /**
   * MeowMedal findUniqueOrThrow
   */
  export type MeowMedalFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeowMedal
     */
    select?: MeowMedalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeowMedal
     */
    omit?: MeowMedalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeowMedalInclude<ExtArgs> | null
    /**
     * Filter, which MeowMedal to fetch.
     */
    where: MeowMedalWhereUniqueInput
  }

  /**
   * MeowMedal findFirst
   */
  export type MeowMedalFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeowMedal
     */
    select?: MeowMedalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeowMedal
     */
    omit?: MeowMedalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeowMedalInclude<ExtArgs> | null
    /**
     * Filter, which MeowMedal to fetch.
     */
    where?: MeowMedalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MeowMedals to fetch.
     */
    orderBy?: MeowMedalOrderByWithRelationInput | MeowMedalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MeowMedals.
     */
    cursor?: MeowMedalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MeowMedals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MeowMedals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MeowMedals.
     */
    distinct?: MeowMedalScalarFieldEnum | MeowMedalScalarFieldEnum[]
  }

  /**
   * MeowMedal findFirstOrThrow
   */
  export type MeowMedalFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeowMedal
     */
    select?: MeowMedalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeowMedal
     */
    omit?: MeowMedalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeowMedalInclude<ExtArgs> | null
    /**
     * Filter, which MeowMedal to fetch.
     */
    where?: MeowMedalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MeowMedals to fetch.
     */
    orderBy?: MeowMedalOrderByWithRelationInput | MeowMedalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MeowMedals.
     */
    cursor?: MeowMedalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MeowMedals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MeowMedals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MeowMedals.
     */
    distinct?: MeowMedalScalarFieldEnum | MeowMedalScalarFieldEnum[]
  }

  /**
   * MeowMedal findMany
   */
  export type MeowMedalFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeowMedal
     */
    select?: MeowMedalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeowMedal
     */
    omit?: MeowMedalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeowMedalInclude<ExtArgs> | null
    /**
     * Filter, which MeowMedals to fetch.
     */
    where?: MeowMedalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MeowMedals to fetch.
     */
    orderBy?: MeowMedalOrderByWithRelationInput | MeowMedalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MeowMedals.
     */
    cursor?: MeowMedalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MeowMedals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MeowMedals.
     */
    skip?: number
    distinct?: MeowMedalScalarFieldEnum | MeowMedalScalarFieldEnum[]
  }

  /**
   * MeowMedal create
   */
  export type MeowMedalCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeowMedal
     */
    select?: MeowMedalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeowMedal
     */
    omit?: MeowMedalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeowMedalInclude<ExtArgs> | null
    /**
     * The data needed to create a MeowMedal.
     */
    data: XOR<MeowMedalCreateInput, MeowMedalUncheckedCreateInput>
  }

  /**
   * MeowMedal createMany
   */
  export type MeowMedalCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MeowMedals.
     */
    data: MeowMedalCreateManyInput | MeowMedalCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MeowMedal createManyAndReturn
   */
  export type MeowMedalCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeowMedal
     */
    select?: MeowMedalSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MeowMedal
     */
    omit?: MeowMedalOmit<ExtArgs> | null
    /**
     * The data used to create many MeowMedals.
     */
    data: MeowMedalCreateManyInput | MeowMedalCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * MeowMedal update
   */
  export type MeowMedalUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeowMedal
     */
    select?: MeowMedalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeowMedal
     */
    omit?: MeowMedalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeowMedalInclude<ExtArgs> | null
    /**
     * The data needed to update a MeowMedal.
     */
    data: XOR<MeowMedalUpdateInput, MeowMedalUncheckedUpdateInput>
    /**
     * Choose, which MeowMedal to update.
     */
    where: MeowMedalWhereUniqueInput
  }

  /**
   * MeowMedal updateMany
   */
  export type MeowMedalUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MeowMedals.
     */
    data: XOR<MeowMedalUpdateManyMutationInput, MeowMedalUncheckedUpdateManyInput>
    /**
     * Filter which MeowMedals to update
     */
    where?: MeowMedalWhereInput
    /**
     * Limit how many MeowMedals to update.
     */
    limit?: number
  }

  /**
   * MeowMedal updateManyAndReturn
   */
  export type MeowMedalUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeowMedal
     */
    select?: MeowMedalSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MeowMedal
     */
    omit?: MeowMedalOmit<ExtArgs> | null
    /**
     * The data used to update MeowMedals.
     */
    data: XOR<MeowMedalUpdateManyMutationInput, MeowMedalUncheckedUpdateManyInput>
    /**
     * Filter which MeowMedals to update
     */
    where?: MeowMedalWhereInput
    /**
     * Limit how many MeowMedals to update.
     */
    limit?: number
  }

  /**
   * MeowMedal upsert
   */
  export type MeowMedalUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeowMedal
     */
    select?: MeowMedalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeowMedal
     */
    omit?: MeowMedalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeowMedalInclude<ExtArgs> | null
    /**
     * The filter to search for the MeowMedal to update in case it exists.
     */
    where: MeowMedalWhereUniqueInput
    /**
     * In case the MeowMedal found by the `where` argument doesn't exist, create a new MeowMedal with this data.
     */
    create: XOR<MeowMedalCreateInput, MeowMedalUncheckedCreateInput>
    /**
     * In case the MeowMedal was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MeowMedalUpdateInput, MeowMedalUncheckedUpdateInput>
  }

  /**
   * MeowMedal delete
   */
  export type MeowMedalDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeowMedal
     */
    select?: MeowMedalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeowMedal
     */
    omit?: MeowMedalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeowMedalInclude<ExtArgs> | null
    /**
     * Filter which MeowMedal to delete.
     */
    where: MeowMedalWhereUniqueInput
  }

  /**
   * MeowMedal deleteMany
   */
  export type MeowMedalDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MeowMedals to delete
     */
    where?: MeowMedalWhereInput
    /**
     * Limit how many MeowMedals to delete.
     */
    limit?: number
  }

  /**
   * MeowMedal.earnedBy
   */
  export type MeowMedal$earnedByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserMeowMedal
     */
    select?: UserMeowMedalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserMeowMedal
     */
    omit?: UserMeowMedalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserMeowMedalInclude<ExtArgs> | null
    where?: UserMeowMedalWhereInput
    orderBy?: UserMeowMedalOrderByWithRelationInput | UserMeowMedalOrderByWithRelationInput[]
    cursor?: UserMeowMedalWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserMeowMedalScalarFieldEnum | UserMeowMedalScalarFieldEnum[]
  }

  /**
   * MeowMedal without action
   */
  export type MeowMedalDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MeowMedal
     */
    select?: MeowMedalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MeowMedal
     */
    omit?: MeowMedalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MeowMedalInclude<ExtArgs> | null
  }


  /**
   * Model UserMeowMedal
   */

  export type AggregateUserMeowMedal = {
    _count: UserMeowMedalCountAggregateOutputType | null
    _min: UserMeowMedalMinAggregateOutputType | null
    _max: UserMeowMedalMaxAggregateOutputType | null
  }

  export type UserMeowMedalMinAggregateOutputType = {
    id: string | null
    userId: string | null
    meowMedalId: string | null
    earned: boolean | null
    earnedAt: Date | null
    updatedAt: Date | null
  }

  export type UserMeowMedalMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    meowMedalId: string | null
    earned: boolean | null
    earnedAt: Date | null
    updatedAt: Date | null
  }

  export type UserMeowMedalCountAggregateOutputType = {
    id: number
    userId: number
    meowMedalId: number
    earned: number
    earnedAt: number
    updatedAt: number
    _all: number
  }


  export type UserMeowMedalMinAggregateInputType = {
    id?: true
    userId?: true
    meowMedalId?: true
    earned?: true
    earnedAt?: true
    updatedAt?: true
  }

  export type UserMeowMedalMaxAggregateInputType = {
    id?: true
    userId?: true
    meowMedalId?: true
    earned?: true
    earnedAt?: true
    updatedAt?: true
  }

  export type UserMeowMedalCountAggregateInputType = {
    id?: true
    userId?: true
    meowMedalId?: true
    earned?: true
    earnedAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserMeowMedalAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserMeowMedal to aggregate.
     */
    where?: UserMeowMedalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserMeowMedals to fetch.
     */
    orderBy?: UserMeowMedalOrderByWithRelationInput | UserMeowMedalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserMeowMedalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserMeowMedals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserMeowMedals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserMeowMedals
    **/
    _count?: true | UserMeowMedalCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMeowMedalMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMeowMedalMaxAggregateInputType
  }

  export type GetUserMeowMedalAggregateType<T extends UserMeowMedalAggregateArgs> = {
        [P in keyof T & keyof AggregateUserMeowMedal]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserMeowMedal[P]>
      : GetScalarType<T[P], AggregateUserMeowMedal[P]>
  }




  export type UserMeowMedalGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserMeowMedalWhereInput
    orderBy?: UserMeowMedalOrderByWithAggregationInput | UserMeowMedalOrderByWithAggregationInput[]
    by: UserMeowMedalScalarFieldEnum[] | UserMeowMedalScalarFieldEnum
    having?: UserMeowMedalScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserMeowMedalCountAggregateInputType | true
    _min?: UserMeowMedalMinAggregateInputType
    _max?: UserMeowMedalMaxAggregateInputType
  }

  export type UserMeowMedalGroupByOutputType = {
    id: string
    userId: string
    meowMedalId: string
    earned: boolean
    earnedAt: Date | null
    updatedAt: Date
    _count: UserMeowMedalCountAggregateOutputType | null
    _min: UserMeowMedalMinAggregateOutputType | null
    _max: UserMeowMedalMaxAggregateOutputType | null
  }

  type GetUserMeowMedalGroupByPayload<T extends UserMeowMedalGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserMeowMedalGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserMeowMedalGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserMeowMedalGroupByOutputType[P]>
            : GetScalarType<T[P], UserMeowMedalGroupByOutputType[P]>
        }
      >
    >


  export type UserMeowMedalSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    meowMedalId?: boolean
    earned?: boolean
    earnedAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    meowMedal?: boolean | MeowMedalDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userMeowMedal"]>

  export type UserMeowMedalSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    meowMedalId?: boolean
    earned?: boolean
    earnedAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    meowMedal?: boolean | MeowMedalDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userMeowMedal"]>

  export type UserMeowMedalSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    meowMedalId?: boolean
    earned?: boolean
    earnedAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    meowMedal?: boolean | MeowMedalDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userMeowMedal"]>

  export type UserMeowMedalSelectScalar = {
    id?: boolean
    userId?: boolean
    meowMedalId?: boolean
    earned?: boolean
    earnedAt?: boolean
    updatedAt?: boolean
  }

  export type UserMeowMedalOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "meowMedalId" | "earned" | "earnedAt" | "updatedAt", ExtArgs["result"]["userMeowMedal"]>
  export type UserMeowMedalInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    meowMedal?: boolean | MeowMedalDefaultArgs<ExtArgs>
  }
  export type UserMeowMedalIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    meowMedal?: boolean | MeowMedalDefaultArgs<ExtArgs>
  }
  export type UserMeowMedalIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    meowMedal?: boolean | MeowMedalDefaultArgs<ExtArgs>
  }

  export type $UserMeowMedalPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserMeowMedal"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      meowMedal: Prisma.$MeowMedalPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      meowMedalId: string
      earned: boolean
      earnedAt: Date | null
      updatedAt: Date
    }, ExtArgs["result"]["userMeowMedal"]>
    composites: {}
  }

  type UserMeowMedalGetPayload<S extends boolean | null | undefined | UserMeowMedalDefaultArgs> = $Result.GetResult<Prisma.$UserMeowMedalPayload, S>

  type UserMeowMedalCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserMeowMedalFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserMeowMedalCountAggregateInputType | true
    }

  export interface UserMeowMedalDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserMeowMedal'], meta: { name: 'UserMeowMedal' } }
    /**
     * Find zero or one UserMeowMedal that matches the filter.
     * @param {UserMeowMedalFindUniqueArgs} args - Arguments to find a UserMeowMedal
     * @example
     * // Get one UserMeowMedal
     * const userMeowMedal = await prisma.userMeowMedal.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserMeowMedalFindUniqueArgs>(args: SelectSubset<T, UserMeowMedalFindUniqueArgs<ExtArgs>>): Prisma__UserMeowMedalClient<$Result.GetResult<Prisma.$UserMeowMedalPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserMeowMedal that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserMeowMedalFindUniqueOrThrowArgs} args - Arguments to find a UserMeowMedal
     * @example
     * // Get one UserMeowMedal
     * const userMeowMedal = await prisma.userMeowMedal.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserMeowMedalFindUniqueOrThrowArgs>(args: SelectSubset<T, UserMeowMedalFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserMeowMedalClient<$Result.GetResult<Prisma.$UserMeowMedalPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserMeowMedal that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserMeowMedalFindFirstArgs} args - Arguments to find a UserMeowMedal
     * @example
     * // Get one UserMeowMedal
     * const userMeowMedal = await prisma.userMeowMedal.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserMeowMedalFindFirstArgs>(args?: SelectSubset<T, UserMeowMedalFindFirstArgs<ExtArgs>>): Prisma__UserMeowMedalClient<$Result.GetResult<Prisma.$UserMeowMedalPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserMeowMedal that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserMeowMedalFindFirstOrThrowArgs} args - Arguments to find a UserMeowMedal
     * @example
     * // Get one UserMeowMedal
     * const userMeowMedal = await prisma.userMeowMedal.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserMeowMedalFindFirstOrThrowArgs>(args?: SelectSubset<T, UserMeowMedalFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserMeowMedalClient<$Result.GetResult<Prisma.$UserMeowMedalPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserMeowMedals that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserMeowMedalFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserMeowMedals
     * const userMeowMedals = await prisma.userMeowMedal.findMany()
     * 
     * // Get first 10 UserMeowMedals
     * const userMeowMedals = await prisma.userMeowMedal.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userMeowMedalWithIdOnly = await prisma.userMeowMedal.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserMeowMedalFindManyArgs>(args?: SelectSubset<T, UserMeowMedalFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserMeowMedalPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserMeowMedal.
     * @param {UserMeowMedalCreateArgs} args - Arguments to create a UserMeowMedal.
     * @example
     * // Create one UserMeowMedal
     * const UserMeowMedal = await prisma.userMeowMedal.create({
     *   data: {
     *     // ... data to create a UserMeowMedal
     *   }
     * })
     * 
     */
    create<T extends UserMeowMedalCreateArgs>(args: SelectSubset<T, UserMeowMedalCreateArgs<ExtArgs>>): Prisma__UserMeowMedalClient<$Result.GetResult<Prisma.$UserMeowMedalPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserMeowMedals.
     * @param {UserMeowMedalCreateManyArgs} args - Arguments to create many UserMeowMedals.
     * @example
     * // Create many UserMeowMedals
     * const userMeowMedal = await prisma.userMeowMedal.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserMeowMedalCreateManyArgs>(args?: SelectSubset<T, UserMeowMedalCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserMeowMedals and returns the data saved in the database.
     * @param {UserMeowMedalCreateManyAndReturnArgs} args - Arguments to create many UserMeowMedals.
     * @example
     * // Create many UserMeowMedals
     * const userMeowMedal = await prisma.userMeowMedal.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserMeowMedals and only return the `id`
     * const userMeowMedalWithIdOnly = await prisma.userMeowMedal.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserMeowMedalCreateManyAndReturnArgs>(args?: SelectSubset<T, UserMeowMedalCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserMeowMedalPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserMeowMedal.
     * @param {UserMeowMedalDeleteArgs} args - Arguments to delete one UserMeowMedal.
     * @example
     * // Delete one UserMeowMedal
     * const UserMeowMedal = await prisma.userMeowMedal.delete({
     *   where: {
     *     // ... filter to delete one UserMeowMedal
     *   }
     * })
     * 
     */
    delete<T extends UserMeowMedalDeleteArgs>(args: SelectSubset<T, UserMeowMedalDeleteArgs<ExtArgs>>): Prisma__UserMeowMedalClient<$Result.GetResult<Prisma.$UserMeowMedalPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserMeowMedal.
     * @param {UserMeowMedalUpdateArgs} args - Arguments to update one UserMeowMedal.
     * @example
     * // Update one UserMeowMedal
     * const userMeowMedal = await prisma.userMeowMedal.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserMeowMedalUpdateArgs>(args: SelectSubset<T, UserMeowMedalUpdateArgs<ExtArgs>>): Prisma__UserMeowMedalClient<$Result.GetResult<Prisma.$UserMeowMedalPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserMeowMedals.
     * @param {UserMeowMedalDeleteManyArgs} args - Arguments to filter UserMeowMedals to delete.
     * @example
     * // Delete a few UserMeowMedals
     * const { count } = await prisma.userMeowMedal.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserMeowMedalDeleteManyArgs>(args?: SelectSubset<T, UserMeowMedalDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserMeowMedals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserMeowMedalUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserMeowMedals
     * const userMeowMedal = await prisma.userMeowMedal.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserMeowMedalUpdateManyArgs>(args: SelectSubset<T, UserMeowMedalUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserMeowMedals and returns the data updated in the database.
     * @param {UserMeowMedalUpdateManyAndReturnArgs} args - Arguments to update many UserMeowMedals.
     * @example
     * // Update many UserMeowMedals
     * const userMeowMedal = await prisma.userMeowMedal.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserMeowMedals and only return the `id`
     * const userMeowMedalWithIdOnly = await prisma.userMeowMedal.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserMeowMedalUpdateManyAndReturnArgs>(args: SelectSubset<T, UserMeowMedalUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserMeowMedalPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserMeowMedal.
     * @param {UserMeowMedalUpsertArgs} args - Arguments to update or create a UserMeowMedal.
     * @example
     * // Update or create a UserMeowMedal
     * const userMeowMedal = await prisma.userMeowMedal.upsert({
     *   create: {
     *     // ... data to create a UserMeowMedal
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserMeowMedal we want to update
     *   }
     * })
     */
    upsert<T extends UserMeowMedalUpsertArgs>(args: SelectSubset<T, UserMeowMedalUpsertArgs<ExtArgs>>): Prisma__UserMeowMedalClient<$Result.GetResult<Prisma.$UserMeowMedalPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserMeowMedals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserMeowMedalCountArgs} args - Arguments to filter UserMeowMedals to count.
     * @example
     * // Count the number of UserMeowMedals
     * const count = await prisma.userMeowMedal.count({
     *   where: {
     *     // ... the filter for the UserMeowMedals we want to count
     *   }
     * })
    **/
    count<T extends UserMeowMedalCountArgs>(
      args?: Subset<T, UserMeowMedalCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserMeowMedalCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserMeowMedal.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserMeowMedalAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserMeowMedalAggregateArgs>(args: Subset<T, UserMeowMedalAggregateArgs>): Prisma.PrismaPromise<GetUserMeowMedalAggregateType<T>>

    /**
     * Group by UserMeowMedal.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserMeowMedalGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserMeowMedalGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserMeowMedalGroupByArgs['orderBy'] }
        : { orderBy?: UserMeowMedalGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserMeowMedalGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserMeowMedalGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserMeowMedal model
   */
  readonly fields: UserMeowMedalFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserMeowMedal.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserMeowMedalClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    meowMedal<T extends MeowMedalDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MeowMedalDefaultArgs<ExtArgs>>): Prisma__MeowMedalClient<$Result.GetResult<Prisma.$MeowMedalPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserMeowMedal model
   */
  interface UserMeowMedalFieldRefs {
    readonly id: FieldRef<"UserMeowMedal", 'String'>
    readonly userId: FieldRef<"UserMeowMedal", 'String'>
    readonly meowMedalId: FieldRef<"UserMeowMedal", 'String'>
    readonly earned: FieldRef<"UserMeowMedal", 'Boolean'>
    readonly earnedAt: FieldRef<"UserMeowMedal", 'DateTime'>
    readonly updatedAt: FieldRef<"UserMeowMedal", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserMeowMedal findUnique
   */
  export type UserMeowMedalFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserMeowMedal
     */
    select?: UserMeowMedalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserMeowMedal
     */
    omit?: UserMeowMedalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserMeowMedalInclude<ExtArgs> | null
    /**
     * Filter, which UserMeowMedal to fetch.
     */
    where: UserMeowMedalWhereUniqueInput
  }

  /**
   * UserMeowMedal findUniqueOrThrow
   */
  export type UserMeowMedalFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserMeowMedal
     */
    select?: UserMeowMedalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserMeowMedal
     */
    omit?: UserMeowMedalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserMeowMedalInclude<ExtArgs> | null
    /**
     * Filter, which UserMeowMedal to fetch.
     */
    where: UserMeowMedalWhereUniqueInput
  }

  /**
   * UserMeowMedal findFirst
   */
  export type UserMeowMedalFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserMeowMedal
     */
    select?: UserMeowMedalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserMeowMedal
     */
    omit?: UserMeowMedalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserMeowMedalInclude<ExtArgs> | null
    /**
     * Filter, which UserMeowMedal to fetch.
     */
    where?: UserMeowMedalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserMeowMedals to fetch.
     */
    orderBy?: UserMeowMedalOrderByWithRelationInput | UserMeowMedalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserMeowMedals.
     */
    cursor?: UserMeowMedalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserMeowMedals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserMeowMedals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserMeowMedals.
     */
    distinct?: UserMeowMedalScalarFieldEnum | UserMeowMedalScalarFieldEnum[]
  }

  /**
   * UserMeowMedal findFirstOrThrow
   */
  export type UserMeowMedalFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserMeowMedal
     */
    select?: UserMeowMedalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserMeowMedal
     */
    omit?: UserMeowMedalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserMeowMedalInclude<ExtArgs> | null
    /**
     * Filter, which UserMeowMedal to fetch.
     */
    where?: UserMeowMedalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserMeowMedals to fetch.
     */
    orderBy?: UserMeowMedalOrderByWithRelationInput | UserMeowMedalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserMeowMedals.
     */
    cursor?: UserMeowMedalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserMeowMedals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserMeowMedals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserMeowMedals.
     */
    distinct?: UserMeowMedalScalarFieldEnum | UserMeowMedalScalarFieldEnum[]
  }

  /**
   * UserMeowMedal findMany
   */
  export type UserMeowMedalFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserMeowMedal
     */
    select?: UserMeowMedalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserMeowMedal
     */
    omit?: UserMeowMedalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserMeowMedalInclude<ExtArgs> | null
    /**
     * Filter, which UserMeowMedals to fetch.
     */
    where?: UserMeowMedalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserMeowMedals to fetch.
     */
    orderBy?: UserMeowMedalOrderByWithRelationInput | UserMeowMedalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserMeowMedals.
     */
    cursor?: UserMeowMedalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserMeowMedals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserMeowMedals.
     */
    skip?: number
    distinct?: UserMeowMedalScalarFieldEnum | UserMeowMedalScalarFieldEnum[]
  }

  /**
   * UserMeowMedal create
   */
  export type UserMeowMedalCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserMeowMedal
     */
    select?: UserMeowMedalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserMeowMedal
     */
    omit?: UserMeowMedalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserMeowMedalInclude<ExtArgs> | null
    /**
     * The data needed to create a UserMeowMedal.
     */
    data: XOR<UserMeowMedalCreateInput, UserMeowMedalUncheckedCreateInput>
  }

  /**
   * UserMeowMedal createMany
   */
  export type UserMeowMedalCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserMeowMedals.
     */
    data: UserMeowMedalCreateManyInput | UserMeowMedalCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserMeowMedal createManyAndReturn
   */
  export type UserMeowMedalCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserMeowMedal
     */
    select?: UserMeowMedalSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserMeowMedal
     */
    omit?: UserMeowMedalOmit<ExtArgs> | null
    /**
     * The data used to create many UserMeowMedals.
     */
    data: UserMeowMedalCreateManyInput | UserMeowMedalCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserMeowMedalIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserMeowMedal update
   */
  export type UserMeowMedalUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserMeowMedal
     */
    select?: UserMeowMedalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserMeowMedal
     */
    omit?: UserMeowMedalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserMeowMedalInclude<ExtArgs> | null
    /**
     * The data needed to update a UserMeowMedal.
     */
    data: XOR<UserMeowMedalUpdateInput, UserMeowMedalUncheckedUpdateInput>
    /**
     * Choose, which UserMeowMedal to update.
     */
    where: UserMeowMedalWhereUniqueInput
  }

  /**
   * UserMeowMedal updateMany
   */
  export type UserMeowMedalUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserMeowMedals.
     */
    data: XOR<UserMeowMedalUpdateManyMutationInput, UserMeowMedalUncheckedUpdateManyInput>
    /**
     * Filter which UserMeowMedals to update
     */
    where?: UserMeowMedalWhereInput
    /**
     * Limit how many UserMeowMedals to update.
     */
    limit?: number
  }

  /**
   * UserMeowMedal updateManyAndReturn
   */
  export type UserMeowMedalUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserMeowMedal
     */
    select?: UserMeowMedalSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserMeowMedal
     */
    omit?: UserMeowMedalOmit<ExtArgs> | null
    /**
     * The data used to update UserMeowMedals.
     */
    data: XOR<UserMeowMedalUpdateManyMutationInput, UserMeowMedalUncheckedUpdateManyInput>
    /**
     * Filter which UserMeowMedals to update
     */
    where?: UserMeowMedalWhereInput
    /**
     * Limit how many UserMeowMedals to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserMeowMedalIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserMeowMedal upsert
   */
  export type UserMeowMedalUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserMeowMedal
     */
    select?: UserMeowMedalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserMeowMedal
     */
    omit?: UserMeowMedalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserMeowMedalInclude<ExtArgs> | null
    /**
     * The filter to search for the UserMeowMedal to update in case it exists.
     */
    where: UserMeowMedalWhereUniqueInput
    /**
     * In case the UserMeowMedal found by the `where` argument doesn't exist, create a new UserMeowMedal with this data.
     */
    create: XOR<UserMeowMedalCreateInput, UserMeowMedalUncheckedCreateInput>
    /**
     * In case the UserMeowMedal was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserMeowMedalUpdateInput, UserMeowMedalUncheckedUpdateInput>
  }

  /**
   * UserMeowMedal delete
   */
  export type UserMeowMedalDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserMeowMedal
     */
    select?: UserMeowMedalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserMeowMedal
     */
    omit?: UserMeowMedalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserMeowMedalInclude<ExtArgs> | null
    /**
     * Filter which UserMeowMedal to delete.
     */
    where: UserMeowMedalWhereUniqueInput
  }

  /**
   * UserMeowMedal deleteMany
   */
  export type UserMeowMedalDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserMeowMedals to delete
     */
    where?: UserMeowMedalWhereInput
    /**
     * Limit how many UserMeowMedals to delete.
     */
    limit?: number
  }

  /**
   * UserMeowMedal without action
   */
  export type UserMeowMedalDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserMeowMedal
     */
    select?: UserMeowMedalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserMeowMedal
     */
    omit?: UserMeowMedalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserMeowMedalInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    username: 'username',
    email: 'email',
    passwordHash: 'passwordHash',
    displayName: 'displayName',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const PrivacySettingsScalarFieldEnum: {
    userId: 'userId',
    profileVisibility: 'profileVisibility',
    progressVisibility: 'progressVisibility'
  };

  export type PrivacySettingsScalarFieldEnum = (typeof PrivacySettingsScalarFieldEnum)[keyof typeof PrivacySettingsScalarFieldEnum]


  export const FriendshipScalarFieldEnum: {
    id: 'id',
    requesterId: 'requesterId',
    addresseeId: 'addresseeId',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type FriendshipScalarFieldEnum = (typeof FriendshipScalarFieldEnum)[keyof typeof FriendshipScalarFieldEnum]


  export const StoryChapterScalarFieldEnum: {
    id: 'id',
    arc: 'arc',
    chapterNumber: 'chapterNumber',
    displayName: 'displayName',
    sortOrder: 'sortOrder'
  };

  export type StoryChapterScalarFieldEnum = (typeof StoryChapterScalarFieldEnum)[keyof typeof StoryChapterScalarFieldEnum]


  export const UserStoryProgressScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    storyChapterId: 'storyChapterId',
    cleared: 'cleared',
    treasures: 'treasures',
    zombies: 'zombies',
    updatedAt: 'updatedAt'
  };

  export type UserStoryProgressScalarFieldEnum = (typeof UserStoryProgressScalarFieldEnum)[keyof typeof UserStoryProgressScalarFieldEnum]


  export const LegendSagaScalarFieldEnum: {
    id: 'id',
    displayName: 'displayName',
    sortOrder: 'sortOrder'
  };

  export type LegendSagaScalarFieldEnum = (typeof LegendSagaScalarFieldEnum)[keyof typeof LegendSagaScalarFieldEnum]


  export const LegendSubchapterScalarFieldEnum: {
    id: 'id',
    sagaId: 'sagaId',
    displayName: 'displayName',
    sortOrder: 'sortOrder'
  };

  export type LegendSubchapterScalarFieldEnum = (typeof LegendSubchapterScalarFieldEnum)[keyof typeof LegendSubchapterScalarFieldEnum]


  export const UserLegendProgressScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    subchapterId: 'subchapterId',
    status: 'status',
    crownMax: 'crownMax',
    notes: 'notes',
    updatedAt: 'updatedAt'
  };

  export type UserLegendProgressScalarFieldEnum = (typeof UserLegendProgressScalarFieldEnum)[keyof typeof UserLegendProgressScalarFieldEnum]


  export const MilestoneScalarFieldEnum: {
    id: 'id',
    category: 'category',
    displayName: 'displayName',
    sortOrder: 'sortOrder'
  };

  export type MilestoneScalarFieldEnum = (typeof MilestoneScalarFieldEnum)[keyof typeof MilestoneScalarFieldEnum]


  export const UserMilestoneProgressScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    milestoneId: 'milestoneId',
    cleared: 'cleared',
    notes: 'notes',
    updatedAt: 'updatedAt'
  };

  export type UserMilestoneProgressScalarFieldEnum = (typeof UserMilestoneProgressScalarFieldEnum)[keyof typeof UserMilestoneProgressScalarFieldEnum]


  export const UserCatclawProgressScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    currentRank: 'currentRank',
    bestRank: 'bestRank',
    notes: 'notes',
    updatedAt: 'updatedAt'
  };

  export type UserCatclawProgressScalarFieldEnum = (typeof UserCatclawProgressScalarFieldEnum)[keyof typeof UserCatclawProgressScalarFieldEnum]


  export const MeowMedalScalarFieldEnum: {
    id: 'id',
    name: 'name',
    requirementText: 'requirementText',
    description: 'description',
    category: 'category',
    sortOrder: 'sortOrder',
    sourceUrl: 'sourceUrl',
    imageFile: 'imageFile',
    autoKey: 'autoKey',
    updatedAt: 'updatedAt'
  };

  export type MeowMedalScalarFieldEnum = (typeof MeowMedalScalarFieldEnum)[keyof typeof MeowMedalScalarFieldEnum]


  export const UserMeowMedalScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    meowMedalId: 'meowMedalId',
    earned: 'earned',
    earnedAt: 'earnedAt',
    updatedAt: 'updatedAt'
  };

  export type UserMeowMedalScalarFieldEnum = (typeof UserMeowMedalScalarFieldEnum)[keyof typeof UserMeowMedalScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Visibility'
   */
  export type EnumVisibilityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Visibility'>
    


  /**
   * Reference to a field of type 'Visibility[]'
   */
  export type ListEnumVisibilityFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Visibility[]'>
    


  /**
   * Reference to a field of type 'FriendshipStatus'
   */
  export type EnumFriendshipStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FriendshipStatus'>
    


  /**
   * Reference to a field of type 'FriendshipStatus[]'
   */
  export type ListEnumFriendshipStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'FriendshipStatus[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'TreasureStatus'
   */
  export type EnumTreasureStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TreasureStatus'>
    


  /**
   * Reference to a field of type 'TreasureStatus[]'
   */
  export type ListEnumTreasureStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TreasureStatus[]'>
    


  /**
   * Reference to a field of type 'ZombieStatus'
   */
  export type EnumZombieStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ZombieStatus'>
    


  /**
   * Reference to a field of type 'ZombieStatus[]'
   */
  export type ListEnumZombieStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ZombieStatus[]'>
    


  /**
   * Reference to a field of type 'LegendProgressStatus'
   */
  export type EnumLegendProgressStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LegendProgressStatus'>
    


  /**
   * Reference to a field of type 'LegendProgressStatus[]'
   */
  export type ListEnumLegendProgressStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LegendProgressStatus[]'>
    


  /**
   * Reference to a field of type 'MilestoneCategory'
   */
  export type EnumMilestoneCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MilestoneCategory'>
    


  /**
   * Reference to a field of type 'MilestoneCategory[]'
   */
  export type ListEnumMilestoneCategoryFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MilestoneCategory[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    username?: StringFilter<"User"> | string
    email?: StringNullableFilter<"User"> | string | null
    passwordHash?: StringFilter<"User"> | string
    displayName?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    privacy?: XOR<PrivacySettingsNullableScalarRelationFilter, PrivacySettingsWhereInput> | null
    sentFriendRequests?: FriendshipListRelationFilter
    receivedFriendRequests?: FriendshipListRelationFilter
    storyProgress?: UserStoryProgressListRelationFilter
    legendProgress?: UserLegendProgressListRelationFilter
    milestoneProgress?: UserMilestoneProgressListRelationFilter
    catclawProgress?: XOR<UserCatclawProgressNullableScalarRelationFilter, UserCatclawProgressWhereInput> | null
    meowMedalProgress?: UserMeowMedalListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    username?: SortOrder
    email?: SortOrderInput | SortOrder
    passwordHash?: SortOrder
    displayName?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    privacy?: PrivacySettingsOrderByWithRelationInput
    sentFriendRequests?: FriendshipOrderByRelationAggregateInput
    receivedFriendRequests?: FriendshipOrderByRelationAggregateInput
    storyProgress?: UserStoryProgressOrderByRelationAggregateInput
    legendProgress?: UserLegendProgressOrderByRelationAggregateInput
    milestoneProgress?: UserMilestoneProgressOrderByRelationAggregateInput
    catclawProgress?: UserCatclawProgressOrderByWithRelationInput
    meowMedalProgress?: UserMeowMedalOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    username?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    passwordHash?: StringFilter<"User"> | string
    displayName?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    privacy?: XOR<PrivacySettingsNullableScalarRelationFilter, PrivacySettingsWhereInput> | null
    sentFriendRequests?: FriendshipListRelationFilter
    receivedFriendRequests?: FriendshipListRelationFilter
    storyProgress?: UserStoryProgressListRelationFilter
    legendProgress?: UserLegendProgressListRelationFilter
    milestoneProgress?: UserMilestoneProgressListRelationFilter
    catclawProgress?: XOR<UserCatclawProgressNullableScalarRelationFilter, UserCatclawProgressWhereInput> | null
    meowMedalProgress?: UserMeowMedalListRelationFilter
  }, "id" | "username" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    username?: SortOrder
    email?: SortOrderInput | SortOrder
    passwordHash?: SortOrder
    displayName?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    username?: StringWithAggregatesFilter<"User"> | string
    email?: StringNullableWithAggregatesFilter<"User"> | string | null
    passwordHash?: StringWithAggregatesFilter<"User"> | string
    displayName?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type PrivacySettingsWhereInput = {
    AND?: PrivacySettingsWhereInput | PrivacySettingsWhereInput[]
    OR?: PrivacySettingsWhereInput[]
    NOT?: PrivacySettingsWhereInput | PrivacySettingsWhereInput[]
    userId?: StringFilter<"PrivacySettings"> | string
    profileVisibility?: EnumVisibilityFilter<"PrivacySettings"> | $Enums.Visibility
    progressVisibility?: EnumVisibilityFilter<"PrivacySettings"> | $Enums.Visibility
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type PrivacySettingsOrderByWithRelationInput = {
    userId?: SortOrder
    profileVisibility?: SortOrder
    progressVisibility?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type PrivacySettingsWhereUniqueInput = Prisma.AtLeast<{
    userId?: string
    AND?: PrivacySettingsWhereInput | PrivacySettingsWhereInput[]
    OR?: PrivacySettingsWhereInput[]
    NOT?: PrivacySettingsWhereInput | PrivacySettingsWhereInput[]
    profileVisibility?: EnumVisibilityFilter<"PrivacySettings"> | $Enums.Visibility
    progressVisibility?: EnumVisibilityFilter<"PrivacySettings"> | $Enums.Visibility
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "userId">

  export type PrivacySettingsOrderByWithAggregationInput = {
    userId?: SortOrder
    profileVisibility?: SortOrder
    progressVisibility?: SortOrder
    _count?: PrivacySettingsCountOrderByAggregateInput
    _max?: PrivacySettingsMaxOrderByAggregateInput
    _min?: PrivacySettingsMinOrderByAggregateInput
  }

  export type PrivacySettingsScalarWhereWithAggregatesInput = {
    AND?: PrivacySettingsScalarWhereWithAggregatesInput | PrivacySettingsScalarWhereWithAggregatesInput[]
    OR?: PrivacySettingsScalarWhereWithAggregatesInput[]
    NOT?: PrivacySettingsScalarWhereWithAggregatesInput | PrivacySettingsScalarWhereWithAggregatesInput[]
    userId?: StringWithAggregatesFilter<"PrivacySettings"> | string
    profileVisibility?: EnumVisibilityWithAggregatesFilter<"PrivacySettings"> | $Enums.Visibility
    progressVisibility?: EnumVisibilityWithAggregatesFilter<"PrivacySettings"> | $Enums.Visibility
  }

  export type FriendshipWhereInput = {
    AND?: FriendshipWhereInput | FriendshipWhereInput[]
    OR?: FriendshipWhereInput[]
    NOT?: FriendshipWhereInput | FriendshipWhereInput[]
    id?: StringFilter<"Friendship"> | string
    requesterId?: StringFilter<"Friendship"> | string
    addresseeId?: StringFilter<"Friendship"> | string
    status?: EnumFriendshipStatusFilter<"Friendship"> | $Enums.FriendshipStatus
    createdAt?: DateTimeFilter<"Friendship"> | Date | string
    updatedAt?: DateTimeFilter<"Friendship"> | Date | string
    requester?: XOR<UserScalarRelationFilter, UserWhereInput>
    addressee?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type FriendshipOrderByWithRelationInput = {
    id?: SortOrder
    requesterId?: SortOrder
    addresseeId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    requester?: UserOrderByWithRelationInput
    addressee?: UserOrderByWithRelationInput
  }

  export type FriendshipWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    requesterId_addresseeId?: FriendshipRequesterIdAddresseeIdCompoundUniqueInput
    AND?: FriendshipWhereInput | FriendshipWhereInput[]
    OR?: FriendshipWhereInput[]
    NOT?: FriendshipWhereInput | FriendshipWhereInput[]
    requesterId?: StringFilter<"Friendship"> | string
    addresseeId?: StringFilter<"Friendship"> | string
    status?: EnumFriendshipStatusFilter<"Friendship"> | $Enums.FriendshipStatus
    createdAt?: DateTimeFilter<"Friendship"> | Date | string
    updatedAt?: DateTimeFilter<"Friendship"> | Date | string
    requester?: XOR<UserScalarRelationFilter, UserWhereInput>
    addressee?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "requesterId_addresseeId">

  export type FriendshipOrderByWithAggregationInput = {
    id?: SortOrder
    requesterId?: SortOrder
    addresseeId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: FriendshipCountOrderByAggregateInput
    _max?: FriendshipMaxOrderByAggregateInput
    _min?: FriendshipMinOrderByAggregateInput
  }

  export type FriendshipScalarWhereWithAggregatesInput = {
    AND?: FriendshipScalarWhereWithAggregatesInput | FriendshipScalarWhereWithAggregatesInput[]
    OR?: FriendshipScalarWhereWithAggregatesInput[]
    NOT?: FriendshipScalarWhereWithAggregatesInput | FriendshipScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Friendship"> | string
    requesterId?: StringWithAggregatesFilter<"Friendship"> | string
    addresseeId?: StringWithAggregatesFilter<"Friendship"> | string
    status?: EnumFriendshipStatusWithAggregatesFilter<"Friendship"> | $Enums.FriendshipStatus
    createdAt?: DateTimeWithAggregatesFilter<"Friendship"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Friendship"> | Date | string
  }

  export type StoryChapterWhereInput = {
    AND?: StoryChapterWhereInput | StoryChapterWhereInput[]
    OR?: StoryChapterWhereInput[]
    NOT?: StoryChapterWhereInput | StoryChapterWhereInput[]
    id?: StringFilter<"StoryChapter"> | string
    arc?: StringFilter<"StoryChapter"> | string
    chapterNumber?: IntFilter<"StoryChapter"> | number
    displayName?: StringFilter<"StoryChapter"> | string
    sortOrder?: IntFilter<"StoryChapter"> | number
    progress?: UserStoryProgressListRelationFilter
  }

  export type StoryChapterOrderByWithRelationInput = {
    id?: SortOrder
    arc?: SortOrder
    chapterNumber?: SortOrder
    displayName?: SortOrder
    sortOrder?: SortOrder
    progress?: UserStoryProgressOrderByRelationAggregateInput
  }

  export type StoryChapterWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    arc_chapterNumber?: StoryChapterArcChapterNumberCompoundUniqueInput
    AND?: StoryChapterWhereInput | StoryChapterWhereInput[]
    OR?: StoryChapterWhereInput[]
    NOT?: StoryChapterWhereInput | StoryChapterWhereInput[]
    arc?: StringFilter<"StoryChapter"> | string
    chapterNumber?: IntFilter<"StoryChapter"> | number
    displayName?: StringFilter<"StoryChapter"> | string
    sortOrder?: IntFilter<"StoryChapter"> | number
    progress?: UserStoryProgressListRelationFilter
  }, "id" | "arc_chapterNumber">

  export type StoryChapterOrderByWithAggregationInput = {
    id?: SortOrder
    arc?: SortOrder
    chapterNumber?: SortOrder
    displayName?: SortOrder
    sortOrder?: SortOrder
    _count?: StoryChapterCountOrderByAggregateInput
    _avg?: StoryChapterAvgOrderByAggregateInput
    _max?: StoryChapterMaxOrderByAggregateInput
    _min?: StoryChapterMinOrderByAggregateInput
    _sum?: StoryChapterSumOrderByAggregateInput
  }

  export type StoryChapterScalarWhereWithAggregatesInput = {
    AND?: StoryChapterScalarWhereWithAggregatesInput | StoryChapterScalarWhereWithAggregatesInput[]
    OR?: StoryChapterScalarWhereWithAggregatesInput[]
    NOT?: StoryChapterScalarWhereWithAggregatesInput | StoryChapterScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"StoryChapter"> | string
    arc?: StringWithAggregatesFilter<"StoryChapter"> | string
    chapterNumber?: IntWithAggregatesFilter<"StoryChapter"> | number
    displayName?: StringWithAggregatesFilter<"StoryChapter"> | string
    sortOrder?: IntWithAggregatesFilter<"StoryChapter"> | number
  }

  export type UserStoryProgressWhereInput = {
    AND?: UserStoryProgressWhereInput | UserStoryProgressWhereInput[]
    OR?: UserStoryProgressWhereInput[]
    NOT?: UserStoryProgressWhereInput | UserStoryProgressWhereInput[]
    id?: StringFilter<"UserStoryProgress"> | string
    userId?: StringFilter<"UserStoryProgress"> | string
    storyChapterId?: StringFilter<"UserStoryProgress"> | string
    cleared?: BoolFilter<"UserStoryProgress"> | boolean
    treasures?: EnumTreasureStatusFilter<"UserStoryProgress"> | $Enums.TreasureStatus
    zombies?: EnumZombieStatusFilter<"UserStoryProgress"> | $Enums.ZombieStatus
    updatedAt?: DateTimeFilter<"UserStoryProgress"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    chapter?: XOR<StoryChapterScalarRelationFilter, StoryChapterWhereInput>
  }

  export type UserStoryProgressOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    storyChapterId?: SortOrder
    cleared?: SortOrder
    treasures?: SortOrder
    zombies?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    chapter?: StoryChapterOrderByWithRelationInput
  }

  export type UserStoryProgressWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_storyChapterId?: UserStoryProgressUserIdStoryChapterIdCompoundUniqueInput
    AND?: UserStoryProgressWhereInput | UserStoryProgressWhereInput[]
    OR?: UserStoryProgressWhereInput[]
    NOT?: UserStoryProgressWhereInput | UserStoryProgressWhereInput[]
    userId?: StringFilter<"UserStoryProgress"> | string
    storyChapterId?: StringFilter<"UserStoryProgress"> | string
    cleared?: BoolFilter<"UserStoryProgress"> | boolean
    treasures?: EnumTreasureStatusFilter<"UserStoryProgress"> | $Enums.TreasureStatus
    zombies?: EnumZombieStatusFilter<"UserStoryProgress"> | $Enums.ZombieStatus
    updatedAt?: DateTimeFilter<"UserStoryProgress"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    chapter?: XOR<StoryChapterScalarRelationFilter, StoryChapterWhereInput>
  }, "id" | "userId_storyChapterId">

  export type UserStoryProgressOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    storyChapterId?: SortOrder
    cleared?: SortOrder
    treasures?: SortOrder
    zombies?: SortOrder
    updatedAt?: SortOrder
    _count?: UserStoryProgressCountOrderByAggregateInput
    _max?: UserStoryProgressMaxOrderByAggregateInput
    _min?: UserStoryProgressMinOrderByAggregateInput
  }

  export type UserStoryProgressScalarWhereWithAggregatesInput = {
    AND?: UserStoryProgressScalarWhereWithAggregatesInput | UserStoryProgressScalarWhereWithAggregatesInput[]
    OR?: UserStoryProgressScalarWhereWithAggregatesInput[]
    NOT?: UserStoryProgressScalarWhereWithAggregatesInput | UserStoryProgressScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserStoryProgress"> | string
    userId?: StringWithAggregatesFilter<"UserStoryProgress"> | string
    storyChapterId?: StringWithAggregatesFilter<"UserStoryProgress"> | string
    cleared?: BoolWithAggregatesFilter<"UserStoryProgress"> | boolean
    treasures?: EnumTreasureStatusWithAggregatesFilter<"UserStoryProgress"> | $Enums.TreasureStatus
    zombies?: EnumZombieStatusWithAggregatesFilter<"UserStoryProgress"> | $Enums.ZombieStatus
    updatedAt?: DateTimeWithAggregatesFilter<"UserStoryProgress"> | Date | string
  }

  export type LegendSagaWhereInput = {
    AND?: LegendSagaWhereInput | LegendSagaWhereInput[]
    OR?: LegendSagaWhereInput[]
    NOT?: LegendSagaWhereInput | LegendSagaWhereInput[]
    id?: StringFilter<"LegendSaga"> | string
    displayName?: StringFilter<"LegendSaga"> | string
    sortOrder?: IntFilter<"LegendSaga"> | number
    subchapters?: LegendSubchapterListRelationFilter
  }

  export type LegendSagaOrderByWithRelationInput = {
    id?: SortOrder
    displayName?: SortOrder
    sortOrder?: SortOrder
    subchapters?: LegendSubchapterOrderByRelationAggregateInput
  }

  export type LegendSagaWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LegendSagaWhereInput | LegendSagaWhereInput[]
    OR?: LegendSagaWhereInput[]
    NOT?: LegendSagaWhereInput | LegendSagaWhereInput[]
    displayName?: StringFilter<"LegendSaga"> | string
    sortOrder?: IntFilter<"LegendSaga"> | number
    subchapters?: LegendSubchapterListRelationFilter
  }, "id">

  export type LegendSagaOrderByWithAggregationInput = {
    id?: SortOrder
    displayName?: SortOrder
    sortOrder?: SortOrder
    _count?: LegendSagaCountOrderByAggregateInput
    _avg?: LegendSagaAvgOrderByAggregateInput
    _max?: LegendSagaMaxOrderByAggregateInput
    _min?: LegendSagaMinOrderByAggregateInput
    _sum?: LegendSagaSumOrderByAggregateInput
  }

  export type LegendSagaScalarWhereWithAggregatesInput = {
    AND?: LegendSagaScalarWhereWithAggregatesInput | LegendSagaScalarWhereWithAggregatesInput[]
    OR?: LegendSagaScalarWhereWithAggregatesInput[]
    NOT?: LegendSagaScalarWhereWithAggregatesInput | LegendSagaScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LegendSaga"> | string
    displayName?: StringWithAggregatesFilter<"LegendSaga"> | string
    sortOrder?: IntWithAggregatesFilter<"LegendSaga"> | number
  }

  export type LegendSubchapterWhereInput = {
    AND?: LegendSubchapterWhereInput | LegendSubchapterWhereInput[]
    OR?: LegendSubchapterWhereInput[]
    NOT?: LegendSubchapterWhereInput | LegendSubchapterWhereInput[]
    id?: StringFilter<"LegendSubchapter"> | string
    sagaId?: StringFilter<"LegendSubchapter"> | string
    displayName?: StringFilter<"LegendSubchapter"> | string
    sortOrder?: IntFilter<"LegendSubchapter"> | number
    saga?: XOR<LegendSagaScalarRelationFilter, LegendSagaWhereInput>
    progress?: UserLegendProgressListRelationFilter
  }

  export type LegendSubchapterOrderByWithRelationInput = {
    id?: SortOrder
    sagaId?: SortOrder
    displayName?: SortOrder
    sortOrder?: SortOrder
    saga?: LegendSagaOrderByWithRelationInput
    progress?: UserLegendProgressOrderByRelationAggregateInput
  }

  export type LegendSubchapterWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    sagaId_displayName?: LegendSubchapterSagaIdDisplayNameCompoundUniqueInput
    AND?: LegendSubchapterWhereInput | LegendSubchapterWhereInput[]
    OR?: LegendSubchapterWhereInput[]
    NOT?: LegendSubchapterWhereInput | LegendSubchapterWhereInput[]
    sagaId?: StringFilter<"LegendSubchapter"> | string
    displayName?: StringFilter<"LegendSubchapter"> | string
    sortOrder?: IntFilter<"LegendSubchapter"> | number
    saga?: XOR<LegendSagaScalarRelationFilter, LegendSagaWhereInput>
    progress?: UserLegendProgressListRelationFilter
  }, "id" | "sagaId_displayName">

  export type LegendSubchapterOrderByWithAggregationInput = {
    id?: SortOrder
    sagaId?: SortOrder
    displayName?: SortOrder
    sortOrder?: SortOrder
    _count?: LegendSubchapterCountOrderByAggregateInput
    _avg?: LegendSubchapterAvgOrderByAggregateInput
    _max?: LegendSubchapterMaxOrderByAggregateInput
    _min?: LegendSubchapterMinOrderByAggregateInput
    _sum?: LegendSubchapterSumOrderByAggregateInput
  }

  export type LegendSubchapterScalarWhereWithAggregatesInput = {
    AND?: LegendSubchapterScalarWhereWithAggregatesInput | LegendSubchapterScalarWhereWithAggregatesInput[]
    OR?: LegendSubchapterScalarWhereWithAggregatesInput[]
    NOT?: LegendSubchapterScalarWhereWithAggregatesInput | LegendSubchapterScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LegendSubchapter"> | string
    sagaId?: StringWithAggregatesFilter<"LegendSubchapter"> | string
    displayName?: StringWithAggregatesFilter<"LegendSubchapter"> | string
    sortOrder?: IntWithAggregatesFilter<"LegendSubchapter"> | number
  }

  export type UserLegendProgressWhereInput = {
    AND?: UserLegendProgressWhereInput | UserLegendProgressWhereInput[]
    OR?: UserLegendProgressWhereInput[]
    NOT?: UserLegendProgressWhereInput | UserLegendProgressWhereInput[]
    id?: StringFilter<"UserLegendProgress"> | string
    userId?: StringFilter<"UserLegendProgress"> | string
    subchapterId?: StringFilter<"UserLegendProgress"> | string
    status?: EnumLegendProgressStatusFilter<"UserLegendProgress"> | $Enums.LegendProgressStatus
    crownMax?: IntNullableFilter<"UserLegendProgress"> | number | null
    notes?: StringNullableFilter<"UserLegendProgress"> | string | null
    updatedAt?: DateTimeFilter<"UserLegendProgress"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    subchapter?: XOR<LegendSubchapterScalarRelationFilter, LegendSubchapterWhereInput>
  }

  export type UserLegendProgressOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    subchapterId?: SortOrder
    status?: SortOrder
    crownMax?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    subchapter?: LegendSubchapterOrderByWithRelationInput
  }

  export type UserLegendProgressWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_subchapterId?: UserLegendProgressUserIdSubchapterIdCompoundUniqueInput
    AND?: UserLegendProgressWhereInput | UserLegendProgressWhereInput[]
    OR?: UserLegendProgressWhereInput[]
    NOT?: UserLegendProgressWhereInput | UserLegendProgressWhereInput[]
    userId?: StringFilter<"UserLegendProgress"> | string
    subchapterId?: StringFilter<"UserLegendProgress"> | string
    status?: EnumLegendProgressStatusFilter<"UserLegendProgress"> | $Enums.LegendProgressStatus
    crownMax?: IntNullableFilter<"UserLegendProgress"> | number | null
    notes?: StringNullableFilter<"UserLegendProgress"> | string | null
    updatedAt?: DateTimeFilter<"UserLegendProgress"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    subchapter?: XOR<LegendSubchapterScalarRelationFilter, LegendSubchapterWhereInput>
  }, "id" | "userId_subchapterId">

  export type UserLegendProgressOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    subchapterId?: SortOrder
    status?: SortOrder
    crownMax?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    _count?: UserLegendProgressCountOrderByAggregateInput
    _avg?: UserLegendProgressAvgOrderByAggregateInput
    _max?: UserLegendProgressMaxOrderByAggregateInput
    _min?: UserLegendProgressMinOrderByAggregateInput
    _sum?: UserLegendProgressSumOrderByAggregateInput
  }

  export type UserLegendProgressScalarWhereWithAggregatesInput = {
    AND?: UserLegendProgressScalarWhereWithAggregatesInput | UserLegendProgressScalarWhereWithAggregatesInput[]
    OR?: UserLegendProgressScalarWhereWithAggregatesInput[]
    NOT?: UserLegendProgressScalarWhereWithAggregatesInput | UserLegendProgressScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserLegendProgress"> | string
    userId?: StringWithAggregatesFilter<"UserLegendProgress"> | string
    subchapterId?: StringWithAggregatesFilter<"UserLegendProgress"> | string
    status?: EnumLegendProgressStatusWithAggregatesFilter<"UserLegendProgress"> | $Enums.LegendProgressStatus
    crownMax?: IntNullableWithAggregatesFilter<"UserLegendProgress"> | number | null
    notes?: StringNullableWithAggregatesFilter<"UserLegendProgress"> | string | null
    updatedAt?: DateTimeWithAggregatesFilter<"UserLegendProgress"> | Date | string
  }

  export type MilestoneWhereInput = {
    AND?: MilestoneWhereInput | MilestoneWhereInput[]
    OR?: MilestoneWhereInput[]
    NOT?: MilestoneWhereInput | MilestoneWhereInput[]
    id?: StringFilter<"Milestone"> | string
    category?: EnumMilestoneCategoryFilter<"Milestone"> | $Enums.MilestoneCategory
    displayName?: StringFilter<"Milestone"> | string
    sortOrder?: IntFilter<"Milestone"> | number
    progress?: UserMilestoneProgressListRelationFilter
  }

  export type MilestoneOrderByWithRelationInput = {
    id?: SortOrder
    category?: SortOrder
    displayName?: SortOrder
    sortOrder?: SortOrder
    progress?: UserMilestoneProgressOrderByRelationAggregateInput
  }

  export type MilestoneWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MilestoneWhereInput | MilestoneWhereInput[]
    OR?: MilestoneWhereInput[]
    NOT?: MilestoneWhereInput | MilestoneWhereInput[]
    category?: EnumMilestoneCategoryFilter<"Milestone"> | $Enums.MilestoneCategory
    displayName?: StringFilter<"Milestone"> | string
    sortOrder?: IntFilter<"Milestone"> | number
    progress?: UserMilestoneProgressListRelationFilter
  }, "id">

  export type MilestoneOrderByWithAggregationInput = {
    id?: SortOrder
    category?: SortOrder
    displayName?: SortOrder
    sortOrder?: SortOrder
    _count?: MilestoneCountOrderByAggregateInput
    _avg?: MilestoneAvgOrderByAggregateInput
    _max?: MilestoneMaxOrderByAggregateInput
    _min?: MilestoneMinOrderByAggregateInput
    _sum?: MilestoneSumOrderByAggregateInput
  }

  export type MilestoneScalarWhereWithAggregatesInput = {
    AND?: MilestoneScalarWhereWithAggregatesInput | MilestoneScalarWhereWithAggregatesInput[]
    OR?: MilestoneScalarWhereWithAggregatesInput[]
    NOT?: MilestoneScalarWhereWithAggregatesInput | MilestoneScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Milestone"> | string
    category?: EnumMilestoneCategoryWithAggregatesFilter<"Milestone"> | $Enums.MilestoneCategory
    displayName?: StringWithAggregatesFilter<"Milestone"> | string
    sortOrder?: IntWithAggregatesFilter<"Milestone"> | number
  }

  export type UserMilestoneProgressWhereInput = {
    AND?: UserMilestoneProgressWhereInput | UserMilestoneProgressWhereInput[]
    OR?: UserMilestoneProgressWhereInput[]
    NOT?: UserMilestoneProgressWhereInput | UserMilestoneProgressWhereInput[]
    id?: StringFilter<"UserMilestoneProgress"> | string
    userId?: StringFilter<"UserMilestoneProgress"> | string
    milestoneId?: StringFilter<"UserMilestoneProgress"> | string
    cleared?: BoolFilter<"UserMilestoneProgress"> | boolean
    notes?: StringNullableFilter<"UserMilestoneProgress"> | string | null
    updatedAt?: DateTimeFilter<"UserMilestoneProgress"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    milestone?: XOR<MilestoneScalarRelationFilter, MilestoneWhereInput>
  }

  export type UserMilestoneProgressOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    milestoneId?: SortOrder
    cleared?: SortOrder
    notes?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    milestone?: MilestoneOrderByWithRelationInput
  }

  export type UserMilestoneProgressWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_milestoneId?: UserMilestoneProgressUserIdMilestoneIdCompoundUniqueInput
    AND?: UserMilestoneProgressWhereInput | UserMilestoneProgressWhereInput[]
    OR?: UserMilestoneProgressWhereInput[]
    NOT?: UserMilestoneProgressWhereInput | UserMilestoneProgressWhereInput[]
    userId?: StringFilter<"UserMilestoneProgress"> | string
    milestoneId?: StringFilter<"UserMilestoneProgress"> | string
    cleared?: BoolFilter<"UserMilestoneProgress"> | boolean
    notes?: StringNullableFilter<"UserMilestoneProgress"> | string | null
    updatedAt?: DateTimeFilter<"UserMilestoneProgress"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    milestone?: XOR<MilestoneScalarRelationFilter, MilestoneWhereInput>
  }, "id" | "userId_milestoneId">

  export type UserMilestoneProgressOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    milestoneId?: SortOrder
    cleared?: SortOrder
    notes?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    _count?: UserMilestoneProgressCountOrderByAggregateInput
    _max?: UserMilestoneProgressMaxOrderByAggregateInput
    _min?: UserMilestoneProgressMinOrderByAggregateInput
  }

  export type UserMilestoneProgressScalarWhereWithAggregatesInput = {
    AND?: UserMilestoneProgressScalarWhereWithAggregatesInput | UserMilestoneProgressScalarWhereWithAggregatesInput[]
    OR?: UserMilestoneProgressScalarWhereWithAggregatesInput[]
    NOT?: UserMilestoneProgressScalarWhereWithAggregatesInput | UserMilestoneProgressScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserMilestoneProgress"> | string
    userId?: StringWithAggregatesFilter<"UserMilestoneProgress"> | string
    milestoneId?: StringWithAggregatesFilter<"UserMilestoneProgress"> | string
    cleared?: BoolWithAggregatesFilter<"UserMilestoneProgress"> | boolean
    notes?: StringNullableWithAggregatesFilter<"UserMilestoneProgress"> | string | null
    updatedAt?: DateTimeWithAggregatesFilter<"UserMilestoneProgress"> | Date | string
  }

  export type UserCatclawProgressWhereInput = {
    AND?: UserCatclawProgressWhereInput | UserCatclawProgressWhereInput[]
    OR?: UserCatclawProgressWhereInput[]
    NOT?: UserCatclawProgressWhereInput | UserCatclawProgressWhereInput[]
    id?: StringFilter<"UserCatclawProgress"> | string
    userId?: StringFilter<"UserCatclawProgress"> | string
    currentRank?: StringNullableFilter<"UserCatclawProgress"> | string | null
    bestRank?: StringNullableFilter<"UserCatclawProgress"> | string | null
    notes?: StringNullableFilter<"UserCatclawProgress"> | string | null
    updatedAt?: DateTimeFilter<"UserCatclawProgress"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type UserCatclawProgressOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    currentRank?: SortOrderInput | SortOrder
    bestRank?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type UserCatclawProgressWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId?: string
    AND?: UserCatclawProgressWhereInput | UserCatclawProgressWhereInput[]
    OR?: UserCatclawProgressWhereInput[]
    NOT?: UserCatclawProgressWhereInput | UserCatclawProgressWhereInput[]
    currentRank?: StringNullableFilter<"UserCatclawProgress"> | string | null
    bestRank?: StringNullableFilter<"UserCatclawProgress"> | string | null
    notes?: StringNullableFilter<"UserCatclawProgress"> | string | null
    updatedAt?: DateTimeFilter<"UserCatclawProgress"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId">

  export type UserCatclawProgressOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    currentRank?: SortOrderInput | SortOrder
    bestRank?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    _count?: UserCatclawProgressCountOrderByAggregateInput
    _max?: UserCatclawProgressMaxOrderByAggregateInput
    _min?: UserCatclawProgressMinOrderByAggregateInput
  }

  export type UserCatclawProgressScalarWhereWithAggregatesInput = {
    AND?: UserCatclawProgressScalarWhereWithAggregatesInput | UserCatclawProgressScalarWhereWithAggregatesInput[]
    OR?: UserCatclawProgressScalarWhereWithAggregatesInput[]
    NOT?: UserCatclawProgressScalarWhereWithAggregatesInput | UserCatclawProgressScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserCatclawProgress"> | string
    userId?: StringWithAggregatesFilter<"UserCatclawProgress"> | string
    currentRank?: StringNullableWithAggregatesFilter<"UserCatclawProgress"> | string | null
    bestRank?: StringNullableWithAggregatesFilter<"UserCatclawProgress"> | string | null
    notes?: StringNullableWithAggregatesFilter<"UserCatclawProgress"> | string | null
    updatedAt?: DateTimeWithAggregatesFilter<"UserCatclawProgress"> | Date | string
  }

  export type MeowMedalWhereInput = {
    AND?: MeowMedalWhereInput | MeowMedalWhereInput[]
    OR?: MeowMedalWhereInput[]
    NOT?: MeowMedalWhereInput | MeowMedalWhereInput[]
    id?: StringFilter<"MeowMedal"> | string
    name?: StringFilter<"MeowMedal"> | string
    requirementText?: StringNullableFilter<"MeowMedal"> | string | null
    description?: StringNullableFilter<"MeowMedal"> | string | null
    category?: StringNullableFilter<"MeowMedal"> | string | null
    sortOrder?: IntNullableFilter<"MeowMedal"> | number | null
    sourceUrl?: StringNullableFilter<"MeowMedal"> | string | null
    imageFile?: StringNullableFilter<"MeowMedal"> | string | null
    autoKey?: StringNullableFilter<"MeowMedal"> | string | null
    updatedAt?: DateTimeFilter<"MeowMedal"> | Date | string
    earnedBy?: UserMeowMedalListRelationFilter
  }

  export type MeowMedalOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    requirementText?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    category?: SortOrderInput | SortOrder
    sortOrder?: SortOrderInput | SortOrder
    sourceUrl?: SortOrderInput | SortOrder
    imageFile?: SortOrderInput | SortOrder
    autoKey?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    earnedBy?: UserMeowMedalOrderByRelationAggregateInput
  }

  export type MeowMedalWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    autoKey?: string
    AND?: MeowMedalWhereInput | MeowMedalWhereInput[]
    OR?: MeowMedalWhereInput[]
    NOT?: MeowMedalWhereInput | MeowMedalWhereInput[]
    requirementText?: StringNullableFilter<"MeowMedal"> | string | null
    description?: StringNullableFilter<"MeowMedal"> | string | null
    category?: StringNullableFilter<"MeowMedal"> | string | null
    sortOrder?: IntNullableFilter<"MeowMedal"> | number | null
    sourceUrl?: StringNullableFilter<"MeowMedal"> | string | null
    imageFile?: StringNullableFilter<"MeowMedal"> | string | null
    updatedAt?: DateTimeFilter<"MeowMedal"> | Date | string
    earnedBy?: UserMeowMedalListRelationFilter
  }, "id" | "name" | "autoKey">

  export type MeowMedalOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    requirementText?: SortOrderInput | SortOrder
    description?: SortOrderInput | SortOrder
    category?: SortOrderInput | SortOrder
    sortOrder?: SortOrderInput | SortOrder
    sourceUrl?: SortOrderInput | SortOrder
    imageFile?: SortOrderInput | SortOrder
    autoKey?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    _count?: MeowMedalCountOrderByAggregateInput
    _avg?: MeowMedalAvgOrderByAggregateInput
    _max?: MeowMedalMaxOrderByAggregateInput
    _min?: MeowMedalMinOrderByAggregateInput
    _sum?: MeowMedalSumOrderByAggregateInput
  }

  export type MeowMedalScalarWhereWithAggregatesInput = {
    AND?: MeowMedalScalarWhereWithAggregatesInput | MeowMedalScalarWhereWithAggregatesInput[]
    OR?: MeowMedalScalarWhereWithAggregatesInput[]
    NOT?: MeowMedalScalarWhereWithAggregatesInput | MeowMedalScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MeowMedal"> | string
    name?: StringWithAggregatesFilter<"MeowMedal"> | string
    requirementText?: StringNullableWithAggregatesFilter<"MeowMedal"> | string | null
    description?: StringNullableWithAggregatesFilter<"MeowMedal"> | string | null
    category?: StringNullableWithAggregatesFilter<"MeowMedal"> | string | null
    sortOrder?: IntNullableWithAggregatesFilter<"MeowMedal"> | number | null
    sourceUrl?: StringNullableWithAggregatesFilter<"MeowMedal"> | string | null
    imageFile?: StringNullableWithAggregatesFilter<"MeowMedal"> | string | null
    autoKey?: StringNullableWithAggregatesFilter<"MeowMedal"> | string | null
    updatedAt?: DateTimeWithAggregatesFilter<"MeowMedal"> | Date | string
  }

  export type UserMeowMedalWhereInput = {
    AND?: UserMeowMedalWhereInput | UserMeowMedalWhereInput[]
    OR?: UserMeowMedalWhereInput[]
    NOT?: UserMeowMedalWhereInput | UserMeowMedalWhereInput[]
    id?: StringFilter<"UserMeowMedal"> | string
    userId?: StringFilter<"UserMeowMedal"> | string
    meowMedalId?: StringFilter<"UserMeowMedal"> | string
    earned?: BoolFilter<"UserMeowMedal"> | boolean
    earnedAt?: DateTimeNullableFilter<"UserMeowMedal"> | Date | string | null
    updatedAt?: DateTimeFilter<"UserMeowMedal"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    meowMedal?: XOR<MeowMedalScalarRelationFilter, MeowMedalWhereInput>
  }

  export type UserMeowMedalOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    meowMedalId?: SortOrder
    earned?: SortOrder
    earnedAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    meowMedal?: MeowMedalOrderByWithRelationInput
  }

  export type UserMeowMedalWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_meowMedalId?: UserMeowMedalUserIdMeowMedalIdCompoundUniqueInput
    AND?: UserMeowMedalWhereInput | UserMeowMedalWhereInput[]
    OR?: UserMeowMedalWhereInput[]
    NOT?: UserMeowMedalWhereInput | UserMeowMedalWhereInput[]
    userId?: StringFilter<"UserMeowMedal"> | string
    meowMedalId?: StringFilter<"UserMeowMedal"> | string
    earned?: BoolFilter<"UserMeowMedal"> | boolean
    earnedAt?: DateTimeNullableFilter<"UserMeowMedal"> | Date | string | null
    updatedAt?: DateTimeFilter<"UserMeowMedal"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    meowMedal?: XOR<MeowMedalScalarRelationFilter, MeowMedalWhereInput>
  }, "id" | "userId_meowMedalId">

  export type UserMeowMedalOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    meowMedalId?: SortOrder
    earned?: SortOrder
    earnedAt?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    _count?: UserMeowMedalCountOrderByAggregateInput
    _max?: UserMeowMedalMaxOrderByAggregateInput
    _min?: UserMeowMedalMinOrderByAggregateInput
  }

  export type UserMeowMedalScalarWhereWithAggregatesInput = {
    AND?: UserMeowMedalScalarWhereWithAggregatesInput | UserMeowMedalScalarWhereWithAggregatesInput[]
    OR?: UserMeowMedalScalarWhereWithAggregatesInput[]
    NOT?: UserMeowMedalScalarWhereWithAggregatesInput | UserMeowMedalScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserMeowMedal"> | string
    userId?: StringWithAggregatesFilter<"UserMeowMedal"> | string
    meowMedalId?: StringWithAggregatesFilter<"UserMeowMedal"> | string
    earned?: BoolWithAggregatesFilter<"UserMeowMedal"> | boolean
    earnedAt?: DateTimeNullableWithAggregatesFilter<"UserMeowMedal"> | Date | string | null
    updatedAt?: DateTimeWithAggregatesFilter<"UserMeowMedal"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    username: string
    email?: string | null
    passwordHash: string
    displayName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    privacy?: PrivacySettingsCreateNestedOneWithoutUserInput
    sentFriendRequests?: FriendshipCreateNestedManyWithoutRequesterInput
    receivedFriendRequests?: FriendshipCreateNestedManyWithoutAddresseeInput
    storyProgress?: UserStoryProgressCreateNestedManyWithoutUserInput
    legendProgress?: UserLegendProgressCreateNestedManyWithoutUserInput
    milestoneProgress?: UserMilestoneProgressCreateNestedManyWithoutUserInput
    catclawProgress?: UserCatclawProgressCreateNestedOneWithoutUserInput
    meowMedalProgress?: UserMeowMedalCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    username: string
    email?: string | null
    passwordHash: string
    displayName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    privacy?: PrivacySettingsUncheckedCreateNestedOneWithoutUserInput
    sentFriendRequests?: FriendshipUncheckedCreateNestedManyWithoutRequesterInput
    receivedFriendRequests?: FriendshipUncheckedCreateNestedManyWithoutAddresseeInput
    storyProgress?: UserStoryProgressUncheckedCreateNestedManyWithoutUserInput
    legendProgress?: UserLegendProgressUncheckedCreateNestedManyWithoutUserInput
    milestoneProgress?: UserMilestoneProgressUncheckedCreateNestedManyWithoutUserInput
    catclawProgress?: UserCatclawProgressUncheckedCreateNestedOneWithoutUserInput
    meowMedalProgress?: UserMeowMedalUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    privacy?: PrivacySettingsUpdateOneWithoutUserNestedInput
    sentFriendRequests?: FriendshipUpdateManyWithoutRequesterNestedInput
    receivedFriendRequests?: FriendshipUpdateManyWithoutAddresseeNestedInput
    storyProgress?: UserStoryProgressUpdateManyWithoutUserNestedInput
    legendProgress?: UserLegendProgressUpdateManyWithoutUserNestedInput
    milestoneProgress?: UserMilestoneProgressUpdateManyWithoutUserNestedInput
    catclawProgress?: UserCatclawProgressUpdateOneWithoutUserNestedInput
    meowMedalProgress?: UserMeowMedalUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    privacy?: PrivacySettingsUncheckedUpdateOneWithoutUserNestedInput
    sentFriendRequests?: FriendshipUncheckedUpdateManyWithoutRequesterNestedInput
    receivedFriendRequests?: FriendshipUncheckedUpdateManyWithoutAddresseeNestedInput
    storyProgress?: UserStoryProgressUncheckedUpdateManyWithoutUserNestedInput
    legendProgress?: UserLegendProgressUncheckedUpdateManyWithoutUserNestedInput
    milestoneProgress?: UserMilestoneProgressUncheckedUpdateManyWithoutUserNestedInput
    catclawProgress?: UserCatclawProgressUncheckedUpdateOneWithoutUserNestedInput
    meowMedalProgress?: UserMeowMedalUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    username: string
    email?: string | null
    passwordHash: string
    displayName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PrivacySettingsCreateInput = {
    profileVisibility?: $Enums.Visibility
    progressVisibility?: $Enums.Visibility
    user: UserCreateNestedOneWithoutPrivacyInput
  }

  export type PrivacySettingsUncheckedCreateInput = {
    userId: string
    profileVisibility?: $Enums.Visibility
    progressVisibility?: $Enums.Visibility
  }

  export type PrivacySettingsUpdateInput = {
    profileVisibility?: EnumVisibilityFieldUpdateOperationsInput | $Enums.Visibility
    progressVisibility?: EnumVisibilityFieldUpdateOperationsInput | $Enums.Visibility
    user?: UserUpdateOneRequiredWithoutPrivacyNestedInput
  }

  export type PrivacySettingsUncheckedUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    profileVisibility?: EnumVisibilityFieldUpdateOperationsInput | $Enums.Visibility
    progressVisibility?: EnumVisibilityFieldUpdateOperationsInput | $Enums.Visibility
  }

  export type PrivacySettingsCreateManyInput = {
    userId: string
    profileVisibility?: $Enums.Visibility
    progressVisibility?: $Enums.Visibility
  }

  export type PrivacySettingsUpdateManyMutationInput = {
    profileVisibility?: EnumVisibilityFieldUpdateOperationsInput | $Enums.Visibility
    progressVisibility?: EnumVisibilityFieldUpdateOperationsInput | $Enums.Visibility
  }

  export type PrivacySettingsUncheckedUpdateManyInput = {
    userId?: StringFieldUpdateOperationsInput | string
    profileVisibility?: EnumVisibilityFieldUpdateOperationsInput | $Enums.Visibility
    progressVisibility?: EnumVisibilityFieldUpdateOperationsInput | $Enums.Visibility
  }

  export type FriendshipCreateInput = {
    id?: string
    status?: $Enums.FriendshipStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    requester: UserCreateNestedOneWithoutSentFriendRequestsInput
    addressee: UserCreateNestedOneWithoutReceivedFriendRequestsInput
  }

  export type FriendshipUncheckedCreateInput = {
    id?: string
    requesterId: string
    addresseeId: string
    status?: $Enums.FriendshipStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FriendshipUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumFriendshipStatusFieldUpdateOperationsInput | $Enums.FriendshipStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requester?: UserUpdateOneRequiredWithoutSentFriendRequestsNestedInput
    addressee?: UserUpdateOneRequiredWithoutReceivedFriendRequestsNestedInput
  }

  export type FriendshipUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    requesterId?: StringFieldUpdateOperationsInput | string
    addresseeId?: StringFieldUpdateOperationsInput | string
    status?: EnumFriendshipStatusFieldUpdateOperationsInput | $Enums.FriendshipStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FriendshipCreateManyInput = {
    id?: string
    requesterId: string
    addresseeId: string
    status?: $Enums.FriendshipStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FriendshipUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumFriendshipStatusFieldUpdateOperationsInput | $Enums.FriendshipStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FriendshipUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    requesterId?: StringFieldUpdateOperationsInput | string
    addresseeId?: StringFieldUpdateOperationsInput | string
    status?: EnumFriendshipStatusFieldUpdateOperationsInput | $Enums.FriendshipStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StoryChapterCreateInput = {
    id?: string
    arc: string
    chapterNumber: number
    displayName: string
    sortOrder: number
    progress?: UserStoryProgressCreateNestedManyWithoutChapterInput
  }

  export type StoryChapterUncheckedCreateInput = {
    id?: string
    arc: string
    chapterNumber: number
    displayName: string
    sortOrder: number
    progress?: UserStoryProgressUncheckedCreateNestedManyWithoutChapterInput
  }

  export type StoryChapterUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    arc?: StringFieldUpdateOperationsInput | string
    chapterNumber?: IntFieldUpdateOperationsInput | number
    displayName?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    progress?: UserStoryProgressUpdateManyWithoutChapterNestedInput
  }

  export type StoryChapterUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    arc?: StringFieldUpdateOperationsInput | string
    chapterNumber?: IntFieldUpdateOperationsInput | number
    displayName?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    progress?: UserStoryProgressUncheckedUpdateManyWithoutChapterNestedInput
  }

  export type StoryChapterCreateManyInput = {
    id?: string
    arc: string
    chapterNumber: number
    displayName: string
    sortOrder: number
  }

  export type StoryChapterUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    arc?: StringFieldUpdateOperationsInput | string
    chapterNumber?: IntFieldUpdateOperationsInput | number
    displayName?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
  }

  export type StoryChapterUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    arc?: StringFieldUpdateOperationsInput | string
    chapterNumber?: IntFieldUpdateOperationsInput | number
    displayName?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
  }

  export type UserStoryProgressCreateInput = {
    id?: string
    cleared?: boolean
    treasures?: $Enums.TreasureStatus
    zombies?: $Enums.ZombieStatus
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutStoryProgressInput
    chapter: StoryChapterCreateNestedOneWithoutProgressInput
  }

  export type UserStoryProgressUncheckedCreateInput = {
    id?: string
    userId: string
    storyChapterId: string
    cleared?: boolean
    treasures?: $Enums.TreasureStatus
    zombies?: $Enums.ZombieStatus
    updatedAt?: Date | string
  }

  export type UserStoryProgressUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    cleared?: BoolFieldUpdateOperationsInput | boolean
    treasures?: EnumTreasureStatusFieldUpdateOperationsInput | $Enums.TreasureStatus
    zombies?: EnumZombieStatusFieldUpdateOperationsInput | $Enums.ZombieStatus
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutStoryProgressNestedInput
    chapter?: StoryChapterUpdateOneRequiredWithoutProgressNestedInput
  }

  export type UserStoryProgressUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    storyChapterId?: StringFieldUpdateOperationsInput | string
    cleared?: BoolFieldUpdateOperationsInput | boolean
    treasures?: EnumTreasureStatusFieldUpdateOperationsInput | $Enums.TreasureStatus
    zombies?: EnumZombieStatusFieldUpdateOperationsInput | $Enums.ZombieStatus
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserStoryProgressCreateManyInput = {
    id?: string
    userId: string
    storyChapterId: string
    cleared?: boolean
    treasures?: $Enums.TreasureStatus
    zombies?: $Enums.ZombieStatus
    updatedAt?: Date | string
  }

  export type UserStoryProgressUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    cleared?: BoolFieldUpdateOperationsInput | boolean
    treasures?: EnumTreasureStatusFieldUpdateOperationsInput | $Enums.TreasureStatus
    zombies?: EnumZombieStatusFieldUpdateOperationsInput | $Enums.ZombieStatus
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserStoryProgressUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    storyChapterId?: StringFieldUpdateOperationsInput | string
    cleared?: BoolFieldUpdateOperationsInput | boolean
    treasures?: EnumTreasureStatusFieldUpdateOperationsInput | $Enums.TreasureStatus
    zombies?: EnumZombieStatusFieldUpdateOperationsInput | $Enums.ZombieStatus
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LegendSagaCreateInput = {
    id?: string
    displayName: string
    sortOrder: number
    subchapters?: LegendSubchapterCreateNestedManyWithoutSagaInput
  }

  export type LegendSagaUncheckedCreateInput = {
    id?: string
    displayName: string
    sortOrder: number
    subchapters?: LegendSubchapterUncheckedCreateNestedManyWithoutSagaInput
  }

  export type LegendSagaUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    subchapters?: LegendSubchapterUpdateManyWithoutSagaNestedInput
  }

  export type LegendSagaUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    subchapters?: LegendSubchapterUncheckedUpdateManyWithoutSagaNestedInput
  }

  export type LegendSagaCreateManyInput = {
    id?: string
    displayName: string
    sortOrder: number
  }

  export type LegendSagaUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
  }

  export type LegendSagaUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
  }

  export type LegendSubchapterCreateInput = {
    id?: string
    displayName: string
    sortOrder: number
    saga: LegendSagaCreateNestedOneWithoutSubchaptersInput
    progress?: UserLegendProgressCreateNestedManyWithoutSubchapterInput
  }

  export type LegendSubchapterUncheckedCreateInput = {
    id?: string
    sagaId: string
    displayName: string
    sortOrder: number
    progress?: UserLegendProgressUncheckedCreateNestedManyWithoutSubchapterInput
  }

  export type LegendSubchapterUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    saga?: LegendSagaUpdateOneRequiredWithoutSubchaptersNestedInput
    progress?: UserLegendProgressUpdateManyWithoutSubchapterNestedInput
  }

  export type LegendSubchapterUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    sagaId?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    progress?: UserLegendProgressUncheckedUpdateManyWithoutSubchapterNestedInput
  }

  export type LegendSubchapterCreateManyInput = {
    id?: string
    sagaId: string
    displayName: string
    sortOrder: number
  }

  export type LegendSubchapterUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
  }

  export type LegendSubchapterUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    sagaId?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
  }

  export type UserLegendProgressCreateInput = {
    id?: string
    status?: $Enums.LegendProgressStatus
    crownMax?: number | null
    notes?: string | null
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutLegendProgressInput
    subchapter: LegendSubchapterCreateNestedOneWithoutProgressInput
  }

  export type UserLegendProgressUncheckedCreateInput = {
    id?: string
    userId: string
    subchapterId: string
    status?: $Enums.LegendProgressStatus
    crownMax?: number | null
    notes?: string | null
    updatedAt?: Date | string
  }

  export type UserLegendProgressUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumLegendProgressStatusFieldUpdateOperationsInput | $Enums.LegendProgressStatus
    crownMax?: NullableIntFieldUpdateOperationsInput | number | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutLegendProgressNestedInput
    subchapter?: LegendSubchapterUpdateOneRequiredWithoutProgressNestedInput
  }

  export type UserLegendProgressUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    subchapterId?: StringFieldUpdateOperationsInput | string
    status?: EnumLegendProgressStatusFieldUpdateOperationsInput | $Enums.LegendProgressStatus
    crownMax?: NullableIntFieldUpdateOperationsInput | number | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserLegendProgressCreateManyInput = {
    id?: string
    userId: string
    subchapterId: string
    status?: $Enums.LegendProgressStatus
    crownMax?: number | null
    notes?: string | null
    updatedAt?: Date | string
  }

  export type UserLegendProgressUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumLegendProgressStatusFieldUpdateOperationsInput | $Enums.LegendProgressStatus
    crownMax?: NullableIntFieldUpdateOperationsInput | number | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserLegendProgressUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    subchapterId?: StringFieldUpdateOperationsInput | string
    status?: EnumLegendProgressStatusFieldUpdateOperationsInput | $Enums.LegendProgressStatus
    crownMax?: NullableIntFieldUpdateOperationsInput | number | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MilestoneCreateInput = {
    id?: string
    category: $Enums.MilestoneCategory
    displayName: string
    sortOrder: number
    progress?: UserMilestoneProgressCreateNestedManyWithoutMilestoneInput
  }

  export type MilestoneUncheckedCreateInput = {
    id?: string
    category: $Enums.MilestoneCategory
    displayName: string
    sortOrder: number
    progress?: UserMilestoneProgressUncheckedCreateNestedManyWithoutMilestoneInput
  }

  export type MilestoneUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    category?: EnumMilestoneCategoryFieldUpdateOperationsInput | $Enums.MilestoneCategory
    displayName?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    progress?: UserMilestoneProgressUpdateManyWithoutMilestoneNestedInput
  }

  export type MilestoneUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    category?: EnumMilestoneCategoryFieldUpdateOperationsInput | $Enums.MilestoneCategory
    displayName?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    progress?: UserMilestoneProgressUncheckedUpdateManyWithoutMilestoneNestedInput
  }

  export type MilestoneCreateManyInput = {
    id?: string
    category: $Enums.MilestoneCategory
    displayName: string
    sortOrder: number
  }

  export type MilestoneUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    category?: EnumMilestoneCategoryFieldUpdateOperationsInput | $Enums.MilestoneCategory
    displayName?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
  }

  export type MilestoneUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    category?: EnumMilestoneCategoryFieldUpdateOperationsInput | $Enums.MilestoneCategory
    displayName?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
  }

  export type UserMilestoneProgressCreateInput = {
    id?: string
    cleared?: boolean
    notes?: string | null
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutMilestoneProgressInput
    milestone: MilestoneCreateNestedOneWithoutProgressInput
  }

  export type UserMilestoneProgressUncheckedCreateInput = {
    id?: string
    userId: string
    milestoneId: string
    cleared?: boolean
    notes?: string | null
    updatedAt?: Date | string
  }

  export type UserMilestoneProgressUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    cleared?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutMilestoneProgressNestedInput
    milestone?: MilestoneUpdateOneRequiredWithoutProgressNestedInput
  }

  export type UserMilestoneProgressUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    milestoneId?: StringFieldUpdateOperationsInput | string
    cleared?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserMilestoneProgressCreateManyInput = {
    id?: string
    userId: string
    milestoneId: string
    cleared?: boolean
    notes?: string | null
    updatedAt?: Date | string
  }

  export type UserMilestoneProgressUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    cleared?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserMilestoneProgressUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    milestoneId?: StringFieldUpdateOperationsInput | string
    cleared?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCatclawProgressCreateInput = {
    id?: string
    currentRank?: string | null
    bestRank?: string | null
    notes?: string | null
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutCatclawProgressInput
  }

  export type UserCatclawProgressUncheckedCreateInput = {
    id?: string
    userId: string
    currentRank?: string | null
    bestRank?: string | null
    notes?: string | null
    updatedAt?: Date | string
  }

  export type UserCatclawProgressUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    currentRank?: NullableStringFieldUpdateOperationsInput | string | null
    bestRank?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutCatclawProgressNestedInput
  }

  export type UserCatclawProgressUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    currentRank?: NullableStringFieldUpdateOperationsInput | string | null
    bestRank?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCatclawProgressCreateManyInput = {
    id?: string
    userId: string
    currentRank?: string | null
    bestRank?: string | null
    notes?: string | null
    updatedAt?: Date | string
  }

  export type UserCatclawProgressUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    currentRank?: NullableStringFieldUpdateOperationsInput | string | null
    bestRank?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCatclawProgressUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    currentRank?: NullableStringFieldUpdateOperationsInput | string | null
    bestRank?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MeowMedalCreateInput = {
    id?: string
    name: string
    requirementText?: string | null
    description?: string | null
    category?: string | null
    sortOrder?: number | null
    sourceUrl?: string | null
    imageFile?: string | null
    autoKey?: string | null
    updatedAt?: Date | string
    earnedBy?: UserMeowMedalCreateNestedManyWithoutMeowMedalInput
  }

  export type MeowMedalUncheckedCreateInput = {
    id?: string
    name: string
    requirementText?: string | null
    description?: string | null
    category?: string | null
    sortOrder?: number | null
    sourceUrl?: string | null
    imageFile?: string | null
    autoKey?: string | null
    updatedAt?: Date | string
    earnedBy?: UserMeowMedalUncheckedCreateNestedManyWithoutMeowMedalInput
  }

  export type MeowMedalUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    requirementText?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: NullableIntFieldUpdateOperationsInput | number | null
    sourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    imageFile?: NullableStringFieldUpdateOperationsInput | string | null
    autoKey?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    earnedBy?: UserMeowMedalUpdateManyWithoutMeowMedalNestedInput
  }

  export type MeowMedalUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    requirementText?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: NullableIntFieldUpdateOperationsInput | number | null
    sourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    imageFile?: NullableStringFieldUpdateOperationsInput | string | null
    autoKey?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    earnedBy?: UserMeowMedalUncheckedUpdateManyWithoutMeowMedalNestedInput
  }

  export type MeowMedalCreateManyInput = {
    id?: string
    name: string
    requirementText?: string | null
    description?: string | null
    category?: string | null
    sortOrder?: number | null
    sourceUrl?: string | null
    imageFile?: string | null
    autoKey?: string | null
    updatedAt?: Date | string
  }

  export type MeowMedalUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    requirementText?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: NullableIntFieldUpdateOperationsInput | number | null
    sourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    imageFile?: NullableStringFieldUpdateOperationsInput | string | null
    autoKey?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MeowMedalUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    requirementText?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: NullableIntFieldUpdateOperationsInput | number | null
    sourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    imageFile?: NullableStringFieldUpdateOperationsInput | string | null
    autoKey?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserMeowMedalCreateInput = {
    id?: string
    earned?: boolean
    earnedAt?: Date | string | null
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutMeowMedalProgressInput
    meowMedal: MeowMedalCreateNestedOneWithoutEarnedByInput
  }

  export type UserMeowMedalUncheckedCreateInput = {
    id?: string
    userId: string
    meowMedalId: string
    earned?: boolean
    earnedAt?: Date | string | null
    updatedAt?: Date | string
  }

  export type UserMeowMedalUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    earned?: BoolFieldUpdateOperationsInput | boolean
    earnedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutMeowMedalProgressNestedInput
    meowMedal?: MeowMedalUpdateOneRequiredWithoutEarnedByNestedInput
  }

  export type UserMeowMedalUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    meowMedalId?: StringFieldUpdateOperationsInput | string
    earned?: BoolFieldUpdateOperationsInput | boolean
    earnedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserMeowMedalCreateManyInput = {
    id?: string
    userId: string
    meowMedalId: string
    earned?: boolean
    earnedAt?: Date | string | null
    updatedAt?: Date | string
  }

  export type UserMeowMedalUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    earned?: BoolFieldUpdateOperationsInput | boolean
    earnedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserMeowMedalUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    meowMedalId?: StringFieldUpdateOperationsInput | string
    earned?: BoolFieldUpdateOperationsInput | boolean
    earnedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type PrivacySettingsNullableScalarRelationFilter = {
    is?: PrivacySettingsWhereInput | null
    isNot?: PrivacySettingsWhereInput | null
  }

  export type FriendshipListRelationFilter = {
    every?: FriendshipWhereInput
    some?: FriendshipWhereInput
    none?: FriendshipWhereInput
  }

  export type UserStoryProgressListRelationFilter = {
    every?: UserStoryProgressWhereInput
    some?: UserStoryProgressWhereInput
    none?: UserStoryProgressWhereInput
  }

  export type UserLegendProgressListRelationFilter = {
    every?: UserLegendProgressWhereInput
    some?: UserLegendProgressWhereInput
    none?: UserLegendProgressWhereInput
  }

  export type UserMilestoneProgressListRelationFilter = {
    every?: UserMilestoneProgressWhereInput
    some?: UserMilestoneProgressWhereInput
    none?: UserMilestoneProgressWhereInput
  }

  export type UserCatclawProgressNullableScalarRelationFilter = {
    is?: UserCatclawProgressWhereInput | null
    isNot?: UserCatclawProgressWhereInput | null
  }

  export type UserMeowMedalListRelationFilter = {
    every?: UserMeowMedalWhereInput
    some?: UserMeowMedalWhereInput
    none?: UserMeowMedalWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type FriendshipOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserStoryProgressOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserLegendProgressOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserMilestoneProgressOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserMeowMedalOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    displayName?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    displayName?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    displayName?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type EnumVisibilityFilter<$PrismaModel = never> = {
    equals?: $Enums.Visibility | EnumVisibilityFieldRefInput<$PrismaModel>
    in?: $Enums.Visibility[] | ListEnumVisibilityFieldRefInput<$PrismaModel>
    notIn?: $Enums.Visibility[] | ListEnumVisibilityFieldRefInput<$PrismaModel>
    not?: NestedEnumVisibilityFilter<$PrismaModel> | $Enums.Visibility
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type PrivacySettingsCountOrderByAggregateInput = {
    userId?: SortOrder
    profileVisibility?: SortOrder
    progressVisibility?: SortOrder
  }

  export type PrivacySettingsMaxOrderByAggregateInput = {
    userId?: SortOrder
    profileVisibility?: SortOrder
    progressVisibility?: SortOrder
  }

  export type PrivacySettingsMinOrderByAggregateInput = {
    userId?: SortOrder
    profileVisibility?: SortOrder
    progressVisibility?: SortOrder
  }

  export type EnumVisibilityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Visibility | EnumVisibilityFieldRefInput<$PrismaModel>
    in?: $Enums.Visibility[] | ListEnumVisibilityFieldRefInput<$PrismaModel>
    notIn?: $Enums.Visibility[] | ListEnumVisibilityFieldRefInput<$PrismaModel>
    not?: NestedEnumVisibilityWithAggregatesFilter<$PrismaModel> | $Enums.Visibility
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumVisibilityFilter<$PrismaModel>
    _max?: NestedEnumVisibilityFilter<$PrismaModel>
  }

  export type EnumFriendshipStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.FriendshipStatus | EnumFriendshipStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FriendshipStatus[] | ListEnumFriendshipStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.FriendshipStatus[] | ListEnumFriendshipStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumFriendshipStatusFilter<$PrismaModel> | $Enums.FriendshipStatus
  }

  export type FriendshipRequesterIdAddresseeIdCompoundUniqueInput = {
    requesterId: string
    addresseeId: string
  }

  export type FriendshipCountOrderByAggregateInput = {
    id?: SortOrder
    requesterId?: SortOrder
    addresseeId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FriendshipMaxOrderByAggregateInput = {
    id?: SortOrder
    requesterId?: SortOrder
    addresseeId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FriendshipMinOrderByAggregateInput = {
    id?: SortOrder
    requesterId?: SortOrder
    addresseeId?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumFriendshipStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FriendshipStatus | EnumFriendshipStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FriendshipStatus[] | ListEnumFriendshipStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.FriendshipStatus[] | ListEnumFriendshipStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumFriendshipStatusWithAggregatesFilter<$PrismaModel> | $Enums.FriendshipStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFriendshipStatusFilter<$PrismaModel>
    _max?: NestedEnumFriendshipStatusFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StoryChapterArcChapterNumberCompoundUniqueInput = {
    arc: string
    chapterNumber: number
  }

  export type StoryChapterCountOrderByAggregateInput = {
    id?: SortOrder
    arc?: SortOrder
    chapterNumber?: SortOrder
    displayName?: SortOrder
    sortOrder?: SortOrder
  }

  export type StoryChapterAvgOrderByAggregateInput = {
    chapterNumber?: SortOrder
    sortOrder?: SortOrder
  }

  export type StoryChapterMaxOrderByAggregateInput = {
    id?: SortOrder
    arc?: SortOrder
    chapterNumber?: SortOrder
    displayName?: SortOrder
    sortOrder?: SortOrder
  }

  export type StoryChapterMinOrderByAggregateInput = {
    id?: SortOrder
    arc?: SortOrder
    chapterNumber?: SortOrder
    displayName?: SortOrder
    sortOrder?: SortOrder
  }

  export type StoryChapterSumOrderByAggregateInput = {
    chapterNumber?: SortOrder
    sortOrder?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type EnumTreasureStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TreasureStatus | EnumTreasureStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TreasureStatus[] | ListEnumTreasureStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TreasureStatus[] | ListEnumTreasureStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTreasureStatusFilter<$PrismaModel> | $Enums.TreasureStatus
  }

  export type EnumZombieStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ZombieStatus | EnumZombieStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ZombieStatus[] | ListEnumZombieStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ZombieStatus[] | ListEnumZombieStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumZombieStatusFilter<$PrismaModel> | $Enums.ZombieStatus
  }

  export type StoryChapterScalarRelationFilter = {
    is?: StoryChapterWhereInput
    isNot?: StoryChapterWhereInput
  }

  export type UserStoryProgressUserIdStoryChapterIdCompoundUniqueInput = {
    userId: string
    storyChapterId: string
  }

  export type UserStoryProgressCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    storyChapterId?: SortOrder
    cleared?: SortOrder
    treasures?: SortOrder
    zombies?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserStoryProgressMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    storyChapterId?: SortOrder
    cleared?: SortOrder
    treasures?: SortOrder
    zombies?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserStoryProgressMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    storyChapterId?: SortOrder
    cleared?: SortOrder
    treasures?: SortOrder
    zombies?: SortOrder
    updatedAt?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type EnumTreasureStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TreasureStatus | EnumTreasureStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TreasureStatus[] | ListEnumTreasureStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TreasureStatus[] | ListEnumTreasureStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTreasureStatusWithAggregatesFilter<$PrismaModel> | $Enums.TreasureStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTreasureStatusFilter<$PrismaModel>
    _max?: NestedEnumTreasureStatusFilter<$PrismaModel>
  }

  export type EnumZombieStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ZombieStatus | EnumZombieStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ZombieStatus[] | ListEnumZombieStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ZombieStatus[] | ListEnumZombieStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumZombieStatusWithAggregatesFilter<$PrismaModel> | $Enums.ZombieStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumZombieStatusFilter<$PrismaModel>
    _max?: NestedEnumZombieStatusFilter<$PrismaModel>
  }

  export type LegendSubchapterListRelationFilter = {
    every?: LegendSubchapterWhereInput
    some?: LegendSubchapterWhereInput
    none?: LegendSubchapterWhereInput
  }

  export type LegendSubchapterOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LegendSagaCountOrderByAggregateInput = {
    id?: SortOrder
    displayName?: SortOrder
    sortOrder?: SortOrder
  }

  export type LegendSagaAvgOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type LegendSagaMaxOrderByAggregateInput = {
    id?: SortOrder
    displayName?: SortOrder
    sortOrder?: SortOrder
  }

  export type LegendSagaMinOrderByAggregateInput = {
    id?: SortOrder
    displayName?: SortOrder
    sortOrder?: SortOrder
  }

  export type LegendSagaSumOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type LegendSagaScalarRelationFilter = {
    is?: LegendSagaWhereInput
    isNot?: LegendSagaWhereInput
  }

  export type LegendSubchapterSagaIdDisplayNameCompoundUniqueInput = {
    sagaId: string
    displayName: string
  }

  export type LegendSubchapterCountOrderByAggregateInput = {
    id?: SortOrder
    sagaId?: SortOrder
    displayName?: SortOrder
    sortOrder?: SortOrder
  }

  export type LegendSubchapterAvgOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type LegendSubchapterMaxOrderByAggregateInput = {
    id?: SortOrder
    sagaId?: SortOrder
    displayName?: SortOrder
    sortOrder?: SortOrder
  }

  export type LegendSubchapterMinOrderByAggregateInput = {
    id?: SortOrder
    sagaId?: SortOrder
    displayName?: SortOrder
    sortOrder?: SortOrder
  }

  export type LegendSubchapterSumOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type EnumLegendProgressStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.LegendProgressStatus | EnumLegendProgressStatusFieldRefInput<$PrismaModel>
    in?: $Enums.LegendProgressStatus[] | ListEnumLegendProgressStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.LegendProgressStatus[] | ListEnumLegendProgressStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumLegendProgressStatusFilter<$PrismaModel> | $Enums.LegendProgressStatus
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type LegendSubchapterScalarRelationFilter = {
    is?: LegendSubchapterWhereInput
    isNot?: LegendSubchapterWhereInput
  }

  export type UserLegendProgressUserIdSubchapterIdCompoundUniqueInput = {
    userId: string
    subchapterId: string
  }

  export type UserLegendProgressCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    subchapterId?: SortOrder
    status?: SortOrder
    crownMax?: SortOrder
    notes?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserLegendProgressAvgOrderByAggregateInput = {
    crownMax?: SortOrder
  }

  export type UserLegendProgressMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    subchapterId?: SortOrder
    status?: SortOrder
    crownMax?: SortOrder
    notes?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserLegendProgressMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    subchapterId?: SortOrder
    status?: SortOrder
    crownMax?: SortOrder
    notes?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserLegendProgressSumOrderByAggregateInput = {
    crownMax?: SortOrder
  }

  export type EnumLegendProgressStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LegendProgressStatus | EnumLegendProgressStatusFieldRefInput<$PrismaModel>
    in?: $Enums.LegendProgressStatus[] | ListEnumLegendProgressStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.LegendProgressStatus[] | ListEnumLegendProgressStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumLegendProgressStatusWithAggregatesFilter<$PrismaModel> | $Enums.LegendProgressStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLegendProgressStatusFilter<$PrismaModel>
    _max?: NestedEnumLegendProgressStatusFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type EnumMilestoneCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.MilestoneCategory | EnumMilestoneCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.MilestoneCategory[] | ListEnumMilestoneCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.MilestoneCategory[] | ListEnumMilestoneCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumMilestoneCategoryFilter<$PrismaModel> | $Enums.MilestoneCategory
  }

  export type MilestoneCountOrderByAggregateInput = {
    id?: SortOrder
    category?: SortOrder
    displayName?: SortOrder
    sortOrder?: SortOrder
  }

  export type MilestoneAvgOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type MilestoneMaxOrderByAggregateInput = {
    id?: SortOrder
    category?: SortOrder
    displayName?: SortOrder
    sortOrder?: SortOrder
  }

  export type MilestoneMinOrderByAggregateInput = {
    id?: SortOrder
    category?: SortOrder
    displayName?: SortOrder
    sortOrder?: SortOrder
  }

  export type MilestoneSumOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type EnumMilestoneCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MilestoneCategory | EnumMilestoneCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.MilestoneCategory[] | ListEnumMilestoneCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.MilestoneCategory[] | ListEnumMilestoneCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumMilestoneCategoryWithAggregatesFilter<$PrismaModel> | $Enums.MilestoneCategory
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMilestoneCategoryFilter<$PrismaModel>
    _max?: NestedEnumMilestoneCategoryFilter<$PrismaModel>
  }

  export type MilestoneScalarRelationFilter = {
    is?: MilestoneWhereInput
    isNot?: MilestoneWhereInput
  }

  export type UserMilestoneProgressUserIdMilestoneIdCompoundUniqueInput = {
    userId: string
    milestoneId: string
  }

  export type UserMilestoneProgressCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    milestoneId?: SortOrder
    cleared?: SortOrder
    notes?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMilestoneProgressMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    milestoneId?: SortOrder
    cleared?: SortOrder
    notes?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMilestoneProgressMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    milestoneId?: SortOrder
    cleared?: SortOrder
    notes?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserCatclawProgressCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    currentRank?: SortOrder
    bestRank?: SortOrder
    notes?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserCatclawProgressMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    currentRank?: SortOrder
    bestRank?: SortOrder
    notes?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserCatclawProgressMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    currentRank?: SortOrder
    bestRank?: SortOrder
    notes?: SortOrder
    updatedAt?: SortOrder
  }

  export type MeowMedalCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    requirementText?: SortOrder
    description?: SortOrder
    category?: SortOrder
    sortOrder?: SortOrder
    sourceUrl?: SortOrder
    imageFile?: SortOrder
    autoKey?: SortOrder
    updatedAt?: SortOrder
  }

  export type MeowMedalAvgOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type MeowMedalMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    requirementText?: SortOrder
    description?: SortOrder
    category?: SortOrder
    sortOrder?: SortOrder
    sourceUrl?: SortOrder
    imageFile?: SortOrder
    autoKey?: SortOrder
    updatedAt?: SortOrder
  }

  export type MeowMedalMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    requirementText?: SortOrder
    description?: SortOrder
    category?: SortOrder
    sortOrder?: SortOrder
    sourceUrl?: SortOrder
    imageFile?: SortOrder
    autoKey?: SortOrder
    updatedAt?: SortOrder
  }

  export type MeowMedalSumOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type MeowMedalScalarRelationFilter = {
    is?: MeowMedalWhereInput
    isNot?: MeowMedalWhereInput
  }

  export type UserMeowMedalUserIdMeowMedalIdCompoundUniqueInput = {
    userId: string
    meowMedalId: string
  }

  export type UserMeowMedalCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    meowMedalId?: SortOrder
    earned?: SortOrder
    earnedAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMeowMedalMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    meowMedalId?: SortOrder
    earned?: SortOrder
    earnedAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMeowMedalMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    meowMedalId?: SortOrder
    earned?: SortOrder
    earnedAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type PrivacySettingsCreateNestedOneWithoutUserInput = {
    create?: XOR<PrivacySettingsCreateWithoutUserInput, PrivacySettingsUncheckedCreateWithoutUserInput>
    connectOrCreate?: PrivacySettingsCreateOrConnectWithoutUserInput
    connect?: PrivacySettingsWhereUniqueInput
  }

  export type FriendshipCreateNestedManyWithoutRequesterInput = {
    create?: XOR<FriendshipCreateWithoutRequesterInput, FriendshipUncheckedCreateWithoutRequesterInput> | FriendshipCreateWithoutRequesterInput[] | FriendshipUncheckedCreateWithoutRequesterInput[]
    connectOrCreate?: FriendshipCreateOrConnectWithoutRequesterInput | FriendshipCreateOrConnectWithoutRequesterInput[]
    createMany?: FriendshipCreateManyRequesterInputEnvelope
    connect?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
  }

  export type FriendshipCreateNestedManyWithoutAddresseeInput = {
    create?: XOR<FriendshipCreateWithoutAddresseeInput, FriendshipUncheckedCreateWithoutAddresseeInput> | FriendshipCreateWithoutAddresseeInput[] | FriendshipUncheckedCreateWithoutAddresseeInput[]
    connectOrCreate?: FriendshipCreateOrConnectWithoutAddresseeInput | FriendshipCreateOrConnectWithoutAddresseeInput[]
    createMany?: FriendshipCreateManyAddresseeInputEnvelope
    connect?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
  }

  export type UserStoryProgressCreateNestedManyWithoutUserInput = {
    create?: XOR<UserStoryProgressCreateWithoutUserInput, UserStoryProgressUncheckedCreateWithoutUserInput> | UserStoryProgressCreateWithoutUserInput[] | UserStoryProgressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserStoryProgressCreateOrConnectWithoutUserInput | UserStoryProgressCreateOrConnectWithoutUserInput[]
    createMany?: UserStoryProgressCreateManyUserInputEnvelope
    connect?: UserStoryProgressWhereUniqueInput | UserStoryProgressWhereUniqueInput[]
  }

  export type UserLegendProgressCreateNestedManyWithoutUserInput = {
    create?: XOR<UserLegendProgressCreateWithoutUserInput, UserLegendProgressUncheckedCreateWithoutUserInput> | UserLegendProgressCreateWithoutUserInput[] | UserLegendProgressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserLegendProgressCreateOrConnectWithoutUserInput | UserLegendProgressCreateOrConnectWithoutUserInput[]
    createMany?: UserLegendProgressCreateManyUserInputEnvelope
    connect?: UserLegendProgressWhereUniqueInput | UserLegendProgressWhereUniqueInput[]
  }

  export type UserMilestoneProgressCreateNestedManyWithoutUserInput = {
    create?: XOR<UserMilestoneProgressCreateWithoutUserInput, UserMilestoneProgressUncheckedCreateWithoutUserInput> | UserMilestoneProgressCreateWithoutUserInput[] | UserMilestoneProgressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserMilestoneProgressCreateOrConnectWithoutUserInput | UserMilestoneProgressCreateOrConnectWithoutUserInput[]
    createMany?: UserMilestoneProgressCreateManyUserInputEnvelope
    connect?: UserMilestoneProgressWhereUniqueInput | UserMilestoneProgressWhereUniqueInput[]
  }

  export type UserCatclawProgressCreateNestedOneWithoutUserInput = {
    create?: XOR<UserCatclawProgressCreateWithoutUserInput, UserCatclawProgressUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserCatclawProgressCreateOrConnectWithoutUserInput
    connect?: UserCatclawProgressWhereUniqueInput
  }

  export type UserMeowMedalCreateNestedManyWithoutUserInput = {
    create?: XOR<UserMeowMedalCreateWithoutUserInput, UserMeowMedalUncheckedCreateWithoutUserInput> | UserMeowMedalCreateWithoutUserInput[] | UserMeowMedalUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserMeowMedalCreateOrConnectWithoutUserInput | UserMeowMedalCreateOrConnectWithoutUserInput[]
    createMany?: UserMeowMedalCreateManyUserInputEnvelope
    connect?: UserMeowMedalWhereUniqueInput | UserMeowMedalWhereUniqueInput[]
  }

  export type PrivacySettingsUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<PrivacySettingsCreateWithoutUserInput, PrivacySettingsUncheckedCreateWithoutUserInput>
    connectOrCreate?: PrivacySettingsCreateOrConnectWithoutUserInput
    connect?: PrivacySettingsWhereUniqueInput
  }

  export type FriendshipUncheckedCreateNestedManyWithoutRequesterInput = {
    create?: XOR<FriendshipCreateWithoutRequesterInput, FriendshipUncheckedCreateWithoutRequesterInput> | FriendshipCreateWithoutRequesterInput[] | FriendshipUncheckedCreateWithoutRequesterInput[]
    connectOrCreate?: FriendshipCreateOrConnectWithoutRequesterInput | FriendshipCreateOrConnectWithoutRequesterInput[]
    createMany?: FriendshipCreateManyRequesterInputEnvelope
    connect?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
  }

  export type FriendshipUncheckedCreateNestedManyWithoutAddresseeInput = {
    create?: XOR<FriendshipCreateWithoutAddresseeInput, FriendshipUncheckedCreateWithoutAddresseeInput> | FriendshipCreateWithoutAddresseeInput[] | FriendshipUncheckedCreateWithoutAddresseeInput[]
    connectOrCreate?: FriendshipCreateOrConnectWithoutAddresseeInput | FriendshipCreateOrConnectWithoutAddresseeInput[]
    createMany?: FriendshipCreateManyAddresseeInputEnvelope
    connect?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
  }

  export type UserStoryProgressUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<UserStoryProgressCreateWithoutUserInput, UserStoryProgressUncheckedCreateWithoutUserInput> | UserStoryProgressCreateWithoutUserInput[] | UserStoryProgressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserStoryProgressCreateOrConnectWithoutUserInput | UserStoryProgressCreateOrConnectWithoutUserInput[]
    createMany?: UserStoryProgressCreateManyUserInputEnvelope
    connect?: UserStoryProgressWhereUniqueInput | UserStoryProgressWhereUniqueInput[]
  }

  export type UserLegendProgressUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<UserLegendProgressCreateWithoutUserInput, UserLegendProgressUncheckedCreateWithoutUserInput> | UserLegendProgressCreateWithoutUserInput[] | UserLegendProgressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserLegendProgressCreateOrConnectWithoutUserInput | UserLegendProgressCreateOrConnectWithoutUserInput[]
    createMany?: UserLegendProgressCreateManyUserInputEnvelope
    connect?: UserLegendProgressWhereUniqueInput | UserLegendProgressWhereUniqueInput[]
  }

  export type UserMilestoneProgressUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<UserMilestoneProgressCreateWithoutUserInput, UserMilestoneProgressUncheckedCreateWithoutUserInput> | UserMilestoneProgressCreateWithoutUserInput[] | UserMilestoneProgressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserMilestoneProgressCreateOrConnectWithoutUserInput | UserMilestoneProgressCreateOrConnectWithoutUserInput[]
    createMany?: UserMilestoneProgressCreateManyUserInputEnvelope
    connect?: UserMilestoneProgressWhereUniqueInput | UserMilestoneProgressWhereUniqueInput[]
  }

  export type UserCatclawProgressUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<UserCatclawProgressCreateWithoutUserInput, UserCatclawProgressUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserCatclawProgressCreateOrConnectWithoutUserInput
    connect?: UserCatclawProgressWhereUniqueInput
  }

  export type UserMeowMedalUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<UserMeowMedalCreateWithoutUserInput, UserMeowMedalUncheckedCreateWithoutUserInput> | UserMeowMedalCreateWithoutUserInput[] | UserMeowMedalUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserMeowMedalCreateOrConnectWithoutUserInput | UserMeowMedalCreateOrConnectWithoutUserInput[]
    createMany?: UserMeowMedalCreateManyUserInputEnvelope
    connect?: UserMeowMedalWhereUniqueInput | UserMeowMedalWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type PrivacySettingsUpdateOneWithoutUserNestedInput = {
    create?: XOR<PrivacySettingsCreateWithoutUserInput, PrivacySettingsUncheckedCreateWithoutUserInput>
    connectOrCreate?: PrivacySettingsCreateOrConnectWithoutUserInput
    upsert?: PrivacySettingsUpsertWithoutUserInput
    disconnect?: PrivacySettingsWhereInput | boolean
    delete?: PrivacySettingsWhereInput | boolean
    connect?: PrivacySettingsWhereUniqueInput
    update?: XOR<XOR<PrivacySettingsUpdateToOneWithWhereWithoutUserInput, PrivacySettingsUpdateWithoutUserInput>, PrivacySettingsUncheckedUpdateWithoutUserInput>
  }

  export type FriendshipUpdateManyWithoutRequesterNestedInput = {
    create?: XOR<FriendshipCreateWithoutRequesterInput, FriendshipUncheckedCreateWithoutRequesterInput> | FriendshipCreateWithoutRequesterInput[] | FriendshipUncheckedCreateWithoutRequesterInput[]
    connectOrCreate?: FriendshipCreateOrConnectWithoutRequesterInput | FriendshipCreateOrConnectWithoutRequesterInput[]
    upsert?: FriendshipUpsertWithWhereUniqueWithoutRequesterInput | FriendshipUpsertWithWhereUniqueWithoutRequesterInput[]
    createMany?: FriendshipCreateManyRequesterInputEnvelope
    set?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    disconnect?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    delete?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    connect?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    update?: FriendshipUpdateWithWhereUniqueWithoutRequesterInput | FriendshipUpdateWithWhereUniqueWithoutRequesterInput[]
    updateMany?: FriendshipUpdateManyWithWhereWithoutRequesterInput | FriendshipUpdateManyWithWhereWithoutRequesterInput[]
    deleteMany?: FriendshipScalarWhereInput | FriendshipScalarWhereInput[]
  }

  export type FriendshipUpdateManyWithoutAddresseeNestedInput = {
    create?: XOR<FriendshipCreateWithoutAddresseeInput, FriendshipUncheckedCreateWithoutAddresseeInput> | FriendshipCreateWithoutAddresseeInput[] | FriendshipUncheckedCreateWithoutAddresseeInput[]
    connectOrCreate?: FriendshipCreateOrConnectWithoutAddresseeInput | FriendshipCreateOrConnectWithoutAddresseeInput[]
    upsert?: FriendshipUpsertWithWhereUniqueWithoutAddresseeInput | FriendshipUpsertWithWhereUniqueWithoutAddresseeInput[]
    createMany?: FriendshipCreateManyAddresseeInputEnvelope
    set?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    disconnect?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    delete?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    connect?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    update?: FriendshipUpdateWithWhereUniqueWithoutAddresseeInput | FriendshipUpdateWithWhereUniqueWithoutAddresseeInput[]
    updateMany?: FriendshipUpdateManyWithWhereWithoutAddresseeInput | FriendshipUpdateManyWithWhereWithoutAddresseeInput[]
    deleteMany?: FriendshipScalarWhereInput | FriendshipScalarWhereInput[]
  }

  export type UserStoryProgressUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserStoryProgressCreateWithoutUserInput, UserStoryProgressUncheckedCreateWithoutUserInput> | UserStoryProgressCreateWithoutUserInput[] | UserStoryProgressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserStoryProgressCreateOrConnectWithoutUserInput | UserStoryProgressCreateOrConnectWithoutUserInput[]
    upsert?: UserStoryProgressUpsertWithWhereUniqueWithoutUserInput | UserStoryProgressUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserStoryProgressCreateManyUserInputEnvelope
    set?: UserStoryProgressWhereUniqueInput | UserStoryProgressWhereUniqueInput[]
    disconnect?: UserStoryProgressWhereUniqueInput | UserStoryProgressWhereUniqueInput[]
    delete?: UserStoryProgressWhereUniqueInput | UserStoryProgressWhereUniqueInput[]
    connect?: UserStoryProgressWhereUniqueInput | UserStoryProgressWhereUniqueInput[]
    update?: UserStoryProgressUpdateWithWhereUniqueWithoutUserInput | UserStoryProgressUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserStoryProgressUpdateManyWithWhereWithoutUserInput | UserStoryProgressUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserStoryProgressScalarWhereInput | UserStoryProgressScalarWhereInput[]
  }

  export type UserLegendProgressUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserLegendProgressCreateWithoutUserInput, UserLegendProgressUncheckedCreateWithoutUserInput> | UserLegendProgressCreateWithoutUserInput[] | UserLegendProgressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserLegendProgressCreateOrConnectWithoutUserInput | UserLegendProgressCreateOrConnectWithoutUserInput[]
    upsert?: UserLegendProgressUpsertWithWhereUniqueWithoutUserInput | UserLegendProgressUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserLegendProgressCreateManyUserInputEnvelope
    set?: UserLegendProgressWhereUniqueInput | UserLegendProgressWhereUniqueInput[]
    disconnect?: UserLegendProgressWhereUniqueInput | UserLegendProgressWhereUniqueInput[]
    delete?: UserLegendProgressWhereUniqueInput | UserLegendProgressWhereUniqueInput[]
    connect?: UserLegendProgressWhereUniqueInput | UserLegendProgressWhereUniqueInput[]
    update?: UserLegendProgressUpdateWithWhereUniqueWithoutUserInput | UserLegendProgressUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserLegendProgressUpdateManyWithWhereWithoutUserInput | UserLegendProgressUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserLegendProgressScalarWhereInput | UserLegendProgressScalarWhereInput[]
  }

  export type UserMilestoneProgressUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserMilestoneProgressCreateWithoutUserInput, UserMilestoneProgressUncheckedCreateWithoutUserInput> | UserMilestoneProgressCreateWithoutUserInput[] | UserMilestoneProgressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserMilestoneProgressCreateOrConnectWithoutUserInput | UserMilestoneProgressCreateOrConnectWithoutUserInput[]
    upsert?: UserMilestoneProgressUpsertWithWhereUniqueWithoutUserInput | UserMilestoneProgressUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserMilestoneProgressCreateManyUserInputEnvelope
    set?: UserMilestoneProgressWhereUniqueInput | UserMilestoneProgressWhereUniqueInput[]
    disconnect?: UserMilestoneProgressWhereUniqueInput | UserMilestoneProgressWhereUniqueInput[]
    delete?: UserMilestoneProgressWhereUniqueInput | UserMilestoneProgressWhereUniqueInput[]
    connect?: UserMilestoneProgressWhereUniqueInput | UserMilestoneProgressWhereUniqueInput[]
    update?: UserMilestoneProgressUpdateWithWhereUniqueWithoutUserInput | UserMilestoneProgressUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserMilestoneProgressUpdateManyWithWhereWithoutUserInput | UserMilestoneProgressUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserMilestoneProgressScalarWhereInput | UserMilestoneProgressScalarWhereInput[]
  }

  export type UserCatclawProgressUpdateOneWithoutUserNestedInput = {
    create?: XOR<UserCatclawProgressCreateWithoutUserInput, UserCatclawProgressUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserCatclawProgressCreateOrConnectWithoutUserInput
    upsert?: UserCatclawProgressUpsertWithoutUserInput
    disconnect?: UserCatclawProgressWhereInput | boolean
    delete?: UserCatclawProgressWhereInput | boolean
    connect?: UserCatclawProgressWhereUniqueInput
    update?: XOR<XOR<UserCatclawProgressUpdateToOneWithWhereWithoutUserInput, UserCatclawProgressUpdateWithoutUserInput>, UserCatclawProgressUncheckedUpdateWithoutUserInput>
  }

  export type UserMeowMedalUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserMeowMedalCreateWithoutUserInput, UserMeowMedalUncheckedCreateWithoutUserInput> | UserMeowMedalCreateWithoutUserInput[] | UserMeowMedalUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserMeowMedalCreateOrConnectWithoutUserInput | UserMeowMedalCreateOrConnectWithoutUserInput[]
    upsert?: UserMeowMedalUpsertWithWhereUniqueWithoutUserInput | UserMeowMedalUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserMeowMedalCreateManyUserInputEnvelope
    set?: UserMeowMedalWhereUniqueInput | UserMeowMedalWhereUniqueInput[]
    disconnect?: UserMeowMedalWhereUniqueInput | UserMeowMedalWhereUniqueInput[]
    delete?: UserMeowMedalWhereUniqueInput | UserMeowMedalWhereUniqueInput[]
    connect?: UserMeowMedalWhereUniqueInput | UserMeowMedalWhereUniqueInput[]
    update?: UserMeowMedalUpdateWithWhereUniqueWithoutUserInput | UserMeowMedalUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserMeowMedalUpdateManyWithWhereWithoutUserInput | UserMeowMedalUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserMeowMedalScalarWhereInput | UserMeowMedalScalarWhereInput[]
  }

  export type PrivacySettingsUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<PrivacySettingsCreateWithoutUserInput, PrivacySettingsUncheckedCreateWithoutUserInput>
    connectOrCreate?: PrivacySettingsCreateOrConnectWithoutUserInput
    upsert?: PrivacySettingsUpsertWithoutUserInput
    disconnect?: PrivacySettingsWhereInput | boolean
    delete?: PrivacySettingsWhereInput | boolean
    connect?: PrivacySettingsWhereUniqueInput
    update?: XOR<XOR<PrivacySettingsUpdateToOneWithWhereWithoutUserInput, PrivacySettingsUpdateWithoutUserInput>, PrivacySettingsUncheckedUpdateWithoutUserInput>
  }

  export type FriendshipUncheckedUpdateManyWithoutRequesterNestedInput = {
    create?: XOR<FriendshipCreateWithoutRequesterInput, FriendshipUncheckedCreateWithoutRequesterInput> | FriendshipCreateWithoutRequesterInput[] | FriendshipUncheckedCreateWithoutRequesterInput[]
    connectOrCreate?: FriendshipCreateOrConnectWithoutRequesterInput | FriendshipCreateOrConnectWithoutRequesterInput[]
    upsert?: FriendshipUpsertWithWhereUniqueWithoutRequesterInput | FriendshipUpsertWithWhereUniqueWithoutRequesterInput[]
    createMany?: FriendshipCreateManyRequesterInputEnvelope
    set?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    disconnect?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    delete?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    connect?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    update?: FriendshipUpdateWithWhereUniqueWithoutRequesterInput | FriendshipUpdateWithWhereUniqueWithoutRequesterInput[]
    updateMany?: FriendshipUpdateManyWithWhereWithoutRequesterInput | FriendshipUpdateManyWithWhereWithoutRequesterInput[]
    deleteMany?: FriendshipScalarWhereInput | FriendshipScalarWhereInput[]
  }

  export type FriendshipUncheckedUpdateManyWithoutAddresseeNestedInput = {
    create?: XOR<FriendshipCreateWithoutAddresseeInput, FriendshipUncheckedCreateWithoutAddresseeInput> | FriendshipCreateWithoutAddresseeInput[] | FriendshipUncheckedCreateWithoutAddresseeInput[]
    connectOrCreate?: FriendshipCreateOrConnectWithoutAddresseeInput | FriendshipCreateOrConnectWithoutAddresseeInput[]
    upsert?: FriendshipUpsertWithWhereUniqueWithoutAddresseeInput | FriendshipUpsertWithWhereUniqueWithoutAddresseeInput[]
    createMany?: FriendshipCreateManyAddresseeInputEnvelope
    set?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    disconnect?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    delete?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    connect?: FriendshipWhereUniqueInput | FriendshipWhereUniqueInput[]
    update?: FriendshipUpdateWithWhereUniqueWithoutAddresseeInput | FriendshipUpdateWithWhereUniqueWithoutAddresseeInput[]
    updateMany?: FriendshipUpdateManyWithWhereWithoutAddresseeInput | FriendshipUpdateManyWithWhereWithoutAddresseeInput[]
    deleteMany?: FriendshipScalarWhereInput | FriendshipScalarWhereInput[]
  }

  export type UserStoryProgressUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserStoryProgressCreateWithoutUserInput, UserStoryProgressUncheckedCreateWithoutUserInput> | UserStoryProgressCreateWithoutUserInput[] | UserStoryProgressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserStoryProgressCreateOrConnectWithoutUserInput | UserStoryProgressCreateOrConnectWithoutUserInput[]
    upsert?: UserStoryProgressUpsertWithWhereUniqueWithoutUserInput | UserStoryProgressUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserStoryProgressCreateManyUserInputEnvelope
    set?: UserStoryProgressWhereUniqueInput | UserStoryProgressWhereUniqueInput[]
    disconnect?: UserStoryProgressWhereUniqueInput | UserStoryProgressWhereUniqueInput[]
    delete?: UserStoryProgressWhereUniqueInput | UserStoryProgressWhereUniqueInput[]
    connect?: UserStoryProgressWhereUniqueInput | UserStoryProgressWhereUniqueInput[]
    update?: UserStoryProgressUpdateWithWhereUniqueWithoutUserInput | UserStoryProgressUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserStoryProgressUpdateManyWithWhereWithoutUserInput | UserStoryProgressUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserStoryProgressScalarWhereInput | UserStoryProgressScalarWhereInput[]
  }

  export type UserLegendProgressUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserLegendProgressCreateWithoutUserInput, UserLegendProgressUncheckedCreateWithoutUserInput> | UserLegendProgressCreateWithoutUserInput[] | UserLegendProgressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserLegendProgressCreateOrConnectWithoutUserInput | UserLegendProgressCreateOrConnectWithoutUserInput[]
    upsert?: UserLegendProgressUpsertWithWhereUniqueWithoutUserInput | UserLegendProgressUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserLegendProgressCreateManyUserInputEnvelope
    set?: UserLegendProgressWhereUniqueInput | UserLegendProgressWhereUniqueInput[]
    disconnect?: UserLegendProgressWhereUniqueInput | UserLegendProgressWhereUniqueInput[]
    delete?: UserLegendProgressWhereUniqueInput | UserLegendProgressWhereUniqueInput[]
    connect?: UserLegendProgressWhereUniqueInput | UserLegendProgressWhereUniqueInput[]
    update?: UserLegendProgressUpdateWithWhereUniqueWithoutUserInput | UserLegendProgressUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserLegendProgressUpdateManyWithWhereWithoutUserInput | UserLegendProgressUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserLegendProgressScalarWhereInput | UserLegendProgressScalarWhereInput[]
  }

  export type UserMilestoneProgressUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserMilestoneProgressCreateWithoutUserInput, UserMilestoneProgressUncheckedCreateWithoutUserInput> | UserMilestoneProgressCreateWithoutUserInput[] | UserMilestoneProgressUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserMilestoneProgressCreateOrConnectWithoutUserInput | UserMilestoneProgressCreateOrConnectWithoutUserInput[]
    upsert?: UserMilestoneProgressUpsertWithWhereUniqueWithoutUserInput | UserMilestoneProgressUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserMilestoneProgressCreateManyUserInputEnvelope
    set?: UserMilestoneProgressWhereUniqueInput | UserMilestoneProgressWhereUniqueInput[]
    disconnect?: UserMilestoneProgressWhereUniqueInput | UserMilestoneProgressWhereUniqueInput[]
    delete?: UserMilestoneProgressWhereUniqueInput | UserMilestoneProgressWhereUniqueInput[]
    connect?: UserMilestoneProgressWhereUniqueInput | UserMilestoneProgressWhereUniqueInput[]
    update?: UserMilestoneProgressUpdateWithWhereUniqueWithoutUserInput | UserMilestoneProgressUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserMilestoneProgressUpdateManyWithWhereWithoutUserInput | UserMilestoneProgressUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserMilestoneProgressScalarWhereInput | UserMilestoneProgressScalarWhereInput[]
  }

  export type UserCatclawProgressUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<UserCatclawProgressCreateWithoutUserInput, UserCatclawProgressUncheckedCreateWithoutUserInput>
    connectOrCreate?: UserCatclawProgressCreateOrConnectWithoutUserInput
    upsert?: UserCatclawProgressUpsertWithoutUserInput
    disconnect?: UserCatclawProgressWhereInput | boolean
    delete?: UserCatclawProgressWhereInput | boolean
    connect?: UserCatclawProgressWhereUniqueInput
    update?: XOR<XOR<UserCatclawProgressUpdateToOneWithWhereWithoutUserInput, UserCatclawProgressUpdateWithoutUserInput>, UserCatclawProgressUncheckedUpdateWithoutUserInput>
  }

  export type UserMeowMedalUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserMeowMedalCreateWithoutUserInput, UserMeowMedalUncheckedCreateWithoutUserInput> | UserMeowMedalCreateWithoutUserInput[] | UserMeowMedalUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserMeowMedalCreateOrConnectWithoutUserInput | UserMeowMedalCreateOrConnectWithoutUserInput[]
    upsert?: UserMeowMedalUpsertWithWhereUniqueWithoutUserInput | UserMeowMedalUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserMeowMedalCreateManyUserInputEnvelope
    set?: UserMeowMedalWhereUniqueInput | UserMeowMedalWhereUniqueInput[]
    disconnect?: UserMeowMedalWhereUniqueInput | UserMeowMedalWhereUniqueInput[]
    delete?: UserMeowMedalWhereUniqueInput | UserMeowMedalWhereUniqueInput[]
    connect?: UserMeowMedalWhereUniqueInput | UserMeowMedalWhereUniqueInput[]
    update?: UserMeowMedalUpdateWithWhereUniqueWithoutUserInput | UserMeowMedalUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserMeowMedalUpdateManyWithWhereWithoutUserInput | UserMeowMedalUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserMeowMedalScalarWhereInput | UserMeowMedalScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutPrivacyInput = {
    create?: XOR<UserCreateWithoutPrivacyInput, UserUncheckedCreateWithoutPrivacyInput>
    connectOrCreate?: UserCreateOrConnectWithoutPrivacyInput
    connect?: UserWhereUniqueInput
  }

  export type EnumVisibilityFieldUpdateOperationsInput = {
    set?: $Enums.Visibility
  }

  export type UserUpdateOneRequiredWithoutPrivacyNestedInput = {
    create?: XOR<UserCreateWithoutPrivacyInput, UserUncheckedCreateWithoutPrivacyInput>
    connectOrCreate?: UserCreateOrConnectWithoutPrivacyInput
    upsert?: UserUpsertWithoutPrivacyInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPrivacyInput, UserUpdateWithoutPrivacyInput>, UserUncheckedUpdateWithoutPrivacyInput>
  }

  export type UserCreateNestedOneWithoutSentFriendRequestsInput = {
    create?: XOR<UserCreateWithoutSentFriendRequestsInput, UserUncheckedCreateWithoutSentFriendRequestsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSentFriendRequestsInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutReceivedFriendRequestsInput = {
    create?: XOR<UserCreateWithoutReceivedFriendRequestsInput, UserUncheckedCreateWithoutReceivedFriendRequestsInput>
    connectOrCreate?: UserCreateOrConnectWithoutReceivedFriendRequestsInput
    connect?: UserWhereUniqueInput
  }

  export type EnumFriendshipStatusFieldUpdateOperationsInput = {
    set?: $Enums.FriendshipStatus
  }

  export type UserUpdateOneRequiredWithoutSentFriendRequestsNestedInput = {
    create?: XOR<UserCreateWithoutSentFriendRequestsInput, UserUncheckedCreateWithoutSentFriendRequestsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSentFriendRequestsInput
    upsert?: UserUpsertWithoutSentFriendRequestsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSentFriendRequestsInput, UserUpdateWithoutSentFriendRequestsInput>, UserUncheckedUpdateWithoutSentFriendRequestsInput>
  }

  export type UserUpdateOneRequiredWithoutReceivedFriendRequestsNestedInput = {
    create?: XOR<UserCreateWithoutReceivedFriendRequestsInput, UserUncheckedCreateWithoutReceivedFriendRequestsInput>
    connectOrCreate?: UserCreateOrConnectWithoutReceivedFriendRequestsInput
    upsert?: UserUpsertWithoutReceivedFriendRequestsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutReceivedFriendRequestsInput, UserUpdateWithoutReceivedFriendRequestsInput>, UserUncheckedUpdateWithoutReceivedFriendRequestsInput>
  }

  export type UserStoryProgressCreateNestedManyWithoutChapterInput = {
    create?: XOR<UserStoryProgressCreateWithoutChapterInput, UserStoryProgressUncheckedCreateWithoutChapterInput> | UserStoryProgressCreateWithoutChapterInput[] | UserStoryProgressUncheckedCreateWithoutChapterInput[]
    connectOrCreate?: UserStoryProgressCreateOrConnectWithoutChapterInput | UserStoryProgressCreateOrConnectWithoutChapterInput[]
    createMany?: UserStoryProgressCreateManyChapterInputEnvelope
    connect?: UserStoryProgressWhereUniqueInput | UserStoryProgressWhereUniqueInput[]
  }

  export type UserStoryProgressUncheckedCreateNestedManyWithoutChapterInput = {
    create?: XOR<UserStoryProgressCreateWithoutChapterInput, UserStoryProgressUncheckedCreateWithoutChapterInput> | UserStoryProgressCreateWithoutChapterInput[] | UserStoryProgressUncheckedCreateWithoutChapterInput[]
    connectOrCreate?: UserStoryProgressCreateOrConnectWithoutChapterInput | UserStoryProgressCreateOrConnectWithoutChapterInput[]
    createMany?: UserStoryProgressCreateManyChapterInputEnvelope
    connect?: UserStoryProgressWhereUniqueInput | UserStoryProgressWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserStoryProgressUpdateManyWithoutChapterNestedInput = {
    create?: XOR<UserStoryProgressCreateWithoutChapterInput, UserStoryProgressUncheckedCreateWithoutChapterInput> | UserStoryProgressCreateWithoutChapterInput[] | UserStoryProgressUncheckedCreateWithoutChapterInput[]
    connectOrCreate?: UserStoryProgressCreateOrConnectWithoutChapterInput | UserStoryProgressCreateOrConnectWithoutChapterInput[]
    upsert?: UserStoryProgressUpsertWithWhereUniqueWithoutChapterInput | UserStoryProgressUpsertWithWhereUniqueWithoutChapterInput[]
    createMany?: UserStoryProgressCreateManyChapterInputEnvelope
    set?: UserStoryProgressWhereUniqueInput | UserStoryProgressWhereUniqueInput[]
    disconnect?: UserStoryProgressWhereUniqueInput | UserStoryProgressWhereUniqueInput[]
    delete?: UserStoryProgressWhereUniqueInput | UserStoryProgressWhereUniqueInput[]
    connect?: UserStoryProgressWhereUniqueInput | UserStoryProgressWhereUniqueInput[]
    update?: UserStoryProgressUpdateWithWhereUniqueWithoutChapterInput | UserStoryProgressUpdateWithWhereUniqueWithoutChapterInput[]
    updateMany?: UserStoryProgressUpdateManyWithWhereWithoutChapterInput | UserStoryProgressUpdateManyWithWhereWithoutChapterInput[]
    deleteMany?: UserStoryProgressScalarWhereInput | UserStoryProgressScalarWhereInput[]
  }

  export type UserStoryProgressUncheckedUpdateManyWithoutChapterNestedInput = {
    create?: XOR<UserStoryProgressCreateWithoutChapterInput, UserStoryProgressUncheckedCreateWithoutChapterInput> | UserStoryProgressCreateWithoutChapterInput[] | UserStoryProgressUncheckedCreateWithoutChapterInput[]
    connectOrCreate?: UserStoryProgressCreateOrConnectWithoutChapterInput | UserStoryProgressCreateOrConnectWithoutChapterInput[]
    upsert?: UserStoryProgressUpsertWithWhereUniqueWithoutChapterInput | UserStoryProgressUpsertWithWhereUniqueWithoutChapterInput[]
    createMany?: UserStoryProgressCreateManyChapterInputEnvelope
    set?: UserStoryProgressWhereUniqueInput | UserStoryProgressWhereUniqueInput[]
    disconnect?: UserStoryProgressWhereUniqueInput | UserStoryProgressWhereUniqueInput[]
    delete?: UserStoryProgressWhereUniqueInput | UserStoryProgressWhereUniqueInput[]
    connect?: UserStoryProgressWhereUniqueInput | UserStoryProgressWhereUniqueInput[]
    update?: UserStoryProgressUpdateWithWhereUniqueWithoutChapterInput | UserStoryProgressUpdateWithWhereUniqueWithoutChapterInput[]
    updateMany?: UserStoryProgressUpdateManyWithWhereWithoutChapterInput | UserStoryProgressUpdateManyWithWhereWithoutChapterInput[]
    deleteMany?: UserStoryProgressScalarWhereInput | UserStoryProgressScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutStoryProgressInput = {
    create?: XOR<UserCreateWithoutStoryProgressInput, UserUncheckedCreateWithoutStoryProgressInput>
    connectOrCreate?: UserCreateOrConnectWithoutStoryProgressInput
    connect?: UserWhereUniqueInput
  }

  export type StoryChapterCreateNestedOneWithoutProgressInput = {
    create?: XOR<StoryChapterCreateWithoutProgressInput, StoryChapterUncheckedCreateWithoutProgressInput>
    connectOrCreate?: StoryChapterCreateOrConnectWithoutProgressInput
    connect?: StoryChapterWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type EnumTreasureStatusFieldUpdateOperationsInput = {
    set?: $Enums.TreasureStatus
  }

  export type EnumZombieStatusFieldUpdateOperationsInput = {
    set?: $Enums.ZombieStatus
  }

  export type UserUpdateOneRequiredWithoutStoryProgressNestedInput = {
    create?: XOR<UserCreateWithoutStoryProgressInput, UserUncheckedCreateWithoutStoryProgressInput>
    connectOrCreate?: UserCreateOrConnectWithoutStoryProgressInput
    upsert?: UserUpsertWithoutStoryProgressInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutStoryProgressInput, UserUpdateWithoutStoryProgressInput>, UserUncheckedUpdateWithoutStoryProgressInput>
  }

  export type StoryChapterUpdateOneRequiredWithoutProgressNestedInput = {
    create?: XOR<StoryChapterCreateWithoutProgressInput, StoryChapterUncheckedCreateWithoutProgressInput>
    connectOrCreate?: StoryChapterCreateOrConnectWithoutProgressInput
    upsert?: StoryChapterUpsertWithoutProgressInput
    connect?: StoryChapterWhereUniqueInput
    update?: XOR<XOR<StoryChapterUpdateToOneWithWhereWithoutProgressInput, StoryChapterUpdateWithoutProgressInput>, StoryChapterUncheckedUpdateWithoutProgressInput>
  }

  export type LegendSubchapterCreateNestedManyWithoutSagaInput = {
    create?: XOR<LegendSubchapterCreateWithoutSagaInput, LegendSubchapterUncheckedCreateWithoutSagaInput> | LegendSubchapterCreateWithoutSagaInput[] | LegendSubchapterUncheckedCreateWithoutSagaInput[]
    connectOrCreate?: LegendSubchapterCreateOrConnectWithoutSagaInput | LegendSubchapterCreateOrConnectWithoutSagaInput[]
    createMany?: LegendSubchapterCreateManySagaInputEnvelope
    connect?: LegendSubchapterWhereUniqueInput | LegendSubchapterWhereUniqueInput[]
  }

  export type LegendSubchapterUncheckedCreateNestedManyWithoutSagaInput = {
    create?: XOR<LegendSubchapterCreateWithoutSagaInput, LegendSubchapterUncheckedCreateWithoutSagaInput> | LegendSubchapterCreateWithoutSagaInput[] | LegendSubchapterUncheckedCreateWithoutSagaInput[]
    connectOrCreate?: LegendSubchapterCreateOrConnectWithoutSagaInput | LegendSubchapterCreateOrConnectWithoutSagaInput[]
    createMany?: LegendSubchapterCreateManySagaInputEnvelope
    connect?: LegendSubchapterWhereUniqueInput | LegendSubchapterWhereUniqueInput[]
  }

  export type LegendSubchapterUpdateManyWithoutSagaNestedInput = {
    create?: XOR<LegendSubchapterCreateWithoutSagaInput, LegendSubchapterUncheckedCreateWithoutSagaInput> | LegendSubchapterCreateWithoutSagaInput[] | LegendSubchapterUncheckedCreateWithoutSagaInput[]
    connectOrCreate?: LegendSubchapterCreateOrConnectWithoutSagaInput | LegendSubchapterCreateOrConnectWithoutSagaInput[]
    upsert?: LegendSubchapterUpsertWithWhereUniqueWithoutSagaInput | LegendSubchapterUpsertWithWhereUniqueWithoutSagaInput[]
    createMany?: LegendSubchapterCreateManySagaInputEnvelope
    set?: LegendSubchapterWhereUniqueInput | LegendSubchapterWhereUniqueInput[]
    disconnect?: LegendSubchapterWhereUniqueInput | LegendSubchapterWhereUniqueInput[]
    delete?: LegendSubchapterWhereUniqueInput | LegendSubchapterWhereUniqueInput[]
    connect?: LegendSubchapterWhereUniqueInput | LegendSubchapterWhereUniqueInput[]
    update?: LegendSubchapterUpdateWithWhereUniqueWithoutSagaInput | LegendSubchapterUpdateWithWhereUniqueWithoutSagaInput[]
    updateMany?: LegendSubchapterUpdateManyWithWhereWithoutSagaInput | LegendSubchapterUpdateManyWithWhereWithoutSagaInput[]
    deleteMany?: LegendSubchapterScalarWhereInput | LegendSubchapterScalarWhereInput[]
  }

  export type LegendSubchapterUncheckedUpdateManyWithoutSagaNestedInput = {
    create?: XOR<LegendSubchapterCreateWithoutSagaInput, LegendSubchapterUncheckedCreateWithoutSagaInput> | LegendSubchapterCreateWithoutSagaInput[] | LegendSubchapterUncheckedCreateWithoutSagaInput[]
    connectOrCreate?: LegendSubchapterCreateOrConnectWithoutSagaInput | LegendSubchapterCreateOrConnectWithoutSagaInput[]
    upsert?: LegendSubchapterUpsertWithWhereUniqueWithoutSagaInput | LegendSubchapterUpsertWithWhereUniqueWithoutSagaInput[]
    createMany?: LegendSubchapterCreateManySagaInputEnvelope
    set?: LegendSubchapterWhereUniqueInput | LegendSubchapterWhereUniqueInput[]
    disconnect?: LegendSubchapterWhereUniqueInput | LegendSubchapterWhereUniqueInput[]
    delete?: LegendSubchapterWhereUniqueInput | LegendSubchapterWhereUniqueInput[]
    connect?: LegendSubchapterWhereUniqueInput | LegendSubchapterWhereUniqueInput[]
    update?: LegendSubchapterUpdateWithWhereUniqueWithoutSagaInput | LegendSubchapterUpdateWithWhereUniqueWithoutSagaInput[]
    updateMany?: LegendSubchapterUpdateManyWithWhereWithoutSagaInput | LegendSubchapterUpdateManyWithWhereWithoutSagaInput[]
    deleteMany?: LegendSubchapterScalarWhereInput | LegendSubchapterScalarWhereInput[]
  }

  export type LegendSagaCreateNestedOneWithoutSubchaptersInput = {
    create?: XOR<LegendSagaCreateWithoutSubchaptersInput, LegendSagaUncheckedCreateWithoutSubchaptersInput>
    connectOrCreate?: LegendSagaCreateOrConnectWithoutSubchaptersInput
    connect?: LegendSagaWhereUniqueInput
  }

  export type UserLegendProgressCreateNestedManyWithoutSubchapterInput = {
    create?: XOR<UserLegendProgressCreateWithoutSubchapterInput, UserLegendProgressUncheckedCreateWithoutSubchapterInput> | UserLegendProgressCreateWithoutSubchapterInput[] | UserLegendProgressUncheckedCreateWithoutSubchapterInput[]
    connectOrCreate?: UserLegendProgressCreateOrConnectWithoutSubchapterInput | UserLegendProgressCreateOrConnectWithoutSubchapterInput[]
    createMany?: UserLegendProgressCreateManySubchapterInputEnvelope
    connect?: UserLegendProgressWhereUniqueInput | UserLegendProgressWhereUniqueInput[]
  }

  export type UserLegendProgressUncheckedCreateNestedManyWithoutSubchapterInput = {
    create?: XOR<UserLegendProgressCreateWithoutSubchapterInput, UserLegendProgressUncheckedCreateWithoutSubchapterInput> | UserLegendProgressCreateWithoutSubchapterInput[] | UserLegendProgressUncheckedCreateWithoutSubchapterInput[]
    connectOrCreate?: UserLegendProgressCreateOrConnectWithoutSubchapterInput | UserLegendProgressCreateOrConnectWithoutSubchapterInput[]
    createMany?: UserLegendProgressCreateManySubchapterInputEnvelope
    connect?: UserLegendProgressWhereUniqueInput | UserLegendProgressWhereUniqueInput[]
  }

  export type LegendSagaUpdateOneRequiredWithoutSubchaptersNestedInput = {
    create?: XOR<LegendSagaCreateWithoutSubchaptersInput, LegendSagaUncheckedCreateWithoutSubchaptersInput>
    connectOrCreate?: LegendSagaCreateOrConnectWithoutSubchaptersInput
    upsert?: LegendSagaUpsertWithoutSubchaptersInput
    connect?: LegendSagaWhereUniqueInput
    update?: XOR<XOR<LegendSagaUpdateToOneWithWhereWithoutSubchaptersInput, LegendSagaUpdateWithoutSubchaptersInput>, LegendSagaUncheckedUpdateWithoutSubchaptersInput>
  }

  export type UserLegendProgressUpdateManyWithoutSubchapterNestedInput = {
    create?: XOR<UserLegendProgressCreateWithoutSubchapterInput, UserLegendProgressUncheckedCreateWithoutSubchapterInput> | UserLegendProgressCreateWithoutSubchapterInput[] | UserLegendProgressUncheckedCreateWithoutSubchapterInput[]
    connectOrCreate?: UserLegendProgressCreateOrConnectWithoutSubchapterInput | UserLegendProgressCreateOrConnectWithoutSubchapterInput[]
    upsert?: UserLegendProgressUpsertWithWhereUniqueWithoutSubchapterInput | UserLegendProgressUpsertWithWhereUniqueWithoutSubchapterInput[]
    createMany?: UserLegendProgressCreateManySubchapterInputEnvelope
    set?: UserLegendProgressWhereUniqueInput | UserLegendProgressWhereUniqueInput[]
    disconnect?: UserLegendProgressWhereUniqueInput | UserLegendProgressWhereUniqueInput[]
    delete?: UserLegendProgressWhereUniqueInput | UserLegendProgressWhereUniqueInput[]
    connect?: UserLegendProgressWhereUniqueInput | UserLegendProgressWhereUniqueInput[]
    update?: UserLegendProgressUpdateWithWhereUniqueWithoutSubchapterInput | UserLegendProgressUpdateWithWhereUniqueWithoutSubchapterInput[]
    updateMany?: UserLegendProgressUpdateManyWithWhereWithoutSubchapterInput | UserLegendProgressUpdateManyWithWhereWithoutSubchapterInput[]
    deleteMany?: UserLegendProgressScalarWhereInput | UserLegendProgressScalarWhereInput[]
  }

  export type UserLegendProgressUncheckedUpdateManyWithoutSubchapterNestedInput = {
    create?: XOR<UserLegendProgressCreateWithoutSubchapterInput, UserLegendProgressUncheckedCreateWithoutSubchapterInput> | UserLegendProgressCreateWithoutSubchapterInput[] | UserLegendProgressUncheckedCreateWithoutSubchapterInput[]
    connectOrCreate?: UserLegendProgressCreateOrConnectWithoutSubchapterInput | UserLegendProgressCreateOrConnectWithoutSubchapterInput[]
    upsert?: UserLegendProgressUpsertWithWhereUniqueWithoutSubchapterInput | UserLegendProgressUpsertWithWhereUniqueWithoutSubchapterInput[]
    createMany?: UserLegendProgressCreateManySubchapterInputEnvelope
    set?: UserLegendProgressWhereUniqueInput | UserLegendProgressWhereUniqueInput[]
    disconnect?: UserLegendProgressWhereUniqueInput | UserLegendProgressWhereUniqueInput[]
    delete?: UserLegendProgressWhereUniqueInput | UserLegendProgressWhereUniqueInput[]
    connect?: UserLegendProgressWhereUniqueInput | UserLegendProgressWhereUniqueInput[]
    update?: UserLegendProgressUpdateWithWhereUniqueWithoutSubchapterInput | UserLegendProgressUpdateWithWhereUniqueWithoutSubchapterInput[]
    updateMany?: UserLegendProgressUpdateManyWithWhereWithoutSubchapterInput | UserLegendProgressUpdateManyWithWhereWithoutSubchapterInput[]
    deleteMany?: UserLegendProgressScalarWhereInput | UserLegendProgressScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutLegendProgressInput = {
    create?: XOR<UserCreateWithoutLegendProgressInput, UserUncheckedCreateWithoutLegendProgressInput>
    connectOrCreate?: UserCreateOrConnectWithoutLegendProgressInput
    connect?: UserWhereUniqueInput
  }

  export type LegendSubchapterCreateNestedOneWithoutProgressInput = {
    create?: XOR<LegendSubchapterCreateWithoutProgressInput, LegendSubchapterUncheckedCreateWithoutProgressInput>
    connectOrCreate?: LegendSubchapterCreateOrConnectWithoutProgressInput
    connect?: LegendSubchapterWhereUniqueInput
  }

  export type EnumLegendProgressStatusFieldUpdateOperationsInput = {
    set?: $Enums.LegendProgressStatus
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutLegendProgressNestedInput = {
    create?: XOR<UserCreateWithoutLegendProgressInput, UserUncheckedCreateWithoutLegendProgressInput>
    connectOrCreate?: UserCreateOrConnectWithoutLegendProgressInput
    upsert?: UserUpsertWithoutLegendProgressInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutLegendProgressInput, UserUpdateWithoutLegendProgressInput>, UserUncheckedUpdateWithoutLegendProgressInput>
  }

  export type LegendSubchapterUpdateOneRequiredWithoutProgressNestedInput = {
    create?: XOR<LegendSubchapterCreateWithoutProgressInput, LegendSubchapterUncheckedCreateWithoutProgressInput>
    connectOrCreate?: LegendSubchapterCreateOrConnectWithoutProgressInput
    upsert?: LegendSubchapterUpsertWithoutProgressInput
    connect?: LegendSubchapterWhereUniqueInput
    update?: XOR<XOR<LegendSubchapterUpdateToOneWithWhereWithoutProgressInput, LegendSubchapterUpdateWithoutProgressInput>, LegendSubchapterUncheckedUpdateWithoutProgressInput>
  }

  export type UserMilestoneProgressCreateNestedManyWithoutMilestoneInput = {
    create?: XOR<UserMilestoneProgressCreateWithoutMilestoneInput, UserMilestoneProgressUncheckedCreateWithoutMilestoneInput> | UserMilestoneProgressCreateWithoutMilestoneInput[] | UserMilestoneProgressUncheckedCreateWithoutMilestoneInput[]
    connectOrCreate?: UserMilestoneProgressCreateOrConnectWithoutMilestoneInput | UserMilestoneProgressCreateOrConnectWithoutMilestoneInput[]
    createMany?: UserMilestoneProgressCreateManyMilestoneInputEnvelope
    connect?: UserMilestoneProgressWhereUniqueInput | UserMilestoneProgressWhereUniqueInput[]
  }

  export type UserMilestoneProgressUncheckedCreateNestedManyWithoutMilestoneInput = {
    create?: XOR<UserMilestoneProgressCreateWithoutMilestoneInput, UserMilestoneProgressUncheckedCreateWithoutMilestoneInput> | UserMilestoneProgressCreateWithoutMilestoneInput[] | UserMilestoneProgressUncheckedCreateWithoutMilestoneInput[]
    connectOrCreate?: UserMilestoneProgressCreateOrConnectWithoutMilestoneInput | UserMilestoneProgressCreateOrConnectWithoutMilestoneInput[]
    createMany?: UserMilestoneProgressCreateManyMilestoneInputEnvelope
    connect?: UserMilestoneProgressWhereUniqueInput | UserMilestoneProgressWhereUniqueInput[]
  }

  export type EnumMilestoneCategoryFieldUpdateOperationsInput = {
    set?: $Enums.MilestoneCategory
  }

  export type UserMilestoneProgressUpdateManyWithoutMilestoneNestedInput = {
    create?: XOR<UserMilestoneProgressCreateWithoutMilestoneInput, UserMilestoneProgressUncheckedCreateWithoutMilestoneInput> | UserMilestoneProgressCreateWithoutMilestoneInput[] | UserMilestoneProgressUncheckedCreateWithoutMilestoneInput[]
    connectOrCreate?: UserMilestoneProgressCreateOrConnectWithoutMilestoneInput | UserMilestoneProgressCreateOrConnectWithoutMilestoneInput[]
    upsert?: UserMilestoneProgressUpsertWithWhereUniqueWithoutMilestoneInput | UserMilestoneProgressUpsertWithWhereUniqueWithoutMilestoneInput[]
    createMany?: UserMilestoneProgressCreateManyMilestoneInputEnvelope
    set?: UserMilestoneProgressWhereUniqueInput | UserMilestoneProgressWhereUniqueInput[]
    disconnect?: UserMilestoneProgressWhereUniqueInput | UserMilestoneProgressWhereUniqueInput[]
    delete?: UserMilestoneProgressWhereUniqueInput | UserMilestoneProgressWhereUniqueInput[]
    connect?: UserMilestoneProgressWhereUniqueInput | UserMilestoneProgressWhereUniqueInput[]
    update?: UserMilestoneProgressUpdateWithWhereUniqueWithoutMilestoneInput | UserMilestoneProgressUpdateWithWhereUniqueWithoutMilestoneInput[]
    updateMany?: UserMilestoneProgressUpdateManyWithWhereWithoutMilestoneInput | UserMilestoneProgressUpdateManyWithWhereWithoutMilestoneInput[]
    deleteMany?: UserMilestoneProgressScalarWhereInput | UserMilestoneProgressScalarWhereInput[]
  }

  export type UserMilestoneProgressUncheckedUpdateManyWithoutMilestoneNestedInput = {
    create?: XOR<UserMilestoneProgressCreateWithoutMilestoneInput, UserMilestoneProgressUncheckedCreateWithoutMilestoneInput> | UserMilestoneProgressCreateWithoutMilestoneInput[] | UserMilestoneProgressUncheckedCreateWithoutMilestoneInput[]
    connectOrCreate?: UserMilestoneProgressCreateOrConnectWithoutMilestoneInput | UserMilestoneProgressCreateOrConnectWithoutMilestoneInput[]
    upsert?: UserMilestoneProgressUpsertWithWhereUniqueWithoutMilestoneInput | UserMilestoneProgressUpsertWithWhereUniqueWithoutMilestoneInput[]
    createMany?: UserMilestoneProgressCreateManyMilestoneInputEnvelope
    set?: UserMilestoneProgressWhereUniqueInput | UserMilestoneProgressWhereUniqueInput[]
    disconnect?: UserMilestoneProgressWhereUniqueInput | UserMilestoneProgressWhereUniqueInput[]
    delete?: UserMilestoneProgressWhereUniqueInput | UserMilestoneProgressWhereUniqueInput[]
    connect?: UserMilestoneProgressWhereUniqueInput | UserMilestoneProgressWhereUniqueInput[]
    update?: UserMilestoneProgressUpdateWithWhereUniqueWithoutMilestoneInput | UserMilestoneProgressUpdateWithWhereUniqueWithoutMilestoneInput[]
    updateMany?: UserMilestoneProgressUpdateManyWithWhereWithoutMilestoneInput | UserMilestoneProgressUpdateManyWithWhereWithoutMilestoneInput[]
    deleteMany?: UserMilestoneProgressScalarWhereInput | UserMilestoneProgressScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutMilestoneProgressInput = {
    create?: XOR<UserCreateWithoutMilestoneProgressInput, UserUncheckedCreateWithoutMilestoneProgressInput>
    connectOrCreate?: UserCreateOrConnectWithoutMilestoneProgressInput
    connect?: UserWhereUniqueInput
  }

  export type MilestoneCreateNestedOneWithoutProgressInput = {
    create?: XOR<MilestoneCreateWithoutProgressInput, MilestoneUncheckedCreateWithoutProgressInput>
    connectOrCreate?: MilestoneCreateOrConnectWithoutProgressInput
    connect?: MilestoneWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutMilestoneProgressNestedInput = {
    create?: XOR<UserCreateWithoutMilestoneProgressInput, UserUncheckedCreateWithoutMilestoneProgressInput>
    connectOrCreate?: UserCreateOrConnectWithoutMilestoneProgressInput
    upsert?: UserUpsertWithoutMilestoneProgressInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutMilestoneProgressInput, UserUpdateWithoutMilestoneProgressInput>, UserUncheckedUpdateWithoutMilestoneProgressInput>
  }

  export type MilestoneUpdateOneRequiredWithoutProgressNestedInput = {
    create?: XOR<MilestoneCreateWithoutProgressInput, MilestoneUncheckedCreateWithoutProgressInput>
    connectOrCreate?: MilestoneCreateOrConnectWithoutProgressInput
    upsert?: MilestoneUpsertWithoutProgressInput
    connect?: MilestoneWhereUniqueInput
    update?: XOR<XOR<MilestoneUpdateToOneWithWhereWithoutProgressInput, MilestoneUpdateWithoutProgressInput>, MilestoneUncheckedUpdateWithoutProgressInput>
  }

  export type UserCreateNestedOneWithoutCatclawProgressInput = {
    create?: XOR<UserCreateWithoutCatclawProgressInput, UserUncheckedCreateWithoutCatclawProgressInput>
    connectOrCreate?: UserCreateOrConnectWithoutCatclawProgressInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutCatclawProgressNestedInput = {
    create?: XOR<UserCreateWithoutCatclawProgressInput, UserUncheckedCreateWithoutCatclawProgressInput>
    connectOrCreate?: UserCreateOrConnectWithoutCatclawProgressInput
    upsert?: UserUpsertWithoutCatclawProgressInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCatclawProgressInput, UserUpdateWithoutCatclawProgressInput>, UserUncheckedUpdateWithoutCatclawProgressInput>
  }

  export type UserMeowMedalCreateNestedManyWithoutMeowMedalInput = {
    create?: XOR<UserMeowMedalCreateWithoutMeowMedalInput, UserMeowMedalUncheckedCreateWithoutMeowMedalInput> | UserMeowMedalCreateWithoutMeowMedalInput[] | UserMeowMedalUncheckedCreateWithoutMeowMedalInput[]
    connectOrCreate?: UserMeowMedalCreateOrConnectWithoutMeowMedalInput | UserMeowMedalCreateOrConnectWithoutMeowMedalInput[]
    createMany?: UserMeowMedalCreateManyMeowMedalInputEnvelope
    connect?: UserMeowMedalWhereUniqueInput | UserMeowMedalWhereUniqueInput[]
  }

  export type UserMeowMedalUncheckedCreateNestedManyWithoutMeowMedalInput = {
    create?: XOR<UserMeowMedalCreateWithoutMeowMedalInput, UserMeowMedalUncheckedCreateWithoutMeowMedalInput> | UserMeowMedalCreateWithoutMeowMedalInput[] | UserMeowMedalUncheckedCreateWithoutMeowMedalInput[]
    connectOrCreate?: UserMeowMedalCreateOrConnectWithoutMeowMedalInput | UserMeowMedalCreateOrConnectWithoutMeowMedalInput[]
    createMany?: UserMeowMedalCreateManyMeowMedalInputEnvelope
    connect?: UserMeowMedalWhereUniqueInput | UserMeowMedalWhereUniqueInput[]
  }

  export type UserMeowMedalUpdateManyWithoutMeowMedalNestedInput = {
    create?: XOR<UserMeowMedalCreateWithoutMeowMedalInput, UserMeowMedalUncheckedCreateWithoutMeowMedalInput> | UserMeowMedalCreateWithoutMeowMedalInput[] | UserMeowMedalUncheckedCreateWithoutMeowMedalInput[]
    connectOrCreate?: UserMeowMedalCreateOrConnectWithoutMeowMedalInput | UserMeowMedalCreateOrConnectWithoutMeowMedalInput[]
    upsert?: UserMeowMedalUpsertWithWhereUniqueWithoutMeowMedalInput | UserMeowMedalUpsertWithWhereUniqueWithoutMeowMedalInput[]
    createMany?: UserMeowMedalCreateManyMeowMedalInputEnvelope
    set?: UserMeowMedalWhereUniqueInput | UserMeowMedalWhereUniqueInput[]
    disconnect?: UserMeowMedalWhereUniqueInput | UserMeowMedalWhereUniqueInput[]
    delete?: UserMeowMedalWhereUniqueInput | UserMeowMedalWhereUniqueInput[]
    connect?: UserMeowMedalWhereUniqueInput | UserMeowMedalWhereUniqueInput[]
    update?: UserMeowMedalUpdateWithWhereUniqueWithoutMeowMedalInput | UserMeowMedalUpdateWithWhereUniqueWithoutMeowMedalInput[]
    updateMany?: UserMeowMedalUpdateManyWithWhereWithoutMeowMedalInput | UserMeowMedalUpdateManyWithWhereWithoutMeowMedalInput[]
    deleteMany?: UserMeowMedalScalarWhereInput | UserMeowMedalScalarWhereInput[]
  }

  export type UserMeowMedalUncheckedUpdateManyWithoutMeowMedalNestedInput = {
    create?: XOR<UserMeowMedalCreateWithoutMeowMedalInput, UserMeowMedalUncheckedCreateWithoutMeowMedalInput> | UserMeowMedalCreateWithoutMeowMedalInput[] | UserMeowMedalUncheckedCreateWithoutMeowMedalInput[]
    connectOrCreate?: UserMeowMedalCreateOrConnectWithoutMeowMedalInput | UserMeowMedalCreateOrConnectWithoutMeowMedalInput[]
    upsert?: UserMeowMedalUpsertWithWhereUniqueWithoutMeowMedalInput | UserMeowMedalUpsertWithWhereUniqueWithoutMeowMedalInput[]
    createMany?: UserMeowMedalCreateManyMeowMedalInputEnvelope
    set?: UserMeowMedalWhereUniqueInput | UserMeowMedalWhereUniqueInput[]
    disconnect?: UserMeowMedalWhereUniqueInput | UserMeowMedalWhereUniqueInput[]
    delete?: UserMeowMedalWhereUniqueInput | UserMeowMedalWhereUniqueInput[]
    connect?: UserMeowMedalWhereUniqueInput | UserMeowMedalWhereUniqueInput[]
    update?: UserMeowMedalUpdateWithWhereUniqueWithoutMeowMedalInput | UserMeowMedalUpdateWithWhereUniqueWithoutMeowMedalInput[]
    updateMany?: UserMeowMedalUpdateManyWithWhereWithoutMeowMedalInput | UserMeowMedalUpdateManyWithWhereWithoutMeowMedalInput[]
    deleteMany?: UserMeowMedalScalarWhereInput | UserMeowMedalScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutMeowMedalProgressInput = {
    create?: XOR<UserCreateWithoutMeowMedalProgressInput, UserUncheckedCreateWithoutMeowMedalProgressInput>
    connectOrCreate?: UserCreateOrConnectWithoutMeowMedalProgressInput
    connect?: UserWhereUniqueInput
  }

  export type MeowMedalCreateNestedOneWithoutEarnedByInput = {
    create?: XOR<MeowMedalCreateWithoutEarnedByInput, MeowMedalUncheckedCreateWithoutEarnedByInput>
    connectOrCreate?: MeowMedalCreateOrConnectWithoutEarnedByInput
    connect?: MeowMedalWhereUniqueInput
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type UserUpdateOneRequiredWithoutMeowMedalProgressNestedInput = {
    create?: XOR<UserCreateWithoutMeowMedalProgressInput, UserUncheckedCreateWithoutMeowMedalProgressInput>
    connectOrCreate?: UserCreateOrConnectWithoutMeowMedalProgressInput
    upsert?: UserUpsertWithoutMeowMedalProgressInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutMeowMedalProgressInput, UserUpdateWithoutMeowMedalProgressInput>, UserUncheckedUpdateWithoutMeowMedalProgressInput>
  }

  export type MeowMedalUpdateOneRequiredWithoutEarnedByNestedInput = {
    create?: XOR<MeowMedalCreateWithoutEarnedByInput, MeowMedalUncheckedCreateWithoutEarnedByInput>
    connectOrCreate?: MeowMedalCreateOrConnectWithoutEarnedByInput
    upsert?: MeowMedalUpsertWithoutEarnedByInput
    connect?: MeowMedalWhereUniqueInput
    update?: XOR<XOR<MeowMedalUpdateToOneWithWhereWithoutEarnedByInput, MeowMedalUpdateWithoutEarnedByInput>, MeowMedalUncheckedUpdateWithoutEarnedByInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumVisibilityFilter<$PrismaModel = never> = {
    equals?: $Enums.Visibility | EnumVisibilityFieldRefInput<$PrismaModel>
    in?: $Enums.Visibility[] | ListEnumVisibilityFieldRefInput<$PrismaModel>
    notIn?: $Enums.Visibility[] | ListEnumVisibilityFieldRefInput<$PrismaModel>
    not?: NestedEnumVisibilityFilter<$PrismaModel> | $Enums.Visibility
  }

  export type NestedEnumVisibilityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Visibility | EnumVisibilityFieldRefInput<$PrismaModel>
    in?: $Enums.Visibility[] | ListEnumVisibilityFieldRefInput<$PrismaModel>
    notIn?: $Enums.Visibility[] | ListEnumVisibilityFieldRefInput<$PrismaModel>
    not?: NestedEnumVisibilityWithAggregatesFilter<$PrismaModel> | $Enums.Visibility
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumVisibilityFilter<$PrismaModel>
    _max?: NestedEnumVisibilityFilter<$PrismaModel>
  }

  export type NestedEnumFriendshipStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.FriendshipStatus | EnumFriendshipStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FriendshipStatus[] | ListEnumFriendshipStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.FriendshipStatus[] | ListEnumFriendshipStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumFriendshipStatusFilter<$PrismaModel> | $Enums.FriendshipStatus
  }

  export type NestedEnumFriendshipStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FriendshipStatus | EnumFriendshipStatusFieldRefInput<$PrismaModel>
    in?: $Enums.FriendshipStatus[] | ListEnumFriendshipStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.FriendshipStatus[] | ListEnumFriendshipStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumFriendshipStatusWithAggregatesFilter<$PrismaModel> | $Enums.FriendshipStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumFriendshipStatusFilter<$PrismaModel>
    _max?: NestedEnumFriendshipStatusFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedEnumTreasureStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TreasureStatus | EnumTreasureStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TreasureStatus[] | ListEnumTreasureStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TreasureStatus[] | ListEnumTreasureStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTreasureStatusFilter<$PrismaModel> | $Enums.TreasureStatus
  }

  export type NestedEnumZombieStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ZombieStatus | EnumZombieStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ZombieStatus[] | ListEnumZombieStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ZombieStatus[] | ListEnumZombieStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumZombieStatusFilter<$PrismaModel> | $Enums.ZombieStatus
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumTreasureStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TreasureStatus | EnumTreasureStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TreasureStatus[] | ListEnumTreasureStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TreasureStatus[] | ListEnumTreasureStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTreasureStatusWithAggregatesFilter<$PrismaModel> | $Enums.TreasureStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTreasureStatusFilter<$PrismaModel>
    _max?: NestedEnumTreasureStatusFilter<$PrismaModel>
  }

  export type NestedEnumZombieStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ZombieStatus | EnumZombieStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ZombieStatus[] | ListEnumZombieStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.ZombieStatus[] | ListEnumZombieStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumZombieStatusWithAggregatesFilter<$PrismaModel> | $Enums.ZombieStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumZombieStatusFilter<$PrismaModel>
    _max?: NestedEnumZombieStatusFilter<$PrismaModel>
  }

  export type NestedEnumLegendProgressStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.LegendProgressStatus | EnumLegendProgressStatusFieldRefInput<$PrismaModel>
    in?: $Enums.LegendProgressStatus[] | ListEnumLegendProgressStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.LegendProgressStatus[] | ListEnumLegendProgressStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumLegendProgressStatusFilter<$PrismaModel> | $Enums.LegendProgressStatus
  }

  export type NestedEnumLegendProgressStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LegendProgressStatus | EnumLegendProgressStatusFieldRefInput<$PrismaModel>
    in?: $Enums.LegendProgressStatus[] | ListEnumLegendProgressStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.LegendProgressStatus[] | ListEnumLegendProgressStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumLegendProgressStatusWithAggregatesFilter<$PrismaModel> | $Enums.LegendProgressStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLegendProgressStatusFilter<$PrismaModel>
    _max?: NestedEnumLegendProgressStatusFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumMilestoneCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.MilestoneCategory | EnumMilestoneCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.MilestoneCategory[] | ListEnumMilestoneCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.MilestoneCategory[] | ListEnumMilestoneCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumMilestoneCategoryFilter<$PrismaModel> | $Enums.MilestoneCategory
  }

  export type NestedEnumMilestoneCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MilestoneCategory | EnumMilestoneCategoryFieldRefInput<$PrismaModel>
    in?: $Enums.MilestoneCategory[] | ListEnumMilestoneCategoryFieldRefInput<$PrismaModel>
    notIn?: $Enums.MilestoneCategory[] | ListEnumMilestoneCategoryFieldRefInput<$PrismaModel>
    not?: NestedEnumMilestoneCategoryWithAggregatesFilter<$PrismaModel> | $Enums.MilestoneCategory
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMilestoneCategoryFilter<$PrismaModel>
    _max?: NestedEnumMilestoneCategoryFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type PrivacySettingsCreateWithoutUserInput = {
    profileVisibility?: $Enums.Visibility
    progressVisibility?: $Enums.Visibility
  }

  export type PrivacySettingsUncheckedCreateWithoutUserInput = {
    profileVisibility?: $Enums.Visibility
    progressVisibility?: $Enums.Visibility
  }

  export type PrivacySettingsCreateOrConnectWithoutUserInput = {
    where: PrivacySettingsWhereUniqueInput
    create: XOR<PrivacySettingsCreateWithoutUserInput, PrivacySettingsUncheckedCreateWithoutUserInput>
  }

  export type FriendshipCreateWithoutRequesterInput = {
    id?: string
    status?: $Enums.FriendshipStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    addressee: UserCreateNestedOneWithoutReceivedFriendRequestsInput
  }

  export type FriendshipUncheckedCreateWithoutRequesterInput = {
    id?: string
    addresseeId: string
    status?: $Enums.FriendshipStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FriendshipCreateOrConnectWithoutRequesterInput = {
    where: FriendshipWhereUniqueInput
    create: XOR<FriendshipCreateWithoutRequesterInput, FriendshipUncheckedCreateWithoutRequesterInput>
  }

  export type FriendshipCreateManyRequesterInputEnvelope = {
    data: FriendshipCreateManyRequesterInput | FriendshipCreateManyRequesterInput[]
    skipDuplicates?: boolean
  }

  export type FriendshipCreateWithoutAddresseeInput = {
    id?: string
    status?: $Enums.FriendshipStatus
    createdAt?: Date | string
    updatedAt?: Date | string
    requester: UserCreateNestedOneWithoutSentFriendRequestsInput
  }

  export type FriendshipUncheckedCreateWithoutAddresseeInput = {
    id?: string
    requesterId: string
    status?: $Enums.FriendshipStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FriendshipCreateOrConnectWithoutAddresseeInput = {
    where: FriendshipWhereUniqueInput
    create: XOR<FriendshipCreateWithoutAddresseeInput, FriendshipUncheckedCreateWithoutAddresseeInput>
  }

  export type FriendshipCreateManyAddresseeInputEnvelope = {
    data: FriendshipCreateManyAddresseeInput | FriendshipCreateManyAddresseeInput[]
    skipDuplicates?: boolean
  }

  export type UserStoryProgressCreateWithoutUserInput = {
    id?: string
    cleared?: boolean
    treasures?: $Enums.TreasureStatus
    zombies?: $Enums.ZombieStatus
    updatedAt?: Date | string
    chapter: StoryChapterCreateNestedOneWithoutProgressInput
  }

  export type UserStoryProgressUncheckedCreateWithoutUserInput = {
    id?: string
    storyChapterId: string
    cleared?: boolean
    treasures?: $Enums.TreasureStatus
    zombies?: $Enums.ZombieStatus
    updatedAt?: Date | string
  }

  export type UserStoryProgressCreateOrConnectWithoutUserInput = {
    where: UserStoryProgressWhereUniqueInput
    create: XOR<UserStoryProgressCreateWithoutUserInput, UserStoryProgressUncheckedCreateWithoutUserInput>
  }

  export type UserStoryProgressCreateManyUserInputEnvelope = {
    data: UserStoryProgressCreateManyUserInput | UserStoryProgressCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type UserLegendProgressCreateWithoutUserInput = {
    id?: string
    status?: $Enums.LegendProgressStatus
    crownMax?: number | null
    notes?: string | null
    updatedAt?: Date | string
    subchapter: LegendSubchapterCreateNestedOneWithoutProgressInput
  }

  export type UserLegendProgressUncheckedCreateWithoutUserInput = {
    id?: string
    subchapterId: string
    status?: $Enums.LegendProgressStatus
    crownMax?: number | null
    notes?: string | null
    updatedAt?: Date | string
  }

  export type UserLegendProgressCreateOrConnectWithoutUserInput = {
    where: UserLegendProgressWhereUniqueInput
    create: XOR<UserLegendProgressCreateWithoutUserInput, UserLegendProgressUncheckedCreateWithoutUserInput>
  }

  export type UserLegendProgressCreateManyUserInputEnvelope = {
    data: UserLegendProgressCreateManyUserInput | UserLegendProgressCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type UserMilestoneProgressCreateWithoutUserInput = {
    id?: string
    cleared?: boolean
    notes?: string | null
    updatedAt?: Date | string
    milestone: MilestoneCreateNestedOneWithoutProgressInput
  }

  export type UserMilestoneProgressUncheckedCreateWithoutUserInput = {
    id?: string
    milestoneId: string
    cleared?: boolean
    notes?: string | null
    updatedAt?: Date | string
  }

  export type UserMilestoneProgressCreateOrConnectWithoutUserInput = {
    where: UserMilestoneProgressWhereUniqueInput
    create: XOR<UserMilestoneProgressCreateWithoutUserInput, UserMilestoneProgressUncheckedCreateWithoutUserInput>
  }

  export type UserMilestoneProgressCreateManyUserInputEnvelope = {
    data: UserMilestoneProgressCreateManyUserInput | UserMilestoneProgressCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type UserCatclawProgressCreateWithoutUserInput = {
    id?: string
    currentRank?: string | null
    bestRank?: string | null
    notes?: string | null
    updatedAt?: Date | string
  }

  export type UserCatclawProgressUncheckedCreateWithoutUserInput = {
    id?: string
    currentRank?: string | null
    bestRank?: string | null
    notes?: string | null
    updatedAt?: Date | string
  }

  export type UserCatclawProgressCreateOrConnectWithoutUserInput = {
    where: UserCatclawProgressWhereUniqueInput
    create: XOR<UserCatclawProgressCreateWithoutUserInput, UserCatclawProgressUncheckedCreateWithoutUserInput>
  }

  export type UserMeowMedalCreateWithoutUserInput = {
    id?: string
    earned?: boolean
    earnedAt?: Date | string | null
    updatedAt?: Date | string
    meowMedal: MeowMedalCreateNestedOneWithoutEarnedByInput
  }

  export type UserMeowMedalUncheckedCreateWithoutUserInput = {
    id?: string
    meowMedalId: string
    earned?: boolean
    earnedAt?: Date | string | null
    updatedAt?: Date | string
  }

  export type UserMeowMedalCreateOrConnectWithoutUserInput = {
    where: UserMeowMedalWhereUniqueInput
    create: XOR<UserMeowMedalCreateWithoutUserInput, UserMeowMedalUncheckedCreateWithoutUserInput>
  }

  export type UserMeowMedalCreateManyUserInputEnvelope = {
    data: UserMeowMedalCreateManyUserInput | UserMeowMedalCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type PrivacySettingsUpsertWithoutUserInput = {
    update: XOR<PrivacySettingsUpdateWithoutUserInput, PrivacySettingsUncheckedUpdateWithoutUserInput>
    create: XOR<PrivacySettingsCreateWithoutUserInput, PrivacySettingsUncheckedCreateWithoutUserInput>
    where?: PrivacySettingsWhereInput
  }

  export type PrivacySettingsUpdateToOneWithWhereWithoutUserInput = {
    where?: PrivacySettingsWhereInput
    data: XOR<PrivacySettingsUpdateWithoutUserInput, PrivacySettingsUncheckedUpdateWithoutUserInput>
  }

  export type PrivacySettingsUpdateWithoutUserInput = {
    profileVisibility?: EnumVisibilityFieldUpdateOperationsInput | $Enums.Visibility
    progressVisibility?: EnumVisibilityFieldUpdateOperationsInput | $Enums.Visibility
  }

  export type PrivacySettingsUncheckedUpdateWithoutUserInput = {
    profileVisibility?: EnumVisibilityFieldUpdateOperationsInput | $Enums.Visibility
    progressVisibility?: EnumVisibilityFieldUpdateOperationsInput | $Enums.Visibility
  }

  export type FriendshipUpsertWithWhereUniqueWithoutRequesterInput = {
    where: FriendshipWhereUniqueInput
    update: XOR<FriendshipUpdateWithoutRequesterInput, FriendshipUncheckedUpdateWithoutRequesterInput>
    create: XOR<FriendshipCreateWithoutRequesterInput, FriendshipUncheckedCreateWithoutRequesterInput>
  }

  export type FriendshipUpdateWithWhereUniqueWithoutRequesterInput = {
    where: FriendshipWhereUniqueInput
    data: XOR<FriendshipUpdateWithoutRequesterInput, FriendshipUncheckedUpdateWithoutRequesterInput>
  }

  export type FriendshipUpdateManyWithWhereWithoutRequesterInput = {
    where: FriendshipScalarWhereInput
    data: XOR<FriendshipUpdateManyMutationInput, FriendshipUncheckedUpdateManyWithoutRequesterInput>
  }

  export type FriendshipScalarWhereInput = {
    AND?: FriendshipScalarWhereInput | FriendshipScalarWhereInput[]
    OR?: FriendshipScalarWhereInput[]
    NOT?: FriendshipScalarWhereInput | FriendshipScalarWhereInput[]
    id?: StringFilter<"Friendship"> | string
    requesterId?: StringFilter<"Friendship"> | string
    addresseeId?: StringFilter<"Friendship"> | string
    status?: EnumFriendshipStatusFilter<"Friendship"> | $Enums.FriendshipStatus
    createdAt?: DateTimeFilter<"Friendship"> | Date | string
    updatedAt?: DateTimeFilter<"Friendship"> | Date | string
  }

  export type FriendshipUpsertWithWhereUniqueWithoutAddresseeInput = {
    where: FriendshipWhereUniqueInput
    update: XOR<FriendshipUpdateWithoutAddresseeInput, FriendshipUncheckedUpdateWithoutAddresseeInput>
    create: XOR<FriendshipCreateWithoutAddresseeInput, FriendshipUncheckedCreateWithoutAddresseeInput>
  }

  export type FriendshipUpdateWithWhereUniqueWithoutAddresseeInput = {
    where: FriendshipWhereUniqueInput
    data: XOR<FriendshipUpdateWithoutAddresseeInput, FriendshipUncheckedUpdateWithoutAddresseeInput>
  }

  export type FriendshipUpdateManyWithWhereWithoutAddresseeInput = {
    where: FriendshipScalarWhereInput
    data: XOR<FriendshipUpdateManyMutationInput, FriendshipUncheckedUpdateManyWithoutAddresseeInput>
  }

  export type UserStoryProgressUpsertWithWhereUniqueWithoutUserInput = {
    where: UserStoryProgressWhereUniqueInput
    update: XOR<UserStoryProgressUpdateWithoutUserInput, UserStoryProgressUncheckedUpdateWithoutUserInput>
    create: XOR<UserStoryProgressCreateWithoutUserInput, UserStoryProgressUncheckedCreateWithoutUserInput>
  }

  export type UserStoryProgressUpdateWithWhereUniqueWithoutUserInput = {
    where: UserStoryProgressWhereUniqueInput
    data: XOR<UserStoryProgressUpdateWithoutUserInput, UserStoryProgressUncheckedUpdateWithoutUserInput>
  }

  export type UserStoryProgressUpdateManyWithWhereWithoutUserInput = {
    where: UserStoryProgressScalarWhereInput
    data: XOR<UserStoryProgressUpdateManyMutationInput, UserStoryProgressUncheckedUpdateManyWithoutUserInput>
  }

  export type UserStoryProgressScalarWhereInput = {
    AND?: UserStoryProgressScalarWhereInput | UserStoryProgressScalarWhereInput[]
    OR?: UserStoryProgressScalarWhereInput[]
    NOT?: UserStoryProgressScalarWhereInput | UserStoryProgressScalarWhereInput[]
    id?: StringFilter<"UserStoryProgress"> | string
    userId?: StringFilter<"UserStoryProgress"> | string
    storyChapterId?: StringFilter<"UserStoryProgress"> | string
    cleared?: BoolFilter<"UserStoryProgress"> | boolean
    treasures?: EnumTreasureStatusFilter<"UserStoryProgress"> | $Enums.TreasureStatus
    zombies?: EnumZombieStatusFilter<"UserStoryProgress"> | $Enums.ZombieStatus
    updatedAt?: DateTimeFilter<"UserStoryProgress"> | Date | string
  }

  export type UserLegendProgressUpsertWithWhereUniqueWithoutUserInput = {
    where: UserLegendProgressWhereUniqueInput
    update: XOR<UserLegendProgressUpdateWithoutUserInput, UserLegendProgressUncheckedUpdateWithoutUserInput>
    create: XOR<UserLegendProgressCreateWithoutUserInput, UserLegendProgressUncheckedCreateWithoutUserInput>
  }

  export type UserLegendProgressUpdateWithWhereUniqueWithoutUserInput = {
    where: UserLegendProgressWhereUniqueInput
    data: XOR<UserLegendProgressUpdateWithoutUserInput, UserLegendProgressUncheckedUpdateWithoutUserInput>
  }

  export type UserLegendProgressUpdateManyWithWhereWithoutUserInput = {
    where: UserLegendProgressScalarWhereInput
    data: XOR<UserLegendProgressUpdateManyMutationInput, UserLegendProgressUncheckedUpdateManyWithoutUserInput>
  }

  export type UserLegendProgressScalarWhereInput = {
    AND?: UserLegendProgressScalarWhereInput | UserLegendProgressScalarWhereInput[]
    OR?: UserLegendProgressScalarWhereInput[]
    NOT?: UserLegendProgressScalarWhereInput | UserLegendProgressScalarWhereInput[]
    id?: StringFilter<"UserLegendProgress"> | string
    userId?: StringFilter<"UserLegendProgress"> | string
    subchapterId?: StringFilter<"UserLegendProgress"> | string
    status?: EnumLegendProgressStatusFilter<"UserLegendProgress"> | $Enums.LegendProgressStatus
    crownMax?: IntNullableFilter<"UserLegendProgress"> | number | null
    notes?: StringNullableFilter<"UserLegendProgress"> | string | null
    updatedAt?: DateTimeFilter<"UserLegendProgress"> | Date | string
  }

  export type UserMilestoneProgressUpsertWithWhereUniqueWithoutUserInput = {
    where: UserMilestoneProgressWhereUniqueInput
    update: XOR<UserMilestoneProgressUpdateWithoutUserInput, UserMilestoneProgressUncheckedUpdateWithoutUserInput>
    create: XOR<UserMilestoneProgressCreateWithoutUserInput, UserMilestoneProgressUncheckedCreateWithoutUserInput>
  }

  export type UserMilestoneProgressUpdateWithWhereUniqueWithoutUserInput = {
    where: UserMilestoneProgressWhereUniqueInput
    data: XOR<UserMilestoneProgressUpdateWithoutUserInput, UserMilestoneProgressUncheckedUpdateWithoutUserInput>
  }

  export type UserMilestoneProgressUpdateManyWithWhereWithoutUserInput = {
    where: UserMilestoneProgressScalarWhereInput
    data: XOR<UserMilestoneProgressUpdateManyMutationInput, UserMilestoneProgressUncheckedUpdateManyWithoutUserInput>
  }

  export type UserMilestoneProgressScalarWhereInput = {
    AND?: UserMilestoneProgressScalarWhereInput | UserMilestoneProgressScalarWhereInput[]
    OR?: UserMilestoneProgressScalarWhereInput[]
    NOT?: UserMilestoneProgressScalarWhereInput | UserMilestoneProgressScalarWhereInput[]
    id?: StringFilter<"UserMilestoneProgress"> | string
    userId?: StringFilter<"UserMilestoneProgress"> | string
    milestoneId?: StringFilter<"UserMilestoneProgress"> | string
    cleared?: BoolFilter<"UserMilestoneProgress"> | boolean
    notes?: StringNullableFilter<"UserMilestoneProgress"> | string | null
    updatedAt?: DateTimeFilter<"UserMilestoneProgress"> | Date | string
  }

  export type UserCatclawProgressUpsertWithoutUserInput = {
    update: XOR<UserCatclawProgressUpdateWithoutUserInput, UserCatclawProgressUncheckedUpdateWithoutUserInput>
    create: XOR<UserCatclawProgressCreateWithoutUserInput, UserCatclawProgressUncheckedCreateWithoutUserInput>
    where?: UserCatclawProgressWhereInput
  }

  export type UserCatclawProgressUpdateToOneWithWhereWithoutUserInput = {
    where?: UserCatclawProgressWhereInput
    data: XOR<UserCatclawProgressUpdateWithoutUserInput, UserCatclawProgressUncheckedUpdateWithoutUserInput>
  }

  export type UserCatclawProgressUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    currentRank?: NullableStringFieldUpdateOperationsInput | string | null
    bestRank?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCatclawProgressUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    currentRank?: NullableStringFieldUpdateOperationsInput | string | null
    bestRank?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserMeowMedalUpsertWithWhereUniqueWithoutUserInput = {
    where: UserMeowMedalWhereUniqueInput
    update: XOR<UserMeowMedalUpdateWithoutUserInput, UserMeowMedalUncheckedUpdateWithoutUserInput>
    create: XOR<UserMeowMedalCreateWithoutUserInput, UserMeowMedalUncheckedCreateWithoutUserInput>
  }

  export type UserMeowMedalUpdateWithWhereUniqueWithoutUserInput = {
    where: UserMeowMedalWhereUniqueInput
    data: XOR<UserMeowMedalUpdateWithoutUserInput, UserMeowMedalUncheckedUpdateWithoutUserInput>
  }

  export type UserMeowMedalUpdateManyWithWhereWithoutUserInput = {
    where: UserMeowMedalScalarWhereInput
    data: XOR<UserMeowMedalUpdateManyMutationInput, UserMeowMedalUncheckedUpdateManyWithoutUserInput>
  }

  export type UserMeowMedalScalarWhereInput = {
    AND?: UserMeowMedalScalarWhereInput | UserMeowMedalScalarWhereInput[]
    OR?: UserMeowMedalScalarWhereInput[]
    NOT?: UserMeowMedalScalarWhereInput | UserMeowMedalScalarWhereInput[]
    id?: StringFilter<"UserMeowMedal"> | string
    userId?: StringFilter<"UserMeowMedal"> | string
    meowMedalId?: StringFilter<"UserMeowMedal"> | string
    earned?: BoolFilter<"UserMeowMedal"> | boolean
    earnedAt?: DateTimeNullableFilter<"UserMeowMedal"> | Date | string | null
    updatedAt?: DateTimeFilter<"UserMeowMedal"> | Date | string
  }

  export type UserCreateWithoutPrivacyInput = {
    id?: string
    username: string
    email?: string | null
    passwordHash: string
    displayName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sentFriendRequests?: FriendshipCreateNestedManyWithoutRequesterInput
    receivedFriendRequests?: FriendshipCreateNestedManyWithoutAddresseeInput
    storyProgress?: UserStoryProgressCreateNestedManyWithoutUserInput
    legendProgress?: UserLegendProgressCreateNestedManyWithoutUserInput
    milestoneProgress?: UserMilestoneProgressCreateNestedManyWithoutUserInput
    catclawProgress?: UserCatclawProgressCreateNestedOneWithoutUserInput
    meowMedalProgress?: UserMeowMedalCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPrivacyInput = {
    id?: string
    username: string
    email?: string | null
    passwordHash: string
    displayName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    sentFriendRequests?: FriendshipUncheckedCreateNestedManyWithoutRequesterInput
    receivedFriendRequests?: FriendshipUncheckedCreateNestedManyWithoutAddresseeInput
    storyProgress?: UserStoryProgressUncheckedCreateNestedManyWithoutUserInput
    legendProgress?: UserLegendProgressUncheckedCreateNestedManyWithoutUserInput
    milestoneProgress?: UserMilestoneProgressUncheckedCreateNestedManyWithoutUserInput
    catclawProgress?: UserCatclawProgressUncheckedCreateNestedOneWithoutUserInput
    meowMedalProgress?: UserMeowMedalUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPrivacyInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPrivacyInput, UserUncheckedCreateWithoutPrivacyInput>
  }

  export type UserUpsertWithoutPrivacyInput = {
    update: XOR<UserUpdateWithoutPrivacyInput, UserUncheckedUpdateWithoutPrivacyInput>
    create: XOR<UserCreateWithoutPrivacyInput, UserUncheckedCreateWithoutPrivacyInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPrivacyInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPrivacyInput, UserUncheckedUpdateWithoutPrivacyInput>
  }

  export type UserUpdateWithoutPrivacyInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sentFriendRequests?: FriendshipUpdateManyWithoutRequesterNestedInput
    receivedFriendRequests?: FriendshipUpdateManyWithoutAddresseeNestedInput
    storyProgress?: UserStoryProgressUpdateManyWithoutUserNestedInput
    legendProgress?: UserLegendProgressUpdateManyWithoutUserNestedInput
    milestoneProgress?: UserMilestoneProgressUpdateManyWithoutUserNestedInput
    catclawProgress?: UserCatclawProgressUpdateOneWithoutUserNestedInput
    meowMedalProgress?: UserMeowMedalUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPrivacyInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sentFriendRequests?: FriendshipUncheckedUpdateManyWithoutRequesterNestedInput
    receivedFriendRequests?: FriendshipUncheckedUpdateManyWithoutAddresseeNestedInput
    storyProgress?: UserStoryProgressUncheckedUpdateManyWithoutUserNestedInput
    legendProgress?: UserLegendProgressUncheckedUpdateManyWithoutUserNestedInput
    milestoneProgress?: UserMilestoneProgressUncheckedUpdateManyWithoutUserNestedInput
    catclawProgress?: UserCatclawProgressUncheckedUpdateOneWithoutUserNestedInput
    meowMedalProgress?: UserMeowMedalUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutSentFriendRequestsInput = {
    id?: string
    username: string
    email?: string | null
    passwordHash: string
    displayName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    privacy?: PrivacySettingsCreateNestedOneWithoutUserInput
    receivedFriendRequests?: FriendshipCreateNestedManyWithoutAddresseeInput
    storyProgress?: UserStoryProgressCreateNestedManyWithoutUserInput
    legendProgress?: UserLegendProgressCreateNestedManyWithoutUserInput
    milestoneProgress?: UserMilestoneProgressCreateNestedManyWithoutUserInput
    catclawProgress?: UserCatclawProgressCreateNestedOneWithoutUserInput
    meowMedalProgress?: UserMeowMedalCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSentFriendRequestsInput = {
    id?: string
    username: string
    email?: string | null
    passwordHash: string
    displayName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    privacy?: PrivacySettingsUncheckedCreateNestedOneWithoutUserInput
    receivedFriendRequests?: FriendshipUncheckedCreateNestedManyWithoutAddresseeInput
    storyProgress?: UserStoryProgressUncheckedCreateNestedManyWithoutUserInput
    legendProgress?: UserLegendProgressUncheckedCreateNestedManyWithoutUserInput
    milestoneProgress?: UserMilestoneProgressUncheckedCreateNestedManyWithoutUserInput
    catclawProgress?: UserCatclawProgressUncheckedCreateNestedOneWithoutUserInput
    meowMedalProgress?: UserMeowMedalUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSentFriendRequestsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSentFriendRequestsInput, UserUncheckedCreateWithoutSentFriendRequestsInput>
  }

  export type UserCreateWithoutReceivedFriendRequestsInput = {
    id?: string
    username: string
    email?: string | null
    passwordHash: string
    displayName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    privacy?: PrivacySettingsCreateNestedOneWithoutUserInput
    sentFriendRequests?: FriendshipCreateNestedManyWithoutRequesterInput
    storyProgress?: UserStoryProgressCreateNestedManyWithoutUserInput
    legendProgress?: UserLegendProgressCreateNestedManyWithoutUserInput
    milestoneProgress?: UserMilestoneProgressCreateNestedManyWithoutUserInput
    catclawProgress?: UserCatclawProgressCreateNestedOneWithoutUserInput
    meowMedalProgress?: UserMeowMedalCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutReceivedFriendRequestsInput = {
    id?: string
    username: string
    email?: string | null
    passwordHash: string
    displayName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    privacy?: PrivacySettingsUncheckedCreateNestedOneWithoutUserInput
    sentFriendRequests?: FriendshipUncheckedCreateNestedManyWithoutRequesterInput
    storyProgress?: UserStoryProgressUncheckedCreateNestedManyWithoutUserInput
    legendProgress?: UserLegendProgressUncheckedCreateNestedManyWithoutUserInput
    milestoneProgress?: UserMilestoneProgressUncheckedCreateNestedManyWithoutUserInput
    catclawProgress?: UserCatclawProgressUncheckedCreateNestedOneWithoutUserInput
    meowMedalProgress?: UserMeowMedalUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutReceivedFriendRequestsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutReceivedFriendRequestsInput, UserUncheckedCreateWithoutReceivedFriendRequestsInput>
  }

  export type UserUpsertWithoutSentFriendRequestsInput = {
    update: XOR<UserUpdateWithoutSentFriendRequestsInput, UserUncheckedUpdateWithoutSentFriendRequestsInput>
    create: XOR<UserCreateWithoutSentFriendRequestsInput, UserUncheckedCreateWithoutSentFriendRequestsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSentFriendRequestsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSentFriendRequestsInput, UserUncheckedUpdateWithoutSentFriendRequestsInput>
  }

  export type UserUpdateWithoutSentFriendRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    privacy?: PrivacySettingsUpdateOneWithoutUserNestedInput
    receivedFriendRequests?: FriendshipUpdateManyWithoutAddresseeNestedInput
    storyProgress?: UserStoryProgressUpdateManyWithoutUserNestedInput
    legendProgress?: UserLegendProgressUpdateManyWithoutUserNestedInput
    milestoneProgress?: UserMilestoneProgressUpdateManyWithoutUserNestedInput
    catclawProgress?: UserCatclawProgressUpdateOneWithoutUserNestedInput
    meowMedalProgress?: UserMeowMedalUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSentFriendRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    privacy?: PrivacySettingsUncheckedUpdateOneWithoutUserNestedInput
    receivedFriendRequests?: FriendshipUncheckedUpdateManyWithoutAddresseeNestedInput
    storyProgress?: UserStoryProgressUncheckedUpdateManyWithoutUserNestedInput
    legendProgress?: UserLegendProgressUncheckedUpdateManyWithoutUserNestedInput
    milestoneProgress?: UserMilestoneProgressUncheckedUpdateManyWithoutUserNestedInput
    catclawProgress?: UserCatclawProgressUncheckedUpdateOneWithoutUserNestedInput
    meowMedalProgress?: UserMeowMedalUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUpsertWithoutReceivedFriendRequestsInput = {
    update: XOR<UserUpdateWithoutReceivedFriendRequestsInput, UserUncheckedUpdateWithoutReceivedFriendRequestsInput>
    create: XOR<UserCreateWithoutReceivedFriendRequestsInput, UserUncheckedCreateWithoutReceivedFriendRequestsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutReceivedFriendRequestsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutReceivedFriendRequestsInput, UserUncheckedUpdateWithoutReceivedFriendRequestsInput>
  }

  export type UserUpdateWithoutReceivedFriendRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    privacy?: PrivacySettingsUpdateOneWithoutUserNestedInput
    sentFriendRequests?: FriendshipUpdateManyWithoutRequesterNestedInput
    storyProgress?: UserStoryProgressUpdateManyWithoutUserNestedInput
    legendProgress?: UserLegendProgressUpdateManyWithoutUserNestedInput
    milestoneProgress?: UserMilestoneProgressUpdateManyWithoutUserNestedInput
    catclawProgress?: UserCatclawProgressUpdateOneWithoutUserNestedInput
    meowMedalProgress?: UserMeowMedalUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutReceivedFriendRequestsInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    privacy?: PrivacySettingsUncheckedUpdateOneWithoutUserNestedInput
    sentFriendRequests?: FriendshipUncheckedUpdateManyWithoutRequesterNestedInput
    storyProgress?: UserStoryProgressUncheckedUpdateManyWithoutUserNestedInput
    legendProgress?: UserLegendProgressUncheckedUpdateManyWithoutUserNestedInput
    milestoneProgress?: UserMilestoneProgressUncheckedUpdateManyWithoutUserNestedInput
    catclawProgress?: UserCatclawProgressUncheckedUpdateOneWithoutUserNestedInput
    meowMedalProgress?: UserMeowMedalUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserStoryProgressCreateWithoutChapterInput = {
    id?: string
    cleared?: boolean
    treasures?: $Enums.TreasureStatus
    zombies?: $Enums.ZombieStatus
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutStoryProgressInput
  }

  export type UserStoryProgressUncheckedCreateWithoutChapterInput = {
    id?: string
    userId: string
    cleared?: boolean
    treasures?: $Enums.TreasureStatus
    zombies?: $Enums.ZombieStatus
    updatedAt?: Date | string
  }

  export type UserStoryProgressCreateOrConnectWithoutChapterInput = {
    where: UserStoryProgressWhereUniqueInput
    create: XOR<UserStoryProgressCreateWithoutChapterInput, UserStoryProgressUncheckedCreateWithoutChapterInput>
  }

  export type UserStoryProgressCreateManyChapterInputEnvelope = {
    data: UserStoryProgressCreateManyChapterInput | UserStoryProgressCreateManyChapterInput[]
    skipDuplicates?: boolean
  }

  export type UserStoryProgressUpsertWithWhereUniqueWithoutChapterInput = {
    where: UserStoryProgressWhereUniqueInput
    update: XOR<UserStoryProgressUpdateWithoutChapterInput, UserStoryProgressUncheckedUpdateWithoutChapterInput>
    create: XOR<UserStoryProgressCreateWithoutChapterInput, UserStoryProgressUncheckedCreateWithoutChapterInput>
  }

  export type UserStoryProgressUpdateWithWhereUniqueWithoutChapterInput = {
    where: UserStoryProgressWhereUniqueInput
    data: XOR<UserStoryProgressUpdateWithoutChapterInput, UserStoryProgressUncheckedUpdateWithoutChapterInput>
  }

  export type UserStoryProgressUpdateManyWithWhereWithoutChapterInput = {
    where: UserStoryProgressScalarWhereInput
    data: XOR<UserStoryProgressUpdateManyMutationInput, UserStoryProgressUncheckedUpdateManyWithoutChapterInput>
  }

  export type UserCreateWithoutStoryProgressInput = {
    id?: string
    username: string
    email?: string | null
    passwordHash: string
    displayName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    privacy?: PrivacySettingsCreateNestedOneWithoutUserInput
    sentFriendRequests?: FriendshipCreateNestedManyWithoutRequesterInput
    receivedFriendRequests?: FriendshipCreateNestedManyWithoutAddresseeInput
    legendProgress?: UserLegendProgressCreateNestedManyWithoutUserInput
    milestoneProgress?: UserMilestoneProgressCreateNestedManyWithoutUserInput
    catclawProgress?: UserCatclawProgressCreateNestedOneWithoutUserInput
    meowMedalProgress?: UserMeowMedalCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutStoryProgressInput = {
    id?: string
    username: string
    email?: string | null
    passwordHash: string
    displayName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    privacy?: PrivacySettingsUncheckedCreateNestedOneWithoutUserInput
    sentFriendRequests?: FriendshipUncheckedCreateNestedManyWithoutRequesterInput
    receivedFriendRequests?: FriendshipUncheckedCreateNestedManyWithoutAddresseeInput
    legendProgress?: UserLegendProgressUncheckedCreateNestedManyWithoutUserInput
    milestoneProgress?: UserMilestoneProgressUncheckedCreateNestedManyWithoutUserInput
    catclawProgress?: UserCatclawProgressUncheckedCreateNestedOneWithoutUserInput
    meowMedalProgress?: UserMeowMedalUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutStoryProgressInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutStoryProgressInput, UserUncheckedCreateWithoutStoryProgressInput>
  }

  export type StoryChapterCreateWithoutProgressInput = {
    id?: string
    arc: string
    chapterNumber: number
    displayName: string
    sortOrder: number
  }

  export type StoryChapterUncheckedCreateWithoutProgressInput = {
    id?: string
    arc: string
    chapterNumber: number
    displayName: string
    sortOrder: number
  }

  export type StoryChapterCreateOrConnectWithoutProgressInput = {
    where: StoryChapterWhereUniqueInput
    create: XOR<StoryChapterCreateWithoutProgressInput, StoryChapterUncheckedCreateWithoutProgressInput>
  }

  export type UserUpsertWithoutStoryProgressInput = {
    update: XOR<UserUpdateWithoutStoryProgressInput, UserUncheckedUpdateWithoutStoryProgressInput>
    create: XOR<UserCreateWithoutStoryProgressInput, UserUncheckedCreateWithoutStoryProgressInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutStoryProgressInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutStoryProgressInput, UserUncheckedUpdateWithoutStoryProgressInput>
  }

  export type UserUpdateWithoutStoryProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    privacy?: PrivacySettingsUpdateOneWithoutUserNestedInput
    sentFriendRequests?: FriendshipUpdateManyWithoutRequesterNestedInput
    receivedFriendRequests?: FriendshipUpdateManyWithoutAddresseeNestedInput
    legendProgress?: UserLegendProgressUpdateManyWithoutUserNestedInput
    milestoneProgress?: UserMilestoneProgressUpdateManyWithoutUserNestedInput
    catclawProgress?: UserCatclawProgressUpdateOneWithoutUserNestedInput
    meowMedalProgress?: UserMeowMedalUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutStoryProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    privacy?: PrivacySettingsUncheckedUpdateOneWithoutUserNestedInput
    sentFriendRequests?: FriendshipUncheckedUpdateManyWithoutRequesterNestedInput
    receivedFriendRequests?: FriendshipUncheckedUpdateManyWithoutAddresseeNestedInput
    legendProgress?: UserLegendProgressUncheckedUpdateManyWithoutUserNestedInput
    milestoneProgress?: UserMilestoneProgressUncheckedUpdateManyWithoutUserNestedInput
    catclawProgress?: UserCatclawProgressUncheckedUpdateOneWithoutUserNestedInput
    meowMedalProgress?: UserMeowMedalUncheckedUpdateManyWithoutUserNestedInput
  }

  export type StoryChapterUpsertWithoutProgressInput = {
    update: XOR<StoryChapterUpdateWithoutProgressInput, StoryChapterUncheckedUpdateWithoutProgressInput>
    create: XOR<StoryChapterCreateWithoutProgressInput, StoryChapterUncheckedCreateWithoutProgressInput>
    where?: StoryChapterWhereInput
  }

  export type StoryChapterUpdateToOneWithWhereWithoutProgressInput = {
    where?: StoryChapterWhereInput
    data: XOR<StoryChapterUpdateWithoutProgressInput, StoryChapterUncheckedUpdateWithoutProgressInput>
  }

  export type StoryChapterUpdateWithoutProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    arc?: StringFieldUpdateOperationsInput | string
    chapterNumber?: IntFieldUpdateOperationsInput | number
    displayName?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
  }

  export type StoryChapterUncheckedUpdateWithoutProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    arc?: StringFieldUpdateOperationsInput | string
    chapterNumber?: IntFieldUpdateOperationsInput | number
    displayName?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
  }

  export type LegendSubchapterCreateWithoutSagaInput = {
    id?: string
    displayName: string
    sortOrder: number
    progress?: UserLegendProgressCreateNestedManyWithoutSubchapterInput
  }

  export type LegendSubchapterUncheckedCreateWithoutSagaInput = {
    id?: string
    displayName: string
    sortOrder: number
    progress?: UserLegendProgressUncheckedCreateNestedManyWithoutSubchapterInput
  }

  export type LegendSubchapterCreateOrConnectWithoutSagaInput = {
    where: LegendSubchapterWhereUniqueInput
    create: XOR<LegendSubchapterCreateWithoutSagaInput, LegendSubchapterUncheckedCreateWithoutSagaInput>
  }

  export type LegendSubchapterCreateManySagaInputEnvelope = {
    data: LegendSubchapterCreateManySagaInput | LegendSubchapterCreateManySagaInput[]
    skipDuplicates?: boolean
  }

  export type LegendSubchapterUpsertWithWhereUniqueWithoutSagaInput = {
    where: LegendSubchapterWhereUniqueInput
    update: XOR<LegendSubchapterUpdateWithoutSagaInput, LegendSubchapterUncheckedUpdateWithoutSagaInput>
    create: XOR<LegendSubchapterCreateWithoutSagaInput, LegendSubchapterUncheckedCreateWithoutSagaInput>
  }

  export type LegendSubchapterUpdateWithWhereUniqueWithoutSagaInput = {
    where: LegendSubchapterWhereUniqueInput
    data: XOR<LegendSubchapterUpdateWithoutSagaInput, LegendSubchapterUncheckedUpdateWithoutSagaInput>
  }

  export type LegendSubchapterUpdateManyWithWhereWithoutSagaInput = {
    where: LegendSubchapterScalarWhereInput
    data: XOR<LegendSubchapterUpdateManyMutationInput, LegendSubchapterUncheckedUpdateManyWithoutSagaInput>
  }

  export type LegendSubchapterScalarWhereInput = {
    AND?: LegendSubchapterScalarWhereInput | LegendSubchapterScalarWhereInput[]
    OR?: LegendSubchapterScalarWhereInput[]
    NOT?: LegendSubchapterScalarWhereInput | LegendSubchapterScalarWhereInput[]
    id?: StringFilter<"LegendSubchapter"> | string
    sagaId?: StringFilter<"LegendSubchapter"> | string
    displayName?: StringFilter<"LegendSubchapter"> | string
    sortOrder?: IntFilter<"LegendSubchapter"> | number
  }

  export type LegendSagaCreateWithoutSubchaptersInput = {
    id?: string
    displayName: string
    sortOrder: number
  }

  export type LegendSagaUncheckedCreateWithoutSubchaptersInput = {
    id?: string
    displayName: string
    sortOrder: number
  }

  export type LegendSagaCreateOrConnectWithoutSubchaptersInput = {
    where: LegendSagaWhereUniqueInput
    create: XOR<LegendSagaCreateWithoutSubchaptersInput, LegendSagaUncheckedCreateWithoutSubchaptersInput>
  }

  export type UserLegendProgressCreateWithoutSubchapterInput = {
    id?: string
    status?: $Enums.LegendProgressStatus
    crownMax?: number | null
    notes?: string | null
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutLegendProgressInput
  }

  export type UserLegendProgressUncheckedCreateWithoutSubchapterInput = {
    id?: string
    userId: string
    status?: $Enums.LegendProgressStatus
    crownMax?: number | null
    notes?: string | null
    updatedAt?: Date | string
  }

  export type UserLegendProgressCreateOrConnectWithoutSubchapterInput = {
    where: UserLegendProgressWhereUniqueInput
    create: XOR<UserLegendProgressCreateWithoutSubchapterInput, UserLegendProgressUncheckedCreateWithoutSubchapterInput>
  }

  export type UserLegendProgressCreateManySubchapterInputEnvelope = {
    data: UserLegendProgressCreateManySubchapterInput | UserLegendProgressCreateManySubchapterInput[]
    skipDuplicates?: boolean
  }

  export type LegendSagaUpsertWithoutSubchaptersInput = {
    update: XOR<LegendSagaUpdateWithoutSubchaptersInput, LegendSagaUncheckedUpdateWithoutSubchaptersInput>
    create: XOR<LegendSagaCreateWithoutSubchaptersInput, LegendSagaUncheckedCreateWithoutSubchaptersInput>
    where?: LegendSagaWhereInput
  }

  export type LegendSagaUpdateToOneWithWhereWithoutSubchaptersInput = {
    where?: LegendSagaWhereInput
    data: XOR<LegendSagaUpdateWithoutSubchaptersInput, LegendSagaUncheckedUpdateWithoutSubchaptersInput>
  }

  export type LegendSagaUpdateWithoutSubchaptersInput = {
    id?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
  }

  export type LegendSagaUncheckedUpdateWithoutSubchaptersInput = {
    id?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
  }

  export type UserLegendProgressUpsertWithWhereUniqueWithoutSubchapterInput = {
    where: UserLegendProgressWhereUniqueInput
    update: XOR<UserLegendProgressUpdateWithoutSubchapterInput, UserLegendProgressUncheckedUpdateWithoutSubchapterInput>
    create: XOR<UserLegendProgressCreateWithoutSubchapterInput, UserLegendProgressUncheckedCreateWithoutSubchapterInput>
  }

  export type UserLegendProgressUpdateWithWhereUniqueWithoutSubchapterInput = {
    where: UserLegendProgressWhereUniqueInput
    data: XOR<UserLegendProgressUpdateWithoutSubchapterInput, UserLegendProgressUncheckedUpdateWithoutSubchapterInput>
  }

  export type UserLegendProgressUpdateManyWithWhereWithoutSubchapterInput = {
    where: UserLegendProgressScalarWhereInput
    data: XOR<UserLegendProgressUpdateManyMutationInput, UserLegendProgressUncheckedUpdateManyWithoutSubchapterInput>
  }

  export type UserCreateWithoutLegendProgressInput = {
    id?: string
    username: string
    email?: string | null
    passwordHash: string
    displayName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    privacy?: PrivacySettingsCreateNestedOneWithoutUserInput
    sentFriendRequests?: FriendshipCreateNestedManyWithoutRequesterInput
    receivedFriendRequests?: FriendshipCreateNestedManyWithoutAddresseeInput
    storyProgress?: UserStoryProgressCreateNestedManyWithoutUserInput
    milestoneProgress?: UserMilestoneProgressCreateNestedManyWithoutUserInput
    catclawProgress?: UserCatclawProgressCreateNestedOneWithoutUserInput
    meowMedalProgress?: UserMeowMedalCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutLegendProgressInput = {
    id?: string
    username: string
    email?: string | null
    passwordHash: string
    displayName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    privacy?: PrivacySettingsUncheckedCreateNestedOneWithoutUserInput
    sentFriendRequests?: FriendshipUncheckedCreateNestedManyWithoutRequesterInput
    receivedFriendRequests?: FriendshipUncheckedCreateNestedManyWithoutAddresseeInput
    storyProgress?: UserStoryProgressUncheckedCreateNestedManyWithoutUserInput
    milestoneProgress?: UserMilestoneProgressUncheckedCreateNestedManyWithoutUserInput
    catclawProgress?: UserCatclawProgressUncheckedCreateNestedOneWithoutUserInput
    meowMedalProgress?: UserMeowMedalUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutLegendProgressInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutLegendProgressInput, UserUncheckedCreateWithoutLegendProgressInput>
  }

  export type LegendSubchapterCreateWithoutProgressInput = {
    id?: string
    displayName: string
    sortOrder: number
    saga: LegendSagaCreateNestedOneWithoutSubchaptersInput
  }

  export type LegendSubchapterUncheckedCreateWithoutProgressInput = {
    id?: string
    sagaId: string
    displayName: string
    sortOrder: number
  }

  export type LegendSubchapterCreateOrConnectWithoutProgressInput = {
    where: LegendSubchapterWhereUniqueInput
    create: XOR<LegendSubchapterCreateWithoutProgressInput, LegendSubchapterUncheckedCreateWithoutProgressInput>
  }

  export type UserUpsertWithoutLegendProgressInput = {
    update: XOR<UserUpdateWithoutLegendProgressInput, UserUncheckedUpdateWithoutLegendProgressInput>
    create: XOR<UserCreateWithoutLegendProgressInput, UserUncheckedCreateWithoutLegendProgressInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutLegendProgressInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutLegendProgressInput, UserUncheckedUpdateWithoutLegendProgressInput>
  }

  export type UserUpdateWithoutLegendProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    privacy?: PrivacySettingsUpdateOneWithoutUserNestedInput
    sentFriendRequests?: FriendshipUpdateManyWithoutRequesterNestedInput
    receivedFriendRequests?: FriendshipUpdateManyWithoutAddresseeNestedInput
    storyProgress?: UserStoryProgressUpdateManyWithoutUserNestedInput
    milestoneProgress?: UserMilestoneProgressUpdateManyWithoutUserNestedInput
    catclawProgress?: UserCatclawProgressUpdateOneWithoutUserNestedInput
    meowMedalProgress?: UserMeowMedalUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutLegendProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    privacy?: PrivacySettingsUncheckedUpdateOneWithoutUserNestedInput
    sentFriendRequests?: FriendshipUncheckedUpdateManyWithoutRequesterNestedInput
    receivedFriendRequests?: FriendshipUncheckedUpdateManyWithoutAddresseeNestedInput
    storyProgress?: UserStoryProgressUncheckedUpdateManyWithoutUserNestedInput
    milestoneProgress?: UserMilestoneProgressUncheckedUpdateManyWithoutUserNestedInput
    catclawProgress?: UserCatclawProgressUncheckedUpdateOneWithoutUserNestedInput
    meowMedalProgress?: UserMeowMedalUncheckedUpdateManyWithoutUserNestedInput
  }

  export type LegendSubchapterUpsertWithoutProgressInput = {
    update: XOR<LegendSubchapterUpdateWithoutProgressInput, LegendSubchapterUncheckedUpdateWithoutProgressInput>
    create: XOR<LegendSubchapterCreateWithoutProgressInput, LegendSubchapterUncheckedCreateWithoutProgressInput>
    where?: LegendSubchapterWhereInput
  }

  export type LegendSubchapterUpdateToOneWithWhereWithoutProgressInput = {
    where?: LegendSubchapterWhereInput
    data: XOR<LegendSubchapterUpdateWithoutProgressInput, LegendSubchapterUncheckedUpdateWithoutProgressInput>
  }

  export type LegendSubchapterUpdateWithoutProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    saga?: LegendSagaUpdateOneRequiredWithoutSubchaptersNestedInput
  }

  export type LegendSubchapterUncheckedUpdateWithoutProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    sagaId?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
  }

  export type UserMilestoneProgressCreateWithoutMilestoneInput = {
    id?: string
    cleared?: boolean
    notes?: string | null
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutMilestoneProgressInput
  }

  export type UserMilestoneProgressUncheckedCreateWithoutMilestoneInput = {
    id?: string
    userId: string
    cleared?: boolean
    notes?: string | null
    updatedAt?: Date | string
  }

  export type UserMilestoneProgressCreateOrConnectWithoutMilestoneInput = {
    where: UserMilestoneProgressWhereUniqueInput
    create: XOR<UserMilestoneProgressCreateWithoutMilestoneInput, UserMilestoneProgressUncheckedCreateWithoutMilestoneInput>
  }

  export type UserMilestoneProgressCreateManyMilestoneInputEnvelope = {
    data: UserMilestoneProgressCreateManyMilestoneInput | UserMilestoneProgressCreateManyMilestoneInput[]
    skipDuplicates?: boolean
  }

  export type UserMilestoneProgressUpsertWithWhereUniqueWithoutMilestoneInput = {
    where: UserMilestoneProgressWhereUniqueInput
    update: XOR<UserMilestoneProgressUpdateWithoutMilestoneInput, UserMilestoneProgressUncheckedUpdateWithoutMilestoneInput>
    create: XOR<UserMilestoneProgressCreateWithoutMilestoneInput, UserMilestoneProgressUncheckedCreateWithoutMilestoneInput>
  }

  export type UserMilestoneProgressUpdateWithWhereUniqueWithoutMilestoneInput = {
    where: UserMilestoneProgressWhereUniqueInput
    data: XOR<UserMilestoneProgressUpdateWithoutMilestoneInput, UserMilestoneProgressUncheckedUpdateWithoutMilestoneInput>
  }

  export type UserMilestoneProgressUpdateManyWithWhereWithoutMilestoneInput = {
    where: UserMilestoneProgressScalarWhereInput
    data: XOR<UserMilestoneProgressUpdateManyMutationInput, UserMilestoneProgressUncheckedUpdateManyWithoutMilestoneInput>
  }

  export type UserCreateWithoutMilestoneProgressInput = {
    id?: string
    username: string
    email?: string | null
    passwordHash: string
    displayName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    privacy?: PrivacySettingsCreateNestedOneWithoutUserInput
    sentFriendRequests?: FriendshipCreateNestedManyWithoutRequesterInput
    receivedFriendRequests?: FriendshipCreateNestedManyWithoutAddresseeInput
    storyProgress?: UserStoryProgressCreateNestedManyWithoutUserInput
    legendProgress?: UserLegendProgressCreateNestedManyWithoutUserInput
    catclawProgress?: UserCatclawProgressCreateNestedOneWithoutUserInput
    meowMedalProgress?: UserMeowMedalCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutMilestoneProgressInput = {
    id?: string
    username: string
    email?: string | null
    passwordHash: string
    displayName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    privacy?: PrivacySettingsUncheckedCreateNestedOneWithoutUserInput
    sentFriendRequests?: FriendshipUncheckedCreateNestedManyWithoutRequesterInput
    receivedFriendRequests?: FriendshipUncheckedCreateNestedManyWithoutAddresseeInput
    storyProgress?: UserStoryProgressUncheckedCreateNestedManyWithoutUserInput
    legendProgress?: UserLegendProgressUncheckedCreateNestedManyWithoutUserInput
    catclawProgress?: UserCatclawProgressUncheckedCreateNestedOneWithoutUserInput
    meowMedalProgress?: UserMeowMedalUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutMilestoneProgressInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutMilestoneProgressInput, UserUncheckedCreateWithoutMilestoneProgressInput>
  }

  export type MilestoneCreateWithoutProgressInput = {
    id?: string
    category: $Enums.MilestoneCategory
    displayName: string
    sortOrder: number
  }

  export type MilestoneUncheckedCreateWithoutProgressInput = {
    id?: string
    category: $Enums.MilestoneCategory
    displayName: string
    sortOrder: number
  }

  export type MilestoneCreateOrConnectWithoutProgressInput = {
    where: MilestoneWhereUniqueInput
    create: XOR<MilestoneCreateWithoutProgressInput, MilestoneUncheckedCreateWithoutProgressInput>
  }

  export type UserUpsertWithoutMilestoneProgressInput = {
    update: XOR<UserUpdateWithoutMilestoneProgressInput, UserUncheckedUpdateWithoutMilestoneProgressInput>
    create: XOR<UserCreateWithoutMilestoneProgressInput, UserUncheckedCreateWithoutMilestoneProgressInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutMilestoneProgressInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutMilestoneProgressInput, UserUncheckedUpdateWithoutMilestoneProgressInput>
  }

  export type UserUpdateWithoutMilestoneProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    privacy?: PrivacySettingsUpdateOneWithoutUserNestedInput
    sentFriendRequests?: FriendshipUpdateManyWithoutRequesterNestedInput
    receivedFriendRequests?: FriendshipUpdateManyWithoutAddresseeNestedInput
    storyProgress?: UserStoryProgressUpdateManyWithoutUserNestedInput
    legendProgress?: UserLegendProgressUpdateManyWithoutUserNestedInput
    catclawProgress?: UserCatclawProgressUpdateOneWithoutUserNestedInput
    meowMedalProgress?: UserMeowMedalUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutMilestoneProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    privacy?: PrivacySettingsUncheckedUpdateOneWithoutUserNestedInput
    sentFriendRequests?: FriendshipUncheckedUpdateManyWithoutRequesterNestedInput
    receivedFriendRequests?: FriendshipUncheckedUpdateManyWithoutAddresseeNestedInput
    storyProgress?: UserStoryProgressUncheckedUpdateManyWithoutUserNestedInput
    legendProgress?: UserLegendProgressUncheckedUpdateManyWithoutUserNestedInput
    catclawProgress?: UserCatclawProgressUncheckedUpdateOneWithoutUserNestedInput
    meowMedalProgress?: UserMeowMedalUncheckedUpdateManyWithoutUserNestedInput
  }

  export type MilestoneUpsertWithoutProgressInput = {
    update: XOR<MilestoneUpdateWithoutProgressInput, MilestoneUncheckedUpdateWithoutProgressInput>
    create: XOR<MilestoneCreateWithoutProgressInput, MilestoneUncheckedCreateWithoutProgressInput>
    where?: MilestoneWhereInput
  }

  export type MilestoneUpdateToOneWithWhereWithoutProgressInput = {
    where?: MilestoneWhereInput
    data: XOR<MilestoneUpdateWithoutProgressInput, MilestoneUncheckedUpdateWithoutProgressInput>
  }

  export type MilestoneUpdateWithoutProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    category?: EnumMilestoneCategoryFieldUpdateOperationsInput | $Enums.MilestoneCategory
    displayName?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
  }

  export type MilestoneUncheckedUpdateWithoutProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    category?: EnumMilestoneCategoryFieldUpdateOperationsInput | $Enums.MilestoneCategory
    displayName?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
  }

  export type UserCreateWithoutCatclawProgressInput = {
    id?: string
    username: string
    email?: string | null
    passwordHash: string
    displayName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    privacy?: PrivacySettingsCreateNestedOneWithoutUserInput
    sentFriendRequests?: FriendshipCreateNestedManyWithoutRequesterInput
    receivedFriendRequests?: FriendshipCreateNestedManyWithoutAddresseeInput
    storyProgress?: UserStoryProgressCreateNestedManyWithoutUserInput
    legendProgress?: UserLegendProgressCreateNestedManyWithoutUserInput
    milestoneProgress?: UserMilestoneProgressCreateNestedManyWithoutUserInput
    meowMedalProgress?: UserMeowMedalCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutCatclawProgressInput = {
    id?: string
    username: string
    email?: string | null
    passwordHash: string
    displayName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    privacy?: PrivacySettingsUncheckedCreateNestedOneWithoutUserInput
    sentFriendRequests?: FriendshipUncheckedCreateNestedManyWithoutRequesterInput
    receivedFriendRequests?: FriendshipUncheckedCreateNestedManyWithoutAddresseeInput
    storyProgress?: UserStoryProgressUncheckedCreateNestedManyWithoutUserInput
    legendProgress?: UserLegendProgressUncheckedCreateNestedManyWithoutUserInput
    milestoneProgress?: UserMilestoneProgressUncheckedCreateNestedManyWithoutUserInput
    meowMedalProgress?: UserMeowMedalUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutCatclawProgressInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCatclawProgressInput, UserUncheckedCreateWithoutCatclawProgressInput>
  }

  export type UserUpsertWithoutCatclawProgressInput = {
    update: XOR<UserUpdateWithoutCatclawProgressInput, UserUncheckedUpdateWithoutCatclawProgressInput>
    create: XOR<UserCreateWithoutCatclawProgressInput, UserUncheckedCreateWithoutCatclawProgressInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCatclawProgressInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCatclawProgressInput, UserUncheckedUpdateWithoutCatclawProgressInput>
  }

  export type UserUpdateWithoutCatclawProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    privacy?: PrivacySettingsUpdateOneWithoutUserNestedInput
    sentFriendRequests?: FriendshipUpdateManyWithoutRequesterNestedInput
    receivedFriendRequests?: FriendshipUpdateManyWithoutAddresseeNestedInput
    storyProgress?: UserStoryProgressUpdateManyWithoutUserNestedInput
    legendProgress?: UserLegendProgressUpdateManyWithoutUserNestedInput
    milestoneProgress?: UserMilestoneProgressUpdateManyWithoutUserNestedInput
    meowMedalProgress?: UserMeowMedalUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutCatclawProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    privacy?: PrivacySettingsUncheckedUpdateOneWithoutUserNestedInput
    sentFriendRequests?: FriendshipUncheckedUpdateManyWithoutRequesterNestedInput
    receivedFriendRequests?: FriendshipUncheckedUpdateManyWithoutAddresseeNestedInput
    storyProgress?: UserStoryProgressUncheckedUpdateManyWithoutUserNestedInput
    legendProgress?: UserLegendProgressUncheckedUpdateManyWithoutUserNestedInput
    milestoneProgress?: UserMilestoneProgressUncheckedUpdateManyWithoutUserNestedInput
    meowMedalProgress?: UserMeowMedalUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserMeowMedalCreateWithoutMeowMedalInput = {
    id?: string
    earned?: boolean
    earnedAt?: Date | string | null
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutMeowMedalProgressInput
  }

  export type UserMeowMedalUncheckedCreateWithoutMeowMedalInput = {
    id?: string
    userId: string
    earned?: boolean
    earnedAt?: Date | string | null
    updatedAt?: Date | string
  }

  export type UserMeowMedalCreateOrConnectWithoutMeowMedalInput = {
    where: UserMeowMedalWhereUniqueInput
    create: XOR<UserMeowMedalCreateWithoutMeowMedalInput, UserMeowMedalUncheckedCreateWithoutMeowMedalInput>
  }

  export type UserMeowMedalCreateManyMeowMedalInputEnvelope = {
    data: UserMeowMedalCreateManyMeowMedalInput | UserMeowMedalCreateManyMeowMedalInput[]
    skipDuplicates?: boolean
  }

  export type UserMeowMedalUpsertWithWhereUniqueWithoutMeowMedalInput = {
    where: UserMeowMedalWhereUniqueInput
    update: XOR<UserMeowMedalUpdateWithoutMeowMedalInput, UserMeowMedalUncheckedUpdateWithoutMeowMedalInput>
    create: XOR<UserMeowMedalCreateWithoutMeowMedalInput, UserMeowMedalUncheckedCreateWithoutMeowMedalInput>
  }

  export type UserMeowMedalUpdateWithWhereUniqueWithoutMeowMedalInput = {
    where: UserMeowMedalWhereUniqueInput
    data: XOR<UserMeowMedalUpdateWithoutMeowMedalInput, UserMeowMedalUncheckedUpdateWithoutMeowMedalInput>
  }

  export type UserMeowMedalUpdateManyWithWhereWithoutMeowMedalInput = {
    where: UserMeowMedalScalarWhereInput
    data: XOR<UserMeowMedalUpdateManyMutationInput, UserMeowMedalUncheckedUpdateManyWithoutMeowMedalInput>
  }

  export type UserCreateWithoutMeowMedalProgressInput = {
    id?: string
    username: string
    email?: string | null
    passwordHash: string
    displayName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    privacy?: PrivacySettingsCreateNestedOneWithoutUserInput
    sentFriendRequests?: FriendshipCreateNestedManyWithoutRequesterInput
    receivedFriendRequests?: FriendshipCreateNestedManyWithoutAddresseeInput
    storyProgress?: UserStoryProgressCreateNestedManyWithoutUserInput
    legendProgress?: UserLegendProgressCreateNestedManyWithoutUserInput
    milestoneProgress?: UserMilestoneProgressCreateNestedManyWithoutUserInput
    catclawProgress?: UserCatclawProgressCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutMeowMedalProgressInput = {
    id?: string
    username: string
    email?: string | null
    passwordHash: string
    displayName?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    privacy?: PrivacySettingsUncheckedCreateNestedOneWithoutUserInput
    sentFriendRequests?: FriendshipUncheckedCreateNestedManyWithoutRequesterInput
    receivedFriendRequests?: FriendshipUncheckedCreateNestedManyWithoutAddresseeInput
    storyProgress?: UserStoryProgressUncheckedCreateNestedManyWithoutUserInput
    legendProgress?: UserLegendProgressUncheckedCreateNestedManyWithoutUserInput
    milestoneProgress?: UserMilestoneProgressUncheckedCreateNestedManyWithoutUserInput
    catclawProgress?: UserCatclawProgressUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutMeowMedalProgressInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutMeowMedalProgressInput, UserUncheckedCreateWithoutMeowMedalProgressInput>
  }

  export type MeowMedalCreateWithoutEarnedByInput = {
    id?: string
    name: string
    requirementText?: string | null
    description?: string | null
    category?: string | null
    sortOrder?: number | null
    sourceUrl?: string | null
    imageFile?: string | null
    autoKey?: string | null
    updatedAt?: Date | string
  }

  export type MeowMedalUncheckedCreateWithoutEarnedByInput = {
    id?: string
    name: string
    requirementText?: string | null
    description?: string | null
    category?: string | null
    sortOrder?: number | null
    sourceUrl?: string | null
    imageFile?: string | null
    autoKey?: string | null
    updatedAt?: Date | string
  }

  export type MeowMedalCreateOrConnectWithoutEarnedByInput = {
    where: MeowMedalWhereUniqueInput
    create: XOR<MeowMedalCreateWithoutEarnedByInput, MeowMedalUncheckedCreateWithoutEarnedByInput>
  }

  export type UserUpsertWithoutMeowMedalProgressInput = {
    update: XOR<UserUpdateWithoutMeowMedalProgressInput, UserUncheckedUpdateWithoutMeowMedalProgressInput>
    create: XOR<UserCreateWithoutMeowMedalProgressInput, UserUncheckedCreateWithoutMeowMedalProgressInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutMeowMedalProgressInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutMeowMedalProgressInput, UserUncheckedUpdateWithoutMeowMedalProgressInput>
  }

  export type UserUpdateWithoutMeowMedalProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    privacy?: PrivacySettingsUpdateOneWithoutUserNestedInput
    sentFriendRequests?: FriendshipUpdateManyWithoutRequesterNestedInput
    receivedFriendRequests?: FriendshipUpdateManyWithoutAddresseeNestedInput
    storyProgress?: UserStoryProgressUpdateManyWithoutUserNestedInput
    legendProgress?: UserLegendProgressUpdateManyWithoutUserNestedInput
    milestoneProgress?: UserMilestoneProgressUpdateManyWithoutUserNestedInput
    catclawProgress?: UserCatclawProgressUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutMeowMedalProgressInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    displayName?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    privacy?: PrivacySettingsUncheckedUpdateOneWithoutUserNestedInput
    sentFriendRequests?: FriendshipUncheckedUpdateManyWithoutRequesterNestedInput
    receivedFriendRequests?: FriendshipUncheckedUpdateManyWithoutAddresseeNestedInput
    storyProgress?: UserStoryProgressUncheckedUpdateManyWithoutUserNestedInput
    legendProgress?: UserLegendProgressUncheckedUpdateManyWithoutUserNestedInput
    milestoneProgress?: UserMilestoneProgressUncheckedUpdateManyWithoutUserNestedInput
    catclawProgress?: UserCatclawProgressUncheckedUpdateOneWithoutUserNestedInput
  }

  export type MeowMedalUpsertWithoutEarnedByInput = {
    update: XOR<MeowMedalUpdateWithoutEarnedByInput, MeowMedalUncheckedUpdateWithoutEarnedByInput>
    create: XOR<MeowMedalCreateWithoutEarnedByInput, MeowMedalUncheckedCreateWithoutEarnedByInput>
    where?: MeowMedalWhereInput
  }

  export type MeowMedalUpdateToOneWithWhereWithoutEarnedByInput = {
    where?: MeowMedalWhereInput
    data: XOR<MeowMedalUpdateWithoutEarnedByInput, MeowMedalUncheckedUpdateWithoutEarnedByInput>
  }

  export type MeowMedalUpdateWithoutEarnedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    requirementText?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: NullableIntFieldUpdateOperationsInput | number | null
    sourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    imageFile?: NullableStringFieldUpdateOperationsInput | string | null
    autoKey?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MeowMedalUncheckedUpdateWithoutEarnedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    requirementText?: NullableStringFieldUpdateOperationsInput | string | null
    description?: NullableStringFieldUpdateOperationsInput | string | null
    category?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: NullableIntFieldUpdateOperationsInput | number | null
    sourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    imageFile?: NullableStringFieldUpdateOperationsInput | string | null
    autoKey?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FriendshipCreateManyRequesterInput = {
    id?: string
    addresseeId: string
    status?: $Enums.FriendshipStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type FriendshipCreateManyAddresseeInput = {
    id?: string
    requesterId: string
    status?: $Enums.FriendshipStatus
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserStoryProgressCreateManyUserInput = {
    id?: string
    storyChapterId: string
    cleared?: boolean
    treasures?: $Enums.TreasureStatus
    zombies?: $Enums.ZombieStatus
    updatedAt?: Date | string
  }

  export type UserLegendProgressCreateManyUserInput = {
    id?: string
    subchapterId: string
    status?: $Enums.LegendProgressStatus
    crownMax?: number | null
    notes?: string | null
    updatedAt?: Date | string
  }

  export type UserMilestoneProgressCreateManyUserInput = {
    id?: string
    milestoneId: string
    cleared?: boolean
    notes?: string | null
    updatedAt?: Date | string
  }

  export type UserMeowMedalCreateManyUserInput = {
    id?: string
    meowMedalId: string
    earned?: boolean
    earnedAt?: Date | string | null
    updatedAt?: Date | string
  }

  export type FriendshipUpdateWithoutRequesterInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumFriendshipStatusFieldUpdateOperationsInput | $Enums.FriendshipStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    addressee?: UserUpdateOneRequiredWithoutReceivedFriendRequestsNestedInput
  }

  export type FriendshipUncheckedUpdateWithoutRequesterInput = {
    id?: StringFieldUpdateOperationsInput | string
    addresseeId?: StringFieldUpdateOperationsInput | string
    status?: EnumFriendshipStatusFieldUpdateOperationsInput | $Enums.FriendshipStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FriendshipUncheckedUpdateManyWithoutRequesterInput = {
    id?: StringFieldUpdateOperationsInput | string
    addresseeId?: StringFieldUpdateOperationsInput | string
    status?: EnumFriendshipStatusFieldUpdateOperationsInput | $Enums.FriendshipStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FriendshipUpdateWithoutAddresseeInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumFriendshipStatusFieldUpdateOperationsInput | $Enums.FriendshipStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    requester?: UserUpdateOneRequiredWithoutSentFriendRequestsNestedInput
  }

  export type FriendshipUncheckedUpdateWithoutAddresseeInput = {
    id?: StringFieldUpdateOperationsInput | string
    requesterId?: StringFieldUpdateOperationsInput | string
    status?: EnumFriendshipStatusFieldUpdateOperationsInput | $Enums.FriendshipStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type FriendshipUncheckedUpdateManyWithoutAddresseeInput = {
    id?: StringFieldUpdateOperationsInput | string
    requesterId?: StringFieldUpdateOperationsInput | string
    status?: EnumFriendshipStatusFieldUpdateOperationsInput | $Enums.FriendshipStatus
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserStoryProgressUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    cleared?: BoolFieldUpdateOperationsInput | boolean
    treasures?: EnumTreasureStatusFieldUpdateOperationsInput | $Enums.TreasureStatus
    zombies?: EnumZombieStatusFieldUpdateOperationsInput | $Enums.ZombieStatus
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    chapter?: StoryChapterUpdateOneRequiredWithoutProgressNestedInput
  }

  export type UserStoryProgressUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    storyChapterId?: StringFieldUpdateOperationsInput | string
    cleared?: BoolFieldUpdateOperationsInput | boolean
    treasures?: EnumTreasureStatusFieldUpdateOperationsInput | $Enums.TreasureStatus
    zombies?: EnumZombieStatusFieldUpdateOperationsInput | $Enums.ZombieStatus
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserStoryProgressUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    storyChapterId?: StringFieldUpdateOperationsInput | string
    cleared?: BoolFieldUpdateOperationsInput | boolean
    treasures?: EnumTreasureStatusFieldUpdateOperationsInput | $Enums.TreasureStatus
    zombies?: EnumZombieStatusFieldUpdateOperationsInput | $Enums.ZombieStatus
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserLegendProgressUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumLegendProgressStatusFieldUpdateOperationsInput | $Enums.LegendProgressStatus
    crownMax?: NullableIntFieldUpdateOperationsInput | number | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    subchapter?: LegendSubchapterUpdateOneRequiredWithoutProgressNestedInput
  }

  export type UserLegendProgressUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    subchapterId?: StringFieldUpdateOperationsInput | string
    status?: EnumLegendProgressStatusFieldUpdateOperationsInput | $Enums.LegendProgressStatus
    crownMax?: NullableIntFieldUpdateOperationsInput | number | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserLegendProgressUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    subchapterId?: StringFieldUpdateOperationsInput | string
    status?: EnumLegendProgressStatusFieldUpdateOperationsInput | $Enums.LegendProgressStatus
    crownMax?: NullableIntFieldUpdateOperationsInput | number | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserMilestoneProgressUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    cleared?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    milestone?: MilestoneUpdateOneRequiredWithoutProgressNestedInput
  }

  export type UserMilestoneProgressUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    milestoneId?: StringFieldUpdateOperationsInput | string
    cleared?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserMilestoneProgressUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    milestoneId?: StringFieldUpdateOperationsInput | string
    cleared?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserMeowMedalUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    earned?: BoolFieldUpdateOperationsInput | boolean
    earnedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    meowMedal?: MeowMedalUpdateOneRequiredWithoutEarnedByNestedInput
  }

  export type UserMeowMedalUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    meowMedalId?: StringFieldUpdateOperationsInput | string
    earned?: BoolFieldUpdateOperationsInput | boolean
    earnedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserMeowMedalUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    meowMedalId?: StringFieldUpdateOperationsInput | string
    earned?: BoolFieldUpdateOperationsInput | boolean
    earnedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserStoryProgressCreateManyChapterInput = {
    id?: string
    userId: string
    cleared?: boolean
    treasures?: $Enums.TreasureStatus
    zombies?: $Enums.ZombieStatus
    updatedAt?: Date | string
  }

  export type UserStoryProgressUpdateWithoutChapterInput = {
    id?: StringFieldUpdateOperationsInput | string
    cleared?: BoolFieldUpdateOperationsInput | boolean
    treasures?: EnumTreasureStatusFieldUpdateOperationsInput | $Enums.TreasureStatus
    zombies?: EnumZombieStatusFieldUpdateOperationsInput | $Enums.ZombieStatus
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutStoryProgressNestedInput
  }

  export type UserStoryProgressUncheckedUpdateWithoutChapterInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    cleared?: BoolFieldUpdateOperationsInput | boolean
    treasures?: EnumTreasureStatusFieldUpdateOperationsInput | $Enums.TreasureStatus
    zombies?: EnumZombieStatusFieldUpdateOperationsInput | $Enums.ZombieStatus
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserStoryProgressUncheckedUpdateManyWithoutChapterInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    cleared?: BoolFieldUpdateOperationsInput | boolean
    treasures?: EnumTreasureStatusFieldUpdateOperationsInput | $Enums.TreasureStatus
    zombies?: EnumZombieStatusFieldUpdateOperationsInput | $Enums.ZombieStatus
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LegendSubchapterCreateManySagaInput = {
    id?: string
    displayName: string
    sortOrder: number
  }

  export type LegendSubchapterUpdateWithoutSagaInput = {
    id?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    progress?: UserLegendProgressUpdateManyWithoutSubchapterNestedInput
  }

  export type LegendSubchapterUncheckedUpdateWithoutSagaInput = {
    id?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
    progress?: UserLegendProgressUncheckedUpdateManyWithoutSubchapterNestedInput
  }

  export type LegendSubchapterUncheckedUpdateManyWithoutSagaInput = {
    id?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    sortOrder?: IntFieldUpdateOperationsInput | number
  }

  export type UserLegendProgressCreateManySubchapterInput = {
    id?: string
    userId: string
    status?: $Enums.LegendProgressStatus
    crownMax?: number | null
    notes?: string | null
    updatedAt?: Date | string
  }

  export type UserLegendProgressUpdateWithoutSubchapterInput = {
    id?: StringFieldUpdateOperationsInput | string
    status?: EnumLegendProgressStatusFieldUpdateOperationsInput | $Enums.LegendProgressStatus
    crownMax?: NullableIntFieldUpdateOperationsInput | number | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutLegendProgressNestedInput
  }

  export type UserLegendProgressUncheckedUpdateWithoutSubchapterInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: EnumLegendProgressStatusFieldUpdateOperationsInput | $Enums.LegendProgressStatus
    crownMax?: NullableIntFieldUpdateOperationsInput | number | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserLegendProgressUncheckedUpdateManyWithoutSubchapterInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    status?: EnumLegendProgressStatusFieldUpdateOperationsInput | $Enums.LegendProgressStatus
    crownMax?: NullableIntFieldUpdateOperationsInput | number | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserMilestoneProgressCreateManyMilestoneInput = {
    id?: string
    userId: string
    cleared?: boolean
    notes?: string | null
    updatedAt?: Date | string
  }

  export type UserMilestoneProgressUpdateWithoutMilestoneInput = {
    id?: StringFieldUpdateOperationsInput | string
    cleared?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutMilestoneProgressNestedInput
  }

  export type UserMilestoneProgressUncheckedUpdateWithoutMilestoneInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    cleared?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserMilestoneProgressUncheckedUpdateManyWithoutMilestoneInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    cleared?: BoolFieldUpdateOperationsInput | boolean
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserMeowMedalCreateManyMeowMedalInput = {
    id?: string
    userId: string
    earned?: boolean
    earnedAt?: Date | string | null
    updatedAt?: Date | string
  }

  export type UserMeowMedalUpdateWithoutMeowMedalInput = {
    id?: StringFieldUpdateOperationsInput | string
    earned?: BoolFieldUpdateOperationsInput | boolean
    earnedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutMeowMedalProgressNestedInput
  }

  export type UserMeowMedalUncheckedUpdateWithoutMeowMedalInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    earned?: BoolFieldUpdateOperationsInput | boolean
    earnedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserMeowMedalUncheckedUpdateManyWithoutMeowMedalInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    earned?: BoolFieldUpdateOperationsInput | boolean
    earnedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}