// NOTE: You can remove this file. Declaring the shape
// of the database is entirely optional in Convex.
// See https://docs.convex.dev/database/schemas.

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema(
  {
    documents: defineTable({
      fieldOne: v.string(),
      fieldTwo: v.object({
        subFieldOne: v.array(v.number()),
      }),
    }),
    // This definition matches the example query and mutation code:
    numbers: defineTable({
      value: v.number(),
    }),

    categoryList: defineTable({
      title: v.string(),
      values: v.array(
        v.object({
          value: v.string(),
          points: v.number(),
        })
      ),
    }),

    categoryValues: defineTable({
      value: v.string(),
      points: v.number(),
      categoryListId: v.id("categoryList"),
    }),

    themes: defineTable({
      name: v.string(),
    }),

    listBattles: defineTable({
      gameOver: v.boolean(),
      gameStart: v.boolean(),

      playerOneToken: v.string(),
      playerTwoToken: v.optional(v.string()),

      categoryListId: v.optional(v.id("categoryList")),

      // playerOnePoints: v.number(),
      // playerTwoPoints: v.number(),
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
    }).index("gameOpen", [
      "gameOver",
      "playerTwoToken",
      "gameStart",
      "endDateTime",
    ]),
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
