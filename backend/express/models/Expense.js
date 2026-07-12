const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    type: {
      type: String,
      enum: ["toll", "parking", "misc"],
      default: "misc",
    },
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, default: Date.now },
    note: { type: String, trim: true },
  },
  { timestamps: true }
);

expenseSchema.index({ vehicle: 1, date: 1 });

module.exports = mongoose.model("Expense", expenseSchema);
