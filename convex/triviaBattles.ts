import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { Choice, ResponseObject } from "./types";

export const findTriviaBattle = query({
  args: {},
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (user) {
      const foundTriviaBattles = await ctx.db
        .query("triviaBattles")
        .withIndex("gameOpen", (q) =>
          q
            .eq("gameOver", false)
            .eq("playerTwoToken", undefined)
            .eq("gameStart", false)
        )
        .filter((q) => q.neq(q.field("playerOneToken"), user.tokenIdentifier))
        .collect();

      if (foundTriviaBattles.length > 0) {
        const foundListBattle = foundTriviaBattles[0];
        return foundListBattle;
      }
    }

    return null;
  },
});

export const createTriviaBattle = mutation({
  args: {},
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (user) {
      const triviaBattleId = await ctx.db.insert("triviaBattles", {
        playerOneToken: user?.tokenIdentifier,

        playerOneResults: [],
        playerTwoResults: [],
        triviaQuestionIds: [],
        gameOver: false,
        gameStart: false,
      });

      return triviaBattleId;
    }

    return null;
  },
});

export const joinTriviaBattle = mutation({
  args: { id: v.id("triviaBattles") },
  handler: async (ctx, args) => {
    const { id } = args;

    const playerTwo = await ctx.auth.getUserIdentity();
    const triviaQuestions = await ctx.db.query("triviaQuestions").take(100);

    if (playerTwo && triviaQuestions.length > 0) {
      const startDateTime = new Date();
      const endDateTime = new Date(startDateTime.getTime() + 90 * 1000);
      await ctx.db.patch(id, {
        gameStart: true,
        playerTwoToken: playerTwo.tokenIdentifier,
        triviaQuestionIds: triviaQuestions.slice(0, 4).map((tq) => tq._id),
        startDateTime: startDateTime.toISOString(),
        endDateTime: endDateTime.toISOString(),
      });

      return await ctx.db.get(id);
    }

    return null;
  },
});

export const getTriviaBattle = query({
  args: { id: v.id("triviaBattles") },

  handler: async (ctx, args) => {
    const { id } = args;
    const user = await ctx.auth.getUserIdentity();
    const triviaBattle = await ctx.db.get(id);
    let triviaQuestions;

    if (triviaBattle) {
      triviaQuestions = await Promise.all(
        triviaBattle.triviaQuestionIds.map(async (id) => {
          const triviaQuestion = await ctx.db.get(id);
          return triviaQuestion!;
        })
      );
    }

    return { triviaBattle, triviaQuestions, userToken: user?.tokenIdentifier };
  },
});

export const selectTriviaChoice = mutation({
  args: {
    triviaBattleId: v.id("triviaBattles"),
    selectedChoice: v.string(),
    triviaQuestionId: v.id("triviaQuestions"),
  },
  handler: async (ctx, args) => {
    const { triviaBattleId, selectedChoice, triviaQuestionId } = args;
    const user = await ctx.auth.getUserIdentity();

    const triviaBattle = await ctx.db.get(triviaBattleId);
    const errorResponse: ResponseObject<string> = {
      statusString: "ERROR",
      statusCode: 500,
      message: "",
    };

    if (
      triviaBattle &&
      triviaBattle.endDateTime &&
      triviaBattle.gameStart &&
      user
    ) {
      // Time's up!
      // if (new Date().toISOString() > listBattle.endDateTime) return null;
      const isPlayerOne = user.tokenIdentifier === triviaBattle.playerOneToken;

      const objString = isPlayerOne ? "playerOneResults" : "playerTwoResults";
      if (
        triviaBattle[objString].some(
          (g) => g.triviaQuestionId === triviaQuestionId
        )
      ) {
        errorResponse.message = "Can't Answer!";
        return errorResponse;
      }
      const triviaQuestion = await ctx.db.get(triviaQuestionId);
      if (triviaQuestion) {
        const isCorrect =
          (triviaQuestion.correctChoice as Choice) === selectedChoice;
        const okResponse: ResponseObject<null> = {
          statusCode: 200,
          statusString: "OK",
          data: null,
          message: isCorrect ? "Correct!" : "Wrong!",
        };
        await ctx.db.patch(triviaBattle._id, {
          [objString]: [
            ...triviaBattle[objString],
            { triviaQuestionId, isCorrect },
          ],
        });
        return okResponse;
      }
    }

    return errorResponse;
  },
});
