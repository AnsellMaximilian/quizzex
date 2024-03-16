import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { api } from "./_generated/api";

export const findListBattle = query({
  args: {},
  handler: async (ctx, args) => {
    const foundListBattles = await ctx.db
      .query("listBattles")
      .withIndex("gameOpen", (q) =>
        q
          .eq("gameOver", false)
          .eq("playerTwoToken", undefined)
          .eq("gameStart", false)
      )
      .collect();

    if (foundListBattles.length > 0) {
      const foundListBattle = foundListBattles[0];
      return foundListBattle;
    }

    return null;
  },
});

export const createListBattle = mutation({
  args: {},
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (user) {
      const listBattleId = await ctx.db.insert("listBattles", {
        playerOneToken: user?.tokenIdentifier,

        playerOneGuesses: [],
        playerTwoGuesses: [],

        gameOver: false,
        gameStart: false,
      });

      return listBattleId;
    }

    return null;
  },
});

export const joinListBattle = mutation({
  args: { id: v.id("listBattles") },
  handler: async (ctx, args) => {
    const { id } = args;

    const playerTwo = await ctx.auth.getUserIdentity();
    const categoryLists = await ctx.db.query("categoryList").take(100);

    if (playerTwo && categoryLists.length > 0) {
      await ctx.db.patch(id, {
        gameStart: true,
        playerTwoToken: playerTwo.tokenIdentifier,
        categoryListId: categoryLists[0]._id,
      });

      return await ctx.db.get(id);
    }

    return null;
  },
});

export const getListBattle = query({
  args: { id: v.id("listBattles") },

  handler: async (ctx, args) => {
    const { id } = args;
    const listBattle = await ctx.db.get(id);
    let categoryList;

    if (listBattle && listBattle.categoryListId) {
      categoryList = await ctx.db.get(listBattle.categoryListId);
    }

    return { listBattle, categoryList };
  },
});
