import { v } from "convex/values";
import { query, mutation, action } from "./_generated/server";
import { Choice, ResponseObject } from "./types";
import { words } from "./words";

export const findUnravelBattle = query({
  args: {},
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();

    if (user) {
      const foundUnravelBattles = await ctx.db
        .query("unravelBattles")
        .withIndex("gameOpen", (q) =>
          q
            .eq("gameOver", false)
            .eq("playerTwoToken", undefined)
            .eq("gameStart", false)
        )
        .filter((q) => q.neq(q.field("playerOneToken"), user.tokenIdentifier))
        .collect();

      if (foundUnravelBattles.length > 0) {
        const foundUnravelBattle = foundUnravelBattles[0];
        return foundUnravelBattle;
      }
    }

    return null;
  },
});

export const createUnravelBattle = mutation({
  args: {},
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (user) {
      const unravelBattleId = await ctx.db.insert("unravelBattles", {
        playerOneToken: user?.tokenIdentifier,

        playerOneGuesses: [],
        playerTwoGuesses: [],
        gameOver: false,
        gameStart: false,
      });

      return unravelBattleId;
    }

    return null;
  },
});

export const joinUnravelBattle = mutation({
  args: { id: v.id("unravelBattles") },
  handler: async (ctx, args) => {
    const { id } = args;

    const playerTwo = await ctx.auth.getUserIdentity();
    const battle = await ctx.db.get(id);

    if (playerTwo && battle) {
      const startDateTime = new Date();
      const endDateTime = new Date(startDateTime.getTime() + 90 * 1000);

      await ctx.db.patch(id, {
        gameStart: true,
        playerTwoToken: playerTwo.tokenIdentifier,
        wordToGuess: words[Math.floor(Math.random() * words.length)],
        startDateTime: startDateTime.toISOString(),
        playerOnTurnToken:
          Math.random() < 0.5
            ? battle.playerOneToken
            : playerTwo.tokenIdentifier,
        endDateTime: endDateTime.toISOString(),
      });

      return await ctx.db.get(id);
    }

    return null;
  },
});

export const getUnravelBattle = query({
  args: { id: v.id("unravelBattles") },

  handler: async (ctx, args) => {
    const { id } = args;
    const user = await ctx.auth.getUserIdentity();
    const unravelBattle = await ctx.db.get(id);
    let playerOne;
    let playerTwo;

    if (unravelBattle) {
      playerOne = await ctx.db
        .query("users")
        .filter((q) =>
          q.eq(q.field("tokenIdentifier"), unravelBattle.playerOneToken)
        )
        .unique();

      if (unravelBattle.playerTwoToken) {
        playerTwo = await ctx.db
          .query("users")
          .filter((q) =>
            q.eq(q.field("tokenIdentifier"), unravelBattle.playerTwoToken)
          )
          .unique();
      }
    }

    return {
      unravelBattle,
      userToken: user?.tokenIdentifier,
      playerOne,
      playerTwo,
    };
  },
});

export const guessCharacter = mutation({
  args: {
    unravelBattleId: v.id("unravelBattles"),
    guess: v.string(),
  },
  handler: async (ctx, args) => {
    const { unravelBattleId, guess } = args;
    const user = await ctx.auth.getUserIdentity();
    const normalizedGuess = guess.toLowerCase();

    const unravelBattle = await ctx.db.get(unravelBattleId);
    const errorResponse: ResponseObject<string> = {
      statusString: "ERROR",
      statusCode: 500,
      message: "",
    };

    if (
      unravelBattle &&
      unravelBattle.endDateTime &&
      unravelBattle.gameStart &&
      user
    ) {
      // Time's up!
      // if (new Date().toISOString() > listBattle.endDateTime) return null;
      const isPlayerOne = user.tokenIdentifier === unravelBattle.playerOneToken;

      const objString = isPlayerOne ? "playerOneGuesses" : "playerTwoGuesses";
      const opponentString = isPlayerOne
        ? "playerTwoGuesses"
        : "playerOneGuesses";
      if (
        unravelBattle.playerOneGuesses.includes(normalizedGuess) ||
        unravelBattle.playerTwoGuesses.includes(normalizedGuess)
      ) {
        errorResponse.message = "Already Guessed!";
        return errorResponse;
      }

      // if wrong turn
      if (unravelBattle.playerOnTurnToken !== user.tokenIdentifier) {
        errorResponse.message = "It's not your turn.";
        return errorResponse;
      }

      const okResponse: ResponseObject<null> = {
        statusCode: 200,
        statusString: "OK",
        data: null,
        message: "Good guess!",
      };
      const userGuesses = [...unravelBattle[objString], normalizedGuess];
      const allGuesses = [...userGuesses, ...unravelBattle[opponentString]];
      let isWinner = false;
      if (
        unravelBattle.wordToGuess &&
        unravelBattle.wordToGuess.split("").every((c) => allGuesses.includes(c))
      ) {
        isWinner = true;
      }
      await ctx.db.patch(unravelBattle._id, {
        winnerToken: isWinner ? user.tokenIdentifier : undefined,
        playerOnTurnToken:
          unravelBattle.playerOnTurnToken === unravelBattle.playerOneToken
            ? unravelBattle.playerTwoToken
            : unravelBattle.playerOneToken,
        [objString]: userGuesses,
      });

      return okResponse;
    }

    return errorResponse;
  },
});

export const guessWord = mutation({
  args: {
    unravelBattleId: v.id("unravelBattles"),
    guess: v.string(),
  },
  handler: async (ctx, args) => {
    const { unravelBattleId, guess } = args;
    const user = await ctx.auth.getUserIdentity();
    const normalizedGuess = guess.toLowerCase();

    const unravelBattle = await ctx.db.get(unravelBattleId);
    const errorResponse: ResponseObject<string> = {
      statusString: "ERROR",
      statusCode: 500,
      message: "",
    };

    if (
      unravelBattle &&
      unravelBattle.endDateTime &&
      unravelBattle.gameStart &&
      unravelBattle.wordToGuess &&
      user
    ) {
      // Time's up!
      // if (new Date().toISOString() > listBattle.endDateTime) return null;

      // if wrong turn
      if (unravelBattle.playerOnTurnToken !== user.tokenIdentifier) {
        errorResponse.message = "It's not your turn.";
        return errorResponse;
      }

      const okResponse: ResponseObject<null> = {
        statusCode: 200,
        statusString: "OK",
        data: null,
        message: "Good guess!",
      };

      let isWinner = false;
      if (unravelBattle.wordToGuess.toLowerCase() === normalizedGuess) {
        isWinner = true;
      }
      await ctx.db.patch(unravelBattle._id, {
        winnerToken: isWinner ? user.tokenIdentifier : undefined,
        playerOnTurnToken:
          unravelBattle.playerOnTurnToken === unravelBattle.playerOneToken
            ? unravelBattle.playerTwoToken
            : unravelBattle.playerOneToken,
      });

      return okResponse;
    }

    return errorResponse;
  },
});
