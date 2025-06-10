/*
    Campos:
    name,
    category,
    maximumBet,
    minimumBet
    */

import { Schema, model } from "mongoose";

const gamesSchema = new Schema(
    {

        name: {
            type: String,
            require: true,
        },

        category: {
            type: String,
            require: true,
        },

        maximunBet: {
            type: String,
            require: true,
        },

        minimunBet: {
            type: String,
            require: true,
        }
    },
    {
        timestamps: true,
        strict: false,
    }
);

export default model("Games", gamesSchema);