import { mutation, query } from "./_generated/server";

/**
 * Insert or update the user in a Convex table then return the document's ID.
 *
 * The `UserIdentity.tokenIdentifier` string is a stable and unique value we use
 * to look up identities.
 *
 * Keep in mind that `UserIdentity` has a number of optional fields, the
 * presence of which depends on the identity provider chosen. It's up to the
 * application developer to determine which ones are available and to decide
 * which of those need to be persisted. For Clerk the fields are determined
 * by the JWT token's Claims config.
 */
export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }
    // Check if we've already stored this identity before.
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();
    if (user !== null) {
      // If we've seen this identity before but the name has changed, patch the value.
      if (user.name !== identity.name) {
        await ctx.db.patch(user._id, { name: identity.name });
      }
      return user._id;
    }
    // If it's a new identity, create a new `User`.
    return await ctx.db.insert("users", {
      name: identity.name!,
      profileUrl: identity.pictureUrl,
      tokenIdentifier: identity.tokenIdentifier,
    });
  },
});

export const getUserHistories = query({
  args: {},
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (user) {
      const listBattles = await ctx.db
        .query("listBattles")
        .filter((q) =>
          q.or(
            q.eq(q.field("playerOneToken"), user.tokenIdentifier),
            q.eq(q.field("playerTwoToken"), user.tokenIdentifier)
          )
        )
        .take(100);

      const triviaBattles = await ctx.db
        .query("triviaBattles")
        .filter((q) =>
          q.or(
            q.eq(q.field("playerOneToken"), user.tokenIdentifier),
            q.eq(q.field("playerTwoToken"), user.tokenIdentifier)
          )
        )
        .take(100);

      const listBattlesWithUserData = await Promise.all(
        listBattles.map(async (battle) => {
          const opponentString =
            battle.playerOneToken === user.tokenIdentifier
              ? "playerTwoToken"
              : "playerOneToken";

          const opponent = await ctx.db
            .query("users")
            .filter((q) =>
              q.eq(q.field("tokenIdentifier"), battle[opponentString])
            )
            .unique();

          return {
            ...battle,
            opponent,
          };
        })
      );

      const triviaBattlesWithUserData = await Promise.all(
        triviaBattles.map(async (battle) => {
          const opponentString =
            battle.playerOneToken === user.tokenIdentifier
              ? "playerTwoToken"
              : "playerOneToken";

          const opponent = await ctx.db
            .query("users")
            .filter((q) =>
              q.eq(q.field("tokenIdentifier"), battle[opponentString])
            )
            .unique();

          return {
            ...battle,
            opponent,
          };
        })
      );

      return {
        listBattles: listBattlesWithUserData,
        triviaBattles: triviaBattlesWithUserData,
        userToken: user.tokenIdentifier,
      };
    }

    return null;
  },
});
