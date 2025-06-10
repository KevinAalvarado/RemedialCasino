/*
    Campos:
    fullName,
    email,
    password,
    age,
    countryOfResidence
    */

import { Schema, model } from "mongoose";

const customersSchema = new Schema(
    {

        fullName: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
        },

        password: {
            type: String,
            required: true,
        },

        age: {
            type: Number,
            required: true,
        },

        country: {
            type: String,
            required: true,
        },


    },
    {
        timestamps: true,
        strict: false,
    }

);

export default model("Customers", customersSchema);