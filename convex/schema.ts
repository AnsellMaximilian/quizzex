// NOTE: You can remove this file. Declaring the shape
// of the database is entirely optional in Convex.
// See https://docs.convex.dev/database/schemas.

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema(
  {
    users: defineTable({
      name: v.string(),
      profileUrl: v.optional(v.string()),
      tokenIdentifier: v.string(),
    }).index("by_token", ["tokenIdentifier"]),

    categoryList: defineTable({
      title: v.string(),
      values: v.array(
        v.object({
          value: v.string(),
          points: v.number(),
        })
      ),
    }),

    listBattles: defineTable({
      gameOver: v.boolean(),
      gameStart: v.boolean(),

      playerOneToken: v.string(),
      playerTwoToken: v.optional(v.string()),

      categoryListId: v.optional(v.id("categoryList")),

      startDateTime: v.optional(v.string()),
      endDateTime: v.optional(v.string()),

      playerOneGuesses: v.array(
        v.object({
          value: v.string(),
          points: v.number(),
        })
      ),

      playerTwoGuesses: v.array(
        v.object({
          value: v.string(),
          points: v.number(),
        })
      ),
    })
      .index("gameOpen", [
        "gameOver",
        "playerTwoToken",
        "gameStart",
        "endDateTime",
      ])
      .index("byPlayers", ["playerOneToken", "playerTwoToken"]),

    triviaQuestions: defineTable({
      questionText: v.string(),
      choiceA: v.string(),
      choiceB: v.string(),
      choiceC: v.string(),
      choiceD: v.string(),

      correctChoice: v.string(),
    }),

    triviaBattles: defineTable({
      gameOver: v.boolean(),
      gameStart: v.boolean(),

      playerOneToken: v.string(),
      playerTwoToken: v.optional(v.string()),

      triviaQuestionIds: v.array(v.id("triviaQuestions")),

      startDateTime: v.optional(v.string()),
      endDateTime: v.optional(v.string()),

      playerOneResults: v.array(
        v.object({
          triviaQuestionId: v.id("triviaQuestions"),
          isCorrect: v.boolean(),
        })
      ),

      playerTwoResults: v.array(
        v.object({
          triviaQuestionId: v.id("triviaQuestions"),
          isCorrect: v.boolean(),
        })
      ),
    })
      .index("gameOpen", [
        "gameOver",
        "playerTwoToken",
        "gameStart",
        "endDateTime",
      ])
      .index("byPlayers", ["playerOneToken", "playerTwoToken"]),

    unravelBattles: defineTable({
      gameOver: v.boolean(),
      gameStart: v.boolean(),

      playerOneToken: v.string(),
      playerTwoToken: v.optional(v.string()),

      startDateTime: v.optional(v.string()),
      endDateTime: v.optional(v.string()),

      wordToGuess: v.optional(v.string()),

      playerOnTurnToken: v.optional(v.string()),

      playerOneGuesses: v.array(v.string()),

      playerTwoGuesses: v.array(v.string()),

      winnerToken: v.optional(v.string()),
    })
      .index("gameOpen", [
        "gameOver",
        "playerTwoToken",
        "gameStart",
        "endDateTime",
      ])
      .index("byPlayers", ["playerOneToken", "playerTwoToken"]),
  },
  // If you ever get an error about schema mismatch
  // between your data and your schema, and you cannot
  // change the schema to match the current data in your database,
  // you can:
  //  1. Use the dashboard to delete tables or individual documents
  //     that are causing the error.
  //  2. Change this option to `false` and make changes to the data
  //     freely, ignoring the schema. Don't forget to change back to `true`!
  { schemaValidation: true }
);
