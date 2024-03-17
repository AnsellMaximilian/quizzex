import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { ResponseObject } from "./types";

export const findListBattle = query({
  args: {},
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (user) {
      const foundListBattles = await ctx.db
        .query("listBattles")
        .withIndex("gameOpen", (q) =>
          q
            .eq("gameOver", false)
            .eq("playerTwoToken", undefined)
            .eq("gameStart", false)
        )
        .filter((q) => q.neq(q.field("playerOneToken"), user.tokenIdentifier))
        .collect();

      if (foundListBattles.length > 0) {
        const foundListBattle = foundListBattles[0];
        return foundListBattle;
      }
    }

    return null;
  },
});

export const createListBattle = mutation({
  args: {},
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (user) {
      const startDateTime = new Date();
      const endDateTime = new Date(startDateTime.getTime() + 90 * 1000);

      const listBattleId = await ctx.db.insert("listBattles", {
        playerOneToken: user?.tokenIdentifier,

        startDateTime: startDateTime.toISOString(),
        endDateTime: endDateTime.toISOString(),

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
    const user = await ctx.auth.getUserIdentity();
    const listBattle = await ctx.db.get(id);
    let categoryList;

    if (listBattle && listBattle.categoryListId) {
      categoryList = await ctx.db.get(listBattle.categoryListId);
    }

    return { listBattle, categoryList, userToken: user?.tokenIdentifier };
  },
});

export const guessListValue = mutation({
  args: { listBattleId: v.id("listBattles"), guess: v.string() },
  handler: async (ctx, args) => {
    const { listBattleId, guess } = args;
    const user = await ctx.auth.getUserIdentity();

    const listBattle = await ctx.db.get(listBattleId);
    const errorResponse: ResponseObject<string> = {
      statusString: "ERROR",
      statusCode: 500,
      message: "",
    };

    if (
      listBattle &&
      listBattle.categoryListId &&
      listBattle.endDateTime &&
      listBattle.gameStart &&
      user
    ) {
      // Time's up!
      // if (new Date().toISOString() > listBattle.endDateTime) return null;
      const isPlayerOne = user.tokenIdentifier === listBattle.playerOneToken;

      const objString = isPlayerOne ? "playerOneGuesses" : "playerTwoGuesses";
      if (
        listBattle[objString].some(
          (v) =>
            v.value.toLowerCase().replace(/[^a-zA-Z0-9]/g, "") ===
            guess.toLowerCase().replace(/[^a-zA-Z0-9]/g, "")
        )
      ) {
        errorResponse.message = "Already guessed!";
        return errorResponse;
      }
      const categoryList = await ctx.db.get(listBattle.categoryListId);
      if (categoryList) {
        const correctValues = categoryList.values;

        const foundValue = correctValues.find(
          (v) =>
            v.value.toLowerCase().replace(/[^a-zA-Z0-9]/g, "") ===
            guess.toLowerCase().replace(/[^a-zA-Z0-9]/g, "")
        );

        if (foundValue) {
          await ctx.db.patch(listBattle._id, {
            [objString]: [...listBattle[objString], foundValue],
          });
          const okResponse: ResponseObject<typeof foundValue> = {
            statusCode: 200,
            statusString: "OK",
            data: foundValue,
            message: "Successful",
          };
          return okResponse;
        } else {
          errorResponse.message = "Nope!";
        }
      }
    }

    return errorResponse;
  },
});
